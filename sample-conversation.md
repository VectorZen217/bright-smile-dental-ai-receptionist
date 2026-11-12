# Sample conversation — Bright Smile Dental (demo)

Use this script to test the template end to end. Dates below are examples;
use any date in the next 7 days, and any of the slot times in
`clinic.config.js` (9:00 AM, 10:30 AM, 1:00 PM, 2:30 PM, 4:00 PM).

## 1. FAQ

- **You:** What are your hours?
- **Receptionist:** Our hours are Monday to Friday, 8:00 AM - 5:00 PM. Saturday, 9:00 AM - 1:00 PM. Closed on Sunday.
- **You:** Do you take my insurance?
- **Receptionist:** We accept most major PPO dental plans. Bring your insurance card and we will verify your coverage at your visit.
- **You:** Where are you located?
- **Receptionist:** We are at 123 Main Street, Fargo, ND 58102. You can reach us at (701) 555-0142.

## 2. Book a cleaning

- **You:** Book a cleaning
- **Receptionist:** Happy to book a 6-month cleaning and exam. What is the patient's first name?
- **You:** Alex
- **Receptionist:** Thanks, Alex. Which date works for you? Open slots include: ...
- **You:** 2026-11-12
- **Receptionist:** What time on 2026-11-12? Available: ...
- **You:** 10:30 AM
- **Receptionist:** You are booked. Confirmation summary: Name: Alex, Service: 6-month cleaning and exam, Date: 2026-11-12 at 10:30 AM, Clinic: Bright Smile Dental, Booking reference: BSD-100 (keep this to reschedule or cancel). Please arrive 15 minutes early with a photo ID and your insurance card.

## 3. Reschedule

- **You:** Reschedule
- **Receptionist:** No problem. What is your booking reference (or the name on the booking)?
- **You:** BSD-100
- **Receptionist:** What new date and time would you like?
- **You:** 2026-11-13 at 1:00 PM
- **Receptionist:** Done. Your appointment is now 2026-11-13 at 1:00 PM. Booking reference BSD-100 stays the same.

## 4. Cancel

- **You:** Cancel
- **Receptionist:** I can cancel that. What is your booking reference (or the name on the booking)?
- **You:** BSD-100
- **Receptionist:** Your appointment on 2026-11-13 at 1:00 PM (reference BSD-100) has been cancelled.

## 5. After-hours message

- **You:** Leave a message
- **Receptionist:** I can take a message for the front desk. What is your name?
- **You:** Sam
- **Receptionist:** What phone number should we call you back on?
- **You:** (701) 555-0199
- **Receptionist:** What is your message for the front desk?
- **You:** I need to ask about a toothache, please call me tomorrow.
- **Receptionist:** Thanks, I have saved your message for the front desk. We will call you back on the next business day.
