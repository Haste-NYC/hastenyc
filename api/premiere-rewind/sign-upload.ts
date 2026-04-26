import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

const BUCKET = 'project-files-private';
const MAX_BYTES = 200 * 1024 * 1024;

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-]/g, '_').slice(0, 200);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, fileName, fileSize, premiereVersion } = req.body || {};

  if (!email || typeof email !== 'string') return res.status(400).json({ error: 'email is required' });
  if (!fileName || typeof fileName !== 'string') return res.status(400).json({ error: 'fileName is required' });
  if (typeof fileSize !== 'number' || fileSize <= 0) return res.status(400).json({ error: 'fileSize must be a positive number' });
  if (fileSize > MAX_BYTES) return res.status(413).json({ error: 'file too large' });
  if (!/\.prproj$/i.test(fileName)) return res.status(400).json({ error: 'only .prproj files allowed' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const normalizedEmail = email.trim().toLowerCase();
  if (!emailRegex.test(normalizedEmail)) return res.status(400).json({ error: 'invalid email' });

  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !supabaseKey) {
    console.error('[sign-upload] storage env vars missing');
    return res.status(500).json({ error: 'storage not configured' });
  }

  const emailHash = crypto.createHash('sha256').update(normalizedEmail).digest('hex').slice(0, 16);
  const timestamp = Date.now();
  const safeName = sanitizeName(fileName);
  const path = `web-anon/${emailHash}/${timestamp}_${safeName}`;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);

  if (error || !data) {
    console.error('[sign-upload] createSignedUploadUrl error:', error);
    return res.status(500).json({ error: 'failed to create upload URL' });
  }

  res.status(200).json({ path: data.path, token: data.token });
}
