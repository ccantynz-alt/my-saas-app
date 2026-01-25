export const dynamic = "force-dynamic";

export default function HomePage() {
  const BUILD_ID = "BUILD_ID_20260125_160800";
  const BUILD_ISO = "2026-01-25T03:08:00.5957898Z";

  return (
    <main style={{ minHeight: "100vh", background: "#05060a", color: "#fff", padding: "48px 18px" }}>
      <div style={{ position: "absolute", left: -9999, top: -9999 }}>{BUILD_ID}</div>

      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "10px 14px", borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(10,12,16,0.45)"
        }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "rgba(255,215,0,0.95)" }} />
          <span style={{ fontSize: 13, opacity: 0.9 }}>Dominat8 — Live build marker: {BUILD_ID}</span>
        </div>

        <h1 style={{ marginTop: 18, fontSize: 56, lineHeight: 1.05, letterSpacing: -1.2 }}>
          Dominat8 is live.
          <br />
          <span style={{
            background: "linear-gradient(90deg, rgba(255,215,0,0.95), rgba(0,255,200,0.9))",
            WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent"
          }}>
            Next: WOW homepage.
          </span>
        </h1>

        <p style={{ marginTop: 12, fontSize: 18, lineHeight: 1.6, opacity: 0.85, maxWidth: 780 }}>
          This is a safe render page to prevent white screens. Once confirmed live, we re-apply the WOW layout using the byte-clean writer.
        </p>

        <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/templates" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            padding: "14px 18px", borderRadius: 14, textDecoration: "none",
            fontWeight: 800, color: "#061018",
            background: "linear-gradient(135deg, rgba(255,215,0,0.95), rgba(0,255,200,0.78))"
          }}>Templates →</a>

          <a href="/pricing" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            padding: "14px 18px", borderRadius: 14, textDecoration: "none",
            fontWeight: 700, color: "#fff",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(10,12,16,0.35)"
          }}>Pricing</a>
        </div>

        <p style={{ marginTop: 20, fontSize: 12, opacity: 0.6 }}>
          {BUILD_ISO}
        </p>
      </div>
    </main>
  );
}