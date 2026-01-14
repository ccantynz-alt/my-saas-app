import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicRenderer from "../PublicRenderer";
import { getPublishedMetadata } from "../publishedSeo";

type PageProps = {
  params: { projectId: string; path?: string[] };
};

function normalizeSlug(path?: string[]) {
  const slug = Array.isArray(path) && path.length > 0 ? String(path[0] || "") : "";
  return slug.trim().toLowerCase();
}

function isAllowedPublishedSlug(slug: string) {
  // "" means "home" (but catch-all is only used when a path exists)
  // Still keeping this list explicit for safety.
  const allowed = new Set(["about", "pricing", "faq", "contact"]);
  return allowed.has(slug);
}

export function generateMetadata({ params }: PageProps): Metadata {
  const slug = normalizeSlug(params.path);
  return getPublishedMetadata({ projectId: params.projectId, pageSlug: slug });
}

export default function PublishedCatchAllPage({ params }: PageProps) {
  const slug = normalizeSlug(params.path);

  // If someone hits /p/[projectId]/something-else -> real 404
  if (!isAllowedPublishedSlug(slug)) {
    notFound();
  }

  return <PublicRenderer projectId={params.projectId} pathSlug={slug} />;
}
