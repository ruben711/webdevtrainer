"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/* ---------- visibility helper (scroll-based; IO unreliable in embeds) ---------- */
export function onVisible(
  el: Element | null,
  cb: () => void,
  threshold = 0.94
): () => void {
  if (!el) return () => {};
  let done = false;
  const scroller: Element | Window =
    (el.closest && (el.closest(".main") || el.closest(".ex-brief"))) || window;
  const check = () => {
    if (done || !el.isConnected) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top < vh * threshold && r.bottom > -40) {
      done = true;
      cb();
      cleanup();
    }
  };
  const cleanup = () => {
    scroller.removeEventListener("scroll", check);
    window.removeEventListener("resize", check);
  };
  requestAnimationFrame(check);
  [60, 300, 900].forEach((ms) => setTimeout(check, ms));
  scroller.addEventListener("scroll", check, { passive: true });
  window.addEventListener("resize", check);
  return cleanup;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets =
      el.matches && el.matches(".reveal")
        ? [el]
        : Array.from(el.querySelectorAll<HTMLElement>(".reveal"));
    const cleans = targets.map((t) => onVisible(t, () => t.classList.add("in")));
    return () => cleans.forEach((c) => c && c());
  }, []);
  return ref;
}

export function Reveal({
  children,
  delay = 0,
  as = "div",
  className = "",
  style = {},
  ...rest
}: {
  children?: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}) {
  // Each Reveal observes ITSELF on mount, so dynamically-rendered Reveals
  // (e.g. after a filter change) still animate in — a container-level scan
  // would miss them.
  const ref = useRef<HTMLElement>(null);
  useEffect(() => onVisible(ref.current, () => ref.current?.classList.add("in")), []);
  return createElement(
    as,
    {
      ref,
      className: `reveal ${className}`,
      style: { "--d": delay + "ms", ...style } as CSSProperties,
      ...rest,
    },
    children
  );
}

/* ---------- Avatar (circle, initials) ---------- */
export function Avatar({
  name,
  size = 36,
  you = false,
}: {
  name: string;
  size?: number;
  you?: boolean;
}) {
  const initials =
    name === "Jij"
      ? "JIJ"
      : name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
  return (
    <div
      className={`avatar ${you ? "you" : ""}`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
    </div>
  );
}

/* ---------- Count up ---------- */
export function AnimatedNumber({
  value,
  duration = 1100,
  decimals = 0,
  suffix = "",
  prefix = "",
}: {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(
    () =>
      onVisible(ref.current, () => {
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(value * eased);
          if (p < 1) requestAnimationFrame(tick);
          else setVal(value);
        };
        requestAnimationFrame(tick);
      }),
    [value, duration]
  );
  const display = decimals
    ? val.toFixed(decimals)
    : Math.round(val).toLocaleString("nl-NL");
  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ---------- Progress ring (glow) ---------- */
export function ProgressRing({
  value,
  size = 64,
  stroke = 7,
  children,
  variant = "",
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  variant?: string;
}) {
  const [p, setP] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  useEffect(
    () => onVisible(ref.current, () => requestAnimationFrame(() => setP(value))),
    [value]
  );
  return (
    <div ref={ref} style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <svg className="ring" width={size} height={size}>
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle
          className={`ring-fill ${variant}`}
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c - (c * p) / 100}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        {children}
      </div>
    </div>
  );
}

/* ---------- Progress bar ---------- */
export function Bar({
  value,
  delay = 0,
  className = "",
}: {
  value: number;
  delay?: number;
  className?: string;
}) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(
    () => onVisible(ref.current, () => setTimeout(() => setW(value), delay)),
    [value, delay]
  );
  return (
    <div className={`bar ${className}`} ref={ref}>
      <span style={{ width: w + "%" }} />
    </div>
  );
}
