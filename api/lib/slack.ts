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
        text: `:envelope: *New Mailing List Signup*\n*Email:* ${email}${domainLabel}\n*Source:* ${source}`,
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
        text: `:eyes: *Notable Visitor*\n*Company:* ${org}\n*Location:* ${city}, ${region}\n*Page:* ${page}`,
      },
    },
  ], text);
}
