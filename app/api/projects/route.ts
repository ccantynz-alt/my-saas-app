import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";

type Project = {
  id: string;
  name: string;
  userId: string;
  createdAt: number;
};

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "Untitled Project";

  const project: Project = {
    id: `proj_${nanoid(10)}`,
    name,
    userId,
    createdAt: Date.now(),
  };

  // ✅ Store the project
  await kv.hset(`project:${project.id}`, project);

  // ✅ User-specific list (for normal users)
  await kv.lpush(`projects:user:${userId}`, project.id);

  // ✅ Global list (for admin)
  await kv.lpush(`projects:all`, project.id);

  return NextResponse.json({ ok: true, project });
}

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const ids = await kv.lrange<string[]>(`projects:user:${userId}`, 0, -1);

  const projects = await Promise.all(
    ids.map(async (id) => {
      const p = await kv.hgetall<Project>(`project:${id}`);
      return p || null;
    })
  );

  return NextResponse.json({ ok: true, projects: projects.filter(Boolean) });
}
