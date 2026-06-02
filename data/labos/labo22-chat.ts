import type { Exercise } from "@/lib/types";

/* ════════════════════════════════════════════════════════════════════
   De ultieme eindoefening: bouw een werkende chat die ALLES combineert —
   events, formulieren, een global-object, arrays, objecten, Date, JSON,
   localStorage én een setInterval.

   De grading draait in een sandbox-iframe waar de echte localStorage een
   SecurityError gooit. Omdat deze chat localStorage als bron-van-waarheid
   gebruikt (de setInterval leest ze élke seconde opnieuw in), leveren we
   een kleine in-memory localStorage-shim mee als read-only bestand, zodat
   de code precies werkt zoals in een echte browser.
   ════════════════════════════════════════════════════════════════════ */

const INDEX_HTML = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="styles/style.css">
  <title>Chat</title>
</head>
<body>
  <div class="chat-app">
    <h1>Chat</h1>

    <div class="bar">
      <label for="message-sender">Jij bent:</label>
      <select id="message-sender">
        <option value="Ruben">Ruben</option>
        <option value="Sara">Sara</option>
        <option value="Tom">Tom</option>
      </select>
      <button id="clear-all" class="danger">Wis alles</button>
    </div>

    <div id="chat-box"></div>

    <div class="composer">
      <input id="message-input" type="text" placeholder="Typ een bericht...  probeer :)  :(  ;)  :p">
      <button id="send-button">Verstuur</button>
    </div>
  </div>

  <script type="text/javascript" src="scripts/storage.js"></script>
  <script type="text/javascript" src="scripts/code.js"></script>
</body>
</html>`;

const STYLE_CSS = `body {
  font-family: system-ui, -apple-system, Segoe UI, sans-serif;
  background: #0f1216;
  color: #e8edf2;
}

.chat-app { max-width: 460px; margin: 0 auto; }
h1 { font-size: 20px; margin: 0 0 14px; }

.bar { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.bar label { font-size: 13px; color: #9aa7b2; }

select, input, button {
  font: inherit;
  border-radius: 8px;
  border: 1px solid #2a323b;
  background: #1a2027;
  color: #e8edf2;
  padding: 8px 10px;
}
button { cursor: pointer; }
#send-button { background: #c4f542; color: #14181b; border-color: #c4f542; font-weight: 600; }
.danger { margin-left: auto; color: #ff6b6b; border-color: #3a2730; }

#chat-box {
  height: 320px;
  overflow-y: auto;
  border: 1px solid #2a323b;
  border-radius: 12px;
  padding: 12px;
  background: #12161b;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.composer { display: flex; gap: 8px; margin-top: 10px; }
.composer input { flex: 1; }

.message {
  align-self: flex-start;
  max-width: 80%;
  background: #1c232b;
  border: 1px solid #2a323b;
  border-radius: 12px;
  padding: 7px 11px;
  word-wrap: break-word;
}
.message.same-user { align-self: flex-end; background: #243b16; border-color: #3c5a22; }
.timestamp { display: block; font-size: 10px; color: #76828d; margin-bottom: 2px; }
.sender { font-size: 11px; font-weight: 700; color: #c4f542; margin-right: 6px; }
.same-user .sender { color: #d7f59a; }

.sender button {
  padding: 0 5px;
  margin-left: 6px;
  font-size: 11px;
  background: transparent;
  border: none;
  color: #ff6b6b;
}
.sender button::after { content: "✕"; }`;

const STORAGE_JS = `/* ─────────────────────────────────────────────────────────────────
   Hulpbestand voor de oefenomgeving — LAAT DIT STAAN, niet aanpassen.
   In deze afgeschermde sandbox is de echte localStorage geblokkeerd.
   Dit zet een tijdelijke localStorage in het geheugen klaar, zodat jouw
   chat-code precies werkt zoals in een echte browser. (In een echt
   project heb je dit niet nodig.)
   ───────────────────────────────────────────────────────────────── */
(function () {
  let geblokkeerd = false;
  try { window.localStorage.getItem("test"); } catch (e) { geblokkeerd = true; }
  if (!geblokkeerd) return;

  let opslag = {};
  const shim = {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(opslag, k) ? opslag[k] : null),
    setItem: (k, v) => { opslag[k] = String(v); },
    removeItem: (k) => { delete opslag[k]; },
    clear: () => { opslag = {}; },
  };
  try {
    Object.defineProperty(window, "localStorage", { value: shim, configurable: true, writable: true });
  } catch (e) { /* niets */ }
})();`;

const SKELETON_JS = `// De ultieme chat. Werk alles uit met het global-object hieronder.
// Tip: localStorage bewaart enkel strings -> JSON.stringify / JSON.parse.

let global = {
  huidigeGebruiker: null,
  berichten: [],
  timer: null,
};

const setup = () => {
  // TODO 1. Lees de gekozen verzender (#message-sender) en zet hem in
  //         global.huidigeGebruiker. Werk hem ook bij op een "change"-event
  //         en herteken dan de berichten.
  // TODO 2. Koppel #send-button aan stuurbericht en #clear-all aan wisAlles.
  // TODO 3. Laad de opgeslagen berichten uit localStorage ("berichten") in
  //         global.berichten (JSON.parse). Geen data -> een lege array.
  // TODO 4. Teken de berichten met renderBerichten().
  // TODO 5. Start setInterval (1000 ms) dat de berichten opnieuw inleest uit
  //         localStorage en hertekent. Bewaar het id in global.timer.
};

const stuurbericht = () => {
  // TODO 1. Lees #message-input en .trim() de tekst.
  // TODO 2. Zet de smileys om naar emoji met replaceAll:
  //         :)  ->  \\u{1F604}     :p  ->  \\u{1F60B}
  //         ;)  ->  \\u{1F609}     :(  ->  \\u{1F614}
  // TODO 3. Stop met return als de tekst leeg is.
  // TODO 4. Maak een object { sender, tekst, tijd } met Date.now().
  // TODO 5. Duw het in global.berichten, bewaar alles als JSON in
  //         localStorage, maak het invoerveld leeg en herteken.
};

const renderBerichten = () => {
  // TODO 1. Haal #chat-box op en maak het leeg (innerHTML = "").
  // TODO 2. Overloop global.berichten met een for-lus en bouw per bericht:
  //         - een <div class="message">  (+ class "same-user" als de
  //           verzender de huidige gebruiker is)
  //         - een <span class="timestamp"> met new Date(tijd).toLocaleString
  //         - een <span class="sender"> met de verzender
  //         - de tekst als losse tekst-node (createTextNode)
  //         Bij je eigen berichten: een knopje dat verwijderBericht(i) oproept.
  //         Zet het nieuwste bericht bovenaan met prepend.
};

const verwijderBericht = (index) => {
  // TODO. Verwijder het bericht op die index (splice), bewaar opnieuw, herteken.
};

const wisAlles = () => {
  // TODO. Maak global.berichten leeg, verwijder de sleutel uit localStorage,
  //        en herteken.
};

window.addEventListener("load", setup);`;

const SOLUTION_JS = `let global = {
  huidigeGebruiker: null,
  berichten: [],
  timer: null,
};

const setup = () => {
  let select = document.getElementById("message-sender");
  global.huidigeGebruiker = select.value;

  select.addEventListener("change", () => {
    global.huidigeGebruiker = select.value;
    renderBerichten();
  });

  let btn = document.getElementById("send-button");
  btn.addEventListener("click", stuurbericht);

  let clearBtn = document.getElementById("clear-all");
  clearBtn.addEventListener("click", wisAlles);

  let opgeslagen = localStorage.getItem("berichten");
  if (opgeslagen) {
    global.berichten = JSON.parse(opgeslagen);
  } else {
    global.berichten = [];
  }

  renderBerichten();

  global.timer = setInterval(() => {
    let opgeslagen = localStorage.getItem("berichten");
    global.berichten = JSON.parse(opgeslagen ?? "[]");
    renderBerichten();
  }, 1000);
};

const stuurbericht = () => {
  let input = document.getElementById("message-input");
  let tekst = input.value.trim();
  tekst = tekst.replaceAll(":)", "\\u{1F604}");
  tekst = tekst.replaceAll(":p", "\\u{1F60B}");
  tekst = tekst.replaceAll(";)", "\\u{1F609}");
  tekst = tekst.replaceAll(":(", "\\u{1F614}");
  if (tekst === "") return;

  let bericht = {
    sender: global.huidigeGebruiker, tekst: tekst, tijd: Date.now(),
  };

  global.berichten.push(bericht);
  localStorage.setItem("berichten", JSON.stringify(global.berichten));
  input.value = "";
  renderBerichten();
};

const renderBerichten = () => {
  let chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";

  for (let i = 0; i < global.berichten.length; i++) {
    let bericht = global.berichten[i];
    let div = document.createElement("div");
    div.classList.add("message");
    if (bericht.sender === global.huidigeGebruiker) {
      div.classList.add("same-user");
    }

    let spanTime = document.createElement("span");
    spanTime.classList.add("timestamp");
    spanTime.textContent = new Date(bericht.tijd).toLocaleString("nl-BE", {
      day: "numeric", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit",
    });

    let spanSender = document.createElement("span");
    spanSender.classList.add("sender");
    spanSender.textContent = bericht.sender;

    if (bericht.sender === global.huidigeGebruiker) {
      let btn = document.createElement("button");
      btn.addEventListener("click", () => verwijderBericht(i));
      spanSender.appendChild(btn);
    }

    div.appendChild(spanTime);
    div.appendChild(spanSender);
    div.appendChild(document.createTextNode(bericht.tekst));

    chatBox.prepend(div);
  }
};

const verwijderBericht = (index) => {
  global.berichten.splice(index, 1);
  localStorage.setItem("berichten", JSON.stringify(global.berichten));
  renderBerichten();
};

const wisAlles = () => {
  global.berichten = [];
  localStorage.removeItem("berichten");
  renderBerichten();
};

window.addEventListener("load", setup);`;

export const chatExercise: Exercise = {
  id: "l22-chat",
  chapterId: "labo22",
  chapter: "My internet startpage",
  n: 6,
  of: 7,
  title: "De ultieme oefening: een werkende chat",
  tag: "JS",
  difficulty: "insane",
  brief:
    "De eindbaas. Bouw een werkende <code>chat</code> die zowat alles uit de cursus combineert: events, een keuzelijst, een <code>global</code>-object, arrays, objecten, <code>Date</code>, JSON, <code>localStorage</code> én een <code>setInterval</code> die live ververst.<br><br>" +
    "De HTML en CSS zijn al klaar. Je hebt een keuzelijst <code>#message-sender</code> (wie jij bent), een tekstveld <code>#message-input</code>, een <code>#send-button</code>, een <code>#clear-all</code>-knop en een lege <code>#chat-box</code>. Schrijf in <code>scripts/code.js</code> de logica:<br><br>" +
    "<b>1.</b> In <code>setup</code>: lees de gekozen verzender uit en bewaar hem in <code>global.huidigeGebruiker</code> (ook bij een <code>change</code>-event). Koppel <code>#send-button</code> aan <code>stuurbericht</code> en <code>#clear-all</code> aan <code>wisAlles</code>. Laad bestaande berichten uit <code>localStorage</code> (sleutel <code>berichten</code>) en teken ze. Start tot slot een <code>setInterval</code> (1000 ms) die de berichten opnieuw inleest en hertekent.<br>" +
    "<b>2.</b> In <code>stuurbericht</code>: lees het tekstveld en <code>trim</code> het. Zet met <code>replaceAll</code> de smileys om naar emoji (<code>:)</code>, <code>:(</code>, <code>;)</code>, <code>:p</code>). Negeer een leeg bericht. Maak anders een object <code>{ sender, tekst, tijd }</code> met <code>Date.now()</code>, duw het in de array, bewaar alles als JSON in <code>localStorage</code>, maak het veld leeg en herteken.<br>" +
    "<b>3.</b> In <code>renderBerichten</code>: maak <code>#chat-box</code> leeg en bouw per bericht een <code>&lt;div class=\"message\"&gt;</code> (met extra klasse <code>same-user</code> als jij de verzender bent). Toon de tijd met <code>toLocaleString</code> in een <code>&lt;span class=\"timestamp\"&gt;</code>, de verzender in een <code>&lt;span class=\"sender\"&gt;</code>, en de tekst als losse tekst-node. Geef je eigen berichten een verwijderknopje. Zet het nieuwste bericht bovenaan met <code>prepend</code>.<br>" +
    "<b>4.</b> <code>verwijderBericht(index)</code> wist één bericht (<code>splice</code>) en <code>wisAlles</code> leegt alles. Bewaar telkens opnieuw en herteken.<br><br>" +
    "<i>Het bestand <code>scripts/storage.js</code> laat <code>localStorage</code> werken in deze oefenomgeving — laat het gewoon staan.</i>",
  hint:
    "Werk met één global-object voor de toestand. localStorage bewaart enkel strings, dus JSON.stringify bij opslaan en JSON.parse bij inlezen. Geef listeners de functienaam zonder haakjes. Date.now() geeft ms; new Date(ms).toLocaleString(...) toont ze leesbaar. Bij je eigen berichten voeg je de verwijderknop toe binnen de for-lus — de variabele i wordt in de closure bewaard.",
  topics: ["events", "localStorage", "JSON", "setInterval", "Date", "DOM", "arrays", "objecten", "global"],
  files: [
    { name: "index.html", content: INDEX_HTML, readOnly: true },
    { name: "styles/style.css", content: STYLE_CSS, readOnly: true },
    { name: "scripts/storage.js", content: STORAGE_JS, readOnly: true },
    { name: "scripts/code.js", content: SKELETON_JS },
  ],
  checks: [
    {
      type: "static",
      id: "chat-apis",
      label: "Je gebruikt events, localStorage, JSON, setInterval en createElement",
      file: "scripts/code.js",
      must: ["addEventListener", "localStorage", "JSON.parse", "JSON.stringify", "setInterval", "createElement"],
    },
    {
      type: "static",
      id: "chat-geen-var",
      label: "Je gebruikt geen var",
      file: "scripts/code.js",
      mustNot: ["/\\bvar\\b/"],
    },
    {
      type: "dom",
      id: "chat-verstuur",
      label: "Een verstuurd bericht verschijnt in de chat",
      settleMs: 1200,
      before: [
        { action: "input", selector: "#message-input", value: "Hallo wereld" },
        { action: "click", selector: "#send-button" },
      ],
      assertions: [
        { selector: "#chat-box .message", exists: true },
        { selector: "#chat-box", textIncludes: "Hallo wereld" },
      ],
    },
    {
      type: "dom",
      id: "chat-eigen",
      label: "Je eigen bericht krijgt de klasse same-user en een verwijderknop",
      settleMs: 1200,
      before: [
        { action: "input", selector: "#message-input", value: "Test 123" },
        { action: "click", selector: "#send-button" },
      ],
      assertions: [
        { selector: "#chat-box .message.same-user", exists: true },
        { selector: "#chat-box .message button", exists: true },
      ],
    },
    {
      type: "dom",
      id: "chat-emoji",
      label: "Smileys worden omgezet naar emoji ( :) wordt 😄 )",
      settleMs: 1200,
      before: [
        { action: "input", selector: "#message-input", value: ":)" },
        { action: "click", selector: "#send-button" },
      ],
      assertions: [
        { selector: "#chat-box", textIncludes: "\u{1F604}" },
      ],
    },
    {
      type: "dom",
      id: "chat-leeg",
      label: "Een leeg bericht wordt genegeerd",
      before: [
        { action: "input", selector: "#message-input", value: "   " },
        { action: "click", selector: "#send-button" },
      ],
      assertions: [
        { selector: "#chat-box .message", count: 0 },
      ],
    },
    {
      type: "dom",
      id: "chat-wis",
      label: "'Wis alles' maakt de chat helemaal leeg",
      settleMs: 1200,
      before: [
        { action: "input", selector: "#message-input", value: "weg hiermee" },
        { action: "click", selector: "#send-button" },
        { action: "click", selector: "#clear-all" },
      ],
      assertions: [
        { selector: "#chat-box .message", count: 0 },
      ],
    },
  ],
  solution: {
    "scripts/code.js": SOLUTION_JS,
  },
};
