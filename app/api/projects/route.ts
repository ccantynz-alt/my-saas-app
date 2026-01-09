import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    // ─────────────────────────────────────────────
    // AUTH
    // ─────────────────────────────────────────────
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const name = body?.name || "New Website";

    // ─────────────────────────────────────────────
    // CREATE PROJECT
    // ─────────────────────────────────────────────
    const projectId = `proj_${nanoid(24)}`;

    const project = {
      id: projectId,
      name,
      ownerId: userId,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`project:${projectId}`, project);

    await kv.sadd("projects:index", projectId);
    await kv.sadd(`user:${userId}:projects`, projectId);

    // ─────────────────────────────────────────────
    // AUTO-SCAFFOLD HTML (CRITICAL)
    // ─────────────────────────────────────────────
    const scaffoldHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${name}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 0;
      background: #f9fafb;
      color: #111827;
    }
    header {
      background: #2563eb;
      color: white;
      padding: 3rem 1.5rem;
      text-align: center;
    }
    section {
      padding: 3rem 1.5rem;
      max-width: 900px;
      margin: auto;
    }
    h2 {
      margin-top: 0;
    }
    .card {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
      margin-bottom: 1.5rem;
    }
    footer {
      background: #111827;
      color: white;
      text-align: center;
      padding: 2rem 1rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>${name}</h1>
    <p>Your website is ready to be customised</p>
  </header>

  <section>
    <div class="card">
      <h2>Next steps</h2>
      <p>
        This is a starter site. You can:
      </p>
      <ul>
        <li>Generate a site with AI</li>
        <li>Import an existing website</li>
        <li>Replace this content at any time</li>
      </ul>
    </div>

    <div class="card">
      <h2>About</h2>
      <p>
        Replace this section with your real content.
      </p>
    </div>

    <div class="card">
      <h2>Contact</h2>
      <p>
        Email: you@example.com
      </p>
    </div>
  </section>

  <footer>
    <p>Powered by your AI Website Builder</p>
  </footer>
</body>
</html>`;

    const projectHtmlKey = `generated:project:${projectId}:latest`;

    await kv.set(projectHtmlKey, scaffoldHtml);
    await kv.set("generated:latest", scaffoldHtml);

    // ─────────────────────────────────────────────
    // RESPONSE
    // ─────────────────────────────────────────────
    return NextResponse.json({
      ok: true,
      project,
      scaffolded: true,
    });
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );
  }
}
