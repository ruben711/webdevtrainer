"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useMode } from "@/components/ModeProvider";
import { extOf } from "@/lib/iframeRunner";
import type { FileSpec } from "@/lib/types";

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

function defineThemes(monaco: any) {
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
}

/*
 * MANUAL multi-model editor. We own the Monaco models (one per file, each with
 * its OWN content-change listener that knows its filename). Switching files just
 * swaps the editor's model. That makes content always map to the right file —
 * no reliance on @monaco-editor/react's path/value/onChange, which raced and
 * leaked one file's content into another on tab switches.
 */
export function CodeEditor({
  files,
  active,
  onChange,
  onRun,
  pathPrefix = "",
}: {
  files: FileSpec[];
  active: string;
  onChange: (name: string, value: string) => void;
  onRun?: () => void;
  pathPrefix?: string;
}) {
  const { resolved } = useMode();
  const theme = resolved === "light" ? "ck-light" : "ck-dark";

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const modelsRef = useRef<Map<string, any>>(new Map());
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;
  const filesRef = useRef(files);
  filesRef.current = files;

  const ensureModel = (monaco: any, f: FileSpec) => {
    const have = modelsRef.current.get(f.name);
    if (have && !have.isDisposed()) return have;
    const uri = monaco.Uri.parse("inmemory://ck/" + (pathPrefix ? pathPrefix + "/" : "") + f.name);
    const model = monaco.editor.getModel(uri) || monaco.editor.createModel(f.content, langOf(f.name), uri);
    modelsRef.current.set(f.name, model);
    // listener carries f.name in its closure → edits always hit the right file
    model.onDidChangeContent(() => onChangeRef.current(f.name, model.getValue()));
    return model;
  };

  const onMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    const af = filesRef.current.find((f) => f.name === active) || filesRef.current[0];
    editor.setModel(ensureModel(monaco, af));
    editor.updateOptions({ readOnly: !!af.readOnly });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRunRef.current?.());
  };

  // swap the active model (+ readOnly) when the active file changes
  useEffect(() => {
    const monaco = monacoRef.current;
    const editor = editorRef.current;
    if (!monaco || !editor) return;
    const af = files.find((f) => f.name === active);
    if (!af) return;
    const m = ensureModel(monaco, af);
    if (editor.getModel() !== m) editor.setModel(m);
    editor.updateOptions({ readOnly: !!af.readOnly });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // sync EXTERNAL content changes (reset / solution / loaded saved work) into
  // models, without clobbering the user's own typing (only when truly different)
  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;
    files.forEach((f) => {
      const m = modelsRef.current.get(f.name);
      if (m && !m.isDisposed() && m.getValue() !== f.content) m.setValue(f.content);
    });
  }, [files]);

  useEffect(() => {
    monacoRef.current?.editor.setTheme(theme);
  }, [theme]);

  // dispose our models on unmount
  useEffect(() => {
    const models = modelsRef.current;
    return () => {
      models.forEach((m) => {
        if (!m.isDisposed()) m.dispose();
      });
      models.clear();
    };
  }, []);

  return (
    <div className="monaco-host">
      <Editor
        theme={theme}
        beforeMount={defineThemes}
        onMount={onMount}
        keepCurrentModel
        options={{
          fontSize: 13.5,
          fontFamily: MONO,
          fontLigatures: false,
          lineHeight: 22,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 14, bottom: 14 },
          tabSize: 2,
          tabCompletion: "on",
          suggestOnTriggerCharacters: true,
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
