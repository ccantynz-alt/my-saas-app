import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

type Project = {
  id: string;
  ownerId: string;
};

function projectKey(projectId: string) {
  return `project:${projectId}`;
}

function generatedProjectLatestKey(projectId: string) {
  return `generated:project:${projectId}:latest`;
}

/**
 * VERY IMPORTANT:
 * This agent is NOT freeform chat.
 * It applies controlled, conversion-focused transformations only.
 */
function applyConversionPass(html: string) {
  let out = html;

  // 1) Strengthen primary CTA wording
  out = out.replace(
    /(Get Started|Contact Us|Learn More)/gi,
    "Get Started Today"
  );

  // 2) Improve vague hero headlines
  out = out.replace(
    /<h1[^>]*>([^<]{0,120})<\/h1>/i,
    (_m, text) =>
      `<h1>${text} — Book Now & Get Results Faster</h1>`
  );

  // 3) Add urgency cue if none exists
  if (!/today|now|limited|book/i.test(out)) {
    out = out.replace(
      /<\/header>|<\/section>/i,
      `<p style="font-weight:700;color:#111">Limited availability — book today.</p>$&`
    );
  }

  // 4) Ensure at least one strong CTA button exists
  if (!/<button|<a[^>]+href="#contact"/i.test(out)) {
    out = out.replace(
      /<\/body>/i,
      `<a href="#contact" style="display:inline-block;padding:14px 18px;border-radius:12px;background:#0b5fff;color:#fff;font-weight:800;text-decoration:none">Book Now</a></body>`
    );
  }

  return out;
}

export async function POST(
  _req: Request,
  ctx: { params: { projectId: string } }
) {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const projectId = ctx.params.projectId;
  if (!projectId) {
    return NextResponse.json({ ok: false, error: "Missing projectId" }, { status: 400 });
  }

  const project = await kv.get<Project>(projectKey(projectId));
  if (!project) {
    return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
  }

  if (project.ownerId !== userId) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const html = await kv.get<string>(generatedProjectLatestKey(projectId));
  if (!html) {
    return NextResponse.json(
      { ok: false, error: "No generated HTML to optimize yet" },
      { status: 400 }
    );
  }

  const updatedHtml = applyConversionPass(html);

  await kv.set(generatedProjectLatestKey(projectId), updatedHtml);

  return NextResponse.json({
    ok: true,
    agent: "conversion",
    message: "Site optimized for higher conversions",
  });
}
