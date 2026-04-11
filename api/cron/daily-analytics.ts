import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '';
const SLACK_WEBHOOK = process.env.SLACK_PULSE_WEBHOOK_URL || '';

async function getAnalyticsClient() {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not set');

  const keyFile = JSON.parse(keyJson);
  const auth = new google.auth.JWT({
    email: keyFile.client_email,
    key: keyFile.private_key,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  return google.analyticsdata({ version: 'v1beta', auth });
}

function today(): string {
  // ET date string
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

async function fetchReport(client: any, dateStr: string) {
  const res = await client.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate: dateStr, endDate: dateStr }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
      ],
    },
  });

  const row = res.data.rows?.[0]?.metricValues || [];
  return {
    pageviews: parseInt(row[0]?.value || '0'),
    activeUsers: parseInt(row[1]?.value || '0'),
    newUsers: parseInt(row[2]?.value || '0'),
    sessions: parseInt(row[3]?.value || '0'),
    avgSessionDuration: parseFloat(row[4]?.value || '0'),
  };
}

async function fetchTopPages(client: any, dateStr: string) {
  const res = await client.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate: dateStr, endDate: dateStr }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 5,
    },
  });

  return (res.data.rows || []).map((r: any) => ({
    page: r.dimensionValues[0].value,
    views: parseInt(r.metricValues[0].value),
  }));
}

async function fetchTopSources(client: any, dateStr: string) {
  const res = await client.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate: dateStr, endDate: dateStr }],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 5,
    },
  });

  return (res.data.rows || []).map((r: any) => ({
    source: r.dimensionValues[0].value || '(direct)',
    sessions: parseInt(r.metricValues[0].value),
  }));
}

async function fetchTopCities(client: any, dateStr: string) {
  const res = await client.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate: dateStr, endDate: dateStr }],
      dimensions: [{ name: 'city' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 5,
    },
  });

  return (res.data.rows || []).map((r: any) => ({
    city: r.dimensionValues[0].value || '(not set)',
    users: parseInt(r.metricValues[0].value),
  }));
}

const MEDIA_SEARCH_TERMS = [
  'Haste NYC',
  'Conform Studio',
  'Premiere Rewind',
  'Jordan Taylor Fuller',
  'hastenyc',
];

async function fetchMediaMentions(): Promise<string | null> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) return null;

  const searchQuery = MEDIA_SEARCH_TERMS.map((t) => `"${t}"`).join(' OR ');

  try {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content:
              'You are a media monitoring assistant. Report only real, verified mentions from the past 24 hours. If you find nothing, say "No mentions found." Be concise -- one bullet per mention with the source name and a brief summary. Do not make up or hallucinate mentions.',
          },
          {
            role: 'user',
            content: `Search for any recent news, social media posts, blog articles, trade publication mentions, or press coverage from the past 24 hours about any of these: ${searchQuery}. These are related to a post-production software company. Include the source/publication name and a one-line summary for each mention found. If a URL is available, include it.`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error('[daily-analytics] Perplexity error:', res.status);
      return null;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content || content.toLowerCase().includes('no mentions found')) return null;
    return content;
  } catch (err: any) {
    console.error('[daily-analytics] Media search error:', err.message);
    return null;
  }
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function buildSlackMessage(
  dateStr: string,
  overview: any,
  topPages: any[],
  topSources: any[],
  topCities: any[],
) {
  const pagesText = topPages.length
    ? topPages.map((p, i) => `${i + 1}. \`${p.page}\` -- ${p.views} views`).join('\n')
    : 'No page data';

  const sourcesText = topSources.length
    ? topSources.map((s, i) => `${i + 1}. ${s.source} -- ${s.sessions} sessions`).join('\n')
    : 'No source data';

  const citiesText = topCities.length
    ? topCities.map((c, i) => `${i + 1}. ${c.city} -- ${c.users} users`).join('\n')
    : 'No city data';

  return {
    text: `Daily Analytics for ${dateStr}`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `Daily Analytics -- ${dateStr}` },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Pageviews*\n${overview.pageviews.toLocaleString()}` },
          { type: 'mrkdwn', text: `*Active Users*\n${overview.activeUsers.toLocaleString()}` },
          { type: 'mrkdwn', text: `*New Users*\n${overview.newUsers.toLocaleString()}` },
          { type: 'mrkdwn', text: `*Sessions*\n${overview.sessions.toLocaleString()}` },
          { type: 'mrkdwn', text: `*Avg Session*\n${formatDuration(overview.avgSessionDuration)}` },
        ],
      },
      { type: 'divider' },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Top Pages*\n${pagesText}` },
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Top Sources*\n${sourcesText}` },
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Top Cities*\n${citiesText}` },
      },
    ],
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify this is called by Vercel Cron (has the authorization header)
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!GA4_PROPERTY_ID || !SLACK_WEBHOOK) {
    return res.status(500).json({ error: 'Missing GA4_PROPERTY_ID or SLACK_PULSE_WEBHOOK_URL' });
  }

  try {
    const client = await getAnalyticsClient();
    const dateStr = today();

    const [overview, topPages, topSources, topCities, mediaMentions] = await Promise.all([
      fetchReport(client, dateStr),
      fetchTopPages(client, dateStr),
      fetchTopSources(client, dateStr),
      fetchTopCities(client, dateStr),
      fetchMediaMentions(),
    ]);

    const message = buildSlackMessage(dateStr, overview, topPages, topSources, topCities);

    const slackRes = await fetch(SLACK_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!slackRes.ok) {
      console.error('[daily-analytics] Slack error:', slackRes.status, await slackRes.text());
      return res.status(500).json({ error: 'Failed to post to Slack' });
    }

    // Post media mentions as a separate message if any were found
    if (mediaMentions) {
      const mediaMessage = {
        text: `Media Mentions -- ${dateStr}`,
        blocks: [
          {
            type: 'header',
            text: { type: 'plain_text', text: `Media Mentions -- ${dateStr}` },
          },
          {
            type: 'section',
            text: { type: 'mrkdwn', text: mediaMentions },
          },
        ],
      };

      const mediaRes = await fetch(SLACK_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mediaMessage),
      });

      if (!mediaRes.ok) {
        console.error('[daily-analytics] Media Slack error:', mediaRes.status);
      }
    }

    res.status(200).json({ success: true, date: dateStr, mediaMentions: !!mediaMentions });
  } catch (err: any) {
    console.error('[daily-analytics] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
