type Props = {
  quote: string;
  name: string;
  title: string;
};

export default function TestimonialCard({ quote, name, title }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur">
      <div className="text-sm leading-6 text-white/75">“{quote}”</div>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/10" />
        <div>
          <div className="text-sm font-semibold text-white">{name}</div>
          <div className="text-xs text-white/60">{title}</div>
        </div>
      </div>
    </div>
  );
}
