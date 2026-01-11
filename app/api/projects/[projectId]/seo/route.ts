import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  return NextResponse.json({
    ok: true,
    route: "seo",
    marker: "SEO-STUB-V2",
    projectId: params.projectId
  });
}
