// src/components/marketing/ServicesGrid.tsx
import { SERVICES } from "@/src/lib/marketing/copy";

export default function ServicesGrid() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="grid gap-6 md:grid-cols-12 md:items-start">
        <div className="md:col-span-5">
          <div className="text-xs uppercase tracking-[0.16em] text-white/55">What you get</div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Built like a premium brochure.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
            The structure is calm and professional — designed to convert without shouting.
          </p>
        </div>

        <div className="md:col-span-7">
          <div className="grid gap-3 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-3xl border border-white/[0.10] bg-white/[0.03] p-5">
                <div className="text-sm font-semibold">{s.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-white/70">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
