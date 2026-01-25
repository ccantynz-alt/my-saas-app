export const dynamic = "force-dynamic";

const BRAND = "Dominat8";

export default function HomePage() {
  const BUILD_ID = "BUILD_ID_20260125_155938";
  const BUILD_ISO = "2026-01-25T02:59:38.2483518Z";

  return (
    <main
      data-build-id={BUILD_ID}
      data-build-iso={BUILD_ISO}
      style={{
        minHeight: "100vh",
        color: "#EAF0FF",
        background:
          "radial-gradient(1400px 800px at 15% -10%, rgba(255,215,0,0.14), transparent 60%)," +
          "radial-gradient(1200px 700px at 85% 0%, rgba(0,255,200,0.11), transparent 55%)," +
          "radial-gradient(900px 500px at 55% 35%, rgba(140,120,255,0.10), transparent 60%)," +
          "linear-gradient(180deg, #05060a 0%, #070913 55%, #05060a 100%)",
        overflowX: "hidden",
      }}
    >
      {/* HARD PROOF MARKER (invisible, safe JSX) */}
      <div style={{ position: "absolute", left: -9999, top: -9999 }}>{BUILD_ID}</div>

      {/* TOP NAV */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(14px)" as any }}>
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(6,7,12,0.55)",
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
            }}
          >
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                color: "#EAF0FF",
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  background:
                    "linear-gradient(135deg, rgba(255,215,0,0.92), rgba(0,255,200,0.70))",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.55)",
                  display: "inline-block",
                }}
              />
              <span style={{ fontWeight: 800, letterSpacing: 0.2 }}>{BRAND}</span>
              <span style={{ opacity: 0.65, fontSize: 12 }}>AI Website Automation</span>
            </a>

            <nav style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <a href="/templates" style={linkStyle()}>Templates</a>
              <a href="/use-cases" style={linkStyle()}>Use Cases</a>
              <a href="/pricing" style={linkStyle()}>Pricing</a>

              <a
                href="/templates"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 14px",
                  borderRadius: 14,
                  textDecoration: "none",
                  fontWeight: 800,
                  color: "#061018",
                  background:
                    "linear-gradient(135deg, rgba(255,215,0,0.95), rgba(0,255,200,0.78))",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  whiteSpace: "nowrap",
                }}
              >
                Launch →
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          padding: "82px 18px 36px 18px",
        }}
      >
        {/* Background layers */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(900px 520px at 50% 25%, rgba(255,255,255,0.06), transparent 60%)," +
              "radial-gradient(1000px 650px at 50% 110%, rgba(0,0,0,0.72), rgba(0,0,0,0.92))",
          }}
        />

        {/* GOLD SIGNAL RAIN */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-30% 0 -30% 0",
            pointerEvents: "none",
            opacity: 0.95,
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,215,0,0.00) 0px, rgba(255,215,0,0.00) 10px, rgba(255,215,0,0.12) 11px, rgba(255,215,0,0.00) 12px)," +
              "repeating-linear-gradient(180deg, rgba(0,255,200,0.00) 0px, rgba(0,255,200,0.00) 16px, rgba(0,255,200,0.07) 17px, rgba(0,255,200,0.00) 18px)",
            maskImage:
              "radial-gradient(640px 400px at 50% 22%, black 22%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(640px 400px at 50% 22%, black 22%, transparent 72%)",
            animation: "d8_drift 7s linear infinite",
            transform: "translateY(0px)",
          }}
        />

        {/* Floating aura blobs */}
        <div aria-hidden="true" style={blobStyle("12%", "18%", 480, "rgba(255,215,0,0.18)")} />
        <div aria-hidden="true" style={blobStyle("78%", "24%", 520, "rgba(0,255,200,0.14)")} />
        <div aria-hidden="true" style={blobStyle("52%", "48%", 620, "rgba(140,120,255,0.12)")} />

        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Badge row */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(8,10,16,0.55)",
              boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
              marginBottom: 18,
            }}
          >
            <span style={dotStyle()} />
            <span style={{ fontSize: 13, letterSpacing: 0.4, opacity: 0.92 }}>
              Premium results without premium effort
            </span>
            <span style={{ opacity: 0.55, fontSize: 12 }}>•</span>
            <span style={{ opacity: 0.75, fontSize: 12 }}>Build: {BUILD_ID}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.18fr 0.82fr", gap: 26, alignItems: "center" }}>
            {/* Left: headline */}
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 64,
                  lineHeight: 1.03,
                  letterSpacing: -1.4,
                  textShadow: "0 24px 90px rgba(0,0,0,0.65)",
                }}
              >
                The AI that builds
                <br />
                <span style={gradientTextStyle()}>
                  a flagship website
                </span>
                <br />
                you are proud to launch.
              </h1>

              <p
                style={{
                  margin: "18px 0 0 0",
                  fontSize: 18,
                  lineHeight: 1.65,
                  maxWidth: 720,
                  opacity: 0.86,
                }}
              >
                {BRAND} generates your pages, structure, copy, and polish — fast. Clean layout. Strong spacing.
                Premium feel. Ready for your domain.
              </p>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
                <a href="/templates" style={primaryCtaStyle()}>
                  Start from a template →
                </a>
                <a href="/use-cases" style={secondaryCtaStyle()}>
                  See real outcomes
                </a>
              </div>

              {/* Trust row */}
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  alignItems: "center",
                  marginTop: 18,
                  opacity: 0.86,
                  fontSize: 13,
                }}
              >
                <span style={pillStyle()}>Fast build</span>
                <span style={pillStyle()}>SEO-ready structure</span>
                <span style={pillStyle()}>Custom domains</span>
                <span style={pillStyle()}>Publish pipeline</span>
              </div>
            </div>

            {/* Right: glass card */}
            <div style={glassPanelStyle()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>Launch-ready checklist</div>
                  <div style={{ fontSize: 13, opacity: 0.72, marginTop: 4 }}>
                    The stuff that makes it feel expensive.
                  </div>
                </div>
                <span style={miniBadgeStyle()}>Live</span>
              </div>

              <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                {[
                  ["Hero & sections", "Spacing + typography tuned"],
                  ["Pages generated", "Templates, pricing, use-cases"],
                  ["SEO foundations", "Metadata + structure ready"],
                  ["Domain-ready", "Deploy on your brand"],
                ].map(([t, d]) => (
                  <div key={t} style={rowStyle()}>
                    <span style={checkStyle()}>✓</span>
                    <div>
                      <div style={{ fontWeight: 750 }}>{t}</div>
                      <div style={{ opacity: 0.72, fontSize: 13, marginTop: 2 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 14 }}>
                <div style={{ fontSize: 12, opacity: 0.65 }}>
                  Marker: <span style={{ opacity: 0.95 }}>{BUILD_ID}</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.55, marginTop: 4 }}>{BUILD_ISO}</div>
              </div>
            </div>
          </div>

          {/* Below fold: 3 feature cards */}
          <div
            style={{
              marginTop: 34,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
            }}
          >
            {[
              ["Finish-for-me pipeline", "Idea → pages → publish. Orchestrated and consistent."],
              ["Premium by default", "Clean rhythm, glass UI, modern gradients, trust signals."],
              ["Built for scale", "Add agents, domain wizard, billing — without redesigning everything."],
            ].map(([t, d]) => (
              <div key={t} style={featureCardStyle()}>
                <div style={{ fontWeight: 850, marginBottom: 6 }}>{t}</div>
                <div style={{ opacity: 0.78, lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* keyframes */}
        <style>{
          @keyframes d8_drift {
            0% { transform: translateY(-10px); opacity: 0.75; }
            50% { transform: translateY(10px); opacity: 0.98; }
            100% { transform: translateY(-10px); opacity: 0.75; }
          }
          @keyframes d8_float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(14px); }
            100% { transform: translateY(0px); }
          }
        }</style>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "44px 18px 70px 18px", opacity: 0.78 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div style={{ fontWeight: 800 }}>{BRAND}</div>
          <div style={{ fontSize: 12, opacity: 0.65 }}>Build: {BUILD_ID}</div>
        </div>
      </footer>
    </main>
  );
}

/* ---------- styles ---------- */

function linkStyle(): React.CSSProperties {
  return {
    color: "rgba(234,240,255,0.85)",
    textDecoration: "none",
    fontSize: 13,
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.00)",
  };
}

function gradientTextStyle(): React.CSSProperties {
  return {
    background: "linear-gradient(90deg, rgba(255,215,0,0.95), rgba(0,255,200,0.90), rgba(140,120,255,0.90))",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };
}

function primaryCtaStyle(): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 18px",
    borderRadius: 16,
    fontWeight: 900,
    color: "#061018",
    textDecoration: "none",
    background: "linear-gradient(135deg, rgba(255,215,0,0.95), rgba(0,255,200,0.78))",
    boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
    border: "1px solid rgba(255,255,255,0.10)",
    minWidth: 220,
    letterSpacing: 0.1,
  };
}

function secondaryCtaStyle(): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 18px",
    borderRadius: 16,
    fontWeight: 800,
    color: "rgba(234,240,255,0.92)",
    textDecoration: "none",
    background: "rgba(10,12,18,0.35)",
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
    minWidth: 190,
  };
}

function pillStyle(): React.CSSProperties {
  return {
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(8,10,16,0.35)",
  };
}

function glassPanelStyle(): React.CSSProperties {
  return {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "linear-gradient(180deg, rgba(10,12,18,0.55), rgba(10,12,18,0.28))",
    boxShadow: "0 30px 100px rgba(0,0,0,0.55)",
    padding: 18,
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(16px)" as any,
  };
}

function miniBadgeStyle(): React.CSSProperties {
  return {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    opacity: 0.9,
    whiteSpace: "nowrap",
  };
}

function rowStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "22px 1fr",
    gap: 10,
    padding: "10px 10px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
  };
}

function checkStyle(): React.CSSProperties {
  return {
    width: 22,
    height: 22,
    borderRadius: 8,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,255,200,0.14)",
    border: "1px solid rgba(0,255,200,0.20)",
    color: "rgba(0,255,200,0.95)",
    fontWeight: 900,
  };
}

function dotStyle(): React.CSSProperties {
  return {
    width: 10,
    height: 10,
    borderRadius: 999,
    background: "rgba(255,215,0,0.92)",
    boxShadow: "0 0 22px rgba(255,215,0,0.55)",
    display: "inline-block",
  };
}

function featureCardStyle(): React.CSSProperties {
  return {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(10,12,18,0.35)",
    boxShadow: "0 26px 90px rgba(0,0,0,0.35)",
    padding: 18,
    backdropFilter: "blur(14px)" as any,
  };
}

function blobStyle(left: string, top: string, size: number, color: string): React.CSSProperties {
  return {
    position: "absolute",
    left,
    top,
    width: size,
    height: size,
    borderRadius: 999,
    background: color,
    filter: "blur(40px)",
    opacity: 0.75,
    transform: "translate(-50%, -50%)",
    animation: "d8_float 10s ease-in-out infinite",
    pointerEvents: "none",
  };
}
