import type { NextApiRequest, NextApiResponse } from "next";

type SeoPlanV2 = {
  version: 2;
  generatedAtIso: string;
  site: { brand: string; domain: string | null; language: string; country: string };
  pages: Array<{
    slug: string;
    title: string;
    description: string;
    h1: string;
    keywords: string[];
    intent: "transactional" | "informational" | "navigational";
    canonical: string | null;
  }>;
  sitemap: { include: string[]; exclude: string[] };
};

function errToJson(e: unknown) {
  if (e && typeof e === "object") {
    const anyE = e as any;
    return {
      name: anyE?.name,
      message: anyE?.message,
      stack:
        typeof anyE?.stack === "string"
          ? anyE.stack.split("\n").slice(0, 12).join("\n")
          : undefined,
    };
  }
  return { message: String(e) };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  const { projectId } = req.query;
  if (!projectId || typeof projectId !== "string") {
    return res.status(400).json({
      ok: false,
      agent: "seo-v2",
      error: "Missing projectId",
      source: "pages/api/projects/[projectId]/agents/seo-v2.ts",
    });
  }

  const nowIso = new Date().toISOString();

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      agent: "seo-v2",
      projectId,
      nowIso,
      note: "GET is diagnostics-only. Use POST to write project:<id>:seoPlan.",
      source: "pages/api/projects/[projectId]/agents/seo-v2.ts",
      method: req.method,
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      agent: "seo-v2",
      projectId,
      error: "Method not allowed",
      allowed: ["GET", "POST"],
      source: "pages/api/projects/[projectId]/agents/seo-v2.ts",
      method: req.method,
    });
  }

  const plan: SeoPlanV2 = {
    version: 2,
    generatedAtIso: nowIso,
    site: { brand: "AI Website Builder", domain: null, language: "en", country: "global" },
    pages: [
      {
        slug: "/",
        title: "AI Website Builder — Build, Publish & Scale Automatically",
        description:
          "Generate complete websites end-to-end with AI agents. Create pages, publish fast, and scale with automation.",
        h1: "Build Websites Automatically With AI",
        keywords: ["ai website builder", "website automation"],
        intent: "transactional",
        canonical: null,
      },
    ],
    sitemap: { include: ["/"], exclude: [] },
  };

  const key = `project:${projectId}:seoPlan`;

  try {
    const mod = await import("@/lib/kv");
    const kv = (mod as any).kv;

    if (!kv || typeof kv.set !== "function") {
      return res.status(500).json({
        ok: false,
        agent: "seo-v2",
        projectId,
        error: "KV module loaded but kv.set is not available",
        detail: { exportedKeys: Object.keys(mod || {}) },
        source: "pages/api/projects/[projectId]/agents/seo-v2.ts",
        method: req.method,
      });
    }

    await kv.set(key, JSON.stringify(plan));

    return res.status(200).json({
      ok: true,
      agent: "seo-v2",
      projectId,
      artifactKey: key,
      generatedAtIso: nowIso,
      source: "pages/api/projects/[projectId]/agents/seo-v2.ts",
      method: req.method,
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      agent: "seo-v2",
      projectId,
      artifactKey: key,
      error: "KV write failed (or KV import failed)",
      detail: errToJson(e),
      source: "pages/api/projects/[projectId]/agents/seo-v2.ts",
      method: req.method,
    });
  }
}
