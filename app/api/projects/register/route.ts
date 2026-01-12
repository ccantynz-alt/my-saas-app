import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateBody = {
  name?: string;
  templateId?: string | null;
};

function hasKVEnv() {
  return !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
}

async function getKV() {
  if (!hasKVEnv()) return null;
  // Dynamic import prevents build/dev crashes when KV env vars are missing
  const mod = await import("@vercel/kv");
  return mod.kv;
}

function newProjectId() {
  // Example: proj_40d049799ade4ff4b329c202a1a93e98 (no dashes)
  const id = crypto.randomUUID().replace(/-/g, "");
  return `proj_${id}`;
}

const projectKey = (projectId: string) => `project:${projectId}`;
const userProjectsKey = (userId: string) => `user:${userId}:projects`;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Not signed in" },
        { status: 401 }
      );
    }

    const kv = await getKV();
    if (!kv) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "KV is not configured (missing KV_REST_API_URL/KV_REST_API_TOKEN). Add them to .env.local and Vercel env vars.",
        },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as CreateBody;
    const name = String(body?.name || "Untitled project").trim();

    const projectId = newProjectId();
    const now = Date.now();

    const project = {
      id: projectId,
      userId,
      name,
      templateId: body?.templateId ?? null,
      createdAt: now,
      updatedAt: now,
    };

    // Store canonical project record
    await kv.set(projectKey(projectId), project);

    // Index it under the user for listing
    // (Redis Set of projectIds)
    await kv.sadd(userProjectsKey(userId), projectId);

    return NextResponse.json(
      {
        ok: true,
        version: "register-v6",
        projectId,
        project,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to register project" },
      { status: 500 }
    );
  }
}
