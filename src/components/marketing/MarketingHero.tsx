import Link from "next/link";

export default function MarketingHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-black/10 bg-white">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-black/5 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/5 blur-3xl" />

      <div className="relative px-6 py-14 sm:px-10 sm:py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs backdrop-blur">
          <span className="font-semibold">Dominat8</span>
          <span className="opacity-50">•</span>
          <span className="opacity-80">AI Website Automation Builder</span>
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          A website that looks premium — generated in minutes
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed opacity-80">
          Turn a brief into a clean, fast, multi-page site. Then publish it.
          No messy templates. No endless tweaks. Just a sharp launch.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/templates"
            className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            Start from a template
          </Link>

          <Link
            href="/use-cases"
            className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
          >
            See use cases
          </Link>

          <Link
            href="/pricing"
            className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
          >
            Pricing
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-sm font-semibold">Premium-by-default</div>
            <div className="mt-1 text-sm opacity-75">
              Clean spacing, sharp type, and sections that convert.
            </div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-sm font-semibold">Agents take over</div>
            <div className="mt-1 text-sm opacity-75">
              Generate pages, SEO, sitemap, then publish.
            </div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-sm font-semibold">Launch fast</div>
            <div className="mt-1 text-sm opacity-75">
              From idea → live site without the usual hassle.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}