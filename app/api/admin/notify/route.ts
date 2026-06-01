import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyToken } from "@/lib/adminAuth";
import { lpush, ltrim } from "@/lib/upstash";

export const runtime = "edge";
export const dynamic = "force-dynamic";

async function isAdmin(): Promise<boolean> {
  return verifyToken(cookies().get(ADMIN_COOKIE)?.value, process.env.ADMIN_SECRET || "");
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ ok: false }, { status: 401 });
  const body = (await req.json()) as {
    scope?: "all" | "user";
    userId?: string;
    type?: string;
    title?: string;
    body?: string;
  };

  const notif = {
    id: crypto.randomUUID(),
    type: body.type || "info",
    title: (body.title || "").slice(0, 120),
    body: (body.body || "").slice(0, 500),
    at: Date.now(),
  };

  const key = body.scope === "user" && body.userId ? `ck:notif:user:${body.userId}` : "ck:notif:all";
  await lpush(key, JSON.stringify(notif));
  await ltrim(key, 0, 99);
  return Response.json({ ok: true, notif });
}
