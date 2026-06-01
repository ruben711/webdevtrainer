/* ════════════════════════════════════════════════════════════════════
   CodeKwartier — domain types
   ════════════════════════════════════════════════════════════════════ */

export type Difficulty = "easy" | "medium" | "hard" | "insane";
export type Tag = "HTML" | "CSS" | "JS";

/* ---------- files ---------- */
export interface FileSpec {
  name: string; // e.g. "index.html", "js/helpers.js"
  content: string;
  /** read-only files are shown but not editable (scaffold the student keeps) */
  readOnly?: boolean;
}

/* ════════════════════════════════════════════════════════════════════
   GRADING — 5 strategies (discriminated union on `type`).
   Each check carries an `id` + `label` so it maps to one objective row.
   Implemented in lib/jsGrader.ts (runs inside the sandboxed iframe).
   ════════════════════════════════════════════════════════════════════ */

/** 1. console-output — capture console + compare */
export interface ConsoleCheck {
  type: "console";
  id: string;
  label: string;
  expected: string;
  /** equals (default) trims & compares whole output; includes = substring */
  match?: "equals" | "includes";
  /** which console levels to include (default: ["log"]) */
  levels?: ConsoleLevel[];
}

/** 2. function-return — call a global function, compare return values */
export interface FunctionCase {
  args: unknown[];
  expected: unknown;
}
export interface FunctionCheck {
  type: "function";
  id: string;
  label: string;
  name: string; // global function name to call
  cases: FunctionCase[];
}

/** simulated user actions run before assertions (dom + css checks) */
export interface DomAction {
  action: "click" | "input" | "submit";
  selector: string;
  value?: string; // for input
  times?: number; // default 1
}

/** 3. dom-assertion — check the DOM after execution */
export interface DomAssertion {
  selector: string;
  textEquals?: string;
  textIncludes?: string;
  exists?: boolean;
  count?: number;
  htmlIncludes?: string;
  attrEquals?: { name: string; value: string };
}
export interface DomCheck {
  type: "dom";
  id: string;
  label: string;
  before?: DomAction[];
  assertions: DomAssertion[];
}

/** 4. css-check — computed styles */
export interface CssAssertion {
  selector: string;
  property: string;
  equals?: string;
  /** regex source, with or without slashes, e.g. "\\d+px" or "/\\d+px/" */
  matches?: string;
}
export interface CssCheck {
  type: "css";
  id: string;
  label: string;
  before?: DomAction[];
  checks: CssAssertion[];
}

/** 5. static — regex / substring checks on source */
export interface StaticCheck {
  type: "static";
  id: string;
  label: string;
  /** filename to scan; default: all .js files concatenated */
  file?: string;
  /** each entry: literal substring, or "/regex/flags" */
  must?: string[];
  mustNot?: string[];
}

export type GradeCheck =
  | ConsoleCheck
  | FunctionCheck
  | DomCheck
  | CssCheck
  | StaticCheck;

export type GradeType = GradeCheck["type"];

/* ---------- grading results (harness -> parent) ---------- */
export type ConsoleLevel = "log" | "info" | "warn" | "error";

export interface ConsoleEntry {
  level: ConsoleLevel;
  text: string;
  t: number; // ms since run start
}

export interface SubResult {
  label: string;
  pass: boolean;
  detail?: string;
}

export interface CheckResult {
  id: string;
  label: string;
  type: GradeType;
  pass: boolean;
  detail?: string;
  cases?: SubResult[];
}

/* messages posted from the sandboxed iframe back to the parent */
export type RunnerMessage =
  | { source: "ck-runner"; kind: "console"; entry: ConsoleEntry }
  | { source: "ck-runner"; kind: "error"; text: string; stack?: string }
  | { source: "ck-runner"; kind: "ready" }
  | { source: "ck-runner"; kind: "results"; results: CheckResult[] };

/* ---------- exercise ---------- */
export interface ExerciseExample {
  label?: string;
  input?: string;
  output?: string;
}

export interface Exercise {
  id: string;
  chapterId: string;
  chapter: string; // display name, e.g. "DOM Manipulatie"
  n: number;
  of: number;
  title: string;
  tag: Tag;
  difficulty: Difficulty;
  brief: string; // <code>-marked inline; rendered with code spans
  hint?: string;
  topics?: string[];
  examples?: ExerciseExample[];
  files: FileSpec[];
  checks: GradeCheck[];
  /** filename -> full content, applied by "toon modeloplossing" */
  solution?: Record<string, string>;
}

/* ---------- theory (study-mode, no XP) ---------- */
export interface TheoryItem {
  id: string;
  type: "mc" | "open";
  question: string;
  /** mc only: answer choices */
  options?: string[];
  /** mc only: index into options that is correct */
  correctIndex?: number;
  /** open only: model answer */
  answer?: string;
  explanation?: string;
}

/* one labo/hoofdstuk worth of content (written per-labo in data/labos/laboNN.ts) */
export interface ChapterMeta {
  id: string; // e.g. "labo13"
  n: string; // e.g. "13"
  title: string;
  desc: string;
  tag: Tag;
  difficulty: Difficulty;
}
export interface ChapterContent {
  chapter: ChapterMeta;
  theory: TheoryItem[];
  exercises: Exercise[];
}

/* ---------- chapters / users / leaderboard (mock for now) ---------- */
export interface Chapter {
  id: string;
  n: string; // "01"
  title: string;
  desc: string;
  tag: Tag;
  total: number;
  done: number;
  difficulty: Difficulty;
  locked: boolean;
}

export interface User {
  name: string;
  handle: string;
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  rank: number;
  solved: number;
  accuracy: number;
  minutes: number;
}

export interface LeaderboardRow {
  rank: number;
  name: string;
  handle: string;
  xp: number;
  level: number;
  streak: number;
  delta: number;
  you: boolean;
}

export interface ActivityDay {
  day: string;
  v: number;
}

export interface Badge {
  id: string;
  icon: string;
  label: string;
  got: boolean;
}
