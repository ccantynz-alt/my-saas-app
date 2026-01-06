"use client";

import { useEffect, useState } from "react";

type Version = {
  versionId: string;
  createdAt: string;
  htmlKey: string;
  prompt?: string;
  length?: number;
};

export default function VersionsPanel({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [status, setStatus] = useState<string>("");
  const [body, setBody] = useState<string>("");

  async function refresh() {
    setLoading(true);
    setStatus("");
    setBody("");
    try {
      const res = await fetch(`/api/projects/${projectId}/versions`, { cache: "no-store" });
      const text = await res.text();
      setStatus(String(res.status));
      setBody(text);

      if (res.ok) {
        const json = JSON.parse(text);
        setVersions(Array.isArray(json.versions) ? json.versions : []);
      }
    } catch (e: any) {
      setStatus("ERROR");
      setBody(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function rollback(versionId: string) {
    if (!versionId) return;
    setLoading(true);
    setStatus("");
    setBody("");

    try {
      const res = await fetch(
        `/api/projects/${projectId}/versions/${versionId}/rollback`,
        { method: "POST" }
      );
      const text = await res.text();
      setStatus(String(res.status));
      setBody(text);

      if (res.ok) {
        window.open(`/p/${projectId}`, "_blank");
      }
    } catch (e: any) {
      setStatus("ERROR");
      setBody(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <section
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        maxWidth: 900,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Versions</h2>
        <button
          onClick={refresh}
          disabled={loading}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: loading ? "#f3f3f3" : "white",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Newest versions appear first. Rollback sets that version as the current
        live HTML (and opens the public page).
      </p>

      {versions.length === 0 ? (
        <div style={{ padding: 12, borderRadius: 10, background: "#f6f6f6" }}>
          No versions saved yet. Generate once to create the first version.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {versions.map((v) => (
            <div
              key={v.versionId}
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{v.versionId}</div>
                  <div style={{ opacity: 0.8, fontSize: 13 }}>
                    {new Date(v.createdAt).toLocaleString()}
                    {typeof v.length === "number" ? ` • ${v.length} chars` : ""}
                  </div>
                </div>

                <button
                  onClick={() => rollback(v.versionId)}
                  disabled={loading}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: loading ? "#f3f3f3" : "white",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    height: 36,
                    alignSelf: "center",
                  }}
                >
                  Rollback
                </button>
              </div>

              {v.prompt ? (
                <details style={{ marginTop: 10 }}>
                  <summary style={{ cursor: "pointer" }}>Prompt</summary>
                  <pre
                    style={{
                      marginTop: 8,
                      padding: 10,
                      borderRadius: 10,
                      background: "#f6f6f6",
                      overflowX: "auto",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {v.prompt}
                  </pre>
                </details>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {status ? (
        <div style={{ marginTop: 12 }}>
          <b>Last API status:</b> {status}
          {body ? (
            <pre
              style={{
                marginTop: 8,
                padding: 12,
                borderRadius: 10,
                background: "#f6f6f6",
                overflowX: "auto",
                maxWidth: 900,
              }}
            >
              {body}
            </pre>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
