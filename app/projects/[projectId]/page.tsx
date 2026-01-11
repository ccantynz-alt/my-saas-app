"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options?.headers || {}),
    },
  });
  return res;
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [status, setStatus] = useState<string>("idle");
  const [error, setError] = useState<string | null>(null);

  async function runPreview() {
    setStatus("previewing");
    setError(null);

    try {
      const res = await apiFetch(`/api/projects/${projectId}/preview`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setStatus("previewed");
    } catch (err: any) {
      setError(err.message || "Preview failed");
      setStatus("error");
    }
  }

  async function runPublish() {
    setStatus("publishing");
    setError(null);

    try {
      const res = await apiFetch(`/api/projects/${projectId}/publish`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setStatus("published");
    } catch (err: any) {
      setError(err.message || "Publish failed");
      setStatus("error");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Project: {projectId}</h1>

      <div style={{ marginTop: 16 }}>
        <button onClick={runPreview}>Generate Preview</button>
        <button onClick={runPublish} style={{ marginLeft: 8 }}>
          Publish
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Status:</strong> {status}
      </div>

      {error && (
        <div style={{ marginTop: 16, color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {status === "published" && (
        <div style={{ marginTop: 16 }}>
          <a href={`/p/${projectId}`} target="_blank">
            Open Public Page →
          </a>
        </div>
      )}
    </div>
  );
}
