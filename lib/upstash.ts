/* Minimal Upstash Redis REST client (no SDK). Server-side only — the token
   never reaches the client. Everything degrades gracefully when the env vars
   are absent, so the app runs fully local without Upstash. */

const URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export function hasUpstash(): boolean {
  return !!(URL && TOKEN);
}

export async function redis(cmd: (string | number)[]): Promise<unknown> {
  if (!hasUpstash()) return null;
  const res = await fetch(URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}: ${await res.text()}`);
  const j = (await res.json()) as { result?: unknown; error?: string };
  if (j.error) throw new Error(j.error);
  return j.result ?? null;
}

export async function pipeline(cmds: (string | number)[][]): Promise<unknown[]> {
  if (!hasUpstash()) return [];
  const res = await fetch(`${URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  const arr = (await res.json()) as { result?: unknown }[];
  return arr.map((x) => x.result ?? null);
}

export async function hset(key: string, field: string, value: string): Promise<void> {
  await redis(["HSET", key, field, value]);
}
export async function hget(key: string, field: string): Promise<string | null> {
  return (await redis(["HGET", key, field])) as string | null;
}
export async function hdel(key: string, field: string): Promise<void> {
  await redis(["HDEL", key, field]);
}
export async function del(key: string): Promise<void> {
  await redis(["DEL", key]);
}

/** HGETALL → object. Upstash returns a flat [f1,v1,f2,v2,...] array. */
export async function hgetallObj(key: string): Promise<Record<string, string>> {
  const flat = (await redis(["HGETALL", key])) as string[] | null;
  const out: Record<string, string> = {};
  if (Array.isArray(flat)) {
    for (let i = 0; i < flat.length; i += 2) out[flat[i]] = flat[i + 1];
  }
  return out;
}

export async function get(key: string): Promise<string | null> {
  return (await redis(["GET", key])) as string | null;
}
export async function set(key: string, value: string, exSeconds?: number): Promise<void> {
  if (exSeconds) await redis(["SET", key, value, "EX", exSeconds]);
  else await redis(["SET", key, value]);
}
export async function incr(key: string): Promise<number> {
  return ((await redis(["INCR", key])) as number) ?? 0;
}
export async function expire(key: string, seconds: number): Promise<void> {
  await redis(["EXPIRE", key, seconds]);
}
export async function lpush(key: string, value: string): Promise<void> {
  await redis(["LPUSH", key, value]);
}
export async function lrange(key: string, start: number, stop: number): Promise<string[]> {
  return ((await redis(["LRANGE", key, start, stop])) as string[]) ?? [];
}
export async function ltrim(key: string, start: number, stop: number): Promise<void> {
  await redis(["LTRIM", key, start, stop]);
}
