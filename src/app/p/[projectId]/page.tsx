// src/app/p/[projectId]/page.tsx
import Link from "next/link";
import { loadPublishedSiteSpec } from "@/app/lib/publishedSpecStore";

type PageProps = {
  params: { projectId: string };
};

function asString(v: unknown): string | null {
  if (typeof v === "string" && v.trim()) return v.trim();
  return null;
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => (typeof x === "string" ? x.trim() : "")).filter(Boolean);
  return [];
}

function getTitle(spec: any): string {
  return (
    asString(spec?.title) ||
    asString(spec?.siteTitle) ||
    asString(spec?.name) ||
    asString(spec?.hero?.title) ||
    "Your AI Website"
  );
}

function getSubtitle(spec: any): string {
  return (
    asString(spec?.subtitle) ||
    asString(spec?.tagline) ||
    asString(spec?.hero?.subtitle) ||
    asString(spec?.hero?.tagline) ||
    "A simple, conversion-ready site generated from your published spec."
  );
}

function getCtaText(spec: any): string {
  return asString(spec?.cta?.text) || asString(spec?.hero?.ctaText) || "Get started";
}

function getFeatures(spec: any): Array<{ title: string; description?: string }> {
  // Common shapes we might see:
  // 1) { features: [{ title, description }] }
  // 2) { features: ["Fast", "Secure"] }
  // 3) { sections: [{ type:"features", items:[...] }] }
  const featuresRaw = spec?.features;

  if (Array.isArray(featuresRaw)) {
    if (featuresRaw.length && typeof featuresRaw[0] === "object") {
      return featuresRaw
        .map((f: any) => ({
          title: asString(f?.title) || asString(f?.name) || "",
          description: asString(f?.description) || asString(f?.detail) || undefined,
        }))
        .filter((f: any) => f.title);
    }
    const list = asStringArray(featuresRaw);
    return list.map((t) => ({ title: t }));
  }

  const sections = spec?.sections;
  if (Array.isArray(sections)) {
    const featuresSection = sections.find((s: any) => s?.type === "features" || s?.kind === "features");
    const items = featuresSection?.items || featuresSection?.features;
    if (Array.isArray(items)) {
      if (items.length && typeof items[0] === "object") {
        return items
          .map((f: any) => ({
            title: asString(f?.title) || asString(f?.name) || "",
            description: asString(f?.description) || asString(f?.detail) || undefined,
          }))
          .filter((f: any) => f.title);
      }
      const list = asStringArray(items);
      return list.map((t) => ({ title: t }));
    }
  }

  // Default fallback (so public pages look good even if spec is minimal)
  return [
    { title: "Fast, simple publishing", description: "Publish your site and share a public URL instantly." },
    { title: "Conversion-first layout", description: "Clear hero, benefits, and a clean structure out of the box." },
    { title: "Built for iteration", description: "Update the spec and republish whenever you’re ready." },
  ];
}

export default async function PublicProjectPage({ params }: PageProps) {
  const projectId = params?.projectId;

  const published = await loadPublishedSiteSpec(projectId);

  // Your store might return:
  // - null/undefined
  // - { spec: {...}, publishedAtIso: "..." }
  // - {...spec fields...}
  const spec = (published && (published as any).spec) ? (published as any).spec : published;

  if (!spec) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">This site isn’t published yet</h1>
          <p className="mt-3 text-neutral-600">
            The project exists, but it hasn’t been published. Go back to the builder and click Publish.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
            >
              Back to Projects
            </Link>
          </div>

          <div className="mt-8 rounded-xl bg-neutral-50 p-4 text-xs text-neutral-600">
            <div className="font-mono">projectId: {projectId}</div>
          </div>
        </div>
      </main>
    );
  }

  const title = getTitle(spec);
  const subtitle = getSubtitle(spec);
  const ctaText = getCtaText(spec);
  const features = getFeatures(spec);

  const publishedAtIso =
    (published as any)?.publishedAtIso ||
    (published as any)?.publishedAt ||
    (spec as any)?.publishedAtIso ||
    null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <header className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-neutral-500">
              <span className="font-mono">{projectId}</span>
              {publishedAtIso ? (
                <span className="ml-3 rounded-full bg-neutral-100 px-2 py-1 font-mono">
                  published: {String(publishedAtIso)}
                </span>
              ) : null}
            </div>

            <Link
              href="/projects"
              className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
            >
              Back to builder
            </Link>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="max-w-2xl text-lg text-neutral-600">{subtitle}</p>

          <div className="mt-2 flex flex-wrap gap-3">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              {ctaText}
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              See features
            </a>
          </div>
        </div>
      </header>

      <section id="features" className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Features</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, idx) => (
            <div
              key={`${f.title}-${idx}`}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="text-base font-semibold">{f.title}</div>
              {f.description ? (
                <p className="mt-2 text-sm text-neutral-600">{f.description}</p>
              ) : (
                <p className="mt-2 text-sm text-neutral-500">A key benefit of this site.</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="get-started" className="mt-10">
        <div className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">Ready to go?</h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
            This page is rendering directly from the <span className="font-mono">published spec</span>. Update the spec,
            republish, and this URL updates.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Go to builder
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              Back to features
            </a>
          </div>
        </div>
      </section>

      <footer className="mt-10 pb-8 text-center text-xs text-neutral-500">
        Powered by my-saas-app
      </footer>
    </main>
  );
}
