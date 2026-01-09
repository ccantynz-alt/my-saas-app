import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { requirePro, toJsonError } from "@/app/lib/limits";

type Project = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
};

export async function POST(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Pro only
    try {
      await requirePro(userId);
    } catch (err) {
      const { status, body } = toJsonError(err);
      return NextResponse.json(body, { status });
    }

    const projectId = (params?.projectId || "").toString().trim();

    if (!projectId) {
      return NextResponse.json({ ok: false, error: "Missing projectId" }, { status: 400 });
    }

    // ✅ Validate project exists + ownership
    const project = (await kv.get(`project:${projectId}`)) as Project | null;

    if (!project) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }

    if (project.ownerId !== userId) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    // TODO: real publish (Vercel deploy / Git commit / etc)
    // For now, keep stub response
    return NextResponse.json({
      ok: true,
      commitUrl: "https://github.com/example/commit/demo",
      project,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Publish failed" },
      { status: 500 }
    );
  }
}
