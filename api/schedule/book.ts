import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { notifyBooking } from '../lib/slack.js';

const SCHEDULE_TIMEZONE = 'America/New_York';
const SLOT_DURATION_MIN = 30;
const DAY_START_HOUR = 11;
const DAY_END_HOUR = 18;
const BUFFER_MINUTES = 30;
const MAX_BOOKINGS_PER_DAY = 5;
const MIN_LEAD_MINUTES = 60;

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { client: calendarClient, calendarId: workCalendarId } = await initCalendar();

  if (!calendarClient || !workCalendarId) {
    return res.status(503).json({ error: 'Scheduling not configured' });
  }

  try {
    const { date, time, name, email, company, notes } = req.body;

    if (!date || !time || !name || !email) {
      return res.status(400).json({ error: 'date, time, name, and email are required' });
    }

    // Build start/end times
    const startDateTime = `${date}T${time}:00`;
    const endMinutes = parseInt(time.split(':')[1]) + SLOT_DURATION_MIN;
    const endHour = parseInt(time.split(':')[0]) + Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
    const endDateTime = `${date}T${endTime}:00`;

    // Enforce minimum lead time
    const now = nowInTimezone();
    const isTodayET = date === now.date;
    if (isTodayET) {
      const [slotH, slotM] = time.split(':').map(Number);
      const slotMinutes = slotH * 60 + slotM;
      const nowMinutes = now.hour * 60 + now.minute;
      if (slotMinutes < nowMinutes + MIN_LEAD_MINUTES) {
        return res.status(400).json({ error: 'Must book at least 1 hour in advance' });
      }
    }

    // Enforce max bookings per day
    try {
      const dayStart = slotToUTC(date, `${String(DAY_START_HOUR).padStart(2, '0')}:00`).toISOString();
      const dayEnd = slotToUTC(date, `${String(DAY_END_HOUR).padStart(2, '0')}:00`).toISOString();
      const dayEvents = await calendarClient.events.list({
        calendarId: workCalendarId,
        timeMin: dayStart,
        timeMax: dayEnd,
        singleEvents: true,
        q: 'Conform Studio | Demo',
      });
      if ((dayEvents.data.items || []).length >= MAX_BOOKINGS_PER_DAY) {
        return res.status(409).json({ error: 'Maximum bookings reached for this day' });
      }
    } catch (_) {
      // If check fails, continue with booking
    }

    // Re-verify slot is free (race condition guard, includes buffer)
    const bufferStart = new Date(slotToUTC(date, time).getTime() - BUFFER_MINUTES * 60 * 1000);
    const bufferEnd = new Date(slotToUTC(date, endTime).getTime() + BUFFER_MINUTES * 60 * 1000);
    const freeBusy = await calendarClient.freebusy.query({
      requestBody: {
        timeMin: bufferStart.toISOString(),
        timeMax: bufferEnd.toISOString(),
        timeZone: SCHEDULE_TIMEZONE,
        items: [{ id: workCalendarId }],
      },
    });

    const conflicts = freeBusy.data.calendars?.[workCalendarId]?.busy || [];
    if (conflicts.length > 0) {
      return res.status(409).json({ error: 'This time slot is no longer available' });
    }

    // Build description
    const descParts = [`Scheduled by: ${name} (${email})`];
    if (company) descParts.push(`Company: ${company}`);
    if (notes) descParts.push(`Notes: ${notes}`);

    // Create event with Google Meet
    const event = await calendarClient.events.insert({
      calendarId: workCalendarId,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      requestBody: {
        summary: `Conform Studio | Demo - ${name}`,
        description: descParts.join('\n'),
        start: { dateTime: startDateTime, timeZone: SCHEDULE_TIMEZONE },
        end: { dateTime: endDateTime, timeZone: SCHEDULE_TIMEZONE },
        attendees: [
          { email: process.env.GOOGLE_IMPERSONATE_EMAIL },
          { email },
        ],
        conferenceData: {
          createRequest: {
            requestId: `conform-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    const meetLink = event.data.conferenceData?.entryPoints?.find(
      (e) => e.entryPointType === 'video'
    )?.uri;

    // Send Slack notification (non-blocking for the response)
    try {
      await notifyBooking(name, email, company, date, time);
    } catch (e: any) {
      console.error('[book] Slack notification error:', e.message);
    }

    res.json({
      success: true,
      eventId: event.data.id,
      meetLink: meetLink || null,
      startTime: event.data.start?.dateTime,
      endTime: event.data.end?.dateTime,
    });
  } catch (err: any) {
    console.error('Booking error:', err.message);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
}
