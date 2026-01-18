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
  totals: { pages: number; chunks: number; chunkSize: number };
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
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function clampPriority(p: unknown): string | null {
  const n = Number(p);
  if (!Number.isFinite(n)) return null;
  const clamped = Math.min(Math.max(n, 0), 1);
  return clamped.toFixed(1);
}

function buildSitemapXml(baseUrl: string, urls: { loc: string; lastmod: string; changefreq?: string; priority?: string }[]): string {
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
  void baseUrl;
  return lines.join("");
}

async function loadChunkedPages(index: SeoPlanIndex): Promise<SeoPage[]> {
  const keys = Array.isArray(index.chunkKeys) ? index.chunkKeys : [];
  if (keys.length === 0) return [];

  const pages: SeoPage[] = [];
  for (const key of keys) {
    const chunk = await kvJsonGet<any>(key).catch(() => null);
    const arr = Array.isArray(chunk?.pages) ? chunk.pages : [];
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

  if (req.method === "GET") {
    const hasSeoPlan = !!(await kv.get(indexKey).catch(() => null));
    const hasSitemap = !!(await kv.get(sitemapKey).catch(() => null));
    return res.status(200).json({ ok: true, projectId, hasSeoPlan, hasSitemap, indexKey, sitemapKey });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const index = await kvJsonGet<SeoPlanIndex>(indexKey).catch(() => null);

  if (!index?.ok) {
    return res.status(409).json({ ok: false, error: "Missing seoPlan", indexKey });
  }

  // Prefer the plan’s baseUrl if present, otherwise derive from current request host
  const baseUrl = String(index.baseUrl || "").trim() || safeBaseUrl(req);
  const lastmod = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  let pages: SeoPage[] = [];

  // v3 chunked
  if (String(index.version || "").includes("chunk")) {
    pages = await loadChunkedPages(index);
  } else {
    // fallback: older formats where index contained pages directly
    const legacy: any = index as any;
    const arr = Array.isArray(legacy?.pages) ? legacy.pages : [];
    pages = arr
      .map((p: any) => ({ path: String(p?.path || ""), priority: p?.priority, changefreq: p?.changefreq }))
      .filter((p: any) => typeof p.path === "string" && p.path.startsWith("/"));
  }

  // Hard safety caps (sitemap spec limit is 50,000 URLs; keep below)
  const MAX_URLS = 45000;
  const dedup = new Map<string, SeoPage>();
  for (const p of pages) {
    const path = String(p.path || "").trim();
    if (!path.startsWith("/")) continue;
    dedup.set(path, p);
    if (dedup.size >= MAX_URLS) break;
  }

  const ordered = Array.from(dedup.values()).sort((a, b) => a.path.localeCompare(b.path));

  const urls = ordered.map((p) => {
    const loc = `${baseUrl}${p.path}`;
    const priority = clampPriority(p.priority) || undefined;
    const changefreq = p.changefreq || undefined;
    return { loc, lastmod, priority, changefreq };
  });

  const xml = buildSitemapXml(baseUrl, urls);

  await kv.set(sitemapKey, xml);

  return res.status(200).json({
    ok: true,
    agent: "sitemap",
    projectId,
    message: "sitemap generated",
    baseUrl,
    indexKey,
    sitemapKey,
    urls: urls.length,
    cappedAt: MAX_URLS,
    sample: urls.slice(0, 5),
  });
}
