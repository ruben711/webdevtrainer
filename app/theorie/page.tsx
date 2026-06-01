"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Reveal, useReveal } from "@/components/ui";
import { CONTENT } from "@/data/content";
import type { TheoryItem } from "@/lib/types";

function McItem({ item }: { item: TheoryItem }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15.5, marginBottom: 14 }}>{item.question}</div>
      <div style={{ display: "grid", gap: 8 }}>
        {item.options?.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = i === item.correctIndex;
          const reveal = picked !== null;
          let border = "var(--border-2)";
          let bg = "var(--surface-2)";
          let color = "var(--text)";
          if (reveal && isCorrect) {
            border = "var(--accent-line)";
            bg = "var(--accent-soft)";
            color = "var(--accent)";
          } else if (reveal && isPicked && !isCorrect) {
            border = "rgba(255,93,77,0.4)";
            bg = "rgba(255,93,77,0.1)";
            color = "var(--bad)";
          }
          return (
            <button
              key={i}
              onClick={() => setPicked(i)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                textAlign: "left", padding: "11px 14px", borderRadius: "var(--r-sm)",
                border: `1px solid ${border}`, background: bg, color, fontSize: 14,
                transition: "all 0.16s var(--ease)",
              }}
            >
              <span>{opt}</span>
              {reveal && isCorrect && <Icon name="check" size={15} />}
              {reveal && isPicked && !isCorrect && <Icon name="x" size={15} />}
            </button>
          );
        })}
      </div>
      {picked !== null && item.explanation && (
        <p className="ex-brief-text" style={{ marginTop: 12, fontSize: 13, color: "var(--text-2)" }}>
          {item.explanation}
        </p>
      )}
    </div>
  );
}

function OpenItem({ item }: { item: TheoryItem }) {
  const [show, setShow] = useState(false);
  const [answer, setAnswer] = useState("");
  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15.5, marginBottom: 6 }}>{item.question}</div>
      <span className="chip" style={{ marginTop: 4 }}>open vraag</span>
      <textarea
        className="note-area"
        placeholder="Typ hier je antwoord…"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <div style={{ marginTop: 14 }}>
        <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setShow((s) => !s)}>
          <Icon name="idea" size={15} />
          {show ? "verberg modelantwoord" : "toon modelantwoord"}
        </button>
        {show && (
          <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: "var(--r-sm)", background: "var(--accent-soft)", border: "1px solid var(--accent-line)" }}>
            <p className="ex-brief-text" style={{ fontSize: 13.5 }}>{item.answer}</p>
            {item.explanation && (
              <p className="ex-brief-text" style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 8 }}>{item.explanation}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TheoriePage() {
  const ref = useReveal<HTMLDivElement>();
  const withTheory = CONTENT.filter((c) => c.theory.length > 0);
  const [active, setActive] = useState(withTheory[0]?.chapter.id ?? "");
  const current = withTheory.find((c) => c.chapter.id === active) ?? withTheory[0];

  return (
    <div className="page page-anim" ref={ref}>
      <Reveal className="page-head">
        <div>
          <div className="kicker" style={{ marginBottom: 12 }}>Studeer · geen XP</div>
          <h1>Theorie</h1>
          <p className="sub" style={{ color: "var(--text-2)", marginTop: 12, maxWidth: "50ch" }}>
            Test je kennis per hoofdstuk met meerkeuze- en open vragen. Rustig oefenen, zonder druk.
          </p>
        </div>
      </Reveal>

      {/* chapter picker */}
      <Reveal delay={50} style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 18 }} className="scroll">
        {withTheory.map((c) => (
          <button
            key={c.chapter.id}
            onClick={() => setActive(c.chapter.id)}
            className="chip"
            style={{
              whiteSpace: "nowrap",
              cursor: "pointer",
              borderColor: active === c.chapter.id ? "var(--accent-line)" : "var(--border-2)",
              background: active === c.chapter.id ? "var(--accent-soft)" : "transparent",
              color: active === c.chapter.id ? "var(--accent)" : "var(--text-2)",
            }}
          >
            {c.chapter.n} · {c.chapter.title}
          </button>
        ))}
      </Reveal>

      {current && (
        <div style={{ display: "grid", gap: 12 }}>
          {current.theory.map((item, i) => (
            <Reveal key={current.chapter.id + "-" + item.id} delay={Math.min(i * 50, 250)}>
              {item.type === "mc" ? <McItem item={item} /> : <OpenItem item={item} />}
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
