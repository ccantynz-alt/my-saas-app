import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

function extractText(output: any): string {
  // Responses API returns an array of output items; we want the final text
  // This is defensive because formats can vary by model/features.
  if (!output) return "";

  // Common: output_text exists on the response
  if (typeof output.output_text === "string") return output.output_text;

  // Otherwise try to stitch together text parts
  const items = Array.isArray(output.output) ? output.output : [];
  let acc = "";
  for (const item of items) {
    const content = item?.content;
    if (Array.isArray(content)) {
      for (const c of content) {
        if (typeof c?.text === "string") acc += c.text;
        if (typeof c?.content === "string") acc += c.content;
      }
    }
  }
  return acc;
}

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.projectId;
    if (!projectId || !projectId.startsWith("proj_")) {
      return NextResponse.json({ ok: false, error: "Invalid projectId" }, { status: 400 });
    }

    const project = await kv.hgetall<any>(`project:${projectId}`);
    if (!project) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }
    if (project.userId !== userId) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const prompt =
      typeof body?.prompt === "string" && body.prompt.trim()
        ? body.prompt.trim()
        : "Create a professional business website with hero, services, testimonials, about, and contact. Clean modern styling.";

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Missing OPENAI_API_KEY env var" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Responses API (recommended newer interface). :contentReference[oaicite:2]{index=2}
    const response = await client.responses.create({
      model: "gpt-4.1", // strong for HTML/site generation :contentReference[oaicite:3]{index=3}
      input: [
        {
          role: "system",
          content:
            "You generate a single, complete HTML document. " +
            "Return ONLY HTML (no markdown). " +
            "Include inline CSS in <style>. " +
            "Make it modern, responsive, and professional. " +
            "Include sections: hero, services, testimonials, about, contact. " +
            "No external assets required.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const html = extractText(response)?.trim();

    if (!html || html.length < 200 || !html.toLowerCase().includes("<html")) {
      return NextResponse.json(
        {
          ok: false,
          error: "Model did not return valid HTML",
          preview: html?.slice(0, 500) || "",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      projectId,
      html,
      // usage may exist depending on response; we return it if present
      usage: (response as any).usage || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Generate failed" },
      { status: 500 }
    );
  }
}
