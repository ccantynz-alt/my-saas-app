import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/app/lib/store";

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ ok: true, projects });
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  let name = "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    name = String(body?.name || "").trim();
  } else {
    const form = await req.formData();
    name = String(form.get("name") || "").trim();
  }

  if (!name) return NextResponse.json({ ok: false, error: "Missing name" }, { status: 400 });

  const project = await createProject(name);

  // If created from a form, redirect to the project page:
  if (!contentType.includes("application/json")) {
    return NextResponse.redirect(new URL(`/dashboard/projects/${project.id}`, req.url));
  }

  return NextResponse.json({ ok: true, project });
}
