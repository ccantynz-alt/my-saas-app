import Link from "next/link";
import MarketingCTA from "@/src/components/marketing/MarketingCTA";
import { templates, useCases } from "@/src/lib/marketing/catalog";

export const metadata = {
  title: "Dominat8 — AI Website Automation Builder",
  description:
    "Generate, optimize, and publish high-converting websites with AI agents. Templates, use-cases, and instant launch.",
};

export default function MarketingHomePage() {
  const topTemplates = templates.slice(0, 6);
  const topUseCases = useCases.slice(0, 6);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Build, optimize, and publish websites with AI agents.
          </h1>
          <p className="text-base opacity-80 md:text-lg">
            Dominat8 generates a complete website, SEO plan, and conversion-optimized pages —
            then publishes to your custom domain.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-md bg-black px-5 py-3 text-white hover:opacity-90"
            >
              Start free
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center rounded-md border border-black/20 px-5 py-3 hover:bg-black/5"
            >
              Explore templates
            </Link>
          </div>

          <div className="pt-4 text-sm opacity-70">
            No-code friendly. Fast publishing. Built for growth.
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6 shadow-sm">
          <div className="text-sm font-medium opacity-70">What you get</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>• AI-generated multi-page site spec</li>
            <li>• SEO plan + sitemap + metadata</li>
            <li>• Conversion pass (pricing, FAQs, CTAs)</li>
            <li>• Publish to Vercel + custom domains</li>
          </ul>

          <div className="mt-6">
            <MarketingCTA />
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">Templates</h2>
          <Link href="/templates" className="text-sm opacity-70 hover:opacity-100">
            View all →
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topTemplates.map((t) => (
            <Link
              key={t.slug}
              href={`/templates/${t.slug}`}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm hover:bg-black/[0.02]"
            >
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="mt-2 text-sm opacity-70">{t.description}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">Use cases</h2>
          <Link href="/use-cases" className="text-sm opacity-70 hover:opacity-100">
            View all →
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topUseCases.map((u) => (
            <Link
              key={u.slug}
              href={`/use-cases/${u.slug}`}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm hover:bg-black/[0.02]"
            >
              <div className="text-sm font-semibold">{u.title}</div>
              <div className="mt-2 text-sm opacity-70">{u.summary}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-black/10 bg-black/[0.02] p-8">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-2xl font-semibold">Ready to launch?</h3>
            <p className="mt-2 text-sm opacity-80">
              Start free, generate your site, then upgrade when you’re ready to connect a domain.
            </p>
          </div>
          <div className="md:justify-self-end">
            <MarketingCTA />
          </div>
        </div>
      </section>
    </main>
  );
}