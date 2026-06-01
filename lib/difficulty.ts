import type { Difficulty } from "./types";

export const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard", "insane"];

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  insane: "Insane",
};

/** chip class from styles-extras.css (easy→accent, medium→cyan, hard→warn, insane→bad) */
export const DIFFICULTY_CLASS: Record<Difficulty, string> = {
  easy: "diff-easy",
  medium: "diff-medium",
  hard: "diff-hard",
  insane: "diff-insane",
};

/** colour token used for rings / inline accents per difficulty */
export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: "var(--accent)",
  medium: "var(--cyan)",
  hard: "var(--warn)",
  insane: "var(--bad)",
};

/* ── XP rules (flat per first correct solve; configurable + versioned) ── */
export const XP_RULES = {
  version: 1,
  perSolve: 25,
} as const;

/** Insane levels award 0 XP; everything else the flat per-solve amount. */
export function xpForDifficulty(d: Difficulty): number {
  return d === "insane" ? 0 : XP_RULES.perSolve;
}
