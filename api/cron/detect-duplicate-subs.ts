import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { notifyDuplicateSubs } from '../lib/slack.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

type DupSubRef = {
  customer: string;
  subscription: string;
  status: string;
  amount_cents: number | null;
  interval: string | null;
  trial_end: number | null;
};

type DupGroup = {
  email: string;
  active_subs: DupSubRef[];
};

// Walk every Stripe customer and group by lowercased email. Customers already
// tagged with metadata.deduped_into are skipped — they're known cleanups.
async function findDuplicateActiveGroups(): Promise<DupGroup[]> {
  const byEmail = new Map<string, Stripe.Customer[]>();

  let starting_after: string | undefined;
  for (;;) {
    const page: Stripe.ApiList<Stripe.Customer> = await stripe.customers.list({
      limit: 100,
      ...(starting_after ? { starting_after } : {}),
    });
    for (const c of page.data) {
      if (c.metadata?.deduped_into) continue;
      const email = (c.email || '').toLowerCase().trim();
      if (!email) continue;
      const list = byEmail.get(email) || [];
      list.push(c);
      byEmail.set(email, list);
    }
    if (!page.has_more) break;
    starting_after = page.data[page.data.length - 1]?.id;
    if (!starting_after) break;
  }

  const groups: DupGroup[] = [];
  for (const [email, customers] of byEmail) {
    if (customers.length < 2) continue;

    const active: DupSubRef[] = [];
    for (const customer of customers) {
      try {
        const subs = await stripe.subscriptions.list({
          customer: customer.id,
          status: 'all',
          limit: 10,
        });
        for (const s of subs.data) {
          if (s.status !== 'active' && s.status !== 'trialing') continue;
          const item = s.items.data[0];
          active.push({
            customer: customer.id,
            subscription: s.id,
            status: s.status,
            amount_cents: item?.price?.unit_amount ?? null,
            interval: item?.price?.recurring?.interval ?? null,
            trial_end: s.trial_end ?? null,
          });
        }
      } catch (err: any) {
        console.error(`[detect-duplicate-subs] subs.list failed for ${customer.id}:`, err.message);
      }
    }

    if (active.length > 1) {
      groups.push({ email, active_subs: active });
    }
  }

  return groups;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const groups = await findDuplicateActiveGroups();
    if (groups.length > 0) {
      console.warn(`[detect-duplicate-subs] Found ${groups.length} duplicate-active group(s):`, groups);
      await notifyDuplicateSubs(groups);
    } else {
      console.log('[detect-duplicate-subs] No duplicate active subscriptions detected.');
    }
    res.status(200).json({
      ok: true,
      duplicate_groups: groups.length,
      details: groups,
    });
  } catch (err: any) {
    console.error('[detect-duplicate-subs] Error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
}
