import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export const runtime = "nodejs"; // safest default while you’re stabilizing

function isOwner(user: Awaited<ReturnType<typeof currentUser>>) {
  const role = (user?.publicMetadata?.role as string | undefined) ?? "user";
  return role === "owner";
}

export async function GET() {
  // Require signed-in user
  auth().protect();

  const user = await currentUser();
  if (!user) {
    // Defensive: should not happen if protect() worked, but avoids weird edge cases
    return NextResponse.json({ ok: false, error: "No user" }, { status: 401 });
  }

  // Require owner role
  if (!isOwner(user)) {
    // 404 prevents role probing (“does /admin exist?”)
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    message: "Admin API is working",
    userId: user.id,
    role: user.publicMetadata?.role ?? "user",
  });
}
