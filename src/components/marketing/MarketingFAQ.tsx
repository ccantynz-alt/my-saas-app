const faqs = [
  {
    q: "Is this a template?",
    a: "It starts from a template, but the goal is repeatable structure and a pipeline that generates the full site coherently.",
  },
  {
    q: "How do I know / is really live?",
    a: "Your truth test checks for HOME_OK on /. If it appears and _not-found does not, you’re live.",
  },
  {
    q: "What’s the next big jump after this?",
    a: "Gallery pages + case studies + stronger proof blocks, then SEO/sitemap polish and publish flows.",
  },
];

export default function MarketingFAQ() {
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">FAQ</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-base font-semibold">{f.q}</div>
            <div className="mt-2 text-sm leading-relaxed opacity-75">{f.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}