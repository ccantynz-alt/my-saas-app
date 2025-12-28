"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AnyProject = {
  id?: string;
  projectId?: string;
  name?: string;
  createdAt?: string;
};

export default function DashboardRedirectPage() {
  const router = useRouter();
  const [debug, setDebug] = useState<string>("Starting…");

  useEffect(() => {
    let cancelled = false;

    async function go() {
      try {
        setDebug("Fetching /api/projects …");
        const res = await fetch("/api/projects", { cache: "no-store" });
        const json = await res.json().catch(() => null);

        if (cancelled) return;

        if (!res.ok || !json?.ok) {
          setDebug(`API error: ${json?.error || res.statusText || "Unknown error"}`);
          router.replace("/dashboard?empty=1");
          return;
        }

        const projects: AnyProject[] = Array.isArray(json.projects) ? json.projects : [];

        if (projects.length === 0) {
          setDebug("No projects found → going to create screen.");
          router.replace("/dashboard?empty=1");
          return;
        }

        const first = projects[0];
        const pid = first.id || first.projectId;

        if (!pid) {
          setDebug("Projects returned, but no id/projectId field found → create screen.");
          router.replace("/dashboard?empty=1");
          return;
        }

        setDebug(`Redirecting to /dashboard/projects/${pid} …`);
        router.replace(`/dashboard/projects/${pid}`);
      } catch (e: any) {
        if (cancelled) return;
        setDebug(`Fetch failed: ${e?.message || String(e)} → create screen.`);
        router.replace("/dashboard?empty=1");
      }
    }

    go();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
        Redirecting to your project…
      </div>

      <div style={{ opacity: 0.7, marginBottom: 16 }}>
        {debug}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #444",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Try again
        </button>

        <Link href="/dashboard?empty=1" style={{ alignSelf: "center", textDecoration: "underline" }}>
          Create / open dashboard
        </Link>
      </div>
    </div>
  );
}
