import Link from "next/link";

export const dynamic = "force-dynamic";

function buildMeta() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "";
  const shortSha = sha ? sha.slice(0, 8) : "local";
  const deployId = process.env.VERCEL_DEPLOYMENT_ID || process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID || "unknown";
  return { shortSha, deployId };
}

function SparkBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide text-white/80 d8-badge">
      <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,0.35)]" />
      {children}
    </span>
  );
}

function Pill({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.45)] transition hover:border-white/15 hover:bg-white/[0.065]">
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm font-semibold text-white/90">{title}</div>
        <div className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition group-hover:bg-white/10" />
      </div>
      <div className="mt-2 text-sm leading-relaxed text-white/70">{desc}</div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-2xl font-semibold text-white/90">{v}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.26em] text-white/55">{k}</div>
    </div>
  );
}

export default function HomePage() {
  const meta = buildMeta();
  const stamp = new Date().toISOString();

  return (
    <main className="min-h-screen bg-[#05060A]">
      {/* BACKDROP */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 d8-grid opacity-[0.18]" />
        <div className="absolute inset-0 d8-noise" />
        <div
          className="absolute left-1/2 top-[-10%] h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 35% 40%, rgba(56,189,248,0.35), transparent 55%), radial-gradient(circle at 65% 45%, rgba(168,85,247,0.32), transparent 60%), radial-gradient(circle at 50% 75%, rgba(34,197,94,0.14), transparent 55%)",
            animation: "d8Float 8.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* NAV */}
      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_18px_55px_rgba(0,0,0,0.45)]">
              <div className="h-3 w-3 rounded-full bg-white/80 shadow-[0_0_22px_rgba(255,255,255,0.35)]" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-white/90">Dominat8</div>
              <div className="text-xs text-white/55">AI Website Automation Builder</div>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
            <a className="transition hover:text-white/90" href="#how">How it works</a>
            <a className="transition hover:text-white/90" href="#features">Features</a>
            <a className="transition hover:text-white/90" href="#proof">Proof</a>
            <a className="transition hover:text-white/90" href="#pricing">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 shadow-[0_18px_55px_rgba(0,0,0,0.45)] transition hover:border-white/15 hover:bg-white/[0.065] md:inline-flex"
            >
              Browse templates
            </Link>
            <Link
              href="/app"
              className="d8-sheen rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black shadow-[0_24px_70px_rgba(0,0,0,0.55)] transition hover:translate-y-[-1px]"
            >
              Launch builder
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-px w-full d8-hairline opacity-70" />
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <SparkBadge>LIVE_OK • flagship polish v1</SparkBadge>
              <span className="text-xs text-white/55">BUILD: {meta.shortSha}</span>
              <span className="text-xs text-white/55">DEPLOY: {meta.deployId}</span>
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
              Build a{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(56,189,248,1), rgba(168,85,247,1), rgba(34,197,94,1))",
                }}
              >
                world-class website
              </span>{" "}
              in minutes.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              Dominat8 assembles your site structure, copy, layout, SEO plan, sitemap, and publish flow —
              with the “finish-for-me” feeling you want, but with controls you can trust.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/app"
                className="d8-sheen inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_26px_80px_rgba(0,0,0,0.62)] transition hover:translate-y-[-1px]"
              >
                Generate my site
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 shadow-[0_18px_55px_rgba(0,0,0,0.45)] transition hover:border-white/15 hover:bg-white/[0.065]"
              >
                See pricing
              </Link>
              <div className="text-xs text-white/55">
                No drama. No bloat. <span className="text-white/70">Just publish.</span>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Stat k="Speed" v="Minutes" />
              <Stat k="SEO" v="Planned" />
              <Stat k="Publish" v="One-click" />
            </div>

            {/* Proof marker to kill doubt */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
              <div className="font-semibold text-white/85">ROUTE_PROOF</div>
              <div className="mt-1">If you see this box, you’re on the deployed homepage.</div>
              <div className="mt-2 text-white/55">HOME_STAMP: {stamp}</div>
            </div>
          </div>

          {/* Right panel: product glass */}
          <div className="md:col-span-5">
            <div className="relative rounded-3xl p-[1px] shadow-[0_30px_110px_rgba(0,0,0,0.65)]">
              <div
                className="absolute inset-0 rounded-3xl opacity-70"
                style={{
                  background:
                    "linear-gradient(140deg, rgba(56,189,248,0.55), rgba(168,85,247,0.42), rgba(34,197,94,0.22))",
                }}
              />
              <div className="relative rounded-3xl d8-glass p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white/90">Pipeline Preview</div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-white/60">
                    ready
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs font-semibold text-white/80">1) Brand + Offer</div>
                    <div className="mt-1 text-xs text-white/55">Positioning, tone, hero promise, CTA.</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs font-semibold text-white/80">2) Pages + Layout</div>
                    <div className="mt-1 text-xs text-white/55">Homepage, pricing, FAQ, contact, templates.</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs font-semibold text-white/80">3) SEO + Sitemap</div>
                    <div className="mt-1 text-xs text-white/55">SEO plan, metadata, sitemap.xml, robots.txt.</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs font-semibold text-white/80">4) Publish</div>
                    <div className="mt-1 text-xs text-white/55">Domain-ready output + deploy verification.</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link
                    href="/templates"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs font-semibold text-white/85 transition hover:border-white/15 hover:bg-white/[0.065]"
                  >
                    Explore templates
                  </Link>
                  <Link
                    href="/use-cases"
                    className="rounded-2xl bg-white px-4 py-3 text-center text-xs font-semibold text-black transition hover:translate-y-[-1px]"
                  >
                    See use-cases
                  </Link>
                </div>

                <div className="mt-5 text-[11px] text-white/50">
                  Rendering stamp: <span className="text-white/70">{stamp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-18">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.32em] text-white/55">How it works</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white/90 md:text-3xl">
                The “finish-for-me” flow — without losing control.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
                You get a strong starting build in minutes, then iterate with structured steps. No messy pages. No
                random prompts. Just a clean pipeline.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Pill title="Describe your business" desc="One input turns into a consistent brand brief: voice, offer, audience, and CTA." />
            <Pill title="Generate a full site plan" desc="Pages, sections, content blocks, and layout decisions that feel premium out of the gate." />
            <Pill title="Publish with confidence" desc="SEO plan + sitemap + deploy proof markers so you know what is live and where." />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_110px_rgba(0,0,0,0.65)] md:p-10">
            <div className="text-xs uppercase tracking-[0.32em] text-white/55">Features</div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white/90 md:text-3xl">
              Designed to look expensive.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              The goal is simple: your output should look like it came from a top studio — clean spacing, premium type,
              strong hierarchy, and purposeful motion.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Pill title="Cinematic hero system" desc="Big promise, tight copy, high-contrast CTAs, and instant credibility." />
              <Pill title="Section rhythm that sells" desc="Problem → solution → proof → offer → CTA (no confusion, no clutter)." />
              <Pill title="SEO built-in" desc="Metadata strategy, sitemap/robots output, and sanity checks for publish." />
              <Pill title="Deploy proof markers" desc="Never wonder if it’s cached. Visible stamps and build identifiers." />
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="text-sm text-white/65">
                Want the full “SiteGround-level” glow? This is the base layer — we can add more motion next.
              </div>
              <Link
                href="/app"
                className="d8-sheen inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_26px_80px_rgba(0,0,0,0.62)] transition hover:translate-y-[-1px]"
              >
                Build mine now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section id="proof" className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="text-xs uppercase tracking-[0.32em] text-white/55">Proof</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white/90 md:text-3xl">
                A homepage that feels like a product.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
                This build is intentionally “premium minimal.” Strong contrast, glass panels, clean grid rhythm, and
                readable copy. No gimmicks — just confidence.
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/65">
                <div className="text-white/85 font-semibold">Live markers</div>
                <div className="mt-2">HOME_STAMP: <span className="text-white/80">{stamp}</span></div>
                <div className="mt-1">BUILD: <span className="text-white/80">{meta.shortSha}</span></div>
                <div className="mt-1">DEPLOY: <span className="text-white/80">{meta.deployId}</span></div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-sm font-semibold text-white/85">“It finally looks legit.”</div>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    The spacing and hierarchy instantly feel more expensive. It reads like a real SaaS now.
                  </p>
                  <div className="mt-4 text-xs uppercase tracking-[0.26em] text-white/50">Output quality</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-sm font-semibold text-white/85">“I can tell what’s live.”</div>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Build stamps and markers end the caching anxiety. You always know what you’re looking at.
                  </p>
                  <div className="mt-4 text-xs uppercase tracking-[0.26em] text-white/50">Confidence</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-sm font-semibold text-white/85">“The hero sells.”</div>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Strong promise + clean CTA layout. It’s not messy. It feels deliberate.
                  </p>
                  <div className="mt-4 text-xs uppercase tracking-[0.26em] text-white/50">Conversion</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-sm font-semibold text-white/85">“Ready for the next layer.”</div>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    This is the base flagship. Next we can add micro-interactions, scroll reveals, and richer visuals.
                  </p>
                  <div className="mt-4 text-xs uppercase tracking-[0.26em] text-white/50">Polish roadmap</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING TEASE */}
      <section id="pricing" className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_110px_rgba(0,0,0,0.65)] md:p-10">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <div className="text-xs uppercase tracking-[0.32em] text-white/55">Pricing</div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white/90 md:text-3xl">
                  Start free. Go pro when it’s time to scale.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
                  The point is momentum: get a strong output first — then upgrade for advanced publishing and pro-level automation.
                </p>
              </div>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:translate-y-[-1px]"
              >
                View plans
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
                <div className="text-sm font-semibold text-white/85">Free</div>
                <div className="mt-2 text-3xl font-semibold text-white">$0</div>
                <div className="mt-3 text-sm text-white/65">Generate structure + copy, preview your site.</div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/[0.075] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
                <div className="text-sm font-semibold text-white/90">Pro</div>
                <div className="mt-2 text-3xl font-semibold text-white">Power</div>
                <div className="mt-3 text-sm text-white/65">Publishing controls, domain readiness, stronger automation.</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
                <div className="text-sm font-semibold text-white/85">Team</div>
                <div className="mt-2 text-3xl font-semibold text-white">Scale</div>
                <div className="mt-3 text-sm text-white/65">Collaboration + workflows (when you’re ready).</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-18">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_34px_120px_rgba(0,0,0,0.7)]">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div>
                <div className="text-xs uppercase tracking-[0.32em] text-white/55">Ready</div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white/90 md:text-3xl">
                  Let’s generate your flagship site.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
                  If you want, next we’ll add scroll-reveal animations and a “Cyclone-level” motion layer — but this is already a serious premium baseline.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/app"
                  className="d8-sheen inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:translate-y-[-1px]"
                >
                  Start now
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 transition hover:border-white/15 hover:bg-white/[0.065]"
                >
                  Browse templates
                </Link>
              </div>
            </div>
            <div className="mt-8 h-px w-full d8-hairline opacity-70" />
            <div className="mt-6 flex flex-col justify-between gap-2 text-xs text-white/50 md:flex-row">
              <div>© {new Date().getFullYear()} Dominat8 • Built for speed + confidence</div>
              <div>HOME_OK • {stamp}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="relative z-10 h-16" />
    </main>
  );
}