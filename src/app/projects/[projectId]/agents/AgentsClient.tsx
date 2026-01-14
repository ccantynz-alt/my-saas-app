"use client";

import * as React from "react";

type Props = {
  projectId: string;
};

function safePreview(text: string, max = 700) {
  const t = (text || "").trim();
  if (!t) return "(empty response body)";
  return t.length > max ? t.slice(0, max) + "…" : t;
}

export default function AgentsClient({ projectId }: Props) {
  const [businessName, setBusinessName] = React.useState("");
  const [tone, setTone] = React.useState("premium, automated, website-only");
  const [status, setStatus] = React.useState<string>("");
  const [busy, setBusy] = React.useState(false);

  const apiUrl = `/api/projects/${projectId}/agents/finish-for-me`;
  const pubHome = `/p/${projectId}`;
  const pubPricing = `/p/${projectId}/pricing`;

  async function runFinishForMe() {
    setBusy(true);
    setStatus(`Running agent…\nPOST ${apiUrl}`);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, tone }),
      });

      const text = await res.text();

      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }

      if (!res.ok) {
        setStatus(
          `❌ HTTP ${res.status} ${res.statusText}\n` +
            `POST ${apiUrl}\n` +
            `Body:\n${safePreview(text)}`
        );
        return;
      }

      if (!json || json.ok !== true) {
        setStatus(
          `❌ Unexpected response (not ok JSON)\n` +
            `HTTP ${res.status}\n` +
            `POST ${apiUrl}\n` +
            `Body:\n${safePreview(text)}`
        );
        return;
      }

      setStatus(
        `✅ Agent completed\n` +
          `Updated at: ${json.updatedAt}\n` +
          `Project: ${json.projectId}\n` +
          `Pages: ${(json.pages || []).join(", ")}\n`
      );

      window.open(pubHome, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      setStatus(`❌ Error: ${e?.message || "Unknown error"}`);
    } finally {
      setBusy(false);
    }
  }

  async function testGetPing() {
    setBusy(true);
    setStatus(`Testing route…\nGET ${apiUrl}`);

    try {
      const res = await fetch(apiUrl, { method: "GET" });
      const text = await res.text();

      setStatus(
        `GET ${apiUrl}\n` +
          `HTTP ${res.status} ${res.statusText}\n` +
          `Body:\n${safePreview(text)}`
      );
    } catch (e: any) {
      setStatus(`❌ Error: ${e?.message || "Unknown error"}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Agents</h1>

      <p style={{ marginTop: 10, opacity: 0.85 }}>
        This page triggers the <code>Finish-for-me</code> agent which writes
        content to KV. Published pages update immediately.
      </p>

      <div
        style={{
          marginTop: 18,
          padding: 16,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.75 }}>
          API: <code>{apiUrl}</code>
        </div>

        <label style={{ display: "block", marginTop: 12, fontWeight: 650 }}>
          Business name (optional)
        </label>
        <input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="e.g. Rovez Websites"
          style={{
            marginTop: 8,
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
          }}
        />

        <label style={{ display: "block", marginTop: 14, fontWeight: 650 }}>
          Tone (optional)
        </label>
        <input
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="premium, automated, website-only"
          style={{
            marginTop: 8,
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
          }}
        />

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={runFinishForMe}
            disabled={busy}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: busy ? "#f3f4f6" : "white",
              cursor: busy ? "not-allowed" : "pointer",
              fontWeight: 650,
            }}
          >
            {busy ? "Running…" : "Run Finish-for-me Agent"}
          </button>

          <button
            onClick={testGetPing}
            disabled={busy}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: busy ? "#f3f4f6" : "white",
              cursor: busy ? "not-allowed" : "pointer",
              fontWeight: 650,
            }}
          >
            {busy ? "Testing…" : "Test Agent Route (GET)"}
          </button>
        </div>

        <pre
          style={{
            marginTop: 12,
            fontSize: 13,
            background: "#fafafa",
            border: "1px solid #eee",
            padding: 12,
            borderRadius: 10,
            whiteSpace: "pre-wrap",
          }}
        >
          {status}
        </pre>

        <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href={pubHome} style={{ textDecoration: "none" }}>
            <span style={{ padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 10, display: "inline-block" }}>
              Open Published Home
            </span>
          </a>
          <a href={pubPricing} style={{ textDecoration: "none" }}>
            <span style={{ padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 10, display: "inline-block" }}>
              Open Published Pricing
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}
