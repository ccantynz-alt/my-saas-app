// app/api/projects/[projectId]/domain/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

async function requireProjectOwner(userId: string, projectId: string) {
  const project = (await kv.hgetall(`project:${projectId}`)) as any;
  if (!project?.id) return { ok: false as const, error: "PROJECT_NOT_FOUND" as const };
  if (project.userId !== userId) return { ok: false as const, error: "FORBIDDEN" as const };
  return { ok: true as const, project };
}

function normalizeDomain(input: string) {
  return input.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
}

function isValidDomain(domain: string) {
  return (
    domain.includes(".") &&
    domain.length >= 4 &&
    domain.length <= 253 &&
    /^[a-z0-9.-]+$/.test(domain) &&
    !domain.startsWith(".") &&
    !domain.endsWith(".") &&
    !domain.includes("..")
  );
}

/* =========================
   GET — read domain
========================= */
export async function GET(_req: Request, ctx: { params: { projectId: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

  const { projectId } = ctx.params;
  const check = await requireProjectOwner(userId, projectId);
  if (!check.ok) {
    return NextResponse.json({ ok: false, error: check.error }, { status: 403 });
  }

  const project = check.project;

  return NextResponse.json({
    ok: true,
    domain: project.domain || null,
    domainStatus: project.domainStatus || null,
  });
}

/* =========================
   POST — attach domain
========================= */
export async function POST(req: Request, ctx: { params: { projectId: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

  const { projectId } = ctx.params;
  const check = await requireProjectOwner(userId, projectId);
  if (!check.ok) {
    return NextResponse.json({ ok: false, error: check.error }, { status: 403 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const domain = normalizeDomain(String(body.domain || ""));
  if (!isValidDomain(domain)) {
    return NextResponse.json({ ok: false, error: "INVALID_DOMAIN" }, { status: 400 });
  }

  const now = new Date().toISOString();

  await kv.hset(`project:${projectId}`, {
    domain,
    domainStatus: "attached",
    domainUpdatedAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ ok: true, domain });
}

/* =========================
   DELETE — remove domain
========================= */
export async function DELETE(_req: Request, ctx: { params: { projectId: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

  const { projectId } = ctx.params;
  const check = await requireProjectOwner(userId, projectId);
  if (!check.ok) {
    return NextResponse.json({ ok: false, error: check.error }, { status: 403 });
  }

  await kv.hset(`project:${projectId}`, {
    domain: "",
    domainStatus: "",
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
