"use client";

import { useMemo, useState } from "react";

type Props = {
  projectId: string;
};

export default function AgentsClient({ projectId }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  const finishForMeUrl = useMemo(
    () => `/api/projects/${projectId}/agents/finish-for-me`,
    [projectId]
  );

  async function runFinishForMe() {
    setIsRunning(true);
    setLastAction("Finish-for-me");
    setResultText("");
    setErrorText("");

    try {
      const r = await fetch(finishForMeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Keep body minimal/safe until we confirm what your API expects.
        body: JSON.stringify({}),
      });

      const contentType = r.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      const payload = isJson ? await r.json() : await r.text();

      if (!r.ok) {
        setErrorText(
          `HTTP ${r.status}\n\n${
            typeof payload === "string" ? payload : JSON.stringify(payload, null, 2)
          }`
        );
        return;
      }

      setResultText(
        typeof payload === "string" ? payload : JSON.stringify(payload, null, 2)
      );
    } catch (err: any) {
      setErrorText(err?.message ? String(err.message) : String(err));
    } finally {
      setIsRunning(false);
    }
  }

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
            {isRunning && lastAction === "Finish-for-me"
              ? "Running…"
              : "Run Finish-for-me"}
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
          Output
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
        ) : resultText ? (
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
            {resultText}
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
