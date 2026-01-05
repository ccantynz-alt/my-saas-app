// app/p/[projectId]/page.tsx
import { kv } from "@vercel/kv";

export default async function PublishedSitePage({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;

  const project = (await kv.hgetall(`project:${projectId}`)) as any;
  const publishedKey = project?.publishedKey as string | undefined;

  if (!publishedKey) {
    return (
      <main style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Not published</h1>
        <p>This project has no published site yet.</p>
      </main>
    );
  }

  const html = (await kv.get(publishedKey)) as string | null;

  if (!html) {
    return (
      <main style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Not published</h1>
        <p>Published key exists, but no HTML was found.</p>
      </main>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} style={{ minHeight: "100vh" }} />;
}
