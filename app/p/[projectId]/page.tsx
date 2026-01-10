import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";

export const runtime = "nodejs";

type PublishedMeta = {
  projectId: string;
  publishedAt: string;
  published: boolean;
};

function generatedProjectLatestKey(projectId: string) {
  return `generated:project:${projectId}:latest`;
}

function publishedKey(projectId: string) {
  return `published:project:${projectId}`;
}

export default async function PublishedProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;

  // Only show public page if published
  const meta = await kv.get<PublishedMeta>(publishedKey(projectId));
  if (!meta?.published) {
    notFound();
  }

  // Load last generated HTML
  const html = await kv.get<string>(generatedProjectLatestKey(projectId));
  if (!html) {
    notFound();
  }

  return (
    <html lang="en">
      <head />
      <body style={{ margin: 0 }}>
        <iframe
          title="Published site"
          style={{
            width: "100%",
            height: "100vh",
            border: "none",
            display: "block",
          }}
          sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
          srcDoc={html}
        />
      </body>
    </html>
  );
}
