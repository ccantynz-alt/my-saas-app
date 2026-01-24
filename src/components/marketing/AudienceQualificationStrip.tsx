import React from "react";

export default function AudienceQualificationStrip() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-6">
      <div className="rounded-3xl border border-white/[0.10] bg-white/[0.03] px-6 py-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">
          <span className="font-semibold text-white">Built for</span>
          <span>Trades & contractors</span>
          <span className="opacity-50">•</span>
          <span>Rural & regional services</span>
          <span className="opacity-50">•</span>
          <span>Local operators</span>
          <span className="opacity-50">•</span>
          <span>Premium small businesses</span>
        </div>
      </div>
    </section>
  );
}
