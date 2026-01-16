// src/app/p/[projectId]/page.tsx
import Link from "next/link";
import { loadPublishedSiteSpec } from "@/app/lib/publishedSpecStore";

type PageProps = {
  params: { projectId: string };
};

function asString(v: unknown): string | null {
  if (typeof v === "string") {
    const s = v.trim();
    return s ? s : null;
  }
  return null;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter(Boolean);
}

function safeGetSpec(published: any): any | null {
  if (!published) return null;
  // Some stores return { spec: {...}, publishedAtIso: ... }
  if (published && typeof published === "object" && published.spec) return published.spec;
  return published;
}

function getTitle(spec: any): string {
  return (
    asString(spec?.title) ||
    asString(spec?.siteTitle) ||
    asString(spec?.name) ||
    asString(spec?.hero?.title) ||
    "A modern website for your business"
  );
}

function getSubtitle(spec: any): string {
  return (
    asString(spec?.subtitle) ||
    asString(spec?.tagline) ||
    asString(spec?.hero?.subtitle) ||
    asString(spec?.hero?.tagline) ||
    "Fast to load, clear to understand, and built to convert — generated from a published spec."
  );
}

function getPrimaryCta(spec: any): { text: string; href: string } {
  const text = asString(spec?.cta?.text) || asString(spec?.hero?.ctaText) || "Get started";
  const href = asString(spec?.cta?.href) || "#get-started";
  return { text, href };
}

function getSecondaryCta(spec: any): { text: string; href: string } {
  const text = asString(spec?.hero?.secondaryCtaText) || "See features";
  const href = asString(spec?.hero?.secondaryCtaHref) || "#features";
  return { text, href };
}

function getFeatures(spec: any): Array<{ title: string; description: string }> {
  // Common shapes:
  // - features: [{ title, description }]
  // - features: ["Fast", "Secure"]
  // - sections: [{ type: "features", items: [...] }]
  const raw = spec?.features;

  if (Array.isArray(raw)) {
    if (raw.length && typeof raw[0] === "object") {
      const items = raw
        .map((f: any) => {
          const title = asString(f?.title) || asString(f?.name) || "";
          const description =
            asString(f?.description) ||
            asString(f?.detail) ||
            "A practical benefit that helps visitors take action.";
          return title ? { title, description } : null;
        })
        .filter(Boolean) as Array<{ title: string; description: string }>;

      if (items.length) return items;
    }

    const list = asStringArray(raw);
    if (list.length) {
      return list.slice(0, 6).map((t) => ({
        title: t,
        description: "A practical benefit that helps visitors take action.",
      }));
    }
  }

  const sections = spec?.sections;
  if (Array.isArray(sections)) {
    const featuresSection = sections.find((s: any) => s?.type === "features" || s?.kind === "features");
    const items = featuresSection?.items || featuresSection?.features;
    if (Array.isArray(items)) {
      if (items.length && typeof items[0] === "object") {
        const mapped = items
          .map((f: any) => {
            const title = asString(f?.title) || asString(f?.name) || "";
            const description =
              asString(f?.description) ||
              asString(f?.detail) ||
              "A practical benefit that helps visitors take action.";
            return title ? { title, description } : null;
          })
          .filter(Boolean) as Array<{ title: string; description: string }>;
        if (mapped.length) return mapped;
      }

      const list = asStringArray(items);
      if (list.length) {
        return list.slice(0, 6).map((t) => ({
          title: t,
          description: "A practical benefit that helps visitors take action.",
        }));
      }
    }
  }

  // Fallback (looks good even if spec is minimal)
  return [
    { title: "Clear, conversion-first layout", description: "Hero, proof, benefits, and CTA are structured to reduce friction." },
    { title: "Fast to load, easy to scan", description: "Clean typography and spacing designed for modern browsing." },
    { title: "Built from a published spec", description: "Update your spec, republish, and the public page updates instantly." },
    { title: "SEO-friendly defaults", description: "Reasonable headings, sections, and readable content structure." },
    { title: "Works globally", description: "A simple public link you can share anywhere." },
    { title: "Ready for automation", description: "A foundation you can extend with forms, payments, and workflows." },
  ];
}

function getFaq(spec: any): Array<{ q: string; a: string }> {
  const raw = spec?.faq || spec?.faqs;
  if (Array.isArray(raw) && raw.length && typeof raw[0] === "object") {
    const items = raw
      .map((x: any) => {
        const q = asString(x?.q) || asString(x?.question) || "";
        const a = asString(x?.a) || asString(x?.answer) || "";
        return q && a ? { q, a } : null;
      })
      .filter(Boolean) as Array<{ q: string; a: string }>;
    if (items.length) return items.slice(0, 6);
  }

  return [
    { q: "Is this page live?", a: "Yes — this is the public page rendered from the published spec for this project." },
    { q: "What happens when I republish?", a: "The published spec updates, and this public URL will reflect the new content." },
    { q: "Can I add a contact form later?", a: "Yes. This is a clean foundation that can be extended with forms and automations." },
  ];
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm">
      {children}
    </span>
  );
}

export default async function PublicProjectPage({ params }: PageProps) {
  const projectId = params?.projectId;

  const published = await loadPublishedSiteSpec(projectId);
  const spec = safeGetSpec(published);

  if (!spec) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <Badge>Public page</Badge>
              <Link className="text-sm font-medium text-neutral-700 hover:text-neutral-900" href="/projects">
                Back to builder
              </Link>
            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight">This site isn’t published yet</h1>
            <p className="mt-3 text-neutral-600">
              The project exists, but it hasn’t been published. Go back to the builder and click Publish.
            </p>

            <div className="mt-8 rounded-2xl bg-neutral-50 p-4 text-xs text-neutral-600">
              <div className="font-mono">projectId: {projectId}</div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const title = getTitle(spec);
  const subtitle = getSubtitle(spec);
  const primary = getPrimaryCta(spec);
  const secondary = getSecondaryCta(spec);
  const features = getFeatures(spec);
  const faqs = getFaq(spec);

  const publishedAtIso =
    (published as any)?.publishedAtIso || (published as any)?.publishedAt || (spec as any)?.publishedAtIso || null;

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Top bar */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-neutral-900" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">{title}</div>
              <div className="text-xs text-neutral-500 font-mono">{projectId}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {publishedAtIso ? <Badge>published {String(publishedAtIso)}</Badge> : <Badge>published</Badge>}
            <Link className="text-sm font-medium text-neutral-700 hover:text-neutral-900" href="/projects">
              Back to builder
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-14">
        <div className="rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap gap-2">
                <Badge>Fast</Badge>
                <Badge>Clear</Badge>
                <Badge>Conversion-ready</Badge>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                {title}
              </h1>

              <p className="mt-4 text-lg text-neutral-600">
                {subtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={primary.href}
                  className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                  {primary.text}
                </a>
                <a
                  href={secondary.href}
                  className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                >
                  {secondary.text}
                </a>
              </div>

              <p className="mt-3 text-xs text-neutral-500">
                Public page rendered from the <span className="font-mono">published spec</span>. Republish to update.
              </p>
            </div>

            {/* Simple “preview card” */}
            <div className="w-full max-w-md">
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                <div className="text-sm font-semibold">What you get</div>
                <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-neutral-900" />
                    <span>Public URL you can share instantly</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-neutral-900" />
                    <span>Structured sections that guide action</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-neutral-900" />
                    <span>Clean design that looks premium by default</span>
                  </li>
                </ul>

                <div className="mt-6 rounded-2xl bg-white p-4 text-xs text-neutral-500">
                  Tip: wire the builder “Publish” button next to “Preview” to make this fully self-serve.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-4 rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm md:grid-cols-3">
          <div className="rounded-2xl bg-neutral-50 p-6">
            <div className="text-2xl font-semibold">Instant</div>
            <div className="mt-1 text-sm text-neutral-600">Publish → public URL in seconds.</div>
          </div>
          <div className="rounded-2xl bg-neutral-50 p-6">
            <div className="text-2xl font-semibold">Clear</div>
            <div className="mt-1 text-sm text-neutral-600">A layout designed to reduce confusion.</div>
          </div>
          <div className="rounded-2xl bg-neutral-50 p-6">
            <div className="text-2xl font-semibold">Flexible</div>
            <div className="mt-1 text-sm text-neutral-600">Update the spec anytime and republish.</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Features that move visitors forward</h2>
            <p className="mt-2 text-neutral-600">Built to be simple, fast, and conversion-friendly.</p>
          </div>
          <a href="#get-started" className="hidden text-sm font-semibold text-neutral-800 hover:text-neutral-900 md:inline">
            Jump to CTA →
          </a>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.slice(0, 6).map((f, idx) => (
            <div key={`${f.title}-${idx}`} className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
              <div className="text-base font-semibold">{f.title}</div>
              <p className="mt-2 text-sm text-neutral-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-neutral-50 p-7">
              <div className="text-sm font-semibold">1) Draft</div>
              <p className="mt-2 text-sm text-neutral-600">Create or generate a draft spec in the builder.</p>
            </div>
            <div className="rounded-3xl bg-neutral-50 p-7">
              <div className="text-sm font-semibold">2) Publish</div>
              <p className="mt-2 text-sm text-neutral-600">Publish writes a “published spec” and returns a public URL.</p>
            </div>
            <div className="rounded-3xl bg-neutral-50 p-7">
              <div className="text-sm font-semibold">3) Share</div>
              <p className="mt-2 text-sm text-neutral-600">Share the URL. Republish anytime to update content.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="mx-auto max-w-6xl px-6 pb-12">
        <div className="rounded-[32px] border border-neutral-200 bg-neutral-900 p-10 text-white shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight">Ready to publish your site?</h2>
              <p className="mt-2 text-white/80">
                Go back to the builder, update your spec, and publish again. This page will update from the published spec.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
              >
                Open builder
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15"
              >
                View features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {faqs.slice(0, 6).map((item, idx) => (
              <div key={`${item.q}-${idx}`} className="rounded-3xl bg-neutral-50 p-7">
                <div className="text-sm font-semibold">{item.q}</div>
                <p className="mt-2 text-sm text-neutral-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-neutral-600">
            Powered by <span className="font-semibold text-neutral-900">my-saas-app</span>
          </div>
          <div className="flex gap-4 text-sm">
            <a className="text-neutral-600 hover:text-neutral-900" href="#features">
              Features
            </a>
            <a className="text-neutral-600 hover:text-neutral-900" href="#faq">
              FAQ
            </a>
            <a className="text-neutral-600 hover:text-neutral-900" href="#get-started">
              Get started
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
