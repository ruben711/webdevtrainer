"use client";

import type { CSSProperties } from "react";
import { AdminBadge } from "@/components/AdminBadge";
import type { NameStyle, NameTag } from "@/lib/nameStyle";

const FONT_FAMILY: Record<string, string> = {
  display: "var(--font-display)",
  mono: "var(--font-mono)",
  pixel: "'Press Start 2P', var(--font-mono)",
};

export function StyledName({
  name,
  admin = false,
  tag = null,
  style = null,
  size = 15,
  badgeCompact = false,
}: {
  name: string;
  admin?: boolean;
  tag?: NameTag | null;
  style?: NameStyle | null;
  size?: number;
  badgeCompact?: boolean;
}) {
  const s = style || {};
  const anim = s.animation || "none";
  const font = s.font || "display";
  const isPixel = font === "pixel";

  const css: CSSProperties = {
    fontFamily: FONT_FAMILY[font] || FONT_FAMILY.display,
    fontWeight: 600,
    fontSize: isPixel ? Math.round(size * 0.72) : size,
    lineHeight: 1.2,
  };

  const classes = ["ck-nm"];
  if (anim === "rainbow") {
    classes.push("ck-nm-rainbow"); // class owns the animated gradient text
  } else if (s.gradient) {
    css.background = `linear-gradient(90deg, ${s.gradient[0]}, ${s.gradient[1]})`;
    css.WebkitBackgroundClip = "text";
    css.backgroundClip = "text";
    css.color = "transparent";
  } else if (s.color) {
    css.color = s.color;
  }
  if (anim === "pulse") classes.push("ck-nm-pulse");
  if (anim === "shake") classes.push("ck-nm-shake");
  if (s.stroke) classes.push("ck-nm-stroke");
  if (s.glow) {
    const g = s.color || (s.gradient && s.gradient[0]) || "var(--accent)";
    css.filter = `drop-shadow(0 0 6px ${g})`;
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, minWidth: 0 }}>
      {admin && <AdminBadge compact={badgeCompact} />}
      <span className={classes.join(" ")} style={css}>
        {name}
      </span>
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
