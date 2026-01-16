// pages/api/projects/[projectId]/agents/seo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { loadSiteSpec, saveSiteSpec } from "@/app/lib/projectSpecStore";

function nowIso() {
  return new Date().toISOString();
}

function ensurePage(spec: any, slug: string, title: string) {
  spec.pages = Array.isArray(spec.pages) ? spec.pages : [];
  let page = spec.pages.find((p: any) => p?.slug === slug);
  if (!page) {
    page = { slug, title, sections: [] };
    spec.pages.push(page);
  }
  return page;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const projectId = String(req.query.projectId || "");
    if (!projectId) {
      return res.status(400).json({ ok: false, error: "Missing projectId" });
    }

    const spec = await loadSiteSpec(projectId);
    if (!spec) {
      return res.status(400).json({
        ok: false,
        error: "No draft spec found. Run seed-spec first.",
      });
    }

    spec.updatedAtIso = nowIso();
    spec.brandName = spec.brandName ?? "Your Brand";

    // --- SEO METADATA ---
    spec.seo = spec.seo ?? {};
    spec.seo.title =
      spec.seo.title ??
      `${spec.brandName} – Premium Website Built to Convert`;
    spec.seo.description =
      spec.seo.description ??
      `Launch a fast, professional website for ${spec.brandName} that builds trust and converts visitors into customers.`;
    spec.seo.keywords =
      spec.seo.keywords ??
      [
        spec.brandName,
        "professional website",
        "premium website",
        "conversion focused",
        "modern business site",
      ];
    spec.seo.ogImage = spec.seo.ogImage ?? "/og-default.png";

    // --- HOMEPAGE SEO SECTION ---
    const home = ensurePage(spec, "/", "Home");
    home.sections = Array.isArray(home.sections) ? home.sections : [];

    if (!home.sections.find((s: any) => s.type === "seo-trust")) {
      home.sections.push({
        type: "seo-trust",
        headline: "Trusted, fast, and built to convert",
        body:
          "Designed for clarity, performance, and search visibility. Built to rank and persuade.",
        bullets: [
          "Search-engine friendly structure",
          "Clear value proposition",
          "Fast load times",
          "Mobile-first layout",
        ],
      });
    }

    // --- PROGRAMMATIC SEO PAGES ---
    ensurePage(spec, "/features", "Features");
    ensurePage(spec, "/pricing", "Pricing");
    ensurePage(spec, "/use-cases", "Use Cases");
    ensurePage(spec, "/about", "About");

    await saveSiteSpec(projectId, spec);

    return res.status(200).json({
      ok: true,
      projectId,
      message: "SEO agent applied: metadata + SEO pages added",
      seo: spec.seo,
      pages: spec.pages.map((p: any) => p.slug),
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? "Unknown error" });
  }
}
