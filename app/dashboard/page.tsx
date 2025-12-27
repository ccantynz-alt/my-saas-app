export const dynamic = "force-dynamic";

import Link from "next/link";

type Project = {
  id: string;
  name: string;
  createdAt?: string;
};

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/projects`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    const projects = data?.projects ?? data?.items ?? [];
    return Array.isArray(projects) ? projects : [];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const projects = await getProjects();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="rounded-md border p-4 space-y-3">
        <h2 className="font-medium">Projects</h2>

        {projects.length === 0 ? (
          <p className="text-sm opacity-80">No projects yet.</p>
        ) : (
          <ul className="space-y-2">
            {projects.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs opacity-70">{p.id}</div>
                </div>
                <Link
                  className="underline text-sm"
                  href={`/dashboard/projects/${p.id}`}
                >
                  Open
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-sm opacity-80">
        <Link href="/" className="underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}
