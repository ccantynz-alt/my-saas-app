// src/app/api/projects/[projectId]/publish/route.ts
import { NextResponse } from "next/server";
import { publishSiteSpec } from "@/app/lib/publishedSpecStore";
import { loadSiteSpec } from "@/app/lib/projectSpecStore";

export const runtime = "nodejs";

type Ctx = { params: { projectId: string } };

export async function POST(_req: Request, ctx: Ctx) {
  try {
    const projectId = ctx?.params?.projectId;

    if (!projectId) {
      return NextResponse.json({ ok: false, error: "Missing projectId" }, { status: 400 });
    }

    const draft = await loadSiteSpec(projectId);
    if (!draft) {
      return NextResponse.json(
        { ok: false, error: "No draft spec found. Run seed-spec first." },
        { status: 404 }
      );
    }

    await publishSiteSpec(projectId, draft);

    return NextResponse.json({
      ok: true,
      projectId,
      publicUrl: `/p/${projectId}`,
      publishedAtIso: new Date().toISOString(),
      source: "src/app/api/projects/[projectId]/publish/route.ts",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Publish failed" },
      { status: 500 }
    );
  }
}
