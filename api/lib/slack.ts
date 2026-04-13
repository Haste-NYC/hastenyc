const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'protonmail.com', 'proton.me', 'aol.com', 'mail.com', 'zoho.com',
  'yandex.com', 'gmx.com', 'fastmail.com', 'tutanota.com', 'hey.com',
  'me.com', 'mac.com', 'live.com', 'msn.com', 'comcast.net',
  'verizon.net', 'att.net', 'sbcglobal.net', 'cox.net', 'charter.net',
]);

export function extractCompanyDomain(email: string): string | null {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain || FREE_EMAIL_DOMAINS.has(domain)) return null;
  return domain;
}

function sanitizeMrkdwn(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function postToSlack(blocks: any[], text: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('[Slack] SLACK_WEBHOOK_URL not set, skipping notification');
    return;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, blocks }),
    });
    if (!res.ok) {
      console.error('[Slack] Webhook failed:', res.status, await res.text());
    }
  } catch (err: any) {
    console.error('[Slack] Webhook error:', err.message);
  }
}

export async function notifySignup(email: string, source: string) {
  const domain = extractCompanyDomain(email);
  const domainLabel = domain ? ` (${domain})` : '';
  const text = `New mailing list signup: ${email}${domainLabel}`;

  await postToSlack([
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:envelope: *New Mailing List Signup*\n*Email:* ${sanitizeMrkdwn(email)}${domainLabel}\n*Source:* ${sanitizeMrkdwn(source)}`,
      },
    },
  ], text);
}

export async function notifySubscription(
  email: string,
  planDescription: string,
  eventType: 'new' | 'cancelled' | 'payment_failed',
) {
  const domain = extractCompanyDomain(email);
  const domainLabel = domain ? ` (${domain})` : '';

  const labels: Record<string, { icon: string; title: string }> = {
    new: { icon: ':tada:', title: 'New Subscription' },
    cancelled: { icon: ':wave:', title: 'Subscription Cancelled' },
    payment_failed: { icon: ':warning:', title: 'Payment Failed' },
  };

  const { icon, title } = labels[eventType];
  const text = `${title}: ${email}${domainLabel} -- ${planDescription}`;

  await postToSlack([
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${icon} *${title}*\n*Email:* ${email}${domainLabel}\n*Plan:* ${planDescription}`,
      },
    },
  ], text);
}

export async function notifyBooking(
  name: string,
  email: string,
  company: string | undefined,
  date: string,
  time: string,
) {
  const domain = extractCompanyDomain(email);
  const domainLabel = domain ? ` (${domain})` : '';
  const companyLabel = company ? ` from ${company}` : '';
  const text = `New demo booked: ${name} (${email})${companyLabel} -- ${date} at ${time}`;

  await postToSlack([
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:calendar: *New Demo Booked*\n*Name:* ${name}${companyLabel}\n*Email:* ${email}${domainLabel}\n*When:* ${date} at ${time}`,
      },
    },
  ], text);
}

export async function notifyVisitor(org: string, city: string, region: string, page: string) {
  const text = `Notable visitor from ${org} browsing ${page}`;

  await postToSlack([
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:eyes: *Notable Visitor*\n*Company:* ${sanitizeMrkdwn(org)}\n*Location:* ${sanitizeMrkdwn(city)}, ${sanitizeMrkdwn(region)}\n*Page:* ${sanitizeMrkdwn(page)}`,
      },
    },
  ], text);
}

// --- Haste Pulse notifications (Supabase desktop app events) ---

async function postToPulse(blocks: any[], text: string) {
  const webhookUrl = process.env.SLACK_PULSE_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('[Slack] SLACK_PULSE_WEBHOOK_URL not set, skipping Pulse notification');
    return;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, blocks }),
    });
    if (!res.ok) {
      console.error('[Slack] Pulse webhook failed:', res.status, await res.text());
    }
  } catch (err: any) {
    console.error('[Slack] Pulse webhook error:', err.message);
  }
}

export async function notifyNewUser(email: string, displayName: string | null, company: string | null) {
  const domain = extractCompanyDomain(email);
  const domainLabel = domain ? ` (${sanitizeMrkdwn(domain)})` : '';
  const nameLabel = displayName ? sanitizeMrkdwn(displayName) : 'Unknown';
  const companyLabel = company ? `\n*Company:* ${sanitizeMrkdwn(company)}` : '';
  const text = `New Conform Studio user: ${email}`;

  await postToPulse([
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:new: *New Conform Studio User*\n*Name:* ${nameLabel}\n*Email:* ${sanitizeMrkdwn(email)}${domainLabel}${companyLabel}`,
      },
    },
  ], text);
}

export async function notifyConversion(
  userEmail: string,
  projectName: string,
  sourceApp: string,
  targetApp: string,
  totalClips: number | null,
  totalSequences: number | null,
  durationSeconds: number | null,
  success: boolean,
) {
  const domain = extractCompanyDomain(userEmail);
  const domainLabel = domain ? ` (${sanitizeMrkdwn(domain)})` : '';
  const icon = success ? ':white_check_mark:' : ':x:';
  const status = success ? 'Successful' : 'Failed';
  const durationLabel = durationSeconds != null
    ? `\n*Duration:* ${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`
    : '';
  const clipsLabel = totalClips != null ? `\n*Clips:* ${totalClips.toLocaleString()}` : '';
  const seqLabel = totalSequences != null ? `\n*Sequences:* ${totalSequences}` : '';
  const text = `${status} conversion: ${projectName} (${sourceApp} -> ${targetApp})`;

  await postToPulse([
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${icon} *${status} Conversion*\n*User:* ${sanitizeMrkdwn(userEmail)}${domainLabel}\n*Project:* ${sanitizeMrkdwn(projectName)}\n*Workflow:* ${sanitizeMrkdwn(sourceApp)} -> ${sanitizeMrkdwn(targetApp)}${seqLabel}${clipsLabel}${durationLabel}`,
      },
    },
  ], text);
}

export async function notifyAppSession(
  userEmail: string,
  appVersion: string,
  osName: string,
) {
  const domain = extractCompanyDomain(userEmail);
  const domainLabel = domain ? ` (${sanitizeMrkdwn(domain)})` : '';
  const text = `Conform Studio session: ${userEmail} on v${appVersion}`;

  await postToPulse([
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:desktop_computer: *App Session Started*\n*User:* ${sanitizeMrkdwn(userEmail)}${domainLabel}\n*Version:* ${sanitizeMrkdwn(appVersion)}\n*OS:* ${sanitizeMrkdwn(osName)}`,
      },
    },
  ], text);
}
