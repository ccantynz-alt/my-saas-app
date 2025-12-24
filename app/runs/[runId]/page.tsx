"use client";

import { useEffect, useState } from "react";

type Run = {
  id: string;
  projectId: string;
  title: string;
  status: string;
  createdAt: string;
};

type Log = {
  ts: string;
  level: string;
  message: string;
};

export default function RunDetailPage({ params }: { params: { runId: string } }) {
  const runId = params.runId;

  const [run, setRun] = useState<Run | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      // Fetch run (relative URL = no base URL problems)
      const runRes = await fetch(`/api/runs/${runId}`, { cache: "no-store" });
      const runJson = await runRes.json();

      if (!runRes.ok) {
        setRun(null);
        setLogs([]);
        setErr(runJson?.error ?? "Failed to load run");
        setLoading(false);
        return;
      }

      setRun(runJson.run ?? null);

      // Fetch logs
      const logsRes = await fetch(`/api/runs/${runId}/logs?limit=200`, { cache: "no-store" });
      const logsJson = await logsRes.json();

      if (!logsRes.ok) {
        setLogs([]);
        setErr(logsJson?.error ?? "Failed to load logs");
        setLoading(false);
        return;
      }

      setLogs(Array.isArray(logsJson.logs) ? logsJson.logs : []);
      setLoading(false);
    } catch (e: any) {
      setErr(e?.message ?? "Unexpected error");
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Run</h1>
          <div className="mt-1 text-sm text-neutral-600">
            ID: <span className="font-mono">{runId}</span>
          </div>
        </div>

        <a className="rounded-xl border px-3 py-2 text-sm" href="/runs">
          ← Back to runs
        </a>
      </div>

      {loading ? (
        <div className="mt-6 rounded-2xl border p-4 text-sm text-neutral-600">Loading…</div>
      ) : err ? (
        <div className="mt-6 rounded-2xl border p-4 text-sm text-red-600">
          {err}
          <div className="mt-3">
            <button className="rounded-xl border px-3 py-2 text-sm" onClick={load}>
              Retry
            </button>
          </div>
        </div>
      ) : run ? (
        <>
          <div className="mt-6 rounded-2xl border p-4">
            <div className="font-semibold">{run.title}</div>
            <div className="mt-2 text-sm text-neutral-700">
              <div>
                <span className="font-medium">Status:</span> {run.status}
              </div>
              <div>
                <span className="font-medium">Project:</span> {run.projectId}
              </div>
              <div>
                <span className="font-medium">Created:</span> {run.createdAt}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Logs</div>
              <button className="rounded-xl border px-3 py-2 text-sm" onClick={load}>
                Refresh
              </button>
            </div>

            <div className="mt-3 grid gap-2">
              {logs.length === 0 ? (
                <div className="text-sm text-neutral-600">No logs yet.</div>
              ) : (
                logs.map((l, idx) => (
                  <div key={idx} className="rounded-xl border px-3 py-2">
                    <div className="text-xs text-neutral-500">
                      {l.ts} · {l.level}
                    </div>
                    <div className="text-sm">{l.message}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border p-4 text-sm text-neutral-600">
          Run not found.
        </div>
      )}
    </div>
  );
}
