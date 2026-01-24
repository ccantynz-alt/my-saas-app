export const runtime = "nodejs";

export default function HomePage() {
  return (
    <main data-x-home-ok="HOME_OK" className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl border border-black/10 p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-sm opacity-80">
            <span className="font-semibold">CSS: ON</span>
            <span className="opacity-60">|</span>
            <span>HOME_OK</span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight">
            A website that looks premium — generated in minutes
          </h1>

          <p className="mt-4 max-w-2xl text-lg opacity-80">
            Dominat8 builds a clean, fast, multi-page website from your brief, then publishes it.
            This page exists to prove that <code>/</code> is NOT routing to <code>/_not-found</code>.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-black/10 p-4">
              <div className="text-sm font-semibold">Routing truth</div>
              <div className="mt-1 text-sm opacity-75">If you can see HOME_OK, / is real.</div>
            </div>
            <div className="rounded-xl border border-black/10 p-4">
              <div className="text-sm font-semibold">Next step</div>
              <div className="mt-1 text-sm opacity-75">Swap this content for the marketing hero.</div>
            </div>
            <div className="rounded-xl border border-black/10 p-4">
              <div className="text-sm font-semibold">Safe editing</div>
              <div className="mt-1 text-sm opacity-75">Only write TSX via scripts (no BOM).</div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="/pricing"
              className="rounded-xl bg-black px-5 py-3 text-white shadow-sm hover:opacity-90"
            >
              View Pricing
            </a>
            <a
              href="/templates"
              className="rounded-xl border border-black/10 px-5 py-3 hover:bg-black/5"
            >
              Browse Templates
            </a>
          </div>

          <div className="mt-10 text-xs opacity-60">
            Marker: <span className="font-mono">HOME_OK</span> · Attribute:{" "}
            <span className="font-mono">data-x-home-ok</span>
          </div>
        </div>
      </div>
    </main>
  );
}