import React from "react";

export default function ValuePropositionCyclone() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="grid gap-10 md:grid-cols-12 md:items-start">
        <div className="md:col-span-5">
          <div className="text-xs uppercase tracking-[0.16em] text-white/55">
            Why Dominat8
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            This is what “done properly” looks like.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            Dominat8 doesn’t guess. It translates your real business into a calm,
            professional site that earns trust immediately.
          </p>
        </div>

        <div className="md:col-span-7 space-y-4">
          <div className="rounded-3xl border border-white/[0.10] bg-white/[0.04] p-6">
            <h3 className="text-lg font-semibold">Professional by default</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Calm layouts, correct spacing, and clear hierarchy — the kind of site
              people trust without thinking about it.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.10] bg-white/[0.03] p-6">
            <h3 className="text-lg font-semibold">Generated from a real brief</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Not templates. Not placeholders. Your services, your tone, your
              positioning — structured cleanly.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.10] bg-white/[0.03] p-6">
            <h3 className="text-lg font-semibold">Publish-ready output</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Homepage, pricing, FAQ, contact, routing, and SEO basics handled —
              so you can publish with confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
