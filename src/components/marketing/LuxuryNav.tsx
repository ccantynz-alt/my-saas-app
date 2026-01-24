// src/components/marketing/LuxuryNav.tsx
import Link from "next/link";
import { BRAND, CTA } from "@/src/lib/marketing/copy";

export default function LuxuryNav() {
  return (
    <header className="mx-auto w-full max-w-6xl px-6 pt-8">
      <div className="flex items-center justify-between rounded-2xl border border-white/[0.10] bg-white/[0.03] px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl border border-white/[0.14] bg-white/[0.06]" aria-hidden="true" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">{BRAND.name}</div>
            <div className="text-xs text-white/60">{BRAND.tagline}</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <Link className="hover:text-white transition" href="/templates">Templates</Link>
          <Link className="hover:text-white transition" href="/use-cases">Use cases</Link>
          <Link className="hover:text-white transition" href="/pricing">Pricing</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={CTA.secondary.href}
            className="hidden rounded-xl border border-white/[0.14] bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/[0.06] transition md:inline-flex"
          >
            {CTA.secondary.label}
          </Link>
          <Link
            href={CTA.primary.href}
            className="rounded-xl border border-white/[0.16] bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-white/90 transition"
          >
            {CTA.primary.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
