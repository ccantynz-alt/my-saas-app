import PublishButton from "./PublishButton";

async function publishProjectAction(projectId: string) {
  const res = await fetch(`/api/projects/${projectId}/publish`, {
    method: "POST",
    headers: { "content-type": "application/json" },
  });

  // IMPORTANT: read text first so we don't crash if the server returns HTML
  const text = await res.text();

  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    // If HTML comes back, surface a useful error
    throw new Error(
      `Expected JSON but received non-JSON response.\nStatus: ${res.status}\nFirst 200 chars:\n${text.slice(
        0,
        200
      )}`
    );
  }

  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || `Publish failed (HTTP ${res.status})`);
  }

  return data;
}

export default function Page() {
  // Replace this with the real projectId for the page you're testing.
  // If you don't know it yet, leave it as-is and just ensure the build passes first.
  const projectId = "proj_REPLACE_ME";

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ margin: 0 }}>Publish Test</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        This page tests publishing a project via the API route.
      </p>

      <div style={{ marginTop: 12 }}>
        <PublishButton action={publishProjectAction} projectId={projectId} />
      </div>

      <p style={{ marginTop: 12, fontSize: 12, opacity: 0.75 }}>
        Note: If you see an error about HTML/DOCTYPE, it means the API returned an
        HTML page (often a redirect/auth page or 404), not JSON.
      </p>
    </main>
  );
}
