// app/api/projects/[projectId]/publish/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

const publicIndexKey = "public:projects:index";

async function getGeneratedHtml(projectId: string): Promise<{ html: string | null; keyUsed: string | null; keys: string[] }> {
  const keys = [
    `generated:project:${projectId}:latest`,
    `generated:project:${projectId}`,
    `generated:${projectId}:latest`,
    `generated:${projectId}`,
    `generated:latest`, // <-- common in your earlier logs
  ];

  for (const key of keys) {
    const v = await kv.get<any>(key);
    if (typeof v === "string" && v.trim().length > 0) {
      return { html: v, keyUsed: key, keys };
    }
  }

  return { html: null, keyUsed: null, keys };
}

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
      return NextResponse.json({ ok: false, error: "Invalid projectId" }, { status: 400 });
    }

    // Load project
    const projectKey = `project:${projectId}`;
    const project = await kv.get<any>(projectKey);

    if (!project) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }

    // Enforce ownership when ownerId exists
    const ownerId = typeof project?.ownerId === "string" ? project.ownerId : null;
    if (ownerId && ownerId !== userId) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    // Ensure there is generated HTML to serve
    const found = await getGeneratedHtml(projectId);
    if (!found.html) {
      return NextResponse.json(
        {
          ok: false,
          error: "No generated HTML found for this project. Generate the site first, then publish.",
          keysTried: found.keys,
        },
        { status: 400 }
      );
    }

    // Mark published
    await kv.set(`project:${projectId}:published`, true);

    // Add to public index (dedupe)
    const existing = (await kv.get<any>(publicIndexKey)) ?? [];
    const arr = Array.isArray(existing) ? existing.filter((x) => typeof x === "string") : [];
    const next = arr.includes(projectId) ? arr : [projectId, ...arr];
    await kv.set(publicIndexKey, next);

    return NextResponse.json({
      ok: true,
      projectId,
      publicUrl: `/p/${projectId}`,
      indexKey: publicIndexKey,
      htmlKeyUsed: found.keyUsed,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Publish failed" },
      { status: 500 }
    );
  }
}
