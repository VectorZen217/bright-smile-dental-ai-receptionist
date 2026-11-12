import { NextResponse } from "next/server";
import { handleMessage } from "../../../lib/agent";
import { listBookings } from "../../../lib/slots";

// POST /api/chat  { text, state, history }
// Returns { reply, state, bookings }.
// State is kept client-side in this template (the widget sends it back
// each time). For production, keep it server-side per session.
export async function POST(req) {
  const { text, state, history } = await req.json();
  const result = await handleMessage({ text, state, history });
  return NextResponse.json({ ...result, bookings: listBookings() });
}
