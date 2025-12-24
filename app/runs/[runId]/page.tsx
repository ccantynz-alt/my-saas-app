"use client";

import { useEffect, useState } from "react";

type LogLine = { ts: number; level: string; message: string };

export default function RunPage({ params }: { params: { runId: string } }) {
  const runId = params.runId;
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLogs() {
    const res = await fetch(`/api/runs/${runId}/logs`);
    if (!res.ok) {
      setLogs([]);
      return;
    }
    const data = await res.json();
    setLogs(Array.isArray(data?.logs) ? data.logs : []);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadLogs();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  return (
    <div style={{ padding: 16 }}>
      <h1>Run: {runId}</h1>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <pre style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>
          {logs.map((l) => `${new Date(l.ts).toISOString()} [${l.level}] ${l.message}`).join("\n")}
        </pre>
      )}
    </div>
  );
}
