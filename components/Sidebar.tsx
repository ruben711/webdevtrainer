"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";
import { Avatar } from "@/components/ui";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { user } from "@/data/mock";

type NavItem = { href: string; label: string; icon: IconName; match?: (p: string) => boolean };

const NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "home", match: (p) => p === "/" },
  { href: "/oefeningen", label: "Oefeningen", icon: "list", match: (p) => p.startsWith("/oefeningen") },
  { href: "/sandbox", label: "Speeltuin", icon: "beaker" },
  { href: "/theorie", label: "Theorie", icon: "book" },
  { href: "/examen", label: "Oefentoets", icon: "clipboard" },
  { href: "/leaderboard", label: "Klassement", icon: "trophy" },
];

export function Sidebar() {
  const pathname = usePathname() || "/";
  return (
    <aside className="sidebar">
      <Link href="/" className="brand" style={{ textDecoration: "none" }}>
        <div className="brand-mark">{"</>"}</div>
        <div className="brand-name">
          CodeKwartier<small>web dev trainer</small>
        </div>
      </Link>

      {NAV.map((it) => {
        const active = it.match ? it.match(pathname) : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`nav-item ${active ? "active" : ""}`}
            style={{ textDecoration: "none" }}
          >
            <Icon name={it.icon} size={19} />
            {it.label}
          </Link>
        );
      })}

      <div className="nav-spacer" />

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div className="nav-user" style={{ flex: 1, minWidth: 0 }}>
          <Avatar name={user.name} size={34} you />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>
              {user.name}
            </div>
            <div className="num" style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 2 }}>
              LVL {user.level} · #{user.rank}
            </div>
          </div>
        </div>
        <NotificationBell />
        <ThemeToggle />
      </div>
    </aside>
  );
}
