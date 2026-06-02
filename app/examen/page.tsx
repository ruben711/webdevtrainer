"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { Reveal, useReveal } from "@/components/ui";
import { EXAM_POOL, EXAM_CHAPTERS, EXAM_CHAPTER_LABEL, type ExamQuestion } from "@/data/oefentoets";

type Phase = "intro" | "running" | "done";
type Verdict = "correct" | "wrong";
interface Answer {
  q: ExamQuestion;
  verdict: Verdict;
  picked?: number; // mc: which option the user chose
}

const BEST_KEY = "ck-oefentoets-best";
const LENGTHS = [10, 20, 35];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Agents put a code sample after the first newline; split it out for a mono block. */
function splitQ(q: string): { text: string; code?: string } {
  const i = q.indexOf("\n");
  if (i === -1) return { text: q.trim() };
  return { text: q.slice(0, i).trim(), code: q.slice(i).trim() };
}

function gradeLabel(pct: number): { label: string; color: string } {
  if (pct >= 90) return { label: "Uitstekend!", color: "var(--good)" };
  if (pct >= 75) return { label: "Goed bezig", color: "var(--accent)" };
  if (pct >= 50) return { label: "Geslaagd", color: "var(--warn)" };
  return { label: "Nog wat oefenen", color: "var(--bad)" };
}

function QuestionText({ q }: { q: ExamQuestion }) {
  const { text, code } = splitQ(q.question);
  return (
    <>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, lineHeight: 1.45 }}>{text}</div>
      {code && (
        <pre
          style={{
            marginTop: 12, padding: "12px 14px", borderRadius: "var(--r-sm)",
            background: "var(--surface-2)", border: "1px solid var(--border)",
            fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.55,
            color: "var(--text)", overflowX: "auto", whiteSpace: "pre",
          }}
        >
          {code}
        </pre>
      )}
    </>
  );
}

export default function ExamenPage() {
  const ref = useReveal<HTMLDivElement>();

  const [phase, setPhase] = useState<Phase>("intro");
  const [chapters, setChapters] = useState<Set<string>>(() => new Set(EXAM_CHAPTERS.map((c) => c.id)));
  const [count, setCount] = useState<number | "all">(20);
  const [best, setBest] = useState<{ pct: number; score: number; total: number } | null>(null);

  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  // current-question transient state
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [openText, setOpenText] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BEST_KEY);
      if (raw) setBest(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const available = useMemo(() => EXAM_POOL.filter((q) => chapters.has(q.chapter)), [chapters]);

  const toggleChapter = (id: string) => {
    setChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const start = () => {
    const pool = available.length ? available : EXAM_POOL;
    const n = count === "all" ? pool.length : Math.min(count, pool.length);
    setQuestions(shuffle(pool).slice(0, n));
    setAnswers([]);
    setIndex(0);
    setPicked(null);
    setRevealed(false);
    setOpenText("");
    setPhase("running");
  };

  const cur = questions[index];

  const commit = (verdict: Verdict, pickedIdx?: number) => {
    const next = [...answers, { q: cur, verdict, picked: pickedIdx }];
    setAnswers(next);
    setPicked(null);
    setRevealed(false);
    setOpenText("");
    if (index + 1 >= questions.length) {
      finish(next);
    } else {
      setIndex(index + 1);
    }
  };

  const finish = (final: Answer[]) => {
    const score = final.filter((a) => a.verdict === "correct").length;
    const total = final.length;
    const pct = total ? Math.round((score / total) * 100) : 0;
    setBest((prev) => {
      if (!prev || pct > prev.pct) {
        const rec = { pct, score, total };
        try { localStorage.setItem(BEST_KEY, JSON.stringify(rec)); } catch { /* ignore */ }
        return rec;
      }
      return prev;
    });
    setPhase("done");
  };

  const stopEarly = () => {
    if (answers.length === 0) { setPhase("intro"); return; }
    finish(answers);
  };

  /* ─────────────── INTRO ─────────────── */
  if (phase === "intro") {
    const poolSize = available.length || EXAM_POOL.length;
    return (
      <div className="page page-anim" ref={ref}>
        <Reveal className="page-head">
          <div>
            <div className="kicker" style={{ marginBottom: 12 }}>Test jezelf · geen XP</div>
            <h1>Oefentoets</h1>
            <p className="sub" style={{ color: "var(--text-2)", marginTop: 12, maxWidth: "54ch" }}>
              Een uitgebreide oefentoets over de theorie van labo 13 t/m 22. Meerkeuze- en open vragen
              door elkaar, met directe feedback en een eindscore. {EXAM_POOL.length} vragen in de pool.
            </p>
          </div>
        </Reveal>

        <Reveal delay={60} className="card" style={{ padding: 22, maxWidth: 640, display: "grid", gap: 20 }}>
          <div>
            <div className="label-mono" style={{ marginBottom: 10 }}>Hoofdstukken</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {EXAM_CHAPTERS.map((c) => {
                const on = chapters.has(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleChapter(c.id)}
                    className="chip"
                    style={{
                      cursor: "pointer",
                      borderColor: on ? "var(--accent-line)" : "var(--border-2)",
                      background: on ? "var(--accent-soft)" : "transparent",
                      color: on ? "var(--accent)" : "var(--text-3)",
                    }}
                  >
                    {on && <Icon name="check" size={12} />} {c.label}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button className="btn-link" onClick={() => setChapters(new Set(EXAM_CHAPTERS.map((c) => c.id)))}>alles</button>
              <button className="btn-link" onClick={() => setChapters(new Set())}>geen</button>
            </div>
          </div>

          <div>
            <div className="label-mono" style={{ marginBottom: 10 }}>Aantal vragen</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {LENGTHS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className="chip"
                  style={{
                    cursor: "pointer",
                    borderColor: count === n ? "var(--accent-line)" : "var(--border-2)",
                    background: count === n ? "var(--accent-soft)" : "transparent",
                    color: count === n ? "var(--accent)" : "var(--text-2)",
                  }}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setCount("all")}
                className="chip"
                style={{
                  cursor: "pointer",
                  borderColor: count === "all" ? "var(--accent-line)" : "var(--border-2)",
                  background: count === "all" ? "var(--accent-soft)" : "transparent",
                  color: count === "all" ? "var(--accent)" : "var(--text-2)",
                }}
              >
                Alles ({poolSize})
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={start} disabled={poolSize === 0}>
              <Icon name="play" size={16} /> Start oefentoets
            </button>
            {best && (
              <span className="sub" style={{ color: "var(--text-3)", fontSize: 13 }}>
                Beste score: <strong style={{ color: "var(--accent)" }}>{best.pct}%</strong> ({best.score}/{best.total})
              </span>
            )}
          </div>
        </Reveal>
      </div>
    );
  }

  /* ─────────────── RUNNING ─────────────── */
  if (phase === "running" && cur) {
    const total = questions.length;
    const scoreSoFar = answers.filter((a) => a.verdict === "correct").length;
    const pct = Math.round(((index) / total) * 100);

    return (
      <div className="page page-anim">
        {/* top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
          <div className="label-mono" style={{ color: "var(--text-2)" }}>Vraag {index + 1} / {total}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="sub" style={{ fontSize: 13, color: "var(--text-3)" }}>
              <Icon name="check" size={13} /> {scoreSoFar} goed
            </span>
            <button className="btn-link" onClick={stopEarly}>stoppen</button>
          </div>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "var(--surface-2)", overflow: "hidden", marginBottom: 20 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: 999, transition: "width 0.4s var(--ease)" }} />
        </div>

        <Reveal key={cur.id} className="card" style={{ padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span className="chip" style={{ fontSize: 11 }}>{EXAM_CHAPTER_LABEL[cur.chapter] ?? cur.chapter}</span>
            <span className="chip" style={{ fontSize: 11, color: "var(--text-3)" }}>{cur.type === "mc" ? "meerkeuze" : "open vraag"}</span>
          </div>

          <QuestionText q={cur} />

          {/* ── MC ── */}
          {cur.type === "mc" && (
            <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
              {cur.options?.map((opt, i) => {
                const isPicked = picked === i;
                const isCorrect = i === cur.correctIndex;
                let border = "var(--border-2)";
                let bg = "var(--surface-2)";
                let color = "var(--text)";
                if (revealed && isCorrect) {
                  border = "var(--accent-line)"; bg = "var(--accent-soft)"; color = "var(--accent)";
                } else if (revealed && isPicked && !isCorrect) {
                  border = "rgba(255,93,77,0.4)"; bg = "rgba(255,93,77,0.1)"; color = "var(--bad)";
                }
                return (
                  <button
                    key={i}
                    disabled={revealed}
                    onClick={() => { setPicked(i); setRevealed(true); }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                      textAlign: "left", padding: "11px 14px", borderRadius: "var(--r-sm)",
                      border: `1px solid ${border}`, background: bg, color, fontSize: 14,
                      cursor: revealed ? "default" : "pointer", transition: "all 0.16s var(--ease)",
                    }}
                  >
                    <span>{opt}</span>
                    {revealed && isCorrect && <Icon name="check" size={15} />}
                    {revealed && isPicked && !isCorrect && <Icon name="x" size={15} />}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── OPEN ── */}
          {cur.type === "open" && (
            <div style={{ marginTop: 14 }}>
              <textarea
                className="note-area"
                placeholder="Typ hier je antwoord (optioneel) en vergelijk daarna met het modelantwoord…"
                value={openText}
                onChange={(e) => setOpenText(e.target.value)}
              />
              {!revealed && (
                <button className="btn btn-ghost" style={{ marginTop: 12, padding: "8px 14px", fontSize: 13 }} onClick={() => setRevealed(true)}>
                  <Icon name="idea" size={15} /> Toon modelantwoord
                </button>
              )}
              {revealed && (
                <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: "var(--r-sm)", background: "var(--accent-soft)", border: "1px solid var(--accent-line)" }}>
                  <div className="label-mono" style={{ color: "var(--accent)", marginBottom: 6 }}>Modelantwoord</div>
                  <p className="ex-brief-text" style={{ fontSize: 13.5, lineHeight: 1.55 }}>{cur.answer}</p>
                </div>
              )}
            </div>
          )}

          {/* explanation (mc) */}
          {cur.type === "mc" && revealed && cur.explanation && (
            <p className="ex-brief-text" style={{ marginTop: 14, fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>
              {cur.explanation}
            </p>
          )}

          {/* ── advance controls ── */}
          {cur.type === "mc" && revealed && (
            <div style={{ marginTop: 18, textAlign: "right" }}>
              <button className="btn btn-primary" onClick={() => commit(picked === cur.correctIndex ? "correct" : "wrong", picked ?? undefined)}>
                {index + 1 >= total ? "Bekijk resultaat" : "Volgende vraag"} <Icon name="arrow" size={15} />
              </button>
            </div>
          )}
          {cur.type === "open" && revealed && (
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <span className="sub" style={{ fontSize: 13, color: "var(--text-3)" }}>Had je het juist?</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost" style={{ color: "var(--bad)" }} onClick={() => commit("wrong")}>
                  <Icon name="x" size={15} /> Niet juist
                </button>
                <button className="btn btn-primary" onClick={() => commit("correct")}>
                  <Icon name="check" size={15} /> Ik had het juist
                </button>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    );
  }

  /* ─────────────── DONE ─────────────── */
  const score = answers.filter((a) => a.verdict === "correct").length;
  const total = answers.length;
  const pct = total ? Math.round((score / total) * 100) : 0;
  const grade = gradeLabel(pct);

  return (
    <div className="page page-anim" ref={ref}>
      <Reveal className="page-head">
        <div>
          <div className="kicker" style={{ marginBottom: 12 }}>Resultaat</div>
          <h1>Oefentoets afgerond</h1>
        </div>
      </Reveal>

      <Reveal delay={60} className="card" style={{ padding: 28, textAlign: "center", maxWidth: 560 }}>
        <div style={{ fontSize: 13, color: "var(--text-3)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Jouw score</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 56, lineHeight: 1, color: grade.color }}>{pct}%</div>
        <div style={{ marginTop: 8, fontSize: 16, color: "var(--text-2)" }}>{score} van {total} juist</div>
        <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "var(--surface-2)", border: "1px solid var(--border-2)", color: grade.color, fontWeight: 600, fontSize: 14 }}>
          {grade.label}
        </div>
        {best && best.pct > pct && (
          <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-3)" }}>Je beste score blijft {best.pct}%</div>
        )}
        <div style={{ marginTop: 22, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={start}><Icon name="refresh" size={15} /> Opnieuw</button>
          <button className="btn btn-ghost" onClick={() => setPhase("intro")}>Instellingen</button>
        </div>
      </Reveal>

      {/* review */}
      <Reveal delay={120} style={{ marginTop: 18, maxWidth: 760 }}>
        <button className="btn btn-ghost" style={{ marginBottom: 12 }} onClick={() => setReviewOpen((s) => !s)}>
          <Icon name="eye" size={15} /> {reviewOpen ? "Verberg" : "Bekijk"} overzicht ({total} vragen)
        </button>
        {reviewOpen && (
          <div style={{ display: "grid", gap: 10 }}>
            {answers.map((a, i) => {
              const { text, code } = splitQ(a.q.question);
              const ok = a.verdict === "correct";
              return (
                <div key={a.q.id} className="card" style={{ padding: "14px 16px", borderLeft: `3px solid ${ok ? "var(--good)" : "var(--bad)"}` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: ok ? "var(--good)" : "var(--bad)", marginTop: 2, flex: "none" }}>
                      <Icon name={ok ? "check" : "x"} size={15} />
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>
                        <span style={{ color: "var(--text-3)", fontWeight: 500 }}>{i + 1}. </span>{text}
                      </div>
                      {code && <pre style={{ margin: "6px 0", padding: "8px 10px", borderRadius: "var(--r-sm)", background: "var(--surface-2)", fontFamily: "var(--font-mono)", fontSize: 11.5, lineHeight: 1.5, overflowX: "auto", whiteSpace: "pre" }}>{code}</pre>}
                      {a.q.type === "mc" ? (
                        <div style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 4 }}>
                          Juist: <span style={{ color: "var(--good)" }}>{a.q.options?.[a.q.correctIndex ?? 0]}</span>
                          {!ok && a.picked != null && (
                            <> · jouw keuze: <span style={{ color: "var(--bad)" }}>{a.q.options?.[a.picked]}</span></>
                          )}
                        </div>
                      ) : (
                        <div style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 4 }}>{a.q.answer}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Reveal>
    </div>
  );
}
