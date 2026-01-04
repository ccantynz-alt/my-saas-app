import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

type Run = {
  id: string;
  projectId: string;
  status: "queued" | "running" | "complete" | "failed";
  prompt: string;
  createdAt: number;
};

function runKey(projectId: string, runId: string) {
  return `run:${projectId}:${runId}`;
}

function runsIndexKey(projectId: string) {
  return `runs:${projectId}:index`;
}

export async function GET(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  // ✅ FIX: auth() must be awaited in your current Clerk typings/build
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const projectId = params.projectId;

  try {
    const ids = (await kv.get<string[]>(runsIndexKey(projectId))) || [];
    const runs = await Promise.all(
      ids.map(async (id) => {
        const r = await kv.get<Run>(runKey(projectId, id));
        return r;
      })
    );

    return NextResponse.json({
      ok: true,
      projectId,
      runs: runs.filter(Boolean),
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to load runs" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  // ✅ FIX: auth() must be awaited in your current Clerk typings/build
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const projectId = params.projectId;

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const prompt =
    typeof body?.prompt === "string"
      ? body.prompt.trim()
      : "Build a modern landing page with pricing, FAQ, and a contact form.";

  const runId = `run_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;

  const run: Run = {
    id: runId,
    projectId,
    status: "queued",
    prompt,
    createdAt: Date.now(),
  };

  try {
    // store run
    await kv.set(runKey(projectId, runId), run);

    // add to index (prepend newest)
    const indexKey = runsIndexKey(projectId);
    const ids = (await kv.get<string[]>(indexKey)) || [];
    const next = [runId, ...ids.filter((x) => x !== runId)].slice(0, 200);
    await kv.set(indexKey, next);

    return NextResponse.json({ ok: true, run });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to create run" },
      { status: 500 }
    );
  }
}
