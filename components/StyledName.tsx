"use client";

import type { CSSProperties } from "react";

export interface NameStyle {
  color?: string;
  gradient?: [string, string];
  glow?: boolean;
}
export interface NameTag {
  label: string;
  color: string;
  emoji?: string;
}

/* Basic name rendering: admin crown (glowing gold) + optional colour/gradient
   + optional custom tag. The richer effects (particles, rainbow, …) from the
   spec can be layered on later via the `style` object. */
export function StyledName({
  name,
  admin = false,
  tag = null,
  style = null,
  size = 15,
}: {
  name: string;
  admin?: boolean;
  tag?: NameTag | null;
  style?: NameStyle | null;
  size?: number;
}) {
  const css: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: size,
  };
  if (style?.gradient) {
    css.background = `linear-gradient(90deg, ${style.gradient[0]}, ${style.gradient[1]})`;
    css.WebkitBackgroundClip = "text";
    css.backgroundClip = "text";
    css.color = "transparent";
  } else if (style?.color) {
    css.color = style.color;
  }
  if (style?.glow && style?.color) {
    css.textShadow = `0 0 10px ${style.color}88`;
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, minWidth: 0 }}>
      {admin && (
        <span
          title="Beheerder"
          style={{ filter: "drop-shadow(0 0 5px rgba(245,196,81,0.7))", fontSize: size - 1 }}
        >
          👑
        </span>
      )}
      <span style={css}>{name}</span>
      {tag && (
        <span
          className="chip"
          style={{
            padding: "2px 8px",
            fontSize: 10.5,
            color: tag.color,
            borderColor: tag.color + "55",
            background: tag.color + "1a",
          }}
        >
          {tag.emoji ? tag.emoji + " " : ""}
          {tag.label}
        </span>
      )}
    </span>
  );
}
