"use client";
import { useState } from "react";
import ChatWidget from "../components/ChatWidget";

export default function Page() {
  const [bookings, setBookings] = useState([]);
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <header>
        <h1>Bright Smile Dental</h1>
        <p>
          <strong>DEMO</strong> - fictional clinic, fictional appointments.
          No real patient data. Not a HIPAA-compliant service.
        </p>
        <p>123 Main Street, Fargo, ND - (701) 555-0142</p>
        <p>Mon-Fri 8 AM-5 PM - Sat 9 AM-1 PM - Closed Sun</p>
      </header>
      <ChatWidget onBooking={setBookings} />
      <section>
        <h2>Upcoming demo appointments</h2>
        {bookings.length === 0 ? (
          <p>No appointments booked yet in this demo.</p>
        ) : (
          <ul>
            {bookings.map((b) => (
              <li key={b.ref}>
                {b.name} - {b.service} - {b.date} at {b.time} - Ref: {b.ref}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
