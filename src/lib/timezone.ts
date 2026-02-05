// The server operates in this timezone for scheduling
const SERVER_TIMEZONE = 'America/New_York';

/**
 * Get the user's IANA timezone string (e.g., "America/Los_Angeles").
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Get a short abbreviation for the user's current timezone (e.g., "PST", "EST").
 */
export function getUserTimezoneAbbr(): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(new Date());
  return parts.find((p) => p.type === 'timeZoneName')?.value || 'Local';
}

/**
 * Get a friendly display name for the user's timezone.
 */
export function getUserTimezoneName(): string {
  const tz = getUserTimezone();
  const names: Record<string, string> = {
    'America/New_York': 'Eastern Time',
    'America/Chicago': 'Central Time',
    'America/Denver': 'Mountain Time',
    'America/Los_Angeles': 'Pacific Time',
    'America/Anchorage': 'Alaska Time',
    'Pacific/Honolulu': 'Hawaii Time',
  };
  return names[tz] || tz.split('/').pop()?.replace(/_/g, ' ') || 'Local Time';
}

/**
 * Convert a slot time from the server timezone (ET) to the user's local timezone.
 * @param dateStr - YYYY-MM-DD date string (in server timezone)
 * @param slotTime - HH:mm time string (in server timezone)
 * @returns Formatted time in the user's local timezone (e.g., "2:30 PM")
 */
export function convertSlotToLocal(dateStr: string, slotTime: string): string {
  // Determine the UTC offset for the server timezone on this specific date
  const probe = new Date(`${dateStr}T12:00:00Z`);
  const tzStr = probe.toLocaleString('en-US', {
    timeZone: SERVER_TIMEZONE,
    timeZoneName: 'shortOffset',
  });
  const offsetMatch = tzStr.match(/GMT([+-]\d+)/);
  const offsetHours = offsetMatch ? parseInt(offsetMatch[1]) : -5;

  const sign = offsetHours >= 0 ? '+' : '-';
  const absOffset = Math.abs(offsetHours);
  const offsetStr = `${sign}${String(absOffset).padStart(2, '0')}:00`;

  // Build a proper ISO string so Date parses it as the correct UTC instant
  const utcDate = new Date(`${dateStr}T${slotTime}:00${offsetStr}`);

  // Format in the user's local timezone
  return utcDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
