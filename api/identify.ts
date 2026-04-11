import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isInterestingOrg } from './lib/ip-filter.js';
import { notifyVisitor } from './lib/slack.js';

// Simple per-instance dedup: skip repeat alerts for the same IP within a day.
// Resets when the function instance is recycled.
const seen = new Map<string, number>();
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function alreadySeen(ip: string): boolean {
  const now = Date.now();
  const lastSeen = seen.get(ip);
  if (lastSeen && now - lastSeen < ONE_DAY_MS) return true;
  seen.set(ip, now);
  // Prune old entries to avoid unbounded growth
  if (seen.size > 10_000) {
    for (const [key, ts] of seen) {
      if (now - ts > ONE_DAY_MS) seen.delete(key);
    }
  }
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
    || req.socket?.remoteAddress
    || '';

  if (!ip || alreadySeen(ip)) {
    return res.status(204).end();
  }

  const token = process.env.IPINFO_TOKEN;
  if (!token) {
    return res.status(204).end();
  }

  try {
    const ipRes = await fetch(`https://ipinfo.io/${ip}?token=${token}`);
    if (!ipRes.ok) {
      return res.status(204).end();
    }

    const data = await ipRes.json();
    const org = data.org as string | undefined;

    if (!isInterestingOrg(org)) {
      return res.status(204).end();
    }

    // Strip the ASN prefix (e.g. "AS12345 The New York Times Company" -> "The New York Times Company")
    const orgName = org!.replace(/^AS\d+\s+/, '');
    const city = data.city || '';
    const region = data.region || '';
    const page = req.body?.path || '/';

    await notifyVisitor(orgName, city, region, page);
  } catch (err: any) {
    console.error('[identify] Error:', err.message);
  }

  res.status(204).end();
}
