import Link from "next/link";

export default function MarketingCTA() {
  return (
    <section className="mt-14 rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to ship your next homepage?
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed opacity-80">
            Start with templates, then let the pipeline do the heavy lifting.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/templates"
            className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            Browse templates
          </Link>
          <Link
            href="/pricing"
            className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
          >
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}