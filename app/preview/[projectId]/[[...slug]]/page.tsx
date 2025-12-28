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

function PreviewNav({ projectId }: { projectId: string }) {
  const base = `/preview/${projectId}`;
  const linkStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.15)",
    textDecoration: "none",
    color: "inherit",
    background: "rgba(0,0,0,0.03)",
  };

  const wrap: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 14,
  };

  return (
    <nav style={wrap}>
      <a href={base} style={linkStyle}>
        Home
      </a>
      <a href={`${base}/about`} style={linkStyle}>
        About
      </a>
      <a href={`${base}/pricing`} style={linkStyle}>
        Pricing
      </a>
      <a href={`${base}/contact`} style={linkStyle}>
        Contact
      </a>
    </nav>
  );
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

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Preview</h1>

      {/* ✅ Navigation menu */}
      <PreviewNav projectId={projectId} />

      <p style={{ marginBottom: 10 }}>
        <strong>Showing:</strong>
        <br />
        <code>{target}</code>
      </p>

      {!found ? (
        <>
          <p style={{ marginBottom: 16 }}>
            Could not find a generated page for this route.
          </p>

          <h2 style={{ fontSize: 16, marginBottom: 8 }}>Files in project</h2>
          <ul>
            {files.map((f) => (
              <li key={f.path}>
                <code>{f.path}</code>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
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
        </>
      )}

      <div style={{ marginTop: 16, fontSize: 12, opacity: 0.75 }}>
        Updated: <code>{project.updatedAt}</code>
      </div>
    </main>
  );
}
