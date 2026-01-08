import { NextResponse } from "next/server";
import { getProject, setPublishedUrl } from "@/lib/demoStore";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  const project = getProject(params.projectId);
  if (!project) {
    return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
  }

  const url = `/p/${params.projectId}`;
  setPublishedUrl(params.projectId, url);

  return NextResponse.json({ ok: true, url });
}
