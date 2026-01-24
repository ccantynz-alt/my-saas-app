export const runtime = "nodejs";

import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingFeatures from "@/components/marketing/MarketingFeatures";
import MarketingProof from "@/components/marketing/MarketingProof";
import MarketingSteps from "@/components/marketing/MarketingSteps";
import MarketingCTA from "@/components/marketing/MarketingCTA_v2";
import MarketingFAQ from "@/components/marketing/MarketingFAQ";

export default function HomePage() {
  return (
    <main
      className="min-h-screen bg-white text-black"
      data-x-home-ok="HOME_OK"
    >
      {/* HOME_OK marker for truth test. If you see this page, / is not _not-found. */}
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <MarketingHero />
        <MarketingProof />
        <MarketingFeatures />
        <MarketingSteps />
        <MarketingCTA />
        <MarketingFAQ />

        <footer className="mt-14 border-t border-black/10 pt-8 text-sm opacity-70">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Dominat8</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a className="hover:underline" href="/pricing">Pricing</a>
              <a className="hover:underline" href="/templates">Templates</a>
              <a className="hover:underline" href="/use-cases">Use Cases</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}