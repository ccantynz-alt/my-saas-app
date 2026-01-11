import { kv } from "@vercel/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isKvConfigured() {
  const env = process.env as any;
  return Boolean(env.KV_REST_API_URL || env.VERCEL_KV_REST_API_URL || env.KV_URL || env.VERCEL_KV_URL);
}

function htmlKey(projectId: string) {
  return "generated:project:" + projectId + ":latest";
}

function publishedKey(projectId: string) {
  return "published:project:" + projectId;
}

function devStore() {
  const g = globalThis as any;
  g.__devHtml = g.__devHtml ?? new Map<string, string>();
  g.__devPublished = g.__devPublished ?? new Set<string>();
  return {
    html: g.__devHtml as Map<string, string>,
    published: g.__devPublished as Set<string>,
  };
}

export default async function PublicProjectPage({ params }: { params: { projectId: string } }) {
  const projectId = params?.projectId;
  if (!projectId) {
    return <div style={{ padding: 24, fontFamily: "system-ui" }}>Missing projectId</div>;
  }

  const pubKey = publishedKey(projectId);
  const hKey = htmlKey(projectId);

  let published = false;
  let html: string | null = null;

  if (isKvConfigured()) {
    published = Boolean(await kv.get(pubKey));
    html = (await kv.get(hKey)) as string | null;
  } else {
    const ds = devStore();
    published = ds.published.has(pubKey);
    html = ds.html.get(hKey) ?? null;
  }

  if (!published) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Not published</h1>
        <p style={{ marginTop: 8, color: "#666" }}>This project isnt published yet.</p>
      </div>
    );
  }

  if (!html) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>No content</h1>
        <p style={{ marginTop: 8, color: "#666" }}>This project is published, but no HTML was generated yet.</p>
      </div>
    );
  }

  // Render full HTML safely
  return (
    <iframe
      title={"project-" + projectId}
      srcDoc={html}
      style={{
        width: "100%",
        height: "100vh",
        border: "0",
        display: "block",
        background: "white",
      }}
      sandbox="allow-same-origin allow-forms allow-scripts allow-popups"
    />
  );
}