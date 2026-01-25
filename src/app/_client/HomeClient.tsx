"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type ProbeInfo = {
  ok: boolean;
  status: number;
  fetchedAtIso: string;
  headers: Record<string, string>;
  json: any;
  error?: string;
};

type DemoPhase =
  | "idle"
  | "running"
  | "done";

const SESSION_KEY = "dominat8_home_demo_ran_v7";

function nowIso() {
  try { return new Date().toISOString(); } catch { return ""; }
}

function safeJsonParse(text: string) {
  try { return JSON.parse(text); } catch { return null; }
}

function pickDomHeaders(all: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    for (const [k, v] of all.entries()) {
      const key = (k || "").toLowerCase();
      if (key.startsWith("x-dominat8-")) out[key] = v;
    }
  } catch {
    // ignore
  }
  return out;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function HomeClient() {
  const [intro, setIntro] = useState<"armed" | "fired" | "done">("armed");
  const [demo, setDemo] = useState<DemoPhase>("idle");
  const [demoStep, setDemoStep] = useState<number>(0);
  const [demoPulse, setDemoPulse] = useState<number>(0);
  const [trustOpen, setTrustOpen] = useState<boolean>(false);
  const [probe, setProbe] = useState<ProbeInfo | null>(null);

  const timeoutsRef = useRef<number[]>([]);
  const mountedRef = useRef<boolean>(false);

  const demoSteps = useMemo(() => ([
    { title: "Locking onto your niche", sub: "Reading your intent + audience" },
    { title: "Generating homepage layout", sub: "Hero, sections, flow rhythm" },
    { title: "Writing conversion copy", sub: "Benefit-first, bold, clean" },
    { title: "Building SEO plan", sub: "Sitemap, titles, meta, schema" },
    { title: "Preview + publish pulse", sub: "Final polish + go-live" },
  ]), []);

  function clearTimers() {
    for (const t of timeoutsRef.current) {
      try { clearTimeout(t); } catch {}
    }
    timeoutsRef.current = [];
  }

  async function runProbe() {
    const ts = Math.floor(Date.now() / 1000);
    const url = `/api/__probe__?ts=${ts}`;

    const base: ProbeInfo = {
      ok: false,
      status: 0,
      fetchedAtIso: nowIso(),
      headers: {},
      json: null,
    };

    try {
      const res = await fetch(url, { cache: "no-store" });
      const text = await res.text();
      const parsed = safeJsonParse(text);

      setProbe({
        ...base,
        ok: res.ok,
        status: res.status,
        headers: pickDomHeaders(res.headers),
        json: parsed ?? { raw: text?.slice(0, 2000) },
      });
    } catch (e: any) {
      setProbe({
        ...base,
        ok: false,
        status: 0,
        headers: {},
        json: null,
        error: (e && e.message) ? String(e.message) : "Probe failed",
      });
    }
  }

  function fireIntro() {
    // impact snap + shock rings + glare burst
    setIntro("fired");
    const t1 = window.setTimeout(() => setIntro("done"), 900);
    timeoutsRef.current.push(t1);
  }

  function startDemoOncePerSession() {
    let already = false;
    try {
      already = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      already = false;
    }

    if (already) return;

    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}

    setDemo("running");
    setDemoStep(0);
    setDemoPulse(0);

    // Drive steps + pulses (fast, but readable)
    const stepMs = 850;
    const pulseMs = 280;

    for (let i = 0; i < demoSteps.length; i++) {
      const t = window.setTimeout(() => {
        setDemoStep(i);
        setDemoPulse((p) => p + 1);
      }, i * stepMs);
      timeoutsRef.current.push(t);
    }

    // Add some preview pulses between steps
    for (let i = 1; i <= 10; i++) {
      const t = window.setTimeout(() => {
        setDemoPulse((p) => p + 1);
      }, i * pulseMs);
      timeoutsRef.current.push(t);
    }

    const doneAt = demoSteps.length * stepMs + 250;
    const tDone = window.setTimeout(() => setDemo("done"), doneAt);
    timeoutsRef.current.push(tDone);
  }

  useEffect(() => {
    mountedRef.current = true;

    // Impact intro (fast)
    const t0 = window.setTimeout(() => fireIntro(), 30);
    timeoutsRef.current.push(t0);

    // Auto-demo once per session
    const tDemo = window.setTimeout(() => startDemoOncePerSession(), 120);
    timeoutsRef.current.push(tDemo);

    // Trust probe (no-store)
    const tProbe = window.setTimeout(() => runProbe(), 160);
    timeoutsRef.current.push(tProbe);

    return () => {
      mountedRef.current = false;
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeStep = clamp(demoStep, 0, demoSteps.length - 1);
  const step = demoSteps[activeStep];

  const impactClass =
    intro === "armed" ? "impact-armed" :
    intro === "fired" ? "impact-fired" :
    "impact-done";

  const demoOn = demo === "running";

  return (
    <div className="home-root">
      {/* TRUST STRIP */}
      <div className="trust-strip">
        <div className="trust-left">
          <span className="trust-pill">TRUST MODE</span>
          <span className="trust-text">no-store probe • live route proof</span>
        </div>
        <div className="trust-right">
          <button
            className="trust-btn"
            onClick={() => setTrustOpen(v => !v)}
            aria-expanded={trustOpen ? "true" : "false"}
            type="button"
          >
            {trustOpen ? "Hide probe" : "Show probe"}
          </button>
        </div>
      </div>

      {trustOpen && (
        <div className="trust-panel">
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-card-title">/api/__probe__</div>
              <div className="trust-kv">
                <div className="k">fetchedAt</div>
                <div className="v">{probe?.fetchedAtIso ?? "…"}</div>
                <div className="k">status</div>
                <div className="v">{probe ? String(probe.status) : "…"}</div>
                <div className="k">ok</div>
                <div className="v">{probe ? (probe.ok ? "true" : "false") : "…"}</div>
              </div>
              {probe?.error && <div className="trust-error">{probe.error}</div>}
            </div>

            <div className="trust-card">
              <div className="trust-card-title">x-dominat8-* headers</div>
              <pre className="trust-pre">
{probe ? JSON.stringify(probe.headers ?? {}, null, 2) : "…"}
              </pre>
            </div>

            <div className="trust-card trust-card-wide">
              <div className="trust-card-title">probe json</div>
              <pre className="trust-pre">
{probe ? JSON.stringify(probe.json ?? {}, null, 2) : "…"}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <main className={"hero " + impactClass}>
        <div className="hero-bg" aria-hidden="true">
          <div className="grain" />
          <div className="glare" />
          <div className="rings" />
        </div>

        <div className="hero-inner">
          <div className="badge-row">
            <span className="badge">DOMINAT8</span>
            <span className="badge subtle">AI Website Automation Builder</span>
            <span className="badge subtle">LIVE_OK</span>
          </div>

          <h1 className="hero-title">
            Build a <span className="accent">premium</span> website in minutes —
            with an AI that actually ships.
          </h1>

          <p className="hero-sub">
            Not a toy generator. A pipeline: strategy → layout → copy → SEO → publish.
            First-load impact + auto demo (once per session).
          </p>

          <div className="cta-row">
            <a className="cta primary" href="/projects/new">
              Start a new build
              <span className="cta-glow" aria-hidden="true" />
            </a>
            <a className="cta ghost" href="/templates">
              Explore templates
            </a>
          </div>

          {/* AUTO DEMO */}
          <section className={"demo " + (demoOn ? "demo-on" : demo === "done" ? "demo-done" : "")}>
            <div className="demo-left">
              <div className="demo-title">
                {demoOn ? "Auto demo: generating…" : (demo === "done" ? "Demo complete" : "Demo")}
              </div>

              <div className="steps">
                {demoSteps.map((s, idx) => {
                  const isActive = demoOn && idx === activeStep;
                  const isDone = demo !== "idle" && idx < activeStep;
                  return (
                    <div
                      key={idx}
                      className={"step " + (isActive ? "active" : "") + (isDone ? " done" : "")}
                    >
                      <div className="dot" aria-hidden="true" />
                      <div className="step-text">
                        <div className="step-title">{s.title}</div>
                        <div className="step-sub">{s.sub}</div>
                      </div>
                      <div className="step-right" aria-hidden="true">
                        {isActive ? <span className="spinner" /> : (isDone ? "✓" : "")}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="demo-foot">
                <span className="micro">
                  {demoOn ? "Runs once per session (sessionStorage)" : "Refresh won’t spam the demo in this tab."}
                </span>
              </div>
            </div>

            <div className="demo-right">
              <div className={"preview " + (demoOn ? "pulse" : "")} data-pulse={demoPulse}>
                <div className="preview-top">
                  <div className="preview-dots" aria-hidden="true">
                    <span /><span /><span />
                  </div>
                  <div className="preview-url">www.dominat8.com</div>
                  <div className="preview-tag">{demoOn ? "GENERATING" : (demo === "done" ? "READY" : "PREVIEW")}</div>
                </div>

                <div className="preview-body">
                  <div className="preview-hero">
                    <div className="ph-title" />
                    <div className="ph-sub" />
                    <div className="ph-cta" />
                  </div>

                  <div className="preview-grid">
                    <div className="card" />
                    <div className="card" />
                    <div className="card" />
                  </div>
                </div>

                <div className="preview-glow" aria-hidden="true" />
              </div>
            </div>
          </section>

          {/* CONFIRM MARKER */}
          <div className="proof">
            <div className="proof-kv">
              <span className="k">HOME_OK</span>
              <span className="v">V7_TIMBER_SLAP</span>
            </div>
            <div className="proof-kv">
              <span className="k">TIP</span>
              <span className="v">Use ?ts=123 to bust any stale caches</span>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .home-root{
          min-height:100vh;
          background:#050608;
          color:#eef2ff;
        }

        /* TRUST STRIP */
        .trust-strip{
          position:sticky;
          top:0;
          z-index:50;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:10px 14px;
          border-bottom:1px solid rgba(255,255,255,0.08);
          background:rgba(5,6,8,0.80);
          backdrop-filter: blur(10px);
        }
        .trust-left{display:flex; align-items:center; gap:10px; flex-wrap:wrap;}
        .trust-pill{
          font-size:11px;
          letter-spacing:0.18em;
          padding:5px 10px;
          border-radius:999px;
          border:1px solid rgba(255,255,255,0.16);
          background:rgba(255,255,255,0.06);
        }
        .trust-text{
          font-size:12px;
          opacity:0.78;
        }
        .trust-btn{
          font-size:12px;
          padding:8px 10px;
          border-radius:10px;
          border:1px solid rgba(255,255,255,0.14);
          background:rgba(255,255,255,0.06);
          color:#eef2ff;
          cursor:pointer;
        }
        .trust-btn:hover{ background:rgba(255,255,255,0.10); }

        .trust-panel{
          padding:14px;
          border-bottom:1px solid rgba(255,255,255,0.08);
          background:rgba(8,9,12,0.60);
        }
        .trust-grid{
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap:12px;
          max-width:1100px;
          margin:0 auto;
        }
        .trust-card{
          border-radius:16px;
          border:1px solid rgba(255,255,255,0.10);
          background:rgba(255,255,255,0.04);
          padding:12px;
          overflow:hidden;
        }
        .trust-card-wide{ grid-column: 1 / span 2; }
        .trust-card-title{
          font-size:12px;
          letter-spacing:0.12em;
          text-transform:uppercase;
          opacity:0.72;
          margin-bottom:10px;
        }
        .trust-kv{
          display:grid;
          grid-template-columns: 110px 1fr;
          gap:6px 10px;
          font-size:12px;
        }
        .trust-kv .k{ opacity:0.65; }
        .trust-kv .v{ opacity:0.92; word-break:break-word; }
        .trust-pre{
          margin:0;
          font-size:12px;
          line-height:1.45;
          white-space:pre-wrap;
          word-break:break-word;
          opacity:0.92;
        }
        .trust-error{
          margin-top:10px;
          font-size:12px;
          color:#ffd3d3;
          opacity:0.95;
        }

        /* HERO */
        .hero{
          position:relative;
          overflow:hidden;
          padding:28px 14px 60px;
        }
        .hero-inner{
          position:relative;
          max-width:1100px;
          margin:0 auto;
        }

        .hero-bg{
          position:absolute;
          inset:0;
          pointer-events:none;
        }
        .grain{
          position:absolute;
          inset:-40px;
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 18px 18px;
          opacity:0.22;
          filter: blur(0.2px);
          transform: rotate(2deg);
        }
        .glare{
          position:absolute;
          left:-20%;
          top:-35%;
          width:140%;
          height:140%;
          background: radial-gradient(closest-side, rgba(255,255,255,0.10), rgba(255,255,255,0.0) 60%);
          opacity:0.30;
          transform: translate3d(0,0,0);
        }
        .rings{
          position:absolute;
          inset:0;
          opacity:0;
          transform: scale(0.95);
        }
        .rings:before,
        .rings:after{
          content:"";
          position:absolute;
          left:50%;
          top:32%;
          width:520px;
          height:520px;
          border-radius:999px;
          transform: translate(-50%,-50%) scale(0.60);
          border:1px solid rgba(255,255,255,0.16);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06) inset;
          opacity:0;
        }
        .rings:after{
          width:760px;
          height:760px;
          border-color: rgba(255,255,255,0.10);
        }

        .badge-row{
          display:flex;
          align-items:center;
          gap:10px;
          flex-wrap:wrap;
          margin-top:10px;
        }
        .badge{
          font-size:12px;
          padding:6px 10px;
          border-radius:999px;
          border:1px solid rgba(255,255,255,0.14);
          background:rgba(255,255,255,0.06);
          letter-spacing:0.14em;
          text-transform:uppercase;
        }
        .badge.subtle{ opacity:0.78; letter-spacing:0.10em; }

        .hero-title{
          margin:18px 0 10px;
          font-size:44px;
          line-height:1.05;
          letter-spacing:-0.02em;
          max-width:920px;
        }
        .accent{
          background: linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0.65));
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        }
        .hero-sub{
          margin:0 0 18px;
          max-width:820px;
          font-size:16px;
          line-height:1.6;
          opacity:0.80;
        }

        .cta-row{
          display:flex;
          gap:10px;
          flex-wrap:wrap;
          margin: 12px 0 22px;
        }
        .cta{
          position:relative;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          padding:12px 14px;
          border-radius:14px;
          border:1px solid rgba(255,255,255,0.14);
          text-decoration:none;
          color:#eef2ff;
          font-weight:600;
          letter-spacing:0.01em;
          overflow:hidden;
        }
        .cta.primary{
          background:rgba(255,255,255,0.12);
        }
        .cta.ghost{
          background:rgba(255,255,255,0.05);
          opacity:0.92;
        }
        .cta:hover{ background:rgba(255,255,255,0.14); }
        .cta-glow{
          position:absolute;
          inset:-20px;
          background: radial-gradient(circle at 40% 20%, rgba(255,255,255,0.35), rgba(255,255,255,0.0) 55%);
          opacity:0.0;
          transition: opacity 180ms ease;
          pointer-events:none;
        }
        .cta.primary:hover .cta-glow{ opacity:0.7; }

        /* DEMO */
        .demo{
          margin-top:12px;
          display:grid;
          grid-template-columns: 1.2fr 1fr;
          gap:12px;
          align-items:stretch;
        }
        @media (max-width: 920px){
          .hero-title{ font-size:34px; }
          .demo{ grid-template-columns: 1fr; }
        }

        .demo-left,.demo-right{
          border-radius:18px;
          border:1px solid rgba(255,255,255,0.10);
          background:rgba(255,255,255,0.04);
          overflow:hidden;
        }
        .demo-left{ padding:14px; }
        .demo-title{
          font-size:12px;
          letter-spacing:0.14em;
          text-transform:uppercase;
          opacity:0.72;
          margin-bottom:10px;
        }
        .steps{ display:flex; flex-direction:column; gap:8px; }
        .step{
          display:flex;
          align-items:flex-start;
          gap:10px;
          padding:10px 10px;
          border-radius:14px;
          border:1px solid rgba(255,255,255,0.08);
          background:rgba(255,255,255,0.03);
        }
        .step .dot{
          width:10px; height:10px;
          border-radius:999px;
          margin-top:5px;
          border:1px solid rgba(255,255,255,0.22);
          background:rgba(255,255,255,0.06);
          box-shadow: 0 0 0 0 rgba(255,255,255,0.0);
          flex: 0 0 auto;
        }
        .step-text{ flex:1; }
        .step-title{ font-size:13px; font-weight:700; opacity:0.92; }
        .step-sub{ font-size:12px; opacity:0.68; margin-top:2px; }
        .step-right{
          font-size:12px;
          opacity:0.80;
          width:24px;
          display:flex;
          align-items:center;
          justify-content:center;
          margin-top:2px;
        }
        .step.active{
          border-color: rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.06);
          transform: translateZ(0);
        }
        .step.active .dot{
          background: rgba(255,255,255,0.20);
          box-shadow: 0 0 0 6px rgba(255,255,255,0.06);
        }
        .step.done{
          opacity:0.78;
        }

        .spinner{
          width:14px;
          height:14px;
          border-radius:999px;
          border:2px solid rgba(255,255,255,0.25);
          border-top-color: rgba(255,255,255,0.85);
          animation: spin 700ms linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .demo-foot{
          margin-top:10px;
          display:flex;
          justify-content:space-between;
          gap:10px;
          opacity:0.70;
          font-size:12px;
        }

        /* PREVIEW */
        .demo-right{ padding:14px; }
        .preview{
          position:relative;
          height:100%;
          min-height:260px;
          border-radius:16px;
          border:1px solid rgba(255,255,255,0.12);
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
          overflow:hidden;
          transform: translateZ(0);
        }
        .preview-top{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          padding:10px 10px;
          border-bottom:1px solid rgba(255,255,255,0.08);
          background: rgba(0,0,0,0.18);
        }
        .preview-dots{ display:flex; gap:6px; }
        .preview-dots span{
          width:9px; height:9px; border-radius:999px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .preview-url{
          font-size:12px;
          opacity:0.75;
          flex:1;
          text-align:center;
        }
        .preview-tag{
          font-size:11px;
          letter-spacing:0.14em;
          opacity:0.80;
          padding:5px 8px;
          border-radius:999px;
          border:1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          white-space:nowrap;
        }
        .preview-body{
          padding:14px;
        }
        .preview-hero{
          border-radius:14px;
          border:1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          padding:14px;
          margin-bottom:12px;
        }
        .ph-title{
          height:18px;
          border-radius:10px;
          background: rgba(255,255,255,0.14);
          width:72%;
        }
        .ph-sub{
          margin-top:10px;
          height:10px;
          border-radius:10px;
          background: rgba(255,255,255,0.08);
          width:88%;
        }
        .ph-cta{
          margin-top:12px;
          height:34px;
          border-radius:12px;
          background: rgba(255,255,255,0.10);
          width:44%;
          border:1px solid rgba(255,255,255,0.10);
        }
        .preview-grid{
          display:grid;
          grid-template-columns: repeat(3, 1fr);
          gap:10px;
        }
        .preview-grid .card{
          height:70px;
          border-radius:14px;
          border:1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
        }
        @media (max-width: 520px){
          .preview-grid{ grid-template-columns: 1fr; }
          .preview-grid .card{ height:58px; }
        }

        .preview-glow{
          position:absolute;
          inset:-30%;
          background: radial-gradient(circle at 40% 20%, rgba(255,255,255,0.22), rgba(255,255,255,0.0) 55%);
          opacity:0.0;
          pointer-events:none;
          transform: translate3d(0,0,0);
        }
        .preview.pulse .preview-glow{
          animation: glowPulse 600ms ease-out infinite;
        }
        @keyframes glowPulse{
          0%{ opacity:0.05; transform: translate3d(0,0,0) scale(1.0); }
          50%{ opacity:0.22; transform: translate3d(0,0,0) scale(1.02); }
          100%{ opacity:0.06; transform: translate3d(0,0,0) scale(1.0); }
        }

        /* PROOF */
        .proof{
          margin-top:14px;
          display:flex;
          flex-wrap:wrap;
          gap:10px;
          opacity:0.72;
        }
        .proof-kv{
          display:flex;
          gap:8px;
          align-items:center;
          border:1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          padding:8px 10px;
          border-radius:14px;
          font-size:12px;
        }
        .proof-kv .k{ letter-spacing:0.12em; text-transform:uppercase; opacity:0.72; }
        .proof-kv .v{ opacity:0.90; }

        /* IMPACT INTRO (THE SLAP) */
        .impact-armed .hero-title,
        .impact-armed .hero-sub,
        .impact-armed .cta-row,
        .impact-armed .demo,
        .impact-armed .proof{
          opacity:0;
          transform: translateY(10px) scale(0.985);
        }

        .impact-fired{
          animation: microKick 180ms cubic-bezier(0.2, 0.9, 0.2, 1) 0ms 1 both;
        }
        @keyframes microKick{
          0%{ transform: translate3d(0,0,0) rotate(0deg); }
          35%{ transform: translate3d(0,-2px,0) rotate(-0.12deg); }
          70%{ transform: translate3d(0,1px,0) rotate(0.10deg); }
          100%{ transform: translate3d(0,0,0) rotate(0deg); }
        }

        .impact-fired .hero-title{
          animation: snapIn 520ms cubic-bezier(0.18, 0.92, 0.20, 1) 40ms 1 both;
        }
        .impact-fired .hero-sub{
          animation: snapIn 520ms cubic-bezier(0.18, 0.92, 0.20, 1) 80ms 1 both;
        }
        .impact-fired .cta-row{
          animation: snapIn 520ms cubic-bezier(0.18, 0.92, 0.20, 1) 120ms 1 both;
        }
        .impact-fired .demo{
          animation: snapIn 520ms cubic-bezier(0.18, 0.92, 0.20, 1) 160ms 1 both;
        }
        .impact-fired .proof{
          animation: snapIn 520ms cubic-bezier(0.18, 0.92, 0.20, 1) 200ms 1 both;
        }

        @keyframes snapIn{
          0%{ opacity:0; transform: translateY(12px) scale(0.92); filter: blur(2px); }
          60%{ opacity:1; transform: translateY(-2px) scale(1.01); filter: blur(0px); }
          100%{ opacity:1; transform: translateY(0px) scale(1.0); filter: blur(0px); }
        }

        .impact-fired .rings{
          opacity:1;
          animation: ringsOn 900ms ease-out 0ms 1 both;
        }
        .impact-fired .rings:before{
          animation: ring 760ms ease-out 0ms 1 both;
        }
        .impact-fired .rings:after{
          animation: ring 900ms ease-out 40ms 1 both;
        }
        @keyframes ringsOn{
          0%{ opacity:0; transform: scale(0.95); }
          25%{ opacity:1; transform: scale(1.0); }
          100%{ opacity:0.18; transform: scale(1.05); }
        }
        @keyframes ring{
          0%{ opacity:0; transform: translate(-50%,-50%) scale(0.55); }
          25%{ opacity:0.85; }
          100%{ opacity:0; transform: translate(-50%,-50%) scale(1.05); }
        }

        .impact-fired .glare{
          animation: glareBurst 620ms ease-out 0ms 1 both;
        }
        @keyframes glareBurst{
          0%{ opacity:0.05; transform: translate3d(0,0,0) scale(0.98); }
          35%{ opacity:0.55; transform: translate3d(0,0,0) scale(1.02); }
          100%{ opacity:0.28; transform: translate3d(0,0,0) scale(1.0); }
        }
      `}</style>
    </div>
  );
}