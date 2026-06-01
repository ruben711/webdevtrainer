import type {
  ActivityDay,
  Badge,
  Chapter,
  LeaderboardRow,
  User,
} from "@/lib/types";

/* Mock data (Dutch) ported from js/data.js, typed. Replaced by real
   localStorage progress + Upstash leaderboard in later milestones. */

export const user: User = {
  name: "Jij",
  handle: "@jij",
  level: 7,
  xp: 4820,
  xpToNext: 5200,
  streak: 12,
  rank: 4,
  solved: 73,
  accuracy: 89,
  minutes: 1140,
};

export const chapters: Chapter[] = [
  {
    id: "html",
    n: "01",
    title: "HTML Basis",
    desc: "Structuur, semantiek en de bouwstenen van elke pagina.",
    tag: "HTML",
    total: 12,
    done: 12,
    difficulty: "easy",
    locked: false,
  },
  {
    id: "css",
    n: "02",
    title: "CSS Styling",
    desc: "Selectors, het box-model, kleuren en typografie.",
    tag: "CSS",
    total: 14,
    done: 11,
    difficulty: "easy",
    locked: false,
  },
  {
    id: "layout",
    n: "03",
    title: "Flexbox & Grid",
    desc: "Moderne layouts bouwen die op elk scherm werken.",
    tag: "CSS",
    total: 16,
    done: 9,
    difficulty: "medium",
    locked: false,
  },
  {
    id: "js",
    n: "04",
    title: "JavaScript Basis",
    desc: "Variabelen, functies, condities en loops.",
    tag: "JS",
    total: 18,
    done: 6,
    difficulty: "medium",
    locked: false,
  },
  {
    id: "dom",
    n: "05",
    title: "DOM Manipulatie",
    desc: "De pagina aanpassen en tot leven brengen met JS.",
    tag: "JS",
    total: 15,
    done: 2,
    difficulty: "medium",
    locked: false,
  },
  {
    id: "events",
    n: "06",
    title: "Events & Formulieren",
    desc: "Reageren op de gebruiker en input verwerken.",
    tag: "JS",
    total: 13,
    done: 0,
    difficulty: "medium",
    locked: false,
  },
  {
    id: "responsive",
    n: "07",
    title: "Responsive Design",
    desc: "Media queries en mobiel-eerst denken.",
    tag: "CSS",
    total: 11,
    done: 0,
    difficulty: "hard",
    locked: true,
  },
  {
    id: "async",
    n: "08",
    title: "Async & Fetch",
    desc: "Data ophalen, promises en async/await.",
    tag: "JS",
    total: 14,
    done: 0,
    difficulty: "hard",
    locked: true,
  },
];

export const leaderboard: LeaderboardRow[] = [
  { rank: 1, name: "Lotte V.", handle: "@lotte", xp: 8420, level: 11, streak: 28, delta: 0, you: false },
  { rank: 2, name: "Sem D.", handle: "@semd", xp: 7980, level: 10, streak: 21, delta: 2, you: false },
  { rank: 3, name: "Noa K.", handle: "@noak", xp: 7110, level: 10, streak: 9, delta: -1, you: false },
  { rank: 4, name: "Jij", handle: "@jij", xp: 4820, level: 7, streak: 12, delta: 3, you: true },
  { rank: 5, name: "Daan B.", handle: "@daanb", xp: 4655, level: 7, streak: 4, delta: -1, you: false },
  { rank: 6, name: "Fenna M.", handle: "@fenna", xp: 4210, level: 6, streak: 15, delta: 0, you: false },
  { rank: 7, name: "Tijn S.", handle: "@tijns", xp: 3890, level: 6, streak: 2, delta: -3, you: false },
  { rank: 8, name: "Mila R.", handle: "@milar", xp: 3540, level: 6, streak: 7, delta: 1, you: false },
  { rank: 9, name: "Bram H.", handle: "@bramh", xp: 3120, level: 5, streak: 0, delta: -1, you: false },
  { rank: 10, name: "Sara P.", handle: "@sarap", xp: 2890, level: 5, streak: 5, delta: 0, you: false },
];

export const activity: ActivityDay[] = [
  { day: "ma", v: 3 },
  { day: "di", v: 5 },
  { day: "wo", v: 2 },
  { day: "do", v: 6 },
  { day: "vr", v: 4 },
  { day: "za", v: 7 },
  { day: "zo", v: 5 },
];

export const badges: Badge[] = [
  { id: "b1", icon: "flame", label: "12-dagen reeks", got: true },
  { id: "b2", icon: "bolt", label: "100 oefeningen", got: false },
  { id: "b3", icon: "target", label: "90% accuraat", got: true },
  { id: "b4", icon: "trophy", label: "Top 3", got: false },
];
