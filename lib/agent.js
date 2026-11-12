// lib/agent.js — the AI receptionist logic.
// Two modes:
//  - DEMO_MODE=true (default): rule-based replies from clinic.config.js.
//    No API key needed, works offline, good for trying the flow.
//  - DEMO_MODE=false with GEMINI_API_KEY set: calls Gemini with a system
//    prompt built from the same config. Falls back to rule-based replies
//    if the Gemini call fails, so the chat never goes silent.
//
// The booking flow is a small state machine kept in `state` (per chat
// session, passed in by the API route):
//   idle -> booking_name -> booking_date -> booking_time -> done
//   idle -> reschedule_lookup -> reschedule_new -> done
//   idle -> cancel_lookup -> done
//   idle -> message_name -> message_phone -> message_text -> done

const config = require("../clinic.config.js");
const slots = require("./slots.js");

const DEMO_MODE = process.env.DEMO_MODE !== "false";

function systemPrompt() {
  const c = config.clinic;
  return [
    `You are the AI receptionist for ${c.name}, a dental clinic in Fargo, ND.`,
    `Address: ${c.address}. Phone: ${c.phone}.`,
    `Hours: ${c.hours.weekday}. ${c.hours.saturday}. ${c.hours.sunday}.`,
    `Insurance: ${c.insuranceNote}`,
    `New patients: ${c.newPatientNote}`,
    "Services: 6-month cleaning and exam (60 minutes), new patient exam (60 minutes).",
    "Be brief, friendly, and factual. Only offer the services and hours above.",
    "Never ask for payment details, Social Security numbers, or full medical history.",
    "If asked about anything medical beyond booking and clinic information, suggest calling the clinic.",
  ].join("\n");
}

async function geminiReply(history, userMessage) {
  // Lazy import so demo mode never needs the package installed.
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt(),
  });
  const chat = model.startChat({
    history: history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
  });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

function faqReply(text) {
  const t = text.toLowerCase();
  const c = config.clinic;
  if (t.includes("hour") || t.includes("open") || t.includes("close"))
    return `Our hours are ${c.hours.weekday}. ${c.hours.saturday}. ${c.hours.sunday}.`;
  if (t.includes("where") || t.includes("address") || t.includes("location") || t.includes("directions"))
    return `We are at ${c.address}. You can reach us at ${c.phone}.`;
  if (t.includes("insurance"))
    return c.insuranceNote;
  if (t.includes("new patient") || t.includes("paperwork") || t.includes("form"))
    return c.newPatientNote;
  if (t.includes("price") || t.includes("cost"))
    return "Prices depend on your insurance and treatment. Call us at " +
      c.phone + " and we will verify your coverage before your visit.";
  if (t.includes("service") || t.includes("cleaning") || t.includes("exam"))
    return "We offer a 6-month cleaning and exam (60 minutes) and a new patient exam (60 minutes). Would you like to book a cleaning?";
  return null;
}

function slotListText() {
  const open = slots.availableSlots().slice(0, 10);
  return open.map((s) => `${s.date} at ${s.time}`).join(", ");
}

// Main entry point used by app/api/chat/route.js
async function handleMessage({ text, state, history }) {
  const t = (text || "").trim();
  const lower = t.toLowerCase();
  state = state || { step: "idle" };

  // --- booking flow states ---
  if (state.step === "booking_name") {
    state.pending = { ...(state.pending || {}), name: t };
    state.step = "booking_date";
    return { reply: `Thanks, ${t}. Which date works for you? Open slots include: ${slotListText()}. Reply with a date like 2026-11-12.`, state };
  }
  if (state.step === "booking_date") {
    state.pending.date = t;
    state.step = "booking_time";
    const day = slots.availableSlots().filter((s) => s.date === t);
    const times = day.length
      ? day.map((s) => s.time).join(", ")
      : config.booking.slotTimes.join(", ");
    return { reply: `What time on ${t}? Available: ${times}.`, state };
  }
  if (state.step === "booking_time") {
    const b = slots.book({
      name: state.pending.name,
      date: state.pending.date,
      time: t,
      service: "6-month cleaning and exam",
    });
    state.step = "idle";
    state.pending = {};
    return {
      reply:
        `You are booked. Confirmation summary:\n` +
        `Name: ${b.name}\nService: ${b.service}\nDate: ${b.date} at ${b.time}\n` +
        `Clinic: ${config.clinic.name}, ${config.clinic.address}\n` +
        `Booking reference: ${b.ref} (keep this to reschedule or cancel)\n` +
        `Please arrive 15 minutes early with a photo ID and your insurance card.`,
      state,
      booking: b,
    };
  }
  if (state.step === "reschedule_lookup") {
    state.pending = { ref: t };
    state.step = "reschedule_new";
    return { reply: `What new date and time would you like? Open slots include: ${slotListText()}. Reply like "2026-11-13 at 10:30 AM".`, state };
  }
  if (state.step === "reschedule_new") {
    const m = t.match(/(\d{4}-\d{2}-\d{2})\s*(?:at\s*)?(.*)/i);
    const b = m
      ? slots.reschedule(state.pending.ref, m[1], m[2] || "10:30 AM")
      : null;
    state.step = "idle";
    state.pending = {};
    return b
      ? { reply: `Done. Your appointment is now ${b.date} at ${b.time}. Booking reference ${b.ref} stays the same.`, state, booking: b }
      : { reply: "I could not find that booking. Please check the booking reference and try again.", state };
  }
  if (state.step === "cancel_lookup") {
    const b = slots.cancel(t);
    state.step = "idle";
    return b
      ? { reply: `Your appointment on ${b.date} at ${b.time} (reference ${b.ref}) has been cancelled.`, state }
      : { reply: "I could not find that booking. Please check the booking reference and try again.", state };
  }
  if (state.step === "message_name") {
    state.pending = { name: t };
    state.step = "message_phone";
    return { reply: "What phone number should we call you back on?", state };
  }
  if (state.step === "message_phone") {
    state.pending.phone = t;
    state.step = "message_text";
    return { reply: "What is your message for the front desk?", state };
  }
  if (state.step === "message_text") {
    state.step = "idle";
    state.pending = {};
    return { reply: config.afterHours.message, state };
  }

  // --- new intents ---
  // Check reschedule/cancel first: "reschedule" contains "schedule",
  // so it must be tested before the booking intent below.
  if (lower.includes("reschedule") || lower.includes("move my") || lower.includes("change my appointment")) {
    state.step = "reschedule_lookup";
    return { reply: "No problem. What is your booking reference (or the name on the booking)?", state };
  }
  if (lower.includes("cancel")) {
    state.step = "cancel_lookup";
    return { reply: "I can cancel that. What is your booking reference (or the name on the booking)?", state };
  }
  if (lower.includes("after hours") || lower.includes("leave a message") || lower.includes("message for")) {
    state.step = "message_name";
    return { reply: "I can take a message for the front desk. What is your name?", state };
  }
  if (lower.includes("book") || lower.includes("cleaning") || lower.includes("appointment")) {
    state.step = "booking_name";
    return { reply: "Happy to book a 6-month cleaning and exam. What is the patient's first name?", state };
  }

  const faq = faqReply(t);
  if (faq) return { reply: faq, state };

  // Fall back to Gemini when configured, otherwise a helpful default.
  if (!DEMO_MODE && process.env.GEMINI_API_KEY) {
    try {
      const reply = await geminiReply(history || [], t);
      return { reply, state };
    } catch (e) {
      // fall through to the default reply below
    }
  }
  return {
    reply:
      "I can help with booking a 6-month cleaning, rescheduling, cancelling, " +
      "hours, location, insurance, or leaving a message for the front desk. " +
      "What would you like to do?",
    state,
  };
}

module.exports = { handleMessage, systemPrompt };
