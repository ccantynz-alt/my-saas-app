export default function AgentsPage({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Agents
      </h1>

      <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
        Project ID: <code>{params.projectId}</code>
      </p>

      <p style={{ lineHeight: 1.6 }}>
        This is a placeholder page to prove routing works at:
        <br />
        <code>/projects/[projectId]/agents</code>
      </p>
    </main>
  );
}
