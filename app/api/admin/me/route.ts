import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminConfigured, verifyToken } from "@/lib/adminAuth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  const admin = await verifyToken(token, process.env.ADMIN_SECRET || "");
  return Response.json({ admin, configured: adminConfigured() });
}
