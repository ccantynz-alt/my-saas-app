import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function nowIso() {
  try { return new Date().toISOString(); } catch { return ""; }
}
function envFirst(names: string[]): string {
  for (const n of names) {
    const v = process.env[n];
    if (v && String(v).trim()) return String(v).trim();
  }
  return "";
}

const CHECKED = ["ADMIN_TOKEN","ADMIN_API_KEY","ADMIN_ACCESS_CODE","ADMIN_ACCESS_KEY","ADMIN_SECRET"];

export async function GET() {
  const token = envFirst(CHECKED);
  const has = !!token;
  const len = token ? String(token).length : 0;

  return NextResponse.json(
    {
      ok: true,
      at: nowIso(),
      stamp: "DXL_AUTHCHECK_LOCATOR_HARDENED_20260129",
      hasAdminToken: has,
      tokenLength: len,
      checkedNames: CHECKED
    },
    {
      headers: {
        "cache-control": "no-store, max-age=0",
        "x-dxl-authcheck": "DXL_AUTHCHECK_LOCATOR_HARDENED_20260129"
      }
    }
  );
}