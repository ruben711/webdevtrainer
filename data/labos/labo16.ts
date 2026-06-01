import type { ChapterContent } from "@/lib/types";

/* ════════════════════════════════════════════════════════════════════
   Labo 16 — JavaScript (deel 4): formulieren + strings
   Onderwerpen: HTML-formulieren (action/method, name, label/for, hidden,
   radio, submit, select, input-types, autofocus, required), typeof, en de
   String-methods uit cursus 3.4 (split, join, indexOf, lastIndexOf,
   substring, toUpperCase, trim, replaceAll, length).
   Cumulatief t/m labo 16: let/const (nooit var), arrow functions, de
   setup + window.addEventListener("load", setup)-conventie (labo 13),
   getElementById / .value / .innerHTML / addEventListener("click", …)
   (labo 14), getElementsByTagName / .textContent / lussen over collecties
   (labo 15). Geen concepten van latere labo's.
   ════════════════════════════════════════════════════════════════════ */

export const labo16: ChapterContent = {
  chapter: {
    id: "labo16",
    n: "16",
    title: "JavaScript deel 4: formulieren & strings",
    desc: "HTML-formulieren correct opbouwen en strings bewerken met split, indexOf, substring en meer.",
    tag: "JS",
    difficulty: "medium",
  },

  theory: [
    {
      id: "t1",
      type: "mc",
      question:
        "Je registreert nieuwe klantgegevens via een formulier. Welke HTTP-method hoort daarbij?",
      options: ["GET", "POST", "Maakt niet uit, allebei goed"],
      correctIndex: 1,
      explanation:
        "POST is een 'schrijf naar resource'-opdracht: gegevens worden op de server bewaard. GET is een leesopdracht en mag bovendien gecachet worden, wat ongewenst is bij het opslaan van data.",
    },
    {
      id: "t2",
      type: "mc",
      question:
        "Waarvoor dient het name-attribuut van een input-element in een <form>?",
      options: [
        "Om het element met CSS te kunnen selecteren",
        "Het is de sleutel waaronder de waarde naar de server wordt doorgestuurd (bv. postcode=8500)",
        "Het bepaalt de tekst die naast het invulveld verschijnt",
      ],
      correctIndex: 1,
      explanation:
        "Bij het versturen wordt de data voorgesteld als name=waarde. Een id moet uniek zijn op de pagina; een name hoeft dat niet (bv. radio buttons in één groep delen dezelfde name).",
    },
    {
      id: "t3",
      type: "mc",
      question:
        "Wat geeft typeof terug voor de waarde new Date()?",
      options: ['"date"', '"object"', '"number"'],
      correctIndex: 1,
      explanation:
        'In JavaScript bestaan er minder types dan je zou denken. Een Date is geen apart type: typeof new Date() geeft "object". Enkel string, number, boolean, undefined, object, function, symbol en bigint bestaan.',
    },
    {
      id: "t4",
      type: "open",
      question:
        "Wat is het verschil tussen .indexOf(zoektekst) en .lastIndexOf(zoektekst), en wat geven ze terug als de tekst niet gevonden wordt?",
      answer:
        "indexOf zoekt vanaf het begin (vooraan) van de string en geeft de positie van de eerste treffer; lastIndexOf zoekt vanaf het einde (achteraan) en geeft de positie van de laatste treffer. Beide geven -1 terug als de zoektekst niet voorkomt.",
    },
    {
      id: "t5",
      type: "open",
      question:
        'Waarom gebruik je een <label> met een for-attribuut bij een checkbox, in plaats van gewoon tekst naast de checkbox te zetten?',
      answer:
        "Het for-attribuut koppelt het label aan het input-element (via diens id), wat semantisch correct is én ervoor zorgt dat een klik op het label hetzelfde effect heeft als een klik op de checkbox zelf. De gebruiker hoeft dus niet exact op het kleine aanvinkhokje te mikken.",
    },
    {
      id: "t6",
      type: "mc",
      question:
        'Wat is het resultaat van "vives".split("") ?',
      options: [
        '"vives"',
        "['v', 'i', 'v', 'e', 's']",
        "['vives']",
      ],
      correctIndex: 1,
      explanation:
        "Met een lege string als scheidingsteken splitst split() de string per karakter en geeft het een array van losse karakters terug.",
    },
  ],

  exercises: [
    /* ── 1. invulformulier — HTML-formulier (forms) ─────────────── */
    {
      id: "l16-invulformulier",
      chapterId: "labo16",
      chapter: "JavaScript deel 4: formulieren & strings",
      n: 1,
      of: 7,
      title: "Invulformulier",
      tag: "HTML",
      difficulty: "medium",
      brief:
        "Vul het <code>&lt;form&gt;</code> in <code>index.html</code> aan. Voeg twee tekstvelden toe binnen de <code>&lt;fieldset&gt;</code>: één voor de voornaam (<code>id</code> én <code>name</code> = <code>voornaam</code>) en één voor de familienaam (<code>id</code> én <code>name</code> = <code>familienaam</code>). Geef elk veld een gekoppeld <code>&lt;label&gt;</code> (via <code>for</code>). De cursor moet meteen in het voornaam-veld staan (<code>autofocus</code>) en beide velden zijn verplicht (<code>required</code>). Voeg onderaan een <code>&lt;input type=\"submit\"&gt;</code> met <code>name=\"submit\"</code> toe.",
      hint:
        'Een tekstveld: <input type="text" id="voornaam" name="voornaam" required autofocus>. Het label ervoor: <label for="voornaam">Voornaam:</label>. De for-waarde is gelijk aan de id van het veld.',
      topics: ["form", "label", "for", "name", "required", "autofocus", "submit"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Invulformulier</title>\n</head>\n<body>\n  <form>\n    <fieldset>\n      <legend>Persoonlijke informatie</legend>\n\n      <!-- Voeg hier het voornaam-veld + label toe (autofocus, required) -->\n\n      <!-- Voeg hier het familienaam-veld + label toe (required) -->\n\n    </fieldset>\n\n    <!-- Voeg hier de submit-knop toe (name="submit") -->\n\n  </form>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
        },
        {
          name: "styles/style.css",
          content: "form div {\n  display: block;\n}\n",
        },
      ],
      checks: [
        {
          type: "dom",
          id: "voornaam-veld",
          label: "Er is een tekstveld met id en name 'voornaam'",
          assertions: [
            { selector: "#voornaam", exists: true },
            { selector: "#voornaam", attrEquals: { name: "type", value: "text" } },
            { selector: "#voornaam", attrEquals: { name: "name", value: "voornaam" } },
          ],
        },
        {
          type: "dom",
          id: "autofocus-required",
          label: "Voornaam staat op autofocus en is required",
          assertions: [
            { selector: "#voornaam", attrEquals: { name: "autofocus", value: "" } },
            { selector: "#voornaam", attrEquals: { name: "required", value: "" } },
          ],
        },
        {
          type: "dom",
          id: "familienaam-en-submit",
          label: "Er is een familienaam-veld, een label met for, en een submit-knop",
          assertions: [
            { selector: "#familienaam", attrEquals: { name: "name", value: "familienaam" } },
            { selector: 'label[for="voornaam"]', exists: true },
            { selector: 'input[type="submit"]', attrEquals: { name: "name", value: "submit" } },
          ],
        },
      ],
      solution: {
        "index.html":
          '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Invulformulier</title>\n</head>\n<body>\n  <form>\n    <fieldset>\n      <legend>Persoonlijke informatie</legend>\n\n      <div>\n        <label for="voornaam">Voornaam:</label>\n        <input type="text" id="voornaam" name="voornaam" required autofocus>\n      </div>\n\n      <div>\n        <label for="familienaam">Familienaam:</label>\n        <input type="text" id="familienaam" name="familienaam" required>\n      </div>\n\n    </fieldset>\n\n    <input type="submit" value="Verstuur" name="submit">\n\n  </form>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
      },
    },

    /* ── 2. typeof — strings/types op de console ─────────────────── */
    {
      id: "l16-typeof",
      chapterId: "labo16",
      chapter: "JavaScript deel 4: formulieren & strings",
      n: 2,
      of: 7,
      title: "typeof",
      tag: "JS",
      difficulty: "easy",
      brief:
        "Log in <code>scripts/code.js</code> (binnen <code>setup</code>) met <code>typeof</code> het type van vier waarden, elk op een eigen regel met <code>console.log</code>. Log in deze volgorde het type van <code>34</code>, van <code>0.12</code>, van <code>true</code> en van <code>new Date()</code>.",
      hint:
        'typeof produceert een string zoals "number". Bijvoorbeeld: console.log(typeof 34); logt number. Let op de volgorde van de vier regels.',
      topics: ["typeof", "console.log", "types"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>typeof</title>\n</head>\n<body>\n  <h1>Open de console hieronder</h1>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            "const setup = () => {\n  // log met typeof het type van 34, 0.12, true en new Date()\n};\n\nwindow.addEventListener(\"load\", setup);",
        },
      ],
      checks: [
        {
          type: "console",
          id: "vier-types",
          label: "De vier types staan in de juiste volgorde op de console",
          expected: "number\nnumber\nboolean\nobject",
          match: "equals",
        },
        {
          type: "static",
          id: "gebruikt-typeof",
          label: "Je gebruikt de typeof-operator",
          file: "scripts/code.js",
          must: ["typeof"],
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
          'const setup = () => {\n  console.log(typeof 34);\n  console.log(typeof 0.12);\n  console.log(typeof true);\n  console.log(typeof new Date());\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 3. spaties — split + join, klik-event ──────────────────── */
    {
      id: "l16-spaties",
      chapterId: "labo16",
      chapter: "JavaScript deel 4: formulieren & strings",
      n: 3,
      of: 7,
      title: "Spaties tussen de karakters",
      tag: "JS",
      difficulty: "medium",
      brief:
        'Als er op de knop met id <code>button</code> geklikt wordt, neem dan de tekst uit het veld met id <code>input</code> en toon ze in <code>#output</code> met de karakters door één spatie gescheiden. Bij invoer <code>Dit is een tekst.</code> verschijnt er <code>D i t i s e e n t e k s t .</code> — let op: tussen twee woorden komt slechts één spatie, geen dubbele!',
      hint:
        'Splits met .split("") in losse karakters en plak terug aaneen met .join(" "). De spatie uit de input wordt dan omringd door spaties (drie op een rij) — verwijder die met .replaceAll("   ", " "). Wire de knop in setup met addEventListener("click", …).',
      topics: ["split", "join", "replaceAll", "addEventListener", "value", "textContent"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Spaties</title>\n</head>\n<body>\n  <input id="input" type="text" placeholder="woord">\n  <button id="button">voer uit</button>\n  <p id="output"></p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  const knop = document.getElementById("button");\n  // luister naar "click" en toon de gesplitste tekst in #output\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "dom",
          id: "zin-met-spaties",
          label: 'Na invoer + klik toont #output "D i t i s e e n t e k s t ."',
          before: [
            { action: "input", selector: "#input", value: "Dit is een tekst." },
            { action: "click", selector: "#button", times: 1 },
          ],
          assertions: [{ selector: "#output", textEquals: "D i t i s e e n t e k s t ." }],
        },
        {
          type: "dom",
          id: "een-woord",
          label: 'Eén woord "hallo" wordt "h a l l o"',
          before: [
            { action: "input", selector: "#input", value: "hallo" },
            { action: "click", selector: "#button", times: 1 },
          ],
          assertions: [{ selector: "#output", textEquals: "h a l l o" }],
        },
        {
          type: "static",
          id: "split-join",
          label: "Je gebruikt split en join",
          file: "scripts/code.js",
          must: ["split", "join"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const knop = document.getElementById("button");\n  knop.addEventListener("click", () => {\n    const tekst = document.getElementById("input").value;\n    const gesplitst = tekst.split("").join(" ").replaceAll("   ", " ");\n    document.getElementById("output").textContent = gesplitst;\n  });\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 4. maakMetSpaties — herbruikbare functie ───────────────── */
    {
      id: "l16-maak-met-spaties",
      chapterId: "labo16",
      chapter: "JavaScript deel 4: formulieren & strings",
      n: 4,
      of: 7,
      title: "Functie maakMetSpaties",
      tag: "JS",
      difficulty: "medium",
      brief:
        'Herwerk de vorige oefening met een aparte functie. Schrijf een arrow function <code>maakMetSpaties(inputText)</code> die de string met enkele spaties tussen de karakters <code>return</code>t (geen dubbele spaties tussen woorden). Roep die functie aan bij een klik op <code>#button</code> en zet het resultaat in <code>#output</code>.',
      hint:
        'const maakMetSpaties = (inputText) => inputText.split("").join(" ").replaceAll("   ", " "); — roep ze in de klik-handler op met de waarde van het inputveld en zet de return value in #output.',
      topics: ["functions", "return", "arrow", "split", "join", "addEventListener"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>maakMetSpaties</title>\n</head>\n<body>\n  <input id="input" type="text" placeholder="woord">\n  <button id="button">voer uit</button>\n  <p id="output" style="font-family: monospace"></p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const maakMetSpaties = (inputText) => {\n  // bouw en return de string met enkele spaties tussen de karakters\n};\n\nconst setup = () => {\n  const knop = document.getElementById("button");\n  // luister naar "click", roep maakMetSpaties aan en toon het in #output\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "dom",
          id: "functie-output",
          label: 'Na invoer + klik toont #output "D i t i s e e n t e k s t ."',
          before: [
            { action: "input", selector: "#input", value: "Dit is een tekst." },
            { action: "click", selector: "#button", times: 1 },
          ],
          assertions: [{ selector: "#output", textEquals: "D i t i s e e n t e k s t ." }],
        },
        {
          type: "static",
          id: "naam-functie",
          label: "Je definieert een functie maakMetSpaties",
          file: "scripts/code.js",
          must: ["maakMetSpaties"],
        },
        {
          type: "static",
          id: "arrow-en-return",
          label: "Je gebruikt een arrow function (geen var)",
          file: "scripts/code.js",
          must: ["/=>/"],
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const maakMetSpaties = (inputText) => {\n  return inputText.split("").join(" ").replaceAll("   ", " ");\n};\n\nconst setup = () => {\n  const knop = document.getElementById("button");\n  knop.addEventListener("click", () => {\n    const tekst = document.getElementById("input").value;\n    document.getElementById("output").textContent = maakMetSpaties(tekst);\n  });\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 5. Man van An — indexOf tellen ─────────────────────────── */
    {
      id: "l16-man-van-an",
      chapterId: "labo16",
      chapter: "JavaScript deel 4: formulieren & strings",
      n: 5,
      of: 7,
      title: "De man van An",
      tag: "JS",
      difficulty: "medium",
      brief:
        'Tel met <code>indexOf</code> hoe vaak de reeks <code>an</code> voorkomt in de tekst van het element met id <code>gegeven</code> (hoofdletterongevoelig). Zet het resultaat in <code>#aantal</code> als de zin <code>an komt 7 keer voor</code> en log dezelfde zin ook naar de console.',
      hint:
        'Lees de tekst met document.getElementById("gegeven").textContent en zet ze om met .toLowerCase(). Start met indexOf("an"); zolang dat groter is dan -1: tel +1 op en zoek verder met indexOf("an", positie + 1). Bouw de zin met een template literal: `an komt ${aantal} keer voor`.',
      topics: ["indexOf", "toLowerCase", "while", "template literals", "textContent"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>De man van An</title>\n</head>\n<body>\n  <h1 id="gegeven">De man van An geeft geen hand aan ambetante verwanten.</h1>\n  <p id="aantal"></p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  const tekst = document.getElementById("gegeven").textContent.toLowerCase();\n  // tel met indexOf hoe vaak "an" voorkomt\n  // zet de zin in #aantal en log ze ook naar de console\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "dom",
          id: "aantal-op-pagina",
          label: 'In #aantal staat "an komt 7 keer voor"',
          assertions: [{ selector: "#aantal", textEquals: "an komt 7 keer voor" }],
        },
        {
          type: "console",
          id: "aantal-console",
          label: 'Je logt "an komt 7 keer voor"',
          expected: "an komt 7 keer voor",
          match: "includes",
        },
        {
          type: "static",
          id: "gebruikt-indexof",
          label: "Je gebruikt indexOf",
          file: "scripts/code.js",
          must: ["indexOf"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const tekst = document.getElementById("gegeven").textContent.toLowerCase();\n  const teZoeken = "an";\n\n  let aantal = 0;\n  let positie = tekst.indexOf(teZoeken);\n  while (positie > -1) {\n    aantal = aantal + 1;\n    positie = tekst.indexOf(teZoeken, positie + 1);\n  }\n\n  const zin = `an komt ${aantal} keer voor`;\n  document.getElementById("aantal").textContent = zin;\n  console.log(zin);\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 6. (zelf) gebruikersnaam uit e-mail — substring ────────── */
    {
      id: "l16-gebruikersnaam",
      chapterId: "labo16",
      chapter: "JavaScript deel 4: formulieren & strings",
      n: 6,
      of: 7,
      title: "Gebruikersnaam uit e-mailadres",
      tag: "JS",
      difficulty: "medium",
      brief:
        'Bij een klik op <code>#knop</code> lees je het e-mailadres uit <code>#email</code> en toon je in <code>#naam</code> enkel het stuk vóór de <code>@</code>. Bij <code>jan.peeters@vives.be</code> verschijnt dus <code>jan.peeters</code>.',
      hint:
        'Zoek de positie van "@" met .indexOf("@"). Knip dan het begin af met .substring(0, positie). Onthoud dat de eindindex gelezen wordt als "tot" (niet "tot en met"), dus het @-teken zit er niet bij.',
      topics: ["indexOf", "substring", "value", "addEventListener", "textContent"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Gebruikersnaam</title>\n</head>\n<body>\n  <label for="email">E-mailadres:</label>\n  <input id="email" type="email" placeholder="naam@domein.be">\n  <button id="knop">Toon naam</button>\n  <p id="naam"></p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  const knop = document.getElementById("knop");\n  // luister naar "click", knip het stuk voor de @ uit het e-mailadres en toon het in #naam\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "dom",
          id: "naam-uit-mail",
          label: 'jan.peeters@vives.be wordt "jan.peeters"',
          before: [
            { action: "input", selector: "#email", value: "jan.peeters@vives.be" },
            { action: "click", selector: "#knop", times: 1 },
          ],
          assertions: [{ selector: "#naam", textEquals: "jan.peeters" }],
        },
        {
          type: "dom",
          id: "naam-uit-mail-2",
          label: 'info@example.com wordt "info"',
          before: [
            { action: "input", selector: "#email", value: "info@example.com" },
            { action: "click", selector: "#knop", times: 1 },
          ],
          assertions: [{ selector: "#naam", textEquals: "info" }],
        },
        {
          type: "static",
          id: "substring-indexof",
          label: "Je gebruikt indexOf en substring",
          file: "scripts/code.js",
          must: ["indexOf", "substring"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const knop = document.getElementById("knop");\n  knop.addEventListener("click", () => {\n    const email = document.getElementById("email").value;\n    const positie = email.indexOf("@");\n    const naam = email.substring(0, positie);\n    document.getElementById("naam").textContent = naam;\n  });\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 7. (zelf) SCHREEUW — toUpperCase + trim ────────────────── */
    {
      id: "l16-schreeuw",
      chapterId: "labo16",
      chapter: "JavaScript deel 4: formulieren & strings",
      n: 7,
      of: 7,
      title: "SCHREEUW de tekst",
      tag: "JS",
      difficulty: "easy",
      brief:
        'Bij een klik op <code>#knop</code> lees je de tekst uit <code>#bericht</code>, verwijder je de witruimte vooraan en achteraan, zet je alles in HOOFDLETTERS, en toon je het resultaat in <code>#luid</code>. Bij invoer <code>   hallo daar   </code> verschijnt <code>HALLO DAAR</code>.',
      hint:
        "Combineer twee string-methods: .trim() verwijdert de witruimte aan begin en einde, .toUpperCase() maakt er hoofdletters van. Je mag ze aan elkaar ketenen: tekst.trim().toUpperCase().",
      topics: ["trim", "toUpperCase", "value", "addEventListener", "textContent"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Schreeuw</title>\n</head>\n<body>\n  <label for="bericht">Je bericht:</label>\n  <input id="bericht" type="text">\n  <button id="knop">SCHREEUW</button>\n  <p id="luid"></p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  const knop = document.getElementById("knop");\n  // luister naar "click", trim de tekst, maak ze hoofdletters en toon ze in #luid\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "dom",
          id: "schreeuw-trim",
          label: '"   hallo daar   " wordt "HALLO DAAR"',
          before: [
            { action: "input", selector: "#bericht", value: "   hallo daar   " },
            { action: "click", selector: "#knop", times: 1 },
          ],
          assertions: [{ selector: "#luid", textEquals: "HALLO DAAR" }],
        },
        {
          type: "static",
          id: "trim-upper",
          label: "Je gebruikt trim en toUpperCase",
          file: "scripts/code.js",
          must: ["trim", "toUpperCase"],
        },
        {
          type: "static",
          id: "geen-var-7",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const knop = document.getElementById("knop");\n  knop.addEventListener("click", () => {\n    const tekst = document.getElementById("bericht").value;\n    document.getElementById("luid").textContent = tekst.trim().toUpperCase();\n  });\n};\n\nwindow.addEventListener("load", setup);',
      },
    },
  ],
};
