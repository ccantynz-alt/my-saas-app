// src/components/marketing/LuxuryCTA.tsx
import Link from "next/link";
import { CTA } from "@/src/lib/marketing/copy";

export default function LuxuryCTA() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="rounded-3xl border border-white/[0.12] bg-white/[0.04] p-7 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.16em] text-white/55">Ready</div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Make the homepage the standard.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
              Generate, refine, publish — and keep it clean. This is the quality bar for every site Dominat8 produces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={CTA.primary.href}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90 transition"
            >
              {CTA.primary.label}
            </Link>
            <Link
              href={CTA.secondary.href}
              className="rounded-2xl border border-white/[0.16] bg-black/30 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-white/[0.05] transition"
            >
              {CTA.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
