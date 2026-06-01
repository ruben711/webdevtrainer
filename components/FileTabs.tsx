"use client";

import { Icon } from "@/components/Icon";
import type { FileSpec } from "@/lib/types";

export function FileTabs({
  files,
  active,
  setActive,
  errorFiles,
  onRun,
  running,
}: {
  files: FileSpec[];
  active: string;
  setActive: (name: string) => void;
  errorFiles: Set<string>;
  onRun: () => void;
  running: boolean;
}) {
  return (
    <div className="tabbar">
      <div style={{ display: "flex", overflowX: "auto", flex: 1 }}>
        {files.map((f) => (
          <button
            key={f.name}
            className={`tab ${active === f.name ? "on" : ""}`}
            onClick={() => setActive(f.name)}
          >
            {errorFiles.has(f.name) && <span className="err-dot" />}
            {f.name}
          </button>
        ))}
      </div>
      <div className="run-bar" style={{ paddingRight: 10, paddingLeft: 10 }}>
        <button className="btn btn-primary" style={{ padding: "7px 15px", fontSize: 13 }} onClick={onRun}>
          <Icon name="play" size={14} fill />
          {running ? "bezig…" : "Run & check"}
        </button>
      </div>
    </div>
  );
}
