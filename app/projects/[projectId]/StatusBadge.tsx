"use client";

import { useEffect, useState } from "react";

type StatusResp = {
  ok: boolean;
  projectId: string;
  name?: string;
  publishedStatus?: string;
  domain?: string;
  domainStatus?: string;
  updatedAt?: string;
  error?: string;
};

export default function StatusBadge({ projectId }: { projectId: string }) {
  const [data, setData] = useState<StatusResp | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/status`, { cache: "no-store" });
      const json = (await res.json()) as StatusResp;
      setData(json);
    } catch (e: any) {
      setData({ ok: false, projectId, error: e?.message || "Failed to load" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 8000); // refresh every 8s
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const published = data?.ok && data.publishedStatus === "published";

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 10px",
          borderRadius: 999,
          border: "1px solid #ddd",
          background: published ? "#e7f7ee" : "#f7f7f7",
          fontWeight: 700,
          fontSize: 13,
        }}
        title="Live status (auto-refreshes)"
      >
        {loading ? "Loading…" : published ? "✅ Published" : "⚪ Unpublished"}
      </span>

      <span style={{ opacity: 0.75, fontSize: 13 }}>
        {data?.ok ? (
          <>
            {data.domain ? (
              <>
                Domain: <b>{data.domain}</b>{" "}
                {data.domainStatus ? <>(<span>{data.domainStatus}</span>)</> : null}
              </>
            ) : (
              <>No custom domain</>
            )}
          </>
        ) : data?.error ? (
          <>Status error: {data.error}</>
        ) : (
          <>Status unavailable</>
        )}
      </span>

      <button
        onClick={load}
        disabled={loading}
        style={{
          padding: "6px 10px",
          borderRadius: 10,
          border: "1px solid #ddd",
          background: loading ? "#f3f3f3" : "white",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        Refresh
      </button>
    </div>
  );
}
