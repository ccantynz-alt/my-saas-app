// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { listProjects, createProject } from "@/app/lib/store";
import { getCurrentUserId } from "@/app/lib/demoAuth";
import { z } from "zod";

const CreateProjectSchema = z.object({
  name: z.string().min(1),
});

export async function GET() {
  const userId = await getCurrentUserId();
  const projects = await listProjects(userId);
  return NextResponse.json({ ok: true, projects });
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();

  const body = await req.json().catch(() => ({}));
  const parsed = CreateProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const project = await createProject(userId, parsed.data.name);
  return NextResponse.json({ ok: true, project });
}
