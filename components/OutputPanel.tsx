"use client";

import { Icon } from "@/components/Icon";
import type { CheckResult, ConsoleEntry } from "@/lib/types";

export type OutTab = "console" | "tests" | "errors";

export function OutputPanel({
  tab,
  setTab,
  consoleEntries,
  results,
  errors,
}: {
  tab: OutTab;
  setTab: (t: OutTab) => void;
  consoleEntries: ConsoleEntry[];
  results: CheckResult[];
  errors: string[];
}) {
  const passed = results.filter((r) => r.pass).length;
  const total = results.length;

  return (
    <div className="ck-output">
      <div className="out-tabs">
        <button className={`out-tab ${tab === "console" ? "on" : ""}`} onClick={() => setTab("console")}>
          <Icon name="terminal" size={13} />
          Console
          {consoleEntries.length > 0 && <span className="out-badge">{consoleEntries.length}</span>}
        </button>
        <button className={`out-tab ${tab === "tests" ? "on" : ""}`} onClick={() => setTab("tests")}>
          <Icon name="check" size={13} />
          Tests
          {total > 0 && (
            <span className={`out-badge ${passed === total ? "ok" : ""}`}>
              {passed}/{total}
            </span>
          )}
        </button>
        <button className={`out-tab ${tab === "errors" ? "on" : ""}`} onClick={() => setTab("errors")}>
          <Icon name="alert" size={13} />
          Fouten
          {errors.length > 0 && <span className="out-badge bad">{errors.length}</span>}
        </button>
      </div>

      <div className="out-body scroll">
        {tab === "console" &&
          (consoleEntries.length === 0 ? (
            <div className="console-empty">Nog geen console-output. Run je code.</div>
          ) : (
            consoleEntries.map((e, i) => (
              <div key={i} className={`console-line console-${e.level}`}>
                <span className="console-time num">{(e.t / 1000).toFixed(2)}s</span>
                <span>{e.text}</span>
              </div>
            ))
          ))}

        {tab === "tests" &&
          (total === 0 ? (
            <div className="console-empty">Nog niet verbeterd. Klik op &ldquo;Run &amp; check&rdquo;.</div>
          ) : (
            <>
              <div className="test-summary">
                <span>Resultaat</span>
                <span style={{ color: passed === total ? "var(--accent)" : "var(--text)" }}>
                  {passed} / {total} doelen geslaagd
                </span>
              </div>
              {results.map((r) => (
                <div key={r.id}>
                  <div className={`test-row ${r.pass ? "pass" : "fail"}`}>
                    <span className="test-ic">
                      <Icon name={r.pass ? "check" : "x"} size={14} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div>{r.label}</div>
                      {r.detail && <div className="test-detail">{r.detail}</div>}
                      {r.cases?.map((cs, j) => (
                        <div key={j} className="test-detail" style={{ color: cs.pass ? "var(--text-3)" : "var(--bad)" }}>
                          {cs.pass ? "✓" : "✗"} {cs.label}
                          {cs.detail ? ` ${cs.detail}` : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ))}

        {tab === "errors" &&
          (errors.length === 0 ? (
            <div className="console-empty">Geen fouten 🎉</div>
          ) : (
            errors.map((e, i) => (
              <div key={i} className="console-line console-error">
                <span className="console-time">
                  <Icon name="alert" size={12} />
                </span>
                <span>{e}</span>
              </div>
            ))
          ))}
      </div>
    </div>
  );
}
