// src/components/marketing/LuxurySteps.tsx
import { STEPS } from "@/src/lib/marketing/copy";

export default function LuxurySteps() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="rounded-3xl border border-white/[0.10] bg-white/[0.03] p-6 md:p-10">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.16em] text-white/55">How it works</div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Calm process. Serious output.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
            The experience is designed to feel premium: fewer clicks, clearer decisions, and a clean path to publish.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, idx) => (
            <div
              key={s.title}
              className="rounded-3xl border border-white/[0.10] bg-black/30 p-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1 text-xs text-white/70">
                <span className="font-semibold">{idx + 1}</span>
                <span>Step</span>
              </div>
              <div className="mt-4 text-lg font-semibold">{s.title}</div>
              <div className="mt-2 text-sm leading-relaxed text-white/70">{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
