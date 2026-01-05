// app/api/projects/[projectId]/runs/[runId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

type Run = {
  id: string;
  projectId: string;
  userId: string;
  status: "queued" | "running" | "complete" | "failed";
  prompt: string;
  createdAt: string;
  completedAt?: string;
  outputKey?: string;
};

export async function GET(_: Request, ctx: { params: { projectId: string; runId: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

  const { projectId, runId } = ctx.params;

  const run = await kv.hgetall<Run>(`run:${runId}`);
  if (!run || run.projectId !== projectId || run.userId !== userId) {
    return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
  }

  const html = run.outputKey ? await kv.get<string>(run.outputKey) : null;

  return NextResponse.json({ ok: true, run, html: html || "" });
}
