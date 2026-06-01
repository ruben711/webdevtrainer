import { HARNESS_SOURCE } from "./testHarness";
import type { FileSpec, GradeCheck } from "./types";

export const extOf = (n: string) => (n.split(".").pop() || "").toLowerCase();

/* Anything injected into a <script> must not contain a literal </script> or
   the U+2028/U+2029 separators that break inline scripts. (Built with
   fromCharCode so no literal separator bytes live in this source file.) */
const SEP_2028 = new RegExp(String.fromCharCode(0x2028), "g");
const SEP_2029 = new RegExp(String.fromCharCode(0x2029), "g");
function escScript(s: string): string {
  return s
    .replace(/<\/script/gi, "<\\/script")
    .replace(SEP_2028, "\\u2028")
    .replace(SEP_2029, "\\u2029");
}

export interface AssembleOptions {
  files: FileSpec[];
  checks?: GradeCheck[];
  /** when true, the harness runs the checks after load and posts results */
  runChecks?: boolean;
}

/* Build one runnable HTML document from the student's files.
   Convention: every .css -> <style>, every .js -> <script>, every .html ->
   body markup, all in file order. The capture/grader harness is injected in
   <head> so it runs before any student code. */
/* The course's File/Code template ships a FULL html document that links
   styles/style.css + scripts/code.js. We inject those file contents inline,
   so: take the <body> inner markup (if it's a full doc) and strip the
   external <link rel=stylesheet> / <script src> tags to avoid 404s. */
function bodyMarkup(htmlContent: string): string {
  const m = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const inner = m ? m[1] : htmlContent;
  return inner
    .replace(/<script\b[^>]*\bsrc=[^>]*>\s*<\/script>/gi, "")
    .replace(/<link\b[^>]*>/gi, "");
}

export function assemble({ files, checks = [], runChecks = false }: AssembleOptions): string {
  const css = files.filter((f) => extOf(f.name) === "css").map((f) => f.content).join("\n");
  const js = files.filter((f) => extOf(f.name) === "js").map((f) => f.content).join("\n;\n");
  const html = files
    .filter((f) => extOf(f.name) === "html")
    .map((f) => bodyMarkup(f.content))
    .join("\n");

  const filesMap: Record<string, string> = {};
  files.forEach((f) => {
    filesMap[f.name] = f.content;
  });

  // neutral page defaults so previews look clean (student CSS overrides these)
  const defaults =
    "html,body{margin:0}body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;padding:16px;color:#16181c;background:#fff;line-height:1.5}";

  const filesScript = `<script>window.__ck.files=${escScript(JSON.stringify(filesMap))};</script>`;
  // wait for `load` (the course's setup runs on load) before grading
  const trigger = runChecks
    ? `<script>(function(){var C=${escScript(
        JSON.stringify(checks)
      )};function go(){setTimeout(function(){window.__ckRunChecks(C);},40);}if(document.readyState==="complete")go();else window.addEventListener("load",go);})();</script>`
    : "";

  return (
    `<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<style>${defaults}\n${css}</style>` +
    `<script>${escScript(HARNESS_SOURCE)}</script>` +
    `</head><body>` +
    html +
    `<script>${escScript(js)}\n</script>` +
    filesScript +
    trigger +
    `</body></html>`
  );
}
