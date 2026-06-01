import type { CSSProperties } from "react";

/* Stroke UI icons — path data in a map, rendered as inline SVG.
   Ported 1:1 from js/components.jsx + additions for theme/runner/nav. */
export const ICONS: Record<string, string> = {
  // ── ported ──
  home: "M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  trophy: "M7 4h10v4a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 18h6M10 18v-3M14 18v-3M8 21h8",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16",
  flame: "M12 3c0 4-4 5-4 9a4 4 0 0 0 8 0c0-1.5-1-2.5-1-4 2 1 3 3 3 5a6 6 0 1 1-12 0c0-5 6-6 6-10z",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  target: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0",
  clock: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 7v5l3 2",
  check: "M5 12l5 5L20 6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  arrowUp: "M12 19V6M6 12l6-6 6 6",
  arrowDown: "M12 5v13M6 12l6 6 6-6",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  play: "M7 5v14l12-7z",
  refresh: "M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5",
  idea: "M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.7.7-1 1.2-1 2.5H9c0-1.3-.3-1.8-1-2.5A6 6 0 0 1 12 3z",
  star: "M12 3l2.6 6.2 6.7.5-5.1 4.4 1.6 6.5L12 17.7 6.2 21.1l1.6-6.5L2.7 9.7l6.7-.5z",
  minus: "M6 12h12",
  chevron: "M9 6l6 6-6 6",
  // ── additions ──
  sun: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
  terminal: "M4 5h16v14H4zM7 9l3 3-3 3M12 15h5",
  alert: "M12 3l9 16H3zM12 10v4M12 17.3v.4",
  external: "M14 4h6v6M20 4l-9 9M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6",
  smartphone: "M7 3h10v18H7zM10.5 18h3",
  tablet: "M5 3h14v18H5zM10.5 18h3",
  monitor: "M3 4h18v12H3zM8 20h8M12 16v4",
  plus: "M12 5v14M5 12h14",
  x: "M6 6l12 12M18 6L6 18",
  list: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
  book: "M5 4h10a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2zM17 18H7",
  clipboard: "M9 4h6v3H9zM7 5H5v15h14V5h-2M9 11h6M9 15h4",
  beaker: "M9 3h6M10 3v6l-5.2 9a2 2 0 0 0 1.8 3h10.8a2 2 0 0 0 1.8-3L14 9V3M7.5 15h9",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  crown: "M4 18 L20 18 L21 8 L15.5 11.5 L12 5 L8.5 11.5 L3 8 Z",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
};

export type IconName = keyof typeof ICONS | string;

export function Icon({
  name,
  size = 19,
  fill = false,
  className,
  style,
}: {
  name: IconName;
  size?: number;
  fill?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const d = ICONS[name] || "";
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d
        .split("M")
        .filter(Boolean)
        .map((seg, i) => (
          <path key={i} d={"M" + seg} />
        ))}
    </svg>
  );
}
