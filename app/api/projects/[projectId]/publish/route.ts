import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

type Project = {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

function projectKey(projectId: string) {
  return `project:${projectId}`;
}

function generatedProjectLatestKey(projectId: string) {
  return `generated:project:${projectId}:latest`;
}

function publishedKey(projectId: string) {
  return `published:project:${projectId}`;
}

function nowIso() {
  return new Date().toISOString();
}

/**
 * Publish rules (website-only):
 * - Must be signed in
 * - Must own the project
 * - Must have generated HTML
 * - Stores "published" metadata and returns public path
 *
 * NOTE: This does not connect custom domains. It publishes to /p/<projectId>.
 */
export async function POST(_req: Request, ctx: { params: { projectId: string } }) {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const projectId = ctx.params.projectId;
  if (!projectId) {
    return NextResponse.json({ ok: false, error: "Missing projectId" }, { status: 400 });
  }

  const project = await kv.get<Project>(projectKey(projectId));
  if (!project) {
    return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
  }

  if (project.ownerId !== userId) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const html = await kv.get<string>(generatedProjectLatestKey(projectId));
  if (!html) {
    return NextResponse.json(
      { ok: false, error: "No generated HTML to publish. Generate or import first." },
      { status: 400 }
    );
  }

  // Mark published
  const publishedAt = nowIso();
  await kv.set(publishedKey(projectId), {
    projectId,
    publishedAt,
    published: true,
  });

  // Return the public path
  const path = `/p/${projectId}`;

  return NextResponse.json(
    {
      ok: true,
      published: true,
      projectId,
      publishedAt,
      path,
      url: path,
    },
    { status: 200 }
  );
}
