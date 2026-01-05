// app/api/projects/[projectId]/publish/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

async function requireProjectOwner(userId: string, projectId: string) {
  const project = (await kv.hgetall(`project:${projectId}`)) as any;
  if (!project?.id) return { ok: false as const, error: "PROJECT_NOT_FOUND" as const };
  if (project.userId !== userId) return { ok: false as const, error: "FORBIDDEN" as const };
  return { ok: true as const, project };
}

export async function POST(_req: Request, ctx: { params: { projectId: string } }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const projectId = ctx.params.projectId;

  const ownerCheck = await requireProjectOwner(userId, projectId);
  if (!ownerCheck.ok) {
    const status = ownerCheck.error === "PROJECT_NOT_FOUND" ? 404 : 403;
    return NextResponse.json({ ok: false, error: ownerCheck.error }, { status });
  }

  // ✅ publish from global generated key for now
  const latestHtml = (await kv.get("generated:latest")) as string | null;

  if (!latestHtml || typeof latestHtml !== "string" || latestHtml.trim().length < 20) {
    return NextResponse.json(
      { ok: false, error: "NO_GENERATED_HTML_FOUND" },
      { status: 400 }
    );
  }

  const publishedKey = `published:${projectId}`;
  const now = new Date().toISOString();

  await kv.set(publishedKey, latestHtml);

  await kv.hset(`project:${projectId}`, {
    publishedKey,
    publishedAt: now,
    updatedAt: now,
  });

  return NextResponse.json({
    ok: true,
    projectId,
    publishedKey,
    publishedAt: now,
    publicUrl: `/p/${projectId}`,
  });
}
