"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { AnimatedNumber, ProgressRing, Reveal, useReveal } from "@/components/ui";
import { CONTENT } from "@/data/content";
import { DIFFICULTY_CLASS, DIFFICULTY_LABEL, xpForDifficulty } from "@/lib/difficulty";
import { useProgress } from "@/lib/store";
import { useMounted } from "@/lib/useMounted";
import type { Tag } from "@/lib/types";

const FILTERS: ("Alle" | Tag)[] = ["Alle", "JS", "CSS", "HTML"];

export default function OefeningenPage() {
  const ref = useReveal<HTMLDivElement>();
  const mounted = useMounted();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Alle");
  const solved = useProgress((s) => s.solved);

  const shown = CONTENT.filter((c) => filter === "Alle" || c.chapter.tag === filter);
  const totalEx = CONTENT.reduce((a, c) => a + c.exercises.length, 0);
  const totalSolved = mounted ? Object.keys(solved).length : 0;
  const overall = totalEx ? Math.round((totalSolved / totalEx) * 100) : 0;

  return (
    <div className="page page-anim" ref={ref}>
      <Reveal className="page-head">
        <div>
          <div className="kicker" style={{ marginBottom: 12 }}>Web Development · labo 13–22</div>
          <h1>Oefeningen</h1>
          <p className="sub" style={{ color: "var(--text-2)", marginTop: 12, maxWidth: "50ch" }}>
            Werk de hoofdstukken af, verzamel XP en hou je reeks levend. Elke oefening verbetert zichzelf live.
          </p>
        </div>
        <div className="card" style={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 18 }}>
          <ProgressRing value={overall} size={60} stroke={7}>
            <span className="num" style={{ fontSize: 14, fontWeight: 600 }}>{overall}%</span>
          </ProgressRing>
          <div>
            <div className="num" style={{ fontWeight: 700, fontSize: 22 }}>
              <AnimatedNumber value={totalSolved} /> <span style={{ color: "var(--text-3)", fontWeight: 500 }}>/ {totalEx}</span>
            </div>
            <div style={{ color: "var(--text-3)", fontSize: 12.5, fontWeight: 600 }}>oefeningen voltooid</div>
          </div>
        </div>
      </Reveal>

      <Reveal className="segment" delay={60} style={{ marginBottom: 8 }}>
        {FILTERS.map((f) => (
          <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </Reveal>

      {shown.map((c, ci) => {
        const chSolved = mounted ? c.exercises.filter((e) => solved[e.id]).length : 0;
        return (
          <div key={c.chapter.id}>
            <div className="sec-head">
              <h2 style={{ fontSize: 19 }}>
                <span className="num" style={{ color: "var(--text-3)", fontSize: 14, marginRight: 8 }}>
                  {c.chapter.n}
                </span>
                {c.chapter.title}
              </h2>
              <span className="num" style={{ fontSize: 13, color: chSolved === c.exercises.length ? "var(--accent)" : "var(--text-3)" }}>
                {chSolved}/{c.exercises.length}
              </span>
            </div>
            <div className="chapter-grid">
              {c.exercises.map((ex, i) => {
                const isSolved = mounted && !!solved[ex.id];
                const xp = xpForDifficulty(ex.difficulty);
                return (
                  <Reveal key={ex.id} delay={Math.min(i * 35, 200)}>
                    <Link
                      href={`/oefeningen/${ex.id}`}
                      className="card"
                      style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 15, alignItems: "center", padding: "15px 18px", textDecoration: "none" }}
                    >
                      <span
                        style={{
                          width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center", flex: "none",
                          background: isSolved ? "var(--accent-soft)" : "var(--surface-2)",
                          color: isSolved ? "var(--accent)" : "var(--text-3)",
                          border: `1px solid ${isSolved ? "var(--accent-line)" : "var(--border-2)"}`,
                        }}
                      >
                        <Icon name={isSolved ? "check" : "play"} size={16} fill={isSolved} />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>{ex.title}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 6, flexWrap: "wrap" }}>
                          <span className={`diff ${DIFFICULTY_CLASS[ex.difficulty]}`}>{DIFFICULTY_LABEL[ex.difficulty]}</span>
                          <span className={`tag ${ex.tag}`} style={{ padding: "2px 7px" }}>{ex.tag}</span>
                        </div>
                      </div>
                      <span className="num" style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600 }}>
                        {xp > 0 ? `+${xp}` : "0"} XP
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
