import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

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
      console.log('Checkout completed:', {
        sessionId: session.id,
        customerEmail: session.customer_email,
        subscriptionId: session.subscription,
        customerId: session.customer,
      });
      // TODO: Activate subscription in your database
      // e.g. update Supabase user record with subscription status
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
      // TODO: Deactivate subscription in database
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Payment failed:', {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        subscriptionId: invoice.subscription,
      });
      // TODO: Notify user of failed payment
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
