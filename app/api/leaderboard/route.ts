import { hasUpstash, hget, hgetallObj, hset } from "@/lib/upstash";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const KEY = "ck:users";

export interface LbProfile {
  id: string;
  name: string;
  xp: number;
  level: number;
  solved: number;
  streak: number;
  admin?: boolean;
  tag?: { label: string; color: string; emoji?: string } | null;
  style?: Record<string, unknown> | null;
  lastSeen: number;
}

/** GET — top players, sorted by XP. */
export async function GET() {
  if (!hasUpstash()) {
    return Response.json({ enabled: false, rows: [] });
  }
  try {
    const users = await hgetallObj(KEY);
    const rows = Object.values(users)
      .map((v) => {
        try {
          return JSON.parse(v) as LbProfile;
        } catch {
          return null;
        }
      })
      .filter((x): x is LbProfile => !!x)
      .sort((a, b) => b.xp - a.xp || b.solved - a.solved)
      .slice(0, 100)
      .map((u, i) => ({ ...u, rank: i + 1 }));
    return Response.json({ enabled: true, rows });
  } catch (e) {
    return Response.json({ enabled: true, rows: [], error: String(e) }, { status: 200 });
  }
}

/** POST — upsert the caller's own score (admin-set fields are preserved). */
export async function POST(req: Request) {
  if (!hasUpstash()) return Response.json({ ok: false, enabled: false });
  let body: Partial<LbProfile>;
  try {
    body = (await req.json()) as Partial<LbProfile>;
  } catch {
    return Response.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const id = body.id;
  if (!id || typeof id !== "string") return Response.json({ ok: false }, { status: 400 });

  try {
    const existingRaw = await hget(KEY, id);
    const existing: Partial<LbProfile> = existingRaw ? JSON.parse(existingRaw) : {};
    const profile: LbProfile = {
      id,
      name: (body.name || existing.name || "Speler").slice(0, 24),
      xp: Math.max(0, Math.floor(body.xp ?? existing.xp ?? 0)),
      level: Math.max(1, Math.floor(body.level ?? existing.level ?? 1)),
      solved: Math.max(0, Math.floor(body.solved ?? existing.solved ?? 0)),
      streak: Math.max(0, Math.floor(body.streak ?? existing.streak ?? 0)),
      // admin-controlled fields are never overwritten by a normal sync
      admin: existing.admin ?? false,
      tag: existing.tag ?? null,
      style: existing.style ?? null,
      lastSeen: Date.now(),
    };
    await hset(KEY, id, JSON.stringify(profile));
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 200 });
  }
}
