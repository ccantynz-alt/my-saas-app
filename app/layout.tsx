import "./globals.css";

export const metadata = {
  title: "My SaaS App",
  description: "Starter",
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
