"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/* ===== Types ===== */

type Status = "loading" | "ready" | "error";

type PreviewState =
  | { state: "idle"; message: string }
  | { state: "loading"; message: string }
  | { state: "ready"; html: string }
  | { state: "error"; message: string };

type ToastTone = "neutral" | "success" | "danger";

type Toast = {
  tone: ToastTone;
  title: string;
  message: string;
};

type Modal =
  | { open: false }
  | { open: true; kind: "finish" }
  | { open: true; kind: "importHtml" }
  | { open: true; kind: "importZip" };

type PublishState =
  | { state: "idle" }
  | { state: "publishing" }
  | { state: "published"; url: string }
  | { state: "error"; message: string };

/* ===== Component ===== */

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

  const [toast, setToast] = useState<Toast | null>(null);
  const [modal, setModal] = useState<Modal>({ open: false });

  const [htmlToImport, setHtmlToImport] = useState("");
  const [zipFile, setZipFile] = useState<File | null>(null);

  const [publish, setPublish] = useState<PublishState>({ state: "idle" });

  // Finish-for-me fields
  const [bizName, setBizName] = useState("");
  const [bizNiche, setBizNiche] = useState("");
  const [bizLocation, setBizLocation] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [bizEmail, setBizEmail] = useState("");
  const [bizTagline, setBizTagline] = useState("");

  useEffect(() => {
    if (!projectId) {
      setStatus("error");
      return;
    }
    setStatus("ready");
  }, [projectId]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ===== Helpers ===== */

  async function loadPreview() {
    if (!projectId) return;

    setPreview({ state: "loading", message: "Loading preview…" });

    try {
      const res = await fetch(`/api/projects/${projectId}/preview`);
      const text = await res.text();

      if (!res.ok) {
        setPreview({ state: "error", message: text });
        return;
      }

      try {
        const json = JSON.parse(text);
        if (json?.ok && typeof json?.html === "string") {
          setPreview({ state: "ready", html: json.html });
          return;
        }
      } catch {}

      setPreview({ state: "ready", html: text });
    } catch (err: any) {
      setPreview({ state: "error", message: String(err?.message || err) });
    }
  }

  function normalizeUrl(url: string) {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${window.location.origin}${url}`;
    return `${window.location.origin}/${url}`;
  }

  /* ===== LEVEL 2 FINISH (MAIN CHANGE) ===== */

  async function finishForMe() {
    if (!projectId) return;

    if (!bizName.trim() || !bizNiche.trim()) {
      setToast({
        tone: "danger",
        title: "Finish for me",
        message: "Business name and niche are required.",
      });
      return;
    }

    setBusy(true);
    setToast(null);
    setPublish({ state: "idle" });

    try {
      /* STEP 1: Finish (Level 2) */
      const finishRes = await fetch(`/api/projects/${projectId}/finish`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          businessName: bizName,
          niche: bizNiche,
          location: bizLocation,
          phone: bizPhone,
          email: bizEmail,
          tagline: bizTagline,
        }),
      });

      const finishText = await finishRes.text();

      if (!finishRes.ok) {
        setToast({
          tone: "danger",
          title: "Finish failed",
          message: finishText,
        });
        return;
      }

      setToast({
        tone: "success",
        title: "Finished",
        message: "Website generated. Publishing…",
      });

      setModal({ open: false });

      /* STEP 2: Load preview */
      await loadPreview();

      /* STEP 3: Publish */
      setPublish({ state: "publishing" });

      const pubRes = await fetch(`/api/projects/${projectId}/publish`, {
        method: "POST",
      });

      const pubText = await pubRes.text();

      if (!pubRes.ok) {
        setPublish({ state: "error", message: pubText });
        setToast({
          tone: "danger",
          title: "Publish failed",
          message: pubText,
        });
        return;
      }

      let url = pubText;
      try {
        const json = JSON.parse(pubText);
        url = json?.url || json?.path || json?.publicUrl || pubText;
      } catch {}

      setPublish({ state: "published", url });
      setToast({
        tone: "success",
        title: "Published",
        message: normalizeUrl(url),
      });
    } catch (err: any) {
      setToast({
        tone: "danger",
        title: "Finish error",
        message: String(err?.message || err),
      });
    } finally {
      setBusy(false);
    }
  }

  /* ===== UI ===== */

  if (status === "loading") return <div style={{ padding: 24 }}>Loading…</div>;
  if (status === "error") return <div style={{ padding: 24 }}>Invalid project</div>;

  const publishedUrl =
    publish.state === "published" ? normalizeUrl(publish.url) : "";

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", padding: 24 }}>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background:
              toast.tone === "success"
                ? "#f0fff4"
                : toast.tone === "danger"
                ? "#fff5f5"
                : "#fff",
            border: "1px solid #ddd",
            borderRadius: 14,
            padding: 14,
            width: 360,
            zIndex: 50,
          }}
        >
          <div style={{ fontWeight: 900 }}>{toast.title}</div>
          <div style={{ marginTop: 6, fontSize: 13 }}>{toast.message}</div>
        </div>
      )}

      <h1>Project Builder</h1>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 16 }}>
        {/* LEFT */}
        <div
          style={{
            background: "white",
            border: "1px solid #eee",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <button
            disabled={busy}
            onClick={() => setModal({ open: true, kind: "finish" })}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 14,
              border: "none",
              background: "#0b5fff",
              color: "white",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Finish for me (AI)
          </button>

          {publish.state === "published" && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 14,
                background: "#f0fff4",
                border: "1px solid #b7ebc6",
              }}
            >
              <div style={{ fontWeight: 900 }}>Live</div>
              <a href={publishedUrl} target="_blank" rel="noreferrer">
                {publishedUrl}
              </a>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div
          style={{
            background: "white",
            border: "1px solid #eee",
            borderRadius: 16,
            padding: 16,
          }}
        >
          {preview.state === "ready" ? (
            <iframe
              style={{ width: "100%", height: 560, border: "1px solid #eee" }}
              srcDoc={preview.html}
            />
          ) : (
            <div style={{ height: 560, color: "#666" }}>
              {preview.message}
            </div>
          )}
        </div>
      </div>

      {/* Finish modal */}
      {modal.open && modal.kind === "finish" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60,
          }}
        >
          <div
            style={{
              width: 720,
              background: "white",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <h2>Finish for me (AI)</h2>

            <input
              placeholder="Business name"
              value={bizName}
              onChange={(e) => setBizName(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            />
            <input
              placeholder="Niche"
              value={bizNiche}
              onChange={(e) => setBizNiche(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            />
            <input
              placeholder="Location"
              value={bizLocation}
              onChange={(e) => setBizLocation(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            />

            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button
                onClick={finishForMe}
                disabled={busy}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "none",
                  background: "#111",
                  color: "white",
                  fontWeight: 900,
                }}
              >
                {busy ? "Working…" : "Finish & Publish"}
              </button>

              <button
                onClick={() => setModal({ open: false })}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #ddd",
                  background: "white",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
