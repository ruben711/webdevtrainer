"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { StyledName } from "@/components/StyledName";
import { AnimatedNumber, Avatar, ProgressRing, Reveal, useReveal } from "@/components/ui";
import { CONTENT, exercises } from "@/data/content";
import { DIFFICULTY_LABEL } from "@/lib/difficulty";
import { displayName, getUserId } from "@/lib/identity";
import { levelInfo } from "@/lib/level";
import { fetchLeaderboard, type LiveRow } from "@/lib/leaderboardSync";
import { useProgress } from "@/lib/store";
import { useMounted } from "@/lib/useMounted";

const DOW = ["zo", "ma", "di", "wo", "do", "vr", "za"];

export default function DashboardPage() {
  const ref = useReveal<HTMLDivElement>();
  const mounted = useMounted();

  const xp = useProgress((s) => s.xp);
  const solved = useProgress((s) => s.solved);
  const streak = useProgress((s) => s.streakCount);
  const attempts = useProgress((s) => s.attempts);

  const [top, setTop] = useState<LiveRow[] | null>(null);
  const [lbEnabled, setLbEnabled] = useState(false);
  useEffect(() => {
    if (!mounted) return;
    void fetchLeaderboard().then((r) => {
      setLbEnabled(r.enabled);
      setTop(r.rows.slice(0, 5));
    });
  }, [mounted]);

  const li = levelInfo(mounted ? xp : 0);
  const solvedCount = mounted ? Object.keys(solved).length : 0;
  const passed = attempts.filter((a) => a.passed).length;
  const accuracy = attempts.length ? Math.round((passed / attempts.length) * 100) : 0;

  // first unsolved exercise → "continue"
  const cont = (mounted && exercises.find((e) => !solved[e.id])) || exercises[0];
  const contChapter = CONTENT.find((c) => c.chapter.id === cont?.chapterId);
  const contSolved = contChapter ? contChapter.exercises.filter((e) => mounted && solved[e.id]).length : 0;
  const contPct = contChapter ? Math.round((contSolved / contChapter.exercises.length) * 100) : 0;

  // weekly activity from attempts
  const week: { label: string; v: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const v = mounted
      ? attempts.filter((a) => {
          const ad = new Date(a.at);
          return ad.getFullYear() === d.getFullYear() && ad.getMonth() === d.getMonth() && ad.getDate() === d.getDate();
        }).length
      : 0;
    week.push({ label: DOW[d.getDay()], v });
  }
  const maxAct = Math.max(...week.map((w) => w.v), 1);
  const weekTotal = week.reduce((a, b) => a + b.v, 0);

  // in-progress chapters
  const activeChapters = CONTENT.map((c) => ({
    ...c.chapter,
    total: c.exercises.length,
    done: c.exercises.filter((e) => mounted && solved[e.id]).length,
  }))
    .filter((c) => c.done < c.total)
    .slice(0, 4);

  const stats = [
    { val: <AnimatedNumber value={solvedCount} />, label: "Opgelost", icon: "check", color: "var(--accent)" },
    { val: <AnimatedNumber value={li.totalXp} />, label: "XP totaal", icon: "bolt", color: "var(--cyan)" },
    { val: <AnimatedNumber value={streak} />, label: "Dagen reeks", icon: "flame", color: "var(--warn)" },
    { val: <AnimatedNumber value={accuracy} suffix="%" />, label: "Nauwkeurig", icon: "target", color: "var(--text)" },
  ];

  return (
    <div className="page page-anim" ref={ref}>
      {/* HERO */}
      <Reveal className="hero">
        <div className="hero-rows">
          <div>
            <div className="kicker" style={{ marginBottom: 14 }}>
              {streak > 0 ? `Welkom terug · dag ${streak} op rij` : "Welkom bij CodeKwartier"}
            </div>
            <h1>
              Klaar om te <span className="hl">oefenen</span> voor het examen?
            </h1>
            <p className="sub">
              Je zit op <b>Level {li.level}</b> en hebt nog{" "}
              <b className="num" style={{ color: "var(--accent)" }}>{li.xpToNext} XP</b> tot Level {li.level + 1}.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <Link href={cont ? `/oefeningen/${cont.id}` : "/oefeningen"} className="btn btn-primary btn-lg" style={{ textDecoration: "none" }}>
                <Icon name="play" size={18} fill />
                {solvedCount > 0 ? "Verder oefenen" : "Begin te oefenen"}
              </Link>
              <Link href="/oefeningen" className="btn btn-ghost btn-lg" style={{ textDecoration: "none" }}>
                <Icon name="list" size={18} />
                Oefeningen
              </Link>
            </div>
          </div>
          <div className="ring-badge">
            <ProgressRing value={Math.round(li.progress * 100)} size={150} stroke={12}>
              <div style={{ textAlign: "center" }}>
                <div className="num" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.12em" }}>LEVEL</div>
                <div className="num" style={{ fontWeight: 700, fontSize: 50, lineHeight: 1, color: "var(--text)" }}>{li.level}</div>
                <div className="num" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>{Math.round(li.progress * 100)}%</div>
              </div>
            </ProgressRing>
            <div className="num" style={{ fontSize: 11.5, color: "var(--text-3)" }}>
              {li.xpIntoLevel} / {li.xpForLevel} XP
            </div>
          </div>
        </div>
      </Reveal>

      {/* STATS */}
      <div className="stat-grid">
        {stats.map((s, i) => (
          <Reveal key={s.label} className="card stat" delay={i * 70}>
            <Icon name={s.icon} size={20} className="stat-ic" style={{ position: "absolute", top: 16, right: 16, color: s.color, opacity: 0.9 }} />
            <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </Reveal>
        ))}
      </div>

      {/* CONTINUE + ACTIVITY */}
      <div className="two-col" style={{ marginTop: 14 }}>
        <Reveal className="card continue" delay={40}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <span className={`tag ${cont?.tag ?? "JS"}`} style={{ marginBottom: 12, display: "inline-block" }}>{cont?.tag ?? "JS"}</span>
            <h3 style={{ fontSize: 22, marginTop: 12 }}>{cont?.title ?? "Alles opgelost!"}</h3>
            <p className="num" style={{ color: "var(--text-3)", fontSize: 12.5, marginTop: 8 }}>
              {cont ? `${cont.chapter} · ${DIFFICULTY_LABEL[cont.difficulty]}` : "Knap werk 🎉"}
            </p>
            <Link href={cont ? `/oefeningen/${cont.id}` : "/oefeningen"} className="btn btn-primary" style={{ marginTop: 18, textDecoration: "none" }}>
              <Icon name="code" size={17} />
              {cont ? "Open editor" : "Naar oefeningen"}
            </Link>
          </div>
          <ProgressRing value={contPct} size={92} stroke={9} variant="cy">
            <div className="num" style={{ fontWeight: 700, fontSize: 18 }}>{contPct}%</div>
          </ProgressRing>
        </Reveal>

        <Reveal className="card" delay={110} style={{ padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontSize: 16 }}>Deze week</h3>
            <span className="chip">
              <Icon name="bolt" size={12} fill style={{ color: "var(--accent)" }} />
              {weekTotal}
            </span>
          </div>
          <div className="activity">
            {week.map((a, i) => (
              <div className="col" key={i}>
                <div
                  className={`bar-v ${a.v === maxAct && a.v > 0 ? "hot" : ""}`}
                  style={{ height: Math.round((a.v / maxAct) * 100) + "%", "--d": i * 60 + "ms" } as CSSProperties}
                />
                <span className="day">{a.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* CHAPTERS + LEADERBOARD */}
      <div className="two-col" style={{ marginTop: 14, gridTemplateColumns: "1.3fr 1fr" }}>
        <Reveal>
          <div className="sec-head" style={{ margin: "0 0 16px" }}>
            <h2 style={{ fontSize: 18 }}>Verder met je hoofdstukken</h2>
            <Link href="/oefeningen" className="link" style={{ textDecoration: "none" }}>ALLE →</Link>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {(activeChapters.length ? activeChapters : CONTENT.slice(0, 4).map((c) => ({ ...c.chapter, total: c.exercises.length, done: 0 }))).map((c) => {
              const p = Math.round((c.done / c.total) * 100);
              const firstEx = CONTENT.find((x) => x.chapter.id === c.id)?.exercises[0];
              return (
                <Link key={c.id} href={firstEx ? `/oefeningen/${firstEx.id}` : "/oefeningen"} className="card" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center", padding: "14px 18px", textAlign: "left", textDecoration: "none" }}>
                  <ProgressRing value={p} size={42} stroke={5}><span className="num" style={{ fontSize: 10, fontWeight: 600 }}>{p}</span></ProgressRing>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15.5 }}>{c.title}</div>
                    <div className="num" style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 3 }}>
                      labo {c.n} · <span className={`tag ${c.tag}`} style={{ padding: "1px 6px" }}>{c.tag}</span>
                    </div>
                  </div>
                  <span className="num" style={{ fontSize: 13, color: "var(--text-2)" }}>{c.done}/{c.total}</span>
                </Link>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="sec-head" style={{ margin: "0 0 16px" }}>
            <h2 style={{ fontSize: 18 }}>Klassement</h2>
            <Link href="/leaderboard" className="link" style={{ textDecoration: "none" }}>VOLLEDIG →</Link>
          </div>
          <div className="card" style={{ padding: 10 }}>
            {mounted && lbEnabled && top && top.length > 0 ? (
              top.map((p) => (
                <div className={`mini-row ${p.id === getUserId() ? "you" : ""}`} key={p.id}>
                  <span className="mini-rank">{p.rank}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                    <Avatar name={p.name} size={30} you={p.id === getUserId()} />
                    <StyledName name={p.name} admin={p.admin} tag={p.tag} style={p.style as never} size={14.5} />
                  </div>
                  <span className="num" style={{ fontSize: 13, color: p.id === getUserId() ? "var(--accent)" : "var(--text-2)", fontWeight: 600 }}>
                    {p.xp.toLocaleString("nl-NL")}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: "18px 14px", textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>
                {mounted ? "Los oefeningen op om op het klassement te komen." : "Laden…"}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
