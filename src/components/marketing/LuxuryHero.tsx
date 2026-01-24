// src/components/marketing/LuxuryHero.tsx
import Link from "next/link";
import { BRAND, CTA, PROOF } from "@/src/lib/marketing/copy";

export default function LuxuryHero() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-14 pb-10">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          {/* Quiet marker for verification (do not remove) */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.04] px-3 py-1 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            <span>HOME_OK • / → src/app/(marketing)/page.tsx • 2026-01-24</span>
          </div>

          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl">
            A pedestal-level homepage —
            <span className="text-white/70"> generated from your brief.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/70 md:text-lg">
            {BRAND.name} turns intent into a launch-ready site: structure, copy, pages, and SEO.
            It feels like a luxury product because it behaves like one.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={CTA.primary.href}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90 transition"
            >
              {CTA.primary.label}
            </Link>
            <Link
              href={CTA.secondary.href}
              className="rounded-2xl border border-white/[0.16] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/85 hover:bg-white/[0.06] transition"
            >
              {CTA.secondary.label}
            </Link>
            <Link
              href={CTA.tertiary.href}
              className="px-2 py-2 text-sm text-white/60 hover:text-white transition"
            >
              {CTA.tertiary.label} →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PROOF.map((p) => (
              <div
                key={p.k}
                className="rounded-2xl border border-white/[0.10] bg-white/[0.03] px-4 py-3"
              >
                <div className="text-xs text-white/60">{p.k}</div>
                <div className="mt-1 text-sm font-semibold">{p.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] p-5 backdrop-blur">
            <div className="rounded-2xl border border-white/[0.10] bg-black/40 p-5">
              <div className="text-xs text-white/55">BRIEF</div>
              <div className="mt-2 text-sm leading-relaxed text-white/80">
                “I run a high-end service business. I want a clean homepage, pricing, FAQ and contact page.
                Premium feel. Apple-ish calm. Make it trustworthy and conversion-ready.”
              </div>

              <div className="my-4 h-px bg-white/[0.10]" />

              <div className="text-xs text-white/55">OUTPUT</div>
              <ul className="mt-2 space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
                  Homepage with pedestal hero + proof + CTA
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
                  Pricing + FAQ + Contact pages
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
                  Metadata + sitemap-ready structure
                </li>
              </ul>

              <div className="mt-5 rounded-2xl border border-white/[0.10] bg-white/[0.02] p-3">
                <div className="text-xs text-white/60">Why this matters</div>
                <div className="mt-1 text-sm text-white/80">
                  You’re setting the quality bar for every generated site.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-white/45">
            Tip: once this is live, we’ll swap the brief copy for your real Dominat8 positioning.
          </div>
        </div>
      </div>
    </section>
  );
}
