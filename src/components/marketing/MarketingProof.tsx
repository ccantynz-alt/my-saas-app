const bullets = [
  "Clean structure: hero → proof → features → CTA",
  "Fast pages: minimal clutter, readable layout",
  "Designed to convert: clear CTAs and credibility blocks",
];

export default function MarketingProof() {
  return (
    <section className="mt-14 rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
      <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Make it look real — instantly
          </h2>
          <p className="mt-3 text-base leading-relaxed opacity-80">
            The goal is not “another template.” It’s a homepage that feels like
            a premium product from the first scroll.
          </p>

          <ul className="mt-5 space-y-2 text-sm opacity-80">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-black/60" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-black/10 bg-black p-6 text-white">
          <div className="text-xs uppercase tracking-wider opacity-80">Live marker</div>
          <div className="mt-3 text-3xl font-semibold">HOME_OK</div>
          <div className="mt-2 text-sm opacity-80">
            If you can see this page (and your truth test finds HOME_OK), then
            <code className="mx-1 rounded bg-white/10 px-2 py-0.5">/</code>
            is serving the real homepage.
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs opacity-90">
            <div className="rounded-2xl bg-white/10 p-3">
              <div className="font-semibold">Tailwind</div>
              <div className="mt-1 opacity-80">Confirmed by layout + spacing</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <div className="font-semibold">Routing</div>
              <div className="mt-1 opacity-80">Not _not-found</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <div className="font-semibold">Deploy</div>
              <div className="mt-1 opacity-80">vercel --prod --force</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <div className="font-semibold">Next</div>
              <div className="mt-1 opacity-80">Gallery + case studies</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}