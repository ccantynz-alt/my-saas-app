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
  const re =
    /<meta\s+[^>]*name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/i;
  return re.test(html);
}

function hasH1WithText(html: string) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return false;
  const text = m[1].replace(/<[^>]+>/g, "").trim();
  return text.length >= 4;
}

function hasCta(html: string) {
  const ctas = [
    "start free",
    "generate",
    "publish",
    "upgrade",
    "get started",
    "get a quote",
    "create site",
  ];
  return includesAny(html, ctas);
}

function runAudit(html: string) {
  const missing: string[] = [];
  const warnings: string[] = [];
  const notes: string[] = [];

  const title = getTitle(html);
  if (!title) missing.push("Add a <title> tag for SEO.");
  if (!hasMetaDescription(html))
    missing.push('Add <meta name="description" ...> for SEO.');
  if (!hasH1WithText(html))
    missing.push("Add a clear H1 headline (human-readable).");
  if (!hasCta(html))
    missing.push(
      'Add at least one clear CTA (e.g., "Start free", "Generate", "Publish", "Upgrade").'
    );

  // Website-only direction (warn only)
  if (
    includesAny(html, [
      "book a call",
      "schedule a call",
      "book a meeting",
      "free consultation",
      "calendar",
    ])
  ) {
    warnings.push(
      "Found call/meeting language. Product direction is website-only automation-first—consider removing calls/meetings wording."
    );
  }

  // Notes: trust/pricing are good but not blockers
  if (includesAny(html, ["trusted by", "reviews", "rating", "secure", "guarantee"])) {
    notes.push("Trust elements detected (good).");
  } else {
    notes.push("Consider adding a trust strip (reviews, guarantees, privacy/security note).");
  }

  if (includesAny(html, ["pricing", "plans", "free", "pro"])) {
    notes.push("Pricing teaser detected (good).");
  } else {
    notes.push("Consider adding a simple pricing teaser (Free vs Pro).");
  }

  const readyToPublish = missing.length === 0;
  return { readyToPublish, missing, warnings, notes };
}

async function isProUser(userId: string): Promise<boolean> {
  // Your app previously stored plan as: plan:clerk:<userId> => "pro" / "free"
  try {
    const v = await kv.get(`plan:clerk:${userId}`);
    return String(v || "").toLowerCase() === "pro";
  } catch {
    return false;
  }
}

async function createUpgradeUrl(origin: string, userId: string, projectId: string) {
  const priceId = process.env.STRIPE_PRICE_ID || "";
  if (!priceId) return "";

  // Where to send the user after checkout
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    origin ||
    "https://my-saas-app-5eyw.vercel.app";

  const successUrl = `${appUrl}/projects/${projectId}?upgraded=1`;
  const cancelUrl = `${appUrl}/projects/${projectId}?upgrade=cancelled`;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      clerkUserId: userId,
      projectId,
      source: "publish_gate",
    },
  });

  return session.url || "";
}

export async function POST(req: Request, ctx: RouteContext) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const projectId = ctx.params.projectId;

  // Optional owner check (only enforced if a project record exists)
  // This avoids breaking older data layouts while still protecting when present.
  try {
    const proj: any = await kv.get(`project:${projectId}`);
    const ownerId =
      proj?.ownerId || proj?.userId || proj?.clerkUserId || proj?.owner;
    if (ownerId && String(ownerId) !== String(userId)) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }
  } catch {
    // ignore (do not block publish if record layout differs)
  }

  // Load generated HTML from KV (Finish stores here)
  const generatedKey = `generated:project:${projectId}:latest`;

  let html = "";
  try {
    const v = await kv.get(generatedKey);
    html = asText(v);
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "Publish storage unavailable",
        details: e?.message ? String(e.message) : "KV error",
      },
      { status: 500 }
    );
  }

  if (!html) {
    return NextResponse.json(
      { ok: false, error: "No generated HTML found. Run Finish → Quality Check first." },
      { status: 400 }
    );
  }

  // Server-side audit gate
  const audit = runAudit(html);
  if (!audit.readyToPublish) {
    return NextResponse.json(
      {
        ok: false,
        error: "Not ready to publish",
        readyToPublish: false,
        missing: audit.missing,
        warnings: audit.warnings,
        notes: audit.notes,
      },
      { status: 409 }
    );
  }

  // Pro gate (restore correct behavior)
  const pro = await isProUser(userId);
  if (!pro) {
    const origin = req.headers.get("origin") || "";
    let upgradeUrl = "";
    try {
      upgradeUrl = await createUpgradeUrl(origin, userId, projectId);
    } catch (e: any) {
      // If Stripe fails, still return 402 (UI can guide user)
      upgradeUrl = "";
    }

    return NextResponse.json(
      {
        ok: false,
        error: "Upgrade required",
        upgradeUrl,
      },
      { status: 402 }
    );
  }

  // Write published HTML key (used by /p/<projectId>)
  const publishedKey = `published:project:${projectId}:latest`;

  try {
    await kv.set(publishedKey, html);
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "Publish write failed",
        details: e?.message ? String(e.message) : "KV error",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      projectId,
      publicUrl: `/p/${projectId}`,
    },
    { status: 200 }
  );
}
