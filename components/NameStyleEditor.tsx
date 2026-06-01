"use client";

import { Icon } from "@/components/Icon";
import { StyledName } from "@/components/StyledName";
import {
  ANIMATION_OPTIONS,
  COLOR_PRESETS,
  FONT_OPTIONS,
  GRADIENT_PRESETS,
  type NameStyle,
} from "@/lib/nameStyle";

function Seg<T extends string>({
  options,
  value,
  onPick,
}: {
  options: { label: string; value: T }[];
  value: T;
  onPick: (v: T) => void;
}) {
  return (
    <div className="segment">
      {options.map((o) => (
        <button key={o.value} className={value === o.value ? "on" : ""} onClick={() => onPick(o.value)} type="button">
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function NameStyleEditor({
  name,
  value,
  onChange,
}: {
  name: string;
  value: NameStyle;
  onChange: (s: NameStyle) => void;
}) {
  const set = (patch: Partial<NameStyle>) => onChange({ ...value, ...patch });
  const gradEq = (g: [string, string] | null | undefined, v: [string, string]) =>
    !!g && g[0] === v[0] && g[1] === v[1];

  return (
    <div>
      <div className="style-preview">
        <StyledName name={name || "Jouw naam"} style={value} size={24} />
      </div>

      <div className="style-field">
        <span className="label-mono">Kleur</span>
        <div className="swatch-row">
          {COLOR_PRESETS.map((c, i) =>
            c.value === null ? (
              <button
                key={i}
                type="button"
                className={`swatch none ${!value.color && !value.gradient ? "on" : ""}`}
                title="Geen"
                onClick={() => set({ color: null, gradient: null })}
              >
                <Icon name="x" size={14} />
              </button>
            ) : (
              <button
                key={i}
                type="button"
                className={`swatch ${value.color === c.value && !value.gradient ? "on" : ""}`}
                style={{ background: c.value }}
                title={c.label}
                onClick={() => set({ color: c.value, gradient: null })}
              />
            )
          )}
        </div>
      </div>

      <div className="style-field">
        <span className="label-mono">Gradient</span>
        <div className="swatch-row">
          {GRADIENT_PRESETS.map((g, i) =>
            g.value === null ? (
              <button
                key={i}
                type="button"
                className={`swatch none ${!value.gradient ? "on" : ""}`}
                title="Geen"
                onClick={() => set({ gradient: null })}
              >
                <Icon name="x" size={14} />
              </button>
            ) : (
              <button
                key={i}
                type="button"
                className={`swatch ${gradEq(value.gradient, g.value) ? "on" : ""}`}
                style={{ background: `linear-gradient(135deg, ${g.value[0]}, ${g.value[1]})` }}
                title={g.label}
                onClick={() => set({ gradient: g.value, color: null })}
              />
            )
          )}
        </div>
      </div>

      <div className="style-field">
        <span className="label-mono">Lettertype</span>
        <Seg options={FONT_OPTIONS} value={value.font || "display"} onPick={(v) => set({ font: v })} />
      </div>

      <div className="style-field">
        <span className="label-mono">Animatie</span>
        <Seg options={ANIMATION_OPTIONS} value={value.animation || "none"} onPick={(v) => set({ animation: v })} />
      </div>

      <div className="style-field" style={{ display: "flex", gap: 22 }}>
        <div>
          <span className="label-mono" style={{ display: "block", marginBottom: 8 }}>Gloed</span>
          <Seg
            options={[{ label: "Uit", value: "0" }, { label: "Aan", value: "1" }]}
            value={value.glow ? "1" : "0"}
            onPick={(v) => set({ glow: v === "1" })}
          />
        </div>
        <div>
          <span className="label-mono" style={{ display: "block", marginBottom: 8 }}>Rand</span>
          <Seg
            options={[{ label: "Uit", value: "0" }, { label: "Aan", value: "1" }]}
            value={value.stroke ? "1" : "0"}
            onPick={(v) => set({ stroke: v === "1" })}
          />
        </div>
      </div>
    </div>
  );
}
