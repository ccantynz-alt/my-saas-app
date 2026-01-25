import React from "react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const BUILD_ID = "BUILD_ID_20260125_163736";
  const BUILD_ISO = "2026-01-25T03:37:36.3498885Z";

  const h = React.createElement;

  const root: React.CSSProperties = {
    minHeight: "100vh",
    padding: "48px 18px",
    color: "#EEF2FF",
    background:
      "radial-gradient(1400px 800px at 15% -10%, rgba(255,215,0,0.16), transparent 60%), " +
      "radial-gradient(1200px 700px at 85% 0%, rgba(0,255,200,0.12), transparent 55%), " +
      "radial-gradient(900px 500px at 55% 35%, rgba(140,120,255,0.12), transparent 60%), " +
      "linear-gradient(180deg,#05060a 0%,#070913 55%,#05060a 100%)",
  };

  const wrap: React.CSSProperties = { maxWidth: 1180, margin: "0 auto" };

  const topBar: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    padding: "14px 16px",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(6,7,12,0.45)",
  };

  const brandRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10 };

  const logo: React.CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 12,
    background: "linear-gradient(135deg, rgba(255,215,0,0.92), rgba(0,255,200,0.70))",
    boxShadow: "0 10px 30px rgba(0,0,0,0.55)",
  };

  const linkRow: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap" as any };

  const link: React.CSSProperties = {
    textDecoration: "none",
    color: "rgba(238,242,255,0.86)",
    fontSize: 13,
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    display: "inline-block",
  };

  const cta: React.CSSProperties = {
    textDecoration: "none",
    fontWeight: 950 as any,
    color: "#061018",
    padding: "10px 14px",
    borderRadius: 16,
    background: "linear-gradient(135deg, rgba(255,215,0,0.96), rgba(0,255,200,0.80))",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
    display: "inline-block",
  };

  const h1: React.CSSProperties = { margin: 0, fontSize: 56, lineHeight: 1.05, letterSpacing: "-1.2px" };
  const lead: React.CSSProperties = { marginTop: 14, fontSize: 18, lineHeight: 1.7, opacity: 0.86, maxWidth: 820 };

  const buttonRow: React.CSSProperties = { marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" as any };

  const primaryBtn: React.CSSProperties = {
    textDecoration: "none",
    fontWeight: 950 as any,
    color: "#061018",
    padding: "14px 18px",
    borderRadius: 18,
    minWidth: 220,
    background: "linear-gradient(135deg, rgba(255,215,0,0.96), rgba(0,255,200,0.80))",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 22px 70px rgba(0,0,0,0.55)",
    display: "inline-block",
  };

  const secondaryBtn: React.CSSProperties = {
    textDecoration: "none",
    fontWeight: 850 as any,
    color: "rgba(238,242,255,0.92)",
    padding: "14px 18px",
    borderRadius: 18,
    minWidth: 190,
    background: "rgba(10,12,18,0.32)",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 18px 52px rgba(0,0,0,0.32)",
    display: "inline-block",
  };

  const hiddenMarkerStyle: React.CSSProperties = { position: "absolute", left: -9999, top: -9999 };

  return h(
    "main",
    { style: root },
    h("div", { style: hiddenMarkerStyle }, BUILD_ID),
    h(
      "div",
      { style: wrap },
      h(
        "div",
        { style: topBar },
        h(
          "div",
          { style: brandRow },
          h("div", { style: logo }),
          h(
            "div",
            null,
            h("div", { style: { fontWeight: 900 as any, letterSpacing: "0.2px" } }, "Dominat8"),
            h("div", { style: { opacity: 0.65, fontSize: 12 } }, "AI Website Automation")
          )
        ),
        h(
          "div",
          { style: linkRow },
          h("a", { href: "/templates", style: link }, "Templates"),
          h("a", { href: "/use-cases", style: link }, "Use Cases"),
          h("a", { href: "/pricing", style: link }, "Pricing"),
          h("a", { href: "/templates", style: cta }, "Launch ->")
        )
      ),
      h(
        "div",
        { style: { marginTop: 34 } },
        h("h1", { style: h1 }, "Build a flagship homepage that feels expensive."),
        h("p", { style: lead }, "This deploy is proofed end-to-end. Marker: ", h("strong", null, BUILD_ID)),
        h(
          "div",
          { style: buttonRow },
          h("a", { href: "/templates", style: primaryBtn }, "Start building"),
          h("a", { href: "/use-cases", style: secondaryBtn }, "See outcomes")
        ),
        h("div", { style: { marginTop: 14, opacity: 0.6, fontSize: 12 } }, "ISO: ", BUILD_ISO)
      )
    )
  );
}