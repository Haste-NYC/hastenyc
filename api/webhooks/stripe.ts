import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
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
      // TODO: Activate subscription in your database
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', {
        subscriptionId: subscription.id,
        status: subscription.status,
        customerId: subscription.customer,
      });
      // TODO: Update subscription status in database
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription cancelled:', {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
      });

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
