import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * TEMP STUB:
 * This endpoint depended on missing libs (demoAuth, kv) and alias imports.
 * We'll wire real "use template" logic later.
 */
export async function POST(
  _req: Request,
  { params }: { params: { templateId: string } }
) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(
    {
      ok: false,
      status: "not_implemented",
      templateId: params.templateId,
      message: "Use template not implemented yet.",
    },
    { status: 501 }
  );
}
