import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

function makeVersionId() {
  // sortable-ish id: 20260107T063000Z_xxxxx
  const now = new Date().toISOString().replace(/[-:.]/g, "").replace("T", "T").replace("Z", "Z");
  const rand = crypto.randomUUID().slice(0, 8).replace(/-/g, "");
  return `${now}_${rand}`;
}

export async function GET(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.projectId;
    const project = await kv.hgetall<any>(`project:${projectId}`);
    if (!project) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }
    if (project.userId !== userId) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const listKey = `generated:project:${projectId}:versions`;
    const items = (await kv.lrange(listKey, 0, 49)) as any[]; // up to 50 newest

    // items are stored as JSON strings
    const versions = items
      .map((s) => {
        try {
          return typeof s === "string" ? JSON.parse(s) : s;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return NextResponse.json({ ok: true, projectId, versions });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to list versions" },
      { status: 500 }
    );
  }
}

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
    const project = await kv.hgetall<any>(`project:${projectId}`);
    if (!project) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }
    if (project.userId !== userId) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const html = typeof body?.html === "string" ? body.html : "";
    const prompt = typeof body?.prompt === "string" ? body.prompt : "";

    if (!html || html.trim().length < 50) {
      return NextResponse.json({ ok: false, error: "Missing or too-short html" }, { status: 400 });
    }

    const versionId = makeVersionId();
    const htmlKey = `generated:project:${projectId}:v:${versionId}`;
    const listKey = `generated:project:${projectId}:versions`;

    await kv.set(htmlKey, html);

    const meta = {
      versionId,
      createdAt: new Date().toISOString(),
      htmlKey,
      prompt: prompt.slice(0, 5000),
      length: html.length,
    };

    // store newest first
    await kv.lpush(listKey, JSON.stringify(meta));
    // cap list length to 50
    await kv.ltrim(listKey, 0, 49);

    return NextResponse.json({ ok: true, projectId, version: meta });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to save version" },
      { status: 500 }
    );
  }
}
