"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

type Props = {
  solution: Record<string, string>;
  onApply: () => void;
  onClose: () => void;
};

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <button
      className="btn btn-ghost"
      style={{ padding: "5px 11px", fontSize: 12 }}
      onClick={copy}
      type="button"
    >
      {copied ? "Gekopieerd ✓" : "Kopiëren"}
    </button>
  );
}

export function SolutionModal({ solution, onApply, onClose }: Props) {
  const entries = Object.entries(solution);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card scroll" style={{ maxWidth: 720 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 20 }}>Modeloplossing</h2>
          <button className="theme-toggle" onClick={onClose} aria-label="Sluiten" type="button">
            <Icon name="x" size={16} />
          </button>
        </div>

        <p className="ex-brief-text" style={{ fontSize: 13.5, color: "var(--text-3)", marginBottom: 16 }}>
          Bekijk gerust de oplossing. Je kiest zelf of je ze in de editor toepast.
        </p>

        {entries.map(([name, content]) => (
          <div key={name} style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <span className="label-mono">{name}</span>
              <CopyButton content={content} />
            </div>
            <pre
              className="scroll"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                lineHeight: 1.55,
                whiteSpace: "pre",
                overflow: "auto",
                maxHeight: 320,
                margin: 0,
                padding: 14,
                background: "var(--bg-2)",
                color: "var(--text-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-sm)",
                tabSize: 2,
              }}
            >
              {content}
            </pre>
          </div>
        ))}

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onApply} type="button">
            Toepassen in editor
          </button>
          <button className="btn btn-ghost" onClick={onClose} type="button">
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}
