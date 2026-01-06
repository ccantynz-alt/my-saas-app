"use client";

import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

type ProjectsApiResponse =
  | { ok: true; projects: any[] }
  | { ok: false; error?: string };

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [projects, setProjects] = useState<any[]>([]);

  async function loadProjects() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "GET",
        headers: { "content-type": "application/json" },
        cache: "no-store",
      });

      const data = (await res.json()) as ProjectsApiResponse;

      if (!res.ok || !("ok" in data) || data.ok !== true) {
        const msg =
          (data as any)?.error ||
          `Failed to load projects (status ${res.status})`;
        setError(msg);
        setProjects([]);
        return;
      }

      setProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-gray-600">
            Your projects list with domain + published status.
          </p>
        </div>

        <button
          onClick={loadProjects}
          className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="rounded-xl border bg-white p-4 text-sm text-gray-700">
            Loading projects…
          </div>
        ) : error ? (
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm font-semibold text-red-600">
              Could not load projects
            </div>
            <div className="mt-1 text-sm text-gray-700">{error}</div>
            <button
              onClick={loadProjects}
              className="mt-3 inline-flex items-center justify-center rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Try again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border bg-white p-4 text-sm text-gray-700">
            No projects yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((p: any) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
