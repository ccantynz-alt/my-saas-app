// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { getCurrentUserId } from "../../lib/demoAuth";
import { kvJsonGet, kvJsonSet, kvNowISO } from "../../lib/kv";

type Project = { id: string; name: string; createdAt: string; updatedAt: string };

function uid(prefix = ""): string {
  const id = randomUUID().replace(/-/g, "");
  return prefix ? `${prefix}_${id}` : id;
}

function indexKey(userId: string) {
  return `projects:index:${userId}`;
}

function projectKey(userId: string, projectId: string) {
  return `projects:${userId}:${projectId}`;
}

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(120),
});

// GET /api/projects
// Optional query params:
// - projectId=<id> : returns a single project
// - includeRuns=1  : (kept for compatibility; may be ignored if runs not implemented)
export async function GET(req: Request) {
  const userId = getCurrentUserId();

  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");

  // If asking for one project
  if (projectId) {
    const p = await kvJsonGet<Project>(projectKey(userId, projectId));
    if (!p) {
      return NextResponse.json({ ok: true, project: null });
    }
    return NextResponse.json({
      ok: true,
      project: { ...p, projectId: p.id }, // include both fields
    });
  }

  // List all projects for user
  const ids = (await kvJsonGet<string[]>(indexKey(userId))) || [];
  const projects: any[] = [];

  for (const id of ids) {
    const p = await kvJsonGet<Project>(projectKey(userId, id));
    if (p) {
      projects.push({ ...p, projectId: p.id }); // include both fields
    }
  }

  // Sort newest first by updatedAt/createdAt
  projects.sort((a, b) => {
    const ta = Date.parse(a.updatedAt || a.createdAt || "") || 0;
    const tb = Date.parse(b.updatedAt || b.createdAt || "") || 0;
    return tb - ta;
  });

  return NextResponse.json({ ok: true, projects });
}

// POST /api/projects
// Body: { name: string }
export async function POST(req: Request) {
  const userId = getCurrentUserId();

  const body = await req.json().catch(() => ({}));
  const parsed = CreateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues?.[0]?.message || "Invalid body" },
      { status: 400 }
    );
  }

  const name = parsed.data.name.trim();
  const createdAt = kvNowISO();
  const updatedAt = createdAt;

  const projectId = uid("proj");
  const project: Project = { id: projectId, name, createdAt, updatedAt };

  // Save project
  await kvJsonSet(projectKey(userId, projectId), project);

  // Update index
  const idx = (await kvJsonGet<string[]>(indexKey(userId))) || [];
  // put newest first
  const next = [projectId, ...idx.filter((x) => x !== projectId)];
  await kvJsonSet(indexKey(userId), next);

  // IMPORTANT: return BOTH id + projectId to avoid UI mismatches
  return NextResponse.json({
    ok: true,
    project: {
      ...project,
      projectId: project.id,
    },
  });
}
