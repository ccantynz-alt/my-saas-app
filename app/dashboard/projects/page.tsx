// app/dashboard/projects/page.tsx
import { headers } from "next/headers";
import Link from "next/link";

type Project = {
  id: string;
  name: string;
  createdAt?: string;
};

function getBaseUrl() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) throw new Error("Unable to determine host for server fetch");
  return `${proto}://${host}`;
}

export default async function ProjectsIndexPage() {
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/projects`, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load projects: ${text}`);
  }

  const data = await res.json();
  const projects: Project[] = data.projects ?? [];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Projects</h1>
        <Link href="/dashboard" style={{ textDecoration: "underline" }}>
          Back to dashboard
        </Link>
      </div>

      <div style={{ marginTop: 16 }}>
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <ul>
            {projects.map(p => (
              <li key={p.id}>
                <Link href={`/dashboard/projects/${p.id}`}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
