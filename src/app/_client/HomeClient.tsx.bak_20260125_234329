"use client";

import React from "react";

type ProbePayload = {
  ok: boolean;
  probe: string;
  serverTimeIso: string;
  serverTimeMs: number;
  rand: string;
  ts: string | null;
  env?: Record<string, string | null>;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

async function fetchProbe(ts: number): Promise<ProbePayload> {
  const r = await fetch(`/api/__probe__?ts=${ts}`, {
    method: "GET",
    cache: "no-store",
    headers: { "cache-control": "no-store" },
  });
  if (!r.ok) throw new Error(`Probe failed: ${r.status}`);
  return (await r.json()) as ProbePayload;
}

function formatRelative(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

function SplitBadge({ left, right }: { left: string; right: string }) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-white/12 bg-white/[0.05] text-xs text-white/80">
      <span className="px-4 py-2">{left}</span>
      <span className="h-5 w-px bg-white/12" />
      <span className="px-4 py-2 text-white/70">{right}</span>
    </div>
  );
}

function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.045] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_90px_rgba(0,0,0,0.62)] backdrop-blur",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)] bg-gradient-to-b from-white/10 via-white/0 to-white/0" />
      <div className="relative">{children}</div>
    </div>
  );
}

function Pill({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.040] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-24 bg-[radial-gradient(circle_at_40%_30%,rgba(168,85,247,0.20),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(59,130,246,0.14),transparent_55%),radial-gradient(circle_at_30%_80%,rgba(34,211,238,0.10),transparent_55%)]" />
      </div>
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-black/35">
            {icon}
          </div>
          <div className="text-base font-bold text-white/95">{title}</div>
        </div>
        <div className="mt-3 text-sm text-white/72 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="text-xs uppercase tracking-[0.28em] text-white/60">{k}</div>
      <div className="mt-2 text-sm font-semibold text-white/90">{v}</div>
    </div>
  );
}

function DividerLabel({ text }: { text: string }) {
  return (
    <div className="py-10">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <div className="text-xs uppercase tracking-[0.28em] text-white/55">{text}</div>
        <div className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  );
}

function ExampleCard({
  tag,
  title,
  desc,
  minutes,
}: {
  tag: string;
  title: string;
  desc: string;
  minutes: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.035] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-24 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.18),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.14),transparent_55%)]" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-3 py-1 text-xs text-white/75">
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" />
            {tag}
          </div>
          <div className="text-xs text-white/60">Generated in {minutes}</div>
        </div>

        <div className="mt-4 rounded-3xl border border-white/10 bg-black/25 p-4">
          <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))]">
            <div className="absolute inset-0 opacity-[0.52] bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.42),transparent_55%),radial-gradient(circle_at_82%_62%,rgba(59,130,246,0.32),transparent_60%)]" />
            <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:26px_26px]" />
            <div className="absolute -left-8 top-8 h-10 w-56 rotate-[-12deg] rounded-full bg-white/10 blur-xl" />
          </div>

          <div className="mt-4 text-sm font-bold text-white/92">{title}</div>
          <div className="mt-1 text-sm text-white/70">{desc}</div>

          <div className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.10]">
            View example
          </div>
        </div>
      </div>
    </div>
  );
}

function Testimonial({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.040] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="absolute inset-0 opacity-[0.40] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.18),transparent_60%),radial-gradient(circle_at_75%_60%,rgba(59,130,246,0.12),transparent_65%)]" />
      <div className="relative">
        <div className="text-sm text-white/80 leading-relaxed">“{quote}”</div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-white/90">{name}</div>
            <div className="text-xs text-white/60">{role}</div>
          </div>
          <div className="text-xs text-white/55">★★★★★</div>
        </div>
      </div>
    </div>
  );
}

export default function HomeClient() {
  const reducedMotion = usePrefersReducedMotion();

  const [clientStartMs] = React.useState<number>(() => Date.now());
  const [clientTs] = React.useState<number>(() => Math.floor(Date.now() / 1000));

  const [probe, setProbe] = React.useState<ProbePayload | null>(null);
  const [probeErr, setProbeErr] = React.useState<string | null>(null);
  const [probeOpen, setProbeOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  // Cursor light (soft spotlight + ring)
  const [mouse, setMouse] = React.useState<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const mouseRef = React.useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        setMouse(mouseRef.current);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  // Scroll var for subtle parallax
  React.useEffect(() => {
    if (reducedMotion) return;
    const onScroll = () => {
      const y = window.scrollY || 0;
      document.documentElement.style.setProperty("--sy", String(y));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setProbeErr(null);
        const data = await fetchProbe(clientTs);
        if (!alive) return;
        setProbe(data);
      } catch (e: any) {
        if (!alive) return;
        setProbeErr(e?.message ?? "Unknown error");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [clientTs]);

  const nowMs = Date.now();
  const uptime = nowMs - clientStartMs;
  const serverNowMs = probe?.serverTimeMs ?? null;
  const skewMs = serverNowMs ? Math.round(nowMs - serverNowMs) : null;

  const mx = reducedMotion ? -9999 : mouse.x;
  const my = reducedMotion ? -9999 : mouse.y;

  return (
    <main
      className="min-h-screen bg-black text-white"
      style={
        {
          ["--mx" as any]: `${mx}px`,
          ["--my" as any]: `${my}px`,
          ["--sy" as any]: "0",
        } as React.CSSProperties
      }
    >
      {/* Ultra polish background system */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Deep base */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.06),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.04),transparent_60%)]" />

        {/* Aurora drift */}
        <div className={cx(
          "absolute inset-0 opacity-[0.26] bg-[radial-gradient(circle_at_18%_20%,rgba(168,85,247,0.72),transparent_55%),radial-gradient(circle_at_78%_26%,rgba(59,130,246,0.58),transparent_58%),radial-gradient(circle_at_55%_82%,rgba(34,211,238,0.24),transparent_65%)]",
          reducedMotion ? "" : "animate-dominat8-aurora"
        )} />

        {/* Parallax haze */}
        <div
          className={cx("absolute inset-0 opacity-[0.22]", reducedMotion ? "" : "will-change-transform")}
          style={{
            transform: reducedMotion ? undefined : "translate3d(0, calc(var(--sy) * 0.02px), 0)",
            background:
              "radial-gradient(900px circle at 30% 20%, rgba(168,85,247,0.16), transparent 60%), radial-gradient(900px circle at 70% 60%, rgba(59,130,246,0.12), transparent 62%)",
          }}
        />

        {/* Cursor spotlight */}
        <div
          className={cx("absolute inset-0", reducedMotion ? "opacity-0" : "opacity-[0.70]")}
          style={{
            background:
              "radial-gradient(720px circle at var(--mx) var(--my), rgba(168,85,247,0.22), transparent 45%), radial-gradient(980px circle at var(--mx) var(--my), rgba(59,130,246,0.16), transparent 55%)",
          }}
        />

        {/* Spotlight behind hero */}
        <div className="absolute inset-0 opacity-[0.70] [mask-image:radial-gradient(ellipse_at_center,black,transparent_64%)] bg-gradient-to-b from-white/12 via-white/0 to-white/0" />

        {/* Precision grid */}
        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />

        {/* Dot constellation */}
        <div className="absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.18)_1px,transparent_1px),radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.14)_1px,transparent_1px),radial-gradient(circle_at_55%_70%,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:520px_520px]" />

        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22 x=%220%22 y=%220%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.35%22/></svg>')]" />
      </div>

      {/* Cursor ring */}
      <div
        className={cx("pointer-events-none fixed left-0 top-0 z-50 hidden md:block", reducedMotion ? "opacity-0" : "opacity-100")}
        style={{ transform: `translate(${mx - 18}px, ${my - 18}px)`, width: 36, height: 36 }}
      >
        <div className="h-9 w-9 rounded-full border border-white/12 bg-white/[0.03] shadow-[0_0_0_1px_rgba(168,85,247,0.22),0_0_34px_rgba(168,85,247,0.20)]" />
      </div>

      {/* Keyframes + utilities (no config changes needed) */}
      <style jsx global>{`
        @keyframes dominat8Aurora {
          0% { transform: translate3d(0px, 0px, 0px) scale(1); filter: hue-rotate(0deg) saturate(1.10); }
          50% { transform: translate3d(-22px, 12px, 0px) scale(1.03); filter: hue-rotate(-10deg) saturate(1.14); }
          100% { transform: translate3d(0px, 0px, 0px) scale(1); filter: hue-rotate(0deg) saturate(1.10); }
        }
        .animate-dominat8-aurora { animation: dominat8Aurora 26s ease-in-out infinite; will-change: transform, filter; }

        @keyframes sheen {
          0% { transform: translateX(-60%) rotate(10deg); opacity: 0.0; }
          30% { opacity: 0.45; }
          60% { opacity: 0.15; }
          100% { transform: translateX(160%) rotate(10deg); opacity: 0.0; }
        }
        .dominat8-sheen::after {
          content: "";
          position: absolute;
          inset: -40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: translateX(-60%) rotate(10deg);
          animation: sheen 4.8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .dominat8-marquee {
          display: flex;
          width: 200%;
          animation: marquee 18s linear infinite;
        }

        .dominat8-gradient-text {
          background: linear-gradient(90deg, rgba(255,255,255,0.95), rgba(168,85,247,0.95), rgba(59,130,246,0.92), rgba(34,211,238,0.86));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>

      {/* Sticky top nav (premium) */}
      <div className="sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <div className="rounded-3xl border border-white/12 bg-white/[0.045] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-black/35">
                  <span className="text-white/85 font-bold">D8</span>
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-bold text-white/92">Dominat8</div>
                  <div className="text-xs text-white/60">AI website automation</div>
                </div>
              </div>

              <div className="hidden items-center gap-2 md:flex">
                <a className="rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/[0.08]" href="#examples">Examples</a>
                <a className="rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/[0.08]" href="#how">How it works</a>
                <a className="rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/[0.08]" href="/pricing">Pricing</a>
              </div>

              <div className="flex items-center gap-2">
                <a className="rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/[0.08]" href={`/api/__probe__?ts=${clientTs}`}>
                  Probe
                </a>
                <a
                  className="relative overflow-hidden rounded-2xl bg-white px-5 py-2 text-sm font-extrabold text-black shadow-[0_16px_70px_rgba(168,85,247,0.16),0_16px_60px_rgba(59,130,246,0.12)] hover:bg-white/90"
                  href="/templates"
                >
                  <span className="relative z-10">Generate</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 pb-20">
        {/* Trust Mode (expandable) */}
        <div className="pt-6">
          <GlassCard className="p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <SplitBadge left="Trust Mode" right="Live proof enabled" />
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-3 py-1 text-xs text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" />
                    no-store probe
                  </div>
                </div>
                <div className="mt-2 text-sm text-white/80">
                  Client uptime: <span className="font-mono text-white/85">{formatRelative(uptime)}</span>
                  {" • "}
                  Skew: <span className="font-mono text-white/85">{skewMs === null ? "—" : `${skewMs}ms`}</span>
                  {" • "}
                  env: <span className="font-mono text-white/85">{probe?.env?.VERCEL_ENV ?? (loading ? "…" : "—")}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.10]" href={`/?ts=${clientTs}`}>
                  Refresh ts={clientTs}
                </a>

                <button
                  className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.10]"
                  onClick={async () => {
                    try {
                      setLoading(true);
                      setProbeErr(null);
                      const t = Math.floor(Date.now() / 1000);
                      const data = await fetchProbe(t);
                      setProbe(data);
                    } catch (e: any) {
                      setProbeErr(e?.message ?? "Unknown error");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Re-run probe
                </button>

                <button
                  className={cx(
                    "rounded-2xl border px-4 py-2 text-sm font-semibold transition-colors",
                    probeOpen
                      ? "border-fuchsia-300/25 bg-fuchsia-300/10 text-white hover:bg-fuchsia-300/14"
                      : "border-white/15 bg-white/[0.06] text-white/90 hover:bg-white/[0.10]"
                  )}
                  onClick={() => setProbeOpen((v) => !v)}
                >
                  {probeOpen ? "Hide proof" : "Show proof"}
                </button>
              </div>
            </div>

            {probeOpen ? (
              <div className="mt-4 rounded-3xl border border-white/10 bg-black/40 p-4">
                {probeErr ? (
                  <div className="text-sm text-red-200">
                    Probe error: <span className="font-mono">{probeErr}</span>
                  </div>
                ) : (
                  <pre className="max-h-[260px] overflow-auto whitespace-pre-wrap break-words text-xs text-white/85">
{JSON.stringify(probe, null, 2)}
                  </pre>
                )}
              </div>
            ) : null}
          </GlassCard>
        </div>

        {/* HERO (biggest polish) */}
        <section className="relative flex min-h-[88vh] items-center pt-10 pb-6">
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-xs text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" />
                Premium output • Built to convert
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 py-2 text-xs text-white/75">
                <span className="font-mono text-white/70">/api/__probe__</span>
                verified
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 py-2 text-xs text-white/75">
                <span className="font-mono text-white/70">V5.2</span>
                ultra polish
              </div>
            </div>

            <h1 className="mt-7 max-w-4xl text-balance text-4xl font-extrabold leading-[1.01] tracking-tight md:text-6xl">
              Build a production-ready website
              <span className="block dominat8-gradient-text">that people want to use.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-pretty text-lg text-white/75 leading-relaxed">
              One prompt → pages, structure, conversion copy, SEO outputs, and deploy-ready builds.
              <span className="text-white/88"> Trust Mode</span> proves what’s live, so your momentum never breaks.
            </p>

            {/* CTA row (sheen + glow) */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="dominat8-sheen group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white px-6 py-3 text-sm font-extrabold text-black shadow-[0_18px_90px_rgba(168,85,247,0.18),0_18px_70px_rgba(59,130,246,0.12)] hover:bg-white/90"
                href="/templates"
              >
                <span className="relative z-10">Generate my site</span>
                <span className="relative z-10 ml-2 text-black/60 transition-transform group-hover:translate-x-0.5">→</span>
              </a>

              <a className="rounded-2xl border border-white/18 bg-white/[0.06] px-6 py-3 text-center text-sm font-bold text-white hover:bg-white/[0.10]" href="#examples">
                View examples
              </a>

              <a className="rounded-2xl border border-white/18 bg-white/[0.06] px-6 py-3 text-center text-sm font-bold text-white hover:bg-white/[0.10]" href="/pricing">
                Pricing
              </a>
            </div>

            <div className="mt-10 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:grid-cols-4">
              <Stat k="Outcome" v="Publish-ready layout + copy" />
              <Stat k="Speed" v="Minutes, not weeks" />
              <Stat k="Clarity" v="No setup soup" />
              <Stat k="Proof" v="Live deploy verification" />
            </div>

            {/* Logo marquee */}
            <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.28em] text-white/55">Designed like the modern web</div>
              <div className="mt-3 relative">
                <div className={cx("dominat8-marquee", reducedMotion ? "opacity-70" : "")}>
                  {[
                    "Launch-ready",
                    "Conversion copy",
                    "Clean layout",
                    "Proof system",
                    "SEO outputs",
                    "Templates",
                    "Publish flow",
                    "Trust mode",
                    "Launch-ready",
                    "Conversion copy",
                    "Clean layout",
                    "Proof system",
                    "SEO outputs",
                    "Templates",
                    "Publish flow",
                    "Trust mode",
                  ].map((x, i) => (
                    <div key={i} className="mx-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/25 px-4 py-2 text-sm text-white/75">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                      {x}
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent" />
              </div>
            </div>

            <div className="mt-10 text-sm text-white/55">
              <a className="inline-flex items-center gap-2 hover:text-white/75" href="#who">
                <span className="font-mono">↓</span> See the revenue flow
              </a>
            </div>
          </div>
        </section>

        <DividerLabel text="POSITIONING" />

        {/* WHO / NOT WHO */}
        <section id="who" className="py-6">
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard className="p-6">
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">Perfect for</div>
              <h2 className="mt-3 text-2xl font-bold">Teams who need speed + confidence.</h2>
              <ul className="mt-5 space-y-3 text-sm text-white/75">
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" /> Founders launching fast</li>
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" /> Agencies producing many sites</li>
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" /> Operators who hate tool-wrestling</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">Not for</div>
              <h3 className="mt-3 text-2xl font-bold">If you want bespoke pixel art.</h3>
              <ul className="mt-5 space-y-3 text-sm text-white/75">
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/40" /> Designers polishing every micro-pixel</li>
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/40" /> Long bespoke dev projects</li>
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/40" /> People who love complex setup</li>
              </ul>
            </GlassCard>
          </div>
        </section>

        <DividerLabel text="VISUAL PROOF" />

        {/* EXAMPLES */}
        <section id="examples" className="py-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">Examples</div>
              <h2 className="mt-3 text-2xl font-bold md:text-3xl">Outputs people can believe.</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Premium placeholders now — later we wire real screenshots + published URLs.
              </p>
            </div>
            <a className="hidden rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.10] md:inline-flex" href="/templates">
              Browse templates
            </a>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ExampleCard tag="SaaS" title="AI Tool Landing" desc="Hero, benefits, pricing, FAQ, CTA." minutes="7 min" />
            <ExampleCard tag="Local" title="Service Business" desc="Trust, testimonials, booking CTA." minutes="6 min" />
            <ExampleCard tag="Agency" title="Portfolio + Leads" desc="Showcase, case studies, inbound flow." minutes="8 min" />
          </div>
        </section>

        <DividerLabel text="HOW IT WORKS" />

        {/* HOW IT WORKS */}
        <section id="how" className="py-6">
          <GlassCard className="p-6">
            <div className="text-xs uppercase tracking-[0.28em] text-white/60">How it works</div>
            <h2 className="mt-3 text-2xl font-bold">Three steps. No chaos.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { n: "01", t: "Describe your site", d: "Business, audience, vibe — one prompt." },
                { n: "02", t: "Generate structure + copy", d: "Pages, sections, conversion-first wording." },
                { n: "03", t: "Publish with proof", d: "Deploy with Trust Mode verification." },
              ].map((s) => (
                <div key={s.n} className="rounded-3xl border border-white/10 bg-black/25 p-5">
                  <div className="text-xs font-mono text-white/70">{s.n}</div>
                  <div className="mt-2 text-base font-bold">{s.t}</div>
                  <div className="mt-2 text-sm text-white/75">{s.d}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        <DividerLabel text="WHY YOU WIN" />

        {/* PILLARS + COMPARISON */}
        <section className="py-6">
          <div className="text-xs uppercase tracking-[0.28em] text-white/60">Why Dominat8</div>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">A marketing machine — built like infrastructure.</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Pill title="Conversion-first layout" desc="Hero → proof → clarity → decision → CTA. No scroll fatigue." icon={<span className="text-fuchsia-200/90">◆</span>} />
            <Pill title="SEO-ready outputs" desc="Clean rhythm, structured layout, and publishable foundations." icon={<span className="text-fuchsia-200/90">⌁</span>} />
            <Pill title="Trust Mode verification" desc="Probe + no-store proof so you always know what’s live." icon={<span className="text-fuchsia-200/90">✓</span>} />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <GlassCard className="p-6">
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">Most builders</div>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/35" /> Setup soup & configuration hell</li>
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/35" /> Pretty demos, weak conversion rhythm</li>
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/35" /> No proof of what’s live</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">Dominat8</div>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" /> Conversion-first structure by default</li>
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" /> SEO outputs and publish-ready rhythm</li>
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" /> Trust Mode proof to kill doubt</li>
              </ul>
            </GlassCard>
          </div>
        </section>

        <DividerLabel text="TRUST STACK" />

        {/* Testimonials */}
        <section className="py-6">
          <div className="text-xs uppercase tracking-[0.28em] text-white/60">Testimonials</div>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">Confidence stacking.</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Testimonial quote="This feels like a real product, not a template toy. The rhythm is perfect." name="Founder" role="SaaS launch" />
            <Testimonial quote="The proof system is huge. I stopped second-guessing whether deploys worked." name="Builder" role="Shipping fast" />
            <Testimonial quote="The layout reads like a marketing page. Clear, confident, and clean." name="Agency" role="Production workflow" />
          </div>
        </section>

        <DividerLabel text="DECISION" />

        {/* Pricing + Final CTA */}
        <section className="py-6">
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard className="p-6">
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">Pricing</div>
              <h2 className="mt-3 text-2xl font-bold">Simple. Upgrade when you’re ready to publish.</h2>

              <div className="mt-5 grid gap-3">
                <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                  <div className="flex items-baseline justify-between">
                    <div className="text-base font-bold">Free</div>
                    <div className="text-sm text-white/70">$0</div>
                  </div>
                  <ul className="mt-3 list-inside list-disc text-sm text-white/75">
                    <li>Explore templates</li>
                    <li>Generate and preview</li>
                    <li>Confidence-first baseline</li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-fuchsia-300/22 bg-fuchsia-300/6 p-5">
                  <div className="flex items-baseline justify-between">
                    <div className="text-base font-bold">Pro</div>
                    <div className="text-sm text-white/70">Unlock</div>
                  </div>
                  <ul className="mt-3 list-inside list-disc text-sm text-white/75">
                    <li>Full pipeline automation</li>
                    <li>SEO + sitemap outputs</li>
                    <li>Domain workflows</li>
                  </ul>
                  <a className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-black hover:bg-white/90" href="/pricing">
                    See Pro details
                  </a>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">Final CTA</div>
              <h2 className="mt-3 text-2xl font-bold">
                Launch like a team built it for you.
              </h2>
              <p className="mt-2 text-sm text-white/70">
                No more “is it live?” stress. Generate, iterate, publish — with proof every step.
              </p>

              <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-5">
                <div className="text-sm font-bold">Your next best action</div>
                <div className="mt-2 text-sm text-white/75">
                  Start with templates, generate a version, then publish when it feels right.
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <a className="dominat8-sheen relative overflow-hidden rounded-2xl bg-white px-6 py-3 text-center text-sm font-extrabold text-black hover:bg-white/90" href="/templates">
                    Generate my site
                  </a>
                  <a className="rounded-2xl border border-white/18 bg-white/[0.06] px-6 py-3 text-center text-sm font-bold text-white hover:bg-white/[0.10]" href="/pricing">
                    View pricing
                  </a>
                </div>
              </div>

              <div className="mt-6 text-xs text-white/55">
                Proof link:{" "}
                <a className="font-mono text-white/70 hover:text-white/90" href="/api/__probe__">
                  /api/__probe__
                </a>
              </div>
            </GlassCard>
          </div>

          <footer className="mt-12 border-t border-white/10 py-8 text-sm text-white/60">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>© {new Date().getFullYear()} Dominat8</div>
              <div className="font-mono">clientTs:{clientTs}</div>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}