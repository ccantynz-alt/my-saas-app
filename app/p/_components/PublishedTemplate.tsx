export type PublishedSpec = {
  brand?: { name?: string; tagline?: string };
  hero?: { headline?: string; subheadline?: string; primaryCta?: string; secondaryCta?: string };
  features?: Array<{ title: string; desc: string }>;
  pricing?: {
    free?: { name?: string; price?: string; bullets?: string[]; cta?: string };
    pro?: { name?: string; price?: string; bullets?: string[]; cta?: string };
  };
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
      {children}
    </span>
  );
}

function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/30";
  const styles =
    variant === "primary"
      ? "bg-white text-black hover:bg-white/90"
      : "border border-white/15 bg-white/5 text-white hover:bg-white/10";
  return (
    <a className={`${base} ${styles}`} href={href}>
      {children}
    </a>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-white/70">{label}</div>
    </div>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-base font-semibold">{title}</div>
      <div className="mt-2 text-sm leading-6 text-white/70">{desc}</div>
    </div>
  );
}

const FALLBACK: Required<PublishedSpec> = {
  brand: { name: "Rovez", tagline: "Ship a polished site fast." },
  hero: {
    headline: "A polished site you can ship in minutes.",
    subheadline:
      "This page now supports spec-driven rendering. Next: wire your generator to fill the spec fields automatically.",
    primaryCta: "Open Builder",
    secondaryCta: "Refresh",
  },
  features: [
    { title: "Clean hero + CTA", desc: "Strong headline, tight subcopy, clear action above the fold." },
    { title: "Trust & proof", desc: "Testimonials + simple metrics reduce friction and build credibility." },
    { title: "Simple pricing", desc: "Upgrade-friendly pricing layout that stays readable." },
    { title: "Fast + responsive", desc: "Mobile-first spacing and typography that looks premium." },
    { title: "SEO-friendly", desc: "Structure that maps cleanly to metadata later." },
    { title: "Agent-ready", desc: "Agents can update copy safely without breaking layout." },
  ],
  pricing: {
    free: { name: "Free", price: "$0", bullets: ["Core template", "Basic SEO", "Public URL"], cta: "Use Free" },
    pro: { name: "Pro", price: "$19", bullets: ["Conversion agent", "Finish-for-me upgrades", "Better templates"], cta: "Upgrade" },
  },
};

export function PublishedTemplate({
  projectId,
  spec,
  buildTag,
}: {
  projectId: string;
  spec: PublishedSpec | null;
  buildTag: string;
}) {
  const merged: Required<PublishedSpec> = {
    brand: { ...FALLBACK.brand, ...(spec?.brand || {}) },
    hero: { ...FALLBACK.hero, ...(spec?.hero || {}) },
    features: (spec?.features?.length ? spec.features : FALLBACK.features) as any,
    pricing: {
      free: { ...FALLBACK.pricing.free, ...(spec?.pricing?.free || {}) },
      pro: { ...FALLBACK.pricing.pro, ...(spec?.pricing?.pro || {}) },
    },
  };

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.28),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_15%_35%,rgba(34,197,94,0.12),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_85%_30%,rgba(236,72,153,0.14),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <header className="mx-auto max-w-6xl px-6 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <span className="text-sm font-bold">{(merged.brand.name || "R")[0]}</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{merged.brand.name}</div>
              <div className="text-xs text-white/60">{merged.brand.tagline}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge>Project: {projectId.slice(0, 8)}…</Badge>
            <Badge>build: {buildTag}</Badge>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-10 pt-14">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge>Live • Public</Badge>
              <Badge>{spec ? "Spec: loaded" : "Spec: fallback"}</Badge>
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{merged.hero.headline}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/70">{merged.hero.subheadline}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href={`/projects/${projectId}`}>{merged.hero.primaryCta}</ButtonLink>
              <ButtonLink href={`/p/${projectId}?ts=${Date.now()}`} variant="secondary">
                {merged.hero.secondaryCta}
              </ButtonLink>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Stat label="Spec mode" value={spec ? "REAL" : "FALLBACK"} />
              <Stat label="Sections" value={`${merged.features.length}`} />
              <Stat label="Ready" value="✅" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Preview</div>
                <div className="text-xs text-white/60">spec-driven template</div>
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-lg font-bold">{merged.hero.headline}</div>
                <div className="mt-2 text-sm leading-6 text-white/70">{merged.hero.subheadline}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Features</h2>
          <p className="mt-2 text-sm text-white/70">These are now driven by the stored spec (with fallback).</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {merged.features.map((f, i) => (
            <Card key={i} title={f.title} desc={f.desc} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Pricing</h2>
          <p className="mt-2 text-sm text-white/70">Swap these from your spec whenever you want.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{merged.pricing.free.name}</div>
              <Badge>Starter</Badge>
            </div>
            <div className="mt-4 text-3xl font-bold">{merged.pricing.free.price}</div>
            <ul className="mt-6 space-y-3 text-sm text-white/75">
              {(merged.pricing.free.bullets || []).map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
            <div className="mt-7">
              <ButtonLink href={`/projects/${projectId}`} variant="secondary">
                {merged.pricing.free.cta}
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{merged.pricing.pro.name}</div>
              <Badge>Best value</Badge>
            </div>
            <div className="mt-4 text-3xl font-bold">{merged.pricing.pro.price}</div>
            <ul className="mt-6 space-y-3 text-sm text-white/75">
              {(merged.pricing.pro.bullets || []).map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
            <div className="mt-7">
              <ButtonLink href={`/projects/${projectId}`}>{merged.pricing.pro.cta}</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-white/60">
          © {new Date().getFullYear()} {merged.brand.name} — Published Site
        </div>
      </footer>
    </main>
  );
}
