// app/api/templates/route.ts
import { NextResponse } from "next/server";
import { TEMPLATES } from "@/app/lib/templates";

export async function GET() {
  return NextResponse.json({ ok: true, templates: TEMPLATES });
}
