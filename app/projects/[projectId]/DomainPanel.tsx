"use client";

import { useEffect, useState } from "react";

export default function DomainPanel({ projectId }: { projectId: string }) {
  const [domain, setDomain] = useState("");
  const [savedDomain, setSavedDomain] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch(`/api/projects/${projectId}/domain`);
    const data = await res.json();
    if (data.ok) setSavedDomain(data.domain);
  }

  useEffect(() => {
    load();
  }, []);

  async function attach() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/domain`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setSavedDomain(data.domain);
      setMsg("✅ Domain attached");
    } catch (e: any) {
      setMsg(`❌ ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/domain`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setSavedDomain(null);
      setDomain("");
      setMsg("✅ Domain removed");
    } catch (e: any) {
      setMsg(`❌ ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12, marginTop: 16 }}>
      <h3>Domain</h3>

      <input
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="example.com"
        style={{ padding: 8, marginRight: 8 }}
      />

      <button onClick={attach} disabled={busy}>Attach</button>
      <button onClick={remove} disabled={busy || !savedDomain} style={{ marginLeft: 8 }}>
        Remove
      </button>

      <div style={{ marginTop: 8 }}>
        <b>Attached:</b> {savedDomain || "none"}
      </div>

      {savedDomain && (
        <div style={{ marginTop: 8 }}>
          <b>DNS:</b>
          <div>A → 76.76.21.21</div>
          <div>CNAME www → cname.vercel-dns.com</div>
        </div>
      )}

      {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
    </div>
  );
}
