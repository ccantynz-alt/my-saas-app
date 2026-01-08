import { NextResponse } from "next/server";
import { createProject } from "@/lib/demoStore";

export const runtime = "nodejs";

export async function POST() {
  const project = createProject();
  return NextResponse.json({ ok: true, projectId: project.id });
}
