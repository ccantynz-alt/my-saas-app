import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
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

    const { projectId } = params;

    // ─────────────────────────────────────────────
    // LOAD PROJECT
    // ─────────────────────────────────────────────
    const projectKey = `project:${projectId}`;
    const project = await kv.get<any>(projectKey);

    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // ✅ FIX: projects use ownerId (NOT userId)
    if (project.ownerId !== userId) {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // ─────────────────────────────────────────────
    // READ HTML BODY
    // ─────────────────────────────────────────────
    const body = await req.json();
    const html = body?.html?.trim();

    if (!html || typeof html !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing HTML" },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────────
    // SAVE HTML (PROJECT + FALLBACK)
    // ─────────────────────────────────────────────
    const projectHtmlKey = `generated:project:${projectId}:latest`;

    await kv.set(projectHtmlKey, html);
    await kv.set("generated:latest", html);

    // ─────────────────────────────────────────────
    // RESPONSE
    // ─────────────────────────────────────────────
    return NextResponse.json({
      ok: true,
      projectId,
      saved: [
        projectHtmlKey,
        "generated:latest",
      ],
    });
  } catch (err) {
    console.error("HTML IMPORT ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );
  }
}
