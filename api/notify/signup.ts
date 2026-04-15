import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { notifySignup } from '../lib/slack.js';
import crypto from 'crypto';

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

  // Insert into mailing list (existing behavior)
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

  // Create a Supabase auth account so the user has a profile row
  // that webhooks and the app can match against.  If the user later
  // signs in via OAuth with the same email, Supabase merges the
  // identity automatically.
  let supabaseUserId: string | null = null;
  let isNewUser = false;
  try {
    // Try to create the user first. If they already exist, look them up.
    const randomPassword = crypto.randomBytes(32).toString('base64url');
    const { data: newUser, error: signupError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password: randomPassword,
      email_confirm: true, // auto-confirm so profile trigger fires
      user_metadata: { signup_source: signupSource },
    });

    if (!signupError && newUser?.user) {
      supabaseUserId = newUser.user.id;
      isNewUser = true;
      console.log(`[notify/signup] Created auth user: ${supabaseUserId}`);
    } else if (signupError?.message?.includes('already been registered')) {
      // User exists -- look up by email directly
      const { data } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', normalizedEmail)
        .single();

      if (data) {
        supabaseUserId = data.id;
        console.log(`[notify/signup] Existing auth user found: ${supabaseUserId}`);
      }
    } else if (signupError) {
      console.error('[notify/signup] Auth signup error:', signupError);
    }
  } catch (err: any) {
    console.error('[notify/signup] Auth account creation error:', err.message);
  }

  // Send Slack notification (non-blocking for the response)
  try {
    await notifySignup(normalizedEmail, signupSource);
  } catch (err: any) {
    console.error('[notify/signup] Slack error:', err.message);
  }

  // Send welcome email via Resend (only for new signups)
  if (isNewUser) {
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Conform Studio <noreply@conform.studio>',
          to: normalizedEmail,
          subject: 'Welcome to Conform Studio',
          html: buildWelcomeEmailHtml(),
        });
      } catch (err: any) {
        console.error('[notify/signup] Resend error:', err.message);
      }
    }
  }

  res.status(200).json({ success: true, user_id: supabaseUserId });
}
