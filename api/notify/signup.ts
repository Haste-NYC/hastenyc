import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { notifySignup } from '../lib/slack.js';

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

  const { email, source } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const signupSource = source || 'unknown';

  // Insert into Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { error } = await supabase
      .from('mailing_list')
      .insert({ email: normalizedEmail, source: signupSource });

    if (error) {
      console.error('[notify/signup] Supabase insert error:', error);
    }
  } catch (err: any) {
    console.error('[notify/signup] Supabase error:', err.message);
  }

  // Send Slack notification (non-blocking for the response)
  try {
    await notifySignup(normalizedEmail, signupSource);
  } catch (err: any) {
    console.error('[notify/signup] Slack error:', err.message);
  }

  res.status(200).json({ success: true });
}
