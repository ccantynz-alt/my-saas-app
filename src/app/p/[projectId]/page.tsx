export const runtime = "nodejs";

import { PublishedTemplate, type PublishedSpec } from "../_components/PublishedTemplate";
import { readPublishedSpec } from "../_lib/readPublishedSpec";

type PageProps = {
  params: { projectId: string };
};

const BUILD_TAG = "published-spec-v1";

export default async function PublishedProjectPage({ params }: PageProps) {
  const projectId = params.projectId;

  const { value } = await readPublishedSpec(projectId);

  // Map whatever you have into our template shape (best-effort).
  const spec: PublishedSpec | null = value
    ? {
        brand: { name: value.brandName || value.brand?.name, tagline: value.tagline || value.brand?.tagline },
        hero: {
          headline: value.hero?.headline || value.headline,
          subheadline: value.hero?.subheadline || value.subheadline,
          primaryCta: value.hero?.primaryCta || "Open Builder",
          secondaryCta: value.hero?.secondaryCta || "Refresh",
        },
        features: Array.isArray(value.features) ? value.features : undefined,
        pricing: value.pricing,
      }
    : null;

  return <PublishedTemplate projectId={projectId} spec={spec} buildTag={BUILD_TAG} />;
}
