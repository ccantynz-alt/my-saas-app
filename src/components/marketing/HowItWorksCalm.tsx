import React from "react";

export default function HowItWorksCalm() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="rounded-3xl border border-white/[0.10] bg-white/[0.03] p-8 md:p-10">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.16em] text-white/55">
            How it works
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Clear, calm, and predictable.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            No surprises. No “where did my changes go?” energy. Just a clean path
            from brief to published site.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/[0.10] bg-black/30 p-6">
            <div className="text-sm font-semibold">1. Describe your business</div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Tell us what you do, who you serve, and what professional looks like
              in your world.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.10] bg-black/30 p-6">
            <div className="text-sm font-semibold">2. Review your site</div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              See a complete homepage, pages, and structure — ready to refine,
              not fix.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.10] bg-black/30 p-6">
            <div className="text-sm font-semibold">3. Publish when ready</div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Confidently push live with clean routing and a premium result.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
