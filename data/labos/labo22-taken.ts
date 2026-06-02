import type { Exercise } from "@/lib/types";

/* ════════════════════════════════════════════════════════════════════
   Tweede capstone (zelfde soort als de chat): een werkende takenlijst die
   alles combineert — events, een keuzelijst, een global-object, een array
   van objecten, Date, JSON, localStorage en een setInterval live-refresh.
   Extra t.o.v. de chat: een "gedaan"-toggle per taak.

   Zelfde read-only localStorage-shim als de chat, zodat de code (die
   localStorage als bron-van-waarheid via de poller herleest) werkt in de
   sandbox-iframe.
   ════════════════════════════════════════════════════════════════════ */

const INDEX_HTML = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="styles/style.css">
  <title>Takenlijst</title>
</head>
<body>
  <div class="todo-app">
    <h1>Takenlijst</h1>

    <div class="composer">
      <input id="taak-input" type="text" placeholder="Nieuwe taak...">
      <select id="prioriteit">
        <option value="hoog">Hoog</option>
        <option value="normaal">Normaal</option>
        <option value="laag">Laag</option>
      </select>
      <button id="add-button">Toevoegen</button>
    </div>

    <div class="bar">
      <span id="teller"></span>
      <button id="clear-all" class="danger">Wis alles</button>
    </div>

    <ul id="taken-lijst"></ul>
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

.todo-app { max-width: 480px; margin: 0 auto; }
h1 { font-size: 20px; margin: 0 0 14px; }

.composer { display: flex; gap: 8px; margin-bottom: 10px; }
.composer input { flex: 1; }
input, select, button {
  font: inherit;
  border-radius: 8px;
  border: 1px solid #2a323b;
  background: #1a2027;
  color: #e8edf2;
  padding: 8px 10px;
}
button { cursor: pointer; }
#add-button { background: #c4f542; color: #14181b; border-color: #c4f542; font-weight: 600; }

.bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
#teller { font-size: 13px; color: #9aa7b2; }
.danger { color: #ff6b6b; border-color: #3a2730; }

#taken-lijst { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.taak {
  display: flex; align-items: center; gap: 10px;
  background: #1c232b; border: 1px solid #2a323b; border-left: 4px solid #2a323b;
  border-radius: 10px; padding: 8px 12px;
}
.taak.hoog { border-left-color: #ff6b6b; }
.taak.normaal { border-left-color: #f5c451; }
.taak.laag { border-left-color: #5fd08a; }
.taak .tekst { flex: 1; }
.taak .tijd { font-size: 10px; color: #76828d; }
.taak.gedaan .tekst { text-decoration: line-through; color: #76828d; }
.taak .toggle { background: transparent; border: 1px solid #3c5a22; color: #c4f542; padding: 2px 9px; }
.taak .verwijder { background: transparent; border: none; color: #ff6b6b; padding: 2px 6px; }`;

const STORAGE_JS = `/* ─────────────────────────────────────────────────────────────────
   Hulpbestand voor de oefenomgeving — LAAT DIT STAAN, niet aanpassen.
   In deze afgeschermde sandbox is de echte localStorage geblokkeerd.
   Dit zet een tijdelijke localStorage in het geheugen klaar, zodat jouw
   code precies werkt zoals in een echte browser.
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

const SKELETON_JS = `// Een takenlijst die alles combineert. Werk de functies uit met het global-object.
// Tip: localStorage bewaart enkel strings -> JSON.stringify / JSON.parse.

let global = {
  taken: [],
  timer: null,
};

const setup = () => {
  // TODO 1. Koppel #add-button aan voegToe en #clear-all aan wisAlles.
  // TODO 2. Laad de opgeslagen taken uit localStorage ("taken") in global.taken
  //         (JSON.parse). Geen data -> een lege array.
  // TODO 3. Teken de taken met renderTaken().
  // TODO 4. Start setInterval (1000 ms) dat de taken opnieuw inleest uit
  //         localStorage en hertekent. Bewaar het id in global.timer.
};

const voegToe = () => {
  // TODO 1. Lees #taak-input (.trim()) en de gekozen #prioriteit (.value).
  // TODO 2. Stop met return als de tekst leeg is.
  // TODO 3. Maak een object { tekst, prioriteit, gedaan: false, tijd } met Date.now().
  // TODO 4. Duw het in global.taken, bewaar alles als JSON in localStorage,
  //         maak het invoerveld leeg en herteken.
};

const renderTaken = () => {
  // TODO 1. Haal #taken-lijst op en maak het leeg (innerHTML = "").
  // TODO 2. Overloop global.taken met een for-lus en bouw per taak een <li>:
  //         - classes "taak" + de prioriteit (bv. "hoog"); + "gedaan" als ze af is
  //         - de tekst, en de tijd met new Date(tijd).toLocaleString
  //         - een knop met class "toggle" die toggleGedaan(i) oproept
  //         - een knop met class "verwijder" die verwijderTaak(i) oproept
  // TODO 3. Toon in #teller hoeveel taken er zijn (en hoeveel klaar).
};

const toggleGedaan = (index) => {
  // TODO. Draai taak.gedaan om (true <-> false), bewaar opnieuw en herteken.
};

const verwijderTaak = (index) => {
  // TODO. Verwijder de taak op die index (splice), bewaar opnieuw, herteken.
};

const wisAlles = () => {
  // TODO. Maak global.taken leeg, verwijder de sleutel uit localStorage, herteken.
};

window.addEventListener("load", setup);`;

const SOLUTION_JS = `let global = {
  taken: [],
  timer: null,
};

const bewaar = () => {
  localStorage.setItem("taken", JSON.stringify(global.taken));
};

const setup = () => {
  const addKnop = document.getElementById("add-button");
  addKnop.addEventListener("click", voegToe);

  const clearKnop = document.getElementById("clear-all");
  clearKnop.addEventListener("click", wisAlles);

  let opgeslagen = localStorage.getItem("taken");
  if (opgeslagen) {
    global.taken = JSON.parse(opgeslagen);
  } else {
    global.taken = [];
  }

  renderTaken();

  global.timer = setInterval(() => {
    let opgeslagen = localStorage.getItem("taken");
    global.taken = JSON.parse(opgeslagen ?? "[]");
    renderTaken();
  }, 1000);
};

const voegToe = () => {
  const input = document.getElementById("taak-input");
  const select = document.getElementById("prioriteit");
  let tekst = input.value.trim();
  if (tekst === "") return;

  let taak = {
    tekst: tekst,
    prioriteit: select.value,
    gedaan: false,
    tijd: Date.now(),
  };

  global.taken.push(taak);
  bewaar();
  input.value = "";
  renderTaken();
};

const renderTaken = () => {
  const lijst = document.getElementById("taken-lijst");
  lijst.innerHTML = "";

  let aantalKlaar = 0;

  for (let i = 0; i < global.taken.length; i++) {
    let taak = global.taken[i];
    if (taak.gedaan) {
      aantalKlaar++;
    }

    let li = document.createElement("li");
    li.classList.add("taak");
    li.classList.add(taak.prioriteit);
    if (taak.gedaan) {
      li.classList.add("gedaan");
    }

    let klaarKnop = document.createElement("button");
    klaarKnop.classList.add("toggle");
    klaarKnop.textContent = taak.gedaan ? "↶" : "✓";
    klaarKnop.addEventListener("click", () => toggleGedaan(i));

    let spanTekst = document.createElement("span");
    spanTekst.classList.add("tekst");
    spanTekst.textContent = taak.tekst;

    let spanTijd = document.createElement("span");
    spanTijd.classList.add("tijd");
    spanTijd.textContent = new Date(taak.tijd).toLocaleString("nl-BE", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });

    let wisKnop = document.createElement("button");
    wisKnop.classList.add("verwijder");
    wisKnop.textContent = "✕";
    wisKnop.addEventListener("click", () => verwijderTaak(i));

    li.appendChild(klaarKnop);
    li.appendChild(spanTekst);
    li.appendChild(spanTijd);
    li.appendChild(wisKnop);
    lijst.appendChild(li);
  }

  const teller = document.getElementById("teller");
  teller.textContent = global.taken.length + " taken, " + aantalKlaar + " klaar";
};

const toggleGedaan = (index) => {
  global.taken[index].gedaan = !global.taken[index].gedaan;
  bewaar();
  renderTaken();
};

const verwijderTaak = (index) => {
  global.taken.splice(index, 1);
  bewaar();
  renderTaken();
};

const wisAlles = () => {
  global.taken = [];
  localStorage.removeItem("taken");
  renderTaken();
};

window.addEventListener("load", setup);`;

export const takenExercise: Exercise = {
  id: "l22-takenlijst",
  chapterId: "labo22",
  chapter: "My internet startpage",
  n: 7,
  of: 8,
  title: "Capstone: een takenlijst met prioriteiten",
  tag: "JS",
  difficulty: "insane",
  brief:
    "Nog een eindbaas, in dezelfde stijl als de chat. Bouw een werkende <code>takenlijst</code> die alles combineert: events, een keuzelijst, een <code>global</code>-object, een array van objecten, <code>Date</code>, JSON, <code>localStorage</code> en een <code>setInterval</code> die live ververst.<br><br>" +
    "De HTML en CSS zijn klaar. Je hebt een tekstveld <code>#taak-input</code>, een keuzelijst <code>#prioriteit</code> (hoog/normaal/laag), een <code>#add-button</code>, een <code>#clear-all</code>-knop, een teller <code>#teller</code> en een lege lijst <code>#taken-lijst</code>. Schrijf in <code>scripts/code.js</code>:<br><br>" +
    "<b>1.</b> In <code>setup</code>: koppel <code>#add-button</code> aan <code>voegToe</code> en <code>#clear-all</code> aan <code>wisAlles</code>. Laad bestaande taken uit <code>localStorage</code> (sleutel <code>taken</code>) en teken ze. Start een <code>setInterval</code> (1000 ms) die de taken opnieuw inleest en hertekent.<br>" +
    "<b>2.</b> In <code>voegToe</code>: lees het tekstveld (<code>trim</code>) en de gekozen prioriteit. Negeer een lege taak. Maak anders een object <code>{ tekst, prioriteit, gedaan: false, tijd }</code> met <code>Date.now()</code>, duw het in de array, bewaar alles als JSON, maak het veld leeg en herteken.<br>" +
    "<b>3.</b> In <code>renderTaken</code>: maak <code>#taken-lijst</code> leeg en bouw per taak een <code>&lt;li&gt;</code> met de classes <code>taak</code> + de prioriteit (bv. <code>hoog</code>), plus <code>gedaan</code> als de taak af is. Toon de tekst en de tijd (<code>toLocaleString</code>), een knop met class <code>toggle</code> die <code>toggleGedaan(i)</code> oproept, en een knop met class <code>verwijder</code> die <code>verwijderTaak(i)</code> oproept. Zet in <code>#teller</code> hoeveel taken er zijn.<br>" +
    "<b>4.</b> <code>toggleGedaan(index)</code> draait <code>gedaan</code> om, <code>verwijderTaak(index)</code> wist één taak (<code>splice</code>), en <code>wisAlles</code> leegt alles. Bewaar telkens opnieuw en herteken.<br><br>" +
    "<i>Het bestand <code>scripts/storage.js</code> laat <code>localStorage</code> werken in deze oefenomgeving — laat het gewoon staan.</i>",
  hint:
    "Werk met één global-object voor de toestand. localStorage bewaart enkel strings, dus JSON.stringify bij opslaan en JSON.parse bij inlezen. Geef listeners de functienaam zonder haakjes. De prioriteit lees je uit met select.value en voeg je toe als class met classList.add. De verwijder- en toggle-knoppen maak je binnen de for-lus, zodat i in de closure bewaard blijft.",
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
      id: "taken-apis",
      label: "Je gebruikt events, localStorage, JSON, setInterval en createElement",
      file: "scripts/code.js",
      must: ["addEventListener", "localStorage", "JSON.parse", "JSON.stringify", "setInterval", "createElement"],
    },
    {
      type: "static",
      id: "taken-geen-var",
      label: "Je gebruikt geen var",
      file: "scripts/code.js",
      mustNot: ["/\\bvar\\b/"],
    },
    {
      type: "dom",
      id: "taken-toevoegen",
      label: "Een toegevoegde taak verschijnt in de lijst",
      settleMs: 1200,
      before: [
        { action: "input", selector: "#taak-input", value: "Boodschappen doen" },
        { action: "click", selector: "#add-button" },
      ],
      assertions: [
        { selector: "#taken-lijst li", exists: true },
        { selector: "#taken-lijst", textIncludes: "Boodschappen doen" },
      ],
    },
    {
      type: "dom",
      id: "taken-prioriteit",
      label: "De gekozen prioriteit komt als class op de taak",
      settleMs: 1200,
      before: [
        { action: "input", selector: "#taak-input", value: "Wassen" },
        { action: "input", selector: "#prioriteit", value: "laag" },
        { action: "click", selector: "#add-button" },
      ],
      assertions: [
        { selector: "#taken-lijst li.laag", exists: true },
      ],
    },
    {
      type: "dom",
      id: "taken-knoppen",
      label: "Elke taak heeft een toggle- en een verwijder-knop",
      settleMs: 1200,
      before: [
        { action: "input", selector: "#taak-input", value: "Iets doen" },
        { action: "click", selector: "#add-button" },
      ],
      assertions: [
        { selector: "#taken-lijst li .verwijder", exists: true },
        { selector: "#taken-lijst li .toggle", exists: true },
      ],
    },
    {
      type: "dom",
      id: "taken-teller",
      label: "De teller toont het aantal taken",
      settleMs: 1200,
      before: [
        { action: "input", selector: "#taak-input", value: "Een taak" },
        { action: "click", selector: "#add-button" },
      ],
      assertions: [
        { selector: "#teller", textIncludes: "1" },
      ],
    },
    {
      type: "dom",
      id: "taken-leeg",
      label: "Een lege taak wordt genegeerd",
      before: [
        { action: "input", selector: "#taak-input", value: "   " },
        { action: "click", selector: "#add-button" },
      ],
      assertions: [
        { selector: "#taken-lijst li", count: 0 },
      ],
    },
    {
      type: "dom",
      id: "taken-wis",
      label: "'Wis alles' maakt de lijst leeg",
      settleMs: 1200,
      before: [
        { action: "input", selector: "#taak-input", value: "weg ermee" },
        { action: "click", selector: "#add-button" },
        { action: "click", selector: "#clear-all" },
      ],
      assertions: [
        { selector: "#taken-lijst li", count: 0 },
      ],
    },
  ],
  solution: {
    "scripts/code.js": SOLUTION_JS,
  },
};
