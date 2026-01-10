import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

type RouteContext = {
  params: { projectId: string };
};

function asText(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/* -------------------- AUDIT (server-side) -------------------- */

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function includesAny(haystack: string, needles: string[]) {
  const h = normalize(haystack);
  return needles.some((n) => h.includes(normalize(n)));
}

function getTitle(html: string) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : "";
}

function hasMetaDescription(html: string) {
  return /<meta\s+[^>]*name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/i.test(
    html
  );
}

function hasH1(html: string) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return false;
  const text = m[1].replace(/<[^>]+>/g, "").trim();
  return text.length >= 4;
}

function hasCTA(html: string) {
  return includesAny(html, [
    "start free",
    "generate",
    "publish",
    "upgrade",
    "get started",
  ]);
}

function runAudit(html: string) {
  const missing: string[] = [];
  const warnings: string[] = [];
  const notes: string[] = [];

  if (!getTitle(html)) missing.push("Missing <title> tag");
  if (!hasMetaDescription(html)) missing.push("Missing meta description");
  if (!hasH1(html)) missing.push("Missing clear H1 headline");
  if (!hasCTA(html)) missing.push("Missing clear CTA (Start free / Generate / Publish)");

  if (
    includesAny(html, [
      "book a call",
      "schedule a call",
      "free consultation",
      "calendar",
    ])
  ) {
    warnings.push(
      "Calls/meetings language found. Product direction is website-only automation-first."
    );
  }

  if (includesAny(html, ["pricing", "plans", "free", "pro"])) {
    notes.push("Pricing teaser detected.");
  } else {
    notes.push("Consider adding a simple pricing teaser.");
  }

  if (includesAny(html, ["trusted", "reviews", "secure", "guarantee"])) {
    notes.push("Trust elements detected.");
  } else {
    notes.push("Consider adding trust elements.");
  }

  return {
    readyToPublish: missing.length === 0,
    missing,
    warnings,
    notes,
  };
}

/* -------------------- PLAN / BILLING -------------------- */

async function isProUser(userId: string): Promise<boolean> {
  const v = await kv.get(`plan:clerk:${userId}`);
  return String(v || "").toLowerCase() === "pro";
}

async function createUpgradeUrl(
  origin: string,
  userId: string,
  projectId: string
) {
  const priceId = process.env.STRIPE_PRICE_ID || "";
  if (!priceId) return "";

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    origin ||
    "https://my-saas-app-5eyw.vercel.app";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/projects/${projectId}?upgraded=1`,
    cancel_url: `${appUrl}/projects/${projectId}?upgrade=cancelled`,
    metadata: {
      clerkUserId: userId,
      projectId,
      source: "publish_gate",
    },
  });

  return session.url || "";
}

/* -------------------- ROUTE -------------------- */

export async function POST(req: Request, ctx: RouteContext) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const projectId = ctx.params.projectId;

  // Load generated HTML
  const genKey = `generated:project:${projectId}:latest`;
  const html = asText(await kv.get(genKey));

  if (!html) {
    return NextResponse.json(
      { ok: false, error: "No generated HTML found. Run Finish first." },
      { status: 400 }
    );
  }

  // Audit gate
  const audit = runAudit(html);
  if (!audit.readyToPublish) {
    return NextResponse.json(
      {
        ok: false,
        error: "Not ready to publish",
        ...audit,
      },
      { status: 409 }
    );
  }

  // Pro gate
  const isPro = await isProUser(userId);
  if (!isPro) {
    const upgradeUrl = await createUpgradeUrl(
      req.headers.get("origin") || "",
      userId,
      projectId
    );

    return NextResponse.json(
      {
        ok: false,
        error: "Upgrade required",
        upgradeUrl,
      },
      { status: 402 }
    );
  }

  // Publish
  const pubKey = `published:project:${projectId}:latest`;
  await kv.set(pubKey, html);

  return NextResponse.json({
    ok: true,
    projectId,
    publicUrl: `/p/${projectId}`,
  });
}
