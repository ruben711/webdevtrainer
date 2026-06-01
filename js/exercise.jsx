/* Exercise — multi-file editor with folder structure + live runner + behaviour checks */

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

const extOf = (n) => (n.split(".").pop() || "").toLowerCase();

// Build a runnable doc: every .css -> <style>, every .js -> <script>, every .html -> body (in order)
function assemble(files) {
  const css = files.filter(f => extOf(f.name) === "css").map(f => f.content).join("\n");
  const js = files.filter(f => extOf(f.name) === "js").map(f => f.content).join("\n;\n");
  const html = files.filter(f => extOf(f.name) === "html").map(f => f.content).join("\n");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0}body{padding:20px;box-sizing:border-box;background:#fbf8f1}${css}</style></head><body>${html}<scr` + `ipt>try{\n${js}\n}catch(e){document.body.insertAdjacentHTML('beforeend','<pre style=\\'color:#c0392b;font:12px/1.5 monospace;white-space:pre-wrap;margin-top:16px\\'>'+e+'</pre>')}</scr` + `ipt></body></html>`;
}

function FileTree({ files, active, setActive, onAdd, onDelete }) {
  const roots = files.filter(f => !f.name.includes("/"));
  const folders = {};
  files.filter(f => f.name.includes("/")).forEach(f => {
    const dir = f.name.split("/")[0];
    (folders[dir] = folders[dir] || []).push(f);
  });
  const FileBtn = ({ f, nested }) => {
    const ext = extOf(f.name);
    const short = nested ? f.name.split("/").slice(1).join("/") : f.name;
    const base = short.replace(/\.[^.]+$/, "");
    return (
      <button className={`file-item ${nested ? "nested" : ""} ${active === f.name ? "on" : ""}`} onClick={() => setActive(f.name)}>
        <span>{base}<span className={`ext ext-${ext}`}>.{ext}</span></span>
        {files.length > 1 && <span className="file-del" onClick={(e) => { e.stopPropagation(); onDelete(f.name); }} title="verwijderen">×</span>}
      </button>
    );
  };
  return (
    <div className="filetree">
      <div className="filetree-head">
        <span className="ft-title">Bestanden</span>
        <button className="ft-add" onClick={onAdd} title="nieuw bestand">+</button>
      </div>
      <div className="filetree-body scroll">
        {roots.map(f => <FileBtn key={f.name} f={f} />)}
        {Object.keys(folders).map(dir => (
          <div key={dir}>
            <div className="ft-folder"><Icon name="arrowDown" size={11} style={{ transform: "rotate(0deg)", opacity: 0.6 }} />{dir}/</div>
            {folders[dir].map(f => <FileBtn key={f.name} f={f} nested />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function Exercise({ go }) {
  const ex = window.APP_DATA.activeExercise;
  const [files, setFiles] = useState(() => ex.files.map(f => ({ ...f })));
  const [active, setActive] = useState(ex.files.find(f => extOf(f.name) === "js")?.name || ex.files[0].name);
  const [results, setResults] = useState({});
  const [status, setStatus] = useState("idle");
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const iframeRef = useRef(null);
  const solvedOnce = useRef(false);

  const activeFile = files.find(f => f.name === active) || files[0];
  const filesRef = useRef(files);
  filesRef.current = files;

  // live preview (debounced)
  useEffect(() => {
    const id = setTimeout(() => { if (iframeRef.current) iframeRef.current.srcdoc = assemble(files); }, 400);
    return () => clearTimeout(id);
  }, [files]);

  const setContent = (val) => setFiles(fs => fs.map(f => f.name === active ? { ...f, content: val } : f));

  const evaluate = useCallback(() => {
    setRunning(true);
    const cur = filesRef.current;
    const iframe = iframeRef.current;
    iframe.srcdoc = assemble(cur);
    const onload = () => {
      iframe.removeEventListener("load", onload);
      const doc = iframe.contentDocument;
      const jsSrc = cur.filter(f => extOf(f.name) === "js").map(f => f.content).join("\n");
      const res = {};
      res.ael = /addEventListener\s*\(/.test(jsSrc);
      const inc = doc.getElementById("inc");
      const count = doc.getElementById("count");
      const before = count ? count.textContent.trim() : null;
      if (inc && count) {
        try { inc.click(); } catch (e) {}
        const after1 = count.textContent.trim();
        res.increment = after1 !== before && !isNaN(Number(after1));
        res.listener = res.increment;
        try { inc.click(); inc.click(); } catch (e) {}
        res.three = count.textContent.trim() === "3";
      }
      const byObj = {};
      ex.objectives.forEach(o => { byObj[o.id] = !!res[o.id]; });
      setResults(byObj);
      const allPass = ex.objectives.every(o => byObj[o.id]);
      setStatus(allPass ? "ok" : "partial");
      if (allPass && !solvedOnce.current) { solvedOnce.current = true; fireConfetti(); }
      setRunning(false);
    };
    iframe.addEventListener("load", onload);
  }, [ex]);

  const onKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.target, s = el.selectionStart, en = el.selectionEnd;
      setContent(activeFile.content.slice(0, s) + "  " + activeFile.content.slice(en));
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
    }
  };

  const addFile = () => {
    const name = (window.prompt("Bestandsnaam (bv. js/utils.js of helpers.css):") || "").trim();
    if (!name) return;
    if (files.some(f => f.name === name)) { setActive(name); return; }
    setFiles(fs => [...fs, { name, content: "" }]);
    setActive(name);
  };
  const deleteFile = (name) => {
    setFiles(fs => fs.filter(f => f.name !== name));
    if (active === name) setActive(files.find(f => f.name !== name)?.name);
  };
  const reset = () => {
    setFiles(ex.files.map(f => ({ ...f }))); setResults({}); setStatus("idle"); solvedOnce.current = false;
    setActive(ex.files.find(f => extOf(f.name) === "js")?.name || ex.files[0].name);
  };
  const showSolution = () => {
    setFiles(fs => fs.map(f => ex.solution[f.name] ? { ...f, content: ex.solution[f.name] } : f));
    setTimeout(evaluate, 500);
  };

  const passCount = ex.objectives.filter(o => results[o.id]).length;

  return (
    <div className="ex-layout">
      {/* BRIEF */}
      <div className="ex-brief scroll">
        <button className="ex-back" onClick={() => go("chapters")}><Icon name="arrow" size={14} style={{ transform: "rotate(180deg)" }} />terug naar hoofdstukken</button>
        <div className="ex-metaline">
          <span className="tag JS">JS</span>
          <span className="num" style={{ fontSize: 12, color: "var(--text-3)" }}>{ex.chapter}</span>
          <span className="num" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>{ex.xp} XP</span>
        </div>
        <h1 className="ex-title">{ex.title}</h1>
        <div className="ex-num">Hoofdstuk 05 · Oefening {ex.n} van {ex.of} · {ex.difficulty}</div>

        <p className="ex-brief-text" style={{ marginTop: 18 }}
          dangerouslySetInnerHTML={{ __html: ex.brief.replace(/<([^>]+)>/g, "<code>$1</code>") }} />

        <button className="btn btn-ghost" style={{ marginTop: 18, fontSize: 13, padding: "9px 14px" }} onClick={() => setShowHint(s => !s)}>
          <Icon name="idea" size={15} />{showHint ? "verberg hint" : "toon hint"}
        </button>
        {showHint && <p className="ex-brief-text" style={{ marginTop: 14, fontSize: 13.5, color: "var(--text-3)" }}>{ex.hint}</p>}

        <div className="obj-head">
          <span className="kicker">Doelen</span>
          <span className="obj-count" style={{ color: status === "ok" ? "var(--good)" : "var(--text-2)" }}>{passCount} / {ex.objectives.length}</span>
        </div>
        <div>
          {ex.objectives.map(o => (
            <div key={o.id} className={`objective ${results[o.id] ? "pass" : ""}`}>
              <span className="obj-check">{results[o.id] && <Icon name="check" size={12} />}</span>
              <span>{o.label}</span>
            </div>
          ))}
        </div>

        {status === "ok" && (
          <div className="ex-solved">
            <div className="es-title"><Icon name="star" size={18} fill style={{ color: "var(--accent)" }} />Geslaagd — +{ex.xp} XP</div>
            <p className="ex-brief-text" style={{ marginTop: 8, fontSize: 13.5 }}>Netjes. Je tel-knop werkt precies zoals gevraagd.</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => go("leaderboard")}>Naar het klassement <Icon name="arrow" size={15} /></button>
          </div>
        )}

        <button className="num" style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: "0.04em", marginTop: 26, display: "block" }} onClick={showSolution}>↳ toon voorbeeldoplossing</button>
      </div>

      {/* WORK */}
      <div className="ex-work">
        <div className="ex-editor-region">
          <FileTree files={files} active={active} setActive={setActive} onAdd={addFile} onDelete={deleteFile} />
          <div className="editor-wrap">
            <div className="tabbar">
              <div style={{ display: "flex", overflowX: "auto", flex: 1 }}>
                {files.map(f => (
                  <button key={f.name} className={`tab ${active === f.name ? "on" : ""}`} onClick={() => setActive(f.name)}>
                    {f.name}
                  </button>
                ))}
              </div>
              <div className="run-bar" style={{ paddingRight: 10, paddingLeft: 10 }}>
                <button className="btn btn-ghost" style={{ padding: "7px 12px", fontSize: 12.5 }} onClick={reset}><Icon name="refresh" size={14} />Reset</button>
                <button className="btn btn-primary" style={{ padding: "7px 15px", fontSize: 13 }} onClick={evaluate}><Icon name="play" size={14} fill />{running ? "bezig…" : "Run & check"}</button>
              </div>
            </div>
            <textarea className="code-area scroll" value={activeFile?.content || ""} spellCheck={false}
              onChange={e => setContent(e.target.value)} onKeyDown={onKeyDown} />
          </div>
        </div>

        <div className="preview-wrap">
          <div className="pane-head" style={{ background: "var(--bg)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span className="dots"><i /><i /><i /></span>
              <span className="ph-name">voorbeeld · index.html</span>
            </div>
            {status !== "idle" && (
              <span className={`ex-result ${status}`}>
                {status === "ok" ? <><Icon name="check" size={14} />alle doelen geslaagd</> : <>{passCount}/{ex.objectives.length} doelen</>}
              </span>
            )}
          </div>
          <iframe ref={iframeRef} title="preview" sandbox="allow-scripts allow-same-origin" />
        </div>
      </div>
    </div>
  );
}
window.Exercise = Exercise;
