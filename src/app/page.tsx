'use client';
/**
 * src/app/page.tsx
 * FLAGSHIP HOMEPAGE v1
 *
 * NOTE: This file is intentionally a client component to enable:
 *  - Psychroom-style header reveal on scroll
 *  - subtle motion / parallax feel
 *
 * It still renders fast and is safe for marketing.
 */

import React, { useEffect, useMemo, useState } from "react";

export const runtime = "nodejs";
// Keep iteration always-fresh during heavy changes:
export const dynamic = "force-dynamic";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs text-white/80">
      {children}
    </span>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-black hover:bg-white/90 transition"
    >
      {children}
    </a>
  );
}

function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-8 py-4 text-sm font-semibold text-white hover:bg-white/[0.12] transition"
    >
      {children}
    </a>
  );
}

function SectionTitle({ kicker, title, desc }: { kicker: string; title: string; desc: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="text-xs uppercase tracking-[0.28em] text-white/55">{kicker}</div>
      <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight text-white leading-[1.05]">
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-white/70">
        {desc}
      </p>
    </div>
  );
}

export default function Home() {
  const y = useScrollY();

  // Psychroom-style nav reveal: hidden at top, appears after small scroll.
  const navOn = y > 24;

  // Hero subtle parallax (tiny, premium)
  const glowTranslate = Math.min(40, y * 0.12);
  const heroShrink = Math.min(0.12, y / 2400); // tiny scale down on scroll
  const heroOpacity = Math.max(0.65, 1 - y / 1200);

  const build = useMemo(() => ({ stamp: "BUILD_20260124_231835", deployId: "4431d5695529" }), []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ====== PROBE OVERLAY (proves live + freshness) ====== */}
      <div className="fixed left-4 top-4 z-[9999] rounded-2xl border border-white/15 bg-black/70 px-4 py-3 text-left shadow-sm backdrop-blur">
        <div className="text-xs uppercase tracking-[0.28em] text-white/70">LIVE_OK</div>
        <div className="mt-1 text-sm font-semibold text-white">DEPLOY_ID: {build.deployId}</div>
        <div className="text-sm font-semibold text-white">BUILD_STAMP: {build.stamp}</div>
        <div className="mt-1 text-[11px] text-white/50">If you don’t see this box, you’re not on the deployed route.</div>
      </div>

      {/* ====== SCROLL REVEAL NAV (only on /) ====== */}
      <header
        className={cx(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          navOn ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none"
        )}
      >
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between px-4 py-3">
              <a className="flex items-center gap-2" href="/">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black text-sm font-semibold">
                  D8
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">Dominat8</div>
                  <div className="text-[11px] opacity-70">AI Website Builder</div>
                </div>
              </a>

              <nav className="hidden sm:flex items-center gap-2 text-sm">
                <a className="rounded-lg px-3 py-2 hover:bg-white/5 transition" href="/templates">Templates</a>
                <a className="rounded-lg px-3 py-2 hover:bg-white/5 transition" href="/use-cases">Use cases</a>
                <a className="rounded-lg px-3 py-2 hover:bg-white/5 transition" href="/pricing">Pricing</a>
                <a className="ml-2 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 transition" href="/templates">
                  Get started
                </a>
              </nav>

              <a className="sm:hidden inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 transition" href="/templates">
                Start
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ====== HERO: FULL SCREEN, CINEMATIC ====== */}
      <section className="relative flex min-h-[100svh] w-screen items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />
          <div className="absolute inset-0 opacity-60 d8-grid" />
          <div
            className="absolute left-1/2 top-1/2 h-[980px] w-[1500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/12 blur-3xl"
            style={{ transform: "translate(-50%, -50%) translateY(" + glowTranslate + "px)" }}
          />
          <div className="absolute inset-0 d8-vignette" style={{ opacity: heroOpacity }} />
        </div>

        {/* Foreground */}
        <div className="relative mx-auto w-full px-6 sm:px-8">
          <div
            className="mx-auto max-w-5xl text-center transition-transform duration-300"
            style={{ transform: "scale(" + (1 - heroShrink).toFixed(4) + ")" }}
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Pill>AI agents</Pill>
              <Pill>SEO-first</Pill>
              <Pill>Publish-ready</Pill>
              <Pill>No fluff</Pill>
            </div>

            <div className="mt-6 text-xs uppercase tracking-[0.28em] text-white/60">
              Build. Optimize. Publish. Repeat.
            </div>

            <h1 className="mt-5 text-[clamp(3.1rem,6.8vw,6.3rem)] font-semibold leading-[1.02] tracking-tight text-white">
              Websites that feel
              <span className="block text-white/80">premium —</span>
              <span className="block">built by automation.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base sm:text-lg leading-relaxed text-white/70">
              Dominat8 generates a complete site, locks in SEO-ready fundamentals, and gets you live fast.
              Stop tweaking. Start shipping.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <PrimaryButton href="/templates">Start building</PrimaryButton>
              <SecondaryButton href="/pricing">View pricing</SecondaryButton>
            </div>

            <div className="mt-10 text-[11px] text-white/45">HOME_OK</div>

            {/* Scroll cue */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2 text-xs text-white/45">
                <span className="inline-block h-6 w-[1px] bg-white/20" />
                <span>Scroll</span>
                <span className="inline-block h-6 w-[1px] bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CONVERSION SPINE ====== */}
      <section className="relative w-screen bg-black">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 py-20 sm:py-24">
          <SectionTitle
            kicker="Built for"
            title="Founders. Agencies. Operators."
            desc="If you ship sites for clients or launch products fast, Dominat8 is built to remove the busywork and keep the output sharp."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-sm font-semibold">Agencies</div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Repeatable templates + automation to ship client sites faster.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-sm font-semibold">Founders</div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Launch landing pages that don’t look DIY — without weeks of iteration.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-sm font-semibold">Local services</div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Locations, services, FAQs — built in a consistent structure for ranking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="relative w-screen bg-black">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 pb-20 sm:pb-24">
          <SectionTitle
            kicker="Outcomes"
            title="Less time tweaking. More time winning."
            desc="Dominat8 is built around results — speed, clarity, and pages that convert."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Launch in minutes", d: "Generate a full site structure, copy, and sections without staring at blank pages." },
              { t: "SEO-ready by default", d: "Clean structure, metadata, sitemap/robots fundamentals — no duct tape later." },
              { t: "Premium look, fast", d: "Strong typography rhythm and layout discipline out of the box." },
              { t: "Consistency at scale", d: "Templates and repeatable patterns for programmatic or multi-page sites." },
              { t: "Publish without drama", d: "Go live fast and iterate confidently — no mystery if it deployed." },
              { t: "Built for conversion", d: "Narrative pacing: qualify → outcomes → how it works → proof → CTA." },
            ].ForEach({
              # placeholder (PowerShell won't run here) - ignore
            })}
            {/* Render cards without array map to keep this file simple and robust */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-sm font-semibold">Launch in minutes</div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">Generate a full site structure, copy, and sections without staring at blank pages.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-sm font-semibold">SEO-ready by default</div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">Clean structure, metadata, sitemap/robots fundamentals — no duct tape later.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-sm font-semibold">Premium look, fast</div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">Strong typography rhythm and layout discipline out of the box.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-sm font-semibold">Consistency at scale</div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">Templates and repeatable patterns for programmatic or multi-page sites.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-sm font-semibold">Publish without drama</div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">Go live fast and iterate confidently — no mystery if it deployed.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-sm font-semibold">Built for conversion</div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">Narrative pacing: qualify → outcomes → how it works → proof → CTA.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative w-screen bg-black">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 pb-20 sm:pb-24">
          <SectionTitle
            kicker="How it works"
            title="Three steps. Clean output."
            desc="A calm workflow that turns intent into a launch-ready site."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black text-sm font-semibold">1</span>
                <div className="text-sm font-semibold">Describe</div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Tell Dominat8 what you’re building in one sentence. Pick a direction and audience.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black text-sm font-semibold">2</span>
                <div className="text-sm font-semibold">Generate</div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                AI agents draft the structure, copy, and SEO-ready fundamentals. You stay in control.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black text-sm font-semibold">3</span>
                <div className="text-sm font-semibold">Publish</div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Go live fast. Iterate confidently. Connect domains and keep shipping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof + final CTA */}
      <section className="relative w-screen bg-black">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 pb-24">
          <div className="rounded-3xl border border-white/12 bg-white/[0.05] p-8 sm:p-10 overflow-hidden">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="text-xs uppercase tracking-[0.28em] text-white/60">Ready to ship</div>
                <h3 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.05]">
                  Impress people the moment they land.
                </h3>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/70">
                  Start with a template, then let automation do the heavy lifting. You’ll know it’s live because the build stamp changes every run.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Pill>No credit card (optional)</Pill>
                  <Pill>Launch-ready</Pill>
                  <Pill>Cancel anytime</Pill>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <PrimaryButton href="/templates">Start building</PrimaryButton>
                <SecondaryButton href="/pricing">See pricing</SecondaryButton>
                <a className="text-center text-[11px] text-white/50 hover:text-white/70 transition" href="/use-cases">
                  See real use cases →
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center text-[11px] text-white/35">
            Flagship Homepage v1 • BUILD_STAMP: {build.stamp} • DEPLOY_ID: {build.deployId}
          </div>
        </div>
      </section>

      {/* Minimal footer for / only */}
      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 py-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-medium">Dominat8</div>
            <div className="text-xs text-white/45">© {new Date().getFullYear()} Dominat8.com • Built on Vercel</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/55">
            <a className="underline-offset-4 hover:underline" href="/pricing">Pricing</a>
            <a className="underline-offset-4 hover:underline" href="/templates">Templates</a>
            <a className="underline-offset-4 hover:underline" href="/use-cases">Use cases</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
