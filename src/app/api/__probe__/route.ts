import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function pickEnv(name: string): string | null {
  const v = process.env[name];
  if (!v) return null;
  return v;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ts = url.searchParams.get("ts") ?? null;

  const now = new Date();
  const rand = Math.random().toString(16).slice(2);

  const payload = {
    ok: true,
    probe: "dominat8",
    serverTimeIso: now.toISOString(),
    serverTimeMs: now.getTime(),
    rand,
    ts,
    env: {
      VERCEL: pickEnv("VERCEL"),
      VERCEL_ENV: pickEnv("VERCEL_ENV"),
      VERCEL_REGION: pickEnv("VERCEL_REGION"),
      VERCEL_URL: pickEnv("VERCEL_URL"),
      VERCEL_DEPLOYMENT_ID: pickEnv("VERCEL_DEPLOYMENT_ID"),
      VERCEL_GIT_PROVIDER: pickEnv("VERCEL_GIT_PROVIDER"),
      VERCEL_GIT_REPO_SLUG: pickEnv("VERCEL_GIT_REPO_SLUG"),
      VERCEL_GIT_COMMIT_SHA: pickEnv("VERCEL_GIT_COMMIT_SHA"),
      VERCEL_GIT_COMMIT_REF: pickEnv("VERCEL_GIT_COMMIT_REF"),
      VERCEL_GIT_COMMIT_MESSAGE: pickEnv("VERCEL_GIT_COMMIT_MESSAGE"),
    },
    headersHint: {
      cache: "no-store",
    },
  };

  const res = NextResponse.json(payload, { status: 200 });

  // HARD "trust mode" caching kill-switch:
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  res.headers.set("Surrogate-Control", "no-store");

  // Proof headers:
  res.headers.set("x-dominat8-probe", "1");
  res.headers.set("x-dominat8-stamp", now.toISOString());
  res.headers.set("x-dominat8-rand", rand);
  if (payload.env.VERCEL_DEPLOYMENT_ID) res.headers.set("x-dominat8-deploy", payload.env.VERCEL_DEPLOYMENT_ID);
  if (payload.env.VERCEL_GIT_COMMIT_SHA) res.headers.set("x-dominat8-git", payload.env.VERCEL_GIT_COMMIT_SHA);
  if (payload.env.VERCEL_ENV) res.headers.set("x-dominat8-env", payload.env.VERCEL_ENV);

  return res;
}