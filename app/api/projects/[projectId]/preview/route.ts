import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  _req: Request,
  ctx: { params: { projectId: string } }
) {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const projectId = ctx?.params?.projectId;

  if (!projectId) {
    return NextResponse.json(
      { ok: false, error: "Missing projectId" },
      { status: 400 }
    );
  }

  const primaryKey = `generated:project:${projectId}:latest`;
  const fallbackKey = "generated:latest";

  const primaryHtml = await kv.get<string>(primaryKey);

  if (typeof primaryHtml === "string" && primaryHtml.trim().length > 0) {
    return NextResponse.json(
      { ok: true, projectId, keyUsed: primaryKey, html: primaryHtml },
      { status: 200 }
    );
  }

  const fallbackHtml = await kv.get<string>(fallbackKey);

  if (typeof fallbackHtml === "string" && fallbackHtml.trim().length > 0) {
    return NextResponse.json(
      { ok: true, projectId, keyUsed: fallbackKey, html: fallbackHtml },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      ok: false,
      projectId,
      error: "No generated HTML found in KV",
      tried: [primaryKey, fallbackKey],
    },
    { status: 404 }
  );
}
