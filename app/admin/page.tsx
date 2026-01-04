import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdminUserId } from "@/lib/admin";

type Project = {
  id: string;
  name: string;
  userId: string;
  createdAt: number;
};

async function getAdminProjects(): Promise<Project[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/admin/projects`, {
    // Ensure server fetch isn't cached
    cache: "no-store",
  }).catch(() => null);

  if (!res) return [];
  const data = await res.json().catch(() => null);
  if (!data?.ok || !Array.isArray(data.projects)) return [];
  return data.projects as Project[];
}

export default async function AdminPage() {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");
  if (!isAdminUserId(userId)) redirect("/projects");

  // ✅ IMPORTANT:
  // If NEXT_PUBLIC_APP_URL is not set, we’ll call the API relative instead.
  // (Works on Vercel runtime)
  let projects: Project[] = [];
  try {
    const res = await fetch(`/api/admin/projects`, { cache: "no-store" });
    const data = await res.json();
    projects = data?.ok ? data.projects : [];
  } catch {
    projects = [];
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28 }}>Admin</h1>
          <div style={{ opacity: 0.75, marginTop: 6 }}>All projects across all users</div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/projects" style={{ textDecoration: "underline" }}>Projects</Link>
          <Link href="/templates" style={{ textDecoration: "underline" }}>Templates</Link>
          <Link href="/latest-run" style={{ textDecoration: "underline" }}>Latest Run</Link>
        </div>
      </div>

      <hr style={{ margin: "18px 0" }} />

      {projects.length === 0 ? (
        <div style={{ opacity: 0.8 }}>No projects found yet (or no admin access).</div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {projects.map((p) => (
            <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 16 }}>
                    <b>{p.name}</b>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
                    <div><b>Project ID:</b> {p.id}</div>
                    <div><b>Owner userId:</b> {p.userId}</div>
                    <div><b>Created:</b> {p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <Link href={`/projects/${p.id}`} style={{ textDecoration: "underline" }}>
                    Open Project
                  </Link>
                  <Link href={`/projects/${p.id}`} style={{ textDecoration: "underline" }}>
                    Runs
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: "18px 0" }} />

      <div style={{ fontSize: 12, opacity: 0.75 }}>
        <b>Note:</b> To make yourself admin, add your Clerk userId to <code>ADMIN_USER_IDS</code> in Vercel env vars.
      </div>
    </div>
  );
}
