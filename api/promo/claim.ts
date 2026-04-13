import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { notifySignup } from '../lib/slack.js';

const PROMO_CODE = 'NAB90';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function buildEmailHtml(code: string): string {
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
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f5f5f5;">Your 90-Day Free Trial</h1>
              <p style="margin:0 0 28px;font-size:14px;color:#888;line-height:1.6;">
                Thanks for your interest in Conform Studio. Here's your coupon code for 90 days completely free.
              </p>
              <div style="background-color:#1a1a1a;border:1px dashed #333;border-radius:8px;padding:16px 24px;margin-bottom:28px;">
                <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#666;">Coupon Code</p>
                <p style="margin:0;font-size:28px;font-weight:700;letter-spacing:3px;color:#fff;">${code}</p>
              </div>
              <p style="margin:0 0 24px;font-size:13px;color:#888;line-height:1.6;">
                Apply this code at checkout when you subscribe to any Conform Studio plan. The first 3 months are on us.
              </p>
              <a href="https://www.haste.nyc/download?ref=promo" style="display:inline-block;background-color:#fff;color:#000;font-size:13px;font-weight:600;text-decoration:none;padding:10px 24px;border-radius:8px;">
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Store in Supabase mailing list
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('mailing_list').insert({
        email: normalizedEmail,
        source: 'business-card-promo',
      });
    } catch (err: any) {
      console.error('[promo/claim] Supabase error:', err.message);
    }
  }

  // Send coupon email via Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Conform Studio <noreply@conform.studio>',
        to: normalizedEmail,
        subject: 'Your 90-Day Conform Studio Coupon',
        html: buildEmailHtml(PROMO_CODE),
      });
    } catch (err: any) {
      console.error('[promo/claim] Resend error:', err.message);
      // Don't fail the request -- the user still gets the success screen
    }
  } else {
    console.warn('[promo/claim] RESEND_API_KEY not set, skipping email');
  }

  // Slack notification
  try {
    await notifySignup(normalizedEmail, 'business-card-promo');
  } catch (err: any) {
    console.error('[promo/claim] Slack error:', err.message);
  }

  res.status(200).json({ success: true });
}
