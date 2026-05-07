import type { VercelRequest, VercelResponse } from '@vercel/node';
import { notifyNewUser, notifyConversion, notifyAppSession } from '../lib/slack.js';

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

      default:
        console.log(`[supabase-webhook] Unhandled table: ${table}`);
    }
  } catch (err: any) {
    console.error('[supabase-webhook] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }

  res.status(200).json({ success: true });
}
