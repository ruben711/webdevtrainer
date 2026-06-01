"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { getUserId } from "@/lib/identity";
import { useMounted } from "@/lib/useMounted";

interface Notif {
  id: string;
  type: string;
  title: string;
  body: string;
  at: number;
  scope: string;
}

const READ_KEY = "ck-notif-read";

function timeAgo(at: number): string {
  const s = Math.round((Date.now() - at) / 1000);
  if (s < 60) return "net";
  if (s < 3600) return Math.floor(s / 60) + " min";
  if (s < 86400) return Math.floor(s / 3600) + " u";
  return Math.floor(s / 86400) + " d";
}

export function NotificationBell() {
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [read, setRead] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mounted) return;
    try {
      setRead(JSON.parse(localStorage.getItem(READ_KEY) || "[]"));
    } catch {
      /* ignore */
    }
    const load = () =>
      fetch(`/api/notifications?uid=${getUserId()}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((j) => {
          if (j.enabled) setNotifs(j.notifications || []);
        })
        .catch(() => {});
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [mounted]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const unread = mounted ? notifs.filter((n) => !read.includes(n.id)).length : 0;

  const toggle = () => {
    setOpen((o) => {
      const next = !o;
      if (next) {
        const ids = notifs.map((n) => n.id);
        setRead(ids);
        try {
          localStorage.setItem(READ_KEY, JSON.stringify(ids));
        } catch {
          /* ignore */
        }
      }
      return next;
    });
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="theme-toggle" onClick={toggle} aria-label="Meldingen" style={{ position: "relative" }}>
        <Icon name="bell" size={18} />
        {unread > 0 && <span className="notif-dot">{unread > 9 ? "9+" : unread}</span>}
      </button>
      {open && (
        <div className="notif-dropdown scroll">
          <div className="notif-head">
            <span>Meldingen</span>
            <span>{notifs.length}</span>
          </div>
          {notifs.length === 0 ? (
            <div className="notif-empty">Geen meldingen</div>
          ) : (
            notifs.map((n) => (
              <div key={n.id} className="notif-item">
                <div className="notif-title">
                  <Icon
                    name={n.type === "success" ? "check" : n.type === "error" || n.type === "warning" ? "alert" : "bolt"}
                    size={14}
                    className={`notif-type-${n.type}`}
                  />
                  {n.title}
                </div>
                {n.body && <div className="notif-body">{n.body}</div>}
                <div className="notif-time">{timeAgo(n.at)}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
