"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

type Status = "loading" | "empty" | "draft" | "published";

export default function ProjectBuilderPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [status, setStatus] = useState<Status>("loading");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "generate" | "import" | "zip" | null
  >(null);
  const [pendingHtml, setPendingHtml] = useState<string | null>(null);
  const [pendingZip, setPendingZip] = useState<File | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) return;

      const data = await res.json();

      if (!data.hasHtml) setStatus("empty");
      else if (data.isPublished) setStatus("published");
      else setStatus("draft");
    })();
  }, [projectId]);

  async function doGenerate() {
    setBusy(true);
    setMessage(null);

    const res = await fetch(`/api/projects/${projectId}/runs/create`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        prompt:
          "Create a professional business website with hero, services, testimonials, about, and contact sections.",
      }),
    });

    if (res.ok) {
      setStatus("draft");
      setMessage("⏳ Generating site… refresh shortly");
    } else {
      setMessage("❌ Failed to start generation");
    }

    setBusy(false);
  }

  async function doImport(html: string) {
    setBusy(true);
    setMessage(null);

    const res = await fetch(`/api/projects/${projectId}/import/html`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ html }),
    });

    const text = await res.text();

    if (res.ok) {
      setStatus("draft");
      setMessage("✅ HTML imported");
    } else {
      setMessage(text || "❌ Import failed");
    }

    setBusy(false);
  }

  async function doZipUpload(file: File) {
    setBusy(true);
    setMessage(null);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`/api/projects/${projectId}/import/zip`, {
      method: "POST",
      body: form,
    });

    const text = await res.text();

    if (res.ok) {
      setStatus("draft");
      setMessage("✅ ZIP imported (assets + HTML)");
    } else {
      setMessage(text || "❌ ZIP import failed");
    }

    setBusy(false);
  }

  async function publish() {
    setBusy(true);
    setMessage(null);

    const res = await fetch(`/api/projects/${projectId}/publish`, {
      method: "POST",
    });

    const text = await res.text();

    if (res.ok) {
      setStatus("published");
      setMessage("✅ Site published");
    } else {
      setMessage(text || "❌ Publish failed");
    }

    setBusy(false);
  }

  function requestGenerate() {
    if (status === "empty") doGenerate();
    else {
      setPendingAction("generate");
      setConfirmOpen(true);
    }
  }

  function requestImport() {
    const html = prompt("Paste full HTML here");
    if (!html) return;

    if (status === "empty") doImport(html);
    else {
      setPendingHtml(html);
      setPendingAction("import");
      setConfirmOpen(true);
    }
  }

  function requestZip() {
    fileRef.current?.click();
  }

  function onZipChosen(file: File | null) {
    if (!file) return;

    if (status === "empty") {
      doZipUpload(file);
    } else {
      setPendingZip(file);
      setPendingAction("zip");
      setConfirmOpen(true);
    }
  }

  function confirmOverwrite() {
    setConfirmOpen(false);

    if (pendingAction === "generate") doGenerate();

    if (pendingAction === "import" && pendingHtml) {
      doImport(pendingHtml);
    }

    if (pendingAction === "zip" && pendingZip) {
      doZipUpload(pendingZip);
    }

    setPendingAction(null);
    setPendingHtml(null);
    setPendingZip(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded border bg-white p-6">
          <h1 className="text-2xl font-semibold">Project Builder</h1>
          <p className="text-sm text-gray-500">Project ID: {projectId}</p>
        </div>

        <div className="rounded border bg-white p-6 space-y-2">
          <h2 className="text-lg font-medium">Status</h2>
          {status === "loading" && <p>Loading…</p>}
          {status === "empty" && <p className="text-red-600">❌ No content yet</p>}
          {status === "draft" && (
            <p className="text-yellow-600">⚠️ Draft (not published)</p>
          )}
          {status === "published" && <p className="text-green-600">✅ Published</p>}
        </div>

        <div className="rounded border bg-white p-6 space-y-3">
          <h2 className="text-lg font-medium">Actions</h2>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={requestGenerate}
              disabled={busy}
              className="rounded bg-purple-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Generate with AI
            </button>

            <button
              onClick={requestImport}
              disabled={busy}
              className="rounded bg-gray-800 px-4 py-2 text-white disabled:opacity-50"
            >
              Import HTML
            </button>

            <button
              onClick={requestZip}
              disabled={busy}
              className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Upload ZIP
            </button>

            <button
              onClick={publish}
              disabled={busy || status === "empty"}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Publish
            </button>

            {status === "published" && (
              <a
                href={`/p/${projectId}`}
                target="_blank"
                className="rounded border px-4 py-2"
              >
                View Live
              </a>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => onZipChosen(e.target.files?.[0] ?? null)}
          />

          {message && <p className="text-sm text-gray-600">{message}</p>}

          <p className="text-xs text-gray-500">
            ZIP should include <b>index.html</b> plus assets (css/images/js). After upload, publish.
          </p>
        </div>

        {(status === "draft" || status === "published") && (
          <div className="rounded border bg-white p-6">
            <h2 className="mb-2 text-lg font-medium">Preview</h2>
            <iframe src={`/p/${projectId}`} className="h-[600px] w-full rounded border" />
          </div>
        )}
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded bg-white p-6 space-y-4">
            <h3 className="text-lg font-semibold text-red-600">
              Overwrite existing site?
            </h3>
            <p className="text-sm text-gray-700">
              This will permanently replace the current site content for this project.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmOverwrite}
                className="rounded bg-red-600 px-4 py-2 text-white"
              >
                Yes, overwrite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
