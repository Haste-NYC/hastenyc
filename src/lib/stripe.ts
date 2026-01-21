import { loadStripe, Stripe } from '@stripe/stripe-js';
import { stripeConfig } from '@/config/stripe';

// Singleton pattern to avoid creating multiple Stripe instances
let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(stripeConfig.publishableKey);
  }
  return stripePromise;
}
