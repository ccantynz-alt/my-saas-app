import { NextResponse } from "next/server";
import { listProjectRuns } from "@/lib/runs";

export async function GET(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  const projectId = params.projectId;
  const runs = await listProjectRuns(projectId);
  return NextResponse.json({ ok: true, runs });
}
