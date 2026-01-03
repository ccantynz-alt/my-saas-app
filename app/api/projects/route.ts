import { NextResponse } from "next/server";
import { kvListProjects, kvSaveProject, type Project } from "@/lib/kvStore";

// ✅ IMPORTANT: force this route to always run dynamically (no caching)
export const dynamic = "force-dynamic";

// fallback (only if KV is not configured)
const memory = new Map<string, Project>();

function noStoreJson(data: any, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      ...(init?.headers || {}),
    },
  });
}

export async function GET() {
  const kvProjects = await kvListProjects();

  if (kvProjects !== null) {
    return noStoreJson({ ok: true, source: "kv", projects: kvProjects });
  }

  return noStoreJson({
    ok: true,
    source: "memory",
    projects: Array.from(memory.values()),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.id || !body?.name) {
    return noStoreJson({ ok: false, error: "Missing id or name" }, { status: 400 });
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
    return noStoreJson({ ok: true, source: "kv", project: saved });
  }

  memory.set(project.id, project);
  return noStoreJson({ ok: true, source: "memory", project });
}
