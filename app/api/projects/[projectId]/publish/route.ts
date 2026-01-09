import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kvJsonGet } from "../../../../lib/kv";
import { getCurrentUserId } from "../../../../lib/demoAuth";
import { requirePro, toJsonError } from "@/app/lib/limits";

export async function POST(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    // Keep your existing demo auth for accessing the project KV path
    const userId = getCurrentUserId();

    // ✅ Enforce Pro plan (backend)
    // Use Clerk userId for plan lookup (matches your Stripe webhook plan keys)
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
      await requirePro(clerkUserId);
    } catch (err) {
      const { status, body } = toJsonError(err);
      return NextResponse.json(body, { status });
    }

    const { projectId } = params;

    if (!projectId) {
      return NextResponse.json(
        { ok: false, error: "Missing projectId" },
        { status: 400 }
      );
    }

    const project = await kvJsonGet(`projects:${userId}:${projectId}`);

    return NextResponse.json({
      ok: true,
      commitUrl: "https://github.com/example/commit/demo",
      project,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Publish failed" },
      { status: 500 }
    );
  }
}
