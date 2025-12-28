// app/api/projects/[projectId]/apply/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { kvJsonGet, kvJsonSet, kvNowISO } from "../../../../lib/kv";
import { getCurrentUserId } from "../../../../lib/demoAuth";

const BodySchema = z.object({
  runId: z.string().min(1),
});

function projectKey(userId: string, projectId: string) {
  return `projects:${userId}:${projectId}`;
}

// IMPORTANT: runs are usually stored per-user
function runKeyUserScoped(userId: string, runId: string) {
  return `runs:${userId}:${runId}`;
}

// Fallback in case older code stored runs without userId
function runKeyLegacy(runId: string) {
  return `runs:${runId}`;
}

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const userId = getCurrentUserId();
  const projectId = params.projectId;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Missing runId", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { runId } = parsed.data;

  const rKey1 = runKeyUserScoped(userId, runId);
  const rKey2 = runKeyLegacy(runId);
  const pKey = projectKey(userId, projectId);

  // 1) Load run (try user-scoped key first, then legacy)
  const run1 = await kvJsonGet<any>(rKey1);
  const run2 = run1 ? null : await kvJsonGet<any>(rKey2);
  const run = run1 || run2;

  const runFiles = Array.isArray(run?.files) ? run.files : [];
  const runFilesCount = runFiles.length;

  if (!run || runFilesCount === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Run not found or run.files empty",
        userId,
        projectId,
        runId,
        triedRunKeys: [rKey1, rKey2],
        pKey,
        runFilesCount,
      },
      { status: 404 }
    );
  }

  // 2) Write to project draft state
  const payload = {
    projectId,
    userId,
    updatedAt: kvNowISO(),
    files: runFiles,
  };

  await kvJsonSet(pKey, payload);

  // 3) Read-back proof (confirms persistence)
  const readBack = await kvJsonGet<any>(pKey);
  const readBackCount = Array.isArray(readBack?.files) ? readBack.files.length : 0;

  return NextResponse.json({
    ok: true,
    userId,
    projectId,
    runId,
    usedRunKey: run1 ? rKey1 : rKey2,
    triedRunKeys: [rKey1, rKey2],
    pKey,
    runFilesCount,
    writtenCount: runFilesCount,
    readBackCount,
    readBackMeta: {
      storedProjectId: readBack?.projectId ?? null,
      storedUserId: readBack?.userId ?? null,
      updatedAt: readBack?.updatedAt ?? null,
    },
  });
}
