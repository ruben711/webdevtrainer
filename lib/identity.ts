/* Anonymous-by-default identity, stored in localStorage. The user can pick a
   display name; otherwise they're "Speler<xxxx>". */

import type { NameStyle } from "./nameStyle";

const ID_KEY = "ck-uid";
const NAME_KEY = "ck-name";
const STYLE_KEY = "ck-namestyle";

export function getUserId(): string {
  if (typeof window === "undefined") return "server";
  let id = "";
  try {
    id = localStorage.getItem(ID_KEY) || "";
    if (!id) {
      id = "u" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
      localStorage.setItem(ID_KEY, id);
    }
  } catch {
    id = "anon";
  }
  return id;
}

export function getName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(NAME_KEY);
  } catch {
    return null;
  }
}

export function setName(name: string): void {
  try {
    localStorage.setItem(NAME_KEY, name.trim().slice(0, 24));
  } catch {
    /* ignore */
  }
}

export function displayName(): string {
  return getName() || "Speler" + getUserId().slice(-4);
}

export function getStyle(): NameStyle | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(STYLE_KEY);
    return s ? (JSON.parse(s) as NameStyle) : null;
  } catch {
    return null;
  }
}

export function setStyle(style: NameStyle | null): void {
  try {
    if (!style) localStorage.removeItem(STYLE_KEY);
    else localStorage.setItem(STYLE_KEY, JSON.stringify(style));
  } catch {
    /* ignore */
  }
}
