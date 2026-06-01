import { hasUpstash, lrange } from "@/lib/upstash";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  at: number;
  scope: "all" | "user";
}

export async function GET(req: Request) {
  if (!hasUpstash()) return Response.json({ enabled: false, notifications: [] });
  const uid = new URL(req.url).searchParams.get("uid") || "";
  try {
    const all = await lrange("ck:notif:all", 0, 49);
    const mine = uid ? await lrange(`ck:notif:user:${uid}`, 0, 49) : [];
    const parse = (arr: string[], scope: "all" | "user"): Notification[] =>
      arr
        .map((s) => {
          try {
            return { ...(JSON.parse(s) as Omit<Notification, "scope">), scope };
          } catch {
            return null;
          }
        })
        .filter((x): x is Notification => !!x);
    const notifications = [...parse(all, "all"), ...parse(mine, "user")]
      .sort((a, b) => b.at - a.at)
      .slice(0, 50);
    return Response.json({ enabled: true, notifications });
  } catch (e) {
    return Response.json({ enabled: true, notifications: [], error: String(e) });
  }
}
