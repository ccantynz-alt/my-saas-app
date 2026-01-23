import Link from "next/link";
import MarketingCTA from "@/src/components/marketing/MarketingCTA";
import { useCases } from "@/src/lib/marketing/catalog";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return useCases.map((u) => ({ slug: u.slug }));
}

export function generateMetadata({ params }: Props) {
  const item = useCases.find((u) => u.slug === params.slug);
  if (!item) {
    return {
      title: "Use case — Dominat8",
      description: "Use cases for Dominat8, the AI website automation builder.",
    };
  }

  return {
    title: `${item.title} — Dominat8`,
    description: item.summary,
  };
}

export default function UseCaseSlugPage({ params }: Props) {
  const item = useCases.find((u) => u.slug === params.slug);

  if (!item) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Use case not found</h1>
        <p className="mt-2 opacity-80">
          That page doesn’t exist. Try the{" "}
          <Link href="/use-cases" className="underline">
            use-cases list
          </Link>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-6">
        <Link href="/use-cases" className="text-sm opacity-70 hover:opacity-100">
          ← Back to use cases
        </Link>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
      <p className="mt-3 text-base opacity-80">{item.summary}</p>

      <div className="mt-8 space-y-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold">Why it works</div>
        <ul className="list-disc space-y-2 pl-6 text-sm opacity-80">
          {item.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      <div className="mt-10 rounded-2xl border border-black/10 bg-black/[0.02] p-6">
        <div className="text-sm font-semibold">Next step</div>
        <p className="mt-2 text-sm opacity-80">
          Generate a site tailored to this use case in minutes.
        </p>
        <div className="mt-4">
          <MarketingCTA />
        </div>
      </div>
    </main>
  );
}