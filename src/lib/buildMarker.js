/**
 * buildMarker.js
 * JS-visible exports for marketing .jsx pages.
 * Keep build-safe and deterministic.
 */

export const BUILD_MARKER =
  process.env.NEXT_PUBLIC_BUILD_MARKER ||
  process.env.NEXT_PUBLIC_BUILD_STAMP ||
  process.env.BUILD_STAMP ||
  "BUILD_MARKER_LOCAL";

export const MONSTER_MARKER =
  process.env.NEXT_PUBLIC_MONSTER_MARKER ||
  "MONSTER_MARKER_LOCAL";