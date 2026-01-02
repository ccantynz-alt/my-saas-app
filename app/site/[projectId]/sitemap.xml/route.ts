// app/site/[projectId]/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import { storeGet } from "@/app/lib/store";
import { isAdmin } from "@/app/lib/isAdmin";
import { getProjectSEO, escapeHtml } from "@/app/lib/seo";
import { PROGRAM_PAGES } from "@/app/lib/programmaticPages";

type Visibility = "public" | "private";

function visibilityKey(projectId: string) {
  return `project:visibility:${projectId}`;
}

function latestKey(projectId: string) {
  return `generated:project:${projectId}:latest`;
}

function xmlEscape(s: string) {
  return escapeHtml(s);
}

function canonicalFor(seo: any, path: string) {
  const base = String(seo?.canonicalBase || "").trim().replace(/\/+$/, "");
  if (!base) return "";
  const p = path.startsWith("/") ? path : `/${path}`;
  return base + p;
}

export async function GET(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  const admin = await isAdmin();

  const v = await storeGet(visibilityKey(params.projectId));
  const visibility: Visibility = v === "public" ? "public" : "private";

  if (visibility === "private" && !admin) {
    return new NextResponse("Not found", { status: 404 });
  }

  const seo = await getProjectSEO(params.projectId);

  const latest = await storeGet(latestKey(params.projectId));
  const pages =
    latest &&
    typeof latest === "object" &&
    (latest as any).pages &&
    typeof (latest as any).pages === "object"
      ? ((latest as any).pages as Record<string, string>)
      : null;

  // Normal project pages
  const pagePaths = pages ? Object.keys(pages) : ["/"];
  const pageUrls = pagePaths
    .map((p) => {
      const suffix = p === "/" ? "" : p;
      return canonicalFor(seo, `/site/${params.projectId}${suffix}`);
    })
    .filter(Boolean);

  // Programmatic SaaS pages
  const programUrls = PROGRAM_PAGES.map((p) =>
    canonicalFor(seo, `/site/${params.projectId}/p/${p.category}/${p.slug}`)
  ).filter(Boolean);

  const urls = [...pageUrls, ...programUrls];

  const now = new Date().toISOString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(u)}</loc>
    <lastmod>${xmlEscape(now)}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
