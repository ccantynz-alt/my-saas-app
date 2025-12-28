// app/api/runs/route.ts
import { NextResponse } from "next/server";
import { kvJsonGet } from "../../lib/kv";
import { getCurrentUserId } from "../../lib/demoAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function userIdOrDemo() {
  return (typeof getCurrentUserId === "function" && getCurrentUserId()) || "demo";
}

function runsIndexKey(userId: string) {
  return "runs:index:" + userId;
}

function runKey(userId: string, runId: string) {
  return "runs:" + userId + ":" + runId;
}

export async function GET() {
  try {
    const userId = userIdOrDemo();
    const idx = (await kvJsonGet<any[]>(runsIndexKey(userId))) || [];
    const ids = Array.isArray(idx) ? idx : [];

    const runs: any[] = [];
    for (const id of ids) {
      if (typeof id !== "string") continue;
      const r: any = await kvJsonGet(runKey(userId, id));
      if (r) {
        runs.push({
          runId: r.runId,
          projectId: r.projectId,
          createdAt: r.createdAt,
          filesCount: Array.isArray(r.files) ? r.files.length : 0,
          prompt: r.prompt,
        });
      }
    }

    return NextResponse.json({ ok: true, runs });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
