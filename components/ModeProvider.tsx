"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  applyTheme,
  getStoredPref,
  resolveTheme,
  storePref,
  systemTheme,
  type ResolvedTheme,
  type ThemePref,
} from "@/lib/theme";

type ModeCtx = {
  pref: ThemePref;
  resolved: ResolvedTheme;
  setPref: (p: ThemePref) => void;
  toggle: () => void;
};

const Ctx = createContext<ModeCtx | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  // Start with "dark" so SSR markup is deterministic; the inline anti-FOUC
  // script already set the real <html data-theme> before paint, and the
  // effect below syncs React state to it on mount.
  const [pref, setPrefState] = useState<ThemePref>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    const p = getStoredPref();
    const r = resolveTheme(p);
    setPrefState(p);
    setResolved(r);
    applyTheme(r);
    // enable colour transitions only after the first paint
    requestAnimationFrame(() =>
      document.documentElement.classList.add("theme-ready")
    );
  }, []);

  // follow the OS when the user is on "system"
  useEffect(() => {
    if (pref !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const r = systemTheme();
      setResolved(r);
      applyTheme(r);
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [pref]);

  const setPref = useCallback((p: ThemePref) => {
    setPrefState(p);
    storePref(p);
    const r = resolveTheme(p);
    setResolved(r);
    applyTheme(r);
  }, []);

  const toggle = useCallback(() => {
    setPref(resolved === "dark" ? "light" : "dark");
  }, [resolved, setPref]);

  return (
    <Ctx.Provider value={{ pref, resolved, setPref, toggle }}>{children}</Ctx.Provider>
  );
}

export function useMode(): ModeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMode must be used within ModeProvider");
  return ctx;
}
