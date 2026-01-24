// src/app/(marketing)/page.tsx
export const runtime = "nodejs";

import LuxuryShell from "@/src/components/marketing/LuxuryShell";
import LuxuryNav from "@/src/components/marketing/LuxuryNav";
import LuxuryHero from "@/src/components/marketing/LuxuryHero";
import RuralTrustStrip from "@/src/components/marketing/RuralTrustStrip";
import ServicesGrid from "@/src/components/marketing/ServicesGrid";
import ProofTestimonials from "@/src/components/marketing/ProofTestimonials";
import LuxuryFAQ from "@/src/components/marketing/LuxuryFAQ";
import LuxuryCTA from "@/src/components/marketing/LuxuryCTA";
import LuxuryFooter from "@/src/components/marketing/LuxuryFooter";
import { BRAND } from "@/src/lib/marketing/copy";

export const metadata = {
  title: "Dominat8 — AI Website Automation Builder",
  description:
    "Dominat8 generates a rural-professional, premium multi-page website from your brief. Calm UX. Serious output. Publish fast.",
  alternates: { canonical: BRAND.url },
  openGraph: {
    title: "Dominat8 — AI Website Automation Builder",
    description:
      "Generate a rural-professional, premium multi-page website from your brief. Calm UX. Serious output. Publish fast.",
    url: BRAND.url,
    siteName: "Dominat8",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dominat8 — AI Website Automation Builder",
    description:
      "Generate a rural-professional, premium multi-page website from your brief. Calm UX. Serious output. Publish fast.",
  },
};

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Dominat8",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Dominat8 generates a rural-professional, premium multi-page website from your brief and helps you publish fast.",
    url: BRAND.url,
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function MarketingHomePage() {
  return (
    <LuxuryShell>
      <JsonLd />
      <LuxuryNav />
      <LuxuryHero />
      <RuralTrustStrip />
      <ServicesGrid />
      <ProofTestimonials />
      <LuxuryFAQ />
      <LuxuryCTA />
      <LuxuryFooter />
    </LuxuryShell>
  );
}
