/* Shared components + hooks — gamified dark. Exported to window. */
const { useState, useEffect, useRef, useCallback } = React;

/* ---------- Icons (stroke UI icons) ---------- */
const ICONS = {
  home: "M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  trophy: "M7 4h10v4a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 18h6M10 18v-3M14 18v-3M8 21h8",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16",
  flame: "M12 3c0 4-4 5-4 9a4 4 0 0 0 8 0c0-1.5-1-2.5-1-4 2 1 3 3 3 5a6 6 0 1 1-12 0c0-5 6-6 6-10z",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  target: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0",
  clock: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 7v5l3 2",
  check: "M5 12l5 5L20 6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  arrowUp: "M12 19V6M6 12l6-6 6 6",
  arrowDown: "M12 5v13M6 12l6 6 6-6",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  play: "M7 5v14l12-7z",
  refresh: "M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5",
  idea: "M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.7.7-1 1.2-1 2.5H9c0-1.3-.3-1.8-1-2.5A6 6 0 0 1 12 3z",
  star: "M12 3l2.6 6.2 6.7.5-5.1 4.4 1.6 6.5L12 17.7 6.2 21.1l1.6-6.5L2.7 9.7l6.7-.5z",
  minus: "M6 12h12",
  chevron: "M9 6l6 6-6 6",
};
function Icon({ name, size = 19, fill = false, style }) {
  const d = ICONS[name] || "";
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={style}
      fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {d.split("M").filter(Boolean).map((seg, i) => <path key={i} d={"M" + seg} />)}
    </svg>
  );
}

/* ---------- Avatar (circle, initials) ---------- */
function Avatar({ name, size = 36, you }) {
  const initials = name === "Jij" ? "JIJ" : name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return <div className={`avatar ${you ? "you" : ""}`} style={{ width: size, height: size, fontSize: size * 0.34 }}>{initials}</div>;
}

/* ---------- Visibility helper (scroll-based; IO unreliable in embeds) ---------- */
function onVisible(el, cb, threshold = 0.94) {
  if (!el) return () => {};
  let done = false;
  const scroller = (el.closest && (el.closest(".main") || el.closest(".ex-brief"))) || window;
  const check = () => {
    if (done || !el.isConnected) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top < vh * threshold && r.bottom > -40) { done = true; cb(); cleanup(); }
  };
  const cleanup = () => { scroller.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  requestAnimationFrame(check);
  [60, 300, 900].forEach(ms => setTimeout(check, ms));
  scroller.addEventListener("scroll", check, { passive: true });
  window.addEventListener("resize", check);
  return cleanup;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const targets = el.matches && el.matches(".reveal") ? [el] : [...el.querySelectorAll(".reveal")];
    const cleans = targets.map(t => onVisible(t, () => t.classList.add("in")));
    return () => cleans.forEach(c => c && c());
  }, []);
  return ref;
}
function Reveal({ children, delay = 0, as = "div", className = "", style = {}, ...rest }) {
  const Tag = as;
  return <Tag className={`reveal ${className}`} style={{ "--d": delay + "ms", ...style }} {...rest}>{children}</Tag>;
}

/* ---------- Count up ---------- */
function AnimatedNumber({ value, duration = 1100, decimals = 0, suffix = "", prefix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => onVisible(ref.current, () => {
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(value * eased);
      if (p < 1) requestAnimationFrame(tick); else setVal(value);
    };
    requestAnimationFrame(tick);
  }), [value, duration]);
  const display = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString("nl-NL");
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

/* ---------- Progress ring (glow) ---------- */
function ProgressRing({ value, size = 64, stroke = 7, children, variant = "" }) {
  const [p, setP] = useState(0);
  const ref = useRef(null);
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  useEffect(() => onVisible(ref.current, () => requestAnimationFrame(() => setP(value))), [value]);
  return (
    <div ref={ref} style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <svg className="ring" width={size} height={size}>
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle className={`ring-fill ${variant}`} cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c - (c * p) / 100} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>{children}</div>
    </div>
  );
}

/* ---------- Progress bar ---------- */
function Bar({ value, delay = 0, className = "" }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  useEffect(() => onVisible(ref.current, () => setTimeout(() => setW(value), delay)), [value, delay]);
  return <div className={`bar ${className}`} ref={ref}><span style={{ width: w + "%" }} /></div>;
}

/* ---------- Sidebar ---------- */
function Sidebar({ route, go, user }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "chapters", label: "Hoofdstukken", icon: "grid" },
    { id: "leaderboard", label: "Klassement", icon: "trophy" },
    { id: "exercise", label: "Oefening", icon: "code" },
  ];
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => go("dashboard")}>
        <div className="brand-mark">{"</>"}</div>
        <div className="brand-name">CodeKwartier<small>web dev trainer</small></div>
      </button>
      {items.map(it => (
        <button key={it.id} className={`nav-item ${route === it.id ? "active" : ""}`} onClick={() => go(it.id)}>
          <Icon name={it.icon} size={19} />{it.label}
        </button>
      ))}
      <div className="nav-spacer" />
      <div className="nav-user">
        <Avatar name={user.name} size={34} you />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>{user.name}</div>
          <div className="num" style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 2 }}>LVL {user.level} · #{user.rank}</div>
        </div>
      </div>
    </aside>
  );
}

function diffColor(d) {
  if (d === "Makkelijk") return "var(--accent)";
  if (d === "Gemiddeld") return "var(--cyan)";
  return "var(--warn)";
}

Object.assign(window, { Icon, Avatar, onVisible, useReveal, Reveal, AnimatedNumber, ProgressRing, Bar, Sidebar, diffColor });
