export interface LiveRow {
  id: string;
  name: string;
  xp: number;
  level: number;
  solved: number;
  streak: number;
  rank: number;
  admin?: boolean;
  tag?: { label: string; color: string; emoji?: string } | null;
  style?: Record<string, unknown> | null;
}

export interface LeaderboardResponse {
  enabled: boolean;
  rows: LiveRow[];
}

export interface ScorePayload {
  id: string;
  name: string;
  xp: number;
  level: number;
  solved: number;
  streak: number;
}

export async function fetchLeaderboard(): Promise<LeaderboardResponse> {
  try {
    const r = await fetch("/api/leaderboard", { cache: "no-store" });
    const j = (await r.json()) as LeaderboardResponse;
    return { enabled: !!j.enabled, rows: Array.isArray(j.rows) ? j.rows : [] };
  } catch {
    return { enabled: false, rows: [] };
  }
}

export async function syncScore(payload: ScorePayload): Promise<void> {
  try {
    await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    /* offline / no server — fine */
  }
}
