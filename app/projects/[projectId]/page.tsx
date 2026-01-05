// app/p/[projectId]/page.tsx
import { kv } from "@vercel/kv";

export default async function PublishedPage({ params }: { params: { projectId: string } }) {
  const html = await kv.get<string>(`published:${params.projectId}:latest`);

  if (!html) {
    return (
      <main style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h1>Not published</h1>
        <p>This project has no published site yet.</p>
      </main>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
