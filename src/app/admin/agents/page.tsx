import Link from "next/link";

export default function AdminAgents() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold tracking-wide text-white/60">AGENTS</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Agents & Bundles</h1>
        <p className="mt-2 text-sm text-white/60">
          Strict bundle mode: small tasks, runnable PowerShell, fast iteration.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
          <div className="text-sm font-semibold">Run a strict beauty bundle</div>
          <div className="mt-2 text-sm text-white/60">
            Use the bundle UI you already have, or call <span className="text-white/80">/api/agents/bundle/run</span>.
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/admin" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
              Back to dashboard →
            </Link>
            <Link href="/" className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs hover:bg-white/5">
              View marketing →
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
          <div className="text-sm font-semibold">What “finished” looks like here</div>
          <ul className="mt-3 space-y-2 text-sm text-white/60 list-disc pl-5">
            <li>Run history list (last 10 runs)</li>
            <li>Last bundle patch download button</li>
            <li>Per-agent status rows</li>
            <li>Clear “Apply patch” instructions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}