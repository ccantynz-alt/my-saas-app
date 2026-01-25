export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main style={{ minHeight: "100vh", background: "#050608", color: "white", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.28em", opacity: 0.7 }}>
          HOME_OK • BUILD_SAFE
        </div>

        <h1 style={{ fontSize: 56, lineHeight: 1.05, marginTop: 18, marginBottom: 18 }}>
          The WOW website builder. Built by AI. Shipped fast.
        </h1>

        <p style={{ fontSize: 18, opacity: 0.85, maxWidth: 820 }}>
          This is the build-safe version of the homepage to unblock Vercel. Next step: reintroduce the cursor-glow
          hero as a client component once the pipeline is green.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
          <a href="/(marketing)/pricing" style={{ padding: "12px 16px", borderRadius: 12, background: "white", color: "black", textDecoration: "none", fontWeight: 600 }}>
            View Pricing
          </a>
          <a href="/(marketing)/templates" style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.22)", color: "white", textDecoration: "none" }}>
            Browse Templates
          </a>
          <a href="/(marketing)/use-cases" style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.22)", color: "white", textDecoration: "none" }}>
            Use Cases
          </a>
        </div>

        <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {[
            "AI builds pages end-to-end",
            "SEO-ready structure",
            "Ship to production fast",
            "Clean, premium marketing look",
          ].map((t) => (
            <div key={t} style={{ padding: 14, borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{t}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 44, fontSize: 12, opacity: 0.65 }}>
          DEPLOY_MARKER: HOME_BUILD_SAFE_20260125
        </div>
      </div>
    </main>
  );
}