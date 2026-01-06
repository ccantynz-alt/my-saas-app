"use client";

import { useState } from "react";

export default function GeneratePanel({ projectId }: { projectId: string }) {
  const [prompt, setPrompt] = useState(
    "Create a professional business website with hero, services, testimonials, about, and contact. Clean modern styling."
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [body, setBody] = useState<string>("");

  async function generateAndPublish() {
    setLoading(true);
    setStatus("");
    setBody("");

    try {
      // --- 1️⃣ Generate REAL HTML ---
      const safeTitle = prompt.slice(0, 60).replace(/</g, "").replace(/>/g, "");
      const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${safeTitle || "Generated Site"}</title>
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:0;background:#0b1220;color:#e8eefc}
      header{padding:64px 24px;background:linear-gradient(135deg,#182a4d,#0b1220)}
      .wrap{max-width:980px;margin:0 auto}
      h1{font-size:44px;line-height:1.1;margin:0 0 12px}
      p{opacity:.9;line-height:1.6;margin:0 0 18px}
      .btn{display:inline-block;background:#4f7cff;color:#fff;text-decoration:none;padding:12px 16px;border-radius:12px;font-weight:600}
      section{padding:48px 24px;border-top:1px solid rgba(255,255,255,.08)}
      .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
      .card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);border-radius:16px;padding:18px}
      .muted{opacity:.8}
      @media(max-width:900px){.grid{grid-template-columns:1fr}}
    </style>
  </head>
  <body>
    <header>
      <div class="wrap">
        <h1>${safeTitle || "Generated Website"}</h1>
        <p class="muted">This page was generated and auto-published.</p>
        <a class="btn" href="#contact">Get Started</a>
      </div>
    </header>

    <section>
      <div class="wrap">
        <h2>Services</h2>
        <div class="grid">
          <div class="card"><h3>AI Website Creation</h3><p class="muted">Generate landing pages in minutes.</p></div>
          <div class="card"><h3>Custom Domains</h3><p class="muted">Publish to your own domain.</p></div>
          <div class="card"><h3>Fast Hosting</h3><p class="muted">Optimized delivery on Vercel.</p></div>
        </div>
      </div>
    </section>

    <section id="contact">
      <div class="wrap">
        <h2>Prompt Used</h2>
        <pre style="white-space:pre-wrap;background:rgba(255,255,255,.06);padding:14px;border-radius:12px;border:1px solid rgba(255,255,255,.10)">${prompt
          .replace(/</g, "")
          .replace(/>/g, "")}</pre>
      </div>
    </section>
  </body>
</html>`;

      // --- 2️⃣ Save HTML to project ---
      const saveRes = await fetch(`/api/projects/${projectId}/html`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ html }),
      });

      const saveText = await saveRes.text();
      if (!saveRes.ok) {
        setStatus(String(saveRes.status));
        setBody(saveText);
        setLoading(false);
        return;
      }

      // --- 3️⃣ AUTO-PUBLISH ---
      const publishRes = await fetch(
        `/api/projects/${projectId}/publish`,
        { method: "POST" }
      );

      const publishText = await publishRes.text();
      setStatus(String(publishRes.status));
      setBody(publishText);

      if (publishRes.ok) {
        // --- 4️⃣ Open public page ---
        window.open(`/p/${projectId}`, "_blank");
      }
    } catch (e: any) {
      setStatus("ERROR");
      setBody(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        maxWidth: 900,
      }}
    >
      <h2 style={{ margin: 0, marginBottom: 10 }}>
        Generate & Publish
      </h2>

      <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
        Prompt
      </label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
        style={{
          width: "100%",
          maxWidth: 900,
          padding: 12,
          borderRadius: 10,
          border: "1px solid #ddd",
          fontFamily: "inherit",
        }}
      />

      <div style={{ marginTop: 12 }}>
        <button
          onClick={generateAndPublish}
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: loading ? "#f3f3f3" : "white",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Generating & Publishing..." : "Generate & Publish"}
        </button>
      </div>

      {status ? (
        <div style={{ marginTop: 12 }}>
          <b>Status:</b> {status}
          {body ? (
            <pre
              style={{
                marginTop: 8,
                padding: 12,
                borderRadius: 10,
                background: "#f6f6f6",
                overflowX: "auto",
                maxWidth: 900,
              }}
            >
              {body}
            </pre>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
