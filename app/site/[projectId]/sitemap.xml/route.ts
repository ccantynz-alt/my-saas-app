// app/site/[projectId]/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import { storeGet } from "@/app/lib/store";
import { isAdmin } from "@/app/lib/isAdmin";
import { getProjectSEO, escapeHtml } from "@/app/lib/seo";
import { getProgramPages } from "@/app/lib/programPagesKV";

function visibilityKey(projectId: string) {
  return `project:visibility:${projectId}`;
}
function latestKey(projectId: string) {
  return `generated:project:${projectId}:latest`;
}

function canonical(seo: any, path: string) {
  const base = (seo?.canonicalBase || "").replace(/\/+$/, "");
  return base ? base + path : "";
}

export async function GET(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  const admin = await isAdmin();
  const v = await storeGet(visibilityKey(params.projectId));
  if (v !== "public" && !admin) return new NextResponse("Not found", { status: 404 });

  const seo = await getProjectSEO(params.projectId);

  const latest = await storeGet(latestKey(params.projectId));
  const pages = latest?.pages ? Object.keys(latest.pages) : ["/"];

  const baseUrls = pages
    .map((p: string) => canonical(seo, `/site/${params.projectId}${p === "/" ? "" : p}`))
    .filter(Boolean);

  const programPages = await getProgramPages(params.projectId);
  const programUrls = programPages.map((p) =>
    canonical(seo, `/site/${params.projectId}/p/${p.category}/${p.slug}`)
  );

  const urls = [...baseUrls, ...programUrls];
  const now = new Date().toISOString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url><loc>${escapeHtml(u)}</loc><lastmod>${now}</lastmod></url>`
  )
  .join("")}
</urlset>`;

  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml" },
  });
}
