// src/components/marketing/RuralTrustStrip.tsx
import { TRUST } from "@/src/lib/marketing/copy";

export default function RuralTrustStrip() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-8">
      <div className="rounded-3xl border border-white/[0.10] bg-white/[0.03] p-5 md:p-6">
        <div className="grid gap-3 md:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="rounded-2xl border border-white/[0.10] bg-black/30 p-4">
              <div className="text-sm font-semibold">{t.title}</div>
              <div className="mt-1 text-sm leading-relaxed text-white/70">{t.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
