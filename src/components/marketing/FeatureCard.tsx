type Props = {
  title: string;
  description: string;
};

export default function FeatureCard({ title, description }: Props) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.07] hover:shadow-[0_12px_50px_rgba(0,0,0,0.35)]">
      <div className="text-base font-semibold text-white">{title}</div>
      <div className="mt-2 text-sm leading-6 text-white/70">{description}</div>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mt-4 text-xs font-medium text-white/60">
        Built for speed • SEO-ready • publishable output
      </div>
    </div>
  );
}
