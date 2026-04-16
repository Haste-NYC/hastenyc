import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { notifySignup } from '../lib/slack.js';

function buildWelcomeEmailHtml(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#888;">Haste NYC</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#141414;border:1px solid #222;border-radius:16px;padding:40px 32px;text-align:center;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f5f5f5;">Welcome to Conform Studio</h1>
              <p style="margin:0 0 28px;font-size:14px;color:#888;line-height:1.6;">
                Thank you for trying Conform Studio. We built it to make conforming and syncing your edit timelines fast and painless.
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#888;line-height:1.6;">
                Download the app, drop in your project, and let Conform Studio handle the rest. If you have any questions or feedback, reply to this email -- we read everything.
              </p>
              <a href="https://www.haste.nyc/download" style="display:inline-block;background-color:#fff;color:#000;font-size:13px;font-weight:600;text-decoration:none;padding:10px 24px;border-radius:8px;">
                Download Conform Studio
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#555;">
                Conform Studio by <a href="https://www.haste.nyc" style="color:#888;text-decoration:none;">Haste NYC</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

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

  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Insert into mailing list (upsert to handle duplicates gracefully)
  try {
    const { error } = await supabase
      .from('mailing_list')
      .upsert({ email: normalizedEmail, source: signupSource }, { onConflict: 'email' });

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

  // Send welcome email via Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Conform Studio <noreply@conform.studio>',
        replyTo: 'jordan@haste.nyc',
        to: normalizedEmail,
        subject: 'Welcome to Conform Studio',
        html: buildWelcomeEmailHtml(),
      });
    } catch (err: any) {
      console.error('[notify/signup] Resend error:', err.message);
    }
  }

  res.status(200).json({ success: true });
}
