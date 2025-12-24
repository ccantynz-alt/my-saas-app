// app/runs/page.tsx
import Link from "next/link";

async function getRuns() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/runs`, {
    cache: "no-store",
  }).catch(() => null);

  if (!res) return [];
  const data = await res.json();
  return data.runs ?? [];
}

export default async function RunsPage() {
  const runs = await getRuns();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Runs</h1>
          <p className="text-sm text-neutral-600">
            Runs are “tasks” the platform executes (agent actions, builds, imports, etc.).
          </p>
        </div>
        <Link className="rounded-xl border px-3 py-2 text-sm" href="/projects">
          ← Back to projects
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border p-4 shadow-sm">
        <div className="grid gap-2">
          {runs.length === 0 ? (
            <div className="text-sm text-neutral-600">No runs yet.</div>
          ) : (
            runs.map((r: any) => (
              <div key={r.id} className="rounded-xl border px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="mt-1 text-xs text-neutral-500">
                      Project:{" "}
                      <Link className="hover:underline" href={`/projects/${r.projectId}`}>
                        {r.projectId}
                      </Link>
                    </div>
                  </div>
                  <div className="text-xs text-neutral-700">{r.status}</div>
                </div>
                <div className="mt-1 text-xs text-neutral-500">{r.id}</div>
                <div className="mt-1 text-xs text-neutral-500">
                  Created: {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
