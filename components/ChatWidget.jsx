"use client";
import { useState } from "react";

const QUICK_REPLIES = [
  "Book a cleaning",
  "Reschedule",
  "Cancel",
  "What are your hours?",
  "Do you take my insurance?",
  "Leave a message",
];

export default function ChatWidget({ onBooking }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I am the AI receptionist for Bright Smile Dental (demo). I can book a 6-month cleaning, reschedule, cancel, answer questions, or take a message. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [state, setState] = useState({ step: "idle" });

  async function send(text) {
    const userText = (text ?? input).trim();
    if (!userText) return;
    setInput("");
    const next = [...messages, { role: "user", text: userText }];
    setMessages(next);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: userText, state, history: next }),
    });
    const data = await res.json();
    setState(data.state || { step: "idle" });
    setMessages([...next, { role: "assistant", text: data.reply }]);
    if (data.bookings) onBooking(data.bookings);
  }

  return (
    <section style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
      <div style={{ minHeight: 240, whiteSpace: "pre-wrap" }}>
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.role === "user" ? "You" : "Receptionist"}:</strong> {m.text}
          </p>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "12px 0" }}>
        {QUICK_REPLIES.map((q) => (
          <button key={q} onClick={() => send(q)}>
            {q}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        style={{ display: "flex", gap: 8 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
