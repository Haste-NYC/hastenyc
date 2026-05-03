import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';

type CheckResult = {
  name: string;
  ok: boolean;
  detail?: string;
};

async function checkStripe(): Promise<CheckResult> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { name: 'Stripe', ok: false, detail: 'STRIPE_SECRET_KEY missing' };
  try {
    const stripe = new Stripe(key, { apiVersion: '2025-12-15.clover' });
    await stripe.balance.retrieve();
    return { name: 'Stripe', ok: true };
  } catch (err: any) {
    return { name: 'Stripe', ok: false, detail: err.message };
  }
}

async function checkSupabase(): Promise<CheckResult> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { name: 'Supabase', ok: false, detail: 'URL or service role key missing' };
  try {
    const sb = createClient(url, key);
    const { error } = await sb.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (error) throw error;
    return { name: 'Supabase', ok: true };
  } catch (err: any) {
    return { name: 'Supabase', ok: false, detail: err.message };
  }
}

async function checkResend(): Promise<CheckResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { name: 'Resend', ok: false, detail: 'RESEND_API_KEY missing' };
  try {
    const res = await fetch('https://api.resend.com/api-keys', {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      const body = await res.text();
      return { name: 'Resend', ok: false, detail: `${res.status} ${body.slice(0, 120)}` };
    }
    return { name: 'Resend', ok: true };
  } catch (err: any) {
    return { name: 'Resend', ok: false, detail: err.message };
  }
}

async function checkGitHub(): Promise<CheckResult> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { name: 'GitHub', ok: false, detail: 'GITHUB_TOKEN missing' };
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'haste-key-check',
        Accept: 'application/vnd.github+json',
      },
    });
    if (!res.ok) return { name: 'GitHub', ok: false, detail: `HTTP ${res.status}` };
    return { name: 'GitHub', ok: true };
  } catch (err: any) {
    return { name: 'GitHub', ok: false, detail: err.message };
  }
}

async function checkIpInfo(): Promise<CheckResult> {
  const token = process.env.IPINFO_TOKEN;
  if (!token) return { name: 'IPInfo', ok: false, detail: 'IPINFO_TOKEN missing' };
  try {
    const res = await fetch(`https://ipinfo.io/8.8.8.8?token=${encodeURIComponent(token)}`);
    if (!res.ok) return { name: 'IPInfo', ok: false, detail: `HTTP ${res.status}` };
    return { name: 'IPInfo', ok: true };
  } catch (err: any) {
    return { name: 'IPInfo', ok: false, detail: err.message };
  }
}

async function checkMux(): Promise<CheckResult> {
  const id = process.env.MUX_TOKEN_ID;
  const secret = process.env.MUX_TOKEN_SECRET;
  if (!id || !secret) return { name: 'Mux', ok: false, detail: 'MUX_TOKEN_ID or MUX_TOKEN_SECRET missing' };
  try {
    const auth = Buffer.from(`${id}:${secret}`).toString('base64');
    const res = await fetch('https://api.mux.com/video/v1/assets?limit=1', {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!res.ok) return { name: 'Mux', ok: false, detail: `HTTP ${res.status}` };
    return { name: 'Mux', ok: true };
  } catch (err: any) {
    return { name: 'Mux', ok: false, detail: err.message };
  }
}

async function checkGoogleServiceAccount(): Promise<CheckResult> {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) return { name: 'Google Service Account', ok: false, detail: 'GOOGLE_SERVICE_ACCOUNT_KEY missing' };
  try {
    const keyFile = JSON.parse(keyJson);
    const auth = new google.auth.JWT({
      email: keyFile.client_email,
      key: keyFile.private_key,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
    await auth.authorize();
    return { name: 'Google Service Account', ok: true };
  } catch (err: any) {
    return { name: 'Google Service Account', ok: false, detail: err.message };
  }
}

async function postFailureToSlack(failures: CheckResult[]) {
  const url = process.env.SLACK_PULSE_WEBHOOK_URL;
  if (!url) {
    console.warn('[check-api-keys] SLACK_PULSE_WEBHOOK_URL not set, cannot alert');
    return;
  }
  const lines = failures.map((f) => `• *${f.name}*: ${f.detail ?? 'check failed'}`).join('\n');
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `API key health check failed (${failures.length} failing)`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `:rotating_light: *API key health check failed*\n${lines}\n\n_Check Vercel env vars and rotate as needed._`,
            },
          },
        ],
      }),
    });
  } catch (err: any) {
    console.error('[check-api-keys] Slack post failed:', err.message);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const results = await Promise.all([
    checkStripe(),
    checkSupabase(),
    checkResend(),
    checkGitHub(),
    checkIpInfo(),
    checkMux(),
    checkGoogleServiceAccount(),
  ]);

  const failures = results.filter((r) => !r.ok);
  if (failures.length > 0) {
    console.error('[check-api-keys] Failures:', failures);
    await postFailureToSlack(failures);
  }

  res.status(failures.length === 0 ? 200 : 503).json({
    ok: failures.length === 0,
    checked: results.length,
    failed: failures.length,
    results,
  });
}
