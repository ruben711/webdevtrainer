import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_TTL_DAYS, adminConfigured, makeToken } from "@/lib/adminAuth";
import { del, expire, hasUpstash, incr } from "@/lib/upstash";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function clientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
}
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin niet geconfigureerd (ADMIN_PASSWORD / ADMIN_SECRET ontbreken)." },
      { status: 503 }
    );
  }

  const ip = clientIp(req);
  const bfKey = `ck:bf:${ip}`;
  // brute-force protection: 5 tries / 15 min (best-effort, needs Upstash)
  if (hasUpstash()) {
    const n = await incr(bfKey);
    if (n === 1) await expire(bfKey, 900);
    if (n > 5) {
      return NextResponse.json(
        { ok: false, error: "Te veel pogingen. Probeer over 15 minuten opnieuw." },
        { status: 429 }
      );
    }
  }

  let password = "";
  try {
    password = ((await req.json()) as { password?: string }).password || "";
  } catch {
    /* no body */
  }

  if (!safeEqual(password, process.env.ADMIN_PASSWORD || "")) {
    return NextResponse.json({ ok: false, error: "Onjuist wachtwoord." }, { status: 401 });
  }

  if (hasUpstash()) await del(bfKey); // reset on success
  const token = await makeToken(process.env.ADMIN_SECRET || "");
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_TTL_DAYS * 86400,
  });
  return res;
}
