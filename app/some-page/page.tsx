"use client";

import { useState } from "react";
import PublishButton from "./PublishButton";

async function publishProject(projectId: string) {
  const res = await fetch(`/api/projects/${projectId}/publish`, {
    method: "POST",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || `Publish failed (${res.status})`);
  }
  return data;
}

export default function Page() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [msg, setMsg] = useState<string>("");

  // TODO: replace with your real project id source (route param, state, etc.)
  const projectId = "REPLACE_ME";

  return (
    <main style={{ padding: 24 }}>
      <h1>Publish</h1>

      <div style={{ marginTop: 12 }}>
        <PublishButton
          disabled={isPublishing}
          onClick={async () => {
            try {
              setIsPublishing(true);
              setMsg("Publishing...");
              await publishProject(projectId);
              setMsg("Published ✅");
            } catch (e: any) {
              setMsg(e?.message || "Publish failed");
            } finally {
              setIsPublishing(false);
            }
          }}
        />
      </div>

      <p style={{ marginTop: 12 }}>{msg}</p>
    </main>
  );
}
