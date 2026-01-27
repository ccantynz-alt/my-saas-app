import Link from "next/link";

export const dynamic = "force-dynamic";

function buildMeta() {
  const env = process.env.VERCEL_ENV || "unknown";
  const deployId = process.env.VERCEL_DEPLOYMENT_ID || "unknown";
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || "unknown";
  return { env, deployId, sha };
}

export default function HomePage() {
  const meta = buildMeta();

  // Inline fallbacks so it NEVER renders “unstyled”
  const c = {
    bg: "#070A12",
    white: "#FFFFFF",
    white70: "rgba(255,255,255,0.70)",
    white55: "rgba(255,255,255,0.55)",
    border: "rgba(255,255,255,0.12)",
    panel: "rgba(255,255,255,0.06)",
    panel2: "rgba(0,0,0,0.35)",
    violet: "#8B5CF6",
    violet2: "#A78BFA",
  };

  const heroBgStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    backgroundColor: c.bg,
    backgroundImage: [
      "radial-gradient(1200px 600px at 50% 0%, rgba(168,85,247,0.28), transparent 60%)",
      "radial-gradient(1000px 600px at 85% 20%, rgba(59,130,246,0.22), transparent 60%)",
      "radial-gradient(900px 600px at 15% 35%, rgba(236,72,153,0.18), transparent 60%)",
      "radial-gradient(900px 500px at 50% 35%, transparent, rgba(7,10,18,0.92))",
    ].join(", "),
  };

  const dotStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    opacity: 0.16,
    backgroundImage: "radial-gradient(rgba(255,255,255,0.75) 1px, transparent 1px)",
    backgroundSize: "26px 26px",
  };

  return (
    <main
      className="min-h-screen text-white"
      style={{ minHeight: "100vh", color: c.white, backgroundColor: c.bg }}
    >
      {/* Locked background (works even if Tailwind doesn’t) */}
      <div aria-hidden="true" style={heroBgStyle} />
      <div aria-hidden="true" style={dotStyle} />

      {/* Top nav */}
      <header className="relative z-10">
        <div
          className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5"
          style={{ maxWidth: 1152, margin: "0 auto", padding: "20px 16px" }}
        >
          <div className="flex items-center gap-2" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              className="h-9 w-9 rounded-xl grid place-items-center"
              style={{
                height: 36,
                width: 36,
                borderRadius: 14,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 800 }}>D8</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>Dominat8</div>
          </div>

          <nav
            className="hidden md:flex items-center gap-7 text-sm"
            style={{ display: "none" }}
          >
            {/* keep minimal — your site already has /admin as main entry */}
          </nav>

          <Link
            href="/admin"
            className="rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-[#070A12]"
            style={{
              borderRadius: 14,
              background: c.white,
              color: c.bg,
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10">
        <div
          className="mx-auto max-w-6xl px-4 pt-8 pb-14 md:pt-12"
          style={{ maxWidth: 1152, margin: "0 auto", padding: "32px 16px 56px 16px" }}
        >
          <div className="mx-auto max-w-3xl text-center" style={{ maxWidth: 768, margin: "0 auto", textAlign: "center" }}>
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-semibold"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(255,255,255,0.82)",
              }}
            >
              <span
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 999,
                  background: c.violet2,
                  boxShadow: "0 0 18px rgba(196,181,253,0.70)",
                  display: "inline-block",
                }}
              />
              More than a website builder
            </div>

            <h1
              className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
              style={{
                marginTop: 18,
                fontSize: 56,
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: c.white,
              }}
            >
              Your site should do more{" "}
              <span style={{ color: "rgba(255,255,255,0.92)" }}>than look good</span>
            </h1>

            <p
              className="mt-4 text-sm leading-relaxed sm:text-base"
              style={{ marginTop: 14, fontSize: 15, lineHeight: 1.6, color: c.white70 }}
            >
              Dominat8 builds high-converting, publish-ready sites with structure and SEO foundations —
              without the chaos.
            </p>

            <div
              className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{
                marginTop: 22,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <Link
                href="/admin"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 18,
                  background: c.violet,
                  color: c.white,
                  padding: "12px 18px",
                  fontSize: 13,
                  fontWeight: 900,
                  textDecoration: "none",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
                }}
              >
                Start Building Now
              </Link>

              <a
                href="#preview"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.92)",
                  padding: "12px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Watch video
              </a>
            </div>
          </div>

          {/* Product preview */}
          <div
            id="preview"
            style={{
              marginTop: 34,
              borderRadius: 28,
              border: `1px solid ${c.border}`,
              background: c.panel,
              padding: 16,
              boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.10)",
                background: c.panel2,
                padding: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.70)" }}>LIVE_OK</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.50)" }}>env: {meta.env}</div>
              </div>

              <div
                style={{
                  marginTop: 12,
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
                }}
              >
                <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.05)", padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.60)" }}>Editor</div>
                  <div style={{ marginTop: 8, fontSize: 14, fontWeight: 900 }}>Generate Website</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.60)" }}>Pages • Sections • Styles</div>
                  <div style={{ marginTop: 10, height: 8, borderRadius: 999, background: "rgba(255,255,255,0.10)" }}>
                    <div style={{ height: 8, width: "66%", borderRadius: 999, background: "rgba(139,92,246,0.85)" }} />
                  </div>
                </div>

                <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.05)", padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.60)" }}>Preview</div>
                  <div style={{ marginTop: 8, borderRadius: 12, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(0,0,0,0.40)", padding: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.80)" }}>Maximizing the Potential</div>
                    <div style={{ marginTop: 10, height: 84, borderRadius: 10, background: "rgba(255,255,255,0.10)" }} />
                    <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                      <div style={{ height: 28, width: 78, borderRadius: 10, background: "rgba(139,92,246,0.75)" }} />
                      <div style={{ height: 28, width: 96, borderRadius: 10, background: "rgba(255,255,255,0.10)" }} />
                    </div>
                  </div>
                </div>

                <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.05)", padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.60)" }}>Deploy Proof</div>
                  <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.70)" }}>DEPLOY_ID</div>
                  <div style={{ marginTop: 4, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 11, color: "rgba(255,255,255,0.85)", wordBreak: "break-all" }}>
                    {meta.deployId}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.70)" }}>GIT_SHA</div>
                  <div style={{ marginTop: 4, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 11, color: "rgba(255,255,255,0.85)", wordBreak: "break-all" }}>
                    {meta.sha}
                  </div>
                </div>
              </div>

              {/* Make it “3 columns” on wider screens without Tailwind */}
              <style>{`
                @media (min-width: 900px) {
                  #preview > div > div:nth-child(2) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
              `}</style>
            </div>
          </div>

          {/* Minimal footer spacer (keeps hero dominant) */}
          <div style={{ marginTop: 30, textAlign: "center", color: c.white55, fontSize: 12 }}>
            © {new Date().getFullYear()} Dominat8. All rights reserved.
          </div>
        </div>
      </section>
    </main>
  );
}
