// app/api/projects/[projectId]/zip/route.ts
import JSZip from "jszip";
import { kvJsonGet } from "../../../../lib/kv";
import { getCurrentUserId } from "../../../../lib/demoAuth";

export const dynamic = "force-dynamic";

type FileRec = { path: string; content: string };

function projectKey(userId: string, projectId: string) {
  return `projects:${userId}:${projectId}`;
}

export async function GET(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  const userId = getCurrentUserId();
  const projectId = params.projectId;

  const pKey = projectKey(userId, projectId);
  const proj = await kvJsonGet<any>(pKey);
  const files: FileRec[] = Array.isArray(proj?.files) ? proj.files : [];

  if (!files.length) {
    return new Response(
      JSON.stringify({ ok: false, error: "No project files to zip", userId, projectId, pKey }),
      {
        status: 404,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      }
    );
  }

  const zip = new JSZip();

  for (const f of files) {
    const path = String(f?.path ?? "").replace(/\\/g, "/");
    const content = String(f?.content ?? "");

    // safety: only allow app/generated/**
    if (!path.startsWith("app/generated/")) continue;
    if (path.includes("..") || path.includes("://") || path.includes("/api/")) continue;

    zip.file(path, content);
  }

  // Generate an ArrayBuffer for a standards-compliant web Response
  const ab = await zip.generateAsync({ type: "arraybuffer" });

  return new Response(ab, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="project_${projectId}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
