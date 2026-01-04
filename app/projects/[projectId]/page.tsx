"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

type Project = { id: string; name: string; userId?: string; createdAt?: number };
type Run = {
  id: string;
  projectId: string;
  userId?: string;
  status: string;
  prompt?: string;
  createdAt?: number;
};

export default function ProjectPage({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();

  const projectId = useMemo(() => params.projectId, [params.projectId]);

  const [project, setProject] = useState<Project | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [prompt, setPrompt] = useState(
    "Create a professional business website with hero, services, testimonials, about, and contact. Clean modern styling."
  );
  const [creatingRun, setCreatingRun] = useState(false);
  const [executingRunId, setExecutingRunId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/runs`, { cache: "no-store" });

      if (res.status === 401) {
        router.push("/sign-in");
        return;
      }

      if (res.status === 403) {
        // ✅ This means the project exists but does NOT belong to this user
        router.push("/projects");
        return;
      }

      const data = await res.json();

      if (!data?.ok) {
        setErr(data?.error || "Failed to load project.");
        setLoading(false);
        return;
      }

      setProject(data.project || null);
      setRuns(Array.isArray(data.runs) ? data.runs : []);
      setLoading(false);
    } catch (e: any) {
      setErr(e?.message || "Something went wrong.");
      setLoading(false);
    }
  }

  useEffect(() => {
    // Wait until Clerk is ready
    if (!isLoaded) return;

    // Not logged in -> go sign in
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    // Logged in -> load project + runs
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, userId, projectId]);

  async function createRun() {
    setCreatingRun(true);
    setErr(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (res.status === 401) {
        router.push("/sign-in");
        return;
      }

      if (res.status === 403) {
        router.push("/projects");
        return;
      }

      const data = await res.json();

      if (!data?.ok) {
        setErr(data?.error || "Failed to create run.");
        setCreatingRun(false);
        return;
      }

      // Refresh
      await load();
      setCreatingRun(false);
    } catch (e: any) {
      setErr(e?.message || "Failed to create run.");
      setCreatingRun(false);
    }
  }

  async function executeRun(runId: string) {
    setExecutingRunId(runId);
    setErr(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/runs/${runId}/execute`, {
        method: "POST",
      });

      if (res.status === 401) {
        router.push("/sign-in");
        return;
      }

      if (res.status === 403) {
        router.push("/projects");
        return;
      }

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setErr(data?.error || "Failed to execute run.");
        setExecutingRunId(null);
        return;
      }

      await load();
      setExecutingRunId(null);
    } catch (e: any) {
      setErr(e?.message || "Failed to execute run.");
      setExecutingRunId(null);
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28 }}>Project</h1>
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            {project ? (
              <>
                <div><b>Name:</b> {project.name}</div>
                <div style={{ fontSize: 12, marginTop: 4, opacity: 0.75 }}>
                  <b>ID:</b> {project.id}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, opacity: 0.75 }}>{loading ? "Loading..." : "No project loaded"}</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/projects" style={{ textDecoration: "underline" }}>Back to Projects</Link>
          <Link href="/latest-run" style={{ textDecoration: "underline" }}>Latest Run</Link>
          <Link href="/latest-generated" style={{ textDecoration: "underline" }}>Latest Generated</Link>
        </div>
      </div>

      <hr style={{ margin: "18px 0" }} />

      {err && (
        <div style={{ background: "#ffe9e9", border: "1px solid #ffbcbc", padding: 12, borderRadius: 8 }}>
          <b>Error:</b> {err}
        </div>
      )}

      <section style={{ marginTop: 16 }}>
        <h2 style={{ margin: "0 0 10px 0" }}>Create a Run</h2>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button
            onClick={createRun}
            disabled={creatingRun || !prompt.trim()}
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #111", cursor: "pointer" }}
          >
            {creatingRun ? "Creating..." : "Create Run"}
          </button>

          <button
            onClick={load}
            disabled={loading}
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer" }}
          >
            Refresh
          </button>
        </div>
      </section>

      <section style={{ marginTop: 22 }}>
        <h2 style={{ margin: "0 0 10px 0" }}>Run History</h2>

        {loading ? (
          <div>Loading...</div>
        ) : runs.length === 0 ? (
          <div>No runs yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {runs.map((r) => (
              <div key={r.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div><b>Run:</b> {r.id}</div>
                    <div style={{ opacity: 0.8 }}><b>Status:</b> {r.status}</div>
                    {r.prompt ? (
                      <div style={{ marginTop: 6, opacity: 0.9 }}>
                        <b>Prompt:</b> {r.prompt}
                      </div>
                    ) : null}
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <Link href={`/generated/${r.id}`} style={{ textDecoration: "underline" }}>
                      View Generated
                    </Link>

                    <button
                      onClick={() => executeRun(r.id)}
                      disabled={executingRunId === r.id}
                      style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #111", cursor: "pointer" }}
                    >
                      {executingRunId === r.id ? "Executing..." : "Execute"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
