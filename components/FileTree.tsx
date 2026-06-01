"use client";

import { Icon } from "@/components/Icon";
import { extOf } from "@/lib/iframeRunner";
import type { FileSpec } from "@/lib/types";

export function FileTree({
  files,
  active,
  setActive,
  onAdd,
  onDelete,
  errorFiles,
}: {
  files: FileSpec[];
  active: string;
  setActive: (name: string) => void;
  onAdd: () => void;
  onDelete: (name: string) => void;
  errorFiles: Set<string>;
}) {
  const roots = files.filter((f) => !f.name.includes("/"));
  const folders: Record<string, FileSpec[]> = {};
  files
    .filter((f) => f.name.includes("/"))
    .forEach((f) => {
      const dir = f.name.split("/")[0];
      (folders[dir] = folders[dir] || []).push(f);
    });

  const FileBtn = ({ f, nested }: { f: FileSpec; nested?: boolean }) => {
    const ext = extOf(f.name);
    const short = nested ? f.name.split("/").slice(1).join("/") : f.name;
    const base = short.replace(/\.[^.]+$/, "");
    return (
      <button
        className={`file-item ${nested ? "nested" : ""} ${active === f.name ? "on" : ""}`}
        onClick={() => setActive(f.name)}
      >
        <span>
          {base}
          <span className={`ext ext-${ext}`}>.{ext}</span>
        </span>
        {errorFiles.has(f.name) && <span className="err-dot" title="bevat fouten" />}
        {files.length > 1 && (
          <span
            className="file-del"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(f.name);
            }}
            title="verwijderen"
          >
            ×
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="filetree">
      <div className="filetree-head">
        <span className="ft-title">Bestanden</span>
        <button className="ft-add" onClick={onAdd} title="nieuw bestand">
          +
        </button>
      </div>
      <div className="filetree-body scroll">
        {roots.map((f) => (
          <FileBtn key={f.name} f={f} />
        ))}
        {Object.keys(folders).map((dir) => (
          <div key={dir}>
            <div className="ft-folder">
              <Icon name="chevron" size={11} style={{ transform: "rotate(90deg)", opacity: 0.6 }} />
              {dir}/
            </div>
            {folders[dir].map((f) => (
              <FileBtn key={f.name} f={f} nested />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
