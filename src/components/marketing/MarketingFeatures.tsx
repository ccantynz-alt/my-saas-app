const items = [
  {
    title: "Multi-page in one run",
    desc: "Hero, pricing, FAQs, contact, and more — structured, not random.",
  },
  {
    title: "SEO foundation",
    desc: "Metadata, sitemap, and clean information hierarchy out of the box.",
  },
  {
    title: "Publish pipeline",
    desc: "Generate → verify → publish — repeatable and observable.",
  },
  {
    title: "Looks good on mobile",
    desc: "Responsive spacing and type that stays clean across devices.",
  },
];

export default function MarketingFeatures() {
  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything you need to ship a legit homepage
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed opacity-80">
            Dominat8 is built for momentum: clean sections, strong defaults, and
            a pipeline that takes your brief seriously.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.title}
            className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
          >
            <div className="text-base font-semibold">{it.title}</div>
            <div className="mt-2 text-sm leading-relaxed opacity-75">{it.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}