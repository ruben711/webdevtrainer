/* Tiny hex-colour helpers — used to build a glossy badge gradient (lighter top,
   darker bottom) + readable text from a single base colour. */

export function hexToRgb(hex: string): [number, number, number] {
  let h = (hex || "#000000").replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.padEnd(6, "0").slice(0, 6), 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (x: number) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0");
  return "#" + c(r) + c(g) + c(b);
}

function mix(a: [number, number, number], t: [number, number, number], amt: number): string {
  return rgbToHex(a[0] + (t[0] - a[0]) * amt, a[1] + (t[1] - a[1]) * amt, a[2] + (t[2] - a[2]) * amt);
}

export function lighten(hex: string, amt: number): string {
  return mix(hexToRgb(hex), [255, 255, 255], amt);
}
export function darken(hex: string, amt: number): string {
  return mix(hexToRgb(hex), [0, 0, 0], amt);
}

/** perceived lightness (0..255) */
export function lightness(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000;
}
export function isLight(hex: string): boolean {
  return lightness(hex) > 150;
}

/** readable text colour on a coloured pill: tinted-dark on light, white on dark */
export function contrastText(hex: string): string {
  return isLight(hex) ? darken(hex, 0.72) : "#ffffff";
}
