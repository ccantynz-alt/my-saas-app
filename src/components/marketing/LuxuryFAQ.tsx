// src/components/marketing/LuxuryFAQ.tsx
import { FAQ } from "@/src/lib/marketing/copy";

export default function LuxuryFAQ() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="grid gap-6 md:grid-cols-12 md:items-start">
        <div className="md:col-span-5">
          <div className="text-xs uppercase tracking-[0.16em] text-white/55">FAQ</div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Built for clarity.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
            No mystery routing. No “where did my changes go?” energy. Just a clean pipeline and a premium output.
          </p>
        </div>

        <div className="md:col-span-7">
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-white/[0.10] bg-white/[0.03] p-5"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-white/90">
                  <span className="mr-2 text-white/50 group-open:hidden">+</span>
                  <span className="mr-2 text-white/50 hidden group-open:inline">–</span>
                  {f.q}
                </summary>
                <div className="mt-3 text-sm leading-relaxed text-white/70">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
