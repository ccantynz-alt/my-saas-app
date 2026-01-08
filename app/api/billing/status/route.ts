import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return Response.json({ ok: true, signedIn: false, plan: "free" });
  }

  const plan = (await kv.get<string>(`plan:clerk:${userId}`)) || "free";

  return Response.json({
    ok: true,
    signedIn: true,
    plan,
  });
}
