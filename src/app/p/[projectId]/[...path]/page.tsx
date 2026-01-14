mkdir -p src/app/p/[projectId]/[...path] 2>/dev/null || true

cat > src/app/p/[projectId]/[...path]/page.tsx <<'EOF'
// src/app/p/[projectId]/[...path]/page.tsx

import type { Metadata } from "next";
import { getPublishedProject } from "@/app/lib/projectPublishStore";
import PublicRenderer from "../PublicRenderer";

function pathToSectionId(pathParts: string[] | undefined): string | null {
  const first = (pathParts?.[0] || "").toLowerCase();
  if (!first) return null;

  if (first === "features") return "features";
  if (first === "pricing") return "pricing";
  if (first === "faq") return "faq";
  if (first === "contact") return "contact";
  if (first === "testimonials") return "testimonials";
  if (first === "about") return "about";
  if (first === "cta") return "cta";

  // Unknown routes just show the page without scroll
  return null;
}

export async function generateMetadata(
  { params }: { params: { projectId: string; path?: string[] } }
): Promise<Metadata> {
  const published = await getPublishedProject(params.projectId);

  if (!published) {
    return {
      title: "Not published yet",
      description: "This site hasn’t been published yet.",
      robots: { index: false, follow: false },
    };
  }

  const hero = published.content.sections.find((s) => s.type === "hero");
  const baseTitle = (hero?.heading || "Published Site").slice(0, 60);
  const baseDescription = (hero?.subheading || "A published project page.").slice(0, 160);

  const sectionId = pathToSectionId(params.path);
  const suffix =
    sectionId ? ` — ${sectionId.charAt(0).toUpperCase()}${sectionId.slice(1)}` : "";

  return {
    title: `${baseTitle}${suffix}`.slice(0, 60),
    description: baseDescription,
    openGraph: {
      title: `${baseTitle}${suffix}`.slice(0, 60),
      description: baseDescription,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: { projectId: string; path?: string[] } }) {
  const published = await getPublishedProject(params.projectId);

  if (!published) {
    return (
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
          This site isn’t published yet
        </h1>
        <p style={{ opacity: 0.8, marginTop: 0 }}>
          The project exists, but it hasn’t been published. Go back to the builder and click Publish.
        </p>
        <a href="/projects" style={{ fontWeight: 900 }}>
          Back to Projects
        </a>
      </div>
    );
  }

  const sectionId = pathToSectionId(params.path);

  return (
    <PublicRenderer
      sections={published.content.sections || []}
      initialSectionId={sectionId}
    />
  );
}
EOF
