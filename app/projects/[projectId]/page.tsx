"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Run = {
  id: string;
  status: string;
  prompt: string;
  createdAt: string;
};

export default function ProjectPage({ params }: { params: { projectId: string } }) {
  const projectId = params.projectId;

  const [runs, setRuns] = useState<Run[]>([]);
  const [prompt, setPrompt] = useState(
    "Build a modern landing page with pricing, FAQ, and contact form. Clean minimal styling."
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadRuns() {
    const res = await fetch(`/api/projects/${projectId}/runs`, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (json?.ok && Array.isArray(json.runs)) {
      setRuns(json.runs);
    }
  }

  async function createRun() {
    try {
      setErr(null);
      setLoading(true);

      const res = await fetch(`/api/projects/${projectId}/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok || !json?.run?.id) {
        throw new Error(json?.error || "Failed to create run");
      }

      setPrompt(prompt);
      await loadRuns();
    } catch (e: any) {
      setErr(e?.message || "Failed to create run");
    } finally {
      setLoading(false);
    }
  }

  async function executeRun(runId: string) {
    try {
      setErr(null);

      const res = await fetch(
        `/api/projects/${projectId}/runs/${runId}/execute`,
        { method: "POST" }
      );

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Execution failed");
      }

      await loadRuns();
      alert("Run executed. You can now view the generated page.");
    } catch (e: any) {
      setErr(e?.message || "Execution failed");
    }
  }

  useEffect(() => {
    loadRuns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Project</h1>
      <p style={{ opacity: 0.8 }}>ID: {projectId}</p>

      {err && (
        <div
          style={{
            background: "#ffe5e5",
            border: "1px solid #ffb3b3",
            color: "#7a0000",
            padding: 12,
            borderRadius: 10,
            margin: "12px 0",
          }}
        >
          {err}
        </div>
      )}

      <h2 style={{ marginTop: 28 }}>Create Run</h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "1px solid #ccc",
          marginBottom: 10,
        }}
      />

      <button
        onClick={createRun}
        disabled={loading}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #111",
          background: "#111",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {loading ? "Creating..." : "Create Run"}
      </button>

      <h2 style={{ marginTop: 36 }}>Runs</h2>

      {runs.length === 0 ? (
        <p>No runs yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {runs.map((run) => (
            <div
              key={run.id}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <strong>{run.status.toUpperCase()}</strong>
              <div style={{ opacity: 0.85 }}>Run ID: {run.id}</div>

              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <button
                  onClick={() => executeRun(run.id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #111",
                    background: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Execute
                </button>

                <Link
                  href={`/generated/${run.id}`}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #111",
                    background: "#fff",
                    textDecoration: "none",
                    color: "#000",
                    fontWeight: 600,
                  }}
                >
                  View Generated for this Run
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
