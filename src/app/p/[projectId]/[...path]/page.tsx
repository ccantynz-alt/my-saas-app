import { Metadata } from "next";
import PublicRenderer from "../PublicRenderer";

type PageProps = {
  params: { projectId: string; path?: string[] };
};

function normalizeSlug(path?: string[]) {
  const slug = Array.isArray(path) && path.length > 0 ? String(path[0] || "") : "";
  return slug.trim().toLowerCase();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = normalizeSlug(params.path);

  if (!slug) {
    return {
      title: "Home",
      description: "Published website",
    };
  }

  const pretty = slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: pretty,
    description: `${pretty} page`,
  };
}

export default function PublishedCatchAllPage({ params }: PageProps) {
  const slug = normalizeSlug(params.path);

  // Legacy behavior: /p/[projectId]/pricing etc.
  // PublicRenderer is expected to support internal section-based rendering.
  return <PublicRenderer projectId={params.projectId} pathSlug={slug} />;
}
