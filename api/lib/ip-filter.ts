// Known ISPs, mobile carriers, and residential providers whose "org" field
// from IPinfo does NOT represent a meaningful company visit.
const ISP_KEYWORDS = [
  'comcast', 'xfinity', 'verizon', 'at&t', 'att ', 'att-', 't-mobile',
  'sprint', 'spectrum', 'charter', 'cox', 'centurylink', 'lumen',
  'frontier', 'windstream', 'mediacom', 'altice', 'optimum',
  'cablevision', 'suddenlink', 'consolidated', 'earthlink',
  'google fiber', 'google llc', 'starlink', 'spacex',
  'cloudflare', 'akamai', 'fastly', 'amazon.com', 'amazonaws',
  'microsoft corp', 'azure', 'digitalocean', 'linode', 'vultr', 'ovh',
  'hetzner', 'choopa', 'cogent', 'level 3', 'zayo', 'hurricane electric',
  'telia', 'ntt ', 'leaseweb', 'rackspace',
  'vpn', 'proxy', 'hosting', 'datacenter', 'data center',
  'mobile', 'wireless', 'cellular', 'broadband', 'telecom',
  'isp', 'internet service',
  'apple inc', // iCloud Private Relay
];

export function isInterestingOrg(org: string | undefined): boolean {
  if (!org) return false;

  const lower = org.toLowerCase();

  // Filter out ASN-only entries (e.g. "AS12345")
  if (/^as\d+$/i.test(org.trim())) return false;

  return !ISP_KEYWORDS.some((keyword) => lower.includes(keyword));
}
