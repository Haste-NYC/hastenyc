import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  notifyNewUser,
  notifyConversion,
  notifyAppSession,
  notifyAuthSignin,
} from '../lib/slack.js';

const IGNORED_USERS = new Set(['test-debug@example.com']);
const INTERNAL_DOMAINS = new Set(['haste.nyc', 'conform.studio']);

function isIgnoredUser(userId: string): boolean {
  const id = userId.trim().toLowerCase();
  if (!id) return true;
  if (id === 'dev') return true;
  if (IGNORED_USERS.has(id)) return true;
  if (id.includes('test') && id.includes('@example.com')) return true;
  const domain = id.split('@')[1];
  if (domain && INTERNAL_DOMAINS.has(domain)) return true;
  return false;
}

// Per-instance dedup for sign-in alerts: at most one per email per 24h.
// Resets when the function instance is recycled; light noise on cold-start scale-out is acceptable.
const seenSignin = new Map<string, number>();
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function alreadySigninAlertedToday(email: string): boolean {
  const now = Date.now();
  const last = seenSignin.get(email);
  if (last && now - last < ONE_DAY_MS) return true;
  seenSignin.set(email, now);
  if (seenSignin.size > 10_000) {
    for (const [k, ts] of seenSignin) {
      if (now - ts > ONE_DAY_MS) seenSignin.delete(k);
    }
  }
  return false;
}

let cachedSupabase: SupabaseClient | null = null;
function getSupabaseAdmin(): SupabaseClient | null {
  if (cachedSupabase) return cachedSupabase;
  const url = process.env.VITE_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  cachedSupabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cachedSupabase;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify shared secret
  const secret = req.headers['x-supabase-webhook-secret'];
  const expectedSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { type, table, record } = req.body || {};

  if (type !== 'INSERT' || !record) {
    return res.status(200).json({ skipped: true });
  }

  try {
    switch (table) {
      case 'profiles': {
        const email = record.email || '';
        if (isIgnoredUser(email)) break;
        await notifyNewUser(email, record.display_name, record.company);
        break;
      }

      case 'usage_conversions': {
        const userId = record.user_id || '';
        if (isIgnoredUser(userId)) break;
        await notifyConversion(
          userId,
          record.project_name || 'Unknown project',
          record.source_app || '?',
          record.target_app || '?',
          record.total_clips,
          record.total_sequences,
          record.processing_duration_seconds,
          record.success ?? true,
        );
        break;
      }

      case 'usage_sessions': {
        const userId = record.user_id || '';
        if (isIgnoredUser(userId)) break;
        await notifyAppSession(
          userId,
          record.app_version || 'unknown',
          record.os_name || 'unknown',
        );
        break;
      }

      case 'auth_signin': {
        const userId = record.user_id;
        if (!userId) break;
        const sb = getSupabaseAdmin();
        if (!sb) {
          console.warn('[supabase-webhook] auth_signin: Supabase admin client unavailable');
          break;
        }
        const { data, error } = await sb.auth.admin.getUserById(userId);
        if (error || !data?.user) {
          console.warn('[supabase-webhook] auth_signin: user lookup failed', error?.message);
          break;
        }
        const email = data.user.email || '';
        if (isIgnoredUser(email)) break;
        if (alreadySigninAlertedToday(email)) break;
        await notifyAuthSignin(
          email,
          data.user.user_metadata as Record<string, unknown> | null,
          record.user_agent || null,
        );
        break;
      }

      default:
        console.log(`[supabase-webhook] Unhandled table: ${table}`);
    }
  } catch (err: any) {
    console.error('[supabase-webhook] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }

  res.status(200).json({ success: true });
}
