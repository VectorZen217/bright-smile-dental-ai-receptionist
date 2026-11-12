export const metadata = {
  title: "Bright Smile Dental - AI Receptionist (Demo)",
  description: "Demo AI receptionist for a fictional dental clinic. Demo data only.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
