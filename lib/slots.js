// lib/slots.js — demo appointment slots and booking store.
// In-memory only, for the demo. Replace with a real database and your
// real scheduling system before using with real patients.

const config = require("../clinic.config.js");

let bookings = [];
let counter = 100;

function nextDays(n) {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function availableSlots() {
  const taken = new Set(bookings.map((b) => b.date + "|" + b.time));
  const slots = [];
  for (const date of nextDays(config.booking.slotDays)) {
    for (const time of config.booking.slotTimes) {
      if (!taken.has(date + "|" + time)) slots.push({ date, time });
    }
  }
  return slots;
}

function book({ name, date, time, service }) {
  const ref = config.booking.confirmationPrefix + "-" + counter++;
  const booking = { ref, name, date, time, service, status: "confirmed" };
  bookings.push(booking);
  return booking;
}

function findBooking(refOrName) {
  const q = String(refOrName || "").trim().toLowerCase();
  return bookings.find(
    (b) => b.ref.toLowerCase() === q || b.name.toLowerCase() === q
  );
}

function reschedule(refOrName, date, time) {
  const b = findBooking(refOrName);
  if (!b) return null;
  b.date = date;
  b.time = time;
  b.status = "rescheduled";
  return b;
}

function cancel(refOrName) {
  const b = findBooking(refOrName);
  if (!b) return null;
  b.status = "cancelled";
  return b;
}

function listBookings() {
  return bookings.filter((b) => b.status !== "cancelled");
}

function resetDemo() {
  bookings = [];
  counter = 100;
}

module.exports = {
  availableSlots,
  book,
  findBooking,
  reschedule,
  cancel,
  listBookings,
  resetDemo,
};
