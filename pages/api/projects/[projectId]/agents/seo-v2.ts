import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@/lib/kv";

/**
 * SEO-V2 AGENT
 * - POST-capable
 * - Always JSON
 * - Writes canonical key: project:<projectId>:seoPlan
 */

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  const { projectId } = req.query;
  if (!projectId || typeof projectId !== "string") {
    return res.status(400).json({ ok: false, agent: "seo-v2", error: "Missing projectId" });
  }

  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      agent: "seo-v2",
      projectId,
      error: "Method not allowed",
      allowed: ["GET", "POST"],
      source: "pages/api/projects/[projectId]/agents/seo-v2.ts",
    });
  }

  const nowIso = new Date().toISOString();

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
      {
        slug: "/programmatic-seo",
        title: "Programmatic SEO — Generate SEO Pages With AI",
        description:
          "Scale search traffic with AI-driven programmatic SEO pages and automated sitemap generation.",
        h1: "Programmatic SEO With AI",
        keywords: ["programmatic seo", "ai seo automation"],
        intent: "informational",
        canonical: null,
      },
    ],
    sitemap: {
      include: ["/", "/programmatic-seo"],
      exclude: [],
    },
  };

  const key = `project:${projectId}:seoPlan`;
  await kv.set(key, JSON.stringify(plan));

  return res.status(200).json({
    ok: true,
    agent: "seo-v2",
    projectId,
    artifactKey: key,
    generatedAtIso: nowIso,
    pages: plan.pages.length,
    source: "pages/api/projects/[projectId]/agents/seo-v2.ts",
    method: req.method,
  });
}
