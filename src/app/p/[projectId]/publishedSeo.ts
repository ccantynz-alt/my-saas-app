import type { Metadata } from "next";

export type PublishedSeoInput = {
  projectId: string;
  pageSlug?: string; // "", "about", "pricing", "faq", "contact"
};

function prettySlug(slug?: string) {
  const s = String(slug || "").trim().toLowerCase();
  if (!s) return "Home";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function descriptionFor(slug?: string) {
  const s = String(slug || "").trim().toLowerCase();

  switch (s) {
    case "":
      return "Published website";
    case "about":
      return "Learn more about this website";
    case "pricing":
      return "Pricing and plans";
    case "faq":
      return "Frequently asked questions";
    case "contact":
      return "Contact information";
    default:
      return `${prettySlug(s)} page`;
  }
}

/**
 * Safe, deterministic metadata for published pages.
 * No KV reads, no external imports. Always builds.
 */
export function getPublishedMetadata(input: PublishedSeoInput): Metadata {
  const page = prettySlug(input.pageSlug);
  const desc = descriptionFor(input.pageSlug);

  return {
    title: `${page} · ${input.projectId}`,
    description: desc,
    // Optional: you can expand OpenGraph/Twitter later once content is wired back in
    openGraph: {
      title: `${page} · ${input.projectId}`,
      description: desc,
      type: "website",
    },
  };
}
