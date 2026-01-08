import { getPublishedHtml } from "@/lib/publishedStore";

export const dynamic = "force-dynamic";

export default async function PublicPage({ params }: { params: { projectId: string } }) {
  const record = getPublishedHtml(params.projectId);

  if (!record?.html) {
    return (
      <main style={{ padding: 32, fontFamily: "system-ui" }}>
        <h1>Not published</h1>
        <p>This project isn’t published yet (or no HTML exists).</p>
      </main>
    );
  }

  return (
    <main style={{ margin: 0, padding: 0 }}>
      <iframe
        title="site"
        srcDoc={record.html}
        style={{ width: "100%", height: "100vh", border: 0 }}
      />
    </main>
  );
}
