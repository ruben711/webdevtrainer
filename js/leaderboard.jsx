/* Leaderboard — podium showpiece + ranked list */
function Delta({ d }) {
  if (d === 0) return <span className="lb-delta delta-flat"><Icon name="minus" size={12} /></span>;
  if (d > 0) return <span className="lb-delta delta-up"><Icon name="arrowUp" size={12} />{d}</span>;
  return <span className="lb-delta delta-down"><Icon name="arrowDown" size={12} />{Math.abs(d)}</span>;
}

function XpBar({ value, max, you }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  useEffect(() => onVisible(ref.current, () => setTimeout(() => setW(Math.round((value / max) * 100)), 120)), [value, max]);
  return <div className="lb-xpbar" ref={ref}><span style={{ width: w + "%" }} /></div>;
}

function Podium({ p, place }) {
  const [up, setUp] = useState(false);
  useEffect(() => { const t = setTimeout(() => setUp(true), 150 + (3 - place) * 170); return () => clearTimeout(t); }, [place]);
  const heights = { 1: 92, 2: 66, 3: 50 };
  return (
    <div className={`podium-col podium-${place}`}>
      <div className="podium-card" style={{ transform: up ? "none" : "translateY(26px) scale(0.92)", opacity: up ? 1 : 0, transition: "transform 0.7s var(--spring), opacity 0.5s ease" }}>
        <div className={`podium-medal medal-${place}`}>{place}</div>
        <div style={{ display: "grid", placeItems: "center", marginTop: 6 }}>
          <Avatar name={p.name} size={place === 1 ? 60 : 50} you={p.you} />
        </div>
        <div className="podium-name">{p.name}</div>
        <div className="podium-xp">{p.xp.toLocaleString("nl-NL")} XP</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 9 }}>
          <span className="chip" style={{ padding: "3px 8px", fontSize: 10.5 }}>LVL {p.level}</span>
          <span className="chip" style={{ padding: "3px 8px", fontSize: 10.5, color: "var(--warn)" }}><Icon name="flame" size={11} fill />{p.streak}</span>
        </div>
      </div>
      <div className="podium-bar" style={{ height: up ? heights[place] : 0, transition: "height 0.8s var(--spring) 0.2s", overflow: "hidden" }}>{up && place}</div>
    </div>
  );
}

function Leaderboard({ go }) {
  const { leaderboard } = window.APP_DATA;
  const ref = useReveal();
  const [scope, setScope] = useState("De klas");
  const [period, setPeriod] = useState("Deze week");
  const max = leaderboard[0].xp;
  const top3 = [leaderboard[1], leaderboard[0], leaderboard[2]];
  const you = leaderboard.find(p => p.you);
  const podiumGap = (leaderboard[2].xp - you.xp).toLocaleString("nl-NL");

  return (
    <div className="page page-anim" ref={ref}>
      <Reveal className="page-head">
        <div>
          <div className="kicker" style={{ marginBottom: 12 }}>Competitie · {period.toLowerCase()}</div>
          <h1>Klassement</h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div className="segment">{["De klas", "Iedereen"].map(s => <button key={s} className={scope === s ? "on" : ""} onClick={() => setScope(s)}>{s}</button>)}</div>
          <div className="segment">{["Deze week", "Altijd"].map(s => <button key={s} className={period === s ? "on" : ""} onClick={() => setPeriod(s)}>{s}</button>)}</div>
        </div>
      </Reveal>

      <Reveal delay={40}><div className="podium">{top3.map(p => <Podium key={p.rank} p={p} place={p.rank} />)}</div></Reveal>

      <Reveal className="you-banner" delay={200}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="lb-rank" style={{ color: "var(--accent)", fontSize: 22 }}>#{you.rank}</span>
          <Avatar name={you.name} size={40} you />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>Jouw plek · +3 deze week</div>
            <div className="num" style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>NOG {podiumGap} XP TOT HET PODIUM</div>
          </div>
        </div>
        <span className="num" style={{ fontSize: 17, fontWeight: 600, color: "var(--accent)" }}>{you.xp.toLocaleString("nl-NL")} XP</span>
      </Reveal>

      <Reveal className="card lb-table" delay={120} style={{ padding: "8px 10px" }}>
        <div className="lb-colhead"><span>#</span><span>Naam</span><span>Voortgang</span><span style={{ textAlign: "right" }}>XP</span><span style={{ textAlign: "right" }}>Δ wk</span></div>
        {leaderboard.map((p, i) => (
          <Reveal key={p.rank} delay={i * 40} className={`lb-row ${p.you ? "you" : ""}`}>
            <span className="lb-rank">{p.rank}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <Avatar name={p.name} size={34} you={p.you} />
              <div style={{ minWidth: 0 }}>
                <div className="lb-name">{p.name}</div>
                <div className="lb-sub">LVL {p.level} · {p.streak} dgn</div>
              </div>
            </div>
            <XpBar value={p.xp} max={max} you={p.you} />
            <span className="lb-xpval" style={{ color: p.you ? "var(--accent)" : "var(--text)" }}>{p.xp.toLocaleString("nl-NL")}</span>
            <Delta d={p.delta} />
          </Reveal>
        ))}
      </Reveal>
    </div>
  );
}
window.Leaderboard = Leaderboard;
