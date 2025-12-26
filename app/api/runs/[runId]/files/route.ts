// app/api/runs/[runId]/files/route.ts
import { NextResponse } from "next/server";
import { kvJsonGet } from "../../../../lib/kv";

type GeneratedFile = { path: string; content: string };

function runFilesKey(runId: string) {
  return `runs:${runId}:files`;
}

export async function GET(_req: Request, ctx: { params: { runId: string } }) {
  const files = (await kvJsonGet<GeneratedFile[]>(runFilesKey(ctx.params.runId))) ?? [];
  return NextResponse.json({ ok: true, files });
}
