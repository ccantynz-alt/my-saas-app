import * as React from "react";

type Props = {
  projectId: string;

  /**
   * Optional first path segment like "pricing", "faq", "contact".
   * If provided, we render ONLY that page's content (real multi-page behavior).
   * If empty/undefined, we render the full home page (all sections).
   */
  pathSlug?: string;
};

function normalizeSlug(slug?: string) {
  const s = String(slug || "").trim().toLowerCase();
  if (!s) return "";

  // Basic sanitization: only keep [a-z0-9-]
  const clean = s.replace(/[^a-z0-9-]/g, "");
  return clean || "";
}

function prettyTitle(slug: string) {
  if (!slug) return "Home";
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

type Section = {
  id: string;
  title: string;
  body: string;
};

function getSections(projectId: string): Section[] {
  // NOTE: This is still placeholder content.
  // Later we can wire your real published content store back in here.
  return [
    {
      id: "hero",
      title: "Hero",
      body:
        "This is a stable published renderer. Your real project content can be reconnected here later.",
    },
    {
      id: "about",
      title: "About",
      body: "About section placeholder content.",
    },
    {
      id: "pricing",
      title: "Pricing",
      body: "Pricing section placeholder content.",
    },
    {
      id: "faq",
      title: "FAQ",
      body: "FAQ section placeholder content.",
    },
    {
      id: "contact",
      title: "Contact",
      body: "Contact section placeholder content.",
    },
  ];
}

function pickSingleSection(sections: Section[], slug: string): Section | null {
  // Map route slugs to section ids
  const map: Record<string, string> = {
    about: "about",
    pricing: "pricing",
    faq: "faq",
    contact: "contact",
  };

  const wanted = map[slug];
  if (!wanted) return null;

  return sections.find((s) => s.id === wanted) || null;
}

function Card({ section }: { section: Section }) {
  return (
    <section
      id={section.id}
      style={{
        padding: 16,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 650 }}>
        {section.title}
      </h2>
      <p style={{ marginTop: 8, opacity: 0.85 }}>{section.body}</p>
    </section>
  );
}

function Nav() {
  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    display: "inline-block",
    fontSize: 14,
  };

  return (
    <nav style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
      <a href="./" style={linkStyle}>
        Home
      </a>
      <a href="./about" style={linkStyle}>
        About
      </a>
      <a href="./pricing" style={linkStyle}>
        Pricing
      </a>
      <a href="./faq" style={linkStyle}>
        FAQ
      </a>
      <a href="./contact" style={linkStyle}>
        Contact
      </a>
    </nav>
  );
}

/**
 * PublicRenderer (Server Component)
 * - If pathSlug is empty: render the full home page (all sections)
 * - If pathSlug is one of about/pricing/faq/contact: render ONLY that section (true multi-page)
 * - If pathSlug is unknown: show a simple Not Found message + nav
 */
export default async function PublicRenderer({ projectId, pathSlug }: Props) {
  const slug = normalizeSlug(pathSlug);
  const sections = getSections(projectId);

  const isHome = !slug || slug === "home" || slug === "index";

  let pageTitle = prettyTitle(slug);
  let content: React.ReactNode;

  if (isHome) {
    pageTitle = "Home";
    content = (
      <>
        {sections.map((s) => (
          <Card key={s.id} section={s} />
        ))}
      </>
    );
  } else {
    const single = pickSingleSection(sections, slug);
    if (!single) {
      pageTitle = "Not found";
      content = (
        <section
          style={{
            padding: 16,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 650 }}>
            Page not found
          </h2>
          <p style={{ marginTop: 8, opacity: 0.85 }}>
            That page doesn’t exist for this published site.
          </p>
        </section>
      );
    } else {
      content = <Card section={single} />;
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
          {pageTitle}
        </h1>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          Project: <code>{projectId}</code>
        </p>
        <Nav />
      </header>

      {content}

      <footer style={{ marginTop: 24, opacity: 0.7, fontSize: 13 }}>
        Published via my-saas-app
      </footer>
    </main>
  );
}
