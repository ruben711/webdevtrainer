"use client";

import type { RefObject } from "react";
import { Icon } from "@/components/Icon";

export type Viewport = "desktop" | "tablet" | "mobile";

export function LivePreview({
  iframeRef,
  viewport,
  setViewport,
  onReload,
  onOpenTab,
}: {
  iframeRef: RefObject<HTMLIFrameElement>;
  viewport: Viewport;
  setViewport: (v: Viewport) => void;
  onReload: () => void;
  onOpenTab: () => void;
}) {
  const vp: { id: Viewport; icon: string; title: string }[] = [
    { id: "mobile", icon: "smartphone", title: "Mobiel (390px)" },
    { id: "tablet", icon: "tablet", title: "Tablet (768px)" },
    { id: "desktop", icon: "monitor", title: "Desktop (volledig)" },
  ];
  return (
    <div className="preview-wrap">
      <div className="pane-head">
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          <span className="ph-name">preview · index.html</span>
        </div>
        <div className="pv-bar">
          <div className="pv-seg">
            {vp.map((v) => (
              <button
                key={v.id}
                className={viewport === v.id ? "on" : ""}
                onClick={() => setViewport(v.id)}
                title={v.title}
                aria-label={v.title}
              >
                <Icon name={v.icon} size={14} />
              </button>
            ))}
          </div>
          <button className="pv-icon-btn" onClick={onReload} title="Herlaad preview" aria-label="Herlaad">
            <Icon name="refresh" size={14} />
          </button>
          <button className="pv-icon-btn" onClick={onOpenTab} title="Open in nieuw tabblad" aria-label="Open in nieuw tabblad">
            <Icon name="external" size={14} />
          </button>
        </div>
      </div>
      <div className={`preview-frame ${viewport}`}>
        {/* sandbox WITHOUT allow-same-origin: the iframe is an opaque origin,
            so student code can never reach the parent's DOM/localStorage. */}
        <iframe ref={iframeRef} title="preview" sandbox="allow-scripts allow-modals" />
      </div>
    </div>
  );
}
