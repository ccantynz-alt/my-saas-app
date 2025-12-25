"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  name?: string;
  createdAt?: number;
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function loadProjects() {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const text = await res.text();

      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Projects API did not return JSON.");
      }

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message ?? `Failed to load projects (HTTP ${res.status})`);
      }

      setProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  async function createRunAndGo() {
    setCreating(true);
    setErr(null);

    try {
      const res = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: "demo-project" }),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Create run returned non-JSON (HTTP ${res.status}).`);
      }

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message ?? `Failed to create run (HTTP ${res.status})`);
      }

      const runId = data.runId ?? data.run?.id;
      if (!runId || typeof runId !== "string") {
        throw new Error("Create run response missing runId.");
      }

      // ✅ This is the key fix: use the REAL runId, not "<RUN_ID>"
      router.push(`/runs/${runId}`);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to create run");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, Arial, sans-serif" }}>
      <h1 style={{ marginTop: 0 }}>Projects</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={loadProjects} disabled={loading}>
          Refresh
        </button>

        <button onClick={createRunAndGo} disabled={creating}>
          {creating ? "Creating..." : "Create Run (go to run page)"}
        </button>
      </div>

      {err ? (
        <div style={{ color: "red", marginBottom: 12 }}>
          <b>Error:</b> {err}
        </div>
      ) : null}

      {loading ? (
        <div>Loading…</div>
      ) : projects.length === 0 ? (
        <div>(No projects yet)</div>
      ) : (
        <ul>
          {projects.map((p) => (
            <li key={p.id}>
              <code>{p.id}</code> {p.name ? `— ${p.name}` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
