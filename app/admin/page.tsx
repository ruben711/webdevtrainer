"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

interface AdminUser {
  id: string;
  name: string;
  xp: number;
  level: number;
  solved: number;
  streak: number;
  admin?: boolean;
  tag?: { label: string; color: string; emoji?: string } | null;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"users" | "notify">("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [notify, setNotify] = useState({ scope: "all", userId: "", type: "info", title: "", body: "" });
  const [notifyMsg, setNotifyMsg] = useState("");

  const refreshMe = useCallback(async () => {
    try {
      const j = await (await fetch("/api/admin/me", { cache: "no-store" })).json();
      setAdmin(!!j.admin);
      setConfigured(!!j.configured);
    } catch {
      setConfigured(false);
    }
    setLoading(false);
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const j = await (await fetch("/api/admin/users", { cache: "no-store" })).json();
      if (j.ok) setUsers(j.rows);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);
  useEffect(() => {
    if (admin) void loadUsers();
  }, [admin, loadUsers]);

  const login = async () => {
    setError("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    const j = await r.json();
    if (j.ok) {
      setPw("");
      void refreshMe();
    } else setError(j.error || "Login mislukt");
  };
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAdmin(false);
  };

  const userAction = async (body: Record<string, unknown>) => {
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    void loadUsers();
  };

  const sendNotify = async () => {
    setNotifyMsg("");
    const r = await fetch("/api/admin/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notify),
    });
    const j = await r.json();
    setNotifyMsg(j.ok ? "Melding verstuurd ✓" : j.error || "Mislukt");
  };

  if (loading) {
    return <div className="page page-anim"><p className="sub" style={{ color: "var(--text-3)" }}>Laden…</p></div>;
  }

  if (!configured) {
    return (
      <div className="page page-anim">
        <div className="soon">
          <div className="soon-mark"><Icon name="lock" size={26} /></div>
          <h2>Admin niet geconfigureerd</h2>
          <p>Stel <code>ADMIN_PASSWORD</code> en <code>ADMIN_SECRET</code> in (.env.local) om het adminpaneel te gebruiken.</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="page page-anim">
        <div style={{ maxWidth: 360, margin: "60px auto" }}>
          <div className="soon-mark" style={{ margin: "0 auto 18px" }}><Icon name="lock" size={26} /></div>
          <h1 style={{ textAlign: "center", fontSize: 26 }}>Admin</h1>
          <div className="card" style={{ padding: 22, marginTop: 22, display: "grid", gap: 12 }}>
            <input
              className="admin-input"
              type="password"
              placeholder="Wachtwoord"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
            <button className="btn btn-primary" onClick={login}>Inloggen</button>
            {error && <p style={{ color: "var(--bad)", fontSize: 13, textAlign: "center" }}>{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-anim">
      <div className="page-head">
        <div>
          <div className="kicker" style={{ marginBottom: 12 }}>Beheer</div>
          <h1>Admin</h1>
        </div>
        <button className="btn btn-ghost" onClick={logout}>Uitloggen</button>
      </div>

      <div className="admin-tabs">
        <button className={tab === "users" ? "on" : ""} onClick={() => setTab("users")}>Klassement</button>
        <button className={tab === "notify" ? "on" : ""} onClick={() => setTab("notify")}>Meldingen</button>
      </div>

      {tab === "users" && (
        <div className="card" style={{ padding: "6px 8px" }}>
          {users.length === 0 && <p style={{ padding: 20, color: "var(--text-3)", textAlign: "center" }}>Nog geen spelers (of geen Upstash geconfigureerd).</p>}
          {users.map((u) => (
            <div className="admin-row" key={u.id}>
              <button
                title="Admin aan/uit"
                onClick={() => userAction({ action: "toggleAdmin", id: u.id })}
                style={{ fontSize: 18, opacity: u.admin ? 1 : 0.3 }}
              >
                👑
              </button>
              <input
                className="admin-input"
                defaultValue={u.name}
                onBlur={(e) => e.target.value !== u.name && userAction({ action: "update", id: u.id, name: e.target.value })}
              />
              <input
                className="admin-input num"
                type="number"
                defaultValue={u.xp}
                style={{ width: 90, textAlign: "right" }}
                onBlur={(e) => Number(e.target.value) !== u.xp && userAction({ action: "update", id: u.id, xp: Number(e.target.value) })}
              />
              <button
                title="Verwijderen"
                onClick={() => userAction({ action: "delete", id: u.id })}
                style={{ color: "var(--bad)" }}
              >
                <Icon name="x" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "notify" && (
        <div className="card" style={{ padding: 22, maxWidth: 520, display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <select className="admin-input" value={notify.scope} onChange={(e) => setNotify({ ...notify, scope: e.target.value })}>
              <option value="all">Iedereen</option>
              <option value="user">Eén gebruiker</option>
            </select>
            <select className="admin-input" value={notify.type} onChange={(e) => setNotify({ ...notify, type: e.target.value })}>
              <option value="info">info</option>
              <option value="success">success</option>
              <option value="warning">warning</option>
              <option value="error">error</option>
            </select>
          </div>
          {notify.scope === "user" && (
            <input className="admin-input" placeholder="user-id" value={notify.userId} onChange={(e) => setNotify({ ...notify, userId: e.target.value })} />
          )}
          <input className="admin-input" placeholder="Titel" value={notify.title} onChange={(e) => setNotify({ ...notify, title: e.target.value })} />
          <textarea className="admin-input" placeholder="Bericht" rows={3} value={notify.body} onChange={(e) => setNotify({ ...notify, body: e.target.value })} />
          <button className="btn btn-primary" onClick={sendNotify}>Versturen</button>
          {notifyMsg && <p style={{ fontSize: 13, color: "var(--accent)" }}>{notifyMsg}</p>}
        </div>
      )}
    </div>
  );
}
