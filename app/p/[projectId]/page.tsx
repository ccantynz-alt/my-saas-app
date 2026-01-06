import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: { projectId: string };
};

export default async function PublicProjectPage({ params }: Props) {
  const projectId = params.projectId;

  // Load project
  const project = await kv.hgetall<any>(`project:${projectId}`);
  if (!project) return notFound();

  // Must be published
  if (project.publishedStatus !== "published") {
    return (
      <main style={{ padding: 40, fontFamily: "sans-serif" }}>
        <h1>Not published</h1>
        <p>This project has not been published yet.</p>
      </main>
    );
  }

  // Load latest generated HTML
  const html = await kv.get<string>(
    `generated:project:${projectId}:latest`
  );

  if (!html) {
    return (
      <main style={{ padding: 40, fontFamily: "sans-serif" }}>
        <h1>Site not ready</h1>
        <p>The site is published but content is still generating.</p>
      </main>
    );
  }

  // Render raw HTML
  return (
    <html>
      <head>
        <title>{project.name || "Rovez Site"}</title>
      </head>
      <body dangerouslySetInnerHTML={{ __html: html }} />
    </html>
  );
}
