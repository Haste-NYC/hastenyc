// Stripe configuration
// Uses environment variables for sensitive keys

export const stripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  priceMonthly: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || '',
  priceYearly: import.meta.env.VITE_STRIPE_PRICE_YEARLY || '',
} as const;

// Validate that required config is present
export function validateStripeConfig(): boolean {
  return Boolean(
    stripeConfig.publishableKey &&
    stripeConfig.priceMonthly &&
    stripeConfig.priceYearly
  );
}
