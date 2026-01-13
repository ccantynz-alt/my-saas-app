import Link from "next/link";
import SeoLinks from "@/components/SeoLinks";

type TemplateCard = {
  title: string;
  description: string;
  href: string;
  tag: string;
};

const TEMPLATES: TemplateCard[] = [
  {
    title: "SaaS Landing Page",
    description:
      "Conversion-first layout with hero, benefits, social proof, pricing, and FAQs. Ideal for subscriptions.",
    href: "/projects",
    tag: "Most Popular",
  },
  {
    title: "Local Services",
    description:
      "Service pages, trust badges, coverage areas, and booking-ready CTAs. Built for fast lead capture.",
    href: "/projects",
    tag: "High Intent",
  },
  {
    title: "Ecommerce Starter",
    description:
      "Product highlights, collections, FAQs, and trust flow. Great for small catalogs and DTC brands.",
    href: "/projects",
    tag: "Retail",
  },
  {
    title: "Portfolio / Personal Brand",
    description:
      "Showcase work, testimonials, and contact flows. Clean design that feels premium.",
    href: "/projects",
    tag: "Creator",
  },
  {
    title: "Agency / Studio",
    description:
      "Case studies, services, process, and consultation CTA — without needing meetings.",
    href: "/projects",
    tag: "B2B",
  },
  {
    title: "Programmatic SEO Hub",
    description:
      "Indexable category + detail pages with consistent internal linking. Built for scale.",
    href: "/projects",
    tag: "SEO",
  },
];

export const metadata = {
  title: "Templates",
  description:
    "Browse high-converting website templates. Start from a proven layout and customize with AI.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight">
            Templates that start fast and convert
          </h1>
          <p className="text-base text-gray-600 max-w-2xl">
            Pick a layout designed for real-world outcomes: signups, sales, and
            SEO. Customize everything — or let AI generate the site for you.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Back to home
            </Link>
            <Link
              href="/use-cases"
              className="rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90"
            >
              Explore use-cases
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl border border-gray-200 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{t.title}</h2>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                  {t.tag}
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-600">{t.description}</p>

              <div className="mt-5 flex items-center gap-3">
                <Link
                  href={t.href}
                  className="rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90"
                >
                  Start with this
                </Link>
                <Link
                  href="/projects"
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Open builder
                </Link>
              </div>
            </div>
          ))}
        </div>

        <SeoLinks
          title="Related use-cases"
          links={[
            { href: "/use-cases/saas", label: "SaaS websites" },
            { href: "/use-cases/startups", label: "Startup websites" },
            { href: "/use-cases/local-services", label: "Local service websites" },
          ]}
        />

        <SeoLinks
          title="Learn more"
          links={[
            {
              href: "/guides/how-to-build-a-saas-website",
              label: "How to build a SaaS website",
            },
            {
              href: "/comparisons/ai-website-builder-vs-wix",
              label: "AI website builder vs Wix",
            },
          ]}
        />

        <div className="mt-14 rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold">Next: real template pages</h3>
          <p className="mt-2 text-sm text-gray-600">
            Once lunchtime MVP is shipped, we’ll split these into SEO routes like
            <span className="font-mono"> /templates/saas </span> and add
            internal linking + metadata for scale.
          </p>
        </div>
      </div>
    </main>
  );
}
