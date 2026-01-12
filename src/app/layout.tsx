import "./globals.css";

export const metadata = {
  title: "MySaaS Builder",
  description: "Premium AI website building that actually ships.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
