import type { VercelRequest, VercelResponse } from '@vercel/node';
import { notifyNewUser, notifyConversion, notifyAppSession } from '../lib/slack.js';

const IGNORED_USERS = new Set(['DEV', 'test-debug@example.com']);

function isIgnoredUser(userId: string): boolean {
  if (IGNORED_USERS.has(userId)) return true;
  if (userId.includes('test') && userId.includes('@example.com')) return true;
  if (userId.endsWith('@conform.studio')) return true;
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
