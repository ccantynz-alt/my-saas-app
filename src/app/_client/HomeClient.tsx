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

function Chip({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-3 py-1 text-xs text-white/75">
      <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
      {text}
    </div>
  );
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx(
      "relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.045] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_90px_rgba(0,0,0,0.65)] backdrop-blur",
      className
    )}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)] bg-gradient-to-b from-white/12 via-white/0 to-white/0" />
      <div className="relative">{children}</div>
    </div>
  );
}

type DemoState = "idle" | "running" | "done";

const PRESETS = [
  "A luxury AI website builder for founders. Dark, premium, punchy.",
  "A local trades business site with booking + trust badges + reviews.",
  "A SaaS landing page for an AI tool with pricing + FAQ + strong CTA.",
];

const THEMES = [
  { name: "Nebula Purple", a: "rgba(168,85,247,0.70)", b: "rgba(59,130,246,0.55)", c: "rgba(34,211,238,0.22)" },
  { name: "Hyper Blue", a: "rgba(59,130,246,0.70)", b: "rgba(34,211,238,0.55)", c: "rgba(255,255,255,0.16)" },
  { name: "Fuchsia Pop", a: "rgba(217,70,239,0.70)", b: "rgba(168,85,247,0.55)", c: "rgba(59,130,246,0.22)" },
];

function Step({ on, title, desc }: { on: boolean; title: string; desc: string }) {
  return (
    <div className={cx(
      "rounded-2xl border p-4 transition-all",
      on ? "border-fuchsia-300/25 bg-fuchsia-300/10" : "border-white/10 bg-black/25"
    )}>
      <div className="text-sm font-bold text-white/92">{title}</div>
      <div className="mt-1 text-xs text-white/70">{desc}</div>
    </div>
  );
}

function PreviewShell({ variant }: { variant: number }) {
  const v = variant % 3;

  const top = [
    { h: "AI Tool Landing", s: "Conversion hero + pricing + FAQ", tag: "SaaS" },
    { h: "Local Service Site", s: "Trust, reviews, booking CTA", tag: "Local" },
    { h: "Agency Portfolio", s: "Showcase + lead capture + proof", tag: "Agency" },
  ][v];

  const blocks =
    v === 0
      ? ["Hero + glow", "Benefits", "Pricing", "FAQ", "Closing CTA"]
      : v === 1
      ? ["Hero + phone", "Services", "Reviews", "Areas", "Booking CTA"]
      : ["Hero + reel", "Case studies", "Proof", "Process", "Contact CTA"];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-black/35">
      <div className="absolute inset-0 opacity-[0.30] bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.10),transparent_55%),radial-gradient(circle_at_85%_60%,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="relative p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.28em] text-white/55">{top.tag} preview</div>
            <div className="mt-1 text-sm font-extrabold text-white/90">{top.h}</div>
            <div className="mt-1 text-xs text-white/65">{top.s}</div>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/[0.06] px-3 py-2 text-xs text-white/75">
            Live preview
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="h-24 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))]" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 rounded-2xl border border-white/10 bg-white/[0.06]" />
            <div className="h-16 rounded-2xl border border-white/10 bg-white/[0.06]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="h-14 rounded-2xl border border-white/10 bg-white/[0.05]" />
            <div className="h-14 rounded-2xl border border-white/10 bg-white/[0.05]" />
            <div className="h-14 rounded-2xl border border-white/10 bg-white/[0.05]" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {blocks.map((b) => (
            <div key={b} className="rounded-full border border-white/12 bg-black/25 px-3 py-1 text-xs text-white/70">
              {b}
            </div>
          ))}
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

  // Cursor spotlight
  const [mouse, setMouse] = React.useState<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const mouseRef = React.useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const rafRef = React.useRef<number | null>(null);

  // Slap Mode demo
  const [prompt, setPrompt] = React.useState<string>(PRESETS[0]);
  const [demo, setDemo] = React.useState<DemoState>("idle");
  const [step, setStep] = React.useState<number>(0);
  const [variant, setVariant] = React.useState<number>(0);
  const [theme, setTheme] = React.useState<number>(0);

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
    return () => { alive = false; };
  }, [clientTs]);

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

  function runDemo() {
    if (demo === "running") return;
    setDemo("running");
    setStep(0);

    // rotate theme + preview variant for "wow"
    setTheme((t) => (t + 1) % THEMES.length);
    setVariant((v) => v + 1);

    // step animation
    const times = [450, 900, 1350, 1800];
    times.forEach((ms, i) => {
      window.setTimeout(() => setStep(i + 1), ms);
    });
    window.setTimeout(() => setDemo("done"), 2100);

    // auto-reset to idle after a moment (keeps it interactive)
    window.setTimeout(() => setDemo("idle"), 5200);
  }

  const nowMs = Date.now();
  const uptime = nowMs - clientStartMs;
  const serverNowMs = probe?.serverTimeMs ?? null;
  const skewMs = serverNowMs ? Math.round(nowMs - serverNowMs) : null;

  const t = THEMES[theme];

  const mx = reducedMotion ? -9999 : mouse.x;
  const my = reducedMotion ? -9999 : mouse.y;

  return (
    <main
      className="min-h-screen bg-black text-white"
      style={
        {
          ["--mx" as any]: `${mx}px`,
          ["--my" as any]: `${my}px`,
          ["--a" as any]: t.a,
          ["--b" as any]: t.b,
          ["--c" as any]: t.c,
        } as React.CSSProperties
      }
    >
      {/* Slap Mode Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Base */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.06),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.04),transparent_60%)]" />

        {/* Aurora */}
        <div className={cx(
          "absolute inset-0 opacity-[0.30] bg-[radial-gradient(circle_at_18%_20%,var(--a),transparent_55%),radial-gradient(circle_at_78%_26%,var(--b),transparent_58%),radial-gradient(circle_at_55%_82%,var(--c),transparent_65%)]",
          reducedMotion ? "" : "animate-d8-aurora"
        )} />

        {/* Cursor spotlight */}
        <div
          className={cx("absolute inset-0", reducedMotion ? "opacity-0" : "opacity-[0.70]")}
          style={{
            background:
              "radial-gradient(720px circle at var(--mx) var(--my), rgba(168,85,247,0.22), transparent 45%), radial-gradient(980px circle at var(--mx) var(--my), rgba(59,130,246,0.16), transparent 55%)",
          }}
        />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />

        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22 x=%220%22 y=%220%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.35%22/></svg>')]" />

        {/* Shockwave entrance */}
        <div className={cx("absolute inset-0", reducedMotion ? "hidden" : "")}>
          <div className="absolute left-1/2 top-[18%] h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 opacity-0 animate-d8-shock" />
          <div className="absolute left-1/2 top-[18%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 opacity-0 animate-d8-shock2" />
        </div>
      </div>

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes d8Aurora {
          0% { transform: translate3d(0px, 0px, 0px) scale(1); filter: hue-rotate(0deg) saturate(1.12); }
          50% { transform: translate3d(-22px, 12px, 0px) scale(1.03); filter: hue-rotate(-10deg) saturate(1.16); }
          100% { transform: translate3d(0px, 0px, 0px) scale(1); filter: hue-rotate(0deg) saturate(1.12); }
        }
        .animate-d8-aurora { animation: d8Aurora 24s ease-in-out infinite; will-change: transform, filter; }

        @keyframes d8Shock {
          0% { transform: translate(-50%, -50%) scale(0.55); opacity: 0; }
          20% { opacity: 0.35; }
          100% { transform: translate(-50%, -50%) scale(1.25); opacity: 0; }
        }
        @keyframes d8Shock2 {
          0% { transform: translate(-50%, -50%) scale(0.75); opacity: 0; }
          25% { opacity: 0.28; }
          100% { transform: translate(-50%, -50%) scale(1.40); opacity: 0; }
        }
        .animate-d8-shock { animation: d8Shock 1.25s ease-out 1; }
        .animate-d8-shock2 { animation: d8Shock2 1.55s ease-out 1; }

        .d8-gradient-text {
          background: linear-gradient(90deg, rgba(255,255,255,0.95), rgba(217,70,239,0.95), rgba(168,85,247,0.95), rgba(59,130,246,0.90), rgba(34,211,238,0.84));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        @keyframes caret {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .d8-caret { animation: caret 1s steps(1,end) infinite; }
      `}</style>

      <div className="mx-auto max-w-6xl px-6">
        {/* Trust mode strip (compact) */}
        <div className="pt-6">
          <GlassCard className="p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center overflow-hidden rounded-full border border-white/12 bg-white/[0.05] text-xs text-white/80">
                    <span className="px-4 py-2">Trust Mode</span>
                    <span className="h-5 w-px bg-white/12" />
                    <span className="px-4 py-2 text-white/70">Live proof enabled</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-3 py-1 text-xs text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" />
                    no-store probe
                  </div>
                </div>
                <div className="mt-2 text-sm text-white/80">
                  Uptime: <span className="font-mono text-white/85">{formatRelative(uptime)}</span>
                  {" • "}Skew: <span className="font-mono text-white/85">{skewMs === null ? "—" : `${skewMs}ms`}</span>
                  {" • "}env: <span className="font-mono text-white/85">{probe?.env?.VERCEL_ENV ?? (loading ? "…" : "—")}</span>
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
                      const tt = Math.floor(Date.now() / 1000);
                      const data = await fetchProbe(tt);
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
                    probeOpen ? "border-fuchsia-300/25 bg-fuchsia-300/10 text-white" : "border-white/15 bg-white/[0.06] text-white/90 hover:bg-white/[0.10]"
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

        {/* SLAP MODE HERO */}
        <section className="relative pt-10 pb-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Left: narrative */}
            <div>
              <div className="flex flex-wrap gap-2">
                <Chip text="Interactive demo" />
                <Chip text="Conversion-first layout" />
                <Chip text="Trust Mode proof" />
              </div>

              <h1 className="mt-7 max-w-xl text-balance text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
                This isn’t a normal website builder.
                <span className="block d8-gradient-text">It generates a launch-ready site.</span>
              </h1>

              <p className="mt-5 max-w-xl text-pretty text-lg text-white/75 leading-relaxed">
                Type a prompt. Click generate. Watch it assemble a real marketing homepage structure — immediately.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  className="group relative overflow-hidden rounded-2xl bg-white px-6 py-3 text-sm font-extrabold text-black shadow-[0_18px_90px_rgba(168,85,247,0.18),0_18px_70px_rgba(59,130,246,0.12)] hover:bg-white/90"
                  onClick={runDemo}
                >
                  <span className="relative z-10">
                    {demo === "running" ? "Generating…" : "Generate a site right now"}
                  </span>
                  <span className="relative z-10 ml-2 text-black/60 transition-transform group-hover:translate-x-0.5">→</span>
                </button>

                <a
                  className="rounded-2xl border border-white/18 bg-white/[0.06] px-6 py-3 text-center text-sm font-bold text-white hover:bg-white/[0.10]"
                  href="/templates"
                >
                  Browse templates
                </a>
              </div>

              <div className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/60">Outcome</div>
                  <div className="mt-2 text-sm font-semibold text-white/90">Publish-ready structure</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/60">Speed</div>
                  <div className="mt-2 text-sm font-semibold text-white/90">Minutes, not weeks</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/60">Proof</div>
                  <div className="mt-2 text-sm font-semibold text-white/90">Know what’s live</div>
                </div>
              </div>
            </div>

            {/* Right: mini product demo */}
            <div>
              <GlassCard className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-[0.28em] text-white/55">Slap Mode</div>
                    <div className="mt-1 text-sm font-extrabold text-white/90">Live generator preview</div>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/[0.06] px-3 py-2 text-xs text-white/75">
                    {THEMES[theme].name}
                  </div>
                </div>

                <div className="mt-4 rounded-3xl border border-white/10 bg-black/35 p-4">
                  <div className="text-xs text-white/60">Prompt</div>
                  <div className="mt-2 flex flex-col gap-2">
                    <textarea
                      className="min-h-[92px] w-full resize-none rounded-2xl border border-white/12 bg-black/30 p-3 text-sm text-white/90 outline-none placeholder:text-white/35 focus:border-fuchsia-300/25"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the site you want…"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.10]"
                        onClick={() => setPrompt(PRESETS[0])}
                      >
                        Preset 1
                      </button>
                      <button
                        className="rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.10]"
                        onClick={() => setPrompt(PRESETS[1])}
                      >
                        Preset 2
                      </button>
                      <button
                        className="rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.10]"
                        onClick={() => setPrompt(PRESETS[2])}
                      >
                        Preset 3
                      </button>

                      <button
                        className={cx(
                          "ml-auto rounded-2xl px-4 py-2 text-sm font-extrabold",
                          demo === "running"
                            ? "bg-white/70 text-black"
                            : "bg-white text-black hover:bg-white/90"
                        )}
                        onClick={runDemo}
                      >
                        {demo === "running" ? "Generating…" : "Generate"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="space-y-3">
                    <Step on={step >= 1} title="Plan layout" desc="Hero, proof, steps, pricing, FAQ" />
                    <Step on={step >= 2} title="Write conversion copy" desc="Outcome-driven headline + CTAs" />
                    <Step on={step >= 3} title="Assemble sections" desc="Marketing rhythm, spacing, hierarchy" />
                    <Step on={step >= 4} title="Ready to publish" desc="Deploy-friendly structure + proof" />
                  </div>
                  <div className="relative">
                    <div className="mb-3 text-xs text-white/60">
                      Preview {demo === "running" ? <span className="font-mono">generating<span className="d8-caret">|</span></span> : <span className="font-mono">ready</span>}
                    </div>
                    <PreviewShell variant={variant} />
                  </div>
                </div>
              </GlassCard>

              <div className="mt-4 text-xs text-white/55">
                Tip: click <span className="text-white/75 font-mono">Generate</span> a few times — it rotates themes + preview layouts for instant “wow”.
              </div>
            </div>
          </div>
        </section>

        {/* Simple lower content (kept minimal; hero is the slap) */}
        <section className="pb-16">
          <div className="grid gap-6 md:grid-cols-3">
            <GlassCard className="p-6">
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">Why it converts</div>
              <div className="mt-3 text-lg font-extrabold">Built for momentum.</div>
              <div className="mt-2 text-sm text-white/72 leading-relaxed">
                No setup soup. No second-guessing deploys. Just generate → iterate → publish with proof.
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">What you get</div>
              <div className="mt-3 text-lg font-extrabold">A real marketing page.</div>
              <div className="mt-2 text-sm text-white/72 leading-relaxed">
                Hero, proof, steps, pricing, FAQ, closing CTA — structured like high-performing SaaS.
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">Next step</div>
              <div className="mt-3 text-lg font-extrabold">Try templates.</div>
              <div className="mt-2 text-sm text-white/72 leading-relaxed">
                Start with a template, generate your first version, then publish when it feels right.
              </div>
              <a className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-black hover:bg-white/90" href="/templates">
                Generate my site
              </a>
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