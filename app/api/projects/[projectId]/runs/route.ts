// app/api/projects/[projectId]/runs/route.ts
import { NextResponse } from "next/server";
import { createRun, listRuns, getProject } from "@/app/lib/store";
import { z } from "zod";

const CreateRunSchema = z.object({
  prompt: z.string().min(1),
});

export async function GET(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;

    // ✅ getProject now only takes projectId
    const project = await getProject(projectId);
    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const runs = await listRuns(projectId);
    return NextResponse.json({ ok: true, runs }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message ?? String(err),
        stack: err?.stack ?? null,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;

    // ✅ getProject now only takes projectId
    const project = await getProject(projectId);
    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parsed = CreateRunSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const run = await createRun({ projectId, prompt: parsed.data.prompt });
    return NextResponse.json({ ok: true, run }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message ?? String(err),
        stack: err?.stack ?? null,
      },
      { status: 500 }
    );
  }
}
