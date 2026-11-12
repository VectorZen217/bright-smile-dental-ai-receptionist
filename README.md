# AI Receptionist Template for Small Dental Clinics

A ready-to-deploy AI receptionist for a small dental clinic. It answers
common questions, books 6-month cleanings and exams, reschedules, cancels,
and takes after-hours messages. Built with Next.js and Gemini.

**Demo:** run it locally in demo mode (no API key needed), or deploy this
repo to Vercel for a live demo. The demo clinic is "Bright Smile Dental",
fictional data only. This package is the full source code for that demo.

> **Not HIPAA-compliant out of the box.** This is a template, not a medical
> service. It stores only demo/fictional appointment data by default. Before
> using it with real patients, you must configure your own API keys, your own
> hosting and database, and get your own legal/compliance review (including a
> BAA with any vendor that handles protected health information). Do not put
> real patient data in the demo.

## What is included

- `app/` — Next.js App Router pages and API routes
- `components/ChatWidget.jsx` — the chat UI with quick replies
- `lib/agent.js` — the receptionist logic (intents, FAQs, booking flow)
- `lib/slots.js` — appointment slots and in-memory booking store
- `clinic.config.js` — all clinic-specific settings in one file
- `sample-conversation.md` — a full example conversation to test with
- `.env.example` — the keys you need to add

## Setup (about 15 minutes)

1. **Requirements:** Node.js 18 or newer, npm, and a Google AI Studio
   (Gemini) API key. No other accounts are needed for the demo.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file and add your key:
   ```bash
   cp .env.example .env.local
   # edit .env.local and set GEMINI_API_KEY=your-key-here
   ```
   Without a key the app still runs in `DEMO_MODE=true`, using the built-in
   rule-based replies in `lib/agent.js`. Set `DEMO_MODE=false` once your
   key is in place to call Gemini.
4. Edit `clinic.config.js` with your clinic name, address, hours, services,
   insurance note, and booking rules. That is the only file most buyers
   need to change.
5. Run it:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000
6. Try the sample conversation in `sample-conversation.md` end to end:
   book a cleaning, reschedule it, cancel it, and leave an after-hours
   message.

## How it works

- The chat widget sends each message to `POST /api/chat`.
- `lib/agent.js` detects the intent: FAQ, book, reschedule, cancel, or
  after-hours message. In demo mode it answers from `clinic.config.js`
  and `lib/slots.js`. With a Gemini key it calls the Gemini API with a
  system prompt built from the same config, and falls back to the
  rule-based replies if the API call fails.
- Bookings are stored in memory in `lib/slots.js` for the demo. For
  production, replace that store with your own database (see
  "Going to production" below) and connect your real scheduling system.

## Going to production (not included)

- Replace the in-memory store in `lib/slots.js` with a database.
- Connect your real calendar/scheduling system instead of the demo slots.
- Add SMS/email confirmations (for example Twilio / SendGrid) in
  `app/api/book/route.js`.
- Add authentication for any staff view of appointments.
- Get a compliance review and a BAA before handling real patient data.

## Customizing

Everything clinic-specific lives in `clinic.config.js`:

- `clinic.name`, `clinic.address`, `clinic.phone`
- `clinic.hours` (weekday, Saturday, Sunday)
- `clinic.services` (cleaning/exam, with duration and price note)
- `clinic.insuranceNote`, `clinic.newPatientNote`
- `booking.slotDays`, `booking.slotTimes`, `booking.confirmationPrefix`

Change the name and hours there and the chat, the confirmation summary,
and the appointment list all update.

## Support

This is a one-time template purchase. It includes the code and this guide.
It does not include done-for-you setup, hosting, or compliance advice.
