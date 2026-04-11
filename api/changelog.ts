import type { VercelRequest, VercelResponse } from '@vercel/node';

const RELEASES_URL =
  'https://api.github.com/repos/Haste-NYC/haste-conform/releases?per_page=100';

interface ChangeGroup {
  category: string;
  items: string[];
}

interface Release {
  version: string;
  date: string;
  changes: ChangeGroup[];
}

const MAX_ITEMS_PER_CATEGORY = 3;

function cleanDescription(desc: string): string {
  // Capitalize first letter
  return desc.charAt(0).toUpperCase() + desc.slice(1);
}

function parseReleaseBody(body: string): ChangeGroup[] {
  const categories: Record<string, string[]> = {};

  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('- ')) continue;

    const item = trimmed.slice(2);
    const colonIdx = item.indexOf(':');
    if (colonIdx === -1) continue;

    const prefix = item.slice(0, colonIdx).trim().toLowerCase();

    // Only surface user-facing changes: features and fixes
    let category: string;
    if (prefix === 'feat') category = 'Added';
    else if (prefix === 'fix') category = 'Fixed';
    else continue;

    const description = item.slice(colonIdx + 1).trim();
    if (!description || description.startsWith('bump version')) continue;

    if (!categories[category]) categories[category] = [];
    categories[category].push(cleanDescription(description));
  }

  return ['Added', 'Fixed']
    .filter((cat) => categories[cat]?.length)
    .map((cat) => ({
      category: cat,
      items: categories[cat].slice(0, MAX_ITEMS_PER_CATEGORY),
    }));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    };
    if (token) {
      headers.Authorization = `token ${token}`;
    }

    const response = await fetch(RELEASES_URL, { headers });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch releases' });
    }

    const ghReleases: any[] = await response.json();

    const releases: Release[] = ghReleases
      .filter((r: any) => !r.draft && !r.prerelease)
      .map((r: any) => ({
        version: r.tag_name.replace(/^v/, ''),
        date: r.published_at?.slice(0, 10) ?? '',
        changes: parseReleaseBody(r.body ?? ''),
      }))
      .filter((r: Release) => r.changes.length > 0);

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.status(200).json(releases);
  } catch (error) {
    console.error('Error fetching releases:', error);
    res.status(500).json({ error: 'Failed to fetch releases' });
  }
}
