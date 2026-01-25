import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import MarketingCTA from "@/src/components/marketing/MarketingCTA";
import { marketingCatalog } from "@/src/lib/marketing/catalog";

type Props = {
  params: { slug: string };
};

function slugToTitle(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function pickUseCase(slug: string) {
  const root: any = marketingCatalog as any;

  const list: any[] =
    (Array.isArray(root?.useCases) && root.useCases) ||
    (Array.isArray(root?.useCaseCards) && root.useCaseCards) ||
    (Array.isArray(root?.items) && root.items) ||
    [];

  const hit =
    list.find((u) => u?.slug === slug) ||
    list.find((u) => u?.id === slug) ||
    list.find((u) => u?.key === slug) ||
    null;

  return { list, hit };
}

export function generateStaticParams() {
  const root: any = marketingCatalog as any;
  const list: any[] =
    (Array.isArray(root?.useCases) && root.useCases) ||
    (Array.isArray(root?.useCaseCards) && root.useCaseCards) ||
    (Array.isArray(root?.items) && root.items) ||
    [];

  const slugs = list
    .map((u) => u?.slug ?? u?.id ?? u?.key)
    .filter((v) => typeof v === "string");

  return Array.from(new Set(slugs)).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const { hit } = pickUseCase(params.slug);

  if (!hit) return { title: "Use Case Not Found" };

  const anyU = hit as Record<string, any>;

  const title =
    anyU.title ||
    anyU.name ||
    anyU.label ||
    slugToTitle(params.slug);

  const description =
    anyU.description ||
    anyU.summary ||
    `Explore how Dominat8 helps with ${title}.`;

  return {
    title: `${title} — Use Case`,
    description,
  };
}

export default function UseCasePage({ params }: Props) {
  const { hit } = pickUseCase(params.slug);
  if (!hit) notFound();

  const anyU = hit as Record<string, any>;

  const title =
    anyU.title ||
    anyU.name ||
    anyU.label ||
    slugToTitle(params.slug);

  const description =
    anyU.description ||
    anyU.summary ||
    `See how this use case works with Dominat8.`;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-[0.28em] text-white/60">
            Use Cases
          </div>

          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-white/70">
            {description}
          </p>

          <div className="mt-8 flex gap-3">
            <MarketingCTA />

            <Link
              href="/use-cases"
              className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 hover:border-white/40"
            >
              Back to use cases
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}