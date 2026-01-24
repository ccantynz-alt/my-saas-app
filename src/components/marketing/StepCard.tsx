type Props = {
  title: string;
  description: string;
  index: string;
};

export default function StepCard({ title, description, index }: Props) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur transition hover:bg-white/[0.07]">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-sm font-semibold text-white/80">
          {index}
        </div>
        <div>
          <div className="text-base font-semibold text-white">{title}</div>
          <div className="mt-2 text-sm leading-6 text-white/70">{description}</div>
        </div>
      </div>
    </div>
  );
}
