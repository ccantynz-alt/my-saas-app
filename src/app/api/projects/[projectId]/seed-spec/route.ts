// src/app/api/projects/[projectId]/seed-spec/route.ts
import { NextResponse } from "next/server";
import { saveSiteSpec } from "@/app/lib/projectSpecStore";

export const runtime = "nodejs";

type Ctx = { params: { projectId: string } };

export async function POST(_req: Request, ctx: Ctx) {
  try {
    const projectId = ctx?.params?.projectId;

    if (!projectId) {
      return NextResponse.json({ ok: false, error: "Missing projectId" }, { status: 400 });
    }

    const draftSpec = {
      title: "A modern website for your business",
      subtitle: "Clear, fast, and conversion-focused — generated from a draft spec.",
      features: [
        { title: "Clear value proposition", description: "Explain what you do in one sentence, then back it with benefits." },
        { title: "Trust-building sections", description: "Add proof, FAQs, and a strong CTA to reduce hesitation." },
        { title: "Fast and modern", description: "Clean layout, good spacing, and great mobile defaults." },
      ],
      faqs: [
        { question: "What is this?", answer: "This is a draft spec created for the project, ready to publish." },
        { question: "How do I update it?", answer: "Edit the draft spec in the builder (future), then republish." },
      ],
    };

    await saveSiteSpec(projectId, draftSpec);

    return NextResponse.json({
      ok: true,
      projectId,
      message: "Draft site spec created",
      source: "src/app/api/projects/[projectId]/seed-spec/route.ts",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "seed-spec failed" },
      { status: 500 }
    );
  }
}
