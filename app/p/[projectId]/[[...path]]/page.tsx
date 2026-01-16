export const runtime = "nodejs";

type Props = {
  params: { projectId: string; path?: string[] };
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

export default function PublishedCatchAll({ params }: Props) {
  const projectId = params.projectId;

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.28),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_15%_35%,rgba(34,197,94,0.12),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_85%_30%,rgba(236,72,153,0.14),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* Top bar */}
      <header className="mx-auto max-w-6xl px-6 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <span className="text-sm font-bold">R</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Rovez</div>
              <div className="text-xs text-white/60">Published Site</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge>Project: {projectId.slice(0, 8)}…</Badge>
            <a
              className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10 md:inline-flex"
              href="/"
            >
              Home
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-14">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge>Live • Public</Badge>
              <Badge>Catch-all route</Badge>
              <Badge>No redirects</Badge>
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              A polished site you can ship in minutes.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
              You’re viewing the published site. Any extra path under /p/{projectId}/...
              routes here without redirects.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href={`/projects/${projectId}`}>Open Builder</ButtonLink>
              <ButtonLink href={`/p/${projectId}?ts=${Date.now()}`} variant="secondary">
                Refresh
              </ButtonLink>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Stat label="Setup time" value="~2 min" />
              <Stat label="Sections" value="7+" />
              <Stat label="Mobile-ready" value="100%" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Preview</div>
                <div className="text-xs text-white/60">polished template</div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-lg font-bold">Convert visitors into customers</div>
                <div className="mt-2 text-sm leading-6 text-white/70">
                  Clean structure with clear CTA. Next step: render from your spec.
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                    SEO-ready
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                    Fast
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                    Clean UI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Built for conversion</h2>
          <p className="mt-2 text-sm text-white/70">
            Premium baseline layout you can swap to spec-driven content next.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Clean hero + CTA" desc="Strong headline, tight subcopy, clear action above the fold." />
          <Card title="Trust & proof" desc="Testimonials + simple metrics to reduce friction and build credibility." />
          <Card title="Simple pricing" desc="Easy-to-understand pricing layout that’s upgrade-friendly." />
          <Card title="Fast + responsive" desc="Mobile-first spacing and typography that looks premium." />
          <Card title="SEO-friendly" desc="Structure that maps cleanly to metadata and programmatic SEO later." />
          <Card title="Agent-ready" desc="Your agents can update copy and sections without breaking layout." />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="text-2xl font-bold">Next: render from spec</div>
              <div className="mt-2 text-sm text-white/70">
                We’ll pull your stored site spec and populate this template with real content.
              </div>
            </div>
            <div className="flex gap-3">
              <ButtonLink href={`/projects/${projectId}`}>Open Builder</ButtonLink>
              <ButtonLink href={`/p/${projectId}?ts=${Date.now()}`} variant="secondary">
                View Live
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-white/60">
          © {new Date().getFullYear()} Rovez — Published Site
        </div>
      </footer>
    </main>
  );
}
