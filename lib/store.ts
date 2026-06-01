import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Difficulty, Exercise, FileSpec } from "./types";
import { xpForDifficulty, XP_RULES } from "./difficulty";
import { levelInfo } from "./level";

function todayStr(d = new Date()): string {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}
function dayDiff(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

export interface SolvedEntry {
  at: number;
  difficulty: Difficulty;
  xp: number;
}
export interface Attempt {
  id: string;
  title: string;
  at: number;
  passed: boolean;
}

export interface RecordResult {
  awarded: number;
  firstSolve: boolean;
  leveledUp: boolean;
  newLevel: number;
}

interface ProgressState {
  xpRulesVersion: number;
  xp: number;
  solved: Record<string, SolvedEntry>;
  files: Record<string, FileSpec[]>;
  favorites: string[];
  notes: Record<string, string>;
  attempts: Attempt[];
  streakCount: number;
  streakLastDay: string | null;

  isSolved: (id: string) => boolean;
  isFavorite: (id: string) => boolean;
  solvedCount: () => number;

  recordAttempt: (ex: Exercise, passed: boolean) => RecordResult;
  saveFiles: (id: string, files: FileSpec[]) => void;
  toggleFavorite: (id: string) => void;
  setNote: (id: string, note: string) => void;
  resetExercise: (id: string) => void;
  resetAll: () => void;
  recalcXp: () => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      xpRulesVersion: XP_RULES.version,
      xp: 0,
      solved: {},
      files: {},
      favorites: [],
      notes: {},
      attempts: [],
      streakCount: 0,
      streakLastDay: null,

      isSolved: (id) => !!get().solved[id],
      isFavorite: (id) => get().favorites.includes(id),
      solvedCount: () => Object.keys(get().solved).length,

      recordAttempt: (ex, passed) => {
        const s = get();
        const now = Date.now();
        const today = todayStr();

        // streak: any activity counts toward the daily streak
        let streakCount = s.streakCount;
        if (s.streakLastDay !== today) {
          const gap = s.streakLastDay ? dayDiff(s.streakLastDay, today) : Infinity;
          streakCount = gap === 1 ? s.streakCount + 1 : 1;
        }

        const attempts = [
          { id: ex.id, title: ex.title, at: now, passed },
          ...s.attempts,
        ].slice(0, 30);

        const before = levelInfo(s.xp).level;
        let awarded = 0;
        let firstSolve = false;
        let solved = s.solved;
        let xp = s.xp;

        if (passed && !s.solved[ex.id]) {
          awarded = xpForDifficulty(ex.difficulty);
          firstSolve = true;
          solved = { ...s.solved, [ex.id]: { at: now, difficulty: ex.difficulty, xp: awarded } };
          xp = s.xp + awarded;
        }

        const newLevel = levelInfo(xp).level;
        set({ xp, solved, attempts, streakCount, streakLastDay: today });
        return { awarded, firstSolve, leveledUp: newLevel > before, newLevel };
      },

      saveFiles: (id, files) =>
        set((s) => ({ files: { ...s.files, [id]: files.map((f) => ({ ...f })) } })),

      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((x) => x !== id)
            : [...s.favorites, id],
        })),

      setNote: (id, note) => set((s) => ({ notes: { ...s.notes, [id]: note } })),

      resetExercise: (id) =>
        set((s) => {
          const solved = { ...s.solved };
          const wasXp = solved[id]?.xp || 0;
          delete solved[id];
          const files = { ...s.files };
          delete files[id];
          return { solved, files, xp: Math.max(0, s.xp - wasXp) };
        }),

      resetAll: () =>
        set({
          xp: 0,
          solved: {},
          files: {},
          favorites: [],
          notes: {},
          attempts: [],
          streakCount: 0,
          streakLastDay: null,
        }),

      // recompute total XP from solved entries using the CURRENT rules
      recalcXp: () =>
        set((s) => {
          const solved: Record<string, SolvedEntry> = {};
          let xp = 0;
          for (const [id, e] of Object.entries(s.solved)) {
            const v = xpForDifficulty(e.difficulty);
            solved[id] = { ...e, xp: v };
            xp += v;
          }
          return { solved, xp, xpRulesVersion: XP_RULES.version };
        }),
    }),
    {
      name: "ck-progress",
      version: 1,
      partialize: (s) => ({
        xpRulesVersion: s.xpRulesVersion,
        xp: s.xp,
        solved: s.solved,
        files: s.files,
        favorites: s.favorites,
        notes: s.notes,
        attempts: s.attempts,
        streakCount: s.streakCount,
        streakLastDay: s.streakLastDay,
      }),
      // if XP rules changed since last visit, recalc once on rehydrate
      onRehydrateStorage: () => (state) => {
        if (state && state.xpRulesVersion !== XP_RULES.version) state.recalcXp();
      },
    }
  )
);
