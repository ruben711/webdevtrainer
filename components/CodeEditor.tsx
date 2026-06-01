"use client";

import dynamic from "next/dynamic";
import { useMode } from "@/components/ModeProvider";
import { extOf } from "@/lib/iframeRunner";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div
      className="monaco-host"
      style={{
        display: "grid",
        placeItems: "center",
        color: "var(--text-3)",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
      }}
    >
      Editor laden…
    </div>
  ),
});

const langOf = (name: string) => {
  const e = extOf(name);
  if (e === "js" || e === "mjs" || e === "jsx") return "javascript";
  if (e === "ts" || e === "tsx") return "typescript";
  if (e === "html" || e === "htm") return "html";
  if (e === "css") return "css";
  if (e === "json") return "json";
  return "plaintext";
};

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

export function CodeEditor({
  file,
  value,
  onChange,
  onRun,
  readOnly = false,
  pathPrefix = "",
}: {
  file: string;
  value: string;
  onChange: (v: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
  /** namespaces the Monaco model so exercises sharing a filename
      (e.g. scripts/code.js) never reuse each other's model/content */
  pathPrefix?: string;
}) {
  const { resolved } = useMode();
  const theme = resolved === "light" ? "ck-light" : "ck-dark";

  const beforeMount = (monaco: any) => {
    monaco.editor.defineTheme("ck-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "5f6970", fontStyle: "italic" },
        { token: "keyword", foreground: "c4f542" },
        { token: "string", foreground: "9ad17a" },
        { token: "number", foreground: "34e3da" },
      ],
      colors: {
        "editor.background": "#0a0c0d",
        "editor.foreground": "#d6dde0",
        "editorLineNumber.foreground": "#3a4248",
        "editorLineNumber.activeForeground": "#99a3aa",
        "editor.selectionBackground": "#23381099",
        "editor.lineHighlightBackground": "#12161888",
        "editorCursor.foreground": "#c4f542",
        "editorIndentGuide.background": "#1a1f23",
        "editorWidget.background": "#14181b",
        "editorGutter.background": "#0a0c0d",
      },
    });
    monaco.editor.defineTheme("ck-light", {
      base: "vs",
      inherit: true,
      rules: [{ token: "comment", foreground: "7a858b", fontStyle: "italic" }],
      colors: {
        "editor.background": "#f7f8f6",
        "editor.foreground": "#1f2421",
        "editorLineNumber.foreground": "#b9c0bb",
        "editorCursor.foreground": "#4f8a00",
        "editor.selectionBackground": "#4f8a0026",
        "editor.lineHighlightBackground": "#00000008",
      },
    });
  };

  const onMount = (editor: any, monaco: any) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRun?.());
  };

  return (
    <div className="monaco-host">
      <Editor
        path={pathPrefix ? `${pathPrefix}/${file}` : file}
        language={langOf(file)}
        value={value}
        theme={theme}
        beforeMount={beforeMount}
        onMount={onMount}
        onChange={(v) => onChange(v ?? "")}
        keepCurrentModel
        options={{
          readOnly,
          fontSize: 13.5,
          fontFamily: MONO,
          fontLigatures: true,
          lineHeight: 22,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 14, bottom: 14 },
          tabSize: 2,
          wordWrap: "on",
          renderLineHighlight: "line",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
          overviewRulerLanes: 0,
          guides: { indentation: false },
        }}
      />
    </div>
  );
}
