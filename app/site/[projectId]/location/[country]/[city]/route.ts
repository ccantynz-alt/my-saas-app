// app/site/[projectId]/location/[country]/[city]/route.ts
import { NextResponse } from "next/server";
import { storeGet } from "@/app/lib/store";
import { isAdmin } from "@/app/lib/isAdmin";
import { getProjectSEO, injectSEOIntoHtml } from "@/app/lib/seo";
import { LOCATIONS } from "@/app/lib/locations";

type Visibility = "public" | "private";

function visibilityKey(projectId: string) {
  return `project:visibility:${projectId}`;
}

function pick<T>(arr: T[], n: number) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export async function GET(
  _req: Request,
  { params }: { params: { projectId: string; country: string; city: string } }
) {
  const admin = await isAdmin();

  const v = await storeGet(visibilityKey(params.projectId));
  const visibility: Visibility = v === "public" ? "public" : "private";

  if (visibility === "private" && !admin) {
    return new NextResponse("Private site", { status: 403 });
  }

  const country = params.country.toLowerCase() === "au" ? "AU" : "NZ";

  const location = LOCATIONS.find(
    (l) => l.slug === params.city && l.country === country
  );

  if (!location) {
    return new NextResponse("Not found", { status: 404 });
  }

  const seo = await getProjectSEO(params.projectId);
  const service = seo.schema?.services?.[0] || "Professional Services";

  const countryName = country === "AU" ? "Australia" : "New Zealand";
  const cityName = location.name;

  const sameCountry = LOCATIONS.filter((l) => l.country === country);

  const top = country === "AU"
    ? ["sydney","melbourne","brisbane","perth","adelaide","canberra","gold-coast","sunshine-coast","newcastle","wollongong"]
    : ["auckland","wellington","christchurch","hamilton","tauranga","dunedin","napier","nelson","rotorua","new-plymouth"];

  const topCities = sameCountry.filter((l) => top.includes(l.slug));
  const moreCities = pick(sameCountry.filter((l) => !top.includes(l.slug) && l.slug !== location.slug), 12);

  const mesh = [...topCities, ...moreCities].slice(0, 18);

  const html = `<!doctype html>
<html>
<head></head>
<body>
  <main style="max-width:980px;margin:40px auto;padding:16px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <header style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
      <div>
        <div style="opacity:.7;font-size:12px;">${countryName} • Location Page</div>
        <h1 style="margin:6px 0 0;font-size:30px;">${service} in ${cityName}</h1>
      </div>
      <nav style="display:flex;gap:10px;flex-wrap:wrap;">
        <a href="/site/${params.projectId}" style="text-decoration:none;border:1px solid rgba(0,0,0,.14);padding:8px 12px;border-radius:999px;">Home</a>
        <a href="/site/${params.projectId}/about" style="text-decoration:none;border:1px solid rgba(0,0,0,.14);padding:8px 12px;border-radius:999px;">About</a>
        <a href="/site/${params.projectId}/pricing" style="text-decoration:none;border:1px solid rgba(0,0,0,.14);padding:8px 12px;border-radius:999px;">Pricing</a>
        <a href="/site/${params.projectId}/contact" style="text-decoration:none;border:1px solid rgba(0,0,0,.14);padding:8px 12px;border-radius:999px;">Contact</a>
      </nav>
    </header>

    <section style="margin-top:18px;line-height:1.7;">
      <p>
        Looking for <b>${service.toLowerCase()}</b> in <b>${cityName}</b>? We deliver reliable, local-first service across
        ${countryName}, with transparent pricing, experienced staff, and strong customer care.
      </p>
      <p>
        We support customers in both <b>New Zealand</b> and <b>Australia</b> — with local knowledge and compliance focus.
      </p>
    </section>

    <section style="margin-top:18px;">
      <h2 style="margin:0 0 10px;">Why locals choose us in ${cityName}</h2>
      <ul style="margin:0;padding-left:18px;line-height:1.7;">
        <li>Local expertise and fast response</li>
        <li>Trusted, professional, and reliable</li>
        <li>Transparent pricing and clear communication</li>
        <li>Service aligned with ${countryName} expectations</li>
      </ul>
    </section>

    <section style="margin-top:22px;">
      <h2 style="margin:0 0 10px;">Service areas across ${countryName}</h2>
      <p style="opacity:.9;margin:0 0 12px;">Explore nearby and major areas we serve:</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">
        ${mesh
          .map(
            (c) => `<a href="/site/${params.projectId}/location/${country.toLowerCase()}/${c.slug}"
              style="text-decoration:none;border:1px solid rgba(0,0,0,.12);border-radius:14px;padding:10px 12px;display:block;">
              <div style="font-weight:800;">${service} in ${c.name}</div>
              <div style="opacity:.75;font-size:13px;">${countryName}</div>
            </a>`
          )
          .join("")}
      </div>
    </section>

    <section style="margin-top:22px;">
      <h2 style="margin:0 0 10px;">Book ${service.toLowerCase()} in ${cityName}</h2>
      <p style="margin:0 0 12px;line-height:1.7;">
        Want a fast quote or booking? Visit our contact page and we’ll help you right away.
      </p>
      <a href="/site/${params.projectId}/contact"
         style="display:inline-block;text-decoration:none;font-weight:900;border-radius:14px;padding:10px 14px;border:1px solid rgba(0,0,0,.14);">
        Contact us
      </a>
    </section>

    <footer style="margin-top:26px;opacity:.7;font-size:12px;">
      © ${new Date().getFullYear()} ${seo.siteName || "My Business"} • ${countryName}
    </footer>
  </main>
</body>
</html>`;

  const finalHtml = injectSEOIntoHtml({
    html,
    path: `/site/${params.projectId}/location/${country.toLowerCase()}/${location.slug}`,
    seo,
    pageTitleFallback: `${service} in ${cityName}`,
    pageOverride: {
      description: `Trusted ${service.toLowerCase()} in ${cityName}, ${countryName}. Local experts, transparent pricing, fast support. Enquire now.`,
      schemaJsonLd: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Do you provide ${service.toLowerCase()} in ${cityName}?`,
            "acceptedAnswer": { "@type": "Answer", "text": `Yes — we provide ${service.toLowerCase()} services in ${cityName} and across ${countryName}.` }
          },
          {
            "@type": "Question",
            "name": "Do you operate in New Zealand and Australia?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes — we support customers across New Zealand and Australia, depending on project requirements and availability." }
          },
          {
            "@type": "Question",
            "name": "How do I get a quote or book?",
            "acceptedAnswer": { "@type": "Answer", "text": "Use the contact page to request a quote or booking. We respond quickly and confirm details clearly." }
          }
        ]
      }
    },
  });

  return new NextResponse(finalHtml, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
