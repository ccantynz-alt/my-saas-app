"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Project = {
  id: string;
  name?: string;
  published?: string | boolean;
  domain?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recoverId, setRecoverId] = useState("");

  async function loadProjects() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();

      if (!data?.ok || !Array.isArray(data.projects)) {
        throw new Error("Invalid projects response");
      }

      setProjects(data.projects);
    } catch (err: any) {
      console.error("Failed to load projects:", err);
      setError("Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  async function recoverProject() {
    if (!recoverId.trim()) return;

    try {
      const res = await fetch("/api/projects/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ projectId: recoverId.trim() }),
      });

      const data = await res.json();

      if (!data?.ok) {
        throw new Error(data?.error || "Register failed");
      }

      setRecoverId("");
      await loadProjects();
    } catch (err: any) {
      alert(err.message || "Register failed");
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Projects</h1>

      <div style={{ marginTop: 16 }}>
        <button onClick={loadProjects}>Refresh</button>
      </div>

      <hr style={{ margin: "24px 0" }} />

      <h2>Create a new project</h2>
      <p>(Use your existing create flow)</p>

      <hr style={{ margin: "24px 0" }} />

      <h2>Recover an existing project</h2>

      <input
        value={recoverId}
        onChange={(e) => setRecoverId(e.target.value)}
        placeholder="proj_..."
        style={{ width: 420, marginRight: 8 }}
      />

      <button onClick={recoverProject}>Recover project</button>

      <p style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
        Tip: Open any project page once and it will auto-appear in this list.
      </p>

      <hr style={{ margin: "24px 0" }} />

      {loading && <p>Loading projects…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && projects.length === 0 && (
        <p>No projects yet. (Create one, or recover an existing proj_… id above.)</p>
      )}

      {projects.length > 0 && (
        <ul style={{ marginTop: 16 }}>
          {projects.map((p) => (
            <li key={p.id} style={{ marginBottom: 12 }}>
              <strong>{p.name || p.id}</strong>

              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {p.published ? "Published" : "Unpublished"}
                {p.domain ? ` · ${p.domain}` : ""}
              </div>

              <div style={{ marginTop: 4 }}>
                <Link href={`/projects/${p.id}`}>Open project →</Link>
                {p.published && (
                  <>
                    {" · "}
                    <Link href={`/p/${p.id}`} target="_blank">
                      Open public →
                    </Link>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
