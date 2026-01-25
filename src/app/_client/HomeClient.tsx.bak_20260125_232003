"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type DeployInfo = {
  serverIso: string;
  deployId: string;
  gitSha: string;
  gitRef: string;
  nodeEnv: string;
  vercelEnv: string;
};

type ProbeResponse = {
  ok: boolean;
  nowIso: string;
  stamp: string;
  deployId?: string;
  gitSha?: string;
  gitRef?: string;
  vercelEnv?: string;
  nodeEnv?: string;
};

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function slugToTitle(s: string) {
  return s
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-wide text-white/75">
      {children}
    </span>
  );
}

function Glow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute top-[18%] left-[10%] h-[420px] w-[420px] rounded-full bg-white/8 blur-3xl" />
      <div className="absolute top-[30%] right-[8%] h-[520px] w-[520px] rounded-full bg-white/8 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.10),rgba(0,0,0,0)_55%)]" />
    </div>
  );
}

function GridNoise() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(circle at 50% 10%, rgba(0,0,0,1), rgba(0,0,0,0) 60%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 10%, rgba(0,0,0,1), rgba(0,0,0,0) 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(circle at 50% 0%, rgba(0,0,0,1), rgba(0,0,0,0) 65%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 0%, rgba(0,0,0,1), rgba(0,0,0,0) 65%)",
        }}
      />
      {/* very light “noise” */}
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
          }}
        />
      </div>
    </div>
  );
}

function SectionTitle({
  kicker,
  title,
  desc,
}: {
  kicker: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-10">
      <div className="text-xs uppercase tracking-[0.28em] text-white/55">
        {kicker}
      </div>
      <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
        {desc}
      </p>
    </div>
  );
}

function Card({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-white/70">{desc}</div>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

function ProofPanel({ deploy }: { deploy: DeployInfo }) {
  const [probe, setProbe] = useState<ProbeResponse | null>(null);
  const [probeErr, setProbeErr] = useState<string>("");
  const [open, setOpen] = useState<boolean>(true);

  const clientIso = useMemo(() => new Date().toISOString(), []);
  const cacheBust = useMemo(() => `${Date.now()}`, []);

  useEffect(() => {
    const url = `/api/__probe__?ts=${encodeURIComponent(cacheBust)}`;
    fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: { "cache-control": "no-store", pragma: "no-cache" },
    })
      .then(async (r) => setProbe((await r.json()) as ProbeResponse))
      .catch((e: any) => setProbeErr(e?.message || String(e)));
  }, [cacheBust]);

  return (
    <div className="rounded-3xl border border-white/15 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 rounded-3xl px-6 py-5 text-left"
      >
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-white/55">
            Live proof panel
          </div>
          <div className="mt-2 text-sm font-semibold text-white/90">
            {open
              ? "This proves you’re seeing the latest deployed build."
              : "Tap to expand proof panel."}
          </div>
        </div>
        <div className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs text-white/75">
          TS: {cacheBust}
        </div>
      </button>

      {open ? (
        <div className="px-6 pb-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="text-sm font-semibold">Client</div>
              <div className="mt-3 space-y-2 text-sm text-white/70">
                <div>
                  <span className="text-white/50">CLIENT_ISO:</span>{" "}
                  <span className="text-white/85">{clientIso}</span>
                </div>
                <div>
                  <span className="text-white/50">URL:</span>{" "}
                  <span className="text-white/85">
                    {typeof window !== "undefined" ? window.location.href : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="text-sm font-semibold">Server</div>
              <div className="mt-3 space-y-2 text-sm text-white/70">
                <div>
                  <span className="text-white/50">SERVER_ISO:</span>{" "}
                  <span className="text-white/85">{deploy.serverIso}</span>
                </div>
                <div>
                  <span className="text-white/50">VERCEL_ENV:</span>{" "}
                  <span className="text-white/85">{deploy.vercelEnv || "(n/a)"}</span>
                </div>
                <div>
                  <span className="text-white/50">GIT_REF:</span>{" "}
                  <span className="text-white/85">{deploy.gitRef || "(n/a)"}</span>
                </div>
                <div>
                  <span className="text-white/50">GIT_SHA:</span>{" "}
                  <span className="text-white/85">{deploy.gitSha || "(n/a)"}</span>
                </div>
                <div>
                  <span className="text-white/50">DEPLOY_ID:</span>{" "}
                  <span className="text-white/85">{deploy.deployId || "(n/a)"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 md:col-span-2">
              <div className="text-sm font-semibold">Probe (/api/__probe__)</div>
              {probeErr ? (
                <div className="mt-3 text-sm text-red-200">PROBE_ERROR: {probeErr}</div>
              ) : null}
              {!probe && !probeErr ? (
                <div className="mt-3 text-sm text-white/60">Loading probe…</div>
              ) : null}
              {probe ? (
                <pre className="mt-3 overflow-auto rounded-xl border border-white/10 bg-black/60 p-4 text-xs text-white/80">
{JSON.stringify(probe, null, 2)}
                </pre>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function HomeClient({ deploy }: { deploy: DeployInfo }) {
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const pills = [
    "AI website automation",
    "Launch-ready structure",
    "SEO-first pages",
    "Domain-ready",
  ];

  const social = ["Vercel-ready", "App Router", "Type-safe", "Fast builds", "Trust Mode"];

  const features = [
    {
      title: "Finish-for-me generation",
      desc: "Give a prompt. Get a structured site: hero, pricing, FAQ, contact, and publish-ready pages — without guesswork.",
    },
    {
      title: "Conversion rhythm baked in",
      desc: "A premium layout that feels expensive: clarity, hierarchy, spacing, and persuasion blocks placed for momentum.",
    },
    {
      title: "Trustable deploy proof",
      desc: "A built-in probe endpoint + proof panel so you always know what’s live. No more ‘is this cached?’ confusion.",
    },
    {
      title: "Scale to the gallery",
      desc: "Templates and use-cases routes are resilient while your marketing catalog evolves. Strong routing, loose display typing.",
    },
  ];

  const steps = [
    { n: "01", t: "Describe", d: "Tell Dominat8 what you’re building and who it’s for." },
    { n: "02", t: "Generate", d: "We assemble a polished multi-page structure instantly." },
    { n: "03", t: "Polish", d: "Tune sections, branding, and SEO plan with guided controls." },
    { n: "04", t: "Publish", d: "Push to your domain with clear verification and a sitemap." },
  ];

  const faqs = [
    { q: "Why does the homepage look different now?", a: "This is the Monster WOW V4 homepage. It’s intentionally premium, and it includes Trust Mode to prove what’s live." },
    { q: "Is caching still an issue?", a: "Trust Mode forces dynamic rendering and adds a probe endpoint with no-store headers. You can verify live headers any time." },
    { q: "Can we make it look even more like SiteGround?", a: "Yes. Once you confirm this is live, we can iterate safely — typography, sections, gradients, and motion — without guessing." },
    { q: "Will this break marketing pages?", a: "No. This update is isolated to the homepage + probe endpoint only." },
  ];

  return (
    <div className="relative">
      {/* CINEMATIC BACKDROP */}
      <div className="absolute inset-0">
        <Glow />
        <GridNoise />
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          animate={{ opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.16), transparent 55%), radial-gradient(circle at 80% 40%, rgba(255,255,255,0.10), transparent 60%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16">
        {/* TOP BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-white/15 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.6)]" />
            <div>
              <div className="text-sm font-semibold">Dominat8</div>
              <div className="text-xs text-white/60">AI Website Automation Builder</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {pills.map((p) => (
              <Pill key={p}>{p}</Pill>
            ))}
          </div>
        </div>

        {/* HERO */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-14"
        >
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/70">
              <span className="font-semibold text-white/85">Monster WOW V4</span>
              <span className="text-white/40">•</span>
              <span>Premium homepage + Trust Mode proof</span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-5xl font-semibold leading-[1.02] tracking-[-0.02em] sm:text-7xl"
          >
            Build a website that looks
            <span className="block text-white/70">like a million bucks.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
            This is the “no-more-guessing” upgrade. It’s designed to be undeniably live,
            undeniably premium, and a stable base for the next wave of polish.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            <a
              href="/gallery"
              className="rounded-2xl bg-white px-7 py-4 text-sm font-semibold text-black shadow-[0_18px_70px_rgba(0,0,0,0.65)] hover:opacity-90"
            >
              Open Gallery
            </a>

            <a
              href="/templates"
              className="rounded-2xl border border-white/18 bg-white/5 px-7 py-4 text-sm font-semibold text-white/90 hover:border-white/35"
            >
              Browse Templates
            </a>

            <a
              href="/use-cases"
              className="rounded-2xl border border-white/18 bg-white/5 px-7 py-4 text-sm font-semibold text-white/90 hover:border-white/35"
            >
              Explore Use Cases
            </a>
          </motion.div>

          {/* Social proof strip */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-2">
            {social.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-white/65"
              >
                {s}
              </span>
            ))}
          </motion.div>
        </motion.section>

        {/* PROOF PANEL */}
        <div className="mt-12">
          <ProofPanel deploy={deploy} />
        </div>

        {/* FEATURES */}
        <section className="mt-16">
          <SectionTitle
            kicker="Pillars"
            title="A flagship homepage that feels expensive."
            desc="Big rhythm. Clean hierarchy. Premium spacing. And the proof tooling to stop the deploy/caching pain."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55 }}
              >
                <Card title={f.title} desc={f.desc} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-16">
          <SectionTitle
            kicker="Flow"
            title="From idea to live site in four steps."
            desc="This is the rhythm we’ll keep improving. Clear, calm, and fast — with a publish pipeline you can trust."
          />
          <div className="grid gap-4 md:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs font-semibold text-white/55">{s.n}</div>
                <div className="mt-3 text-sm font-semibold">{s.t}</div>
                <div className="mt-2 text-sm leading-relaxed text-white/70">{s.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className="mt-16">
          <SectionTitle
            kicker="Pricing"
            title="Start free. Upgrade when you’re shipping."
            desc="This is placeholder pricing to make the site feel complete — we can wire it to Stripe next."
          />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold">Free</div>
              <div className="mt-2 text-4xl font-semibold">$0</div>
              <div className="mt-3 text-sm text-white/70">Prototype and explore.</div>
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                <li>• Basic generation</li>
                <li>• Templates preview</li>
                <li>• Local publish test</li>
              </ul>
              <a
                href="/gallery"
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-white/18 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 hover:border-white/35"
              >
                Get started
              </a>
            </div>

            <div className="rounded-3xl border border-white/18 bg-white/8 p-6 shadow-[0_22px_90px_rgba(0,0,0,0.65)]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Pro</div>
                <span className="rounded-full border border-white/12 bg-black/30 px-3 py-1 text-[11px] text-white/70">
                  Popular
                </span>
              </div>
              <div className="mt-2 text-4xl font-semibold">$29</div>
              <div className="mt-3 text-sm text-white/70">Publish, SEO, and domains.</div>
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                <li>• Full multi-page generation</li>
                <li>• SEO plan + sitemap</li>
                <li>• Domain connection workflow</li>
              </ul>
              <a
                href="/gallery"
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
              >
                Upgrade to Pro
              </a>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold">Studio</div>
              <div className="mt-2 text-4xl font-semibold">$99</div>
              <div className="mt-3 text-sm text-white/70">For agencies & teams.</div>
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                <li>• Multiple brands</li>
                <li>• Advanced workflows</li>
                <li>• Priority pipeline</li>
              </ul>
              <a
                href="/contact"
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-white/18 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 hover:border-white/35"
              >
                Talk to us
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <SectionTitle
            kicker="FAQ"
            title="Answers, clearly."
            desc="If anything looks off after this update, it’s almost always a routing/deploy visibility problem — and Trust Mode is here to prove it."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm font-semibold">{f.q}</div>
                <div className="mt-2 text-sm leading-relaxed text-white/70">{f.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mt-16">
          <div className="rounded-3xl border border-white/15 bg-white/8 p-10 shadow-[0_22px_90px_rgba(0,0,0,0.65)]">
            <div className="text-xs uppercase tracking-[0.28em] text-white/55">Next move</div>
            <div className="mt-3 text-3xl font-semibold sm:text-4xl">
              Now we can polish safely — because you can finally trust what you see.
            </div>
            <div className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
              If this page loads with the proof panel and the probe JSON, you are out of the
              “cached / wrong deploy” nightmare. From here, we go full SiteGround-level finishing.
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/gallery"
                className="rounded-2xl bg-white px-7 py-4 text-sm font-semibold text-black hover:opacity-90"
              >
                Continue in Gallery
              </a>
              <a
                href="/?ts=123"
                className="rounded-2xl border border-white/18 bg-white/5 px-7 py-4 text-sm font-semibold text-white/90 hover:border-white/35"
              >
                Force refresh proof
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-16 border-t border-white/10 pt-8 text-xs text-white/55">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>© {new Date().getFullYear()} Dominat8</div>
            <div className="flex gap-4">
              <a className="hover:text-white/80" href="/templates">Templates</a>
              <a className="hover:text-white/80" href="/use-cases">Use Cases</a>
              <a className="hover:text-white/80" href="/gallery">Gallery</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}