// app/api/runs/[runId]/route.ts
import { NextResponse } from "next/server";
import { kvJsonGet } from "../../../lib/kv";

type RunStatus = "queued" | "running" | "failed" | "succeeded";

type RunRecord = {
  id: string;
  projectId: string;
  status: RunStatus;
  createdAt: string;
  updatedAt: string;
  error?: string;
};

function runKey(runId: string) {
  return `runs:${runId}`;
}

export async function GET(_req: Request, ctx: { params: { runId: string } }) {
  const run = await kvJsonGet<RunRecord>(runKey(ctx.params.runId));
  if (!run) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, run });
}
