import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, customerEmail, supabaseUserId, promoCode } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Missing priceId' });
    }

    // If we have a supabase user ID, look up or create a Stripe Customer
    // with supabase_user_id in metadata.  This gives the webhook handler
    // a direct link instead of relying on email matching.
    let customerId: string | undefined;
    let resolvedEmail = customerEmail;

    if (supabaseUserId) {
      // Look up the user's email from Supabase if not provided
      if (!resolvedEmail) {
        try {
          const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
          if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data: profile } = await supabase
              .from('profiles')
              .select('email, stripe_customer_id')
              .eq('id', supabaseUserId)
              .single();

            if (profile) {
              resolvedEmail = profile.email;
              // Reuse existing Stripe customer if already linked
              if (profile.stripe_customer_id) {
                try {
                  await stripe.customers.retrieve(profile.stripe_customer_id);
                  customerId = profile.stripe_customer_id;
                } catch {
                  // Stale customer ID, will create a new one below
                }
              }
            }
          }
        } catch (err: any) {
          console.error('[checkout] Profile lookup error:', err.message);
        }
      }

      // Create or find a Stripe customer linked to this Supabase user
      if (!customerId) {
        // Search for existing Stripe customer by email first
        if (resolvedEmail) {
          const existing = await stripe.customers.list({
            email: resolvedEmail,
            limit: 1,
          });
          if (existing.data.length > 0) {
            customerId = existing.data[0].id;
            // Ensure metadata is up to date
            await stripe.customers.update(customerId, {
              metadata: { supabase_user_id: supabaseUserId },
            });
          }
        }

        // Still no customer -- create one
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: resolvedEmail || undefined,
            metadata: { supabase_user_id: supabaseUserId },
          });
          customerId = customer.id;
        }

        // Save stripe_customer_id back to Supabase profile
        try {
          const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
          if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            await supabase
              .from('profiles')
              .update({ stripe_customer_id: customerId })
              .eq('id', supabaseUserId);
          }
        } catch (err: any) {
          console.error('[checkout] Profile update error:', err.message);
        }
      }
    }

    // If a promo code was provided, validate it and convert to trial days.
    // NAB90 = 90 days, NAB60 = 60 days, NAB30 = 30 days.
    let trialDays = 7;
    if (promoCode && typeof promoCode === 'string') {
      const promos = await stripe.promotionCodes.list({
        code: promoCode.trim(),
        active: true,
        limit: 1,
      });
      if (promos.data.length === 0) {
        return res.status(400).json({ error: 'Invalid promo code' });
      }
      const couponId = (promos.data[0] as any).promotion?.coupon;
      if (couponId) {
        const coupon = await stripe.coupons.retrieve(couponId);
        if (coupon.percent_off === 100 && coupon.duration_in_months) {
          trialDays = coupon.duration_in_months * 30;
        }
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: false,
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/download?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/#pricing`,
      subscription_data: {
        trial_period_days: trialDays,
      },
      metadata: {
        ...(supabaseUserId ? { supabase_user_id: supabaseUserId } : {}),
      },
    };

    if (customerId) {
      // Use the linked Stripe customer -- webhook gets supabase_user_id
      // from customer metadata for a direct link
      sessionParams.customer = customerId;
    } else if (resolvedEmail) {
      // Fallback: pre-fill email so Stripe creates a customer, but
      // webhook will need to match by email
      sessionParams.customer_email = resolvedEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('[checkout] Error creating checkout session:', error);
    res.status(500).json({
      error: 'Checkout is temporarily unavailable. Please try again in a few minutes.',
    });
  }
}
