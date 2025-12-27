"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Project = {
  id: string;
  name: string;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/projects", { cache: "no-store" });
    const json = await res.json();
    if (json?.ok) setProjects(json.projects || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function createProject() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to create project");
      }

      setName("");
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1>Dashboard</h1>

      <h2>Create a Project</h2>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          style={{ padding: 8, minWidth: 240 }}
        />
        <button onClick={createProject} disabled={loading || !name}>
          {loading ? "Creating…" : "Create Project"}
        </button>
      </div>

      {error ? <div style={{ color: "red", marginTop: 8 }}>{error}</div> : null}

      <h2 style={{ marginTop: 24 }}>Projects</h2>

      {projects.length === 0 ? (
        <div>No projects yet.</div>
      ) : (
        <ul>
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/dashboard/projects/${p.id}`}>
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
