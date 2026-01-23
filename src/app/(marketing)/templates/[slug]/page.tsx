import Link from "next/link";
import MarketingCTA from "@/src/components/marketing/MarketingCTA";
import { templates } from "@/src/lib/marketing/catalog";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: Props) {
  const item = templates.find((t) => t.slug === params.slug);
  if (!item) {
    return {
      title: "Template — Dominat8",
      description: "Templates for Dominat8, the AI website automation builder.",
    };
  }

  return {
    title: `${item.name} — Template — Dominat8`,
    description: item.description,
  };
}

export default function TemplateSlugPage({ params }: Props) {
  const item = templates.find((t) => t.slug === params.slug);

  if (!item) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Template not found</h1>
        <p className="mt-2 opacity-80">
          That page doesn’t exist. Try the{" "}
          <Link href="/templates" className="underline">
            templates list
          </Link>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-6">
        <Link href="/templates" className="text-sm opacity-70 hover:opacity-100">
          ← Back to templates
        </Link>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight">{item.name}</h1>
      <p className="mt-3 text-base opacity-80">{item.description}</p>

      <div className="mt-8 space-y-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold">Includes</div>
        <ul className="list-disc space-y-2 pl-6 text-sm opacity-80">
          {item.includes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>

      <div className="mt-10 rounded-2xl border border-black/10 bg-black/[0.02] p-6">
        <div className="text-sm font-semibold">Next step</div>
        <p className="mt-2 text-sm opacity-80">
          Use this template as your starting point, then let the agents refine SEO + conversion.
        </p>
        <div className="mt-4">
          <MarketingCTA />
        </div>
      </div>
    </main>
  );
}