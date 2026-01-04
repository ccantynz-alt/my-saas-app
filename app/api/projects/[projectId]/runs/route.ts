import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";

async function getOwnedProject(projectId: string, userId: string) {
  const project = await kv.hgetall<any>(`project:${projectId}`);
  if (!project) return { project: null, status: 404 as const };
  if (project.userId !== userId) return { project: null, status: 403 as const };
  return { project, status: 200 as const };
}

export async function GET(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const owned = await getOwnedProject(params.projectId, userId);

  if (owned.status === 404) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  if (owned.status === 403) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const runIds = await kv.lrange<string[]>(`project:${params.projectId}:runs`, 0, -1);

  const runs = await Promise.all(
    runIds.map(async (id) => {
      const run = await kv.hgetall<any>(`run:${id}`);
      return run || null;
    })
  );

  return NextResponse.json({
    ok: true,
    project: owned.project,
    runs: runs.filter(Boolean),
  });
}

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const owned = await getOwnedProject(params.projectId, userId);

  if (owned.status === 404) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  if (owned.status === 403) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const prompt = typeof body.prompt === "string" ? body.prompt : "";

  const run = {
    id: `run_${nanoid(10)}`,
    projectId: params.projectId,
    userId,
    prompt,
    status: "queued",
    createdAt: Date.now(),
  };

  await kv.hset(`run:${run.id}`, run);
  await kv.lpush(`project:${params.projectId}:runs`, run.id);

  return NextResponse.json({ ok: true, run });
}
