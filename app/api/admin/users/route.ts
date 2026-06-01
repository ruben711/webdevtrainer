import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyToken } from "@/lib/adminAuth";
import { hdel, hget, hgetallObj, hset } from "@/lib/upstash";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const KEY = "ck:users";

async function isAdmin(): Promise<boolean> {
  return verifyToken(cookies().get(ADMIN_COOKIE)?.value, process.env.ADMIN_SECRET || "");
}

export async function GET() {
  if (!(await isAdmin())) return Response.json({ ok: false }, { status: 401 });
  const users = await hgetallObj(KEY);
  const rows = Object.values(users)
    .map((v) => {
      try {
        return JSON.parse(v);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.xp - a.xp);
  return Response.json({ ok: true, rows });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ ok: false }, { status: 401 });
  const body = (await req.json()) as Record<string, unknown>;
  const action = body.action as string;
  const id = body.id as string;
  if (!id) return Response.json({ ok: false, error: "id ontbreekt" }, { status: 400 });

  if (action === "delete") {
    await hdel(KEY, id);
    return Response.json({ ok: true });
  }

  const raw = await hget(KEY, id);
  if (!raw) return Response.json({ ok: false, error: "onbekende gebruiker" }, { status: 404 });
  const profile = JSON.parse(raw);

  switch (action) {
    case "update":
      if (body.name !== undefined) profile.name = String(body.name).slice(0, 24);
      if (body.xp !== undefined) profile.xp = Math.max(0, Math.floor(Number(body.xp)));
      if (body.level !== undefined) profile.level = Math.max(1, Math.floor(Number(body.level)));
      if (body.solved !== undefined) profile.solved = Math.max(0, Math.floor(Number(body.solved)));
      if (body.streak !== undefined) profile.streak = Math.max(0, Math.floor(Number(body.streak)));
      break;
    case "toggleAdmin":
      profile.admin = !profile.admin;
      break;
    case "setTag":
      profile.tag = body.tag ?? null;
      break;
    case "setStyle":
      profile.style = body.style ?? null;
      break;
    default:
      return Response.json({ ok: false, error: "onbekende actie" }, { status: 400 });
  }

  await hset(KEY, id, JSON.stringify(profile));
  return Response.json({ ok: true, profile });
}
