export interface BadgeStats {
  solvedCount: number;
  streak: number;
  level: number;
  xp: number;
  chaptersCompleted: number;
}

export interface BadgeDef {
  id: string;
  icon: string;
  label: string;
  desc: string;
  earned: (s: BadgeStats) => boolean;
}

export const BADGES: BadgeDef[] = [
  { id: "first", icon: "star", label: "Eerste oplossing", desc: "Los je eerste oefening op", earned: (s) => s.solvedCount >= 1 },
  { id: "ten", icon: "bolt", label: "10 opgelost", desc: "Los 10 oefeningen op", earned: (s) => s.solvedCount >= 10 },
  { id: "twentyfive", icon: "code", label: "25 opgelost", desc: "Los 25 oefeningen op", earned: (s) => s.solvedCount >= 25 },
  { id: "fifty", icon: "grid", label: "50 opgelost", desc: "Los 50 oefeningen op", earned: (s) => s.solvedCount >= 50 },
  { id: "streak3", icon: "flame", label: "3-dagen reeks", desc: "3 dagen op rij actief", earned: (s) => s.streak >= 3 },
  { id: "streak7", icon: "flame", label: "7-dagen reeks", desc: "7 dagen op rij actief", earned: (s) => s.streak >= 7 },
  { id: "level5", icon: "trophy", label: "Level 5", desc: "Bereik level 5", earned: (s) => s.level >= 5 },
  { id: "chapter", icon: "check", label: "Hoofdstuk voltooid", desc: "Voltooi een volledig hoofdstuk", earned: (s) => s.chaptersCompleted >= 1 },
];

export function earnedBadges(s: BadgeStats): BadgeDef[] {
  return BADGES.filter((b) => b.earned(s));
}
