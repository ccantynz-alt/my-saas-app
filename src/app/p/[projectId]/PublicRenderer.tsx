import * as React from "react";
import AutoScroll from "./AutoScroll";

// We keep imports very conservative to avoid breaking unknown types.
// PublicRenderer should render the published site HTML for a projectId.
// It supports optional pathSlug which is used by the legacy catch-all route.

type Props = {
  projectId: string;
  /**
   * Optional first path segment like "pricing", "faq", "contact".
   * Used to support /p/[projectId]/pricing etc.
   */
  pathSlug?: string;
};

function normalizeSlug(slug?: string) {
  const s = String(slug || "").trim().toLowerCase();
  if (!s) return undefined;

  // Basic sanitization: only keep [a-z0-9-]
  const clean = s.replace(/[^a-z0-9-]/g, "");
  return clean || undefined;
}

/**
 * PublicRenderer (Server Component)
 * - Renders published content for a project.
 * - Keeps compatibility with legacy path->section scroll behavior.
 *
 * IMPORTANT:
 * This file is intentionally minimal and "safe" — it won't assume
 * your internal content store shape. If you already had a more complex
 * renderer previously, this provides a stable fallback to keep builds green.
 */
export default async function PublicRenderer({ projectId, pathSlug }: Props) {
  const slug = normalizeSlug(pathSlug);

  // If you have a real published HTML/content store, you can wire it here.
  // For now, render a stable placeholder that keeps routing working.
  // This keeps your platform "green baseline" while we restore the real renderer
  // (or rebuild it cleanly next).

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      {/* Legacy behavior: if pathSlug exists, scroll to matching section id */}
      {slug ? <AutoScroll slug={slug} /> : null}

      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
          Published Site
        </h1>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          Project: <code>{projectId}</code>
        </p>
      </header>

      <section id="hero" style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 650 }}>Hero</h2>
        <p style={{ marginTop: 8, opacity: 0.85 }}>
          This is a stable published renderer placeholder.
          Your existing publish/content store can be reconnected here.
        </p>
      </section>

      <section id="about" style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 650 }}>About</h2>
        <p style={{ marginTop: 8, opacity: 0.85 }}>
          About section placeholder.
        </p>
      </section>

      <section id="pricing" style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 650 }}>Pricing</h2>
        <p style={{ marginTop: 8, opacity: 0.85 }}>
          Pricing section placeholder.
        </p>
      </section>

      <section id="faq" style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 650 }}>FAQ</h2>
        <p style={{ marginTop: 8, opacity: 0.85 }}>
          FAQ section placeholder.
        </p>
      </section>

      <section id="contact" style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 650 }}>Contact</h2>
        <p style={{ marginTop: 8, opacity: 0.85 }}>
          Contact section placeholder.
        </p>
      </section>
    </main>
  );
}
