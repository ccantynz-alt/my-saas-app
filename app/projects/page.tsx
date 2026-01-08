// app/projects/page.tsx

"use client";

import React, { useEffect, useMemo, useState } from "react";
import UpgradeToProDialog from "@/app/components/UpgradeToProDialog";
import { createProjectClient } from "@/app/lib/projects-client";
import { fetchProjects, Project } from "@/app/lib/projects-list-client";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const [banner, setBanner] = useState("");
  const [toast, setToast] = useState("");

  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  const canCreate = useMemo(
    () => name.trim().length > 0 && !creating,
    [name, creating]
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      const list = await fetchProjects();
      setProjects(list);
      setLoading(false);
    })();
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3500);
  }

  async function onCreate() {
    setBanner("");
    setCreating(true);

    try {
      const result = await createProjectClient(name.trim());

      if (result.ok) {
        showToast("✅ Project created");
        setName("");
        setProjects((p) => [result.project, ...p]);
        return;
      }

      if (result.status === 401) {
        setBanner("You must be signed in to create a project.");
        return;
      }

      if (result.status === 403) {
        const msg =
          result.error ||
          "Free plan limit reached. Upgrade to Pro to continue.";
        setBanner(msg);
        setUpgradeMessage(msg);
        setUpgradeOpen(true);
        return;
      }

      setBanner(`Error (${result.status}): ${result.error}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="mt-2 text-gray-600">
            Create and manage your AI-generated websites.
          </p>
        </div>
      </div>

      {/* Banner */}
      {banner ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="text-sm font-semibold text-red-900">
            Action required
          </div>
          <div className="mt-1 text-sm text-red-800">{banner}</div>

          <div className="mt-4">
            <a
              href="/billing"
              className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Upgrade to Pro
            </a>
          </div>
        </div>
      ) : null}

      {/* Toast */}
      {toast ? (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
          {toast}
        </div>
      ) : null}

      {/* Create */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Create a new project
        </h2>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm"
          />

          <button
            onClick={onCreate}
            disabled={!canCreate}
            className="rounded-xl bg-black px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {creating ? "Creating…" : "Create project"}
          </button>
        </div>
      </div>

      {/* Projects list */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">Your projects</h2>

        {loading ? (
          <p className="mt-4 text-sm text-gray-500">Loading projects…</p>
        ) : projects.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="text-xl">✨</div>
            <h3 className="mt-3 text-xl font-semibold text-gray-900">
              No projects yet
            </h3>
            <p className="mt-2 text-gray-600">
              Create your first project to generate a website with AI.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="text-sm font-semibold text-gray-900">
                  {p.name}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Created{" "}
                  {new Date(p.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <div className="mt-4">
                  <a
                    href={`/projects/${p.id}`}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                  >
                    Open project →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade modal */}
      <UpgradeToProDialog
        open={upgradeOpen}
        message={upgradeMessage}
        onClose={() => setUpgradeOpen(false)}
      />
    </div>
  );
}
