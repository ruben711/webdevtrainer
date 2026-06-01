import type { CheckResult, RunnerMessage } from "./types";

/* ════════════════════════════════════════════════════════════════════
   jsGrader — implementatie van de 5 grading-strategieën.

   Deze functie draait BINNEN de gesandboxde iframe (geen same-origin), dus
   ze wordt geserialiseerd via .toString() en geïnjecteerd door testHarness.
   Ze gebruikt enkel iframe-globals (document/window/getComputedStyle) plus
   een ctx met de opgevangen console-output en de ruwe bestandsinhoud.

   Strategieën: console · function · dom · css · static.
   ════════════════════════════════════════════════════════════════════ */
function __ckGrade(checks: any[], ctx: any): any[] {
  const results: any[] = [];

  const norm = (s: any) => String(s).replace(/\r/g, "").trim();
  const deepEq = (a: any, b: any) => {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return a === b;
    }
  };
  // "/pattern/flags" -> RegExp ; otherwise null (treat as literal substring)
  const toRegex = (p: string): RegExp | null => {
    if (typeof p !== "string") return null;
    const m = p.match(/^\/(.*)\/([a-z]*)$/i);
    if (m) {
      try {
        return new RegExp(m[1], m[2]);
      } catch {
        return null;
      }
    }
    return null;
  };
  const fire = (el: any, action: string, value?: string) => {
    if (action === "click")
      el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    else if (action === "input") {
      if ("value" in el) el.value = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (action === "submit")
      el.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  };
  const runActions = (actions: any[]) => {
    (actions || []).forEach((a) => {
      const times = a.times || 1;
      for (let i = 0; i < times; i++) {
        document.querySelectorAll(a.selector).forEach((el) => fire(el, a.action, a.value));
      }
    });
  };

  checks.forEach((c) => {
    const res: any = { id: c.id, label: c.label, type: c.type, pass: false, cases: [] };
    try {
      if (c.type === "console") {
        const levels = c.levels || ["log"];
        // If the check has `before` actions (e.g. move a slider), clear the
        // captured console first, run the actions, then read only the new output.
        if (c.before && c.before.length) {
          // clear in-place so the harness's console.log override keeps pushing
          // to the SAME array (reassignment would break the reference)
          ctx.console.splice(0);
          runActions(c.before);
        }
        const out = (ctx.console || [])
          .filter((e: any) => levels.indexOf(e.level) >= 0)
          .map((e: any) => e.text)
          .join("\n");
        const exp = norm(c.expected);
        const got = norm(out);
        res.pass = c.match === "includes" ? got.indexOf(exp) >= 0 : got === exp;
        if (!res.pass) res.detail = "verwacht " + JSON.stringify(c.expected) + ", kreeg " + JSON.stringify(out);
      } else if (c.type === "function") {
        // `function f(){}` lands on window; a top-level `const f = () => {}` in a
        // classic script does NOT — it lives in the global lexical scope. Indirect
        // eval resolves both, so const-arrow functions are testable too.
        let fn: any = (window as any)[c.name];
        if (typeof fn !== "function") {
          try {
            fn = (0, eval)(c.name);
          } catch {
            /* not defined */
          }
        }
        if (typeof fn !== "function") {
          res.pass = false;
          res.detail = "functie " + c.name + " bestaat niet";
        } else {
          let allOk = true;
          c.cases.forEach((cs: any) => {
            let got: any;
            let ok = false;
            try {
              got = fn.apply(null, cs.args);
              ok = deepEq(got, cs.expected);
            } catch (e: any) {
              got = String(e);
              ok = false;
            }
            if (!ok) allOk = false;
            res.cases.push({
              label: c.name + "(" + cs.args.map((x: any) => JSON.stringify(x)).join(", ") + ")",
              pass: ok,
              detail: ok ? "" : "→ " + JSON.stringify(got) + " (verwacht " + JSON.stringify(cs.expected) + ")",
            });
          });
          res.pass = allOk;
        }
      } else if (c.type === "dom") {
        runActions(c.before);
        let allOk = true;
        c.assertions.forEach((a: any) => {
          let ok = true;
          let detail = "";
          const el = document.querySelector(a.selector);
          const list = document.querySelectorAll(a.selector);
          if (a.exists !== undefined) ok = ok && !!el === a.exists;
          if (a.count !== undefined) ok = ok && list.length === a.count;
          if (a.textEquals !== undefined) {
            const t = el ? norm(el.textContent) : null;
            const match = t === norm(a.textEquals);
            ok = ok && match;
            if (!match) detail = "tekst = " + JSON.stringify(t);
          }
          if (a.textIncludes !== undefined) ok = ok && !!el && (el.textContent || "").indexOf(a.textIncludes) >= 0;
          if (a.htmlIncludes !== undefined) ok = ok && document.body.innerHTML.indexOf(a.htmlIncludes) >= 0;
          if (a.attrEquals) ok = ok && !!el && el.getAttribute(a.attrEquals.name) === a.attrEquals.value;
          if (!ok) allOk = false;
          res.cases.push({ label: a.selector, pass: ok, detail });
        });
        res.pass = allOk;
      } else if (c.type === "css") {
        runActions(c.before);
        let allOk = true;
        c.checks.forEach((ck: any) => {
          const el = document.querySelector(ck.selector);
          let ok = false;
          let val = "(geen element)";
          if (el) {
            val = getComputedStyle(el).getPropertyValue(ck.property).trim();
            if (ck.equals !== undefined) ok = val === String(ck.equals).trim();
            else if (ck.matches) {
              const rx = toRegex(ck.matches) || new RegExp(ck.matches);
              ok = rx.test(val);
            }
          }
          if (!ok) allOk = false;
          res.cases.push({ label: ck.selector + " { " + ck.property + " }", pass: ok, detail: ok ? "" : "= " + JSON.stringify(val) });
        });
        res.pass = allOk;
      } else if (c.type === "static") {
        const files = ctx.files || {};
        const src = c.file
          ? files[c.file] || ""
          : Object.keys(files)
              .filter((n) => /\.js$/i.test(n))
              .map((n) => files[n])
              .join("\n");
        let allOk = true;
        (c.must || []).forEach((p: string) => {
          const rx = toRegex(p);
          const hit = rx ? rx.test(src) : src.indexOf(p) >= 0;
          if (!hit) allOk = false;
          res.cases.push({ label: "bevat " + p, pass: hit });
        });
        (c.mustNot || []).forEach((p: string) => {
          const rx = toRegex(p);
          const hit = rx ? rx.test(src) : src.indexOf(p) >= 0;
          if (hit) allOk = false;
          res.cases.push({ label: "bevat geen " + p, pass: !hit });
        });
        res.pass = allOk;
      }
    } catch (e: any) {
      res.pass = false;
      res.detail = "fout tijdens check: " + (e && e.message ? e.message : e);
    }
    results.push(res);
  });

  return results;
}

/* Serialised grader, assigned to a stable global name so it survives
   minification (the function's own name may be mangled, the var name won't). */
export const GRADER_SOURCE = "var __ckGrade=" + __ckGrade.toString() + ";";

/* ── parent-side helpers ── */
export function isRunnerMessage(d: unknown): d is RunnerMessage {
  return !!d && typeof d === "object" && (d as { source?: string }).source === "ck-runner";
}

export function allPass(results: CheckResult[]): boolean {
  return results.length > 0 && results.every((r) => r.pass);
}

export function score(results: CheckResult[]): { passed: number; total: number } {
  return { passed: results.filter((r) => r.pass).length, total: results.length };
}
