import { GRADER_SOURCE } from "./jsGrader";

/* ════════════════════════════════════════════════════════════════════
   testHarness — het injecteerbare script dat in de iframe draait.

   Het draait VÓÓR de student-code (in <head>) zodat het alle console-output
   en runtime-fouten opvangt, en stuurt alles via postMessage naar de parent.
   De parent valideert op event.source (de iframe is een opaque origin zonder
   allow-same-origin, dus event.origin === "null").

   Definieert window.__ckRunChecks(checks) die de grader (uit jsGrader)
   aanroept en de resultaten terugpost.
   ════════════════════════════════════════════════════════════════════ */
function __ckHarness() {
  const w = window as any;
  if (w.__ck) return;
  const post = (msg: any) => {
    try {
      parent.postMessage(Object.assign({ source: "ck-runner" }, msg), "*");
    } catch {
      /* parent gone */
    }
  };
  const start = Date.now();
  w.__ck = { console: [], files: {} };

  const fmt = (args: any) =>
    Array.prototype.map
      .call(args, (a: any) => {
        if (typeof a === "string") return a;
        if (a instanceof Error) return a.name + ": " + a.message;
        try {
          return JSON.stringify(a, null, 2);
        } catch {
          return String(a);
        }
      })
      .join(" ");

  ["log", "info", "warn", "error"].forEach((level) => {
    const c: any = console;
    const orig = c[level] ? c[level].bind(console) : function () {};
    c[level] = function () {
      const entry = { level, text: fmt(arguments), t: Date.now() - start };
      w.__ck.console.push(entry);
      post({ kind: "console", entry });
      orig.apply(console, arguments as any);
    };
  });

  window.onerror = function (message) {
    post({ kind: "error", text: String(message) });
    return false;
  };
  window.addEventListener("unhandledrejection", function (e: any) {
    const r = e && e.reason;
    post({ kind: "error", text: "Unhandled rejection: " + (r && r.message ? r.message : r) });
  });

  w.__ckRunChecks = function (checks: any) {
    try {
      const results = w.__ckGrade(checks, { console: w.__ck.console, files: w.__ck.files });
      post({ kind: "results", results });
    } catch (e: any) {
      post({ kind: "error", text: "Grader-fout: " + (e && e.message ? e.message : e) });
      post({ kind: "results", results: [] });
    }
  };

  post({ kind: "ready" });
}

/* grader first (defines var __ckGrade), then the capture/protocol IIFE.
   Both via .toString() so there are zero string-escaping hazards. */
export const HARNESS_SOURCE =
  GRADER_SOURCE + ";(" + __ckHarness.toString() + ")();";
