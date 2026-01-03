import { NextResponse } from "next/server";
import { kvListProjects, kvSaveProject, type Project } from "@/lib/kvStore";

// fallback (only if KV is not configured)
const memory = new Map<string, Project>();

export async function GET() {
  const kvProjects = await kvListProjects();

  if (kvProjects !== null) {
    return NextResponse.json({ ok: true, source: "kv", projects: kvProjects });
  }

  return NextResponse.json({
    ok: true,
    source: "memory",
    projects: Array.from(memory.values()),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.id || !body?.name) {
    return NextResponse.json({ ok: false, error: "Missing id or name" }, { status: 400 });
  }

  const project: Project = {
    id: String(body.id),
    name: String(body.name),
    templateId: body.templateId ? String(body.templateId) : undefined,
    templateName: body.templateName ? String(body.templateName) : undefined,
    seedPrompt: body.seedPrompt ? String(body.seedPrompt) : undefined,
    createdAt: new Date().toISOString(),
  };

  const saved = await kvSaveProject(project);

  if (saved !== null) {
    return NextResponse.json({ ok: true, source: "kv", project: saved });
  }

  memory.set(project.id, project);
  return NextResponse.json({ ok: true, source: "memory", project });
}
