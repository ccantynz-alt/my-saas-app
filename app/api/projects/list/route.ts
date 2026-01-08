import { NextResponse } from "next/server";
import { listProjectsKv } from "@/lib/projectsKv";

export const runtime = "nodejs";

export async function GET() {
  const projects = await listProjectsKv(50);
  return NextResponse.json({ ok: true, projects });
}
