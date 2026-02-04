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
  apiVersion: '2025-05-28.basil',
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
      customer_email: customerEmail,
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create checkout session'
    });
  }
});

// --- Google Calendar Setup ---
let calendarClient = null;
let workCalendarId = null;

const SCHEDULE_TIMEZONE = 'America/Chicago'; // CST/CDT
const SLOT_DURATION_MIN = 30;
const DAY_START_HOUR = 10; // 10:00 AM CST
const DAY_END_HOUR = 16;   // 4:00 PM CST (last slot at 3:30)
const BLOCKED_DAYS = [0]; // Sunday = 0

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

// Helper: get current date/time parts in CST without fragile Date parsing
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

// Helper: convert a CST slot time to a UTC Date for comparison with busy periods
function slotToUTC(dateStr, slotTime) {
  // Build an ISO string with explicit CST offset
  // CST is UTC-6, CDT is UTC-5. Use Intl to find the real offset.
  const probe = new Date(`${dateStr}T${slotTime}:00`);
  // Get the actual offset for this date in the schedule timezone
  const tzStr = probe.toLocaleString('en-US', { timeZone: SCHEDULE_TIMEZONE, timeZoneName: 'shortOffset' });
  const offsetMatch = tzStr.match(/GMT([+-]\d+)/);
  const offsetHours = offsetMatch ? parseInt(offsetMatch[1]) : -6;
  const offsetStr = `${offsetHours >= 0 ? '+' : '-'}${String(Math.abs(offsetHours)).padStart(2, '0')}:00`;
  return new Date(`${dateStr}T${slotTime}:00${offsetStr}`);
}

// Helper: check if a slot overlaps with any busy period
function isSlotBusy(dateStr, slotTime, busyPeriods) {
  const slotStart = slotToUTC(dateStr, slotTime);
  const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MIN * 60 * 1000);

  return busyPeriods.some((busy) => {
    const busyStart = new Date(busy.start);
    const busyEnd = new Date(busy.end);
    return slotStart < busyEnd && slotEnd > busyStart;
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

    // Build time range using dynamic timezone offset (handles CST/CDT)
    const timeMinISO = slotToUTC(startDate, '00:00').toISOString();
    const timeMaxISO = slotToUTC(endDate, '23:59').toISOString();

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

    // Generate available slots for each day in range
    const days = [];
    const current = new Date(`${startDate}T12:00:00`); // noon to avoid DST edge
    const end = new Date(`${endDate}T12:00:00`);
    const now = nowInCST();

    while (current <= end) {
      const dayOfWeek = current.getDay();
      // Use toLocaleDateString with en-CA for YYYY-MM-DD format in CST
      const dateStr = current.toLocaleDateString('en-CA', { timeZone: SCHEDULE_TIMEZONE });

      if (!BLOCKED_DAYS.includes(dayOfWeek)) {
        const allSlots = generateSlots(dateStr);

        // Filter out busy slots and past slots (if today)
        const isTodayCST = dateStr === now.date;
        const available = allSlots.filter((slot) => {
          if (isSlotBusy(dateStr, slot, busyPeriods)) return false;
          if (isTodayCST) {
            const [h, m] = slot.split(':').map(Number);
            if (h < now.hour || (h === now.hour && m <= now.minute)) return false;
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

    // Re-verify slot is free (race condition guard)
    const freeBusy = await calendarClient.freebusy.query({
      requestBody: {
        timeMin: slotToUTC(date, time).toISOString(),
        timeMax: slotToUTC(date, endTime).toISOString(),
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
