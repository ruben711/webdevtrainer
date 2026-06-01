/* Chapters — gamified card grid with rings + states */
function ChapterCard({ c, go }) {
  const pct = Math.round((c.done / c.total) * 100);
  const state = c.locked ? "locked" : c.done >= c.total ? "done" : "prog";
  const stateLabel = { done: "Voltooid", prog: "Bezig", locked: "Vergrendeld" }[state];
  return (
    <div className={`card chapter ${c.locked ? "locked" : ""}`} onClick={() => !c.locked && go("exercise")}>
      <div style={{ minWidth: 0 }}>
        <div className="ch-n">HOOFDSTUK {c.n}</div>
        <h3>{c.title}</h3>
        <p>{c.desc}</p>
        <div className="ch-foot">
          <span className={`ch-state ${state}`}>
            {state === "done" && <Icon name="check" size={13} />}
            {state === "prog" && <Icon name="bolt" size={12} fill />}
            {state === "locked" && <Icon name="lock" size={12} />}
            {stateLabel}
          </span>
          {!c.locked && <span className="ch-frac">{c.done}/{c.total} · <span className={`tag ${c.tag}`} style={{ padding: "2px 7px" }}>{c.tag}</span></span>}
        </div>
      </div>
      <ProgressRing value={c.locked ? 0 : pct} size={62} stroke={6} variant={state === "done" ? "done" : ""}>
        {c.locked
          ? <Icon name="lock" size={18} style={{ color: "var(--text-3)" }} />
          : <span className="num" style={{ fontSize: 13, fontWeight: 600, color: state === "done" ? "var(--accent)" : "var(--text)" }}>{pct}<span style={{ fontSize: 9 }}>%</span></span>}
      </ProgressRing>
    </div>
  );
}

function Chapters({ go }) {
  const { chapters } = window.APP_DATA;
  const ref = useReveal();
  const [filter, setFilter] = useState("Alle");
  const filters = ["Alle", "HTML", "CSS", "JS"];
  const shown = chapters.filter(c => filter === "Alle" || c.tag === filter);
  const totalDone = chapters.reduce((a, c) => a + c.done, 0);
  const totalAll = chapters.reduce((a, c) => a + c.total, 0);
  const overall = Math.round((totalDone / totalAll) * 100);

  return (
    <div className="page page-anim" ref={ref}>
      <Reveal className="page-head">
        <div>
          <div className="kicker" style={{ marginBottom: 12 }}>Frontend leerpad</div>
          <h1>Hoofdstukken</h1>
          <p className="sub" style={{ color: "var(--text-2)", marginTop: 12, maxWidth: "48ch" }}>Werk de blokken af, verzamel XP en ontgrendel het volgende hoofdstuk.</p>
        </div>
        <div className="card" style={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 18 }}>
          <ProgressRing value={overall} size={60} stroke={7}><span className="num" style={{ fontSize: 14, fontWeight: 600 }}>{overall}%</span></ProgressRing>
          <div>
            <div className="num" style={{ fontWeight: 700, fontSize: 22 }}><AnimatedNumber value={totalDone} /> <span style={{ color: "var(--text-3)", fontWeight: 500 }}>/ {totalAll}</span></div>
            <div style={{ color: "var(--text-3)", fontSize: 12.5, fontWeight: 600 }}>oefeningen voltooid</div>
          </div>
        </div>
      </Reveal>

      <Reveal className="segment" delay={60} style={{ marginBottom: 22 }}>
        {filters.map(f => <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>{f}</button>)}
      </Reveal>

      <div className="chapter-grid">
        {shown.map((c, i) => (
          <Reveal key={c.id} delay={i * 55}><ChapterCard c={c} go={go} /></Reveal>
        ))}
      </div>
    </div>
  );
}
window.ChapterCard = ChapterCard;
window.Chapters = Chapters;
