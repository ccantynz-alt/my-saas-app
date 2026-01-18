// pages/api/projects/[projectId]/agents/sitemap.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { kvJsonGet, kv } from "@/src/app/lib/kv";

type Changefreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

type SeoPage = {
  path: string;
  priority?: number;
  changefreq?: Changefreq;
};

type SeoPlanIndex = {
  ok: true;
  version: string;
  projectId: string;
  generatedAtIso: string;
  baseUrl: string;
  totals?: { pages: number; chunks: number; chunkSize: number };
  chunkKeys?: string[];
};

function getProto(req: NextApiRequest): string {
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  return proto.split(",")[0].trim();
}

function getHost(req: NextApiRequest): string {
  const host = (req.headers["x-forwarded-host"] as string) || (req.headers.host as string) || "";
  return String(host).split(",")[0].trim().toLowerCase();
}

function safeBaseUrl(req: NextApiRequest): string {
  const host = getHost(req);
  const proto = getProto(req);
  if (!host) return "https://example.com";
  return `${proto}://${host}`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function clampPriority(p: unknown): string | null {
  const n = Number(p);
  if (!Number.isFinite(n)) return null;
  const clamped = Math.min(Math.max(n, 0), 1);
  return clamped.toFixed(1);
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function buildSitemapXml(urls: { loc: string; lastmod: string; changefreq?: string; priority?: string }[]): string {
  const lines: string[] = [];
  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  lines.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

  for (const u of urls) {
    lines.push(`<url>`);
    lines.push(`<loc>${escapeXml(u.loc)}</loc>`);
    lines.push(`<lastmod>${escapeXml(u.lastmod)}</lastmod>`);
    if (u.changefreq) lines.push(`<changefreq>${escapeXml(u.changefreq)}</changefreq>`);
    if (u.priority) lines.push(`<priority>${escapeXml(u.priority)}</priority>`);
    lines.push(`</url>`);
  }

  lines.push(`</urlset>`);
  return lines.join("");
}

function buildSitemapIndexXml(baseUrl: string, parts: { loc: string; lastmod: string }[]): string {
  const lines: string[] = [];
  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  lines.push(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

  for (const p of parts) {
    lines.push(`<sitemap>`);
    lines.push(`<loc>${escapeXml(p.loc)}</loc>`);
    lines.push(`<lastmod>${escapeXml(p.lastmod)}</lastmod>`);
    lines.push(`</sitemap>`);
  }

  lines.push(`</sitemapindex>`);
  void baseUrl;
  return lines.join("");
}

async function loadChunkedPages(index: SeoPlanIndex): Promise<SeoPage[]> {
  const keys = Array.isArray(index.chunkKeys) ? index.chunkKeys : [];
  if (keys.length === 0) return [];

  const pages: SeoPage[] = [];
  for (const key of keys) {
    const chunkObj = await kvJsonGet<any>(key).catch(() => null);
    const arr = Array.isArray(chunkObj?.pages) ? chunkObj.pages : [];
    for (const p of arr) {
      const path = String(p?.path || "").trim();
      if (!path.startsWith("/")) continue;
      pages.push({ path, priority: p?.priority, changefreq: p?.changefreq });
    }
  }
  return pages;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const projectId = String(req.query.projectId || "").trim();
  if (!projectId) return res.status(400).json({ ok: false, error: "Missing projectId" });

  const indexKey = `project:${projectId}:seoPlan`;
  const sitemapKey = `project:${projectId}:sitemapXml`;
  const sitemapIndexKey = `project:${projectId}:sitemapIndexXml`;

  if (req.method === "GET") {
    const hasSeoPlan = !!(await kv.get(indexKey).catch(() => null));
    const hasSitemap = !!(await kv.get(sitemapKey).catch(() => null));
    const hasIndex = !!(await kv.get(sitemapIndexKey).catch(() => null));
    return res.status(200).json({
      ok: true,
      projectId,
      hasSeoPlan,
      hasSitemap,
      hasSitemapIndex: hasIndex,
      indexKey,
      sitemapKey,
      sitemapIndexKey,
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const index = await kvJsonGet<SeoPlanIndex>(indexKey).catch(() => null);

  if (!index?.ok) {
    return res.status(409).json({ ok: false, error: "Missing seoPlan", indexKey });
  }

  const baseUrl = String(index.baseUrl || "").trim() || safeBaseUrl(req);
  const lastmod = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Load pages from chunked seoPlan if present
  let pages: SeoPage[] = [];
  if (String(index.version || "").includes("chunk")) {
    pages = await loadChunkedPages(index);
  } else {
    // Legacy fallback: index might contain pages directly
    const legacy: any = index as any;
    const arr = Array.isArray(legacy?.pages) ? legacy.pages : [];
    pages = arr
      .map((p: any) => ({ path: String(p?.path || ""), priority: p?.priority, changefreq: p?.changefreq }))
      .filter((p: any) => typeof p.path === "string" && p.path.startsWith("/"));
  }

  // Dedup + stable order
  const dedup = new Map<string, SeoPage>();
  for (const p of pages) {
    const path = String(p.path || "").trim();
    if (!path.startsWith("/")) continue;
    dedup.set(path, p);
  }
  const ordered = Array.from(dedup.values()).sort((a, b) => a.path.localeCompare(b.path));

  // Sitemap limits: 50,000 URLs per sitemap. We'll use a buffer.
  const PART_SIZE = 45000;
  const parts = chunk(ordered, PART_SIZE);

  // If it fits in one file, write the legacy single sitemap, and remove index if present.
  if (parts.length <= 1) {
    const urls = ordered.map((p) => {
      const loc = `${baseUrl}${p.path}`;
      const priority = clampPriority(p.priority) || undefined;
      const changefreq = p.changefreq || undefined;
      return { loc, lastmod, priority, changefreq };
    });

    const xml = buildSitemapXml(urls);

    await kv.set(sitemapKey, xml);
    await kv.set(sitemapIndexKey, ""); // blank it (acts like "not present" for our readers)

    return res.status(200).json({
      ok: true,
      agent: "sitemap",
      mode: "single",
      projectId,
      baseUrl,
      sitemapKey,
      urls: urls.length,
      parts: 1,
      partSize: PART_SIZE,
      sample: urls.slice(0, 5),
    });
  }

  // Otherwise: write parts + index
  const partInfos: { n: number; key: string; loc: string }[] = [];

  for (let i = 0; i < parts.length; i++) {
    const n = i + 1;
    const partKey = `project:${projectId}:sitemapPartXml:${n}`;
    const partLoc = `${baseUrl}/sitemap-${n}.xml`;

    const urls = parts[i].map((p) => {
      const loc = `${baseUrl}${p.path}`;
      const priority = clampPriority(p.priority) || undefined;
      const changefreq = p.changefreq || undefined;
      return { loc, lastmod, priority, changefreq };
    });

    const xml = buildSitemapXml(urls);
    await kv.set(partKey, xml);

    partInfos.push({ n, key: partKey, loc: partLoc });
  }

  const indexXml = buildSitemapIndexXml(
    baseUrl,
    partInfos.map((p) => ({ loc: p.loc, lastmod }))
  );

  await kv.set(sitemapIndexKey, indexXml);

  // Also keep legacy key present (optional: store the index there too)
  await kv.set(sitemapKey, indexXml);

  return res.status(200).json({
    ok: true,
    agent: "sitemap",
    mode: "index",
    projectId,
    baseUrl,
    sitemapIndexKey,
    parts: partInfos.length,
    partSize: PART_SIZE,
    partLocSample: partInfos.slice(0, 5).map((p) => p.loc),
    partKeySample: partInfos.slice(0, 5).map((p) => p.key),
  });
}
