// app/dashboard/page.tsx
import { redirect } from "next/navigation";

type Project = {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
};

async function readJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { ok: false, error: "Non-JSON response", raw: text };
  }
}

export default async function DashboardPage() {
  try {
    // 1) Load projects
    const listRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/projects`, {
      cache: "no-store",
    });
    const listJson = await readJson(listRes);

    if (!listRes.ok || !listJson?.ok) {
      throw new Error(listJson?.error || `Failed to load projects (${listRes.status})`);
    }

    let projects: Project[] = Array.isArray(listJson.projects) ? listJson.projects : [];
    let project = projects[0];

    // 2) If no projects, create one
    if (!project) {
      const createRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/projects`, {
        method: "POST",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Untitled Project" }),
      });
      const createJson = await readJson(createRes);

      if (!createRes.ok || !createJson?.ok) {
        throw new Error(createJson?.error || `Failed to create project (${createRes.status})`);
      }

      project = createJson.project;
    }

    const pid = project?.projectId || project?.id;
    if (!pid) throw new Error("Project missing projectId/id");

    redirect(`/dashboard/projects/${pid}`);
  } catch (err: any) {
    return (
      <main style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Dashboard error</h1>
        <p style={{ marginTop: 10 }}>
          Something failed while loading your dashboard. This page is designed to show the real error instead
          of a generic digest screen.
        </p>
        <pre
          style={{
            marginTop: 12,
            padding: 12,
            background: "#111",
            color: "#fff",
            borderRadius: 8,
            overflowX: "auto",
            fontSize: 12,
          }}
        >
          {String(err?.message || err)}
        </pre>
        <p style={{ marginTop: 12 }}>
          Check <code>/api/kv-test</code> and confirm <code>anyKvConfigured</code> is true.
        </p>
      </main>
    );
  }
}
