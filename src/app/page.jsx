export const dynamic = "force-dynamic";

import { BUILD_MARKER, MONSTER_MARKER } from "../lib/buildMarker";
import { TopBar, HeaderNav, Footer } from "../components/marketing/MarketingShell";

function Pill({ children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs text-slate-700 ring-1 ring-slate-200 shadow-sm d8-fade-up d8-delay-0">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {children}
    </div>
  );
}

function ProofTile({ title, desc }) {
  return (
    <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200 shadow-sm">
      <div className="text-xs font-semibold text-slate-700">✔ {title}</div>
      <div className="mt-1 text-xs text-slate-600">{desc}</div>
    </div>
  );
}

async function getGalleryFirstCard() {
  try {
    const base = process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "";
    const url = (base ? base : "") + "/api/gallery/list";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const cards = json && Array.isArray(json.cards) ? json.cards : [];
    return cards.length > 0 ? cards[0] : null;
  } catch {
    return null;
  }
}

function RealOutputCard({ card }) {
  const projectId = card && card.projectId ? String(card.projectId) : "";
  const title = card && card.title ? String(card.title) : "Real output example";
  const desc = card && card.desc ? String(card.desc) : "Generated from a brief, publish-ready.";
  const href = (card && card.url) ? String(card.url) : (projectId ? ("/p/" + projectId) : "/p/new");

  return (
    <div className="rounded-[2rem] bg-white/85 ring-1 ring-slate-200 shadow-sm overflow-hidden d8-fade-up d8-delay-4">
      <div className="px-6 py-4 border-b border-slate-200 bg-white/90">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
              D8
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-950">Real output</div>
              <div className="text-xs text-slate-500">
                From KV • Project <span className="font-mono">{projectId || "—"}</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">{MONSTER_MARKER}</div>
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-3xl bg-white ring-1 ring-slate-200 overflow-hidden">
          <div className="h-56 bg-white">
            {projectId ? (
              <img
                alt={title}
                className="h-full w-full object-cover"
                src={"/api/gallery/thumb?projectId=" + encodeURIComponent(projectId) + "&v=" + encodeURIComponent(MONSTER_MARKER)}
              />
            ) : (
              <div className="h-full w-full d8-thumb-bg" />
            )}
          </div>

          <div className="p-6">
            <div className="text-xs text-slate-500">Example</div>
            <div className="mt-2 text-xl font-semibold text-slate-950">{title}</div>
            <div className="mt-2 text-sm leading-relaxed text-slate-700">{desc}</div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 shadow-sm d8-btn-lift"
                href={href}
              >
                Open live example
              </a>
              <a
                className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 shadow-sm d8-btn-lift"
                href="/gallery"
              >
                Browse gallery
              </a>
            </div>

            <div className="mt-4 text-[11px] text-slate-500">
              This preview is generated from published KV data. Update the gallery index to change which example appears here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyOutputCard() {
  return (
    <div className="rounded-[2rem] bg-white/85 ring-1 ring-slate-200 shadow-sm overflow-hidden d8-fade-up d8-delay-4">
      <div className="px-6 py-4 border-b border-slate-200 bg-white/90">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
              D8
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-950">Real output</div>
              <div className="text-xs text-slate-500">Gallery index is empty</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">{MONSTER_MARKER}</div>
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-3xl bg-white ring-1 ring-slate-200 overflow-hidden">
          <div className="h-56 d8-thumb-bg" />
          <div className="p-6">
            <div className="text-xs text-slate-500">Next step</div>
            <div className="mt-2 text-xl font-semibold text-slate-950">Add a real project to the homepage</div>
            <div className="mt-2 text-sm leading-relaxed text-slate-700">
              Set <span className="font-mono">gallery:index:v1</span> with your published project IDs, then rebuild previews.
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 shadow-sm d8-btn-lift"
                href="/p/new"
              >
                Generate a project
              </a>
              <a
                className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 shadow-sm d8-btn-lift"
                href="/gallery"
              >
                Go to gallery
              </a>
            </div>

            <div className="mt-4 text-[11px] text-slate-500">
              Once your index is set, the hero will automatically show the first published example.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const first = await getGalleryFirstCard();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Premium bright background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_10%,rgba(59,130,246,0.16),transparent_55%),radial-gradient(900px_circle_at_80%_15%,rgba(16,185,129,0.14),transparent_55%),radial-gradient(700px_circle_at_50%_90%,rgba(99,102,241,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.74),rgba(255,255,255,1))]" />
      </div>

      <TopBar />
      <HeaderNav />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-6 pb-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <Pill>
              Premium, clean, fast — SiteGround-style build
              <span className="ml-2 font-mono text-slate-500">({BUILD_MARKER})</span>
            </Pill>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl d8-fade-up d8-delay-1">
              Build a website <br />
              that looks expensive. <br />
              Automatically.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-700 md:text-lg d8-fade-up d8-delay-2">
              Dominat8 generates a <span className="font-semibold text-slate-900">complete, production-ready website</span> from a brief —
              then runs pages, SEO, sitemap, and publish automatically (with controls you can trust).
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row d8-fade-up d8-delay-3">
              <a
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 shadow-sm d8-btn-lift"
                href="/p/new"
              >
                Generate my site
              </a>

              <a
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 shadow-sm d8-btn-lift"
                href="/gallery"
              >
                See real examples
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 d8-fade-up d8-delay-4">
              <ProofTile title="Publish-ready HTML" desc="Clean output, structured sections, consistent rhythm." />
              <ProofTile title="SEO included" desc="Titles, metas, schema, sitemap + robots." />
              <ProofTile title="Custom domain ready" desc="Publish + map when you’re ready." />
              <ProofTile title="No templates to fight" desc="Premium layout defaults that stay consistent." />
            </div>

            <div className="mt-6 text-[11px] text-slate-500 d8-fade-up d8-delay-4">
              Marker: <span className="font-mono text-slate-700">{MONSTER_MARKER}</span>
            </div>
          </div>

          {/* Keep your existing right-side trust card by delegating to MarketingShell's HeaderNav/TopBar/Footer.
              We do not rewrite that part here to avoid mismatches across your components.
              The "killer" proof is the Real Output block below. */}
          <div className="w-full max-w-md d8-fade-up d8-delay-2">
            <div className="rounded-3xl bg-white/85 p-6 ring-1 ring-slate-200 shadow-sm d8-card-float">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500">Trusted quality</div>
                  <div className="mt-2 text-lg font-semibold text-slate-950">
                    Premium output, every time
                  </div>
                </div>
                <div className="text-amber-500 text-sm" aria-label="5 stars">★★★★★</div>
              </div>

              <div className="mt-5 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <div className="text-xs font-semibold text-slate-600">What you get</div>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2"><span className="text-emerald-600">✓</span> Homepage + marketing pages</div>
                  <div className="flex items-center gap-2"><span className="text-emerald-600">✓</span> SEO plan + sitemap</div>
                  <div className="flex items-center gap-2"><span className="text-emerald-600">✓</span> Publish-ready HTML</div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 shadow-sm d8-btn-lift" href="/pricing">
                  View pricing
                </a>
                <a className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 shadow-sm d8-btn-lift" href="/__status">
                  Check status
                </a>
              </div>

              <div className="mt-4 text-[11px] text-slate-500">
                Build: <span className="font-mono text-slate-700">{BUILD_MARKER}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KILLER SECTION: REAL OUTPUT */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500">Proof</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              Real output, pulled from production
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              This isn’t a mock. It’s a published project rendered from your KV-backed gallery.
            </p>
          </div>
        </div>

        <div className="mt-6">
          {first ? <RealOutputCard card={first} /> : <EmptyOutputCard />}
        </div>
      </section>

      <Footer />
    </main>
  );
}
