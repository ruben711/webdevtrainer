import type { Chapter, ChapterContent, Exercise, TheoryItem } from "@/lib/types";
import { labo13 } from "./labos/labo13";
import { labo14 } from "./labos/labo14";
import { labo15 } from "./labos/labo15";
import { labo16 } from "./labos/labo16";
import { labo17 } from "./labos/labo17";
import { labo18 } from "./labos/labo18";
import { labo19 } from "./labos/labo19";
import { labo20 } from "./labos/labo20";
import { labo21 } from "./labos/labo21";
import { labo22 } from "./labos/labo22";

/* All labo chapters, in order. Built from the per-labo modules in data/labos/. */
export const CONTENT: ChapterContent[] = [
  labo13,
  labo14,
  labo15,
  labo16,
  labo17,
  labo18,
  labo19,
  labo20,
  labo21,
  labo22,
];

export const chapters: Chapter[] = CONTENT.map((c) => ({
  ...c.chapter,
  total: c.exercises.length,
  done: 0, // live progress comes from the store
  locked: false,
}));

export const exercises: Exercise[] = CONTENT.flatMap((c) => c.exercises);

export const exercisesByChapter: Record<string, Exercise[]> = Object.fromEntries(
  CONTENT.map((c) => [c.chapter.id, c.exercises])
);

export const theoryByChapter: Record<string, { title: string; items: TheoryItem[] }> =
  Object.fromEntries(CONTENT.map((c) => [c.chapter.id, { title: c.chapter.title, items: c.theory }]));

export function getExercise(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}
export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export const firstExerciseId = exercises[0]?.id ?? "";
