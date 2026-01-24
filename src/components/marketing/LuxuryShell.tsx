// src/components/marketing/LuxuryShell.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function LuxuryShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="absolute top-32 left-1/2 h-[340px] w-[680px] -translate-x-1/2 rounded-full bg-white/[0.05] blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.10),transparent_58%)]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="relative">
        {children}
      </div>
    </div>
  );
}
