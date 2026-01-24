// src/lib/marketing/copy.ts
export const BRAND = {
  name: "Dominat8",
  domain: "dominat8.com",
  url: "https://www.dominat8.com",
  tagline: "AI website automation builder",
};

export const CTA = {
  primary: { label: "Generate my site", href: "/preview/marketing" },
  secondary: { label: "View templates", href: "/templates" },
  tertiary: { label: "Pricing", href: "/pricing" },
};

export const PROOF = [
  { k: "Minutes", v: "from brief to live site" },
  { k: "Pages", v: "multi-page generation" },
  { k: "SEO", v: "sitemap + metadata baked in" },
  { k: "Deploy", v: "publish to production fast" },
] as const;

export const STEPS = [
  {
    title: "Drop in a brief",
    body: "Describe your offer, audience, and vibe. Dominat8 turns intent into structure.",
  },
  {
    title: "Agents build the site",
    body: "Homepage, pricing, FAQ, contact — plus SEO plan and sitemap. Automatically.",
  },
  {
    title: "Publish with confidence",
    body: "Review, tweak, then ship. Clean output. Clear routing. No weird surprises.",
  },
] as const;

export const FAQ = [
  {
    q: "Is this a website builder or a generator?",
    a: "Both. You can start from a brief, then iterate like a builder — but the heavy lifting is done for you.",
  },
  {
    q: "What do I get in the output?",
    a: "A polished multi-page site spec and published pages (homepage, pricing, FAQ, contact) with SEO basics included.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes — Dominat8 is built to map custom domains and verify them cleanly.",
  },
] as const;
