"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

type Toast = { id: number; amount: number; leveledUp: boolean; level: number };

export type XpEventDetail = { amount: number; leveledUp: boolean; level: number };

/** Fire an XP toast from anywhere on the client. */
export function fireXp(detail: XpEventDetail) {
  window.dispatchEvent(new CustomEvent("ck-xp", { detail }));
}

export function XpToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let n = 0;
    const onXp = (e: Event) => {
      const d = (e as CustomEvent<XpEventDetail>).detail;
      const id = ++n;
      setToasts((t) => [...t, { id, ...d }]);
      window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
    };
    window.addEventListener("ck-xp", onXp as EventListener);
    return () => window.removeEventListener("ck-xp", onXp as EventListener);
  }, []);

  if (!toasts.length) return null;
  return (
    <div className="xp-toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className="xp-toast">
          <span className="xp-toast-ic">
            <Icon name={t.leveledUp ? "trophy" : "star"} size={18} fill />
          </span>
          <div>
            <div className="xp-toast-amt num">+{t.amount} XP</div>
            {t.leveledUp && <div className="xp-toast-sub">Level up! Level {t.level}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
