"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { CodeEditor } from "@/components/CodeEditor";
import { FileTabs } from "@/components/FileTabs";
import { FileTree } from "@/components/FileTree";
import { LivePreview, type Viewport } from "@/components/LivePreview";
import { OutputPanel, type OutTab } from "@/components/OutputPanel";
import { SolutionModal } from "@/components/SolutionModal";
import { assemble, extOf } from "@/lib/iframeRunner";
import { allPass, isRunnerMessage } from "@/lib/jsGrader";
import { DIFFICULTY_LABEL, xpForDifficulty } from "@/lib/difficulty";
import { useProgress } from "@/lib/store";
import { useMounted } from "@/lib/useMounted";
import { levelInfo } from "@/lib/level";
import { syncScore } from "@/lib/leaderboardSync";
import { displayName, getStyle, getUserId } from "@/lib/identity";
import { nextExerciseId } from "@/data/content";
import { fireXp } from "@/components/XpToast";
import type { CheckResult, ConsoleEntry, Exercise, FileSpec, GradeCheck } from "@/lib/types";

const GRADE_TIMEOUT = 5000;

function fireConfetti() {
  const colors = ["#c4f542", "#34e3da", "#eef2f3"];
  const wrap = document.createElement("div");
  wrap.className = "confetti";
  for (let i = 0; i < 80; i++) {
    const s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.background = colors[i % colors.length];
    s.style.animationDuration = 1.5 + Math.random() * 1.3 + "s";
    s.style.animationDelay = Math.random() * 0.3 + "s";
    s.style.transform = `scale(${0.7 + Math.random()})`;
    wrap.appendChild(s);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 3000);
}

const firstEditable = (files: FileSpec[]) =>
  files.find((f) => extOf(f.name) === "js" && !f.readOnly)?.name ||
  files.find((f) => !f.readOnly)?.name ||
  files[0].name;

export function ExerciseRunner({ exercise }: { exercise: Exercise }) {
  const [files, setFiles] = useState<FileSpec[]>(() => exercise.files.map((f) => ({ ...f })));
  const [active, setActive] = useState<string>(() => firstEditable(exercise.files));
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [status, setStatus] = useState<"idle" | "ok" | "partial">("idle");
  const [running, setRunning] = useState(false);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [showHint, setShowHint] = useState(false);
  const [showSol, setShowSol] = useState(false);
  const [tab, setTab] = useState<OutTab>("console");

  const iframeRef = useRef<HTMLIFrameElement>(null); // visible live preview
  const gradeRef = useRef<HTMLIFrameElement>(null); // hidden grading iframe
  const filesRef = useRef(files);
  filesRef.current = files;
  const docRef = useRef<string>("");
  const solvedOnce = useRef(false);
  const loadedRef = useRef(false);

  // progress store (gated by mounted to avoid hydration mismatch)
  const mounted = useMounted();
  const favorite = useProgress((s) => s.favorites.includes(exercise.id));
  const note = useProgress((s) => s.notes[exercise.id] ?? "");
  // grading pass plumbing
  const pendingRef = useRef<((r: CheckResult[]) => void) | null>(null);
  const passTimeoutRef = useRef<number>(0);

  const resById = useMemo(() => {
    const m: Record<string, CheckResult> = {};
    results.forEach((r) => (m[r.id] = r));
    return m;
  }, [results]);
  const passCount = exercise.checks.filter((c) => resById[c.id]?.pass).length;
  const errorFiles = useMemo(
    () => new Set(errors.length ? files.filter((f) => extOf(f.name) === "js").map((f) => f.name) : []),
    [errors.length, files]
  );

  // refresh the VISIBLE preview (no checks) — used by debounce, reload, run
  const refreshPreview = useCallback(() => {
    setConsoleEntries([]);
    setErrors([]);
    const doc = assemble({ files: filesRef.current });
    docRef.current = doc;
    if (iframeRef.current) iframeRef.current.srcdoc = doc;
  }, []);

  // run one grading pass in the hidden iframe; resolves with that pass's results
  const runPass = useCallback(
    (passChecks: GradeCheck[]) =>
      new Promise<CheckResult[]>((resolve) => {
        const iframe = gradeRef.current;
        if (!iframe) return resolve([]);
        pendingRef.current = resolve;
        window.clearTimeout(passTimeoutRef.current);
        passTimeoutRef.current = window.setTimeout(() => {
          pendingRef.current = null;
          if (gradeRef.current) gradeRef.current.srcdoc = "<!doctype html><meta charset=utf-8>";
          resolve(
            passChecks.map((c) => ({
              id: c.id,
              label: c.label,
              type: c.type,
              pass: false,
              detail: "time-out (5s) — mogelijk een oneindige lus",
            }))
          );
        }, GRADE_TIMEOUT);
        iframe.srcdoc = assemble({ files: filesRef.current, checks: passChecks, runChecks: true });
      }),
    []
  );

  const finalize = useCallback(
    (ordered: CheckResult[]) => {
      setResults(ordered);
      setRunning(false);
      const ok = allPass(ordered);
      setStatus(ok ? "ok" : "partial");
      setTab("tests");
      // record the attempt + award XP on first solve
      const res = useProgress.getState().recordAttempt(exercise, ok);
      if (res.firstSolve && res.awarded > 0) {
        fireXp({ amount: res.awarded, leveledUp: res.leveledUp, level: res.newLevel });
      }
      if (res.firstSolve) {
        const st = useProgress.getState();
        void syncScore({
          id: getUserId(),
          name: displayName(),
          xp: st.xp,
          level: levelInfo(st.xp).level,
          solved: Object.keys(st.solved).length,
          streak: st.streakCount,
          style: getStyle(),
        });
      }
      if (ok && !solvedOnce.current) {
        solvedOnce.current = true;
        fireConfetti();
      }
    },
    [exercise]
  );

  const evaluate = useCallback(async () => {
    setRunning(true);
    setResults([]);
    refreshPreview(); // show current code's console/errors in the visible preview

    const checks = exercise.checks;
    // dom/css mutate the DOM, so each runs against a FRESH render; the rest
    // (console/function/static) share one pass.
    const stateful = checks.filter((c) => c.type === "dom" || c.type === "css");
    const stateless = checks.filter((c) => c.type !== "dom" && c.type !== "css");
    const passes: GradeCheck[][] = [];
    if (stateless.length) passes.push(stateless);
    stateful.forEach((c) => passes.push([c]));

    const byId: Record<string, CheckResult> = {};
    let abort = false;
    for (const p of passes) {
      if (abort) {
        p.forEach((c) =>
          (byId[c.id] = { id: c.id, label: c.label, type: c.type, pass: false, detail: "niet uitgevoerd (afgebroken)" })
        );
        continue;
      }
      const rs = await runPass(p);
      rs.forEach((r) => (byId[r.id] = r));
      if (rs.some((r) => /time-out/.test(r.detail || ""))) {
        abort = true;
        setErrors((e) => [...e, "Time-out tijdens verbeteren (mogelijk een oneindige lus). Resterende checks afgebroken."]);
      }
      setResults(checks.map((c) => byId[c.id]).filter(Boolean) as CheckResult[]);
    }
    finalize(checks.map((c) => byId[c.id]).filter(Boolean) as CheckResult[]);
  }, [exercise.checks, refreshPreview, runPass, finalize]);

  // message listener — split by source (opaque origin => event.origin "null")
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (!isRunnerMessage(d)) return;
      if (e.source === iframeRef.current?.contentWindow) {
        if (d.kind === "console") setConsoleEntries((c) => [...c, d.entry]);
        else if (d.kind === "error") setErrors((er) => [...er, d.text]);
      } else if (e.source === gradeRef.current?.contentWindow) {
        if (d.kind === "results") {
          window.clearTimeout(passTimeoutRef.current);
          const resolve = pendingRef.current;
          pendingRef.current = null;
          resolve?.(d.results);
        }
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // debounced live preview (400ms) on any file change
  useEffect(() => {
    const id = window.setTimeout(refreshPreview, 400);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // load the student's saved work once (client only)
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const saved = useProgress.getState().files[exercise.id];
    if (saved && saved.length) {
      setFiles(saved.map((f) => ({ ...f })));
      setActive(firstEditable(saved));
    }
  }, [exercise.id]);

  // persist the student's work (debounced)
  useEffect(() => {
    const id = window.setTimeout(() => useProgress.getState().saveFiles(exercise.id, files), 700);
    return () => window.clearTimeout(id);
  }, [files, exercise.id]);

  const setContent = (name: string, val: string) =>
    setFiles((fs) => fs.map((f) => (f.name === name ? { ...f, content: val } : f)));

  const addFile = () => {
    const name = (window.prompt("Bestandsnaam (bv. js/helpers.js of data.json):") || "").trim();
    if (!name) return;
    if (files.some((f) => f.name === name)) {
      setActive(name);
      return;
    }
    setFiles((fs) => [...fs, { name, content: "" }]);
    setActive(name);
  };
  const deleteFile = (name: string) => {
    setFiles((fs) => fs.filter((f) => f.name !== name));
    if (active === name) setActive(files.find((f) => f.name !== name)?.name || files[0].name);
  };
  const reset = () => {
    setFiles(exercise.files.map((f) => ({ ...f })));
    setResults([]);
    setStatus("idle");
    setConsoleEntries([]);
    setErrors([]);
    solvedOnce.current = false;
    setActive(firstEditable(exercise.files));
  };
  const applySolution = () => {
    if (!exercise.solution) return;
    setFiles((fs) =>
      fs.map((f) => (exercise.solution![f.name] ? { ...f, content: exercise.solution![f.name] } : f))
    );
    setShowSol(false);
    window.setTimeout(() => void evaluate(), 500);
  };
  const openInTab = () => {
    const doc = docRef.current || assemble({ files: filesRef.current });
    const url = URL.createObjectURL(new Blob([doc], { type: "text/html" }));
    window.open(url, "_blank");
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const xp = xpForDifficulty(exercise.difficulty);
  const nextId = nextExerciseId(exercise.id);

  return (
    <div className="ex-layout">
      {/* ─────────── BRIEF ─────────── */}
      <div className="ex-brief scroll">
        <Link href="/oefeningen" className="ex-back" style={{ textDecoration: "none" }}>
          <Icon name="arrow" size={14} style={{ transform: "rotate(180deg)" }} />
          terug naar oefeningen
        </Link>
        <div className="ex-metaline">
          <span className={`tag ${exercise.tag}`}>{exercise.tag}</span>
          <span className="num" style={{ fontSize: 12, color: "var(--text-3)" }}>
            {exercise.chapter}
          </span>
          <span className="num" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>
            {xp > 0 ? `${xp} XP` : "0 XP"}
          </span>
          {mounted && (
            <button
              className={`fav-btn ${favorite ? "on" : ""}`}
              style={{ marginLeft: "auto" }}
              title={favorite ? "Verwijder uit favorieten" : "Voeg toe aan favorieten"}
              onClick={() => useProgress.getState().toggleFavorite(exercise.id)}
            >
              <Icon name="star" size={16} fill={favorite} />
            </button>
          )}
        </div>
        <h1 className="ex-title">{exercise.title}</h1>
        <div className="ex-num">
          {exercise.chapter} · Oefening {exercise.n} van {exercise.of} · {DIFFICULTY_LABEL[exercise.difficulty]}
        </div>

        <p className="ex-brief-text" style={{ marginTop: 18 }} dangerouslySetInnerHTML={{ __html: exercise.brief }} />

        {exercise.hint && (
          <>
            <button
              className="btn btn-ghost"
              style={{ marginTop: 18, fontSize: 13, padding: "9px 14px" }}
              onClick={() => setShowHint((s) => !s)}
            >
              <Icon name="idea" size={15} />
              {showHint ? "verberg hint" : "toon hint"}
            </button>
            {showHint && (
              <p className="ex-brief-text" style={{ marginTop: 14, fontSize: 13.5, color: "var(--text-3)" }}>
                {exercise.hint}
              </p>
            )}
          </>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
          <button className="btn btn-ghost" style={{ fontSize: 12.5, padding: "8px 13px" }} onClick={reset}>
            <Icon name="refresh" size={14} />
            Reset
          </button>
          <Link
            href={nextId ? `/oefeningen/${nextId}` : "/oefeningen"}
            className="btn btn-ghost"
            style={{ fontSize: 12.5, padding: "8px 13px", textDecoration: "none" }}
          >
            {nextId ? "Volgende oefening" : "Naar oefeningen"}
            <Icon name="arrow" size={14} />
          </Link>
        </div>

        <div className="obj-head">
          <span className="kicker">Doelen</span>
          <span className="obj-count num" style={{ color: status === "ok" ? "var(--good)" : "var(--text-2)" }}>
            {passCount} / {exercise.checks.length}
          </span>
        </div>
        <div>
          {exercise.checks.map((c) => {
            const pass = resById[c.id]?.pass;
            return (
              <div key={c.id} className={`objective ${pass ? "pass" : ""}`}>
                <span className="obj-check">{pass && <Icon name="check" size={12} />}</span>
                <span>{c.label}</span>
              </div>
            );
          })}
        </div>

        {status === "ok" && (
          <div className="ex-solved">
            <div className="es-title">
              <Icon name="star" size={18} fill style={{ color: "var(--accent)" }} />
              Geslaagd{xp > 0 ? ` — +${xp} XP` : ""}
            </div>
            <p className="ex-brief-text" style={{ marginTop: 8, fontSize: 13.5 }}>
              Netjes — alle doelen geslaagd. Probeer gerust een andere oefening.
            </p>
            <Link
              href={nextId ? `/oefeningen/${nextId}` : "/oefeningen"}
              className="btn btn-primary"
              style={{ marginTop: 16, textDecoration: "none" }}
            >
              {nextId ? "Volgende oefening" : "Naar oefeningen"} <Icon name="arrow" size={15} />
            </Link>
          </div>
        )}

        {mounted && (
          <div style={{ marginTop: 24 }}>
            <span className="label-mono">Notities</span>
            <textarea
              className="note-area scroll"
              placeholder="Eigen notities bij deze oefening…"
              value={note}
              onChange={(e) => useProgress.getState().setNote(exercise.id, e.target.value)}
            />
          </div>
        )}

        {exercise.solution && (
          <button
            className="num"
            style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: "0.04em", marginTop: 22, display: "block" }}
            onClick={() => setShowSol(true)}
          >
            ↳ toon modeloplossing
          </button>
        )}
      </div>

      {/* ─────────── WORK ─────────── */}
      <div className="ck-work">
        <div className="ex-editor-region">
          <FileTree
            files={files}
            active={active}
            setActive={setActive}
            onAdd={addFile}
            onDelete={deleteFile}
            errorFiles={errorFiles}
          />
          <div className="editor-wrap">
            <FileTabs
              files={files}
              active={active}
              setActive={setActive}
              errorFiles={errorFiles}
              onRun={() => void evaluate()}
              running={running}
            />
            <CodeEditor
              files={files}
              active={active}
              onChange={setContent}
              onRun={() => void evaluate()}
              pathPrefix={exercise.id}
            />
          </div>
        </div>

        <div className="ck-bottom">
          <LivePreview
            iframeRef={iframeRef}
            viewport={viewport}
            setViewport={setViewport}
            onReload={refreshPreview}
            onOpenTab={openInTab}
          />
          <OutputPanel tab={tab} setTab={setTab} consoleEntries={consoleEntries} results={results} errors={errors} />
        </div>
      </div>

      {/* hidden grading iframe — off-screen but laid out so getComputedStyle works */}
      <iframe
        ref={gradeRef}
        title="grader"
        aria-hidden="true"
        sandbox="allow-scripts"
        style={{ position: "absolute", left: -99999, top: 0, width: 900, height: 640, border: 0, opacity: 0, pointerEvents: "none" }}
      />

      {showSol && exercise.solution && (
        <SolutionModal
          solution={exercise.solution}
          onApply={applySolution}
          onClose={() => setShowSol(false)}
        />
      )}
    </div>
  );
}
