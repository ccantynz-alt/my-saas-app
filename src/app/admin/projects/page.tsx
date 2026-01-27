import Link from "next/link";

export default function AdminProjects() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold tracking-wide text-white/60">PROJECTS</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-2 text-sm text-white/60">
          This is the finished UI surface. Next step is wiring it to real KV-backed project keys.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
        <div className="text-sm font-semibold">No projects loaded yet</div>
        <div className="mt-2 text-sm text-white/60">
          Wire this page to your KV list endpoint (or add one). Keep the UI stable.
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/admin/agents" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
            Run a bundle →
          </Link>
          <Link href="/" className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs hover:bg-white/5">
            View marketing →
          </Link>
        </div>
      </div>
    </div>
  );
}