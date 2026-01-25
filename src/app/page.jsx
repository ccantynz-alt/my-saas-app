export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top glow */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl bg-white/10" />
        <div className="absolute top-24 left-1/2 h-[260px] w-[520px] -translate-x-1/2 rounded-full blur-3xl bg-white/5" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center">
            <span className="text-sm font-semibold tracking-wide">D8</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">Dominat8</div>
            <div className="text-xs text-white/60">AI website automation builder</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-white/75 md:flex">
          <a className="hover:text-white" href="/pricing">Pricing</a>
          <a className="hover:text-white" href="/templates">Templates</a>
          <a className="hover:text-white" href="/use-cases">Use cases</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/sign-in"
            className="rounded-xl px-4 py-2 text-sm text-white/80 hover:text-white"
          >
            Sign in
          </a>
          <a
            href="/p/new"
            className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-white/90"
          >
            Build my site
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-16">
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs text-white/70 ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              LIVE • Build gate enabled • Deploys only when green
              <span className="ml-2 text-white/40">HOME_JSX_OK</span>
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
              A website that ships itself.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
              Dominat8 generates a full, polished site from a brief — then runs the pipeline:
              pages, SEO, sitemap, publish — with controls and observability.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="/p/new"
                className="rounded-2xl bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-white/90"
              >
                Generate my site now
              </a>
              <a
                href="/preview/marketing"
                className="rounded-2xl bg-white/5 text-white px-6 py-3 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/10"
              >
                See the preview
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-sm font-semibold">Finish-for-me</div>
                <div className="mt-1 text-xs text-white/60">From brief → complete site</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-sm font-semibold">SEO V2</div>
                <div className="mt-1 text-xs text-white/60">Titles, metas, schema, sitemap</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-sm font-semibold">Publish</div>
                <div className="mt-1 text-xs text-white/60">KV → rendered HTML, fast</div>
              </div>
            </div>
          </div>

          {/* Showcase card */}
          <div className="md:col-span-5">
            <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
              <div className="text-xs text-white/60">Flagship status</div>
              <div className="mt-2 text-lg font-semibold">Green baseline restored</div>
              <div className="mt-3 text-sm text-white/70">
                This homepage is intentionally <strong>plain JSX</strong> to bypass TSX parser landmines.
                Once builds stay green, we can re-introduce TS safely.
              </div>

              <div className="mt-6 rounded-2xl bg-black/40 p-4 ring-1 ring-white/10">
                <div className="text-xs text-white/60">Next moves</div>
                <ul className="mt-2 space-y-2 text-sm text-white/75">
                  <li>• Polish UI (SiteGround-level layout rhythm)</li>
                  <li>• Add animated sections (subtle, not tacky)</li>
                  <li>• Lock CI build gate before every push</li>
                </ul>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  className="flex-1 rounded-2xl bg-white text-black px-4 py-3 text-center text-sm font-semibold hover:bg-white/90"
                  href="/p/new"
                >
                  Start
                </a>
                <a
                  className="flex-1 rounded-2xl bg-white/5 text-white px-4 py-3 text-center text-sm font-semibold ring-1 ring-white/10 hover:bg-white/10"
                  href="/pricing"
                >
                  Pricing
                </a>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-white/45">
              Domain: <span className="text-white/65">dominat8.com</span> • Vercel auto-deploy on push
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-10 text-xs text-white/40">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Dominat8</div>
          <div className="flex gap-4">
            <a className="hover:text-white/70" href="/faq">FAQ</a>
            <a className="hover:text-white/70" href="/contact">Contact</a>
            <a className="hover:text-white/70" href="/terms">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
