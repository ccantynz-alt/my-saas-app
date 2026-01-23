import type { MetadataRoute } from "next";
import { templates, useCases } from "@/src/lib/marketing/catalog";

const SITE = "https://www.dominat8.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now },
    { url: `${SITE}/pricing`, lastModified: now },
    { url: `${SITE}/templates`, lastModified: now },
    { url: `${SITE}/use-cases`, lastModified: now },
  ];

  const templateRoutes: MetadataRoute.Sitemap = templates.map((t) => ({
    url: `${SITE}/templates/${t.slug}`,
    lastModified: now,
  }));

  const useCaseRoutes: MetadataRoute.Sitemap = useCases.map((u) => ({
    url: `${SITE}/use-cases/${u.slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...templateRoutes, ...useCaseRoutes];
}