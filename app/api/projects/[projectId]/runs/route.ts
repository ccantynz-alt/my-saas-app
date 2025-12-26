// app/api/projects/[projectId]/runs/route.ts
import { NextResponse } from "next/server";
import { kvJsonGet } from "../../../../lib/kv";

type RunStatus = "queued" | "running" | "failed" | "succeeded";

type RunRecord = {
  id: string;
  projectId: string;
  status: RunStatus;
  createdAt: string;
  updatedAt: string;
  error?: string;
};

function projectRunsIndexKey(projectId: string) {
  return `projects:${projectId}:runs`;
}
function runKey(runId: string) {
  return `runs:${runId}`;
}

export async function GET(_req: Request, ctx: { params: { projectId: string } }) {
  const projectId = ctx.params.projectId;
  const runIds = (await kvJsonGet<string[]>(projectRunsIndexKey(projectId))) ?? [];

  const runs: RunRecord[] = [];
  for (const id of runIds) {
    const r = await kvJsonGet<RunRecord>(runKey(id));
    if (r) runs.push(r);
  }

  return NextResponse.json({ ok: true, runs });
}
