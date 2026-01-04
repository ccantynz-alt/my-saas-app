import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * TEMP STUB:
 * This endpoint depended on missing internal lib (domainsKV) and alias imports.
 */
export async function GET(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    ok: true,
    status: "stub",
    projectId: params.projectId,
    domains: [],
  });
}

export async function POST(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(
    {
      ok: false,
      status: "not_implemented",
      projectId: params.projectId,
      message: "Domains API not implemented yet.",
    },
    { status: 501 }
  );
}
