import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.API_PORT || 3001;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow any localhost port in development
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
    // Allow configured frontend URL in production
    const allowed = process.env.FRONTEND_URL || 'http://localhost:5173';
    if (origin === allowed) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Create checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, customerEmail } = req.body;

    if (!priceId || !customerEmail) {
      return res.status(400).json({ error: 'Missing priceId or customerEmail' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: priceId === 'price_1THgtFRk08WBLpB69187D4zo',
      customer_email: customerEmail,
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/download?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout`,
      subscription_data: {
        trial_period_days: 7,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create checkout session'
    });
  }
});

// Changelog via GitHub Releases API (keeps GitHub token server-side)
const PREFIX_TO_CATEGORY = {
  feat: 'Added',
  fix: 'Fixed',
  chore: 'Changed',
  style: 'Changed',
  docs: 'Changed',
  ci: 'Changed',
  refactor: 'Changed',
};

const MAX_ITEMS_PER_CATEGORY = 3;

function parseReleaseBody(body) {
  const categories = {};
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('- ')) continue;
    const item = trimmed.slice(2);
    const colonIdx = item.indexOf(':');
    if (colonIdx === -1) continue;
    const prefix = item.slice(0, colonIdx).trim().toLowerCase();
    let category;
    if (prefix === 'feat') category = 'Added';
    else if (prefix === 'fix') category = 'Fixed';
    else continue;
    const description = item.slice(colonIdx + 1).trim();
    if (!description || description.startsWith('bump version')) continue;
    if (!categories[category]) categories[category] = [];
    categories[category].push(description.charAt(0).toUpperCase() + description.slice(1));
  }
  return ['Added', 'Fixed']
    .filter((cat) => categories[cat]?.length)
    .map((cat) => ({ category: cat, items: categories[cat].slice(0, MAX_ITEMS_PER_CATEGORY) }));
}

app.get('/api/changelog', async (req, res) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers = { Accept: 'application/vnd.github+json' };
    if (token) headers.Authorization = `token ${token}`;

    const response = await fetch(
      'https://api.github.com/repos/Haste-NYC/haste-conform/releases?per_page=100',
      { headers }
    );
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch releases' });
    }

    const ghReleases = await response.json();
    const releases = ghReleases
      .filter((r) => !r.draft && !r.prerelease)
      .map((r) => ({
        version: r.tag_name.replace(/^v/, ''),
        date: r.published_at?.slice(0, 10) ?? '',
        changes: parseReleaseBody(r.body ?? ''),
      }))
      .filter((r) => r.changes.length > 0);

    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json(releases);
  } catch (err) {
    console.error('Changelog fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch changelog' });
  }
});

// --- Google Calendar Setup ---
let calendarClient = null;
let workCalendarId = null;

const SCHEDULE_TIMEZONE = 'America/New_York'; // ET (Eastern Time)
const SLOT_DURATION_MIN = 30;
const DAY_START_HOUR = 11; // 11:00 AM ET
const DAY_END_HOUR = 18;   // 6:00 PM ET (last slot at 5:30)
const BLOCKED_DAYS = [0, 6]; // Sunday = 0, Saturday = 6
const BUFFER_MINUTES = 30; // 30-min buffer between appointments
const MAX_BOOKINGS_PER_DAY = 5;
const MAX_ADVANCE_DAYS = 30; // scheduling window: 30 days in advance
const MIN_LEAD_MINUTES = 60; // must book at least 1 hour before

async function initGoogleCalendar() {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
  const impersonateEmail = process.env.GOOGLE_IMPERSONATE_EMAIL;
  const calendarName = process.env.GOOGLE_CALENDAR_NAME || 'Work';

  if (!keyPath || !impersonateEmail) {
    console.warn('Google Calendar env vars missing -- scheduling endpoints disabled');
    return;
  }

  try {
    const keyFile = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    const auth = new google.auth.JWT({
      email: keyFile.client_email,
      key: keyFile.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
      subject: impersonateEmail,
    });

    calendarClient = google.calendar({ version: 'v3', auth });

    // Discover the "Work" calendar ID
    const calList = await calendarClient.calendarList.list();
    const match = calList.data.items.find(
      (c) => c.summary?.toLowerCase() === calendarName.toLowerCase()
    );
    if (match) {
      workCalendarId = match.id;
      console.log(`Google Calendar "${calendarName}" found: ${workCalendarId}`);
    } else {
      // Fallback to primary
      workCalendarId = 'primary';
      console.warn(`Calendar "${calendarName}" not found, using primary`);
    }
  } catch (err) {
    console.error('Failed to initialize Google Calendar:', err.message);
  }
}

// Helper: generate 30-min time slots for a given date string (YYYY-MM-DD)
function generateSlots(dateStr) {
  const slots = [];
  for (let h = DAY_START_HOUR; h < DAY_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_DURATION_MIN) {
      // Skip if this slot would end after DAY_END_HOUR
      const endH = m + SLOT_DURATION_MIN >= 60 ? h + 1 : h;
      const endM = (m + SLOT_DURATION_MIN) % 60;
      if (endH > DAY_END_HOUR || (endH === DAY_END_HOUR && endM > 0)) continue;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
}

// Helper: get current date/time parts in the schedule timezone
function nowInCST() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SCHEDULE_TIMEZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    hour: parseInt(get('hour')),
    minute: parseInt(get('minute')),
  };
}

// Helper: convert a schedule-timezone slot time to a UTC Date for comparison with busy periods
function slotToUTC(dateStr, slotTime) {
  // Build an ISO string with the correct offset for the schedule timezone
  const probe = new Date(`${dateStr}T${slotTime}:00`);
  // Get the actual offset for this date in the schedule timezone
  const tzStr = probe.toLocaleString('en-US', { timeZone: SCHEDULE_TIMEZONE, timeZoneName: 'shortOffset' });
  const offsetMatch = tzStr.match(/GMT([+-]\d+)/);
  const offsetHours = offsetMatch ? parseInt(offsetMatch[1]) : -5;
  const offsetStr = `${offsetHours >= 0 ? '+' : '-'}${String(Math.abs(offsetHours)).padStart(2, '0')}:00`;
  return new Date(`${dateStr}T${slotTime}:00${offsetStr}`);
}

// Helper: check if a slot overlaps with any busy period (including buffer)
function isSlotBusy(dateStr, slotTime, busyPeriods) {
  const slotStart = slotToUTC(dateStr, slotTime);
  const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MIN * 60 * 1000);

  return busyPeriods.some((busy) => {
    const busyStart = new Date(busy.start);
    const busyEnd = new Date(busy.end);
    // Add buffer: slot must not start until BUFFER_MINUTES after a busy period ends,
    // and must end BUFFER_MINUTES before the next busy period starts
    const bufferedBusyStart = new Date(busyStart.getTime() - BUFFER_MINUTES * 60 * 1000);
    const bufferedBusyEnd = new Date(busyEnd.getTime() + BUFFER_MINUTES * 60 * 1000);
    return slotStart < bufferedBusyEnd && slotEnd > bufferedBusyStart;
  });
}

// GET /api/schedule/availability
app.get('/api/schedule/availability', async (req, res) => {
  if (!calendarClient || !workCalendarId) {
    return res.status(503).json({ error: 'Scheduling not configured' });
  }

  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate required' });
    }

    // Clamp the query range to the scheduling window (max MAX_ADVANCE_DAYS ahead)
    const now = nowInCST();
    const todayDate = new Date(`${now.date}T12:00:00`);
    const maxDate = new Date(todayDate);
    maxDate.setDate(maxDate.getDate() + MAX_ADVANCE_DAYS);
    const maxDateStr = maxDate.toLocaleDateString('en-CA', { timeZone: SCHEDULE_TIMEZONE });

    const effectiveStart = startDate < now.date ? now.date : startDate;
    const effectiveEnd = endDate > maxDateStr ? maxDateStr : endDate;

    if (effectiveStart > effectiveEnd) {
      return res.json({ days: [] });
    }

    // Build time range using dynamic timezone offset
    const timeMinISO = slotToUTC(effectiveStart, '00:00').toISOString();
    const timeMaxISO = slotToUTC(effectiveEnd, '23:59').toISOString();

    // Fetch busy times via FreeBusy API
    const freeBusy = await calendarClient.freebusy.query({
      requestBody: {
        timeMin: timeMinISO,
        timeMax: timeMaxISO,
        timeZone: SCHEDULE_TIMEZONE,
        items: [{ id: workCalendarId }],
      },
    });

    const busyPeriods = freeBusy.data.calendars?.[workCalendarId]?.busy || [];

    // Count existing bookings per day by checking events
    let existingEvents = [];
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

    // Build a map of booking counts per date
    const bookingsPerDay = {};
    for (const evt of existingEvents) {
      const evtDate = evt.start?.dateTime
        ? new Date(evt.start.dateTime).toLocaleDateString('en-CA', { timeZone: SCHEDULE_TIMEZONE })
        : null;
      if (evtDate) {
        bookingsPerDay[evtDate] = (bookingsPerDay[evtDate] || 0) + 1;
      }
    }

    // Generate available slots for each day in range
    const days = [];
    const current = new Date(`${effectiveStart}T12:00:00`); // noon to avoid DST edge
    const end = new Date(`${effectiveEnd}T12:00:00`);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      const dateStr = current.toLocaleDateString('en-CA', { timeZone: SCHEDULE_TIMEZONE });

      if (!BLOCKED_DAYS.includes(dayOfWeek)) {
        // Skip if this day already hit the max bookings
        if ((bookingsPerDay[dateStr] || 0) >= MAX_BOOKINGS_PER_DAY) {
          current.setDate(current.getDate() + 1);
          continue;
        }

        const allSlots = generateSlots(dateStr);

        // Filter out busy slots, past slots, and slots within minimum lead time
        const isTodayET = dateStr === now.date;
        const available = allSlots.filter((slot) => {
          if (isSlotBusy(dateStr, slot, busyPeriods)) return false;
          if (isTodayET) {
            const [h, m] = slot.split(':').map(Number);
            const slotMinutes = h * 60 + m;
            const nowMinutes = now.hour * 60 + now.minute;
            // Must be at least MIN_LEAD_MINUTES (1 hour) in the future
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
  } catch (err) {
    console.error('Availability error:', err.message);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// POST /api/schedule/book
app.post('/api/schedule/book', async (req, res) => {
  if (!calendarClient || !workCalendarId) {
    return res.status(503).json({ error: 'Scheduling not configured' });
  }

  try {
    const { date, time, name, email, company, notes } = req.body;

    if (!date || !time || !name || !email) {
      return res.status(400).json({ error: 'date, time, name, and email are required' });
    }

    // Build start/end in CST
    const startDateTime = `${date}T${time}:00`;
    const endMinutes = parseInt(time.split(':')[1]) + SLOT_DURATION_MIN;
    const endHour = parseInt(time.split(':')[0]) + Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
    const endDateTime = `${date}T${endTime}:00`;

    // Enforce minimum lead time
    const now = nowInCST();
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

    res.json({
      success: true,
      eventId: event.data.id,
      meetLink: meetLink || null,
      startTime: event.data.start.dateTime,
      endTime: event.data.end.dateTime,
    });
  } catch (err) {
    console.error('Booking error:', err.message);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// Initialize Google Calendar, then start server
initGoogleCalendar().then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
});
