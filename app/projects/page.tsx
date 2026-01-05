// app/projects/page.tsx
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export default async function ProjectsPage() {
  const { userId } = await auth();
  if (!userId) {
    return <main style={{ padding: 24 }}>Not signed in</main>;
  }

  const projectIds = (await kv.lrange(`user:${userId}:projects`, 0, 50)) as string[];
  const projects: any[] = [];

  for (const id of projectIds) {
    const p = (await kv.hgetall(`project:${id}`)) as any;
    if (p?.id) projects.push(p);
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Projects</h1>
      <p style={{ opacity: 0.8, marginBottom: 20 }}>
        Your projects (API + local fallback).
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: 16,
                background: "white",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700 }}>
                {p.name || "Untitled Project"}
              </div>

              <div style={{ opacity: 0.8, marginTop: 4 }}>
                Template: {p.templateId || "unknown"}
              </div>

              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>
                {p.id}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
