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

    const nowIso = new Date().toISOString();

    // Must satisfy SiteSpec type used by saveSiteSpec().
    const draftSpec = {
      version: 1,
      brandName: "My Business",
      createdAtIso: nowIso,

      // Minimal page model so rendering/publish has a stable structure.
      pages: [
        {
          slug: "/",
          title: "Home",
          sections: [
            {
              type: "hero",
              title: "A modern website for your business",
              subtitle: "Clear, fast, and conversion-focused — generated from a draft spec.",
              primaryCtaText: "Get started",
              primaryCtaHref: "#get-started",
              secondaryCtaText: "See features",
              secondaryCtaHref: "#features",
            },
            {
              type: "features",
              items: [
                {
                  title: "Clear value proposition",
                  description: "Explain what you do in one sentence, then back it with benefits.",
                },
                {
                  title: "Trust-building sections",
                  description: "Add proof, FAQs, and a strong CTA to reduce hesitation.",
                },
                {
                  title: "Fast and modern",
                  description: "Clean layout, good spacing, and great mobile defaults.",
                },
              ],
            },
            {
              type: "faq",
              items: [
                {
                  question: "What is this?",
                  answer: "This is a draft spec created for the project, ready to publish.",
                },
                {
                  question: "How do I update it?",
                  answer: "You can update the draft spec in the builder (next step), then republish.",
                },
              ],
            },
            {
              type: "cta",
              title: "Ready to publish your site?",
              subtitle: "Go back to the builder, update your spec, and publish again.",
              primaryCtaText: "Open builder",
              primaryCtaHref: "/projects",
            },
          ],
        },
      ],

      // Convenience fields (optional if SiteSpec allows extra keys)
      title: "A modern website for your business",
      subtitle: "Clear, fast, and conversion-focused — generated from a draft spec.",
      features: [
        { title: "Clear value proposition", description: "Explain what you do in one sentence, then back it with benefits." },
        { title: "Trust-building sections", description: "Add proof, FAQs, and a strong CTA to reduce hesitation." },
        { title: "Fast and modern", description: "Clean layout, good spacing, and great mobile defaults." },
      ],
      faqs: [
        { question: "What is this?", answer: "This is a draft spec created for the project, ready to publish." },
        { question: "How do I update it?", answer: "You can update the draft spec in the builder (next step), then republish." },
      ],
    } as any;

    await saveSiteSpec(projectId, draftSpec);

    return NextResponse.json(
      {
        ok: true,
        projectId,
        message: "Draft site spec created",
        source: "src/app/api/projects/[projectId]/seed-spec/route.ts",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "seed-spec failed" },
      { status: 500 }
    );
  }
}
