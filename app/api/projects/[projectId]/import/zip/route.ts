import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { auth } from "@clerk/nextjs/server";
import AdmZip from "adm-zip";

function contentTypeFromPath(path: string) {
  const p = path.toLowerCase();
  if (p.endsWith(".html")) return "text/html; charset=utf-8";
  if (p.endsWith(".css")) return "text/css; charset=utf-8";
  if (p.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (p.endsWith(".json")) return "application/json; charset=utf-8";
  if (p.endsWith(".png")) return "image/png";
  if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
  if (p.endsWith(".gif")) return "image/gif";
  if (p.endsWith(".svg")) return "image/svg+xml";
  if (p.endsWith(".webp")) return "image/webp";
  if (p.endsWith(".ico")) return "image/x-icon";
  if (p.endsWith(".txt")) return "text/plain; charset=utf-8";
  if (p.endsWith(".woff")) return "font/woff";
  if (p.endsWith(".woff2")) return "font/woff2";
  if (p.endsWith(".ttf")) return "font/ttf";
  if (p.endsWith(".otf")) return "font/otf";
  return "application/octet-stream";
}

function normalizeEntryPath(entryName: string) {
  // Convert backslashes, strip leading slashes, prevent .. traversal
  let p = entryName.replace(/\\/g, "/").replace(/^\/+/, "");
  p = p.split("/").filter(Boolean).join("/");
  if (!p || p.includes("..")) return null;
  return p;
}

function injectBaseTag(html: string, projectId: string) {
  const baseTag = `<base href="/p/${projectId}/assets/">`;

  // If already has <base ...>, leave it.
  if (/<base\s/i.test(html)) return html;

  // Try to inject inside <head>
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (m) => `${m}\n  ${baseTag}\n`);
  }

  // If no head tag, prepend a minimal head
  return `<!DOCTYPE html><html><head>${baseTag}</head><body>${html}</body></html>`;
}

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    // ─────────────────────────────────────────────
    // AUTH
    // ─────────────────────────────────────────────
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId } = params;

    // ─────────────────────────────────────────────
    // LOAD PROJECT + OWNERSHIP
    // ─────────────────────────────────────────────
    const project = await kv.get<any>(`project:${projectId}`);
    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }
    if (project.ownerId !== userId) {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // ─────────────────────────────────────────────
    // PARSE MULTIPART FORM DATA
    // ─────────────────────────────────────────────
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Missing file (form field must be 'file')" },
        { status: 400 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());

    // ─────────────────────────────────────────────
    // UNZIP
    // ─────────────────────────────────────────────
    const zip = new AdmZip(buf);
    const entries = zip.getEntries();

    if (!entries || entries.length === 0) {
      return NextResponse.json(
        { ok: false, error: "ZIP is empty" },
        { status: 400 }
      );
    }

    // Find index.html (root or nested)
    const indexEntry =
      entries.find((e) => !e.isDirectory && e.entryName.toLowerCase().endsWith("index.html")) ??
      entries.find((e) => !e.isDirectory && e.entryName.toLowerCase().endsWith(".html"));

    if (!indexEntry) {
      return NextResponse.json(
        { ok: false, error: "No HTML file found in ZIP (need index.html)" },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────────
    // SAVE ASSETS INTO KV
    // ─────────────────────────────────────────────
    const assetPrefix = `asset:project:${projectId}:`;
    const manifestKey = `asset:project:${projectId}:manifest`;

    const saved: string[] = [];
    const manifest: Array<{ path: string; contentType: string; size: number }> = [];

    for (const e of entries) {
      if (e.isDirectory) continue;

      const normalized = normalizeEntryPath(e.entryName);
      if (!normalized) continue;

      // Skip macOS zip metadata
      if (normalized.startsWith("__MACOSX/")) continue;
      if (normalized.endsWith(".ds_store") || normalized.endsWith(".DS_Store")) continue;

      const bytes = e.getData(); // Buffer
      const contentType = contentTypeFromPath(normalized);

      // Store as base64 to keep KV JSON-safe
      const b64 = bytes.toString("base64");

      const key = `${assetPrefix}${normalized}`;
      await kv.set(key, { b64, contentType });

      saved.push(key);
      manifest.push({ path: normalized, contentType, size: bytes.length });
    }

    await kv.set(manifestKey, manifest);

    // ─────────────────────────────────────────────
    // SAVE PROJECT HTML (PROJECT + FALLBACK)
    // ─────────────────────────────────────────────
    const rawIndexHtml = indexEntry.getData().toString("utf-8");
    const finalHtml = injectBaseTag(rawIndexHtml, projectId);

    const projectHtmlKey = `generated:project:${projectId}:latest`;
    await kv.set(projectHtmlKey, finalHtml);
    await kv.set("generated:latest", finalHtml);

    return NextResponse.json({
      ok: true,
      projectId,
      indexHtmlFrom: indexEntry.entryName,
      savedHtml: [projectHtmlKey, "generated:latest"],
      assetsManifestKey: manifestKey,
      assetsSavedCount: manifest.length,
    });
  } catch (err) {
    console.error("ZIP IMPORT ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );
  }
}
