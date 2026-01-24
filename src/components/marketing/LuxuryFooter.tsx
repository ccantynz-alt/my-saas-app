// src/components/marketing/LuxuryFooter.tsx
import Link from "next/link";
import { BRAND } from "@/src/lib/marketing/copy";

export default function LuxuryFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 pb-12 pt-6">
      <div className="rounded-2xl border border-white/[0.10] bg-white/[0.03] px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-white/70">
            <span className="font-semibold text-white">{BRAND.name}</span>{" "}
            <span className="text-white/50">©</span> {year}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <Link className="hover:text-white transition" href="/pricing">Pricing</Link>
            <Link className="hover:text-white transition" href="/templates">Templates</Link>
            <Link className="hover:text-white transition" href="/use-cases">Use cases</Link>
            <a className="hover:text-white transition" href={BRAND.url} rel="noreferrer">{BRAND.domain}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
