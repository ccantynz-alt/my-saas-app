import "./globals.css";
import type { Metadata } from "next";

const __BUILD_SHA = process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "";
const __BUILD_SHA_SHORT = __BUILD_SHA ? String(__BUILD_SHA).slice(0, 8) : "local";
const __VERCEL_ENV = process.env.VERCEL_ENV || "local";import Link from "next/link";

export const metadata: Metadata = {
  title: "Dominat8 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â AI Website Builder",
  description:
    "Generate and publish a complete website in minutes. Built for speed, clarity, and SEO-ready fundamentals.",
  metadataBase: new URL("https://www.dominat8.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Dominat8 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â AI Website Builder",
    description: "Generate and publish a complete website in minutes.",
    url: "https://www.dominat8.com/",
    siteName: "Dominat8",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <div data-x-dominat8-css-proof className="fixed bottom-3 right-3 z-[9999] rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white shadow-lg">CSS: ON</div>

        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-black text-white text-sm font-semibold">
                D8
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Dominat8</div>
                <div className="text-[11px] opacity-70">AI Website Builder</div>
              </div>
            </Link>

            <nav className="flex items-center gap-2 text-sm">
              <Link className="rounded-lg px-3 py-2 hover:bg-neutral-100" href="/templates">
                Templates
              </Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-neutral-100" href="/use-cases">
                Use cases
              </Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-neutral-100" href="/pricing">
                Pricing
              </Link>
              <a
                className="ml-2 inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
                href="/templates"
              >
                Get started
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        <footer className="border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-medium">Dominat8</div>
              <div className="text-xs opacity-70">Ãƒâ€šÃ‚© {new Date().getFullYear()} Dominat8.com ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Built on Vercel</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs opacity-80">
              <Link className="underline-offset-4 hover:underline" href="/pricing">
                Pricing
              </Link>
              <Link className="underline-offset-4 hover:underline" href="/templates">
                Templates
              </Link>
              <Link className="underline-offset-4 hover:underline" href="/use-cases">
                Use cases
              </Link>
            </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] opacity-80">
              <span data-x-dominat8-build-badge>
                Build: <span className="font-mono">{__BUILD_SHA_SHORT}</span> Ãƒâ€šÃ‚Â· Env: <span className="font-mono">{__VERCEL_ENV}</span>
              </span>
              <a className="underline-offset-4 hover:underline" href={"/api/__site_status__?ts=" + Date.now()}>
                Live status ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢
              </a>
            </div>
</div></footer>
      </body>
    </html>
  );
}