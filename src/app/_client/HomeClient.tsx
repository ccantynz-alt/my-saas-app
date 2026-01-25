"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Step = {
  title: string;
  desc: string;
  status?: "idle" | "active" | "done";
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function useIsMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function fmtPct(n: number) {
  const v = Math.round(n * 100) / 100;
  return `${v}%`;
}

function SigBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] tracking-wide text-white/80 shadow-[0_18px_55px_rgba(0,0,0,0.45)]">
      <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,0.35)]" />
      {children}
    </span>
  );
}

function Hairline() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />;
}

function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/12 bg-white/[0.06] shadow-[0_28px_110px_rgba(0,0,0,0.70),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[14px]",
        className
      )}
    >
      {children}
    </div>
  );
}

function PrimaryButton({
  children,
  href = "#",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="group relative inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-black shadow-[0_28px_90px_rgba(0,0,0,0.65)] transition hover:-translate-y-[1px] active:translate-y-0"
      style={{
        background:
          "linear-gradient(90deg, rgba(56,189,248,1), rgba(168,85,247,1), rgba(34,197,94,1))",
      }}
    >
      <span className="relative z-10">{children}</span>
      {/* sheen */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <span className="absolute inset-[-40%] translate-x-[-60%] rotate-[12deg] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition duration-700 group-hover:opacity-60 group-hover:translate-x-[160%]" />
      </span>
    </a>
  );
}

function SecondaryButton({
  children,
  href = "#",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white/85 shadow-[0_18px_55px_rgba(0,0,0,0.45)] transition hover:border-white/18 hover:bg-white/[0.065]"
    >
      {children}
    </a>
  );
}

function Metric({
  k,
  v,
  hint,
}: {
  k: string;
  v: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-lg font-semibold text-white/90">{v}</div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-white/55">
        {k}
      </div>
      {hint ? (
        <div className="mt-2 text-xs leading-relaxed text-white/60">{hint}</div>
      ) : null}
    </div>
  );
}

function LogoPills() {
  const items = ["ACME", "NORTHSTAR", "CLOUDLY", "VECTOR", "ARCADIA"];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((x) => (
        <span
          key={x}
          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold tracking-[0.22em] text-white/55"
        >
          {x}
        </span>
      ))}
      <span className="text-xs text-white/45">+ your logo here</span>
    </div>
  );
}

function TechBackdropSvg() {
  // Inline SVG: tech grid + rings + accents (no assets)
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="g1" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="rgba(56,189,248,0.35)" />
          <stop offset="40%" stopColor="rgba(168,85,247,0.22)" />
          <stop offset="80%" stopColor="rgba(34,197,94,0.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        <linearGradient id="gridLine" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.09)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <filter id="blur1" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>

        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 0.9 0"
            result="c"
          />
          <feMerge>
            <feMergeNode in="c" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <mask id="fadeMask">
          <rect width="1200" height="800" fill="white" />
          <rect
            width="1200"
            height="800"
            fill="black"
            opacity="0.0"
          />
        </mask>
      </defs>

      {/* base glow */}
      <rect width="1200" height="800" fill="url(#g1)" />

      {/* grid */}
      <g opacity="0.25" mask="url(#fadeMask)">
        {Array.from({ length: 18 }).map((_, i) => {
          const x = (i / 18) * 1200;
          return (
            <line
              key={`v-${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2={800}
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="1"
            />
          );
        })}
        {Array.from({ length: 12 }).map((_, i) => {
          const y = (i / 12) * 800;
          return (
            <line
              key={`h-${i}`}
              x1={0}
              y1={y}
              x2={1200}
              y2={y}
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="1"
            />
          );
        })}
      </g>

      {/* rings */}
      <g filter="url(#softGlow)" opacity="0.9">
        <circle
          cx="760"
          cy="260"
          r="165"
          fill="none"
          stroke="rgba(56,189,248,0.45)"
          strokeWidth="2"
        />
        <circle
          cx="760"
          cy="260"
          r="240"
          fill="none"
          stroke="rgba(168,85,247,0.30)"
          strokeWidth="2"
        />
        <circle
          cx="760"
          cy="260"
          r="320"
          fill="none"
          stroke="rgba(34,197,94,0.18)"
          strokeWidth="2"
        />
      </g>

      {/* accent lines */}
      <g opacity="0.85" filter="url(#blur1)">
        <path
          d="M180 590 C 320 500, 420 520, 560 430"
          stroke="rgba(56,189,248,0.40)"
          strokeWidth="6"
          fill="none"
        />
        <path
          d="M220 630 C 360 540, 470 560, 650 470"
          stroke="rgba(168,85,247,0.30)"
          strokeWidth="5"
          fill="none"
        />
      </g>
    </svg>
  );
}

export default function HomeClient() {
  const isMounted = useIsMounted();

  // ------------------------------------------------------
  // Session-only auto demo (preserve V9 behavior)
  // ------------------------------------------------------
  const demoKey = "d8_home_demo_ran_v1";
  const [demoRan, setDemoRan] = useState(false);

  // ------------------------------------------------------
  // Parallax / depth (V10) — subtle, tasteful, safe
  // ------------------------------------------------------
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);

  useEffect(() => {
    if (!isMounted) return;

    // Auto-demo once per session
    try {
      const already = sessionStorage.getItem(demoKey) === "1";
      if (!already) {
        sessionStorage.setItem(demoKey, "1");
        setDemoRan(true);
      } else {
        setDemoRan(false);
      }
    } catch {
      setDemoRan(false);
    }
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const el = heroRef.current;
    if (!el) return;

    let raf = 0;

    function onMove(e: PointerEvent) {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / Math.max(1, r.width);
      const py = (e.clientY - r.top) / Math.max(1, r.height);
      const dx = clamp((px - 0.5) * 2, -1, 1);
      const dy = clamp((py - 0.5) * 2, -1, 1);

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setMx(dx);
        setMy(dy);
      });
    }

    function onLeave() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setMx(0);
        setMy(0);
      });
    }

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove as any);
      el.removeEventListener("pointerleave", onLeave as any);
    };
  }, [isMounted]);

  const depth = useMemo(() => {
    // these are intentionally small to avoid “cheap parallax”
    const tiltX = my * -2.2; // deg
    const tiltY = mx * 2.4;  // deg
    const driftX = mx * 18;  // px
    const driftY = my * 14;  // px
    const glowX = mx * 24;
    const glowY = my * 18;
    return { tiltX, tiltY, driftX, driftY, glowX, glowY };
  }, [mx, my]);

  // ------------------------------------------------------
  // Live stamps / probe (preserve V9 expectations)
  // ------------------------------------------------------
  const stamp = useMemo(() => new Date().toISOString(), []);
  const [probeOk, setProbeOk] = useState<null | boolean>(null);

  useEffect(() => {
    if (!isMounted) return;

    const url = `/api/__probe__?ts=${Date.now()}`;
    fetch(url, { cache: "no-store" })
      .then((r) => setProbeOk(r.ok))
      .catch(() => setProbeOk(false));
  }, [isMounted]);

  // ------------------------------------------------------
  // Demo steps (presentation-grade)
  // ------------------------------------------------------
  const steps: Step[] = useMemo(
    () => [
      { title: "Brand + Offer", desc: "Tone, positioning, hero promise, CTA hierarchy.", status: "done" },
      { title: "Pages + Layout", desc: "Homepage, pricing, FAQ, contact — rhythm that sells.", status: "done" },
      { title: "SEO + Sitemap", desc: "Metadata plan, sitemap, robots, publish sanity checks.", status: "active" },
      { title: "Publish", desc: "Deploy proof + domain readiness so you trust what’s live.", status: "idle" },
    ],
    []
  );

  const trustMode = useMemo(() => {
    if (probeOk === null) return "Trust Mode: verifying…";
    if (probeOk === true) return "Trust Mode: LIVE_OK (probe no-store)";
    return "Trust Mode: WARN (probe failed)";
  }, [probeOk]);

  // ------------------------------------------------------
  // Motion: micro-kick + shock rings (keep but refine)
  // ------------------------------------------------------
  const [kick, setKick] = useState(false);
  useEffect(() => {
    if (!isMounted) return;
    setKick(true);
    const t = setTimeout(() => setKick(false), 900);
    return () => clearTimeout(t);
  }, [isMounted]);

  return (
    <main className="min-h-screen bg-[#05060A] text-white/90">
      {/* Backdrop (tech svg + glow layers) */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-[0.85]"
          style={{
            transform: `translate3d(${depth.driftX * 0.25}px, ${depth.driftY * 0.20}px, 0)`,
            transition: "transform 120ms ease-out",
          }}
        >
          <TechBackdropSvg />
        </div>

        {/* animated glow blob */}
        <div
          className="absolute left-1/2 top-[-12%] h-[520px] w-[920px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 35% 40%, rgba(56,189,248,0.40), transparent 55%), radial-gradient(circle at 65% 45%, rgba(168,85,247,0.34), transparent 60%), radial-gradient(circle at 50% 75%, rgba(34,197,94,0.16), transparent 55%)",
            transform: `translate3d(${depth.glowX * 0.20}px, ${depth.glowY * 0.20}px, 0)`,
            transition: "transform 120ms ease-out",
          }}
        />

        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_30%,rgba(0,0,0,0),rgba(0,0,0,0.50)_70%,rgba(0,0,0,0.80)_100%)]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_18px_55px_rgba(0,0,0,0.45)]">
              <div
                className="h-3 w-3 rounded-full shadow-[0_0_24px_rgba(255,255,255,0.35)]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(56,189,248,1), rgba(168,85,247,1), rgba(34,197,94,1))",
                }}
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-white/90">Dominat8</div>
              <div className="text-xs text-white/55">Homepage V10 • Signature Polish</div>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
            <a className="transition hover:text-white/90" href="#how">How it works</a>
            <a className="transition hover:text-white/90" href="#proof">Credibility</a>
            <a className="transition hover:text-white/90" href="#cta">Launch</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/templates"
              className="hidden rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/80 shadow-[0_18px_55px_rgba(0,0,0,0.45)] transition hover:border-white/15 hover:bg-white/[0.065] md:inline-flex"
            >
              Browse templates
            </a>
            <PrimaryButton href="/app">Launch builder</PrimaryButton>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6">
          <Hairline />
        </div>
      </header>

      {/* HERO (Fullscreen) */}
      <section className="relative z-10">
        <div
          ref={heroRef}
          className="mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-12 md:py-14"
        >
          {/* Left: copy */}
          <div className="md:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <SigBadge>LIVE_OK • fullscreen hero • visible glass</SigBadge>
              <span className="text-xs text-white/55">HOME_STAMP: {stamp}</span>
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
                flagship website
              </span>{" "}
              that looks expensive.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              Dominat8 generates a clean, premium site structure — hero, sections, pages, SEO plan, sitemap —
              then gives you the controls to iterate without chaos.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryButton href="/app">Generate my site</PrimaryButton>
              <SecondaryButton href="/pricing">See pricing</SecondaryButton>
              <div className="text-xs text-white/55">
                Trust-first output • deploy proof • no guessing
              </div>
            </div>

            {/* Trust strip */}
            <div className="mt-8">
              <GlassCard className="p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        probeOk === null ? "bg-white/50" : probeOk ? "bg-emerald-400" : "bg-amber-300"
                      )}
                    />
                    <div className="text-xs font-semibold text-white/85">{trustMode}</div>
                  </div>
                  <div className="text-xs text-white/55">
                    Probe fetched with <span className="text-white/70">cache: no-store</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Enterprise credibility strip (V10) */}
            <div id="proof" className="mt-8">
              <GlassCard className="p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.32em] text-white/55">
                      Enterprise credibility
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white/90">
                      Built for speed, SEO hygiene, and publish confidence.
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-white/65">
                      This strip is deliberately “serious SaaS”: metrics + proof markers + placeholders for logos.
                    </div>
                  </div>
                  <div className="md:text-right">
                    <div className="text-xs text-white/55">Proof marker:</div>
                    <div className="mt-1 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-[11px] text-white/70">
                      ROUTE_PROOF • HOME_OK • {stamp}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <Metric k="Speed to first build" v="Minutes" hint="Structured output that’s usable immediately." />
                  <Metric k="SEO baseline" v="Planned" hint="Metadata + sitemap + robots (publish-ready habits)." />
                  <Metric k="Deploy confidence" v="Proof" hint="Stamps + probe checks to reduce doubt." />
                </div>

                <div className="mt-6">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-white/50">
                    Trusted by teams (placeholders)
                  </div>
                  <div className="mt-3">
                    <LogoPills />
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Right: demo panel (glass + depth tilt) */}
          <div className="md:col-span-5">
            <div
              className="relative"
              style={{
                transform: `perspective(900px) rotateX(${depth.tiltX}deg) rotateY(${depth.tiltY}deg) translate3d(0,0,0)`,
                transformStyle: "preserve-3d",
                transition: "transform 120ms ease-out",
              }}
            >
              {/* outer gradient border */}
              <div className="absolute inset-0 rounded-3xl opacity-80"
                style={{
                  background:
                    "linear-gradient(140deg, rgba(56,189,248,0.55), rgba(168,85,247,0.42), rgba(34,197,94,0.22))",
                  filter: "blur(0px)",
                }}
              />
              <div className="relative rounded-3xl p-[1px]">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-white/90">Auto Demo</div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-white/60">
                      {demoRan ? "ran this session" : "ready"}
                    </span>
                  </div>

                  {/* micro-kick + shock rings */}
                  <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-5">
                    <div
                      className={cn(
                        "absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0",
                        kick && "opacity-100"
                      )}
                      style={{
                        border: "1px solid rgba(255,255,255,0.20)",
                        boxShadow: "0 0 80px rgba(56,189,248,0.10)",
                        transform: `translate(-50%, -50%) scale(${kick ? 1.15 : 0.85})`,
                        transition: "transform 900ms ease-out, opacity 900ms ease-out",
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-70"
                      style={{
                        background:
                          "radial-gradient(circle at 35% 30%, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at 75% 35%, rgba(168,85,247,0.14), transparent 60%), radial-gradient(circle at 55% 80%, rgba(34,197,94,0.08), transparent 55%)",
                      }}
                    />
                    <div className="relative">
                      <div className="text-xs uppercase tracking-[0.28em] text-white/55">
                        Pipeline Preview
                      </div>
                      <div className="mt-2 text-sm font-semibold text-white/90">
                        Structured steps that feel “finish-for-me”
                      </div>
                      <div className="mt-4 space-y-3">
                        {steps.map((s) => (
                          <div
                            key={s.title}
                            className={cn(
                              "rounded-2xl border p-4 transition",
                              s.status === "done"
                                ? "border-white/12 bg-white/[0.05]"
                                : s.status === "active"
                                ? "border-white/18 bg-white/[0.07]"
                                : "border-white/10 bg-white/[0.04]"
                            )}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="text-xs font-semibold text-white/85">
                                {s.title}
                              </div>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.22em]",
                                  s.status === "done"
                                    ? "bg-emerald-500/15 text-emerald-200 border border-emerald-400/25"
                                    : s.status === "active"
                                    ? "bg-sky-500/15 text-sky-200 border border-sky-400/25"
                                    : "bg-white/5 text-white/55 border border-white/10"
                                )}
                              >
                                {s.status ?? "idle"}
                              </span>
                            </div>
                            <div className="mt-1 text-xs leading-relaxed text-white/60">
                              {s.desc}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <a
                          href="/templates"
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs font-semibold text-white/85 transition hover:border-white/15 hover:bg-white/[0.065]"
                        >
                          Explore templates
                        </a>
                        <a
                          href="/use-cases"
                          className="rounded-2xl px-4 py-3 text-center text-xs font-semibold text-black transition hover:-translate-y-[1px]"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(56,189,248,1), rgba(168,85,247,1), rgba(34,197,94,1))",
                          }}
                        >
                          See use-cases
                        </a>
                      </div>

                      <div className="mt-5 text-[11px] text-white/50">
                        Depth: <span className="text-white/70">{fmtPct((Math.abs(mx) + Math.abs(my)) * 20)}</span>{" "}
                        • Tilt: <span className="text-white/70">{Math.round(depth.tiltY)}°/{Math.round(depth.tiltX)}°</span>
                      </div>
                    </div>
                  </div>

                  {/* Route proof (keep anxiety-killer) */}
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-xs text-white/70">
                    <div className="font-semibold text-white/85">ROUTE_PROOF</div>
                    <div className="mt-1">
                      If you see this, you are on the deployed homepage route.
                    </div>
                    <div className="mt-2 text-white/55">HOME_STAMP: {stamp}</div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 pb-16">
          <GlassCard className="p-8 md:p-10">
            <div className="text-xs uppercase tracking-[0.32em] text-white/55">How it works</div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white/90 md:text-3xl">
              Premium rhythm. Clean hierarchy. No clutter.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              The homepage isn’t trying to be clever. It’s trying to look trustworthy:
              spacing, type, glass depth, a signature gradient, and proof markers that end doubt.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm font-semibold text-white/90">Brand pass</div>
                <div className="mt-2 text-sm text-white/65">
                  Dominat8’s signature accent is now consistent across CTAs, highlights, and demo.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm font-semibold text-white/90">Depth pass</div>
                <div className="mt-2 text-sm text-white/65">
                  Subtle parallax + tilt gives “expensive” without looking gimmicky.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm font-semibold text-white/90">Credibility pass</div>
                <div className="mt-2 text-sm text-white/65">
                  Enterprise strip: metrics + proof markers + logos (placeholders).
                </div>
              </div>
            </div>

            <div id="cta" className="mt-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="text-sm text-white/65">
                Next optional polish: scroll-reveal section animations + richer “SiteGround-style” feature tiles.
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href="/app">Start now</PrimaryButton>
                <SecondaryButton href="/templates">Browse templates</SecondaryButton>
              </div>
            </div>

            <div className="mt-8">
              <Hairline />
              <div className="mt-5 flex flex-col justify-between gap-2 text-xs text-white/50 md:flex-row">
                <div>© {new Date().getFullYear()} Dominat8 • Presentation-grade baseline</div>
                <div>HOME_OK • {stamp}</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}