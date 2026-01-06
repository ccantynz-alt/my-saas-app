"use client";

import { useEffect, useState } from "react";

export default function DomainPanel({ projectId }: { projectId: string }) {
  const [domain, setDomain] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch(`/api/projects/${projectId}/domain`);
    const json = await res.json();
    if (json.ok) {
      setDomain(json.domain || "");
      setStatus(json.domainStatus || "none");
    }
  }

  async function save() {
    setMessage("");
    const res = await fetch(`/api/projects/${projectId}/domain`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ domain }),
    });

    const json = await res.json();
    if (json.ok) {
      setStatus(json.domainStatus);
      setMessage("Domain saved. DNS setup required.");
    } else {
      setMessage(json.error || "Failed");
    }
  }

  useEffect(() => {
    load();
  }, [projectId]);

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
      <h2 style={{ margin: 0, marginBottom: 10 }}>Custom Domain</h2>

      <input
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="example.com"
        style={{
          padding: 10,
          borderRadius: 10,
          border: "1px solid #ddd",
          width: 300,
          marginRight: 10,
        }}
      />

      <button
        onClick={save}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #ddd",
          fontWeight: 600,
        }}
      >
        Save Domain
      </button>

      <div style={{ marginTop: 10, opacity: 0.8 }}>
        Status: <b>{status}</b>
      </div>

      {message && (
        <div style={{ marginTop: 8, fontSize: 14 }}>{message}</div>
      )}
    </section>
  );
}
