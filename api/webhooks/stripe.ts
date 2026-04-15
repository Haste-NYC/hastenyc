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

  // Check metadata first (set during checkout linking)
  if (stripeCustomer.metadata?.supabase_user_id) {
    return stripeCustomer.metadata.supabase_user_id;
  }

  // Fall back to email lookup in profiles
  if (stripeCustomer.email) {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', stripeCustomer.email.toLowerCase())
      .single();
    if (data) return data.id;
  }

  return null;
}

// Upsert subscription data into the subscriptions table
async function upsertSubscription(subscription: Stripe.Subscription, userId: string) {
  const supabase = getSupabase();

  const item = subscription.items.data[0];
  const priceId = item?.price?.id || null;

  const record = {
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id,
    stripe_price_id: priceId,
    status: subscription.status,
    current_period_start: subscription.current_period_start
      ? new Date(subscription.current_period_start * 1000).toISOString()
      : null,
    current_period_ends_at: subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null,
    cancel_at_period_end: subscription.cancel_at_period_end,
    trial_start: subscription.trial_start
      ? new Date(subscription.trial_start * 1000).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
  };

  const { error } = await supabase
    .from('subscriptions')
    .upsert(record, { onConflict: 'stripe_subscription_id' });

  if (error) {
    console.error('[Stripe webhook] Subscription upsert error:', error);
  } else {
    console.log(`[Stripe webhook] Upserted subscription ${subscription.id} for user ${userId} (status: ${subscription.status})`);
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

      // Activate subscription in database
      if (session.subscription && session.customer) {
        try {
          const userId = await resolveUserId(session.customer as string);
          if (userId) {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            await upsertSubscription(subscription, userId);
          } else {
            console.warn('[Stripe webhook] Could not resolve Supabase user for customer:', session.customer);
          }
        } catch (e: any) {
          console.error('[Stripe webhook] Failed to activate subscription:', e.message);
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', {
        subscriptionId: subscription.id,
        status: subscription.status,
        customerId: subscription.customer,
      });

      // Update subscription status in database
      try {
        const userId = await resolveUserId(subscription.customer as string);
        if (userId) {
          await upsertSubscription(subscription, userId);
        } else {
          console.warn('[Stripe webhook] Could not resolve Supabase user for customer:', subscription.customer);
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
          await notifySubscription(customer.email || 'unknown', 'subscription', 'cancelled');
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
        subscriptionId: invoice.subscription,
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
