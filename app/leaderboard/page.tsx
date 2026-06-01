"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { StyledName } from "@/components/StyledName";
import { Avatar, Reveal, useReveal } from "@/components/ui";
import { displayName, getUserId, setName } from "@/lib/identity";
import { levelInfo } from "@/lib/level";
import { fetchLeaderboard, syncScore, type LiveRow } from "@/lib/leaderboardSync";
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
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");

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
    });
    const res = await fetchLeaderboard();
    setEnabled(res.enabled);
    setRows(res.rows);
  }, [xp, solved, streak]);

  useEffect(() => {
    if (!mounted) return;
    setMe(getUserId());
    setNameInput(displayName());
    void pushAndLoad();
    const t = setInterval(() => {
      void fetchLeaderboard().then((r) => {
        setEnabled(r.enabled);
        setRows(r.rows);
      });
    }, 20000);
    return () => clearInterval(t);
  }, [mounted, pushAndLoad]);

  const saveName = () => {
    if (nameInput.trim()) setName(nameInput.trim());
    setEditing(false);
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
          <div className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            {editing ? (
              <>
                <input
                  className="note-area"
                  style={{ minHeight: 0, height: 36, width: 160, marginTop: 0 }}
                  value={nameInput}
                  maxLength={24}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                  placeholder="Je naam…"
                  autoFocus
                />
                <button className="btn btn-primary" style={{ padding: "8px 14px", fontSize: 13 }} onClick={saveName}>
                  Opslaan
                </button>
              </>
            ) : (
              <>
                <div style={{ minWidth: 0 }}>
                  <div className="label-mono">Jouw naam</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{displayName()}</div>
                </div>
                <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setEditing(true)}>
                  Wijzig
                </button>
              </>
            )}
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
    </div>
  );
}
