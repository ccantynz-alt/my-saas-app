export const runtime = "nodejs";

type PageProps = {
  params: { projectId: string };
};

export default function PublishedProjectPage({ params }: PageProps) {
  return (
    <main style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1>Published Site ✅</h1>
      <p>Project: {params.projectId}</p>
      <p>If you can see this, the redirect loop is fixed.</p>
    </main>
  );
}
