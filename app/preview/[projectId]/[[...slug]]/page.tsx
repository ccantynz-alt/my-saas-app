// app/preview/[projectId]/[[...slug]]/page.tsx
import React from "react";
import { kvJsonGet } from "@/app/lib/kv";
import { getCurrentUserId } from "@/app/lib/demoAuth";

type GenFile = { path: string; content: string };

type ProjectRecord = {
  projectId: string;
  userId: string;
  files: GenFile[];
  updatedAt: string;
};

function projectKey(userId: string, projectId: string) {
  return `projects:${userId}:${projectId}`;
}

function normalizePath(p: string) {
  return p.replace(/^\/+/, "");
}

function pickGeneratedPage(files: GenFile[], slug?: string[]) {
  const clean = (slug || []).filter(Boolean);

  const target =
    clean.length === 0
      ? "app/generated/page.tsx"
      : `app/generated/${clean.join("/")}/page.tsx`;

  const found = files.find((f) => normalizePath(f.path) === target);
  return { target, found };
}

export default async function PreviewCatchAllPage({
  params,
}: {
  params: { projectId: string; slug?: string[] };
}) {
  const userId = getCurrentUserId();
  const { projectId, slug } = params;

  const project = await kvJsonGet<ProjectRecord>(projectKey(userId, projectId));
  const files = project?.files ?? [];

  const { target, found } = pickGeneratedPage(files, slug);

  if (!project) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Preview</h1>
        <p>
          Project not found in KV for:
          <br />
          <code>{projectId}</code>
        </p>
      </main>
    );
  }

  if (!found) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Preview</h1>
        <p style={{ marginBottom: 16 }}>
          Could not find a generated page for:
          <br />
          <code>{target}</code>
        </p>

        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Files in project</h2>
        <ul>
          {files.map((f) => (
            <li key={f.path}>
              <code>{f.path}</code>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Preview</h1>

      <p style={{ marginBottom: 16 }}>
        Showing:
        <br />
        <code>{target}</code>
      </p>

      <h2 style={{ fontSize: 16, marginBottom: 8 }}>Source</h2>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          padding: 12,
          borderRadius: 8,
          background: "rgba(0,0,0,0.06)",
          overflowX: "auto",
        }}
      >
        {found.content}
      </pre>
    </main>
  );
}
