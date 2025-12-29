// app/dashboard/projects/[projectId]/page.tsx
import "server-only";
import Link from "next/link";
import { getCurrentUserId } from "@/app/lib/demoAuth";
import { getProject, listRuns } from "@/app/lib/store";
import CreateRunForm from "./create-run-form";

export default async function ProjectDetailPage({
  params,
}: {
  params: { projectId: string };
}) {
  const userId = await getCurrentUserId();
  const projectId = params.projectId;

  const project = await getProject(userId, projectId);

  if (!project) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Project not found</h1>
        <Link href="/dashboard/projects" style={{ textDecoration: "underline" }}>
          Back to projects
        </Link>
      </div>
    );
  }

  const runs = await listRuns(userId, projectId);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>{project.name}</h1>
          <p style={{ marginTop: 6, color: "#666" }}>
            Create a run to generate/update the website.
          </p>
        </div>
        <Link href="/dashboard/projects" style={{ textDecoration: "underline" }}>
          Back
        </Link>
      </div>

      <div style={{ marginTop: 16 }}>
        <CreateRunForm projectId={projectId} />
      </div>

      <div style={{ marginTop: 18 }}>
        <h2 style={{ marginBottom: 8 }}>Runs</h2>
        {runs.length === 0 ? (
          <div style={{ padding: 14, border: "1px solid #e5e5e5", borderRadius: 10 }}>
            <strong>No runs yet.</strong>
            <div style={{ marginTop: 6, color: "#666" }}>
              Create your first run above.
            </div>
          </div>
        ) : (
          <ul style={{ paddingLeft: 18 }}>
            {runs.map((r) => (
              <li key={r.id} style={{ marginBottom: 8 }}>
                <code>{r.id}</code>{" "}
                <span style={{ marginLeft: 8 }}>
                  <strong>{r.status}</strong>
                </span>
                {r.createdAt ? (
                  <span style={{ marginLeft: 10, color: "#777", fontSize: 12 }}>
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                ) : null}
                {r.prompt ? (
                  <div style={{ marginTop: 4, color: "#444" }}>{r.prompt}</div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
