import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@/lib/kv";

type SeoPlan = {
  version: number;
  generatedAtIso: string;
  site?: {
    brand?: string;
    domain?: string | null;
    language?: string;
    country?: string;
  };
  pages?: Array<{
    slug: string;
    canonical?: string | null;
  }>;
  sitemap?: {
    include: string[];
    exclude: string[];
  };
};

type SitemapArtifact = {
  generatedAtIso: string;
  urls: Array<{
    loc: string;
    lastmod: string;
    changefreq: "daily" | "weekly" | "monthly";
    priority: number;
  }>;
};

function normalizeSlug(slug: string): string {
  if (!slug) return "/";
  if (slug === "/") return "/";
  return slug.startsWith("/") ? slug : `/${slug}`;
}

function baseUrlFromRequest(req: NextApiRequest): string {
  const xfp = req.headers["x-forwarded-proto"];
  const proto = Array.isArray(xfp) ? xfp[0] : xfp || "https";

  const xfh = req.headers["x-forwarded-host"];
  const host =
    (Array.isArray(xfh) ? xfh[0] : xfh) ||
    req.headers.host ||
    "example.com";

  return `${proto}://${host}`;
}

function buildUrlSet(input: {
  baseUrl: string;
  includeSlugs: string[];
  excludeSlugs: string[];
  lastmodIso: string;
}): SitemapArtifact["urls"] {
  const { baseUrl, includeSlugs, excludeSlugs, lastmodIso } = input;

  const include = (includeSlugs || []).map(normalizeSlug);
  const exclude = new Set((excludeSlugs || []).map(normalizeSlug));

  const unique = new Set<string>();
  for (const s of include) {
    if (!exclude.has(s)) unique.add(s);
  }

  // Always ensure home is present unless explicitly excluded
  if (!exclude.has("/")) unique.add("/");

  const slugs = Array.from(unique);

  const urls: SitemapArtifact["urls"] = slugs.map((slug) => {
    const loc = slug === "/" ? `${baseUrl}/` : `${baseUrl}${slug}`;

    // Simple deterministic priorities (can be refined later by agents)
    let priority = 0.7;
    let changefreq: "daily" | "weekly" | "monthly" = "weekly";

    if (slug === "/") {
      priority = 1.0;
      changefreq = "daily";
    } else if (slug.startsWith("/pricing") || slug.startsWith("/templates")) {
      priority = 0.9;
      changefreq = "weekly";
    } else if (slug.startsWith("/use-cases")) {
      priority = 0.8;
      changefreq = "weekly";
    } else if (slug.startsWith("/docs") || slug.startsWith("/guides")) {
      priority = 0.6;
      changefreq = "monthly";
    }

    return {
      loc,
      lastmod: lastmodIso,
      changefreq,
      priority,
    };
  });

  // Stable ordering for deterministic output
  urls.sort((a, b) => a.loc.localeCompare(b.loc));

  return urls;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { projectId } = req.query;
  if (!projectId || typeof projectId !== "string") {
    return res.status(400).json({ ok: false, error: "Missing projectId" });
  }

  const nowIso = new Date().toISOString();

  const seoKey = `project:${projectId}:seoPlan`;
  const publishedSpecKey = `project:${projectId}:publishedSpec`;
  const sitemapKey = `project:${projectId}:sitemap`;

  const [seoPlanRaw, publishedSpecRaw] = await Promise.all([
    kv.get(seoKey),
    kv.get(publishedSpecKey),
  ]);

  if (!seoPlanRaw) {
    return res.status(409).json({
      ok: false,
      agent: "sitemap",
      projectId,
      error: "Missing seoPlan. Run SEO agent first.",
      requiredKey: seoKey,
    });
  }

  // seoPlanRaw may be already parsed (depending on kv wrapper) or a string.
  let seoPlan: SeoPlan | null = null;
  try {
    if (typeof seoPlanRaw === "string") seoPlan = JSON.parse(seoPlanRaw);
    else seoPlan = seoPlanRaw as SeoPlan;
  } catch {
    return res.status(500).json({
      ok: false,
      agent: "sitemap",
      projectId,
      error: "seoPlan exists but could not be parsed as JSON.",
      key: seoKey,
    });
  }

  // publishedSpec is optional for Move 2 (we still read it, but won’t fail if absent)
  // It can be used later to refine lastmod or include dynamic pages.
  const publishedSpecPresent = !!publishedSpecRaw;

  const baseUrl =
    (seoPlan?.site?.domain && seoPlan.site.domain.startsWith("http")
      ? seoPlan.site.domain
      : seoPlan?.site?.domain
      ? `https://${seoPlan.site.domain}`
      : baseUrlFromRequest(req)
    ).replace(/\/+$/, "");

  const include =
    seoPlan?.sitemap?.include && Array.isArray(seoPlan.sitemap.include)
      ? seoPlan.sitemap.include
      : (seoPlan?.pages || []).map((p) => p.slug);

  const exclude =
    seoPlan?.sitemap?.exclude && Array.isArray(seoPlan.sitemap.exclude)
      ? seoPlan.sitemap.exclude
      : [];

  const artifact: SitemapArtifact = {
    generatedAtIso: nowIso,
    urls: buildUrlSet({
      baseUrl,
      includeSlugs: include,
      excludeSlugs: exclude,
      lastmodIso: nowIso,
    }),
  };

  await kv.set(sitemapKey, JSON.stringify(artifact));

  return res.status(200).json({
    ok: true,
    agent: "sitemap",
    projectId,
    generatedAtIso: nowIso,
    inputs: {
      seoPlanKey: seoKey,
      publishedSpecKey,
      publishedSpecPresent,
    },
    output: {
      sitemapKey,
      urlCount: artifact.urls.length,
      baseUrl,
    },
  });
}
