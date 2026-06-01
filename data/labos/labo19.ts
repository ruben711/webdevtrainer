import type { ChapterContent } from "@/lib/types";

/* ════════════════════════════════════════════════════════════════════
   Labo 19 — JavaScript (deel 7): timers, duurtijd, willekeurige
   getallen en globale variabelen.

   Onderwerpen (cumulatief t/m labo 19):
   - setInterval / setTimeout + clearInterval / clearTimeout
   - duurtijd meten met console.time / console.timeEnd
   - willekeurige getallen: Math.random + Math.floor / ceil / round
   - globale variabelen bundelen in één global object
   - DOM-events (beschikbaar vanaf labo 18): addEventListener

   Runner-conventie: elke .html = body, elke .css = <style>, elke .js =
   <script>. Grading draait synchroon NA het load-event, dus timer-
   callbacks (setInterval/setTimeout) zijn dan nog NIET uitgevoerd.
   Alle checks hieronder leunen daarom op synchrone effecten (klik-
   handlers, globale functies) en niet op het verstrijken van tijd.
   ════════════════════════════════════════════════════════════════════ */

export const labo19: ChapterContent = {
  chapter: {
    id: "labo19",
    n: "19",
    title: "Timers, willekeur & globale variabelen",
    desc: "Werk met setInterval/setTimeout, meet duurtijd, genereer willekeurige getallen en bundel globale variabelen in één object.",
    tag: "JS",
    difficulty: "medium",
  },

  theory: [
    {
      id: "t1",
      type: "mc",
      question:
        "Welke timer voert een callback HERHAALDELIJK uit, telkens na hetzelfde aantal milliseconden?",
      options: ["setTimeout", "setInterval", "console.time", "Math.random"],
      correctIndex: 1,
      explanation:
        "setInterval herhaalt de callback om de zoveel milliseconden. setTimeout voert de callback exact één keer uit na een wachttijd.",
    },
    {
      id: "t2",
      type: "mc",
      question:
        "Je deed let id = setInterval(tik, 1000). Hoe stop je deze timer weer?",
      options: [
        "stopInterval(id)",
        "clearTimeout(id)",
        "clearInterval(id)",
        "id.stop()",
      ],
      correctIndex: 2,
      explanation:
        "setInterval geeft een id-getal terug; met clearInterval(id) zet je net die timer stop. (Voor setTimeout gebruik je clearTimeout.)",
    },
    {
      id: "t3",
      type: "mc",
      question:
        "Math.random() geeft een kommagetal in [0, 1[. Welke uitdrukking geeft een GEHEEL getal in [0, 5[ (dus 0, 1, 2, 3 of 4)?",
      options: [
        "Math.round(Math.random() * 5)",
        "Math.floor(Math.random() * 5)",
        "Math.ceil(Math.random() * 5)",
        "Math.floor(Math.random()) * 5",
      ],
      correctIndex: 1,
      explanation:
        "Math.random() * 5 ligt in [0, 5[. Math.floor rondt naar beneden af, dus je krijgt 0 t/m 4. Math.round of Math.ceil zouden ook 5 kunnen opleveren.",
    },
    {
      id: "t4",
      type: "open",
      question:
        "Waarom is het beter om al je globale variabelen in één object (bv. let global = { ... }) te steken in plaats van losse globale variabelen aan te maken?",
      answer:
        "Losse globale variabelen worden properties van het window-object, dat al vol staat met bestaande namen — daardoor groeit het risico op naamconflicten. Door alles in één object te bundelen vervuil je de global namespace veel minder (slechts één globale naam) en vind je al je gegevens makkelijk terug bij het debuggen.",
    },
    {
      id: "t5",
      type: "open",
      question:
        "Wat is het voordeel van console.time(\"label\") en console.timeEnd(\"label\") ten opzichte van zelf met Date.now() een start- en eindtijd af te trekken?",
      answer:
        "console.timeEnd berekent automatisch het verschil met de bijhorende console.time én logt het meteen, dus je hoeft zelf geen variabelen aan te maken of af te trekken. Bovendien meet het nauwkeuriger (tot op microseconden in plaats van enkel milliseconden).",
    },
  ],

  exercises: [
    /* ── 1. Afronden met Math (pure functies, function-check) ───────── */
    {
      id: "l19-afronden",
      chapterId: "labo19",
      chapter: "Timers, willekeur & globale variabelen",
      n: 1,
      of: 6,
      title: "Afronden met Math",
      tag: "JS",
      difficulty: "easy",
      brief:
        "Schrijf in <code>scripts/code.js</code> drie <code>globale</code> arrow-functies die een kommagetal afronden:<br>• <code>naarBeneden(getal)</code> met <code>Math.floor</code><br>• <code>naarBoven(getal)</code> met <code>Math.ceil</code><br>• <code>dichtstbij(getal)</code> met <code>Math.round</code><br>Elke functie geeft het afgeronde getal <code>return</code> terug. (Geen <code>setup</code> nodig — we testen de functies rechtstreeks.)",
      hint: "const naarBeneden = (getal) => Math.floor(getal); — en analoog Math.ceil en Math.round. Vergeet de return niet (bij een korte arrow zonder accolades is dat impliciet).",
      topics: ["Math.floor", "Math.ceil", "Math.round", "functions", "arrow"],
      examples: [
        { input: "naarBeneden(7.67)", output: "7" },
        { input: "naarBoven(7.34)", output: "8" },
        { input: "dichtstbij(7.5)", output: "8" },
      ],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf drie globale arrow-functies: naarBeneden, naarBoven en dichtstbij.\n// naarBeneden -> Math.floor, naarBoven -> Math.ceil, dichtstbij -> Math.round\n\n",
        },
      ],
      checks: [
        {
          type: "function",
          id: "floor-werkt",
          label: "naarBeneden rondt correct naar beneden af",
          name: "naarBeneden",
          cases: [
            { args: [7.67], expected: 7 },
            { args: [7.01], expected: 7 },
            { args: [-7.34], expected: -8 },
          ],
        },
        {
          type: "function",
          id: "ceil-werkt",
          label: "naarBoven rondt correct naar boven af",
          name: "naarBoven",
          cases: [
            { args: [7.34], expected: 8 },
            { args: [7.99], expected: 8 },
            { args: [-7.67], expected: -7 },
          ],
        },
        {
          type: "function",
          id: "round-werkt",
          label: "dichtstbij rondt mathematisch af",
          name: "dichtstbij",
          cases: [
            { args: [7.34], expected: 7 },
            { args: [7.67], expected: 8 },
            { args: [7.5], expected: 8 },
          ],
        },
        {
          type: "static",
          id: "geen-var",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js":
          "const naarBeneden = (getal) => Math.floor(getal);\nconst naarBoven = (getal) => Math.ceil(getal);\nconst dichtstbij = (getal) => Math.round(getal);",
      },
    },

    /* ── 2. Willekeurig geheel getal (formule, function-check) ──────── */
    {
      id: "l19-willekeurig",
      chapterId: "labo19",
      chapter: "Timers, willekeur & globale variabelen",
      n: 2,
      of: 6,
      title: "Willekeurig geheel getal",
      tag: "JS",
      difficulty: "medium",
      brief:
        "Schrijf een <code>globale</code> functie <code>willekeurigGeheel(min, max)</code> die een willekeurig <code>geheel</code> getal teruggeeft in het interval <code>[min, max[</code> (min inclusief, max exclusief). Gebruik de cursusformule met <code>Math.floor</code> en <code>Math.random</code>: <code>Math.floor(Math.random() * (max - min) + min)</code>.",
      hint: "const willekeurigGeheel = (min, max) => Math.floor(Math.random() * (max - min) + min); — Math.random() ligt in [0, 1[, dus voor een interval ter breedte 1 (bv. 7..8) krijg je altijd min terug, en voor breedte 0 (bv. 5..5) ook.",
      topics: ["Math.random", "Math.floor", "functions", "arrow"],
      examples: [
        { input: "willekeurigGeheel(7, 8)", output: "7" },
        { input: "willekeurigGeheel(5, 5)", output: "5" },
      ],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf de globale functie willekeurigGeheel(min, max).\n// Gebruik: Math.floor(Math.random() * (max - min) + min)\n\n",
        },
      ],
      checks: [
        {
          type: "function",
          id: "breedte-een",
          label: "Bij een interval ter breedte 1 krijg je altijd min terug",
          name: "willekeurigGeheel",
          cases: [
            { args: [7, 8], expected: 7 },
            { args: [0, 1], expected: 0 },
            { args: [10, 11], expected: 10 },
          ],
        },
        {
          type: "function",
          id: "breedte-nul",
          label: "Bij een leeg interval (min == max) krijg je min terug",
          name: "willekeurigGeheel",
          cases: [
            { args: [5, 5], expected: 5 },
            { args: [0, 0], expected: 0 },
          ],
        },
        {
          type: "static",
          id: "gebruikt-random",
          label: "Je gebruikt Math.random en Math.floor",
          file: "scripts/code.js",
          must: ["Math.random", "Math.floor"],
        },
      ],
      solution: {
        "scripts/code.js":
          "const willekeurigGeheel = (min, max) => Math.floor(Math.random() * (max - min) + min);",
      },
    },

    /* ── 3. Timer starten met setInterval (console + static) ────────── */
    {
      id: "l19-timer-start",
      chapterId: "labo19",
      chapter: "Timers, willekeur & globale variabelen",
      n: 3,
      of: 6,
      title: "Een timer opstarten",
      tag: "JS",
      difficulty: "medium",
      brief:
        "Vul <code>scripts/code.js</code> aan binnen <code>setup</code>:<br>1. Log meteen exact <code>Timer gestart</code> naar de console.<br>2. Start daarna met <code>setInterval</code> een timer die elke seconde (<code>1000</code> ms) de functie <code>tik</code> oproept. <code>tik</code> logt telkens <code>tik</code>.<br>3. Bewaar het id van <code>setInterval</code> in de globale variabele <code>timerId</code> zodat je de timer later met <code>clearInterval</code> zou kunnen stoppen.",
      hint: 'Binnen setup: console.log("Timer gestart"); en daarna timerId = setInterval(tik, 1000);. De checks draaien net na het laden, dus tik zelf hoeft nog niet gelopen te hebben — het gaat erom dat je de timer correct opstart.',
      topics: ["setInterval", "clearInterval", "console.log", "addEventListener"],
      examples: [{ label: "Console (meteen)", output: "Timer gestart" }],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <title>Timer</title>\n</head>\n<body>\n  <h1>Open de console 👇</h1>\n  <p id="output"></p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'let timerId = 0;\n\nconst tik = () => {\n  console.log("tik");\n};\n\nconst setup = () => {\n  // 1. log meteen exact: Timer gestart\n  // 2. start een setInterval die elke 1000 ms tik oproept\n  // 3. bewaar het id in timerId\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "console",
          id: "log-gestart",
          label: 'Je logt "Timer gestart" zodra de timer opstart',
          expected: "Timer gestart",
          match: "includes",
        },
        {
          type: "static",
          id: "gebruikt-interval",
          label: "Je start de timer met setInterval(tik, 1000)",
          file: "scripts/code.js",
          must: ["setInterval", "/setInterval\\s*\\(\\s*tik\\s*,\\s*1000\\s*\\)/"],
        },
        {
          type: "static",
          id: "bewaart-id",
          label: "Je bewaart het timer-id in timerId",
          file: "scripts/code.js",
          must: ["/timerId\\s*=\\s*setInterval/"],
        },
        {
          type: "static",
          id: "geen-var",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js":
          'let timerId = 0;\n\nconst tik = () => {\n  console.log("tik");\n};\n\nconst setup = () => {\n  console.log("Timer gestart");\n  timerId = setInterval(tik, 1000);\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 4. Duurtijd meten met console.time (console + static) ──────── */
    {
      id: "l19-duurtijd",
      chapterId: "labo19",
      chapter: "Timers, willekeur & globale variabelen",
      n: 4,
      of: 6,
      title: "Hoe lang duurt mijn code?",
      tag: "JS",
      difficulty: "medium",
      brief:
        "In <code>scripts/code.js</code> staat een functie <code>traagWerk</code> die veel optelt en het resultaat logt. Meet hoe lang ze duurt:<br>1. Roep <code>console.time(\"werk\")</code> aan vlak vóór de lus.<br>2. Roep <code>console.timeEnd(\"werk\")</code> aan vlak ná de lus.<br>Gebruik <code>exact hetzelfde label</code> (<code>\"werk\"</code>) bij beide, anders kan de browser de meting niet koppelen.",
      hint: 'Zet console.time("werk") boven de for-lus en console.timeEnd("werk") eronder. Het label moet bij beide identiek zijn. De som zelf (console.log van resultaat) laat je staan.',
      topics: ["console.time", "console.timeEnd", "duurtijd", "loops"],
      examples: [{ label: "Console (resultaat)", output: "som = 49995000" }],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <title>Duurtijd</title>\n</head>\n<body>\n  <h1>Open de console 👇</h1>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const traagWerk = () => {\n  // 1. start hier de chronometer met label "werk"\n\n  let som = 0;\n  for (let i = 0; i < 10000; i++) {\n    som = som + i;\n  }\n\n  // 2. stop hier de chronometer met label "werk"\n\n  console.log("som = " + som);\n};\n\nconst setup = () => {\n  traagWerk();\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "console",
          id: "logt-som",
          label: 'De som wordt gelogd als "som = 49995000"',
          expected: "som = 49995000",
          match: "includes",
        },
        {
          type: "static",
          id: "time-start",
          label: 'Je start de meting met console.time("werk")',
          file: "scripts/code.js",
          must: ['/console\\.time\\(\\s*["\']werk["\']\\s*\\)/'],
        },
        {
          type: "static",
          id: "time-end",
          label: 'Je stopt de meting met console.timeEnd("werk")',
          file: "scripts/code.js",
          must: ['/console\\.timeEnd\\(\\s*["\']werk["\']\\s*\\)/'],
        },
      ],
      solution: {
        "scripts/code.js":
          'const traagWerk = () => {\n  console.time("werk");\n\n  let som = 0;\n  for (let i = 0; i < 10000; i++) {\n    som = som + i;\n  }\n\n  console.timeEnd("werk");\n\n  console.log("som = " + som);\n};\n\nconst setup = () => {\n  traagWerk();\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 5. Globale variabelen bundelen in één object (function) ────── */
    {
      id: "l19-global-object",
      chapterId: "labo19",
      chapter: "Timers, willekeur & globale variabelen",
      n: 5,
      of: 6,
      title: "Globale variabelen in één object",
      tag: "JS",
      difficulty: "medium",
      brief:
        "Om de global namespace niet te vervuilen bundelen we onze globale gegevens in één object. Vul aan in <code>scripts/code.js</code>:<br>1. Voeg aan het <code>global</code>-object een property <code>score</code> toe met startwaarde <code>0</code>.<br>2. Schrijf een <code>globale</code> functie <code>voegPuntenToe(aantal)</code> die <code>global.score</code> met <code>aantal</code> verhoogt en daarna de nieuwe <code>global.score</code> <code>return</code>t.",
      hint: "Zet score: 0 in het global-object (let op de komma's). voegPuntenToe doet: global.score = global.score + aantal; return global.score;. Schrijf het NIET in setup — de functie moet globaal zijn.",
      topics: ["globale variabelen", "objecten", "functions", "return"],
      examples: [
        { input: "voegPuntenToe(3)", output: "3" },
        { input: "voegPuntenToe(3); voegPuntenToe(2)", output: "5" },
      ],
      files: [
        {
          name: "scripts/code.js",
          content:
            "let global = {\n  SPELNAAM: \"Hit an object\",\n  MAX_SCORE: 100,\n  // 1. voeg hier score toe met startwaarde 0\n};\n\n// 2. schrijf hier de globale functie voegPuntenToe(aantal)\n",
        },
      ],
      checks: [
        {
          type: "function",
          id: "telt-op",
          label: "voegPuntenToe verhoogt de score en geeft de nieuwe score terug",
          name: "voegPuntenToe",
          cases: [
            { args: [3], expected: 3 },
            { args: [2], expected: 5 },
            { args: [10], expected: 15 },
          ],
        },
        {
          type: "static",
          id: "score-property",
          label: "Het global-object heeft een property score",
          file: "scripts/code.js",
          must: ["/score\\s*:\\s*0/"],
        },
        {
          type: "static",
          id: "gebruikt-global-score",
          label: "Je werkt via global.score (één globale variabele)",
          file: "scripts/code.js",
          must: ["global.score"],
        },
      ],
      solution: {
        "scripts/code.js":
          'let global = {\n  SPELNAAM: "Hit an object",\n  MAX_SCORE: 100,\n  score: 0,\n};\n\nconst voegPuntenToe = (aantal) => {\n  global.score = global.score + aantal;\n  return global.score;\n};',
      },
    },

    /* ── 6. Hit an object — klikspel (dom + console + static) ───────── */
    {
      id: "l19-hit-an-object",
      chapterId: "labo19",
      chapter: "Timers, willekeur & globale variabelen",
      n: 6,
      of: 6,
      title: "Hit an object: tel de treffers",
      tag: "JS",
      difficulty: "hard",
      brief:
        "We bouwen de kern van het spel <em>hit an object</em>. In <code>setup</code> staat al een <code>setInterval</code> die elke seconde een figuur zou verspringen. Vul de <code>klik</code>-logica aan:<br>1. Voeg in <code>setup</code> een <code>click</code>-listener toe aan <code>#target</code> die de functie <code>geklikt</code> oproept.<br>2. In <code>geklikt</code>: verhoog <code>global.score</code> met 1 en toon de nieuwe score als tekst in <code>#score</code>.<br>De teller moet dus stijgen bij elke klik op de figuur.",
      hint: 'In setup: document.getElementById("target").addEventListener("click", geklikt);. In geklikt: global.score++; en document.getElementById("score").textContent = global.score;. (textContent verwacht tekst, maar een getal wordt automatisch omgezet.)',
      topics: ["addEventListener", "click", "globale variabelen", "setInterval", "textContent"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Hit an object</title>\n</head>\n<body>\n  <p>Score: <span id="score">0</span></p>\n  <div id="playfield">\n    <img id="target" src="" alt="doel">\n  </div>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "styles/style.css",
          content:
            "#playfield {\n  position: relative;\n  width: 600px;\n  height: 400px;\n  border: 2px solid #333;\n}\n\n#target {\n  width: 48px;\n  height: 48px;\n}",
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'let global = {\n  IMAGE_COUNT: 5,\n  MOVE_DELAY: 1000,\n  score: 0,\n};\n\nlet timerId = 0;\n\nconst verspring = () => {\n  console.log("verspring");\n};\n\nconst geklikt = () => {\n  // 1. verhoog global.score met 1\n  // 2. toon de nieuwe score in #score\n};\n\nconst setup = () => {\n  // voeg hier een click-listener toe aan #target die geklikt oproept\n\n  timerId = setInterval(verspring, global.MOVE_DELAY);\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "dom",
          id: "score-na-een-klik",
          label: 'Na 1 klik op de figuur staat er "1" in #score',
          before: [{ action: "click", selector: "#target", times: 1 }],
          assertions: [{ selector: "#score", textEquals: "1" }],
        },
        {
          type: "dom",
          id: "score-na-drie-klikken",
          label: 'Na 3 klikken staat er "3" in #score',
          before: [{ action: "click", selector: "#target", times: 3 }],
          assertions: [{ selector: "#score", textEquals: "3" }],
        },
        {
          type: "static",
          id: "gebruikt-listener",
          label: "Je gebruikt addEventListener voor de klik",
          file: "scripts/code.js",
          must: ["addEventListener", "/=>/"],
        },
        {
          type: "static",
          id: "geen-var",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js":
          'let global = {\n  IMAGE_COUNT: 5,\n  MOVE_DELAY: 1000,\n  score: 0,\n};\n\nlet timerId = 0;\n\nconst verspring = () => {\n  console.log("verspring");\n};\n\nconst geklikt = () => {\n  global.score++;\n  document.getElementById("score").textContent = global.score;\n};\n\nconst setup = () => {\n  document.getElementById("target").addEventListener("click", geklikt);\n\n  timerId = setInterval(verspring, global.MOVE_DELAY);\n};\n\nwindow.addEventListener("load", setup);',
      },
    },
  ],
};
