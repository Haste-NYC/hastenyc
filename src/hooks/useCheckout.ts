import { useState } from 'react';
import { toast } from 'sonner';

const USER_ID_KEY = 'conform_studio_user_id';

interface CheckoutParams {
  priceId: string;
  customerEmail?: string;
}

interface UseCheckoutReturn {
  isLoading: boolean;
  error: string | null;
  startCheckout: (params: CheckoutParams) => Promise<boolean>;
}

const API_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || '')
  : '';

export function useCheckout(): UseCheckoutReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async ({ priceId, customerEmail }: CheckoutParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Include the Supabase user ID if available (set during download email entry)
      const supabaseUserId = localStorage.getItem(USER_ID_KEY) || undefined;

      const response = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          ...(customerEmail ? { customerEmail } : {}),
          ...(supabaseUserId ? { supabaseUserId } : {}),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
        return true;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, startCheckout };
}
