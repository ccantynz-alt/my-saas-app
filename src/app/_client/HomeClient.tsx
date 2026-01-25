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
    <div className="group relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.045] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-24 bg-[radial-gradient(circle_at_40%_30%,rgba(168,85,247,0.18),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(59,130,246,0.14),transparent_55%),radial-gradient(circle_at_30%_80%,rgba(34,211,238,0.10),transparent_55%)]" />
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
          <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))]">
            <div className="absolute inset-0 opacity-[0.45] bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.35),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(59,130,246,0.28),transparent_60%)]" />
            <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:26px_26px]" />
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

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="text-xs uppercase tracking-[0.28em] text-white/60">{k}</div>
      <div className="mt-2 text-sm font-semibold text-white/90">{v}</div>
    </div>
  );
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

export default function HomeClient() {
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
  }, []);

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

  return (
    <main
      className="min-h-screen bg-black text-white"
      style={
        {
          // CSS vars for cursor spotlight
          ["--mx" as any]: `${mouse.x}px`,
          ["--my" as any]: `${mouse.y}px`,
        } as React.CSSProperties
      }
    >
      {/* Massive polish: Aurora + grid + grain + cursor spotlight */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Aurora drift */}
        <div className="absolute inset-0 opacity-[0.24] bg-[radial-gradient(circle_at_18%_20%,rgba(168,85,247,0.70),transparent_55%),radial-gradient(circle_at_78%_26%,rgba(59,130,246,0.55),transparent_58%),radial-gradient(circle_at_55%_82%,rgba(34,211,238,0.22),transparent_65%)] animate-dominat8-aurora" />

        {/* Cursor spotlight: controlled + premium */}
        <div
          className="absolute inset-0 opacity-[0.65]"
          style={{
            background:
              "radial-gradient(700px circle at var(--mx) var(--my), rgba(168,85,247,0.22), transparent 45%), radial-gradient(900px circle at var(--mx) var(--my), rgba(59,130,246,0.16), transparent 55%)",
          }}
        />

        {/* Subtle top wash */}
        <div className="absolute inset-0 opacity-[0.65] [mask-image:radial-gradient(ellipse_at_center,black,transparent_64%)] bg-gradient-to-b from-white/10 via-white/0 to-white/0" />

        {/* Precision grid */}
        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />

        {/* Star-dust dots (very faint) */}
        <div className="absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.18)_1px,transparent_1px),radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.14)_1px,transparent_1px),radial-gradient(circle_at_55%_70%,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:520px_520px]" />

        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22 x=%220%22 y=%220%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.35%22/></svg>')]" />
      </div>

      {/* Cursor ring */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
        style={{
          transform: `translate(${mouse.x - 18}px, ${mouse.y - 18}px)`,
          width: 36,
          height: 36,
        }}
      >
        <div className="h-9 w-9 rounded-full border border-white/12 bg-white/[0.03] shadow-[0_0_0_1px_rgba(168,85,247,0.20),0_0_30px_rgba(168,85,247,0.18)]" />
      </div>

      {/* Local keyframes (no config changes needed) */}
      <style jsx global>{`
        @keyframes dominat8Aurora {
          0% { transform: translate3d(0px, 0px, 0px) scale(1); filter: hue-rotate(0deg) saturate(1.08); }
          50% { transform: translate3d(-22px, 12px, 0px) scale(1.03); filter: hue-rotate(-10deg) saturate(1.12); }
          100% { transform: translate3d(0px, 0px, 0px) scale(1); filter: hue-rotate(0deg) saturate(1.08); }
        }
        .animate-dominat8-aurora {
          animation: dominat8Aurora 26s ease-in-out infinite;
          will-change: transform, filter;
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-6">
        {/* Trust strip (premium glass) */}
        <div className="pt-6">
          <div className="rounded-3xl border border-white/12 bg-white/[0.045] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_90px_rgba(0,0,0,0.60)] backdrop-blur">
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
                <a
                  className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.10]"
                  href={`/?ts=${clientTs}`}
                >
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
          </div>
        </div>

        {/* FULL HERO: massive polish */}
        <section className="relative flex min-h-[88vh] items-center pt-10 pb-10">
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
            </div>

            <h1 className="mt-7 max-w-4xl text-balance text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
              Build a production-ready website
              <span className="text-white/70"> that feels expensive.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-pretty text-lg text-white/75 leading-relaxed">
              One prompt → pages, structure, conversion copy, SEO outputs, and deploy-friendly builds.
              <span className="text-white/88"> Trust Mode</span> proves you’re seeing the latest deploy so you can ship with confidence.
            </p>

            {/* CTA row: premium button styling */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="group relative inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-extrabold text-black"
                href="/templates"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
                  boxShadow:
                    "0 18px 90px rgba(168,85,247,0.18), 0 18px 70px rgba(59,130,246,0.12), 0 18px 60px rgba(255,255,255,0.06)",
                }}
              >
                <span className="relative z-10">Generate my site</span>
                <span className="ml-2 text-black/60 transition-transform group-hover:translate-x-0.5">→</span>
                <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(120px circle at 30% 40%, rgba(168,85,247,0.30), transparent 60%), radial-gradient(160px circle at 70% 50%, rgba(59,130,246,0.22), transparent 62%)",
                  }}
                />
              </a>

              <a
                className="relative inline-flex items-center justify-center rounded-2xl border border-white/18 bg-white/[0.06] px-6 py-3 text-sm font-bold text-white hover:bg-white/[0.10]"
                href="#examples"
              >
                View examples
              </a>

              <a
                className="relative inline-flex items-center justify-center rounded-2xl border border-white/18 bg-white/[0.06] px-6 py-3 text-sm font-bold text-white hover:bg-white/[0.10]"
                href="/pricing"
              >
                Pricing
              </a>
            </div>

            {/* Trust + social proof strip */}
            <div className="mt-10 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:grid-cols-4">
              <Stat k="Outcome" v="Publish-ready layout + copy" />
              <Stat k="Speed" v="Minutes, not weeks" />
              <Stat k="Clarity" v="No setup soup" />
              <Stat k="Proof" v="Live deploy verification" />
            </div>

            {/* Scroll hint */}
            <div className="mt-10 text-sm text-white/55">
              <a className="inline-flex items-center gap-2 hover:text-white/75" href="#who">
                <span className="font-mono">↓</span> See the revenue flow
              </a>
            </div>
          </div>
        </section>

        {/* WHO IT’S FOR / NOT FOR */}
        <section id="who" className="py-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/12 bg-white/[0.045] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur">
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">Perfect for</div>
              <h2 className="mt-3 text-2xl font-bold">Teams who need speed + confidence.</h2>
              <ul className="mt-5 space-y-3 text-sm text-white/75">
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" /> Founders launching fast</li>
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" /> Agencies producing many sites</li>
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" /> Operators who hate tool-wrestling</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/12 bg-white/[0.045] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur">
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">Not for</div>
              <h3 className="mt-3 text-2xl font-bold">If you want hand-crafted pixel art.</h3>
              <ul className="mt-5 space-y-3 text-sm text-white/75">
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/40" /> Designers polishing every micro-pixel</li>
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/40" /> Long bespoke dev projects</li>
                <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/40" /> People who love complex setup</li>
              </ul>
            </div>
          </div>
        </section>

        {/* EXAMPLES */}
        <section id="examples" className="py-12">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">Visual proof</div>
              <h2 className="mt-3 text-2xl font-bold md:text-3xl">Generated outputs people can believe.</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                These are premium placeholders. Later you can wire screenshots + URLs for real trust.
              </p>
            </div>
            <a
              className="hidden rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.10] md:inline-flex"
              href="/templates"
            >
              Browse templates
            </a>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ExampleCard tag="SaaS" title="AI Tool Landing" desc="Hero, benefits, pricing, FAQ, CTA." minutes="7 min" />
            <ExampleCard tag="Local" title="Service Business" desc="Trust, testimonials, booking CTA." minutes="6 min" />
            <ExampleCard tag="Agency" title="Portfolio + Leads" desc="Showcase, case studies, inbound flow." minutes="8 min" />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-12">
          <div className="rounded-3xl border border-white/12 bg-white/[0.045] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur">
            <div className="text-xs uppercase tracking-[0.28em] text-white/60">How it works</div>
            <h2 className="mt-3 text-2xl font-bold">Three steps. No chaos.</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { n: "01", t: "Describe your site", d: "Business, audience, and vibe — one prompt." },
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
          </div>
        </section>

        {/* PILLARS */}
        <section className="py-12">
          <div className="text-xs uppercase tracking-[0.28em] text-white/60">Why Dominat8</div>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">A marketing machine — built like infrastructure.</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Pill title="Conversion-first layout" desc="Hero → proof → clarity → decision → CTA. No scroll fatigue." icon={<span className="text-fuchsia-200/90">◆</span>} />
            <Pill title="SEO-ready outputs" desc="Clean rhythm, structured layout, and publishable foundations." icon={<span className="text-fuchsia-200/90">⌁</span>} />
            <Pill title="Trust Mode verification" desc="Probe + no-store proof so you always know what’s live." icon={<span className="text-fuchsia-200/90">✓</span>} />
          </div>
        </section>

        {/* PRICING + FINAL CTA */}
        <section className="py-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/12 bg-white/[0.045] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur">
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
                  <a
                    className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-black hover:bg-white/90"
                    href="/pricing"
                  >
                    See Pro details
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/12 bg-white/[0.045] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur">
              <div className="text-xs uppercase tracking-[0.28em] text-white/60">Ready to ship?</div>
              <h2 className="mt-3 text-2xl font-bold">Stop wrestling with tools.</h2>
              <p className="mt-2 text-sm text-white/70">
                Launch like a team built it for you — and prove what’s live in seconds.
              </p>

              <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-5">
                <div className="text-sm font-bold">Your next best action</div>
                <div className="mt-2 text-sm text-white/75">
                  Start with templates, generate a version, then publish when it feels right.
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <a className="rounded-2xl bg-white px-6 py-3 text-center text-sm font-extrabold text-black hover:bg-white/90" href="/templates">
                    Generate my site
                  </a>
                  <a className="rounded-2xl border border-white/18 bg-white/[0.06] px-6 py-3 text-center text-sm font-bold text-white hover:bg-white/[0.10]" href="/pricing">
                    View pricing
                  </a>
                </div>
              </div>

              <div className="mt-6 text-xs text-white/55">
                Proof link: <a className="font-mono text-white/70 hover:text-white/90" href="/api/__probe__">/api/__probe__</a>
              </div>
            </div>
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