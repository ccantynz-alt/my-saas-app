// app/api/projects/[projectId]/domain/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

async function requireProjectOwner(userId: string, projectId: string) {
  const project = (await kv.hgetall(`project:${projectId}`)) as any;
  if (!project?.id) return { ok: false as const, error: "PROJECT_NOT_FOUND" as const };
  if (project.userId !== userId) return { ok: false as const, error: "FORBIDDEN" as const };
  return { ok: true as const, project };
}

function normalizeDomain(input: string) {
  const d = input.trim().toLowerCase();
  const noProto = d.replace(/^https?:\/\//, "").split("/")[0];
  return noProto;
}

function isValidDomain(domain: string) {
  if (!domain.includes(".")) return false;
  if (domain.length < 4 || domain.length > 253) return false;
  if (!/^[a-z0-9.-]+$/.test(domain)) return false;
  if (domain.startsWith(".") || domain.endsWith(".")) return false;
  if (domain.includes("..")) return false;
  return true;
}

export async function GET(_req: Request, ctx: { params: { projectId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const projectId = ctx.params.projectId;

    const ownerCheck = await requireProjectOwner(userId, projectId);
    if (!ownerCheck.ok) {
      const status = ownerCheck.error === "PROJECT_NOT_FOUND" ? 404 : 403;
      return NextResponse.json({ ok: false, error: ownerCheck.error }, { status });
    }

    const project = ownerCheck.project;

    return NextResponse.json({
      ok: true,
      projectId,
      domain: project?.domain || null,
      domainStatus: project?.domainStatus || null,
      domainUpdatedAt: project?.domainUpdatedAt || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "DOMAIN_GET_FAILED", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, ctx: { params: { projectId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const projectId = ctx.params.projectId;

    const ownerCheck = await requireProjectOwner(userId, projectId);
    if (!ownerCheck.ok) {
      const status = ownerCheck.error === "PROJECT_NOT_FOUND" ? 404 : 403;
      return NextResponse.json({ ok: false, error: ownerCheck.error }, { status });
    }

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      body = null;
    }

    const raw = String(body?.domain || "");
    const domain = normalizeDomain(raw);

    if (!domain || !isValidDomain(domain)) {
      return NextResponse.json({ ok: false, error: "INVALID_DOMAIN" }, { status: 400 });
    }

    const now = new Date().toISOString();

    await kv.hset(`project:${projectId}`, {
      domain,
      domainStatus: "attached",
      domainUpdatedAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ ok: true, projectId, domain });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "DOMAIN_POST_FAILED", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, ctx: { params: { projectId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const projectId = ctx.params.projectId;

    const ownerCheck = await requireProjectOwner(userId, projectId);
    if (!ownerCheck.ok) {
      const status = ownerCheck.error === "PROJECT_NOT_FOUND" ? 404 : 403;
      return NextResponse.json({ ok: false, error: ownerCheck.error }, { status });
    }

    const now = new Date().toISOString();

    await kv.hset(`project:${projectId}`, {
      domain: "",
      domainStatus: "",
      domainUpdatedAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ ok: true, projectId });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "DOMAIN_DELETE_FAILED", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
