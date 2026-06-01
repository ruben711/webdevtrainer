"use client";

import { Icon } from "@/components/Icon";
import { useMode } from "@/components/ModeProvider";
import { useMounted } from "@/lib/useMounted";

export function ThemeToggle() {
  const { resolved, toggle } = useMode();
  const mounted = useMounted();
  // Until mounted we don't know the resolved theme for sure — render a neutral
  // icon to avoid a hydration mismatch.
  const isDark = !mounted || resolved === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      title={isDark ? "Licht thema" : "Donker thema"}
      aria-label={isDark ? "Schakel naar licht thema" : "Schakel naar donker thema"}
    >
      <Icon name={isDark ? "sun" : "moon"} size={18} />
    </button>
  );
}
