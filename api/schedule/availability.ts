import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

const SCHEDULE_TIMEZONE = 'America/New_York';
const SLOT_DURATION_MIN = 30;
const DAY_START_HOUR = 11;
const DAY_END_HOUR = 18;
const BLOCKED_DAYS = [0, 6];
const BUFFER_MINUTES = 30;
const MAX_BOOKINGS_PER_DAY = 5;
const MAX_ADVANCE_DAYS = 30;
const MIN_LEAD_MINUTES = 60;

function generateSlots(_dateStr: string) {
  const slots: string[] = [];
  for (let h = DAY_START_HOUR; h < DAY_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_DURATION_MIN) {
      const endH = m + SLOT_DURATION_MIN >= 60 ? h + 1 : h;
      const endM = (m + SLOT_DURATION_MIN) % 60;
      if (endH > DAY_END_HOUR || (endH === DAY_END_HOUR && endM > 0)) continue;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
}

function nowInTimezone() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SCHEDULE_TIMEZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    hour: parseInt(get('hour')!),
    minute: parseInt(get('minute')!),
  };
}

function slotToUTC(dateStr: string, slotTime: string) {
  const probe = new Date(`${dateStr}T${slotTime}:00`);
  const tzStr = probe.toLocaleString('en-US', { timeZone: SCHEDULE_TIMEZONE, timeZoneName: 'shortOffset' });
  const offsetMatch = tzStr.match(/GMT([+-]\d+)/);
  const offsetHours = offsetMatch ? parseInt(offsetMatch[1]) : -5;
  const offsetStr = `${offsetHours >= 0 ? '+' : '-'}${String(Math.abs(offsetHours)).padStart(2, '0')}:00`;
  return new Date(`${dateStr}T${slotTime}:00${offsetStr}`);
}

function isSlotBusy(dateStr: string, slotTime: string, busyPeriods: Array<{ start: string; end: string }>) {
  const slotStart = slotToUTC(dateStr, slotTime);
  const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MIN * 60 * 1000);

  return busyPeriods.some((busy) => {
    const busyStart = new Date(busy.start);
    const busyEnd = new Date(busy.end);
    const bufferedBusyStart = new Date(busyStart.getTime() - BUFFER_MINUTES * 60 * 1000);
    const bufferedBusyEnd = new Date(busyEnd.getTime() + BUFFER_MINUTES * 60 * 1000);
    return slotStart < bufferedBusyEnd && slotEnd > bufferedBusyStart;
  });
}

async function initCalendar() {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const impersonateEmail = process.env.GOOGLE_IMPERSONATE_EMAIL;
  const calendarName = process.env.GOOGLE_CALENDAR_NAME || 'Work';

  if (!keyJson || !impersonateEmail) {
    return { client: null, calendarId: null };
  }

  const keyFile = JSON.parse(keyJson);
  const auth = new google.auth.JWT({
    email: keyFile.client_email,
    key: keyFile.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
    subject: impersonateEmail,
  });

  const client = google.calendar({ version: 'v3', auth });

  const calList = await client.calendarList.list();
  const match = calList.data.items?.find(
    (c) => c.summary?.toLowerCase() === calendarName.toLowerCase()
  );
  const calendarId = match?.id || 'primary';

  return { client, calendarId };
}

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { client: calendarClient, calendarId: workCalendarId } = await initCalendar();

  if (!calendarClient || !workCalendarId) {
    return res.status(503).json({ error: 'Scheduling not configured' });
  }

  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate || typeof startDate !== 'string' || typeof endDate !== 'string') {
      return res.status(400).json({ error: 'startDate and endDate required' });
    }

    const now = nowInTimezone();
    const todayDate = new Date(`${now.date}T12:00:00`);
    const maxDate = new Date(todayDate);
    maxDate.setDate(maxDate.getDate() + MAX_ADVANCE_DAYS);
    const maxDateStr = maxDate.toLocaleDateString('en-CA', { timeZone: SCHEDULE_TIMEZONE });

    const effectiveStart = startDate < now.date ? now.date : startDate;
    const effectiveEnd = endDate > maxDateStr ? maxDateStr : endDate;

    if (effectiveStart > effectiveEnd) {
      return res.json({ days: [] });
    }

    const timeMinISO = slotToUTC(effectiveStart, '00:00').toISOString();
    const timeMaxISO = slotToUTC(effectiveEnd, '23:59').toISOString();

    const freeBusy = await calendarClient.freebusy.query({
      requestBody: {
        timeMin: timeMinISO,
        timeMax: timeMaxISO,
        timeZone: SCHEDULE_TIMEZONE,
        items: [{ id: workCalendarId }],
      },
    });

    const busyPeriods = freeBusy.data.calendars?.[workCalendarId]?.busy || [];

    let existingEvents: any[] = [];
    try {
      const eventsList = await calendarClient.events.list({
        calendarId: workCalendarId,
        timeMin: timeMinISO,
        timeMax: timeMaxISO,
        singleEvents: true,
        orderBy: 'startTime',
        q: 'Conform Studio | Demo',
      });
      existingEvents = eventsList.data.items || [];
    } catch (_) {
      // If event listing fails, skip the per-day cap
    }

    const bookingsPerDay: Record<string, number> = {};
    for (const evt of existingEvents) {
      const evtDate = evt.start?.dateTime
        ? new Date(evt.start.dateTime).toLocaleDateString('en-CA', { timeZone: SCHEDULE_TIMEZONE })
        : null;
      if (evtDate) {
        bookingsPerDay[evtDate] = (bookingsPerDay[evtDate] || 0) + 1;
      }
    }

    const days: Array<{ date: string; dayLabel: string; slots: string[] }> = [];
    const current = new Date(`${effectiveStart}T12:00:00`);
    const end = new Date(`${effectiveEnd}T12:00:00`);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      const dateStr = current.toLocaleDateString('en-CA', { timeZone: SCHEDULE_TIMEZONE });

      if (!BLOCKED_DAYS.includes(dayOfWeek)) {
        if ((bookingsPerDay[dateStr] || 0) >= MAX_BOOKINGS_PER_DAY) {
          current.setDate(current.getDate() + 1);
          continue;
        }

        const allSlots = generateSlots(dateStr);
        const isTodayET = dateStr === now.date;
        const available = allSlots.filter((slot) => {
          if (isSlotBusy(dateStr, slot, busyPeriods as any)) return false;
          if (isTodayET) {
            const [h, m] = slot.split(':').map(Number);
            const slotMinutes = h * 60 + m;
            const nowMinutes = now.hour * 60 + now.minute;
            if (slotMinutes < nowMinutes + MIN_LEAD_MINUTES) return false;
          }
          return true;
        });

        const dayLabel = current.toLocaleDateString('en-US', {
          weekday: 'long',
          timeZone: SCHEDULE_TIMEZONE,
        });

        days.push({ date: dateStr, dayLabel, slots: available });
      }

      current.setDate(current.getDate() + 1);
    }

    res.json({ days });
  } catch (err: any) {
    console.error('Availability error:', err.message);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
}
