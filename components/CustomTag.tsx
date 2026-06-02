import type { CSSProperties } from "react";
import { contrastText, darken, lighten } from "@/lib/color";
import type { NameTag } from "@/lib/nameStyle";

/* Glossy custom tag — same shine/relief treatment as the admin badge, but in
   any colour. Admins assign these (label + colour + optional emoji) to users. */
export function CustomTag({ label, color, emoji, size = 9.5 }: NameTag & { size?: number }) {
  const c = color || "#888888";
  const style: CSSProperties = {
    background: `linear-gradient(180deg, ${lighten(c, 0.45)} 0%, ${c} 48%, ${darken(c, 0.3)} 100%)`,
    color: contrastText(c),
    borderColor: lighten(c, 0.5),
    fontSize: size,
    // glow colour for the box-shadow
    ["--tag-glow" as string]: c + "cc",
  };
  return (
    <span className="custom-tag" style={style} title={label}>
      {emoji ? <span style={{ fontSize: "1.15em", lineHeight: 1 }}>{emoji}</span> : null}
      {label}
    </span>
  );
}
