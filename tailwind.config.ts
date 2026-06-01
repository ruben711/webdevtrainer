import type { Config } from "tailwindcss";

/*
 * Tailwind is used as a UTILITY layer on top of the existing hand-written
 * design system in css/styles.css. The visual tokens (colour, spacing, radius,
 * font, shadow) live in CSS variables; here we mirror the key ones so utilities
 * like `bg-accent`, `text-text-2`, `rounded-lg` map onto the real design tokens.
 *
 * Colours reference RGB-triple variables (defined in app/globals.css) so the
 * Tailwind `<alpha-value>` mechanism works, e.g. `bg-accent/20`.
 *
 * Preflight is OFF on purpose: css/styles.css already owns the base reset and
 * we must not let Tailwind's reset fight the existing look.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./js/**/*.{js,jsx}",
    "./pages/**/*.html",
  ],
  corePlugins: {
    // styles.css already owns the base reset — don't let Tailwind's reset fight it.
    preflight: false,
    // The design system uses the class name `.ring` for the progress ring.
    // Tailwind's `ring*` utilities share that name and would paint a blue
    // focus-ring box-shadow over every progress ring — disable them.
    ringWidth: false,
    ringColor: false,
    ringOffsetWidth: false,
    ringOffsetColor: false,
    ringOpacity: false,
  },
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg-rgb) / <alpha-value>)",
        "bg-2": "rgb(var(--bg-2-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2-rgb) / <alpha-value>)",
        "surface-3": "rgb(var(--surface-3-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        "accent-deep": "rgb(var(--accent-deep-rgb) / <alpha-value>)",
        "accent-ink": "rgb(var(--accent-ink-rgb) / <alpha-value>)",
        cyan: "rgb(var(--cyan-rgb) / <alpha-value>)",
        text: "rgb(var(--text-rgb) / <alpha-value>)",
        "text-2": "rgb(var(--text-2-rgb) / <alpha-value>)",
        "text-3": "rgb(var(--text-3-rgb) / <alpha-value>)",
        good: "rgb(var(--good-rgb) / <alpha-value>)",
        bad: "rgb(var(--bad-rgb) / <alpha-value>)",
        warn: "rgb(var(--warn-rgb) / <alpha-value>)",
        gold: "rgb(var(--gold-rgb) / <alpha-value>)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
      borderRadius: {
        DEFAULT: "var(--r)",
        sm: "var(--r-sm)",
        lg: "var(--r-lg)",
      },
      boxShadow: {
        soft: "var(--shadow)",
      },
      transitionTimingFunction: {
        ease: "var(--ease)",
        spring: "var(--spring)",
      },
      maxWidth: {
        page: "var(--maxw)",
      },
    },
  },
  plugins: [],
};

export default config;
