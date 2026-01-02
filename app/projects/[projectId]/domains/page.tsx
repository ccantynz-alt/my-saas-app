"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ProjectDomain = {
  id: string;
  projectId: string;
  domain: string;
  status: "pending_dns" | "verifying" | "verified" | "ssl_active" | "error";
  createdAt: string;
  lastCheckedAt?: string;
  notes?: string;
  dnsInstructions: {
    type: "apex" | "subdomain";
    records: Array<{ type: "A" | "CNAME" | "TXT"; name: string; value: string }>;
  };
};

export default function ProjectDomainsPage({ params }: { params: { projectId: string } }) {
  const projectId = params.projectId;

  const [domainInput, setDomainInput] = useState("");
  const [domains, setDomains] = useState<ProjectDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const apiBase = useMemo(() => `/api/projects/${projectId}/domains`, [projectId]);

  async function refresh() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(apiBase, { cache: "no-store" });
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "Failed to load domains");
      setDomains(data.domains || []);
    } catch (e: any) {
      setErr(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function addDomain() {
    setErr(null);
    setBusy("add");
    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domain: domainInput }),
      });
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "Failed to add domain");
      setDomains(data.domains || []);
      setDomainInput("");
    } catch (e: any) {
      setErr(e?.message || "Failed");
    } finally {
      setBusy(null);
    }
  }

  async function removeDomain(domainId: string) {
    setErr(null);
    setBusy(domainId);
    try {
      const res = await fetch(apiBase, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domainId }),
      });
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "Failed to remove domain");
      setDomains(data.domains || []);
    } catch (e: any) {
      setErr(e?.message || "Failed");
    } finally {
      setBusy(null);
    }
  }

  async function checkStatus(domainId: string) {
    setErr(null);
    setBusy(`check:${domainId}`);
    try {
      const res = await fetch(`/api/projects/${projectId}/domains/check`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domainId }),
      });
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "Failed to check");
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed");
    } finally {
      setBusy(null);
    }
  }

  function badge(status: ProjectDomain["status"]) {
    const label =
      status === "pending_dns"
        ? "Pending DNS"
        : status === "verifying"
        ? "Verifying"
        : status === "verified"
        ? "Verified"
        : status === "ssl_active"
        ? "SSL Active"
        : "Error";

    return (
      <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs">
        {label}
      </span>
    );
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <main className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Domains & SSL</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a custom domain, follow DNS instructions, then check status.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/projects/${projectId}`}
            className="rounded-md border px-4 py-2 hover:bg-muted transition"
          >
            Back to Project
          </Link>
          <button
            onClick={refresh}
            className="rounded-md border px-4 py-2 hover:bg-muted transition"
            disabled={loading || busy !== null}
          >
            Refresh
          </button>
        </div>
      </div>

      {err ? (
        <div className="rounded-lg border p-4 text-sm">
          <div className="font-semibold">Error</div>
          <div className="text-muted-foreground mt-1">{err}</div>
        </div>
      ) : null}

      <section className="rounded-lg border p-4 space-y-3">
        <h2 className="text-xl font-semibold">Add a domain</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder="e.g. www.example.com"
            className="border rounded-md px-3 py-2 w-full md:w-96"
          />
          <button
            onClick={addDomain}
            disabled={!domainInput.trim() || busy !== null}
            className="rounded-md border px-4 py-2 hover:bg-muted transition"
          >
            {busy === "add" ? "Adding..." : "Add Domain"}
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Tip: If you use an apex domain (like example.com), you usually need an A record.
          If you use a subdomain (like www.example.com), you usually need a CNAME.
        </p>
      </section>

      <section className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-semibold">Your domains</h2>
          <div className="text-sm text-muted-foreground">
            Project: <span className="font-mono">{projectId}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : domains.length === 0 ? (
          <div className="text-sm text-muted-foreground">No domains yet.</div>
        ) : (
          <div className="space-y-4">
            {domains.map((d) => (
              <div key={d.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="font-semibold">{d.domain}</div>
                    {badge(d.status)}
                    {d.lastCheckedAt ? (
                      <div className="text-xs text-muted-foreground">
                        last checked: {new Date(d.lastCheckedAt).toLocaleString()}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => checkStatus(d.id)}
                      className="rounded-md border px-3 py-2 hover:bg-muted transition text-sm"
                      disabled={busy !== null}
                    >
                      {busy === `check:${d.id}` ? "Checking..." : "Check status"}
                    </button>
                    <button
                      onClick={() => removeDomain(d.id)}
                      className="rounded-md border px-3 py-2 hover:bg-muted transition text-sm"
                      disabled={busy !== null}
                    >
                      {busy === d.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="font-semibold mb-2">DNS instructions</div>
                  <div className="rounded-md border p-3 bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-2">
                      Type: {d.dnsInstructions.type.toUpperCase()}
                    </div>
                    <ul className="text-sm space-y-1">
                      {d.dnsInstructions.records.map((r, i) => (
                        <li key={i} className="font-mono">
                          {r.type} {r.name} → {r.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: This is a starter system. Later we’ll integrate real Vercel verification + SSL state.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border p-4 space-y-2">
        <h2 className="text-xl font-semibold">Need help?</h2>
        <p className="text-sm text-muted-foreground">
          If your domain isn’t working, submit a ticket and we’ll guide you step-by-step.
        </p>
        <Link
          href={`/support?projectId=${encodeURIComponent(projectId)}`}
          className="inline-block rounded-md border px-4 py-2 hover:bg-muted transition"
        >
          Open Support
        </Link>
      </section>
    </main>
  );
}
