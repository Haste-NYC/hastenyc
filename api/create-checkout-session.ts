import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function getSupabase(): SupabaseClient | null {
  const url = process.env.VITE_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key);
}

// Pick a canonical Stripe customer from a list of duplicates and tag the rest.
// Preference order: customer whose metadata already matches the current
// supabaseUserId, otherwise the most-recent (Stripe returns most-recent first).
async function selectCanonicalCustomer(
  candidates: Stripe.Customer[],
  supabaseUserId: string | undefined,
): Promise<Stripe.Customer> {
  const matchByUser = supabaseUserId
    ? candidates.find((c) => c.metadata?.supabase_user_id === supabaseUserId)
    : undefined;
  const canonical = matchByUser || candidates[0];

  await Promise.all(
    candidates
      .filter((c) => c.id !== canonical.id && !c.metadata?.deduped_into)
      .map((c) =>
        stripe.customers
          .update(c.id, {
            metadata: { ...(c.metadata || {}), deduped_into: canonical.id },
          })
          .catch((err) => {
            console.error(`[checkout] Failed to tag duplicate ${c.id}:`, err.message);
          }),
      ),
  );

  return canonical;
}

// Has any prior subscription ever existed for any of these customers?
// Used to suppress a fresh trial when the same email has trialed before.
async function hasPriorSubscription(customers: Stripe.Customer[]): Promise<boolean> {
  for (const customer of customers) {
    try {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 1,
      });
      if (subs.data.length > 0) return true;
    } catch (err: any) {
      console.error(`[checkout] Failed listing subs for ${customer.id}:`, err.message);
    }
  }
  return false;
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

    const supabase = getSupabase();
    let resolvedEmail: string | undefined = customerEmail;
    let cachedCustomerId: string | undefined;

    // 1. If a Supabase user was passed, fetch their email + cached stripe id.
    if (supabaseUserId && supabase) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, stripe_customer_id')
          .eq('id', supabaseUserId)
          .single();
        if (profile) {
          resolvedEmail = resolvedEmail || profile.email;
          if (profile.stripe_customer_id) {
            try {
              await stripe.customers.retrieve(profile.stripe_customer_id);
              cachedCustomerId = profile.stripe_customer_id;
            } catch {
              // Stale customer id — fall through to email lookup.
            }
          }
        }
      } catch (err: any) {
        console.error('[checkout] Profile lookup error:', err.message);
      }
    }

    // 2. Resolve a single canonical Stripe customer.
    //    Email-based dedup runs unconditionally so that anonymous marketing-site
    //    visitors who paid before signing up don't mint a second Stripe customer
    //    on every checkout. (Sam Stenson, 2026-05-04: two trials, same email.)
    let customerId: string | undefined = cachedCustomerId;
    let allMatchedCustomers: Stripe.Customer[] = [];

    if (resolvedEmail) {
      const matches = await stripe.customers.list({ email: resolvedEmail, limit: 5 });
      allMatchedCustomers = matches.data;

      if (matches.data.length > 0) {
        const canonical = await selectCanonicalCustomer(matches.data, supabaseUserId);
        customerId = customerId || canonical.id;

        if (supabaseUserId && canonical.metadata?.supabase_user_id !== supabaseUserId) {
          try {
            await stripe.customers.update(canonical.id, {
              metadata: { ...(canonical.metadata || {}), supabase_user_id: supabaseUserId },
            });
          } catch (err: any) {
            console.error('[checkout] Failed stamping supabase_user_id:', err.message);
          }
        }
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: resolvedEmail || undefined,
        metadata: supabaseUserId ? { supabase_user_id: supabaseUserId } : {},
      });
      customerId = customer.id;
      allMatchedCustomers = [customer];
    }

    if (supabaseUserId && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', supabaseUserId);
      } catch (err: any) {
        console.error('[checkout] Profile update error:', err.message);
      }
    }

    // 3. Decide trial length. Block fresh trials when this email has
    //    *any* prior subscription history (active, trialing, canceled, …).
    let trialDays: number | undefined = 7;
    if (await hasPriorSubscription(allMatchedCustomers)) {
      trialDays = undefined;
    }

    // Promo codes can extend the trial — only honor that when a trial is
    // actually being granted. NAB90 = 90 days, NAB60 = 60, NAB30 = 30.
    if (trialDays && promoCode && typeof promoCode === 'string') {
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
      customer: customerId,
      ...(trialDays ? { subscription_data: { trial_period_days: trialDays } } : {}),
      metadata: {
        ...(supabaseUserId ? { supabase_user_id: supabaseUserId } : {}),
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('[checkout] Error creating checkout session:', error);
    res.status(500).json({
      error: 'Checkout is temporarily unavailable. Please try again in a few minutes.',
    });
  }
}
