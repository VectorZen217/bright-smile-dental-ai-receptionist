// clinic.config.js — the ONLY file most buyers need to edit.
// Change these values and the chat, booking flow, and confirmation
// summary all update. No real patient data belongs in this file.

module.exports = {
  clinic: {
    name: "Bright Smile Dental",
    address: "123 Main Street, Fargo, ND 58102",
    phone: "(701) 555-0142",
    hours: {
      weekday: "Monday to Friday, 8:00 AM - 5:00 PM",
      saturday: "Saturday, 9:00 AM - 1:00 PM",
      sunday: "Closed on Sunday",
    },
    insuranceNote:
      "We accept most major PPO dental plans. Bring your insurance card and we will verify your coverage at your visit.",
    newPatientNote:
      "Please arrive 15 minutes early and bring a photo ID and your insurance card. New-patient forms are available at the front desk.",
  },

  services: [
    {
      id: "cleaning-exam",
      name: "6-month cleaning and exam",
      durationMinutes: 60,
      note: "Cleaning, exam, and X-rays if due.",
    },
    {
      id: "new-patient-exam",
      name: "New patient exam",
      durationMinutes: 60,
      note: "Exam, X-rays, and treatment plan.",
    },
  ],

  booking: {
    // Demo slots: next 7 days, these times each open day.
    slotDays: 7,
    slotTimes: ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"],
    confirmationPrefix: "BSD",
  },

  afterHours: {
    message:
      "Thanks, I have saved your message for the front desk. We will call you back on the next business day.",
  },
};
