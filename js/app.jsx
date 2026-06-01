/* App shell — routing + gamified Tweaks */
const { useState: useStateApp, useEffect: useEffectApp } = React;

const ACCENTS = {
  "Electric lime": { a: "#c4f542", deep: "#a6e022", ink: "#0d1500", glow: "rgba(196,245,66,0.45)" },
  "Cyaan": { a: "#34e3da", deep: "#1fc7bf", ink: "#04201e", glow: "rgba(52,227,218,0.45)" },
  "Magenta": { a: "#ff5da2", deep: "#e23c85", ink: "#2a0716", glow: "rgba(255,93,162,0.42)" },
  "Oranje": { a: "#ff8a3d", deep: "#e76f23", ink: "#2a1305", glow: "rgba(255,138,61,0.42)" },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "Electric lime",
  "glow": true,
  "anim": 7,
  "density": "ruim"
}/*EDITMODE-END*/;

function App() {
  const [route, setRoute] = useStateApp("dashboard");
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const go = (r) => { setRoute(r); document.querySelector(".main")?.scrollTo({ top: 0 }); };

  useEffectApp(() => {
    const root = document.documentElement;
    const c = ACCENTS[t.accent] || ACCENTS["Electric lime"];
    root.style.setProperty("--accent", c.a);
    root.style.setProperty("--accent-deep", c.deep);
    root.style.setProperty("--accent-ink", c.ink);
    root.style.setProperty("--glow", c.glow);
    root.style.setProperty("--accent-soft", c.a + "22");
    root.style.setProperty("--accent-line", c.a + "4d");
    root.style.setProperty("--anim", (t.anim / 7).toFixed(3));
    root.classList.toggle("no-glow", !t.glow);
    root.classList.toggle("dense", t.density === "compact");
  }, [t.accent, t.glow, t.anim, t.density]);

  const { user } = window.APP_DATA;

  return (
    <div className="app">
      <Sidebar route={route} go={go} user={user} />
      <main className="main scroll" key={route}>
        {route === "dashboard" && <Dashboard go={go} />}
        {route === "chapters" && <Chapters go={go} />}
        {route === "leaderboard" && <Leaderboard go={go} />}
        {route === "exercise" && <Exercise go={go} />}
      </main>

      <TweaksPanel>
        <TweakSection label="Accent" />
        <TweakRadio label="Kleur" value={t.accent} options={Object.keys(ACCENTS)} onChange={(v) => setTweak("accent", v)} />
        <TweakToggle label="Gloed-effecten" value={t.glow} onChange={(v) => setTweak("glow", v)} />
        <TweakSection label="Beweging & ritme" />
        <TweakSlider label="Animatie" value={t.anim} min={0} max={10} step={1} onChange={(v) => setTweak("anim", v)} />
        <TweakRadio label="Dichtheid" value={t.density} options={["ruim", "compact"]} onChange={(v) => setTweak("density", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
