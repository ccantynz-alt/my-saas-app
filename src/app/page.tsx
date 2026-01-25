export const dynamic = "force-dynamic";

export default function HomePage() {
  const BUILD_ID = "BUILD_ID_20260125_154954";
  const BUILD_ISO = "2026-01-25T02:49:54.7751673Z";

  return (
    <main
      data-build-id={BUILD_ID}
      data-build-iso={BUILD_ISO}
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 20% 0%, rgba(255,215,0,0.08), transparent 60%), radial-gradient(900px 500px at 80% 10%, rgba(0,255,200,0.06), transparent 55%), #05060a",
        color: "#fff",
      }}
    >
      {/* HARD PROOF MARKER (safe, inside JSX) */}
      <div style={{ position: "absolute", left: -9999, top: -9999 }}>
        {BUILD_ID}
      </div>

      <section
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "64px 24px",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(1000px 650px at 50% 35%, rgba(255,255,255,0.06), transparent 60%), radial-gradient(1200px 800px at 50% 100%, rgba(0,0,0,0.65), rgba(0,0,0,0.9))",
            pointerEvents: "none",
          }}
        />

        {/* GOLD SIGNAL RAIN */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.9,
            pointerEvents: "none",
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,215,0,0.0) 0px, rgba(255,215,0,0.0) 12px, rgba(255,215,0,0.12) 13px, rgba(255,215,0,0.0) 14px), repeating-linear-gradient(180deg, rgba(0,255,200,0.0) 0px, rgba(0,255,200,0.0) 18px, rgba(0,255,200,0.08) 19px, rgba(0,255,200,0.0) 20px)",
            maskImage:
              "radial-gradient(600px 360px at 50% 35%, black 20%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(600px 360px at 50% 35%, black 20%, transparent 70%)",
            animation: "drift 6s linear infinite",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: 1100,
            position: "relative",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(10,12,16,0.55)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              marginBottom: 18,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "rgba(255,215,0,0.9)",
                boxShadow: "0 0 22px rgba(255,215,0,0.55)",
              }}
            />
            <span style={{ fontSize: 13, letterSpacing: 0.4, opacity: 0.9 }}>
              Dominat8 — AI Website Automation Builder
            </span>
          </div>

          <h1
            style={{
              fontSize: 56,
              lineHeight: 1.05,
              margin: "0 0 14px 0",
              letterSpacing: -1.2,
              textShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            Build a premium website
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,215,0,0.95), rgba(0,255,200,0.9))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              in minutes — automatically.
            </span>
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              margin: "0 auto 28px auto",
              maxWidth: 820,
              opacity: 0.85,
            }}
          >
            Dominat8 generates your pages, copy, structure, and launch-ready polish — with
            a clean, modern finish.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/templates"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 18px",
                borderRadius: 14,
                background:
                  "linear-gradient(135deg, rgba(255,215,0,0.95), rgba(0,255,200,0.75))",
                color: "#061018",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
                minWidth: 210,
              }}
            >
              See Templates →
            </a>

            <a
              href="/use-cases"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 18px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(10,12,16,0.40)",
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
                minWidth: 210,
              }}
            >
              Explore Use Cases
            </a>
          </div>

          <p style={{ marginTop: 28, fontSize: 12, opacity: 0.55 }}>
            Marker: {BUILD_ID} • {BUILD_ISO}
          </p>
        </div>

        <style>{
          @keyframes drift {
            0% { transform: translateY(-6px); opacity: 0.75; }
            50% { transform: translateY(8px); opacity: 0.95; }
            100% { transform: translateY(-6px); opacity: 0.75; }
          }
        }</style>
      </section>
    </main>
  );
}
