import type { Exercise } from "@/lib/types";

/* ════════════════════════════════════════════════════════════════════
   Derde capstone — een ANDER soort oefening (zelfde moeilijkheid): een quiz.
   Geen lijst-CRUD met poller, maar een event-gestuurde state-machine:
   huidige vraag, score, doorklikken en een eindscherm. Combineert array van
   objecten, DOM bouwen, events + closures, conditionele score-logica en een
   score-geschiedenis in localStorage (JSON). Rendert synchroon -> geen settle.
   ════════════════════════════════════════════════════════════════════ */

const INDEX_HTML = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="styles/style.css">
  <title>Quizmaster</title>
</head>
<body>
  <div class="quiz-app">
    <h1>Quizmaster</h1>
    <div id="quiz">
      <div id="voortgang"></div>
      <h2 id="vraag"></h2>
      <div id="opties"></div>
      <div class="bar">
        <span id="score"></span>
        <button id="volgende-button">Volgende</button>
      </div>
    </div>
    <div id="resultaat"></div>
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

.quiz-app { max-width: 480px; margin: 0 auto; }
h1 { font-size: 20px; margin: 0 0 14px; }
#voortgang { font-size: 12px; color: #76828d; margin-bottom: 6px; }
#vraag { font-size: 18px; margin: 0 0 14px; }

#opties { display: flex; flex-direction: column; gap: 8px; }
.optie {
  text-align: left; font: inherit; cursor: pointer;
  border: 1px solid #2a323b; background: #1a2027; color: #e8edf2;
  border-radius: 10px; padding: 10px 14px;
}
.optie:hover { border-color: #3a4654; }
.optie.juist { border-color: #5fd08a; background: #1d3325; color: #b6f2cf; }
.optie.fout { border-color: #ff6b6b; background: #33201f; color: #ffc0c0; }

.bar { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; }
#score { font-size: 14px; color: #c4f542; font-weight: 600; }
#volgende-button {
  font: inherit; cursor: pointer; font-weight: 600;
  background: #c4f542; color: #14181b; border: none; border-radius: 8px; padding: 9px 16px;
}
#resultaat { font-size: 17px; margin-top: 10px; }`;

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

const SKELETON_JS = `// Een quiz met scoreverloop. Werk de functies uit met het global-object.
// De VRAGEN-array hieronder is gegeven — laat ze staan.

const VRAGEN = [
  { vraag: "Welk sleutelwoord gebruik je in deze cursus NOOIT?", opties: ["let", "const", "var"], juist: 2 },
  { vraag: "Wat geeft typeof [] terug?", opties: ["array", "object", "list"], juist: 1 },
  { vraag: "Hoe zet je een object om naar een string voor opslag?", opties: ["JSON.parse", "JSON.stringify", "toString"], juist: 1 },
  { vraag: "Welk getal geeft getMonth() voor januari?", opties: ["0", "1", "januari"], juist: 0 },
];

let global = {
  huidige: 0,
  score: 0,
  beantwoord: false,
};

const setup = () => {
  // TODO 1. Koppel #volgende-button aan de functie volgende.
  // TODO 2. Toon de eerste vraag met toonVraag().
};

const toonVraag = () => {
  // TODO 1. Haal de huidige vraag op: VRAGEN[global.huidige]. Zet global.beantwoord op false.
  // TODO 2. Zet de voortgang in #voortgang (bv. "Vraag 1 / 4") en de vraagtekst in #vraag.
  // TODO 3. Maak #opties leeg. Maak per optie een knop (class "optie") met de
  //         optietekst, en een click-listener die kies(i) oproept. Hang ze in #opties.
  // TODO 4. Toon de score met toonScore().
};

const kies = (index) => {
  // TODO. Negeer als er al geantwoord is (global.beantwoord). Zet beantwoord op true.
  //       Klopt de gekozen index met de juiste? Verhoog dan global.score, en geef de
  //       gekozen knop de class "juist" of "fout". Toon de score opnieuw.
};

const toonScore = () => {
  // TODO. Zet in #score de huidige score, bv. "Score: 2".
};

const volgende = () => {
  // TODO. Verhoog global.huidige. Is er nog een vraag? toonVraag(). Anders toonResultaat().
};

const toonResultaat = () => {
  // TODO 1. Verberg #quiz (style.display = "none").
  // TODO 2. Lees de vorige scores uit localStorage ("quiz-scores"), voeg je score toe,
  //         en bewaar ze terug (denk aan omzetten van/naar een string).
  // TODO 3. Zet in #resultaat je eindscore, bv. "Je score: 3 / 4".
};

window.addEventListener("load", setup);`;

const SOLUTION_JS = `// Gegeven — laat de VRAGEN-array staan.
const VRAGEN = [
  { vraag: "Welk sleutelwoord gebruik je in deze cursus NOOIT?", opties: ["let", "const", "var"], juist: 2 },
  { vraag: "Wat geeft typeof [] terug?", opties: ["array", "object", "list"], juist: 1 },
  { vraag: "Hoe zet je een object om naar een string voor opslag?", opties: ["JSON.parse", "JSON.stringify", "toString"], juist: 1 },
  { vraag: "Welk getal geeft getMonth() voor januari?", opties: ["0", "1", "januari"], juist: 0 },
];

let global = {
  huidige: 0,
  score: 0,
  beantwoord: false,
};

const setup = () => {
  const volgendeKnop = document.getElementById("volgende-button");
  volgendeKnop.addEventListener("click", volgende);
  toonVraag();
};

const toonVraag = () => {
  const vraag = VRAGEN[global.huidige];
  global.beantwoord = false;

  document.getElementById("voortgang").textContent =
    "Vraag " + (global.huidige + 1) + " / " + VRAGEN.length;
  document.getElementById("vraag").textContent = vraag.vraag;

  const optiesBox = document.getElementById("opties");
  optiesBox.innerHTML = "";

  for (let i = 0; i < vraag.opties.length; i++) {
    let knop = document.createElement("button");
    knop.classList.add("optie");
    knop.textContent = vraag.opties[i];
    knop.addEventListener("click", () => kies(i));
    optiesBox.appendChild(knop);
  }

  toonScore();
};

const kies = (index) => {
  if (global.beantwoord) return;
  global.beantwoord = true;

  const vraag = VRAGEN[global.huidige];
  const knoppen = document.getElementById("opties").children;

  if (index === vraag.juist) {
    global.score++;
    knoppen[index].classList.add("juist");
  } else {
    knoppen[index].classList.add("fout");
    knoppen[vraag.juist].classList.add("juist");
  }

  toonScore();
};

const toonScore = () => {
  document.getElementById("score").textContent = "Score: " + global.score;
};

const volgende = () => {
  global.huidige++;
  if (global.huidige < VRAGEN.length) {
    toonVraag();
  } else {
    toonResultaat();
  }
};

const toonResultaat = () => {
  document.getElementById("quiz").style.display = "none";

  let scores = JSON.parse(localStorage.getItem("quiz-scores") ?? "[]");
  scores.push(global.score);
  localStorage.setItem("quiz-scores", JSON.stringify(scores));

  let beste = 0;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i] > beste) {
      beste = scores[i];
    }
  }

  document.getElementById("resultaat").textContent =
    "Klaar! Je score: " + global.score + " / " + VRAGEN.length + ". Beste ooit: " + beste + ".";
};

window.addEventListener("load", setup);`;

export const quizExercise: Exercise = {
  id: "l22-quiz",
  chapterId: "labo22",
  chapter: "My internet startpage",
  n: 8,
  of: 8,
  title: "Capstone: een quiz met scoreverloop",
  tag: "JS",
  difficulty: "insane",
  brief:
    "Een ander soort eindbaas: bouw een werkende <code>quiz</code> met scoreverloop. De vragen (de array <code>VRAGEN</code>) zijn gegeven; jij schrijft de logica die ze toont, de antwoorden nakijkt en de score bijhoudt.<br><br>" +
    "De HTML en CSS zijn klaar: <code>#voortgang</code>, <code>#vraag</code>, een <code>#opties</code>-vak, een <code>#score</code>, een <code>#volgende-button</code> en een <code>#resultaat</code>. Werk in <code>scripts/code.js</code>:<br><br>" +
    "<b>1.</b> In <code>setup</code>: koppel <code>#volgende-button</code> aan <code>volgende</code> en toon de eerste vraag met <code>toonVraag()</code>.<br>" +
    "<b>2.</b> In <code>toonVraag</code>: zet de voortgang en de vraagtekst, maak <code>#opties</code> leeg en bouw per optie een <code>&lt;button class=\"optie\"&gt;</code> met een click-listener die <code>kies(i)</code> oproept. Toon ook de score.<br>" +
    "<b>3.</b> In <code>kies(index)</code>: negeer als er al geantwoord is. Klopt de index met <code>VRAGEN[global.huidige].juist</code>, verhoog dan de score. Geef de gekozen knop de class <code>juist</code> of <code>fout</code>.<br>" +
    "<b>4.</b> <code>volgende</code> gaat naar de volgende vraag (of naar <code>toonResultaat</code> als er geen meer zijn). <code>toonResultaat</code> verbergt de quiz, bewaart je scores in <code>localStorage</code> (als JSON) en toont je eindscore in <code>#resultaat</code>.<br><br>" +
    "<i>Het bestand <code>scripts/storage.js</code> laat <code>localStorage</code> werken in deze oefenomgeving — laat het gewoon staan.</i>",
  hint:
    "Bouw de optie-knoppen in een for-lus zodat i in de closure bewaard blijft bij kies(i). De huidige vraag lees je met VRAGEN[global.huidige]. localStorage bewaart enkel strings: JSON.stringify om je scores-array op te slaan, JSON.parse om ze terug in te lezen (met ?? \"[]\" als er nog niets is). Gebruik global.beantwoord om te vermijden dat iemand twee keer op een antwoord klikt.",
  topics: ["arrays", "objecten", "DOM", "events", "closures", "if/else", "localStorage", "JSON", "global"],
  files: [
    { name: "index.html", content: INDEX_HTML, readOnly: true },
    { name: "styles/style.css", content: STYLE_CSS, readOnly: true },
    { name: "scripts/storage.js", content: STORAGE_JS, readOnly: true },
    { name: "scripts/code.js", content: SKELETON_JS },
  ],
  checks: [
    {
      type: "static",
      id: "quiz-apis",
      label: "Je gebruikt events, createElement, localStorage en JSON",
      file: "scripts/code.js",
      must: ["addEventListener", "createElement", "localStorage", "JSON.parse", "JSON.stringify"],
    },
    {
      type: "static",
      id: "quiz-geen-var",
      label: "Je gebruikt geen var",
      file: "scripts/code.js",
      // var als declaratie (var + naam), niet de string "var" in de VRAGEN-data
      mustNot: ["/\\bvar\\s+[a-zA-Z_$]/"],
    },
    {
      type: "dom",
      id: "quiz-eerste",
      label: "De eerste vraag en haar antwoordknoppen verschijnen",
      assertions: [
        { selector: "#vraag", textIncludes: "NOOIT" },
        { selector: "#opties button", count: 3 },
      ],
    },
    {
      type: "dom",
      id: "quiz-juist",
      label: "Het juiste antwoord verhoogt de score",
      before: [
        { action: "click", selector: "#opties button:nth-of-type(3)" },
      ],
      assertions: [
        { selector: "#score", textIncludes: "1" },
      ],
    },
    {
      type: "dom",
      id: "quiz-fout",
      label: "Een fout antwoord verhoogt de score niet",
      before: [
        { action: "click", selector: "#opties button:nth-of-type(1)" },
      ],
      assertions: [
        { selector: "#score", textIncludes: "0" },
      ],
    },
    {
      type: "dom",
      id: "quiz-volgende",
      label: "‘Volgende’ toont de tweede vraag",
      before: [
        { action: "click", selector: "#volgende-button" },
      ],
      assertions: [
        { selector: "#vraag", textIncludes: "typeof" },
      ],
    },
    {
      type: "dom",
      id: "quiz-einde",
      label: "Alle vragen juist beantwoord toont de eindscore",
      before: [
        { action: "click", selector: "#opties button:nth-of-type(3)" },
        { action: "click", selector: "#volgende-button" },
        { action: "click", selector: "#opties button:nth-of-type(2)" },
        { action: "click", selector: "#volgende-button" },
        { action: "click", selector: "#opties button:nth-of-type(2)" },
        { action: "click", selector: "#volgende-button" },
        { action: "click", selector: "#opties button:nth-of-type(1)" },
        { action: "click", selector: "#volgende-button" },
      ],
      assertions: [
        { selector: "#resultaat", textIncludes: "4" },
      ],
    },
  ],
  solution: {
    "scripts/code.js": SOLUTION_JS,
  },
};
