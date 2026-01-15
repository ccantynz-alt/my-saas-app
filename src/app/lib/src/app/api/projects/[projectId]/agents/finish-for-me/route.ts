import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function payload(projectId: string) {
  return {
    ok: true,
    projectId,
    updatedAt: new Date().toISOString(),
    pages: ["", "about", "pricing", "faq", "contact"],
  };
}

export async function GET(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  return NextResponse.json(payload(params.projectId));
}

export async function POST(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  return NextResponse.json(payload(params.projectId));
}
