// app/api/templates/route.ts
import { NextResponse } from "next/server";
import { TEMPLATES } from "../../lib/templates";

export async function GET() {
  return NextResponse.json({ ok: true, templates: TEMPLATES });
}
