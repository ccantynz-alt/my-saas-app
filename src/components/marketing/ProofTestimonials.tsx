// src/components/marketing/ProofTestimonials.tsx
import { TESTIMONIALS } from "@/src/lib/marketing/copy";

export default function ProofTestimonials() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="rounded-3xl border border-white/[0.10] bg-white/[0.03] p-6 md:p-10">
        <div className="text-xs uppercase tracking-[0.16em] text-white/55">Proof</div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Quiet confidence.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
          This is the vibe: professional, grounded, premium. Not flashy — just correct.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.quote} className="rounded-3xl border border-white/[0.10] bg-black/30 p-6">
              <div className="text-sm leading-relaxed text-white/80">“{t.quote}”</div>
              <div className="mt-4 text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-white/60">{t.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
