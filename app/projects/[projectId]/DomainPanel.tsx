// app/projects/[projectId]/DomainPanel.tsx
"use client";

import React, { useEffect, useState } from "react";

export default function DomainPanel({ projectId }: { projectId: string }) {
  const [domain, setDomain] = useState("");
  const [savedDomain, setSavedDomain] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch(`/api/projects/${projectId}/domain`, { cache: "no-store" });
    const data = await res.json();
    if (data?.ok) {
      setSavedDomain(data.domain || null);
    }
  }

  useEffect(() => {
    refresh().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveDomain() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/domain`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to attach domain");

      setSavedDomain(data.domain);
      setMsg("✅ Domain attached. Now add the DNS records below.");
    } catch (e: any) {
      setMsg(`❌ ${e?.message || "Failed"}`);
    } finally {
      setBusy(false);
    }
  }

  async function removeDomain() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/domain`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to remove domain");
      setSavedDomain(null);
      setDomain("");
      setMsg("✅ Domain removed.");
    } catch (e: any) {
      setMsg(`❌ ${e?.message || "Failed"}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 16, marginTop: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Domain</div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            minWidth: 260,
          }}
        />

        <button
          onClick={saveDomain}
          disabled={busy}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: busy ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {busy ? "Saving…" : "Attach domain"}
        </button>

        <button
          onClick={removeDomain}
          disabled={busy || !savedDomain}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: busy || !savedDomain ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          Remove
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 14, opacity: 0.9 }}>
        <b>Attached domain:</b> {savedDomain ? savedDomain : "none"}
      </div>

      {savedDomain ? (
        <div style={{ marginTop: 12, fontSize: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>DNS instructions (manual for now)</div>

          <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
            <div style={{ marginBottom: 8 }}>
              If you want <b>{savedDomain}</b> to load the published site:
            </div>

            <ul style={{ marginTop: 0 }}>
              <li>
                Create an <b>A</b> record:
                <div>
                  <code>@</code> → <code>76.76.21.21</code>
                </div>
              </li>
              <li style={{ marginTop: 8 }}>
                Create a <b>CNAME</b> record:
                <div>
                  <code>www</code> → <code>cname.vercel-dns.com</code>
                </div>
              </li>
            </ul>

            <div style={{ opacity: 0.75, fontSize: 12 }}>
              Note: DNS can take minutes to 24 hours to update depending on the registrar.
            </div>
          </div>
        </div>
      ) : null}

      {msg ? <div style={{ marginTop: 10, fontSize: 14 }}>{msg}</div> : null}
    </div>
  );
}
