/* Level progression: cost to go from level L to L+1 is 100 * 1.25^(L-1),
   rounded. levelInfo() turns a total-XP number into the current level + the
   progress within it (for the ring/bar). */

export function levelCost(level: number): number {
  return Math.round(100 * Math.pow(1.25, level - 1));
}

export interface LevelInfo {
  level: number;
  xpIntoLevel: number; // xp earned within the current level
  xpForLevel: number; // total xp needed to clear the current level
  xpToNext: number; // xp remaining to next level
  progress: number; // 0..1 within the current level
  totalXp: number;
}

export function levelInfo(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));
  let cost = levelCost(level);
  while (remaining >= cost) {
    remaining -= cost;
    level++;
    cost = levelCost(level);
  }
  return {
    level,
    xpIntoLevel: remaining,
    xpForLevel: cost,
    xpToNext: cost - remaining,
    progress: cost > 0 ? remaining / cost : 0,
    totalXp,
  };
}
