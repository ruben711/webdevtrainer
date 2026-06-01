export type ThemePref = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_KEY = "ck-theme";

/**
 * Inline anti-FOUC script. Runs in <head> BEFORE first paint so the correct
 * `data-theme` is on <html> immediately — no flash of the wrong palette.
 * Kept dependency-free and wrapped in try/catch (private-mode localStorage).
 */
export const THEME_SCRIPT = `(function(){try{var k="${THEME_KEY}";var s=localStorage.getItem(k);var sys=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var t=(s==="light"||s==="dark")?s:sys;document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export function getStoredPref(): ThemePref {
  if (typeof window === "undefined") return "system";
  try {
    const s = localStorage.getItem(THEME_KEY);
    if (s === "light" || s === "dark") return s;
  } catch {
    /* ignore */
  }
  return "system";
}

export function systemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(pref: ThemePref): ResolvedTheme {
  return pref === "system" ? systemTheme() : pref;
}

export function applyTheme(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", resolved);
}

export function storePref(pref: ThemePref): void {
  try {
    if (pref === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, pref);
  } catch {
    /* ignore */
  }
}
