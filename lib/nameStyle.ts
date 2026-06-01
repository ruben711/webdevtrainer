/* Self-service name styling — every user can style their own display name.
   Kept to a tasteful, performant set (no per-name particle systems on the
   leaderboard). The chosen style lives in localStorage and syncs to the
   leaderboard so everyone sees it. */

export type NameFont = "display" | "mono" | "pixel";
export type NameAnimation = "none" | "rainbow" | "pulse" | "shake";

export interface NameStyle {
  color?: string | null;
  gradient?: [string, string] | null;
  glow?: boolean;
  font?: NameFont;
  animation?: NameAnimation;
  stroke?: boolean;
}

export interface NameTag {
  label: string;
  color: string;
  emoji?: string;
}

export const COLOR_PRESETS: { label: string; value: string | null }[] = [
  { label: "Standaard", value: null },
  { label: "Lime", value: "#c4f542" },
  { label: "Cyaan", value: "#34e3da" },
  { label: "Magenta", value: "#ff5da2" },
  { label: "Oranje", value: "#ff8a3d" },
  { label: "Goud", value: "#f5c451" },
  { label: "Rood", value: "#ff5d4d" },
  { label: "Violet", value: "#a78bfa" },
  { label: "Blauw", value: "#5a9bff" },
];

export const GRADIENT_PRESETS: { label: string; value: [string, string] | null }[] = [
  { label: "Geen", value: null },
  { label: "Zonsondergang", value: ["#ff8a3d", "#ff5da2"] },
  { label: "Aurora", value: ["#34e3da", "#7c9bff"] },
  { label: "Lime → cyaan", value: ["#c4f542", "#34e3da"] },
  { label: "Vuur", value: ["#f5c451", "#ff5d4d"] },
  { label: "Violet", value: ["#a78bfa", "#ff5da2"] },
];

export const FONT_OPTIONS: { label: string; value: NameFont }[] = [
  { label: "Standaard", value: "display" },
  { label: "Mono", value: "mono" },
  { label: "Pixel", value: "pixel" },
];

export const ANIMATION_OPTIONS: { label: string; value: NameAnimation }[] = [
  { label: "Geen", value: "none" },
  { label: "Regenboog", value: "rainbow" },
  { label: "Pulse", value: "pulse" },
  { label: "Shake", value: "shake" },
];

export const EMPTY_STYLE: NameStyle = {
  color: null,
  gradient: null,
  glow: false,
  font: "display",
  animation: "none",
  stroke: false,
};

/* server-side sanitiser: only let through known-safe shapes */
const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
export function sanitizeStyle(input: unknown): NameStyle | null {
  if (!input || typeof input !== "object") return null;
  const s = input as Record<string, unknown>;
  const out: NameStyle = {};
  if (typeof s.color === "string" && HEX.test(s.color)) out.color = s.color;
  if (Array.isArray(s.gradient) && s.gradient.length === 2 && s.gradient.every((c) => typeof c === "string" && HEX.test(c)))
    out.gradient = [s.gradient[0] as string, s.gradient[1] as string];
  if (typeof s.glow === "boolean") out.glow = s.glow;
  if (typeof s.stroke === "boolean") out.stroke = s.stroke;
  if (s.font === "display" || s.font === "mono" || s.font === "pixel") out.font = s.font;
  if (s.animation === "none" || s.animation === "rainbow" || s.animation === "pulse" || s.animation === "shake")
    out.animation = s.animation;
  return Object.keys(out).length ? out : null;
}
