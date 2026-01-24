const steps = [
  { n: "01", title: "Describe your product", desc: "Drop in a brief: audience, offer, tone, sections." },
  { n: "02", title: "Agents generate the site", desc: "Pages, copy, structure — consistent and readable." },
  { n: "03", title: "Publish when ready", desc: "Run the pipeline and ship. Iterate with control." },
];

export default function MarketingSteps() {
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        The workflow is simple
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed opacity-80">
        Build a homepage that looks premium, then expand into a full site.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold opacity-60">{s.n}</div>
            <div className="mt-2 text-base font-semibold">{s.title}</div>
            <div className="mt-2 text-sm leading-relaxed opacity-75">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}