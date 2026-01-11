import { getProjectHtml } from "@/app/lib/publishStore";

export const runtime = "nodejs";

export default function PublishedPage({
  params,
}: {
  params: { projectId: string };
}) {
  const html = getProjectHtml(params.projectId);

  if (!html) {
    return (
      <main style={{ padding: 32, fontFamily: "system-ui" }}>
        <h1>Not published</h1>
        <p>This project has no published HTML yet.</p>
      </main>
    );
  }

  return (
    <iframe
      title="Published Site"
      style={{
        width: "100vw",
        height: "100vh",
        border: "none",
        display: "block",
      }}
      srcDoc={html}
    />
  );
}
