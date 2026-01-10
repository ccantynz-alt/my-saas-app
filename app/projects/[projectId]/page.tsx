"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Status = "loading" | "ready" | "error";

type PreviewState =
  | { state: "idle"; message: string }
  | { state: "loading"; message: string }
  | { state: "ready"; html: string }
  | { state: "error"; message: string };

export default function ProjectBuilderPage() {
  const router = useRouter();
  const params = useParams();

  const projectId = useMemo(() => {
    const raw = params?.projectId;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw)) return raw[0];
    return null;
  }, [params]);

  const [status, setStatus] = useState<Status>("loading");
  const [busy, setBusy] = useState(false);

  const [preview, setPreview] = useState<PreviewState>({
    state: "idle",
    message: "Preview not loaded yet.",
  });

  useEffect(() => {
    if (!projectId) {
      setStatus("error");
      return;
    }
    setStatus("ready");
  }, [projectId]);

  const headerBadge = (() => {
    if (status === "loading") return { label: "Loading", tone: "neutral" as const };
    if (status === "ready") return { label: "Ready", tone: "success" as const };
    return { label: "Error", tone: "danger" as const };
  })();

  const badgeStyle = (tone: "neutral" | "success" | "danger") => {
    const base: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 12,
      border: "1px solid #ddd",
      background: "#fff",
    };

    if (tone === "success") return { ...base, borderColor: "#b7ebc6", background: "#f0fff4" };
    if (tone === "danger") return { ...base, borderColor: "#ffd1d1", background: "#fff5f5" };
    return base;
  };

  async function loadPreview() {
    if (!projectId) return;

    setPreview({ state: "loading", message: "Loading preview from server…" });

    try {
      // We intentionally use an API route so the browser never touches KV directly.
      // This route should read KV:
      // - generated:project:<projectId>:latest (primary)
      // - generated:latest (fallback)
      const res = await fetch(`/api/projects/${projectId}/preview`, { method: "GET" });
      const text = await res.text();

      if (!res.ok) {
        setPreview({
          state: "error",
          message: `Preview API error (${res.status}): ${text}`,
        });
        return;
      }

      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        // If the API ever returns raw HTML, handle it too.
        setPreview({ state: "ready", html: text });
        return;
      }

      if (data?.ok && typeof data?.html === "string") {
        setPreview({ state: "ready", html: data.html });
        return;
      }

      setPreview({
        state: "error",
        message: `Unexpected preview response: ${text}`,
      });
    } catch (err: any) {
      setPreview({
        state: "error",
        message: err?.message ? String(err.message) : "Unknown error while loading preview.",
      });
    }
  }

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: 16,
              background: "white",
              padding: 20,
              fontFamily: "system-ui",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#999",
                }}
              />
              <div style={{ fontSize: 14, color: "#333" }}>Loading project…</div>
            </div>
            <div
              style={{
                marginTop: 16,
                height: 10,
                borderRadius: 999,
                background: "#f1f1f1",
                overflow: "hidden",
              }}
            >
              <div style={{ width: "60%", height: "100%", background: "#e7e7e7" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "system-ui" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: 16,
              background: "white",
              padding: 20,
            }}
          >
            <h1 style={{ margin: 0, fontSize: 20 }}>Invalid project</h1>
            <p style={{ marginTop: 10, marginBottom: 0, color: "#444" }}>
              We couldn’t read the project id from the URL.
            </p>

            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button
                onClick={() => router.push("/projects")}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Back to projects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>Project Builder</h1>

            <span style={badgeStyle(headerBadge.tone)}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background:
                    headerBadge.tone === "success"
                      ? "#22c55e"
                      : headerBadge.tone === "danger"
                        ? "#ef4444"
                        : "#6b7280",
                }}
              />
              <span style={{ color: "#111" }}>{headerBadge.label}</span>
            </span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 10px",
                borderRadius: 999,
                fontSize: 12,
                border: "1px solid #e5e5e5",
                background: "white",
                color: "#111",
              }}
              title="Project ID"
            >
              {projectId}
            </span>
          </div>

          <button
            onClick={() => router.push("/projects")}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Back
          </button>
        </div>

        {/* Main layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "360px 1fr",
            gap: 16,
          }}
        >
          {/* Left panel */}
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: 16,
              background: "white",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>Actions</div>
            <div style={{ marginTop: 10, fontSize: 13, color: "#555", lineHeight: 1.4 }}>
              Preview wiring: this page calls <b>/api/projects/&lt;projectId&gt;/preview</b>.
              If that route does not exist yet, the preview will show an error — that’s expected and
              we’ll add it next.
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <button
                disabled={busy}
                onClick={() => setBusy(true)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid #ddd",
                  background: busy ? "#f3f4f6" : "#111",
                  color: busy ? "#777" : "white",
                  cursor: busy ? "not-allowed" : "pointer",
                  fontWeight: 700,
                }}
              >
                {busy ? "Working…" : "Generate (UI Only)"}
              </button>

              <button
                disabled={busy}
                onClick={() => loadPreview()}
                style={{
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: busy ? "not-allowed" : "pointer",
                  fontWeight: 700,
                }}
              >
                Load Preview
              </button>

              <button
                disabled={busy}
                onClick={() => setBusy(false)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Reset Busy
              </button>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>Status</div>
              <div
                style={{
                  marginTop: 10,
                  border: "1px solid #eee",
                  borderRadius: 14,
                  padding: 12,
                  background: "#fafafa",
                  fontSize: 13,
                  color: "#333",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span>Builder</span>
                  <span style={{ fontWeight: 700 }}>{status}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    marginTop: 6,
                  }}
                >
                  <span>Preview</span>
                  <span style={{ fontWeight: 700 }}>{preview.state}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: 16,
              background: "white",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: 14,
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#111" }}>Preview</div>
                <div style={{ marginTop: 4, fontSize: 13, color: "#555" }}>
                  Loads from KV via a server API route.
                </div>
              </div>

              <button
                onClick={() =>
                  setPreview({ state: "idle", message: "Preview cleared. Click Load Preview." })
                }
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Clear Preview
              </button>
            </div>

            <div style={{ padding: 14 }}>
              {preview.state === "ready" ? (
                <iframe
                  title="Preview"
                  style={{
                    width: "100%",
                    height: 560,
                    border: "1px solid #eee",
                    borderRadius: 14,
                    background: "white",
                  }}
                  sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                  srcDoc={preview.html}
                />
              ) : (
                <div
                  style={{
                    height: 560,
                    border: "1px dashed #ddd",
                    borderRadius: 14,
                    background: "#fafafa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                    fontSize: 13,
                    textAlign: "center",
                    padding: 20,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {preview.state === "loading"
                    ? preview.message
                    : preview.state === "error"
                      ? preview.message
                      : preview.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div style={{ marginTop: 14, fontSize: 12, color: "#666" }}>
          Next: we will create the API route <b>/api/projects/[projectId]/preview</b> to read KV and
          return the HTML.
        </div>
      </div>
    </div>
  );
}
