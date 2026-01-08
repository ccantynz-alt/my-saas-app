// app/projects/page.tsx

"use client";

import React, { useMemo, useState } from "react";
import UpgradeToProDialog from "@/app/components/UpgradeToProDialog";
import { createProjectClient } from "@/app/lib/projects-client";

export default function ProjectsPage() {
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const [banner, setBanner] = useState<string>("");
  const [toast, setToast] = useState<string>("");

  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  // We don’t have a “list projects” endpoint wired here yet,
  // so we show a polished empty state by default.
  const [hasAnyProjects] = useState(false);

  const canCreate = useMemo(
    () => name.trim().length > 0 && !creating,
    [name, creating]
  );

  function showToast(message: string) {
    setToast(message);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(""), 3500);
  }

  async function onCreate() {
    setBanner("");
    setToast("");
    setCreating(true);

    try {
      const result = await createProjectClient(name.trim());

      if (result.ok) {
        showToast("✅ Project created successfully.");
        setName("");
        // Later we’ll refresh a real project list.
        return;
      }

      if (result.status === 401) {
        setBanner("You must be signed in to create a project.");
        return;
      }

      if (result.status === 403) {
        const msg =
          result.error ||
          "Free plan limit reached: 1 project. Upgrade to Pro to create more.";
        setBanner(msg);
        setUpgradeMessage(msg);
        setUpgradeOpen(true);
        return;
      }

      setBanner(`Something went wrong (${result.status}). ${result.error}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Projects
          </h1>
          <p className="mt-2 text-gray-600">
            Create and manage your AI-generated websites. Give each project a
            name—you can generate and publish versions inside it.
          </p>
        </div>

        <div className="mt-4 flex gap-3 sm:mt-0">
          <a
            href="/billing"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            View plans
          </a>
          <button
            onClick={() => {
              const el = document.getElementById("create-project");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            + New project
          </button>
        </div>
      </div>

      {/* Banner (errors + upgrade message) */}
      {banner ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="text-sm font-semibold text-red-900">
            Action required
          </div>
          <div className="mt-1 text-sm text-red-800">{banner}</div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href="/billing"
              className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Upgrade to Pro
            </a>
            <button
              onClick={() => setBanner("")}
              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-900 hover:bg-red-50"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      {/* Toast */}
      {toast ? (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-900 shadow-sm">
          {toast}
        </div>
      ) : null}

      {/* Create Project */}
      <div
        id="create-project"
        className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create a new project
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Tip: keep names simple (e.g. “Plumber – Auckland”, “Photography
              Portfolio”, “SaaS Landing Page”).
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full">
            <label className="sr-only" htmlFor="projectName">
              Project name
            </label>
            <input
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Business Website"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            onClick={onCreate}
            disabled={!canCreate}
            className="rounded-xl bg-black px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {creating ? "Creating…" : "Create project"}
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900">1) Create</div>
            <div className="mt-1 text-sm text-gray-600">
              Start a project for a site you want to build.
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900">
              2) Generate
            </div>
            <div className="mt-1 text-sm text-gray-600">
              Use AI to generate a website version from a prompt.
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900">3) Publish</div>
            <div className="mt-1 text-sm text-gray-600">
              Publish the version, then connect your domain.
            </div>
          </div>
        </div>
      </div>

      {/* Projects List / Empty State */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Your projects</h2>
          <p className="text-sm text-gray-600">
            {hasAnyProjects ? "Showing your recent projects." : "No projects yet."}
          </p>
        </div>

        {!hasAnyProjects ? (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-xl">
              ✨
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              Your first project starts here
            </h3>
            <p className="mt-2 text-gray-600">
              Create a project, then generate your first site with AI. If you’re
              on the Free plan, you can create 1 project.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => {
                  const el = document.getElementById("projectName");
                  el?.focus();
                }}
                className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Create your first project
              </button>

              <a
                href="/billing"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                See Pro benefits
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left">
              <div className="text-sm font-semibold text-gray-900">
                What customers will like
              </div>
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
                <li>Clear “Create → Generate → Publish” flow</li>
                <li>Fast upgrade prompt when limits are reached</li>
                <li>Simple pricing path via the Billing page</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">
              Next step: we’ll wire up the real projects list here (KV → API →
              UI). For now, the upgrade UX is fully working.
            </p>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeToProDialog
        open={upgradeOpen}
        message={
          upgradeMessage ||
          "Free plan limit reached. Upgrade to Pro to create more projects."
        }
        onClose={() => setUpgradeOpen(false)}
      />
    </div>
  );
}
