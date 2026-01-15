import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;

  // TEMP: stub response to prove POST works
  // We will replace this with real agent logic next
  return NextResponse.json({
    ok: true,
    agent: "finish-for-me",
    projectId,
    message: "Finish-for-me agent triggered successfully",
    timestamp: new Date().toISOString(),
  });
}
