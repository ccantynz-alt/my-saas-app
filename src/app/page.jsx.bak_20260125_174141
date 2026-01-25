export const dynamic = "force-dynamic";

import { BUILD_MARKER, MONSTER_MARKER } from "../lib/buildMarker";
import { TopBar, HeaderNav, Footer } from "../components/marketing/MarketingShell";

function Pill({ children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs text-slate-700 ring-1 ring-slate-200 shadow-sm d8-fade-up d8-delay-0">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {children}
    </div>
  );
}

function LogoChip({ children }) {
  return (
    <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 shadow-sm">
      {children}
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div className="rounded-3xl bg-white/85 p-6 ring-1 ring-slate-200 shadow-sm d8-fade-up">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
          {n}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-950">{title}</div>
          <div className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function ExamplePreview() {
  // This is a “real output preview” card, designed to feel like a screenshot.
  // Next upgrade: swap this to pull a real preview thumbnail (gallery renderer).
  return (
    <div className="rounded-[2rem] bg-white/85 ring-1 ring-slate-200 shadow-sm overflow-hidden d8-fade-up d8-delay-4">
      <div className="px-6 py-4 border-b border-slate-200 bg-white/90">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
              D8
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-950">Example output</div>
              <div className="text-xs text-slate-500">Generated in minutes • publish-ready</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">{MONSTER_MARKER}</div>
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-3xl bg-white ring-1 ring-slate-200 overflow-hidden">
          {/* Fake “screenshot” hero */}
          <div className="h-44 d8-thumb-bg relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.0),rgba(255,255,255,0.65))]" />
            <div className="absolute left-6 top-6 flex items-center gap-2">
              <div className="h-8 w-8 rounded-2xl bg-slate-900" />
              <div className="h-3 w-28 rounded bg-slate-200" />
            </div>
            <div className="absolute left-6 bottom-6">
              <div className="h-4 w-60 rounded bg-slate-900/90" />
              <div className="mt-2 h-3 w-72 rounded bg-slate-900/20" />
              <div className="mt-2 flex gap-2">
                <div className="h-10 w-32 rounded-2xl bg-slate-900" />
                <div className="h-10 w-32 rounded-2xl bg-white ring-1 ring-slate-200" />
              </div>
            </div>
          </div>

          {/* Fake “sections” */}
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="h-3 w-24 rounded bg-slate-300" />
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-40 rounded bg-slate-200" />
                  <div className="h-2 w-36 rounded bg-slate-200" />
                  <div className="h-2 w-28 rounded bg-slate-200" />
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="h-3 w-24 rounded bg-slate-300" />
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-40 rounded bg-slate-200" />
                  <div className="h-2 w-36 rounded bg-slate-200" />
                  <div className="h-2 w-28 rounded bg-slate-200" />
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="h-3 w-24 rounded bg-slate-300" />
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-40 rounded bg-slate-200" />
                  <div className="h-2 w-36 rounded bg-slate-200" />
                  <div className="h-2 w-28 rounded bg-slate-200" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 shadow-sm d8-btn-lift"
                href="/p/new"
              >
                Generate this style
              </a>
              <a
                className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 shadow-sm d8-btn-lift"
                href="/gallery"
              >
                Browse more examples
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[11px] text-slate-500">
          Next upgrade: connect this preview to real published projects using the Gallery Preview Renderer.
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Premium bright background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_10%,rgba(59,130,246,0.16),transparent_55%),radial-gradient(900px_circle_at_80%_15%,rgba(16,185,129,0.14),transparent_55%),radial-gradient(700px_circle_at_50%_90%,rgba(99,102,241,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.74),rgba(255,255,255,1))]" />
      </div>

      <TopBar />
      <HeaderNav />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-6 pb-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Left */}
          <div className="max-w-2xl">
            <Pill>
              Premium, clean, fast — SiteGround-style build
              <span className="ml-2 font-mono text-slate-500">({BUILD_MARKER})</span>
            </Pill>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl d8-fade-up d8-delay-1">
              Build a website <br />
              that looks expensive. <br />
              Automatically.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-700 md:text-lg d8-fade-up d8-delay-2">
              Dominat8 generates a <span className="font-semibold text-slate-900">complete, production-ready website</span> from a brief —
              then runs pages, SEO, sitemap, and publish automatically (with controls you can trust).
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row d8-fade-up d8-delay-3">
              <a
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 shadow-sm d8-btn-lift"
                href="/p/new"
              >
                Generate my site
              </a>

              <a
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 shadow-sm d8-btn-lift"
                href="/gallery"
              >
                See real examples
              </a>
            </div>

            {/* Logos / Proof strip */}
            <div className="mt-8 d8-fade-up d8-delay-4">
              <div className="text-xs font-semibold text-slate-500">Built for</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <LogoChip>SaaS</LogoChip>
                <LogoChip>Local services</LogoChip>
                <LogoChip>AI tools</LogoChip>
                <LogoChip>Landing pages</LogoChip>
                <LogoChip>Agencies</LogoChip>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="w-full max-w-md d8-fade-up d8-delay-2">
            <div className="rounded-3xl bg-white/85 p-6 ring-1 ring-slate-200 shadow-sm d8-card-float">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500">Trusted quality</div>
                  <div className="mt-2 text-lg font-semibold text-slate-950">
                    Premium output, every time
                  </div>
                </div>
                <div className="text-amber-500 text-sm" aria-label="5 stars">
                  ★★★★★
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <div className="text-xs font-semibold text-slate-600">What you get</div>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> Homepage + marketing pages
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> SEO plan + sitemap
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> Publish-ready HTML
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 shadow-sm d8-btn-lift"
                  href="/pricing"
                >
                  View pricing
                </a>
                <a
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 shadow-sm d8-btn-lift"
                  href="/__status"
                >
                  Check status
                </a>
              </div>

              <div className="mt-4 text-[11px] text-slate-500">
                Marker: <span className="font-mono text-slate-700">{MONSTER_MARKER}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 steps) */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500">How it works</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              From brief → publish, without chaos
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              A tight workflow that produces consistent, conversion-ready pages — fast.
            </p>
          </div>
          <a className="hidden sm:inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 shadow-sm d8-btn-lift" href="/__status">
            See status
          </a>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="d8-delay-1">
            <Step n="1" title="Brief" desc="Tell us what you do. We extract structure, tone, and layout rhythm." />
          </div>
          <div className="d8-delay-2">
            <Step n="2" title="Generate" desc="Pages + content + components — polished, consistent, and brand-aligned." />
          </div>
          <div className="d8-delay-3">
            <Step n="3" title="Publish" desc="SEO, sitemap, HTML, domain — ready to ship when you are." />
          </div>
        </div>
      </section>

      {/* BIG EXAMPLE PREVIEW */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500">Example output</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              See what “expensive” looks like
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              This is the quality bar Dominat8 targets by default. Next upgrade: plug this into your real published sites.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <ExamplePreview />
        </div>
      </section>

      <Footer />
    </main>
  );
}
