"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { StyledName } from "@/components/StyledName";
import { NameStyleEditor } from "@/components/NameStyleEditor";
import { Avatar, Reveal, useReveal } from "@/components/ui";
import { displayName, getStyle, getUserId, setName, setStyle } from "@/lib/identity";
import { levelInfo } from "@/lib/level";
import { fetchLeaderboard, syncScore, type LiveRow } from "@/lib/leaderboardSync";
import { EMPTY_STYLE, type NameStyle } from "@/lib/nameStyle";
import { useProgress } from "@/lib/store";
import { useMounted } from "@/lib/useMounted";

function Podium({ row, place }: { row: LiveRow; place: number }) {
  const [up, setUp] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setUp(true), 150 + (3 - place) * 170);
    return () => clearTimeout(t);
  }, [place]);
  const heights: Record<number, number> = { 1: 92, 2: 66, 3: 50 };
  return (
    <div className={`podium-col podium-${place}`}>
      <div
        className="podium-card"
        style={{
          transform: up ? "none" : "translateY(26px) scale(0.92)",
          opacity: up ? 1 : 0,
          transition: "transform 0.7s var(--spring), opacity 0.5s ease",
        }}
      >
        <div className={`podium-medal medal-${place}`}>{place}</div>
        <div style={{ display: "grid", placeItems: "center", marginTop: 6 }}>
          <Avatar name={row.name} size={place === 1 ? 60 : 50} />
        </div>
        <div className="podium-name">
          <StyledName name={row.name} admin={row.admin} tag={row.tag} style={row.style as never} size={15.5} />
        </div>
        <div className="podium-xp">{row.xp.toLocaleString("nl-NL")} XP</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 9 }}>
          <span className="chip" style={{ padding: "3px 8px", fontSize: 10.5 }}>LVL {row.level}</span>
          <span className="chip" style={{ padding: "3px 8px", fontSize: 10.5, color: "var(--warn)" }}>
            <Icon name="flame" size={11} fill />
            {row.streak}
          </span>
        </div>
      </div>
      <div
        className="podium-bar"
        style={{ height: up ? heights[place] : 0, transition: "height 0.8s var(--spring) 0.2s", overflow: "hidden" }}
      >
        {up && place}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const ref = useReveal<HTMLDivElement>();
  const mounted = useMounted();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [rows, setRows] = useState<LiveRow[]>([]);
  const [me, setMe] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [styleDraft, setStyleDraft] = useState<NameStyle>(EMPTY_STYLE);
  const [myStyle, setMyStyle] = useState<NameStyle | null>(null);

  const xp = useProgress((s) => s.xp);
  const solved = useProgress((s) => Object.keys(s.solved).length);
  const streak = useProgress((s) => s.streakCount);

  const pushAndLoad = useCallback(async () => {
    await syncScore({
      id: getUserId(),
      name: displayName(),
      xp,
      level: levelInfo(xp).level,
      solved,
      streak,
      style: getStyle(),
    });
    const res = await fetchLeaderboard();
    setEnabled(res.enabled);
    setRows(res.rows);
  }, [xp, solved, streak]);

  useEffect(() => {
    if (!mounted) return;
    setMe(getUserId());
    setNameInput(displayName());
    setMyStyle(getStyle());
    void pushAndLoad();
    const t = setInterval(() => {
      void fetchLeaderboard().then((r) => {
        setEnabled(r.enabled);
        setRows(r.rows);
      });
    }, 20000);
    return () => clearInterval(t);
  }, [mounted, pushAndLoad]);

  const openEditor = () => {
    setNameInput(displayName());
    setStyleDraft(getStyle() || EMPTY_STYLE);
    setModalOpen(true);
  };
  const saveProfile = () => {
    if (nameInput.trim()) setName(nameInput.trim());
    const d = styleDraft;
    const hasStyle = !!(
      d.color ||
      d.gradient ||
      d.glow ||
      d.stroke ||
      (d.font && d.font !== "display") ||
      (d.animation && d.animation !== "none")
    );
    const next = hasStyle ? d : null;
    setStyle(next);
    setMyStyle(next);
    setModalOpen(false);
    void pushAndLoad();
  };

  const maxXp = rows.length ? Math.max(...rows.map((r) => r.xp), 1) : 1;
  const top3 = rows.length >= 3 ? [rows[1], rows[0], rows[2]] : [];
  const li = levelInfo(xp);

  return (
    <div className="page page-anim" ref={ref}>
      <Reveal className="page-head">
        <div>
          <div className="kicker" style={{ marginBottom: 12 }}>Competitie · de klas</div>
          <h1>Klassement</h1>
        </div>
        {mounted && (
          <div className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ minWidth: 0 }}>
              <div className="label-mono">Jouw naam</div>
              <div style={{ marginTop: 4 }}>
                <StyledName name={displayName()} style={myStyle} size={15} />
              </div>
            </div>
            <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={openEditor}>
              Wijzig uiterlijk
            </button>
          </div>
        )}
      </Reveal>

      {/* server not configured → local-only view */}
      {mounted && enabled === false && (
        <Reveal className="card" delay={40} style={{ padding: "26px 28px", textAlign: "center" }}>
          <div className="soon-mark" style={{ margin: "0 auto 14px" }}>
            <Icon name="trophy" size={26} />
          </div>
          <h3 style={{ fontSize: 18 }}>Klassement draait lokaal</h3>
          <p className="sub" style={{ color: "var(--text-2)", margin: "10px auto 0", maxWidth: "46ch" }}>
            Het online klassement gebruikt Upstash Redis. Zonder server-configuratie (env-variabelen)
            zie je hier enkel je eigen voortgang. Zodra de server is ingesteld, verschijnt de hele klas.
          </p>
          <div className="you-banner" style={{ marginTop: 22, maxWidth: 460, marginInline: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar name={displayName()} size={40} you />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>{displayName()}</div>
                <div className="num" style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>
                  LVL {li.level} · {solved} opgelost · {streak} dgn reeks
                </div>
              </div>
            </div>
            <span className="num" style={{ fontSize: 17, fontWeight: 600, color: "var(--accent)" }}>
              {xp.toLocaleString("nl-NL")} XP
            </span>
          </div>
        </Reveal>
      )}

      {/* live leaderboard */}
      {mounted && enabled && (
        <>
          {top3.length === 3 && (
            <Reveal delay={40}>
              <div className="podium">
                {top3.map((r) => (
                  <Podium key={r.id} row={r} place={r.rank} />
                ))}
              </div>
            </Reveal>
          )}

          {rows.length === 0 && (
            <Reveal className="card" style={{ padding: 24, textAlign: "center", color: "var(--text-2)" }}>
              Nog geen scores — los een oefening op om als eerste op het bord te komen!
            </Reveal>
          )}

          {rows.length > 0 && (
            <Reveal className="card lb-table" delay={120} style={{ padding: "8px 10px" }}>
              <div className="lb-colhead">
                <span>#</span>
                <span>Naam</span>
                <span>Voortgang</span>
                <span style={{ textAlign: "right" }}>XP</span>
                <span style={{ textAlign: "right" }}>Opgelost</span>
              </div>
              {rows.map((p, i) => (
                <Reveal key={p.id} delay={i * 35} className={`lb-row ${p.id === me ? "you" : ""}`}>
                  <span className="lb-rank">{p.rank}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    <Avatar name={p.name} size={34} you={p.id === me} />
                    <div style={{ minWidth: 0 }}>
                      <div className="lb-name">
                        <StyledName name={p.name} admin={p.admin} tag={p.tag} style={p.style as never} />
                      </div>
                      <div className="lb-sub">LVL {p.level} · {p.streak} dgn</div>
                    </div>
                  </div>
                  <div className="lb-xpbar">
                    <span style={{ width: Math.round((p.xp / maxXp) * 100) + "%" }} />
                  </div>
                  <span className="lb-xpval" style={{ color: p.id === me ? "var(--accent)" : "var(--text)" }}>
                    {p.xp.toLocaleString("nl-NL")}
                  </span>
                  <span className="num" style={{ textAlign: "right", color: "var(--text-2)", fontSize: 13 }}>
                    {p.solved}
                  </span>
                </Reveal>
              ))}
            </Reveal>
          )}
        </>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal-card scroll">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 20 }}>Naam &amp; uiterlijk</h2>
              <button className="theme-toggle" onClick={() => setModalOpen(false)} aria-label="Sluiten">
                <Icon name="x" size={16} />
              </button>
            </div>
            <span className="label-mono">Naam</span>
            <input
              className="admin-input"
              style={{ width: "100%", marginTop: 6 }}
              value={nameInput}
              maxLength={24}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Je naam…"
            />
            <div style={{ marginTop: 16 }}>
              <NameStyleEditor name={nameInput} value={styleDraft} onChange={setStyleDraft} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveProfile}>
                Opslaan
              </button>
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>
                Annuleer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
