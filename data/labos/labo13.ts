import type { ChapterContent } from "@/lib/types";

/* ════════════════════════════════════════════════════════════════════
   Labo 13 — JavaScript (introductie)
   Onderwerpen: de console, dialoogvensters (alert/prompt/confirm),
   functies (arrow notation), de setup-conventie + load-event,
   globale vs. lokale variabelen (let/const, NOOIT var), en de
   oefening "Rekenmachine".

   Cumulatief: enkel concepten t/m labo 13 — geen objecten, geen lussen,
   geen arrays, geen geavanceerde DOM-events buiten de setup-conventie.
   ════════════════════════════════════════════════════════════════════ */

export const labo13: ChapterContent = {
  chapter: {
    id: "labo13",
    n: "13",
    title: "JavaScript: de eerste stappen",
    desc: "Console, dialoogvensters, arrow functions, de setup-conventie en variabelen met let/const.",
    tag: "JS",
    difficulty: "easy",
  },

  theory: [
    {
      id: "t1",
      type: "mc",
      question:
        "Welk sleutelwoord gebruik je in deze cursus NOOIT om een variabele te declareren?",
      options: ["let", "const", "var"],
      correctIndex: 2,
      explanation:
        "We gebruiken altijd let (en const). var is function-scoped (of globaal buiten een functie) en zorgt voor verwarrende scoping en subtiele fouten.",
    },
    {
      id: "t2",
      type: "mc",
      question:
        "Hoe schrijf je in deze cursus een functie die niets teruggeeft en setup heet?",
      options: [
        "function setup() { ... }",
        "const setup = () => { ... }",
        "let setup = function setup() { ... }",
        "setup: () => { ... }",
      ],
      correctIndex: 1,
      explanation:
        "We gebruiken altijd de arrow notation en kennen de functie toe aan een const: const setup = () => { ... }. De oude function-schrijfwijze gebruiken we niet.",
    },
    {
      id: "t3",
      type: "mc",
      question:
        "Wat geeft de functie prompt() terug als de gebruiker op “Annuleren” klikt?",
      options: ["false", "een lege string \"\"", "null", "undefined"],
      correctIndex: 2,
      explanation:
        "prompt() geeft de ingevoerde tekst terug als string, maar null wanneer de gebruiker annuleert. confirm() geeft daarentegen true/false terug.",
    },
    {
      id: "t4",
      type: "open",
      question:
        "Waarom koppelen we onze code aan het load-event met window.addEventListener(\"load\", setup) in plaats van de code zomaar bovenaan te zetten?",
      answer:
        "Zodat de code (setup) pas draait wanneer de volledige pagina is ingeladen. Anders bestaan de HTML-elementen mogelijk nog niet wanneer het script loopt, en kan je ze dus nog niet ophalen of manipuleren.",
    },
    {
      id: "t5",
      type: "open",
      question:
        "Wat is het verschil tussen een lokale en een globale variabele, en waarom proberen we globale variabelen te beperken?",
      answer:
        "Een lokale variabele is enkel bekend binnen de functie waarin ze gedeclareerd werd; een globale variabele is overal in het programma toegankelijk — zelfs vanuit andere gekoppelde scripts op dezelfde pagina. We beperken globale variabelen omdat twee scripts per ongeluk dezelfde naam kunnen gebruiken en elkaars waarde overschrijven, wat tot moeilijk te vinden fouten leidt.",
    },
    {
      id: "t6",
      type: "mc",
      question:
        "Wat is het verschil tussen let en const?",
      options: [
        "let is block-scoped, const is function-scoped",
        "Beide zijn block-scoped, maar een const kan na de eerste toewijzing niet meer opnieuw toegewezen worden",
        "const kan enkel getallen bevatten, let enkel tekst",
        "Er is geen verschil, het zijn synoniemen",
      ],
      correctIndex: 1,
      explanation:
        "let en const zijn allebei block-scoped (enkel gekend in het blok waarin ze staan). Het verschil is dat een const een constante is en dus niet opnieuw toegewezen kan worden na de initiële declaratie.",
    },
  ],

  exercises: [
    /* ── 1. CONSOLE — eerste kennismaking ─────────────────────────── */
    {
      id: "l13-eerste-log",
      chapterId: "labo13",
      chapter: "JavaScript: de eerste stappen",
      n: 1,
      of: 6,
      title: "Je eerste regel JavaScript",
      tag: "JS",
      difficulty: "easy",
      brief:
        "Schrijf in <code>scripts/code.js</code> één regel die met <code>console.log</code> exact de tekst <code>Hallo JavaScript!</code> naar de console schrijft. De console is je technische hulpmiddel om snel iets te testen — niet zichtbaar voor de eindgebruiker.",
      hint: 'Gebruik console.log("...") met de tekst tussen aanhalingstekens. Let op de hoofdletter H en het uitroepteken.',
      topics: ["console.log", "strings"],
      examples: [{ label: "Console", output: "Hallo JavaScript!" }],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Eerste log</title>\n</head>\n<body>\n  <h1>Open de console hieronder 👇</h1>\n  <p>Deze oefening kijkt naar wat je logt.</p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content: "// Log hier exact: Hallo JavaScript!\n\n",
        },
      ],
      checks: [
        {
          type: "console",
          id: "logt-hallo",
          label: 'Je logt exact "Hallo JavaScript!"',
          expected: "Hallo JavaScript!",
          match: "equals",
        },
        {
          type: "static",
          id: "gebruikt-log",
          label: "Je gebruikt console.log",
          file: "scripts/code.js",
          must: ["console.log"],
        },
        {
          type: "static",
          id: "geen-var-1",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js": 'console.log("Hallo JavaScript!");',
      },
    },

    /* ── 2. FUNCTION — arrow function met return ───────────────────── */
    {
      id: "l13-begroeting",
      chapterId: "labo13",
      chapter: "JavaScript: de eerste stappen",
      n: 2,
      of: 6,
      title: "Een begroetings-functie",
      tag: "JS",
      difficulty: "easy",
      brief:
        "Schrijf een <code>globale</code> functie <code>begroet(naam)</code> die een begroeting <code>return</code>t in de vorm <code>Hallo naam!</code>. Gebruik de arrow notation. (Hier gebruiken we GEEN setup, want we testen de functie rechtstreeks.)",
      hint: 'Gebruik string-concatenatie met +: const begroet = (naam) => "Hallo " + naam + "!"; Vergeet de spatie na "Hallo" en het uitroepteken niet.',
      topics: ["functions", "arrow", "return", "strings"],
      examples: [
        { input: 'begroet("Sam")', output: "Hallo Sam!" },
        { input: 'begroet("Lien")', output: "Hallo Lien!" },
      ],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf hier de globale arrow function begroet(naam)\n// Ze geeft \"Hallo <naam>!\" terug.\n\n",
        },
      ],
      checks: [
        {
          type: "function",
          id: "begroet-werkt",
          label: "begroet geeft de juiste begroeting terug",
          name: "begroet",
          cases: [
            { args: ["Sam"], expected: "Hallo Sam!" },
            { args: ["Lien"], expected: "Hallo Lien!" },
            { args: ["Wereld"], expected: "Hallo Wereld!" },
          ],
        },
        {
          type: "static",
          id: "arrow-2",
          label: "Je gebruikt een arrow function",
          file: "scripts/code.js",
          must: ["/=>/"],
        },
        {
          type: "static",
          id: "geen-var-2",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js": 'const begroet = (naam) => "Hallo " + naam + "!";',
      },
    },

    /* ── 3. STATIC + CONSOLE — moderniseer naar let/const + arrow ──── */
    {
      id: "l13-moderniseer",
      chapterId: "labo13",
      chapter: "JavaScript: de eerste stappen",
      n: 3,
      of: 6,
      title: "Moderniseer de oude code",
      tag: "JS",
      difficulty: "easy",
      brief:
        "Onderstaande code is in de <code>oude</code> stijl geschreven. Herschrijf ze volgens de cursus-conventies: vervang elke <code>var</code> door <code>const</code> en maak van de functie een <code>arrow function</code> (<code>=&gt;</code>). De uitvoer in de console moet hetzelfde blijven.",
      hint: "var → const. De oude vorm const oppervlakte = function (b, h) { ... } wordt const oppervlakte = (b, h) => { ... }. De variabele binnenin (var result) wordt ook een const.",
      topics: ["const", "arrow functions", "let vs var"],
      files: [
        {
          name: "scripts/code.js",
          content:
            "var oppervlakte = function (breedte, hoogte) {\n  var result = breedte * hoogte;\n  return result;\n};\n\nconsole.log(oppervlakte(4, 5));",
        },
      ],
      checks: [
        {
          type: "static",
          id: "geen-var-3",
          label: "Er staat nergens nog var in je code",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
        {
          type: "static",
          id: "const-arrow-3",
          label: "Je gebruikt const én een arrow function",
          file: "scripts/code.js",
          must: ["/\\bconst\\b/", "/=>/"],
        },
        {
          type: "console",
          id: "nog-steeds-20",
          label: "De uitvoer is nog steeds 20",
          expected: "20",
          match: "equals",
        },
      ],
      solution: {
        "scripts/code.js":
          "const oppervlakte = (breedte, hoogte) => {\n  const result = breedte * hoogte;\n  return result;\n};\n\nconsole.log(oppervlakte(4, 5));",
      },
    },

    /* ── 4. STATIC + CONSOLE — setup-conventie + load-event ────────── */
    {
      id: "l13-leeg-project",
      chapterId: "labo13",
      chapter: "JavaScript: de eerste stappen",
      n: 4,
      of: 6,
      title: "Het leeg project: de setup-conventie",
      tag: "JS",
      difficulty: "easy",
      brief:
        "Dit is het startpunt van elk project. Maak in <code>scripts/code.js</code> een functie <code>const setup = () =&gt; { ... }</code> en koppel ze aan het load-event met <code>window.addEventListener(\"load\", setup)</code>. Laat <code>setup</code> precies één regel loggen: <code>De pagina is geladen</code>. Zo draait je code pas wanneer de volledige pagina klaar is.",
      hint: 'Schrijf eerst const setup = () => { console.log("De pagina is geladen"); }; en daaronder window.addEventListener("load", setup);. Let op: setup koppel je ZONDER haakjes (je geeft de functie door, je roept ze niet zelf op).',
      topics: ["setup-conventie", "addEventListener", "load-event", "arrow"],
      examples: [{ label: "Console", output: "De pagina is geladen" }],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Leeg project</title>\n</head>\n<body>\n  <h1>Leeg startproject</h1>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            "// 1. maak de functie setup als arrow function\n// 2. log binnen setup: De pagina is geladen\n// 3. koppel setup aan het load-event\n\n",
        },
      ],
      checks: [
        {
          type: "console",
          id: "setup-logt",
          label: 'Na het laden staat er exact "De pagina is geladen"',
          expected: "De pagina is geladen",
          match: "equals",
        },
        {
          type: "static",
          id: "heeft-setup",
          label: "Je declareert const setup als arrow function",
          file: "scripts/code.js",
          must: ["/const\\s+setup\\s*=/", "/=>/"],
        },
        {
          type: "static",
          id: "koppelt-load",
          label: "Je koppelt setup aan het load-event",
          file: "scripts/code.js",
          must: ['/addEventListener\\(\\s*["\']load["\']\\s*,\\s*setup\\s*\\)/'],
        },
        {
          type: "static",
          id: "geen-var-4",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  console.log("De pagina is geladen");\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 5. DOM — de Rekenmachine (de labo-oefening) ───────────────── */
    {
      id: "l13-rekenmachine",
      chapterId: "labo13",
      chapter: "JavaScript: de eerste stappen",
      n: 5,
      of: 6,
      title: "Rekenmachine: vul de operatoren aan",
      tag: "JS",
      difficulty: "medium",
      brief:
        "De rekenmachine is half af: <code>optellen</code> werkt al en is volledig gekoppeld in <code>setup</code>. Werk de drie ontbrekende functies af — <code>aftrekken</code>, <code>vermenigvuldigen</code> en <code>delen</code> — op dezelfde manier als <code>optellen</code>. Lees de twee getallen uit <code>#txtLinks</code> en <code>#txtRechts</code> met <code>parseInt(... , 10)</code>, bereken het resultaat en toon in <code>#txtOutput</code> de tekst <code>g1 (operator) g2 = resultaat</code> (bv. <code>8 - 3 = 5</code>).",
      hint: 'Kopieer de structuur van optellen. Gebruik - voor aftrekken, * voor vermenigvuldigen en / voor delen. De tekst van het deel-resultaat toon je met een / (dus: g1 + " / " + g2 + " = " + resultaat). De knoppen zijn al gekoppeld in setup.',
      topics: ["setup-conventie", "getElementById", "parseInt", "innerHTML", "operatoren"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Demo rekenmachine</title>\n</head>\n<body>\n  <input type="number" id="txtLinks">\n  <input type="button" id="btnOptellen" value="+">\n  <input type="button" id="btnAftrekken" value="-">\n  <input type="button" id="btnVermenigvuldigen" value="x">\n  <input type="button" id="btnDelen" value=":">\n  <input type="number" id="txtRechts">\n  <span id="txtOutput">(geen output)</span>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  const btnOptellen = document.getElementById("btnOptellen");\n  const btnAftrekken = document.getElementById("btnAftrekken");\n  const btnVermenigvuldigen = document.getElementById("btnVermenigvuldigen");\n  const btnDelen = document.getElementById("btnDelen");\n\n  btnOptellen.addEventListener("click", optellen);\n  btnAftrekken.addEventListener("click", aftrekken);\n  btnVermenigvuldigen.addEventListener("click", vermenigvuldigen);\n  btnDelen.addEventListener("click", delen);\n};\n\nconst optellen = () => {\n  const txtOutput = document.getElementById("txtOutput");\n  const txtLinks = document.getElementById("txtLinks");\n  const txtRechts = document.getElementById("txtRechts");\n\n  const g1 = parseInt(txtLinks.value, 10);\n  const g2 = parseInt(txtRechts.value, 10);\n  const resultaat = g1 + g2;\n\n  txtOutput.innerHTML = g1 + " + " + g2 + " = " + resultaat;\n};\n\nconst aftrekken = () => {\n  // TODO: trek g2 af van g1 en toon "g1 - g2 = resultaat"\n};\n\nconst vermenigvuldigen = () => {\n  // TODO: vermenigvuldig g1 met g2 en toon "g1 * g2 = resultaat"\n};\n\nconst delen = () => {\n  // TODO: deel g1 door g2 en toon "g1 / g2 = resultaat"\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "dom",
          id: "aftrekken-werkt",
          label: "Aftrekken: 8 - 3 = 5",
          before: [
            { action: "input", selector: "#txtLinks", value: "8" },
            { action: "input", selector: "#txtRechts", value: "3" },
            { action: "click", selector: "#btnAftrekken", times: 1 },
          ],
          assertions: [{ selector: "#txtOutput", textEquals: "8 - 3 = 5" }],
        },
        {
          type: "dom",
          id: "vermenigvuldigen-werkt",
          label: "Vermenigvuldigen: 7 * 6 = 42",
          before: [
            { action: "input", selector: "#txtLinks", value: "7" },
            { action: "input", selector: "#txtRechts", value: "6" },
            { action: "click", selector: "#btnVermenigvuldigen", times: 1 },
          ],
          assertions: [{ selector: "#txtOutput", textEquals: "7 * 6 = 42" }],
        },
        {
          type: "dom",
          id: "delen-werkt",
          label: "Delen: 20 / 4 = 5",
          before: [
            { action: "input", selector: "#txtLinks", value: "20" },
            { action: "input", selector: "#txtRechts", value: "4" },
            { action: "click", selector: "#btnDelen", times: 1 },
          ],
          assertions: [{ selector: "#txtOutput", textEquals: "20 / 4 = 5" }],
        },
        {
          type: "static",
          id: "geen-var-5",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const btnOptellen = document.getElementById("btnOptellen");\n  const btnAftrekken = document.getElementById("btnAftrekken");\n  const btnVermenigvuldigen = document.getElementById("btnVermenigvuldigen");\n  const btnDelen = document.getElementById("btnDelen");\n\n  btnOptellen.addEventListener("click", optellen);\n  btnAftrekken.addEventListener("click", aftrekken);\n  btnVermenigvuldigen.addEventListener("click", vermenigvuldigen);\n  btnDelen.addEventListener("click", delen);\n};\n\nconst optellen = () => {\n  const txtOutput = document.getElementById("txtOutput");\n  const txtLinks = document.getElementById("txtLinks");\n  const txtRechts = document.getElementById("txtRechts");\n\n  const g1 = parseInt(txtLinks.value, 10);\n  const g2 = parseInt(txtRechts.value, 10);\n  const resultaat = g1 + g2;\n\n  txtOutput.innerHTML = g1 + " + " + g2 + " = " + resultaat;\n};\n\nconst aftrekken = () => {\n  const txtOutput = document.getElementById("txtOutput");\n  const txtLinks = document.getElementById("txtLinks");\n  const txtRechts = document.getElementById("txtRechts");\n\n  const g1 = parseInt(txtLinks.value, 10);\n  const g2 = parseInt(txtRechts.value, 10);\n  const resultaat = g1 - g2;\n\n  txtOutput.innerHTML = g1 + " - " + g2 + " = " + resultaat;\n};\n\nconst vermenigvuldigen = () => {\n  const txtOutput = document.getElementById("txtOutput");\n  const txtLinks = document.getElementById("txtLinks");\n  const txtRechts = document.getElementById("txtRechts");\n\n  const g1 = parseInt(txtLinks.value, 10);\n  const g2 = parseInt(txtRechts.value, 10);\n  const resultaat = g1 * g2;\n\n  txtOutput.innerHTML = g1 + " * " + g2 + " = " + resultaat;\n};\n\nconst delen = () => {\n  const txtOutput = document.getElementById("txtOutput");\n  const txtLinks = document.getElementById("txtLinks");\n  const txtRechts = document.getElementById("txtRechts");\n\n  const g1 = parseInt(txtLinks.value, 10);\n  const g2 = parseInt(txtRechts.value, 10);\n  const resultaat = g1 / g2;\n\n  txtOutput.innerHTML = g1 + " / " + g2 + " = " + resultaat;\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 6. FUNCTION — zelf verzonnen, zelfde stijl ────────────────── */
    {
      id: "l13-seconden",
      chapterId: "labo13",
      chapter: "JavaScript: de eerste stappen",
      n: 6,
      of: 6,
      title: "Reken seconden om",
      tag: "JS",
      difficulty: "medium",
      brief:
        "Schrijf een <code>globale</code> arrow function <code>naarMinuten(seconden)</code> die een aantal seconden omrekent naar een leesbare tekst <code>m min s sec</code>. Voorbeeld: <code>naarMinuten(135)</code> geeft <code>2 min 15 sec</code>. Gebruik gehele deling met <code>Math.floor</code> en de restoperator <code>%</code>.",
      hint: 'Het aantal volledige minuten is Math.floor(seconden / 60), de overblijvende seconden zijn seconden % 60. Bouw daarna de tekst: minuten + " min " + rest + " sec".',
      topics: ["functions", "arrow", "Math.floor", "modulo", "strings"],
      examples: [
        { input: "naarMinuten(135)", output: "2 min 15 sec" },
        { input: "naarMinuten(60)", output: "1 min 0 sec" },
        { input: "naarMinuten(45)", output: "0 min 45 sec" },
      ],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf de globale arrow function naarMinuten(seconden)\n// naarMinuten(135) => \"2 min 15 sec\"\n\n",
        },
      ],
      checks: [
        {
          type: "function",
          id: "naarminuten-werkt",
          label: "naarMinuten rekent correct om",
          name: "naarMinuten",
          cases: [
            { args: [135], expected: "2 min 15 sec" },
            { args: [60], expected: "1 min 0 sec" },
            { args: [45], expected: "0 min 45 sec" },
            { args: [3661], expected: "61 min 1 sec" },
          ],
        },
        {
          type: "static",
          id: "gebruikt-floor",
          label: "Je gebruikt Math.floor en de restoperator %",
          file: "scripts/code.js",
          must: ["Math.floor", "%"],
        },
        {
          type: "static",
          id: "geen-var-6",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const naarMinuten = (seconden) => {\n  const minuten = Math.floor(seconden / 60);\n  const rest = seconden % 60;\n  return minuten + " min " + rest + " sec";\n};',
      },
    },
  ],
};
