import { NextResponse } from "next/server";
import { listTemplates, upsertTemplate } from "@/app/lib/templatesKV";

export async function GET() {
  const all = await listTemplates();
  return NextResponse.json({ ok: true, templates: all });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const tpl = await upsertTemplate(body);
  return NextResponse.json({ ok: true, template: tpl });
}
