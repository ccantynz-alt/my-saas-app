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

// Allow GET so you can test in a browser (and it won't 405)
export async function GET(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  return NextResponse.json(payload(params.projectId));
}

// Allow POST for the agent button
export async function POST(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  return NextResponse.json(payload(params.projectId));
}
