// app/projects/[projectId]/runs/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Run = {
  id: string;
  status: string;
  createdAt: string;
  prompt: string;
};

export default function ProjectRunsPage({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const projectId = params.projectId;

  const [runs, setRuns] = useState<Run[]>([]);
  const [prompt, setPrompt] = useState(
    "Build a modern landing page with hero, features, pricing, FAQ, and a contact form. Clean modern styling."
  );
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadRuns() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/runs`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to load runs");
      setRuns(data.runs || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load runs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRuns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createRun() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/runs`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to create run");

      const runId = data.run?.id;
      if (!runId) throw new Error("Run created but no id returned");

      router.push(`/projects/${projectId}/runs/${runId}`);
    } catch (e: any) {
      setError(e?.message || "Failed to create run");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Project Runs</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>
        Create a run to generate a website. (Stub generation for now — safe baseline.)
      </p>

      <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
        <label style={{ fontWeight: 700 }}>Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
        <button
          onClick={createRun}
          disabled={creating}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: creating ? "not-allowed" : "pointer",
            fontWeight: 700,
          }}
        >
          {creating ? "Generating…" : "Generate Site (Create Run)"}
        </button>
      </div>

      {error ? (
        <div style={{ padding: 12, border: "1px solid #f99", background: "#fff5f5", marginBottom: 16 }}>
          <b>Error:</b> {error}
        </div>
      ) : null}

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <h2 style={{ margin: 0 }}>Recent runs</h2>
        <button onClick={loadRuns} style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #ddd" }}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : runs.length === 0 ? (
        <p>No runs yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {runs.map((r) => (
            <div key={r.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{r.id}</div>
                  <div style={{ opacity: 0.8, fontSize: 13 }}>{new Date(r.createdAt).toLocaleString()}</div>
                </div>
                <button
                  onClick={() => router.push(`/projects/${projectId}/runs/${r.id}`)}
                  style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", fontWeight: 700 }}
                >
                  View
                </button>
              </div>
              <div style={{ marginTop: 10, opacity: 0.85 }}>{r.prompt}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
