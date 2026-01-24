type Props = {
  left: string;
  right: string;
};

export default function StatPill({ left, right }: Props) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 backdrop-blur">
      <span className="font-semibold text-white">{left}</span>
      <span className="text-white/40">•</span>
      <span>{right}</span>
    </div>
  );
}
