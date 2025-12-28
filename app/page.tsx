import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "40px 18px" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontWeight: 800, letterSpacing: -0.3 }}>AI Website Builder</div>
        <nav style={{ display: "flex", gap: 14, fontSize: 14 }}>
          <Link href="/pricing">Pricing</Link>
          <Link href="/trust">Trust</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <section style={{ marginTop: 44 }}>
        <h1 style={{ fontSize: 44, lineHeight: 1.05, letterSpacing: -1.2, margin: 0 }}>
          Build a real website with AI — and actually own it.
        </h1>
        <p style={{ marginTop: 14, fontSize: 18, color: "rgba(0,0,0,0.72)", maxWidth: 720 }}>
          Describe what you want. Our AI builds a real website, previews it instantly, and publishes it live when you’re
          ready. No mockups. No lock-in. No rebuilding later.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              background: "black",
              color: "white",
              padding: "12px 16px",
              borderRadius: 14,
              textDecoration: "none",
              fontWeight: 650,
            }}
          >
            Build my website →
          </Link>
          <Link
            href="#how"
            style={{
              display: "inline-flex",
              background: "rgba(0,0,0,0.06)",
              color: "black",
              padding: "12px 16px",
              borderRadius: 14,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            See how it works →
          </Link>
        </div>

        {/* Trust strip */}
        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          {["✅ Real code", "✅ GitHub-backed", "✅ Deploys live", "✅ You own everything"].map((t) => (
            <span
              key={t}
              style={{
                fontSize: 13,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.07)",
                color: "rgba(0,0,0,0.72)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 44, display: "grid", gap: 18 }}>
        <div style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 20, padding: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Why most AI website builders disappoint</h2>
          <p style={{ marginTop: 10, color: "rgba(0,0,0,0.75)" }}>
            They look impressive at first — but break the moment you try to use them seriously.
          </p>
          <ul style={{ marginTop: 10, color: "rgba(0,0,0,0.75)" }}>
            <li>You can’t edit the code</li>
            <li>You can’t scale later</li>
            <li>You can’t hand it to a developer</li>
            <li>You don’t really own it</li>
          </ul>
          <p style={{ marginTop: 10, color: "rgba(0,0,0,0.75)" }}>Eventually, you have to start over.</p>
        </div>

        <div id="how" style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 20, padding: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>How it works</h2>
          <div style={{ display: "grid", gap: 10, marginTop: 12, color: "rgba(0,0,0,0.75)" }}>
            <div>
              <strong>1.</strong> Describe your website in plain English
            </div>
            <div>
              <strong>2.</strong> AI generates real Next.js files (pages, layout, content)
            </div>
            <div>
              <strong>3.</strong> Preview instantly (visual + source)
            </div>
            <div>
              <strong>4.</strong> Publish when ready (commit + deploy live)
            </div>
          </div>
        </div>

        <details style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 20, padding: 18 }}>
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>Built for developers (optional)</summary>
          <p style={{ marginTop: 10, color: "rgba(0,0,0,0.75)" }}>
            Built on Next.js, TypeScript, GitHub, and Vercel. Safe merges. No proprietary formats. No lock-in.
          </p>
        </details>
      </section>

      <section style={{ marginTop: 44, borderRadius: 24, padding: 22, background: "rgba(0,0,0,0.04)" }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Build once. Own it forever.</h2>
        <p style={{ marginTop: 10, color: "rgba(0,0,0,0.75)" }}>
          Stop rebuilding. Stop exporting. Stop starting over. Build your website the right way.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            background: "black",
            color: "white",
            padding: "12px 16px",
            borderRadius: 14,
            textDecoration: "none",
            fontWeight: 650,
            marginTop: 10,
          }}
        >
          Get started →
        </Link>
      </section>

      <footer style={{ marginTop: 44, fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
        © {new Date().getFullYear()} AI Website Builder. <Link href="/trust">Trust & ownership</Link>.
      </footer>
    </main>
  );
}
