"use client";

export default function HomeClient() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      background:
        "radial-gradient(1000px 600px at 15% 10%, rgba(255,255,255,0.10), transparent 60%)," +
        "radial-gradient(900px 500px at 85% 30%, rgba(255,255,255,0.08), transparent 55%)," +
        "linear-gradient(180deg, #050608 0%, #07080b 55%, #06070a 100%)",
      color: "white",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 32px",
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gap: 56,
        alignItems: "center"
      }}>

        {/* LEFT: Authority */}
        <div>
          <div style={{
            display: "inline-block",
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.06)",
            fontSize: 12,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.75)"
          }}>
            AI Website Automation
          </div>

          <h1 style={{
            marginTop: 22,
            fontSize: 56,
            lineHeight: 1.05,
            fontWeight: 900,
            letterSpacing: -1.4
          }}>
            This is how websites<br />are made now.
          </h1>

          <p style={{
            marginTop: 20,
            fontSize: 18,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.72)",
            maxWidth: 520
          }}>
            Describe your business. Your website assembles itself. Publish.
          </p>

          <div style={{
            marginTop: 30,
            display: "flex",
            alignItems: "center",
            gap: 16
          }}>
            <a href="/builder" style={{
              padding: "16px 24px",
              borderRadius: 16,
              background: "white",
              color: "black",
              fontWeight: 900,
              fontSize: 16,
              textDecoration: "none",
              boxShadow: "0 22px 50px rgba(0,0,0,0.45)"
            }}>
              Build my site
            </a>

            <span style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.6)"
            }}>
              No templates. No setup.
            </span>
          </div>

          <div style={{
            marginTop: 36,
            fontSize: 11,
            color: "rgba(255,255,255,0.45)"
          }}>
            LIVE_20260126_085401
          </div>
        </div>

        {/* RIGHT: Proof */}
        <div style={{
          borderRadius: 22,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(0,0,0,0.38)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
          overflow: "hidden"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(0,0,0,0.45)"
          }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ff5f56" }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ffbd2e" }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#27c93f" }} />
            <div style={{
              margin: "0 auto",
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              fontSize: 11,
              color: "rgba(255,255,255,0.7)"
            }}>
              dominat8.com / preview
            </div>
          </div>

          <div style={{ padding: 20 }}>
            <div style={{
              fontSize: 11,
              letterSpacing: 2.4,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)"
            }}>
              Generating website
            </div>

            <div style={{
              marginTop: 10,
              height: 8,
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              overflow: "hidden"
            }}>
              <div style={{
                width: "78%",
                height: "100%",
                background: "linear-gradient(90deg, #22d3ee, #a855f7)"
              }} />
            </div>

            <div style={{
              marginTop: 18,
              fontSize: 18,
              fontWeight: 800
            }}>
              Building your homepage…
            </div>

            <div style={{
              marginTop: 16,
              display: "flex",
              flexWrap: "wrap",
              gap: 10
            }}>
              {["SEO Ready","Sitemap Generated","Published"].map(x => (
                <span key={x} style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.06)"
                }}>
                  ✓ {x}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}