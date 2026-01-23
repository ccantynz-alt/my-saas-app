import type { MarketingFaqItem } from "@/src/lib/marketing/faq";

type Props = {
  title?: string;
  items: MarketingFaqItem[];
};

export default function MarketingFAQ({ title = "FAQs", items }: Props) {
  return (
    <section className="mt-10 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">
        {items.map((it) => (
          <div key={it.q} className="rounded-xl border border-black/10 p-4">
            <div className="text-sm font-semibold">{it.q}</div>
            <div className="mt-2 text-sm opacity-80">{it.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}