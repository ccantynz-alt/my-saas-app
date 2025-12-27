import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUserId } from "../../../../lib/demoAuth";
import { readRunFiles } from "../../../../lib/runFiles";

const ParamsSchema = z.object({
  runId: z.string().min(1),
});

export async function GET(_req: Request, ctx: { params: { runId: string } }) {
  const userId = await getCurrentUserId();
  const { runId } = ParamsSchema.parse(ctx.params);

  const files = await readRunFiles(userId, runId);
  return NextResponse.json({ ok: true, files });
}
