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

type DuplicateSubRef = {
  customer: string;
  subscription: string;
  status: string;
  amount_cents: number | null;
  interval: string | null;
  trial_end: number | null;
};

type DuplicateSubGroup = {
  email: string;
  active_subs: DuplicateSubRef[];
};

function formatDupSub(ref: DuplicateSubRef): string {
  const amount = ref.amount_cents != null ? `$${(ref.amount_cents / 100).toFixed(2)}` : '?';
  const interval = ref.interval || '?';
  const trial = ref.trial_end ? ` (trial → ${new Date(ref.trial_end * 1000).toISOString().slice(0, 10)})` : '';
  return `\`${ref.subscription}\` ${ref.status} ${amount}/${interval}${trial} on \`${ref.customer}\``;
}

export async function notifyDuplicateSubs(groups: DuplicateSubGroup[]) {
  if (groups.length === 0) return;

  const lines = groups
    .map((g) => {
      const subs = g.active_subs.map((s) => `    - ${formatDupSub(s)}`).join('\n');
      return `*${sanitizeMrkdwn(g.email)}* (${g.active_subs.length} active subs):\n${subs}`;
    })
    .join('\n\n');

  const text = `Duplicate Stripe subscriptions detected for ${groups.length} email(s)`;

  await postToSlack([
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:rotating_light: *Duplicate Stripe subscriptions detected*\n${lines}\n\n_Tag the duplicate customer with \`metadata.deduped_into\` once resolved to silence future alerts._`,
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

export async function notifyAuthSignin(
  email: string,
  userMeta: Record<string, unknown> | null | undefined,
  userAgent: string | null,
) {
  const domain = extractCompanyDomain(email);
  const domainLabel = domain ? ` (${sanitizeMrkdwn(domain)})` : '';
  const meta = userMeta || {};
  const rawName = (meta.display_name || meta.full_name || meta.name || '') as string;
  const nameLabel = rawName
    ? `\n*Name:* ${sanitizeMrkdwn(String(rawName).slice(0, 80))}`
    : '';
  const provider = (meta.provider || meta.iss || '') as string;
  const providerLabel = provider
    ? `\n*Provider:* ${sanitizeMrkdwn(String(provider).slice(0, 40))}`
    : '';
  const uaLabel = userAgent
    ? `\n*Client:* ${sanitizeMrkdwn(userAgent.slice(0, 120))}`
    : '';
  const text = `Conform Studio sign-in: ${email}`;

  await postToPulse([
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:key: *Desktop Sign-In*\n*User:* ${sanitizeMrkdwn(email)}${domainLabel}${nameLabel}${providerLabel}${uaLabel}`,
      },
    },
  ], text);
}
