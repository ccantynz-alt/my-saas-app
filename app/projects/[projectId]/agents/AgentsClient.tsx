"use client";

import { useMemo, useState } from "react";

type FinishForMeResponse = {
  ok: boolean;
  projectId: string;
  updatedAt?: string;
  pages?: string[];
  error?: string;
};

export default function AgentsClient({ projectId }: { projectId: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState<FinishForMeResponse | null>(null);
  const [raw, setRaw] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  const finishForMeUrl = useMemo(
    () => `/api/projects/${projectId}/agents/finish-for-me`,
    [projectId]
  );

  const publicBase = useMemo(() => `/p/${projectId}`, [projectId]);

  async function runFinishForMe() {
    setIsRunning(true);
    setData(null);
    setRaw("");
    setErrorText("");

    try {
      const r = await fetch(finishForMeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const text = await r.text();

      if (!r.ok) {
        setErrorText(`HTTP ${r.status}\n\n${text}`);
        return;
      }

      setRaw(text);

      // Try parse JSON (your endpoint returns JSON)
      try {
        const parsed = JSON.parse(text) as FinishForMeResponse;
        setData(parsed);
      } catch {
        // leave raw
      }
    } catch (err: any) {
      setErrorText(err?.message ? String(err.message) : String(err));
    } finally {
      setIsRunning(false);
    }
  }

  const pages = data?.pages ?? [];

  return (
    <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Agents</h1>
        <p style={{ marginTop: 8, marginBottom: 0, opacity: 0.85 }}>
          Project ID: <code>{projectId}</code>
        </p>
      </div>

      <section
        style={{
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 0 }}>
          Available Agents
        </h2>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={runFinishForMe}
            disabled={isRunning}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.18)",
              background: isRunning ? "rgba(0,0,0,0.06)" : "white",
              cursor: isRunning ? "not-allowed" : "pointer",
              fontWeight: 700,
            }}
            title={finishForMeUrl}
          >
            {isRunning ? "Running…" : "Run Finish-for-me"}
          </button>

          <button
            disabled
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.18)",
              background: "rgba(0,0,0,0.04)",
              cursor: "not-allowed",
              fontWeight: 700,
              opacity: 0.7,
            }}
            title="Coming soon"
          >
            Run Audit (soon)
          </button>

          <button
            disabled
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.18)",
              background: "rgba(0,0,0,0.04)",
              cursor: "not-allowed",
              fontWeight: 700,
              opacity: 0.7,
            }}
            title="Coming soon"
          >
            Run SEO (soon)
          </button>
        </div>

        <div style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
          Endpoint used: <code>{finishForMeUrl}</code>
        </div>
      </section>

      <section
        style={{
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 0 }}>
          Results
        </h2>

        {errorText ? (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              margin: 0,
              padding: 12,
              borderRadius: 10,
              border: "1px solid rgba(255,0,0,0.25)",
              background: "rgba(255,0,0,0.04)",
              overflowX: "auto",
            }}
          >
            {errorText}
          </pre>
        ) : data?.ok ? (
          <div>
            <div style={{ marginBottom: 10, opacity: 0.85 }}>
              Updated:{" "}
              <code>{data.updatedAt ? data.updatedAt : "(unknown)"}</code>
            </div>

            <div style={{ marginBottom: 10 }}>
              Pages to generate / ensure:
            </div>

            <ul style={{ marginTop: 0, paddingLeft: 18, lineHeight: 1.9 }}>
              {pages.map((slug) => {
                const label = slug === "" ? "Home" : slug;
                const href = slug === "" ? publicBase : `${publicBase}/${slug}`;
                return (
                  <li key={slug || "__home__"}>
                    <strong>{label}</strong>{" "}
                    <a href={href} target="_blank" rel="noreferrer">
                      Open
                    </a>{" "}
                    <span style={{ opacity: 0.65 }}>
                      (<code>{href}</code>)
                    </span>
                  </li>
                );
              })}
            </ul>

            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: "pointer" }}>Raw response</summary>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  margin: 0,
                  marginTop: 8,
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(0,0,0,0.03)",
                  overflowX: "auto",
                }}
              >
                {raw || ""}
              </pre>
            </details>
          </div>
        ) : raw ? (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              margin: 0,
              padding: 12,
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(0,0,0,0.03)",
              overflowX: "auto",
            }}
          >
            {raw}
          </pre>
        ) : (
          <p style={{ margin: 0, opacity: 0.75 }}>
            Run an agent to see results here.
          </p>
        )}
      </section>
    </main>
  );
}
