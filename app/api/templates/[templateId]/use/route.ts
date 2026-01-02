import { NextResponse } from "next/server";
import { getTemplate } from "../../../../lib/templatesKV";

type UseBody = {
  projectName?: string;
  startRun?: boolean; // default true
};

function pickProjectId(data: any): string | null {
  return (
    data?.projectId ||
    data?.project?.id ||
    data?.project?.projectId ||
    null
  );
}

function pickRunId(data: any): string | null {
  return data?.runId || data?.run?.id || null;
}

export async function POST(
  req: Request,
  { params }: { params: { templateId: string } }
) {
  const templateId = params.templateId;
  const tpl = await getTemplate(templateId);

  if (!tpl) {
    return NextResponse.json({ ok: false, error: "Template not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as UseBody;
  const startRun = body.startRun !== false;

  const origin = new URL(req.url).origin;
  const cookie = req.headers.get("cookie") || "";

  // 1) Create project
  const createProjectRes = await fetch(`${origin}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
    body: JSON.stringify({
      name: (body.projectName || tpl.name || "New Project").slice(0, 80),
    }),
  });

  const createProjectJson = await createProjectRes.json().catch(() => ({}));

  if (!createProjectRes.ok || !createProjectJson?.ok) {
    return NextResponse.json(
      { ok: false, error: "Failed to create project", details: createProjectJson },
      { status: 500 }
    );
  }

  const projectId = pickProjectId(createProjectJson);
  if (!projectId) {
    return NextResponse.json(
      { ok: false, error: "Project created but projectId not found in response", details: createProjectJson },
      { status
