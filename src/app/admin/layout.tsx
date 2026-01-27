import Link from "next/link";

export const metadata = {
  title: "Dominat8 Admin",
  description: "Dominat8 admin console.",
};

export const dynamic = "force-dynamic";

function NavLink(props: { href: string; label: string; hint?: string }) {
  return (
    <Link
      href={props.href}
      className="group rounded-xl px-3 py-2 transition hover:bg-white/5 border border-transparent"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{props.label}</div>
        <div className="text-[10px] text-white/40 group-hover:text-white/60">{props.hint || ""}</div>
      </div>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="absolute inset-0 pointer-events-none opacity-60 [background:radial-gradient(1200px_circle_at_15%_10%,rgba(168,85,247,0.22),transparent_45%),radial-gradient(900px_circle_at_85%_20%,rgba(59,130,246,0.18),transparent_50%),radial-gradient(900px_circle_at_50%_80%,rgba(245,158,11,0.10),transparent_55%)]" />

      <div className="relative flex">
        {/* ✅ Always visible sidebar (mobile included) */}
        <aside className="w-[280px] flex flex-col gap-4 border-r border-white/10 bg-black/30">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold tracking-wide text-white/80">Dominat8</div>
                <div className="text-xs text-white/50">Admin Console</div>
              </div>
              <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] text-white/70">
                v1
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-[11px] font-semibold text-white/70">Quick actions</div>
              <div className="mt-2 flex flex-col gap-2">
                <Link href="/admin/projects" className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs hover:bg-white/5">
                  View Projects →
                </Link>
                <Link href="/admin/agents" className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs hover:bg-white/5">
                  Agents & Bundles →
                </Link>
              </div>
            </div>
          </div>

          <nav className="px-4 pb-6">
            <div className="mb-2 px-2 text-[11px] font-semibold tracking-wide text-white/50">NAVIGATION</div>
            <div className="flex flex-col gap-1">
              <NavLink href="/admin" label="Dashboard" hint="Overview" />
              <NavLink href="/admin/projects" label="Projects" hint="Your sites" />
              <NavLink href="/admin/agents" label="Agents" hint="Runs & Bundles" />
              <NavLink href="/admin/domains" label="Domains" hint="Custom domains" />
              <NavLink href="/admin/billing" label="Billing" hint="Plans & Stripe" />
              <NavLink href="/admin/settings" label="Settings" hint="Workspace" />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs font-semibold text-white/70">Status</div>
              <div className="mt-2 text-[11px] text-white/50">Forced layout is active.</div>
              <div className="mt-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                <span className="text-[11px] text-white/60">UI baseline: green</span>
              </div>
            </div>
          </nav>
        </aside>

        <main className="flex-1">
          <div className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
                  <span className="text-xs font-semibold">D8</span>
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-tight">Admin</div>
                  <div className="text-[11px] text-white/50">Ship sites faster. Keep it stable.</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
                  View Marketing →
                </Link>
                <Link href="/admin/settings" className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs hover:bg-white/5">
                  Settings
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>

          {/* ✅ BIG visible stamp so you can confirm the deploy instantly */}
          <div className="mx-auto max-w-6xl px-4 pb-10">
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-[11px] text-amber-100">
              BUILD_STAMP: ADMIN_LAYOUT_STAMP_20260127_190035
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}