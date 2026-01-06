import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.projectId;
    const projectKey = `project:${projectId}`;
    const project = await kv.hgetall<any>(projectKey);

    if (!project) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }
    if (project.userId !== userId) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "");

    const now = new Date().toISOString();

    if (action === "unpublish") {
      await kv.hset(projectKey, {
        publishedStatus: "",
        updatedAt: now,
      });

      return NextResponse.json({ ok: true, projectId, action: "unpublish" });
    }

    if (action === "delete") {
      // Remove main project record
      await kv.del(projectKey);

      // Remove from both user index sets (safe even if key types differ; ignore errors)
      try {
        await kv.srem(`user:${userId}:projects`, projectId);
      } catch {}
      try {
        await kv.srem(`projects:user:${userId}`, projectId);
      } catch {}

      // Remove latest HTML
      await kv.del(`generated:project:${projectId}:latest`);

      // Remove version list (metadata list)
      await kv.del(`generated:project:${projectId}:versions`);

      // NOTE: We are NOT deleting every version htmlKey here (since we don't list them all).
      // That’s fine for now; later we can add a "purge versions" action if you want.

      return NextResponse.json({ ok: true, projectId, action: "delete" });
    }

    return NextResponse.json(
      { ok: false, error: "Invalid action. Use 'unpublish' or 'delete'." },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Admin action failed" },
      { status: 500 }
    );
  }
}
/.;
