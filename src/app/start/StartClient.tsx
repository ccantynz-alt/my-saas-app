"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export type StartOption = {
  slug: string;
  title: string;
  description: string;
  tag?: string;
};

type Props = {
  useCases: StartOption[];
  templates: StartOption[];
};

export default function StartClient({ useCases, templates }: Props) {
  const router = useRouter();
  const search = useSearchParams();

  const preUseCase = search.get("useCase") || "";
  const preTemplate = search.get("template") || "";

  const [useCase, setUseCase] = useState(preUseCase);
  const [template, setTemplate] = useState(preTemplate);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chosenUseCase = useMemo(
    () => useCases.find((u) => u.slug === useCase) || null,
    [useCase, useCases]
  );

  const chosenTemplate = useMemo(
    () => templates.find((t) => t.slug === template) || null,
    [template, templates]
  );

  async function onCreate() {
    setError(null);
    setBusy(true);

    try {
      // ✅ Keep backend-safe: do NOT change payload shape.
      // We encode choices in name for now (until templateId mapping is implemented).
      const nameParts = ["New Project"];
      if (chosenUseCase) nameParts.push(`(${chosenUseCase.title})`);
      if (chosenTemplate) nameParts.push(`- ${chosenTemplate.title}`);
      const name = nameParts.join(" ");

      const res = await fetch("/api/projects/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, templateId: null }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (data && (data.error || data.message)) ||
          `Failed to create project (HTTP ${res.status})`;
        throw new Error(msg);
      }

      const projectId = data?.projectId;
      if (!projectId) throw new Error("Project created but projectId missing in response.");

      router.push(`/projects/${projectId}`);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight">Start a project</h1>
          <p className="max-w-2xl text-base text-gray-600">
            Pick a use case and template. We’ll create your project and drop you into the builder.
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Back to home
            </Link>
            <Link
              href="/use-cases"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Use cases
            </Link>
            <Link
              href="/templates"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Templates
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">1) Choose a use case</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {useCases.map((u) => (
                <button
                  key={u.slug}
                  type="button"
                  onClick={() => setUseCase(u.slug)}
                  className={[
                    "rounded-2xl border p-4 text-left",
                    useCase === u.slug ? "border-black" : "border-gray-200",
                    "hover:bg-gray-50",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold">{u.title}</div>
                    {u.tag ? (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                        {u.tag}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{u.description}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">2) Choose a template</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {templates.map((t) => (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => setTemplate(t.slug)}
                  className={[
                    "rounded-2xl border p-4 text-left",
                    template === t.slug ? "border-black" : "border-gray-200",
                    "hover:bg-gray-50",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold">{t.title}</div>
                    {t.tag ? (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                        {t.tag}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{t.description}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-semibold">Summary</h3>

          <div className="mt-2 text-sm text-gray-600">
            Use case:{" "}
            <span className="font-medium text-gray-900">
              {chosenUseCase?.title || "Not selected"}
            </span>
            <br />
            Template:{" "}
            <span className="font-medium text-gray-900">
              {chosenTemplate?.title || "Not selected"}
            </span>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
              <div className="mt-2 text-xs text-red-700">
                If this says 401 Unauthorized, you’re not signed in — sign in and try again.
              </div>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCreate}
              disabled={busy}
              className={[
                "rounded-xl bg-black px-5 py-3 text-sm text-white",
                busy ? "opacity-60" : "hover:opacity-90",
              ].join(" ")}
            >
              {busy ? "Creating..." : "Create project and open builder"}
            </button>

            <Link
              href="/projects"
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm hover:bg-gray-50"
            >
              Go to dashboard
            </Link>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Uses <code>/api/projects/register</code> then redirects to{" "}
            <code>/projects/[projectId]</code>.
          </div>
        </div>
      </div>
    </main>
  );
}
