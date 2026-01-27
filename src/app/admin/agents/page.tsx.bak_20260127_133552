"use client";

import React, { useEffect, useMemo, useState } from "react";

type BundleStep = {
  agentId: string;
  runId?: string;
  status?: string;
  patchSaved?: boolean;
  patchMode?: string;
  patchChars?: number;
  startedAt?: string;
  finishedAt?: string;
  error?: string;
};

type BundleRun = {
  ok: boolean;
  projectId: string;
  bundleRunId: string;
  startedAt: string;
  finishedAt: string | null;
  goal: string;
  stepMaxOutputTokens?: number;
  stepTimeoutMs?: number;
  continueOnError?: boolean;
  steps: BundleStep[];
  scriptsCount: number;
  state: "running" | "finished" | string;
};

export default function AdminAgentsPage() {
  const [projectId, setProjectId] = useState("demo");
  const [goal, setGoal] = useState(
    "Make the homepage dramatically more premium: full-viewport hero, cinematic background (CSS only), refined typography, improved CTA polish. Frontend-only and build-safe."
  );

  const [isRunning, setIsRunning] = useState(false);
  const [bundleRun, setBundleRun] = useState<BundleRun | null>(null);
  const [error, setError] = useState<string>("");

  const canDownload = useMemo(() => {
    return Boolean(bundleRun?.bundleRunId && bundleRun?.scriptsCount >= 1 && bundleRun?.state === "finished");
  }, [bundleRun]);

  async function refreshStatus() {
    setError("");
    const r = await fetch(`/api/agents/bundle/status?projectId=${encodeURIComponent(projectId)}`, { cache: "no-store" });
    const j = await r.json();
    if (!j?.ok) throw new Error(String(j?.error || "STATUS_FAILED"));
    setBundleRun(j.run);
    return j.run as BundleRun;
  }

  async function runBundle() {
    setIsRunning(true);
    setError("");
    setBundleRun(null);
    try {
      const r = await fetch("/api/agents/bundle/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          projectId,
          goal,
          // tuned defaults; user can later add UI controls
          stepMaxOutputTokens: 2200,
          stepTimeoutMs: 60000,
          continueOnError: true,
        }),
      });
      const j = await r.json();
      if (!j?.ok) throw new Error(String(j?.error || "BUNDLE_RUN_FAILED"));
      setBundleRun({
        ok: true,
        projectId: j.projectId,
        bundleRunId: j.bundleRunId,
        startedAt: j.startedAt,
        finishedAt: j.finishedAt,
        goal,
        steps: j.steps || [],
        scriptsCount: j.scriptsCount || 0,
        state: j.state || "finished",
      });
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setIsRunning(false);
    }
  }

  async function downloadBundlePatch() {
    if (!bundleRun?.bundleRunId) return;
    setError("");
    const r = await fetch(
      `/api/agents/bundle/patch?projectId=${encodeURIComponent(projectId)}&bundleRunId=${encodeURIComponent(bundleRun.bundleRunId)}`,
      { cache: "no-store" }
    );
    const j = await r.json();
    if (!j?.ok) throw new Error(String(j?.error || "PATCH_NOT_FOUND"));
    const script = String(j?.patch?.script || "");
    if (!script) throw new Error("Patch returned but patch.script empty.");

    const blob = new Blob([script], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agent_bundle_patch_${bundleRun.bundleRunId}.ps1`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    // auto-refresh status every 3s while running
    let t: any = null;
    if (bundleRun?.state === "running") {
      t = setInterval(() => {
        refreshStatus().catch(() => {});
      }, 3000);
    }
    return () => t && clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundleRun?.state, projectId]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agents Console</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Run the 9-agent bundle, track progress, and download the combined PowerShell patch.
          </p>
        </div>
        <div className="rounded-lg border bg-white px-4 py-2 text-xs text-neutral-600 shadow-sm">
          <div className="font-semibold">Install C</div>
          <div>Bundle Runner + Patch Download</div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 rounded-xl border bg-white p-5 shadow-sm">
        <label className="text-xs font-semibold text-neutral-700">Project ID</label>
        <input
          className="w-full rounded-lg border px-3 py-2 text-sm"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="demo"
        />

        <label className="mt-2 text-xs font-semibold text-neutral-700">Bundle Goal</label>
        <textarea
          className="min-h-[110px] w-full rounded-lg border px-3 py-2 text-sm"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <div className="mt-2 flex flex-wrap gap-3">
          <button
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            onClick={runBundle}
            disabled={isRunning}
          >
            {isRunning ? "Running bundle…" : "Run 9-agent bundle"}
          </button>

          <button
            className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-60"
            onClick={() => refreshStatus().catch((e) => setError(String(e?.message || e)))}
          >
            Refresh status
          </button>

          <button
            className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-60"
            onClick={() => downloadBundlePatch().catch((e) => setError(String(e?.message || e)))}
            disabled={!canDownload}
            title={!canDownload ? "Run must be finished and scriptsCount >= 1" : "Download combined PowerShell patch"}
          >
            Download bundle patch
          </button>
        </div>

        {error ? (
          <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}
      </div>

      <div className="mt-8 rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Bundle Status</div>
            <div className="text-xs text-neutral-500">Shows latest bundle run for the selected project.</div>
          </div>
          {bundleRun ? (
            <div className="text-xs text-neutral-600">
              <span className="font-semibold">state:</span> {bundleRun.state} ·{" "}
              <span className="font-semibold">scriptsCount:</span> {bundleRun.scriptsCount}
            </div>
          ) : (
            <div className="text-xs text-neutral-500">No status loaded.</div>
          )}
        </div>

        {bundleRun ? (
          <div className="mt-4">
            <div className="rounded-lg border bg-neutral-50 px-4 py-3 text-xs text-neutral-700">
              <div><span className="font-semibold">bundleRunId:</span> {bundleRun.bundleRunId}</div>
              <div><span className="font-semibold">startedAt:</span> {bundleRun.startedAt}</div>
              <div><span className="font-semibold">finishedAt:</span> {bundleRun.finishedAt || "—"}</div>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border">
              <div className="grid grid-cols-6 gap-0 bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-700">
                <div className="col-span-2">Agent</div>
                <div>Status</div>
                <div>Patch</div>
                <div>Chars</div>
                <div>RunId</div>
              </div>

              {bundleRun.steps?.map((s, idx) => (
                <div key={idx} className="grid grid-cols-6 gap-0 border-t px-3 py-2 text-xs">
                  <div className="col-span-2 font-semibold">{s.agentId}</div>
                  <div className="text-neutral-700">{s.status || "—"}</div>
                  <div className={s.patchSaved ? "text-green-700" : "text-red-700"}>
                    {s.patchSaved ? (s.patchMode || "saved") : "no"}
                  </div>
                  <div className="text-neutral-700">{typeof s.patchChars === "number" ? s.patchChars : "—"}</div>
                  <div className="truncate text-neutral-600">{s.runId || "—"}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-xs text-neutral-500">
              Tip: If patches are mostly “fallback_*”, increase tokens or simplify the goal.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
