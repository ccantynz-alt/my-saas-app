import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  const ids = await kv.smembers(`user:${userId}:projects`);
  const projects: any[] = [];

  for (const id of ids) {
    const p = await kv.hgetall<any>(`project:${id}`);
    if (!p) continue;

    projects.push({
      id,
      name: p.name || "Untitled project",

      // DOMAIN
      domain: p.domain || "",
      domainStatus: p.domainStatus || "",
      domainUpdatedAt: p.domainUpdatedAt || "",

      // PUBLISH
      publishedUrl: p.publishedUrl || "",
      publishedStatus: p.publishedStatus || "",
      publishedAt: p.publishedAt || "",

      // META
      status: p.status || "",
      createdAt: p.createdAt || "",
      updatedAt: p.updatedAt || "",
    });
  }

  return NextResponse.json({ ok: true, projects });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const projectId = `proj_${nanoid()}`;
  const now = new Date().toISOString();

  await kv.hset(`project:${projectId}`, {
    id: projectId,
    userId,
    name: body?.name || "Untitled project",
    status: "draft",
    createdAt: now,
    updatedAt: now,
  });

  await kv.sadd(`user:${userId}:projects`, projectId);

  return NextResponse.json({
    ok: true,
    project: { id: projectId },
  });
}
