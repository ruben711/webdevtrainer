/* Dashboard — gamified dark */
function Dashboard({ go }) {
  const { user, chapters, leaderboard, activity, activeExercise: cont } = window.APP_DATA;
  const ref = useReveal();
  const pct = Math.round((user.xp / user.xpToNext) * 100);
  const toNext = (user.xpToNext - user.xp).toLocaleString("nl-NL");
  const maxAct = Math.max(...activity.map(a => a.v));
  const maxIdx = activity.findIndex(a => a.v === maxAct);
  const active = chapters.filter(c => !c.locked && c.done < c.total).slice(0, 4);
  const top5 = leaderboard.slice(0, 5);

  const stats = [
    { val: <AnimatedNumber value={user.solved} />, label: "Opgelost", icon: "check", color: "var(--accent)" },
    { val: <AnimatedNumber value={user.accuracy} suffix="%" />, label: "Nauwkeurig", icon: "target", color: "var(--cyan)" },
    { val: <AnimatedNumber value={user.streak} />, label: "Dagen reeks", icon: "flame", color: "var(--warn)" },
    { val: <AnimatedNumber value={Math.round(user.minutes / 60)} suffix="u" />, label: "Geoefend", icon: "clock", color: "var(--text)" },
  ];

  return (
    <div className="page page-anim" ref={ref}>
      {/* HERO */}
      <Reveal className="hero">
        <div className="hero-rows">
          <div>
            <div className="kicker" style={{ marginBottom: 14 }}>Welkom terug · dag {user.streak} op rij</div>
            <h1>Klaar om te <span className="hl">oefenen</span> voor het examen?</h1>
            <p className="sub">Je staat <b>#{user.rank} van de klas</b> en hebt nog <b className="num" style={{ color: "var(--accent)" }}>{toNext} XP</b> tot Level {user.level + 1}.</p>
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <button className="btn btn-primary btn-lg" onClick={() => go("exercise")}><Icon name="play" size={18} fill />Verder oefenen</button>
              <button className="btn btn-ghost btn-lg" onClick={() => go("chapters")}><Icon name="grid" size={18} />Hoofdstukken</button>
            </div>
          </div>
          <div className="ring-badge">
            <ProgressRing value={pct} size={150} stroke={12}>
              <div style={{ textAlign: "center" }}>
                <div className="num" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.12em" }}>LEVEL</div>
                <div className="num" style={{ fontWeight: 700, fontSize: 50, lineHeight: 1, color: "var(--text)" }}>{user.level}</div>
                <div className="num" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>{pct}%</div>
              </div>
            </ProgressRing>
            <div className="num" style={{ fontSize: 11.5, color: "var(--text-3)" }}>{user.xp.toLocaleString("nl-NL")} / {user.xpToNext.toLocaleString("nl-NL")} XP</div>
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
            <span className="tag JS" style={{ marginBottom: 12, display: "inline-block" }}>JS</span>
            <h3 style={{ fontSize: 22, marginTop: 12 }}>{cont.title}</h3>
            <p className="num" style={{ color: "var(--text-3)", fontSize: 12.5, marginTop: 8 }}>{cont.chapter} · Oefening {cont.n} / {cont.of}</p>
            <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => go("exercise")}><Icon name="code" size={17} />Open editor</button>
          </div>
          <ProgressRing value={Math.round((2 / 15) * 100)} size={92} stroke={9} variant="cy">
            <div className="num" style={{ fontWeight: 700, fontSize: 18 }}>{Math.round((2 / 15) * 100)}%</div>
          </ProgressRing>
        </Reveal>

        <Reveal className="card" delay={110} style={{ padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontSize: 16 }}>Deze week</h3>
            <span className="chip"><Icon name="bolt" size={12} fill style={{ color: "var(--accent)" }} />{activity.reduce((a, b) => a + b.v, 0)}</span>
          </div>
          <div className="activity">
            {activity.map((a, i) => (
              <div className="col" key={i}>
                <div className={`bar-v ${i === maxIdx ? "hot" : ""}`} style={{ height: Math.round((a.v / maxAct) * 100) + "%", "--d": i * 60 + "ms" }} />
                <span className="day">{["ma","di","wo","do","vr","za","zo"][i]}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* CHAPTERS + LEADERBOARD */}
      <div className="two-col" style={{ marginTop: 14, gridTemplateColumns: "1.3fr 1fr" }}>
        <Reveal>
          <div className="sec-head" style={{ margin: "0 0 16px" }}><h2 style={{ fontSize: 18 }}>Verder met je hoofdstukken</h2><button className="link" onClick={() => go("chapters")}>ALLE →</button></div>
          <div style={{ display: "grid", gap: 10 }}>
            {active.map(c => {
              const p = Math.round((c.done / c.total) * 100);
              return (
                <button key={c.id} className="card" onClick={() => go("exercise")} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center", padding: "14px 18px", textAlign: "left" }}>
                  <ProgressRing value={p} size={42} stroke={5}><span className="num" style={{ fontSize: 10, fontWeight: 600 }}>{p}</span></ProgressRing>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15.5 }}>{c.title}</div>
                    <div className="num" style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 3 }}>{c.n} · <span className={`tag ${c.tag}`} style={{ padding: "1px 6px" }}>{c.tag}</span></div>
                  </div>
                  <span className="num" style={{ fontSize: 13, color: "var(--text-2)" }}>{c.done}/{c.total}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="sec-head" style={{ margin: "0 0 16px" }}><h2 style={{ fontSize: 18 }}>Klassement</h2><button className="link" onClick={() => go("leaderboard")}>VOLLEDIG →</button></div>
          <div className="card" style={{ padding: 10 }}>
            {top5.map(p => (
              <div className={`mini-row ${p.you ? "you" : ""}`} key={p.rank}>
                <span className="mini-rank">{p.rank}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <Avatar name={p.name} size={30} you={p.you} />
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14.5 }}>{p.name}</span>
                </div>
                <span className="num" style={{ fontSize: 13, color: p.you ? "var(--accent)" : "var(--text-2)", fontWeight: 600 }}>{p.xp.toLocaleString("nl-NL")}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
window.Dashboard = Dashboard;
