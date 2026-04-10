import type { VercelRequest, VercelResponse } from '@vercel/node';

const CHANGELOG_URL =
  'https://raw.githubusercontent.com/Haste-NYC/haste-conform/main/CHANGELOG.md';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = token
      ? { Authorization: `token ${token}` }
      : {};

    const response = await fetch(CHANGELOG_URL, { headers });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch changelog' });
    }

    const text = await response.text();

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.status(200).send(text);
  } catch (error) {
    console.error('Error fetching changelog:', error);
    res.status(500).json({ error: 'Failed to fetch changelog' });
  }
}
