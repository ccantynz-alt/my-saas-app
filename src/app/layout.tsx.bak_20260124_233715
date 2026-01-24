/* src/app/layout.tsx */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dominat8 — AI Website Builder",
  description:
    "Generate and publish a complete website in minutes. Built for speed, clarity, and SEO-ready fundamentals.",
  metadataBase: new URL("https://www.dominat8.com"),
  alternates: { canonical: "https://www.dominat8.com" },
  openGraph: {
    title: "Dominat8 — AI Website Builder",
    description: "Generate and publish a complete website in minutes.",
    url: "https://www.dominat8.com",
    siteName: "Dominat8",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Dominat8 — AI Website Builder",
    description: "Generate and publish a complete website in minutes.",
  },
};

export default function RootLayout(props: { children: any }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        {props.children}
      </body>
    </html>
  );
}
