import Stripe from 'stripe';

// Initialize Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-05-28.basil',
});

interface CheckoutSessionRequest {
  priceId: string;
  customerEmail: string;
}

interface CheckoutSessionResponse {
  url: string | null;
}

export async function createCheckoutSession(
  priceId: string,
  customerEmail: string
): Promise<CheckoutSessionResponse> {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: customerEmail,
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout`,
  });

  return { url: session.url };
}

// Express handler for use in server.js
export default async function handler(
  req: { method: string; body: CheckoutSessionRequest },
  res: { status: (code: number) => { json: (data: object) => void } }
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { priceId, customerEmail } = req.body as CheckoutSessionRequest;

    if (!priceId || !customerEmail) {
      res.status(400).json({ error: 'Missing priceId or customerEmail' });
      return;
    }

    const result = await createCheckoutSession(priceId, customerEmail);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create checkout session'
    });
  }
}
