import type { Metadata } from "next";
import { Suspense } from "react";
import StartClient, { type StartOption } from "./StartClient";
import { USE_CASES, TEMPLATES } from "../lib/marketingCatalog";

export const metadata: Metadata = {
  title: "Start",
  description: "Start a project and open the builder.",
  robots: { index: true, follow: true },
};

function toStartOption(items: Array<{ slug: string; title: string; description: string; tag?: string }>): StartOption[] {
  return items.map((x) => ({
    slug: x.slug,
    title: x.title,
    description: x.description,
    tag: x.tag,
  }));
}

export default function StartPage() {
  const useCases = toStartOption(USE_CASES);
  const templates = toStartOption(TEMPLATES);

  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-600">Loading…</div>}>
      <StartClient useCases={useCases} templates={templates} />
    </Suspense>
  );
}
