import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { notifySubscription } from '../lib/slack.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const config = {
  api: { bodyParser: false },
};

async function buffer(readable: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function getSupabase() {
  const url = process.env.VITE_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(url, key);
}

// Resolve the Supabase user ID from Stripe customer metadata or email lookup
async function resolveUserId(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null): Promise<string | null> {
  if (!customer) return null;

  const customerId = typeof customer === 'string' ? customer : customer.id;
  const stripeCustomer = typeof customer === 'string'
    ? await stripe.customers.retrieve(customerId)
    : customer;

  if (stripeCustomer.deleted) return null;

  const activeCustomer = stripeCustomer as Stripe.Customer;

  // Check metadata first (set during checkout linking)
  if (activeCustomer.metadata?.supabase_user_id) {
    return activeCustomer.metadata.supabase_user_id;
  }

  // Fall back to email lookup in profiles
  if (activeCustomer.email) {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', activeCustomer.email.toLowerCase())
      .single();
    if (data) return data.id;
  }

  return null;
}

// Build the shared record shape used by both subscription rows and
// pending_subscription_links rows.
function buildSubscriptionRecord(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  return {
    stripe_subscription_id: subscription.id,
    stripe_customer_id: typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id,
    stripe_price_id: item?.price?.id || null,
    status: subscription.status,
    current_period_start: item?.current_period_start
      ? new Date(item.current_period_start * 1000).toISOString()
      : null,
    current_period_ends_at: item?.current_period_end
      ? new Date(item.current_period_end * 1000).toISOString()
      : null,
    cancel_at_period_end: subscription.cancel_at_period_end,
    trial_start: subscription.trial_start
      ? new Date(subscription.trial_start * 1000).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
  };
}

// Upsert subscription data into the subscriptions table.
async function upsertSubscription(subscription: Stripe.Subscription, userId: string) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('subscriptions')
    .upsert(
      { user_id: userId, ...buildSubscriptionRecord(subscription) },
      { onConflict: 'stripe_subscription_id' },
    );

  if (error) {
    console.error('[Stripe webhook] Subscription upsert error:', error);
  } else {
    console.log(`[Stripe webhook] Upserted subscription ${subscription.id} for user ${userId} (status: ${subscription.status})`);
  }
}

// Persist an orphan subscription so that when the customer eventually signs
// up in Supabase with the same email, the auth.users insert trigger can link
// it to their new profile.
async function stashPendingSubscription(
  subscription: Stripe.Subscription,
  email: string | null | undefined,
) {
  if (!email) {
    console.warn('[Stripe webhook] Orphan subscription with no email, dropping:', subscription.id);
    return;
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from('pending_subscription_links')
    .upsert(
      { email: email.toLowerCase(), ...buildSubscriptionRecord(subscription) },
      { onConflict: 'stripe_subscription_id' },
    );

  if (error) {
    console.error('[Stripe webhook] pending_subscription_links upsert error:', error);
  } else {
    console.log(`[Stripe webhook] Queued pending link ${subscription.id} for ${email.toLowerCase()}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;

  try {
    const body = await buffer(req);
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Idempotency + audit log (best-effort; must never block event processing).
  // event_id is the PRIMARY KEY of stripe_webhook_events, so a retried delivery
  // conflicts (Postgres 23505) and we short-circuit to avoid reprocessing.
  try {
    const supabase = getSupabase();
    const { error: auditError } = await supabase
      .from('stripe_webhook_events')
      .insert({ event_id: event.id, event_type: event.type, status: 'received' });
    if (auditError) {
      if ((auditError as { code?: string }).code === '23505') {
        console.log(`[Stripe webhook] Duplicate event ${event.id} (${event.type}); already processed, skipping.`);
        return res.status(200).json({ received: true, duplicate: true });
      }
      console.error('[Stripe webhook] Audit log insert failed (non-fatal):', auditError);
    }
  } catch (e: any) {
    console.error('[Stripe webhook] Audit log threw (non-fatal):', e.message);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_email || session.customer_details?.email || 'unknown';
      console.log('Checkout completed:', {
        sessionId: session.id,
        customerEmail,
        subscriptionId: session.subscription,
        customerId: session.customer,
      });

      // Determine plan description from the session amount
      const amount = session.amount_total;
      const planDesc = amount
        ? `$${(amount / 100).toFixed(0)}/payment`
        : 'subscription';

      try {
        await notifySubscription(customerEmail, planDesc, 'new');
      } catch (e: any) {
        console.error('[Stripe] Failed to send checkout notification:', e.message);
      }

      // Activate subscription in database, or stash for post-signup linking
      if (session.subscription && session.customer) {
        try {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const userId = await resolveUserId(session.customer as string);
          if (userId) {
            await upsertSubscription(subscription, userId);
          } else {
            const sessionEmail = session.customer_details?.email || session.customer_email;
            await stashPendingSubscription(subscription, sessionEmail);
          }
        } catch (e: any) {
          console.error('[Stripe webhook] Failed to activate subscription:', e.message);
        }
      }
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription ${event.type === 'customer.subscription.created' ? 'created' : 'updated'}:`, {
        subscriptionId: subscription.id,
        status: subscription.status,
        customerId: subscription.customer,
      });

      // Update subscription status in database, or stash for post-signup linking
      try {
        const userId = await resolveUserId(subscription.customer as string);
        if (userId) {
          await upsertSubscription(subscription, userId);
        } else {
          const customer = await stripe.customers.retrieve(subscription.customer as string);
          const email = !customer.deleted ? (customer as Stripe.Customer).email : null;
          await stashPendingSubscription(subscription, email);
        }
      } catch (e: any) {
        console.error('[Stripe webhook] Failed to update subscription:', e.message);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription cancelled:', {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
      });

      // Update subscription status to cancelled in database
      try {
        const userId = await resolveUserId(subscription.customer as string);
        if (userId) {
          await upsertSubscription(subscription, userId);
        }
      } catch (e: any) {
        console.error('[Stripe webhook] Failed to update cancelled subscription:', e.message);
      }

      // Retrieve customer email for the notification
      try {
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer && !customer.deleted) {
          await notifySubscription((customer as Stripe.Customer).email || 'unknown', 'subscription', 'cancelled');
        }
      } catch (e: any) {
        console.error('[Stripe] Failed to retrieve customer for cancellation:', e.message);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Payment failed:', {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        subscriptionId: invoice.parent?.subscription_details?.subscription,
      });

      const failedEmail = invoice.customer_email || 'unknown';
      try {
        await notifySubscription(failedEmail, 'invoice payment', 'payment_failed');
      } catch (e: any) {
        console.error('[Stripe] Failed to send payment failure notification:', e.message);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
