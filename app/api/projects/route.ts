import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function makeId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`;
}

/**
 * KV keys:
 * - project:<projectId>  -> project object
 */
export async function GET() {
  try {
    // List all projects
    const keys = await kv.keys("project:*");

    const projects = await Promise.all(
      keys.map(async (key) => {
        const project = await kv.get<any>(key);
        if (!project) return null;

        return {
          id: project.id,
          name: project.name ?? "Untitled",
          createdAt: project.createdAt ?? null,

          // Added for badges
          published: project.published === true,
          domain: project.domain ?? null,
          domainStatus: project.domainStatus ?? null,
        };
      })
    );

    // Sort newest first if createdAt exists (safe fallback)
    const cleaned = projects.filter(Boolean) as any[];
    cleaned.sort((a, b) => {
      const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bt - at;
    });

    return json({ ok: true, projects: cleaned });
  } catch (err) {
    console.error("GET /api/projects error:", err);
    return json({ ok: false, error: "Failed to load projects" }, 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const name =
      typeof body?.name === "string" && body.name.trim()
        ? body.name.trim()
        : "New project";

    const id = makeId("proj");

    const project = {
      id,
      name,
      createdAt: new Date().toISOString(),

      // Defaults
      published: false,
      domain: null,
      domainStatus: null,
    };

    await kv.set(`project:${id}`, project);

    return json({ ok: true, project });
  } catch (err) {
    console.error("POST /api/projects error:", err);
    return json({ ok: false, error: "Failed to create project" }, 500);
  }
}
