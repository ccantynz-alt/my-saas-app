import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

type Params = { projectId: string };

export default async function PublicProjectPage(props: {
  params: Promise<Params>;
}) {
  const { projectId } = await props.params;

  if (!projectId || !projectId.startsWith("proj_")) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Invalid project</h1>
      </main>
    );
  }

  const project = await kv.hgetall<any>(`project:${projectId}`);

  if (!project) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Not found</h1>
        <p>This project does not exist.</p>
      </main>
    );
  }

  if (project.publishedStatus !== "published") {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Not published</h1>
        <p>This project isn’t published yet.</p>
      </main>
    );
  }

  const htmlKey = `generated:project:${projectId}:latest`;
  const html = await kv.get<string>(htmlKey);

  if (!html || typeof html !== "string") {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Published, but no HTML found</h1>
        <p>Expected HTML at:</p>
        <pre>{htmlKey}</pre>
      </main>
    );
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  );
}
