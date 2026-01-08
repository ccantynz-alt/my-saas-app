'use client';

import React, { useEffect, useState } from 'react';

type Project = {
  id: string;
  userId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
};

function formatDate(ts: number) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return '';
  }
}

function Card(props: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white shadow-sm ${props.className ?? ''}`}>
      {props.children}
    </div>
  );
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  const variant = props.variant ?? 'primary';
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';
  const styles =
    variant === 'primary'
      ? 'bg-black text-white hover:bg-neutral-800'
      : 'bg-white text-black border border-neutral-300 hover:bg-neutral-50';
  return (
    <button {...props} className={`${base} ${styles} ${props.className ?? ''}`}>
      {props.children}
    </button>
  );
}

export default function ProjectDetailsPage({ params }: { params: { projectId: string } }) {
  const projectId = params?.projectId;

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(projectId)}`, { method: 'GET' });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Project not found or you do not have access.`);
      }

      setProject(data.project as Project);
    } catch (e: any) {
      setProject(null);
      setError(e?.message || 'Project not found or you do not have access.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Project</h1>
            <p className="mt-1 text-sm text-neutral-600">Project ID: {projectId}</p>
          </div>

          <a
            href="/projects"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-50"
          >
            Back to Projects
          </a>
        </div>

        <div className="mt-6">
          {loading ? (
            <Card>
              <div className="p-6">
                <div className="h-6 w-56 animate-pulse rounded-lg bg-neutral-200" />
                <div className="mt-3 h-4 w-80 animate-pulse rounded-lg bg-neutral-200" />
                <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-neutral-200" />
              </div>
            </Card>
          ) : error ? (
            <Card>
              <div className="p-6">
                <div className="text-lg font-semibold text-neutral-900">Error</div>
                <div className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">{error}</div>

                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" onClick={load}>
                    Try again
                  </Button>
                  <a
                    href="/projects"
                    className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                  >
                    Back to Projects
                  </a>
                </div>
              </div>
            </Card>
          ) : project ? (
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <div className="p-6">
                  <div className="text-sm font-semibold text-neutral-700">Name</div>
                  <div className="mt-1 text-xl font-semibold text-neutral-900">{project.name}</div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-semibold text-neutral-700">Created</div>
                      <div className="mt-1 text-sm text-neutral-900">{formatDate(project.createdAt) || '—'}</div>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-xs font-semibold text-neutral-700">Updated</div>
                      <div className="mt-1 text-sm text-neutral-900">{formatDate(project.updatedAt) || '—'}</div>
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-neutral-600">
                    Next product step (later): show generated HTML, versions, and publish status here.
                  </div>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
