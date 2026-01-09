// app/api/projects/[projectId]/publish/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export async function POST(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.projectId;
    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json({ ok: false, error: "Missing projectId" }, { status: 400 });
    }

    // IMPORTANT:
    // This key MUST match whatever your create route writes.
    // In most of your debug output, keys look like: "project:<id>"
    const key = `project:${projectId}`;
    const project = await kv.get(key);

    if (!project) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }

    // Ownership check (only if stored object has ownerId)
    const ownerId =
      typeof (project as any)?.ownerId === "string" ? (project as any).ownerId : null;

    if (ownerId && ownerId !== userId) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    // For now, "publish" is stubbed (same as your current demo commitUrl approach)
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
