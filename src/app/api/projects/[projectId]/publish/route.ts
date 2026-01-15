import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { loadSiteSpec } from "@/app/lib/projectSpecStore";
import { publishSiteSpec } from "@/app/lib/publishedSpecStore";

type RouteParams = {
  params: {
    projectId: string;
  };
};

export async function POST(
  req: Request,
  { params }: RouteParams
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const projectId = params.projectId;

  const spec = await loadSiteSpec(projectId);
  if (!spec) {
    return NextResponse.json(
      { ok: false, error: "No site spec found to publish" },
      { status: 400 }
    );
  }

  await publishSiteSpec(projectId, spec);

  return NextResponse.json({
    ok: true,
    projectId,
    publicUrl: `/p/${projectId}`,
    publishedAtIso: new Date().toISOString(),
  });
}
