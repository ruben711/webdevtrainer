/* Edge-compatible admin auth: an HMAC-SHA256 signed token via Web Crypto
   (NOT node:crypto). Stored in an httpOnly cookie, 7-day TTL. */

export const ADMIN_COOKIE = "ck_admin";
export const ADMIN_TTL_DAYS = 7;

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer): string {
  const b = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(b).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return b64url(sig);
}

// constant-time string compare
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function makeToken(secret: string): Promise<string> {
  const exp = Date.now() + ADMIN_TTL_DAYS * 86400000;
  const payload = `admin.${exp}`;
  const sig = await sign(payload, secret);
  return `${payload}.${sig}`;
}

export async function verifyToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expStr, sig] = parts;
  if (role !== "admin") return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = await sign(`${role}.${expStr}`, secret);
  return safeEqual(sig, expected);
}

export function adminConfigured(): boolean {
  return !!(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET);
}
