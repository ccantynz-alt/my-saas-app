export type D8VideoShot = {
  id: string;
  title: string;
  durationSec: number;
  bg?: string;
  lines: string[];
};

export type D8Storyboard = {
  brand: string;
  title: string;
  voiceover?: string[];
  shots: D8VideoShot[];
  createdAtIso: string;
  mode: "ai" | "fallback";
};

export function clampShotDurations(shots: D8VideoShot[]) {
  return shots.map(s => ({
    ...s,
    durationSec: Math.max(2, Math.min(12, Math.floor(s.durationSec || 6)))
  }));
}