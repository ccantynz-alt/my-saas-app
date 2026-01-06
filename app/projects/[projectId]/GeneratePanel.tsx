"use client";

import { useMemo, useState } from "react";

type GeneratePanelProps = {
  projectId: string;
};

type Stage =
  | "idle"
  | "generating"
  | "saving"
  | "publishing"
  | "done"
  | "error";

export default function GeneratePanel({ projectId }: GeneratePanelProps) {
  const [prompt, setPrompt] = useState(
    "Create a professional business website with hero, services, testimonials, about, and contact. Clean modern styling."
  );
  const [stage, setStage] = useState<Stage>("idle");
  const [message, setMessage] = useState<string>("");
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [ notice, setNotice ] = useState<string | null>(null);

  const disabled = stage === "generating" || stage === "saving" || stage === "publishing";

  const stageLabel = useMemo(() => {
    if (stage === "idle") return "Ready";
    if (stage === "generating") return "Generating (OpenAI)…";
    if (stage === "saving") return "Saving version…";
    if (stage === "publishing") return "Publishing…";
    if (stage === "done") return "Done";
    if (stage === "error") return "Error";
    return "Working…";
  }, [stage]);

  async function runGenerate() {
    if (disabled) return;

    setNotice(null);
    setPublicUrl(null);
    setMessage("");
    setStage("generating");

    try {
      // 1) Generate
      const genRes = await fetch(`/api/projects/${projectId}/generate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const genText = await genRes.text();
      let genData: any = null;
      try { genData = JSON.parse(genText); } catch {}

      if (!genRes.ok || !genData?.ok) {
        throw new Error(genData?.error || `Generate failed (${genRes.status})`);
      }

      // Some implementations return html directly; some save internally.
      // We'll handle both by using /publish to ensure html exists.
      setStage("saving");
      setMessage("Generated. Saving & publishing…");

      // 2) Publish (this should ensure HTML exists and sets latest key)
      setStage("publishing");

      const pubRes = await fetch(`/api/projects/${projectId}/publish`, {
        method: "POST",
      });

      const pubText = await pubRes.text();
      let pubData: any = null;
      try { pubData = JSON.parse(pubText); } catch {}

      if (!pubRes.ok || !pubData?.ok) {
        throw new Error(pubData?.error || `Publish failed (${pubRes.status})`);
      }

      const url = pubData?.publicUrl
        ? pubData.publicUrl
        : `/p/${projectId}`;

      setPublicUrl(url);
      setStage("done");
      setMessage("Published successfully.");
      setNotice("Tip: open the public page in a new tab to confirm it renders.");
    } catch (e: any) {
      setStage("error");
      setMessage(e?.message || "Something went wrong");
    }
  }

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        background: "white",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900 }}>Generate & Publish</div>
          <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: "#6b7280" }}>
            Status: {stageLabel}
          </div>
        </div>

        <button
          onClick={runGenerate}
          disabled={disabled}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #111827",
            background: disabled ? "#9ca3af" : "#111827",
            color: "white",
            fontWeight: 900,
            cursor: disabled ? "not-allowed" : "pointer",
            minWidth: 160,
          }}
        >
          {disabled ? "Working…" : "Generate & Publish"}
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>
          Prompt
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          disabled={disabled}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #d1d5db",
            fontSize: 14,
            outline: "none",
            resize: "vertical",
          }}
        />
      </div>

      {message ? (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: stage === "error" ? "#fef2f2" : "#f9fafb",
            color: stage === "error" ? "#991b1b" : "#111827",
            fontWeight: 800,
            fontSize: 13,
            whiteSpace: "pre-wrap",
          }}
        >
          {message}
        </div>
      ) : null}

      {publicUrl ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 6 }}>
            Public page
          </div>
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#16a34a", fontWeight: 900 }}
          >
            Open public page →
          </a>
          <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>
            {publicUrl}
          </div>
        </div>
      ) : null}

      {notice ? (
        <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280", fontWeight: 700 }}>
          {notice}
        </div>
      ) : null}
    </div>
  );
}
