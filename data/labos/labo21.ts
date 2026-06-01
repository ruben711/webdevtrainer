import type { ChapterContent } from "@/lib/types";

/* ════════════════════════════════════════════════════════════════════
   Labo 21 — Storage (Web Storage API + JSON)

   Belangrijk over de runner-sandbox: de grading-iframe draait met
   sandbox="allow-scripts" ZONDER allow-same-origin. Daardoor gooit
   localStorage/sessionStorage daar een SecurityError. Alle oefeningen
   wikkelen storage-toegang dus in try/catch (zodat de SecurityError de
   rest van het script niet breekt) en de checks kijken naar zichtbaar
   DOM-gedrag of console-output BINNEN één run — nooit naar echte
   persistentie tussen herladingen.
   ════════════════════════════════════════════════════════════════════ */

export const labo21: ChapterContent = {
  chapter: {
    id: "labo21",
    n: "21",
    title: "Storage",
    desc: "Bewaar data in de browser met de Web Storage API en JSON.",
    tag: "JS",
    difficulty: "medium",
  },

  theory: [
    {
      id: "t1",
      type: "mc",
      question:
        "Je hebt een waarde opgeslagen met localStorage. Wanneer is die waarde later nog beschikbaar?",
      options: [
        "Enkel zolang het tabblad open blijft; bij sluiten verdwijnt ze.",
        "Ook na het herladen van de pagina én na het volledig afsluiten en heropenen van de browser.",
        "Enkel binnen dezelfde functie waarin je ze opsloeg.",
      ],
      correctIndex: 1,
      explanation:
        "localStorage heeft geen vervaldatum: de data blijft per domein bewaard, ook na het sluiten van de browser. sessionStorage daarentegen verdwijnt zodra je het tabblad of de browser sluit.",
    },
    {
      id: "t2",
      type: "mc",
      question:
        "Wat is het belangrijkste verschil tussen sessionStorage en localStorage?",
      options: [
        "sessionStorage kan getallen bewaren, localStorage enkel strings.",
        "sessionStorage wordt naar de server gestuurd, localStorage niet.",
        "sessionStorage blijft enkel bestaan zolang de browsersessie (het tabblad) actief is; localStorage blijft ook na het sluiten van de browser.",
      ],
      correctIndex: 2,
      explanation:
        "Beide bewaren string key/value-paren per domein. Het verschil zit in de levensduur: sessionStorage is gebonden aan het tabblad/de sessie, localStorage overleeft een herstart van de browser.",
    },
    {
      id: "t3",
      type: "mc",
      question:
        "Welk type waarden kan je rechtstreeks in de Web Storage (localStorage/sessionStorage) bewaren?",
      options: [
        "Enkel strings (tekst).",
        "Strings, objecten en arrays, elk in hun eigen vorm.",
        "Enkel getallen.",
      ],
      correctIndex: 0,
      explanation:
        "Web Storage bewaart enkel strings. Wil je een object of array bewaren, dan zet je het eerst om naar een JSON-string met JSON.stringify(), en bij het uitlezen terug om met JSON.parse().",
    },
    {
      id: "t4",
      type: "open",
      question:
        "Je wil een JavaScript-object (bv. instellingen van een gebruiker) bewaren in localStorage en het later weer inlezen. Welke twee JSON-functies gebruik je daarvoor, en in welke volgorde?",
      answer:
        "Bij het bewaren gebruik je JSON.stringify(object) om het object naar een string om te zetten, en je geeft die string aan localStorage.setItem(sleutel, string). Bij het inlezen haal je de string op met localStorage.getItem(sleutel) en zet je ze terug om naar een object met JSON.parse(string).",
    },
    {
      id: "t5",
      type: "open",
      question:
        "Waarom is het verstandig om een unieke sleutel te gebruiken, bv. \"VIVES.be.instellingen\" in plaats van gewoon \"data\"?",
      answer:
        "Web Storage is afgebakend per domein, maar onthoudt niet bij welke pagina of applicatie een sleutel hoort. Met een te algemene sleutel zoals \"data\" riskeer je dat een andere pagina op hetzelfde domein dezelfde sleutel gebruikt en jouw waarde overschrijft of leest. Een unieke sleutel (bv. domein + naam van de applicatie) vermijdt zulke conflicten.",
    },
    {
      id: "t6",
      type: "mc",
      question:
        "Met welke method verwijder je één specifiek item uit localStorage zonder de rest te wissen?",
      options: ["localStorage.clear()", "localStorage.removeItem(sleutel)", "localStorage.delete(sleutel)"],
      correctIndex: 1,
      explanation:
        "removeItem(sleutel) verwijdert net dat ene item. clear() wist álle items voor dit domein. Een method delete() bestaat niet op localStorage.",
    },
  ],

  exercises: [
    /* ── 1. eerste kennismaking met setItem (function-check) ─────────── */
    {
      id: "l21-bewaar-functie",
      chapterId: "labo21",
      chapter: "Storage",
      n: 1,
      of: 6,
      title: "Bewaar een waarde",
      tag: "JS",
      difficulty: "easy",
      brief:
        "Maak kennis met de Web Storage API. Schrijf een <code>arrow function</code> <code>bewaar(sleutel, waarde)</code> die de waarde wegschrijft naar <code>localStorage</code> met <code>localStorage.setItem(sleutel, waarde)</code> en daarna de <code>waarde</code> terug<code>return</code>t.<br><br>In een echte browser blijft die waarde bewaard, zelfs na het herladen. Hier draait je code echter in een afgeschermde omgeving waar <code>localStorage</code> een fout kan gooien — wikkel de <code>setItem</code>-oproep daarom in een <code>try/catch</code> zodat het vervolg niet breekt.<br><br>Roep onderaan <code>bewaar(\"taal\", \"nl\")</code> aan en log het resultaat met <code>console.log</code> (er moet exact <code>nl</code> in de console verschijnen).",
      hint:
        'const bewaar = (sleutel, waarde) => { try { localStorage.setItem(sleutel, waarde); } catch (e) {} return waarde; };  — daarna: console.log(bewaar("taal", "nl")); De try/catch vangt de SecurityError op zodat de return altijd werkt.',
      topics: ["localStorage", "setItem", "try/catch", "arrow", "return", "console.log"],
      examples: [{ label: "Console", output: "nl" }],
      files: [
        {
          name: "scripts/code.js",
          content:
            '// 1. schrijf de arrow function bewaar(sleutel, waarde):\n//    - probeer localStorage.setItem(sleutel, waarde) binnen try/catch\n//    - geef daarna de waarde terug met return\n// 2. log onderaan het resultaat van bewaar("taal", "nl")\n',
        },
      ],
      checks: [
        {
          type: "console",
          id: "logt-waarde",
          label: 'bewaar geeft de waarde terug ("nl" in de console)',
          expected: "nl",
          match: "equals",
        },
        {
          type: "static",
          id: "gebruikt-setitem",
          label: "Je gebruikt localStorage.setItem",
          file: "scripts/code.js",
          must: ["localStorage", "setItem"],
        },
        {
          type: "static",
          id: "gebruikt-trycatch",
          label: "Je gebruikt try/catch en geen var",
          file: "scripts/code.js",
          must: ["try", "catch"],
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const bewaar = (sleutel, waarde) => {\n  try {\n    localStorage.setItem(sleutel, waarde);\n  } catch (e) {\n    // localStorage is hier niet beschikbaar; we negeren de fout\n  }\n  return waarde;\n};\n\nconsole.log(bewaar("taal", "nl"));',
      },
    },

    /* ── 2. teller met sessionStorage, getoond in de DOM ─────────────── */
    {
      id: "l21-teller-storage",
      chapterId: "labo21",
      chapter: "Storage",
      n: 2,
      of: 6,
      title: "Tel-knop met storage",
      tag: "JS",
      difficulty: "medium",
      brief:
        "Maak een tel-knop die zijn stand onthoudt via <code>sessionStorage</code>. In <code>scripts/code.js</code>, binnen <code>setup</code>, voeg een klik-listener toe aan de knop <code>#btnVerhoog</code> die <code>verhoog</code> oproept. Bij elke klik verhoog je de globale teller met 1 en toon je <code>De waarde van de teller is X</code> in <code>#txtResult</code>.<br><br>Schrijf de teller na elke klik ook weg naar <code>sessionStorage</code> onder de sleutel <code>demo.clickCount</code>. Omdat <code>sessionStorage</code> in deze omgeving een fout kan gooien, wikkel je die <code>setItem</code>-oproep in een <code>try/catch</code>. De zichtbare stand komt uit de meegegeven globale variabele <code>teller</code>, zodat het tellen altijd werkt.",
      hint:
        'In setup: btnVerhoog.addEventListener("click", verhoog);  In verhoog: teller = teller + 1; txtResult.innerHTML = "De waarde van de teller is " + teller; en daarna try { sessionStorage.setItem("demo.clickCount", teller.toString()); } catch (e) {} — teller staat al als globale variabele bovenaan klaar.',
      topics: ["sessionStorage", "setItem", "try/catch", "addEventListener", "globale variabele"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Tel-knop met storage</title>\n</head>\n<body>\n  <p><input type="button" id="btnVerhoog" value="Verhoog"></p>\n  <p>Klik op de knop om de teller te verhogen.</p>\n  <p id="txtResult">(nog niet geklikt)</p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'let teller = 0; // globale variabele die de stand onthoudt binnen deze pagina\n\nconst setup = () => {\n  const btnVerhoog = document.getElementById("btnVerhoog");\n  // voeg hier een "click"-listener toe die verhoog() oproept\n};\n\nconst verhoog = () => {\n  const txtResult = document.getElementById("txtResult");\n  // 1. verhoog de globale teller met 1\n  // 2. toon "De waarde van de teller is " + teller in #txtResult\n  // 3. schrijf teller weg naar sessionStorage (binnen try/catch)\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "static",
          id: "ael",
          label: "Je gebruikt addEventListener",
          file: "scripts/code.js",
          must: ["addEventListener"],
        },
        {
          type: "static",
          id: "sessionstorage",
          label: "Je gebruikt sessionStorage",
          file: "scripts/code.js",
          must: ["sessionStorage"],
        },
        {
          type: "dom",
          id: "een-klik",
          label: 'Na één klik staat er "De waarde van de teller is 1"',
          before: [{ action: "click", selector: "#btnVerhoog", times: 1 }],
          assertions: [{ selector: "#txtResult", textEquals: "De waarde van de teller is 1" }],
        },
        {
          type: "dom",
          id: "drie-klikken",
          label: 'Na drie klikken staat er "De waarde van de teller is 3"',
          before: [{ action: "click", selector: "#btnVerhoog", times: 3 }],
          assertions: [{ selector: "#txtResult", textEquals: "De waarde van de teller is 3" }],
        },
      ],
      solution: {
        "scripts/code.js":
          'let teller = 0; // globale variabele die de stand onthoudt binnen deze pagina\n\nconst setup = () => {\n  const btnVerhoog = document.getElementById("btnVerhoog");\n  btnVerhoog.addEventListener("click", verhoog);\n};\n\nconst verhoog = () => {\n  const txtResult = document.getElementById("txtResult");\n  teller = teller + 1;\n  txtResult.innerHTML = "De waarde van de teller is " + teller;\n  try {\n    sessionStorage.setItem("demo.clickCount", teller.toString());\n  } catch (e) {\n    // sessionStorage niet beschikbaar in deze omgeving\n  }\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 3. object -> JSON-string (console) ──────────────────────────── */
    {
      id: "l21-object-naar-json",
      chapterId: "labo21",
      chapter: "Storage",
      n: 3,
      of: 6,
      title: "Object naar JSON-string",
      tag: "JS",
      difficulty: "medium",
      brief:
        "Web Storage bewaart enkel strings, dus een object zet je eerst om naar JSON. Maak in <code>scripts/code.js</code> een object <code>persoon</code> met <code>naam: \"John\"</code>, <code>leeftijd: 25</code> en <code>stad: \"Kortrijk\"</code>. Zet het met <code>JSON.stringify</code> om naar een string en log die string met <code>console.log</code>.",
      hint:
        'const persoon = { naam: "John", leeftijd: 25, stad: "Kortrijk" }; const json = JSON.stringify(persoon); console.log(json);  — de volgorde van de sleutels in de JSON volgt de volgorde waarin je ze schreef.',
      topics: ["JSON.stringify", "objecten", "console.log", "Web Storage"],
      examples: [
        { label: "Console", output: '{"naam":"John","leeftijd":25,"stad":"Kortrijk"}' },
      ],
      files: [
        {
          name: "scripts/code.js",
          content:
            '// 1. maak een object persoon met naam, leeftijd en stad\n// 2. zet het om naar een JSON-string met JSON.stringify\n// 3. log die string met console.log\n',
        },
      ],
      checks: [
        {
          type: "console",
          id: "json-output",
          label: "Je logt de correcte JSON-string",
          expected: '{"naam":"John","leeftijd":25,"stad":"Kortrijk"}',
          match: "equals",
        },
        {
          type: "static",
          id: "stringify",
          label: "Je gebruikt JSON.stringify",
          file: "scripts/code.js",
          must: ["JSON.stringify"],
        },
        {
          type: "static",
          id: "geen-var-3",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const persoon = {\n  naam: "John",\n  leeftijd: 25,\n  stad: "Kortrijk",\n};\n\nconst json = JSON.stringify(persoon);\nconsole.log(json);',
      },
    },

    /* ── 4. JSON-string -> object, lees property (function) ──────────── */
    {
      id: "l21-json-lezen",
      chapterId: "labo21",
      chapter: "Storage",
      n: 4,
      of: 6,
      title: "Lees uit een JSON-string",
      tag: "JS",
      difficulty: "medium",
      brief:
        "Wanneer je een JSON-string uit <code>localStorage</code> haalt, moet je ze eerst terug omzetten naar een object. De variabele <code>opgehaald</code> bevat een JSON-string (alsof ze net uit <code>localStorage</code> kwam). Zet ze met <code>JSON.parse</code> om naar een object en log met <code>console.log</code> de waarde van de property <code>stad</code> (er moet exact <code>Kortrijk</code> verschijnen).",
      hint:
        'const obj = JSON.parse(opgehaald); console.log(obj.stad); — JSON.parse maakt van de string terug een gewoon JavaScript-object waar je .stad van kan lezen.',
      topics: ["JSON.parse", "objecten", "console.log", "localStorage"],
      examples: [{ label: "Console", output: "Kortrijk" }],
      files: [
        {
          name: "scripts/code.js",
          content:
            'const opgehaald = \'{"naam":"John","leeftijd":25,"stad":"Kortrijk"}\';\n\n// 1. zet de JSON-string om naar een object met JSON.parse\n// 2. log de property stad met console.log\n',
        },
      ],
      checks: [
        {
          type: "console",
          id: "logt-stad",
          label: 'Je logt de juiste stad ("Kortrijk")',
          expected: "Kortrijk",
          match: "equals",
        },
        {
          type: "static",
          id: "parse",
          label: "Je gebruikt JSON.parse",
          file: "scripts/code.js",
          must: ["JSON.parse"],
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
          'const opgehaald = \'{"naam":"John","leeftijd":25,"stad":"Kortrijk"}\';\n\nconst persoon = JSON.parse(opgehaald);\nconsole.log(persoon.stad);',
      },
    },

    /* ── 5. instellingen-formulier: opslaan + tonen (dom) ────────────── */
    {
      id: "l21-instellingen-formulier",
      chapterId: "labo21",
      chapter: "Storage",
      n: 5,
      of: 6,
      title: "Instellingen bewaren en tonen",
      tag: "JS",
      difficulty: "hard",
      brief:
        'Bouw een mini-instellingenscherm zoals de "demo storage JSON". Bij een klik op <code>#btnSave</code> bouw je een object uit de velden <code>#txtAge</code> en <code>#txtBudget</code> (gebruik <code>parseInt</code>), zet je het om met <code>JSON.stringify</code> en bewaar je die JSON-string. Bij een klik op <code>#btnShow</code> lees je de JSON terug met <code>JSON.parse</code> en toon je de waarden als tekst in <code>#uitvoer</code>, in de vorm <code>Leeftijd: 40 — Budget: 55</code>.<br><br>In een echte browser zou je dit in <code>localStorage</code> zetten (sleutel <code>VIVES.be.settings</code>) zodat het een herlaadbeurt overleeft. Schrijf die <code>localStorage</code>-oproep ook (binnen <code>try/catch</code>), maar hou de laatst bewaarde JSON-string óók bij in de meegegeven globale variabele <code>global.settingsJSON</code>, zodat "Toon data" hier altijd werkt.',
      hint:
        'In saveSettings: const settings = { age: parseInt(document.getElementById("txtAge").value), budget: parseInt(document.getElementById("txtBudget").value) }; global.settingsJSON = JSON.stringify(settings); try { localStorage.setItem("VIVES.be.settings", global.settingsJSON); } catch (e) {}.  In showSettings: const settings = JSON.parse(global.settingsJSON); document.getElementById("uitvoer").textContent = "Leeftijd: " + settings.age + " — Budget: " + settings.budget;',
      topics: ["JSON.stringify", "JSON.parse", "localStorage", "try/catch", "addEventListener", "globale variabele"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Instellingen</title>\n</head>\n<body>\n  <form>\n    <label for="txtAge">Leeftijd</label>\n    <input id="txtAge" type="number">\n    <label for="txtBudget">Dagelijks budget</label>\n    <input id="txtBudget" type="number">\n    <input type="button" id="btnSave" value="Opslaan">\n    <input type="button" id="btnShow" value="Toon data">\n  </form>\n  <p id="uitvoer">(nog niets getoond)</p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const global = {\n  settingsJSON: "{\\"age\\":0,\\"budget\\":0}",\n};\n\nconst setup = () => {\n  document.getElementById("btnSave").addEventListener("click", saveSettings);\n  document.getElementById("btnShow").addEventListener("click", showSettings);\n};\n\nconst saveSettings = () => {\n  // 1. bouw een object settings uit #txtAge en #txtBudget (gebruik parseInt)\n  // 2. zet het om naar JSON en bewaar het in global.settingsJSON\n  // 3. probeer het ook in localStorage te zetten (binnen try/catch)\n};\n\nconst showSettings = () => {\n  // 1. zet global.settingsJSON terug om naar een object met JSON.parse\n  // 2. toon "Leeftijd: X — Budget: Y" in #uitvoer\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "static",
          id: "stringify-parse",
          label: "Je gebruikt JSON.stringify én JSON.parse",
          file: "scripts/code.js",
          must: ["JSON.stringify", "JSON.parse"],
        },
        {
          type: "static",
          id: "localstorage-5",
          label: "Je gebruikt localStorage",
          file: "scripts/code.js",
          must: ["localStorage"],
        },
        {
          type: "dom",
          id: "roundtrip",
          label: 'Opslaan en daarna tonen toont "Leeftijd: 40 — Budget: 55"',
          before: [
            { action: "input", selector: "#txtAge", value: "40" },
            { action: "input", selector: "#txtBudget", value: "55" },
            { action: "click", selector: "#btnSave", times: 1 },
            { action: "click", selector: "#btnShow", times: 1 },
          ],
          assertions: [{ selector: "#uitvoer", textEquals: "Leeftijd: 40 — Budget: 55" }],
        },
        {
          type: "dom",
          id: "roundtrip-2",
          label: "Met andere waarden toont het scherm die andere waarden",
          before: [
            { action: "input", selector: "#txtAge", value: "18" },
            { action: "input", selector: "#txtBudget", value: "5" },
            { action: "click", selector: "#btnSave", times: 1 },
            { action: "click", selector: "#btnShow", times: 1 },
          ],
          assertions: [{ selector: "#uitvoer", textIncludes: "Budget: 5" }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const global = {\n  settingsJSON: "{\\"age\\":0,\\"budget\\":0}",\n};\n\nconst setup = () => {\n  document.getElementById("btnSave").addEventListener("click", saveSettings);\n  document.getElementById("btnShow").addEventListener("click", showSettings);\n};\n\nconst saveSettings = () => {\n  const settings = {\n    age: parseInt(document.getElementById("txtAge").value),\n    budget: parseInt(document.getElementById("txtBudget").value),\n  };\n  global.settingsJSON = JSON.stringify(settings);\n  try {\n    localStorage.setItem("VIVES.be.settings", global.settingsJSON);\n  } catch (e) {\n    // localStorage niet beschikbaar\n  }\n};\n\nconst showSettings = () => {\n  let json = global.settingsJSON;\n  try {\n    const opgeslagen = localStorage.getItem("VIVES.be.settings");\n    if (opgeslagen !== null) {\n      json = opgeslagen;\n    }\n  } catch (e) {\n    // localStorage niet beschikbaar\n  }\n  const settings = JSON.parse(json);\n  document.getElementById("uitvoer").textContent =\n    "Leeftijd: " + settings.age + " \\u2014 Budget: " + settings.budget;\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 6. ColorPicker Pro: swatch bewaren (dom + css) ──────────────── */
    {
      id: "l21-colorpicker-bewaar",
      chapterId: "labo21",
      chapter: "Storage",
      n: 6,
      of: 6,
      title: "ColorPicker Pro: kleuren bewaren",
      tag: "JS",
      difficulty: "hard",
      brief:
        "Werk verder op de ColorPicker. De sliders en het voorbeeld-staal (<code>#swatch</code>) zijn al gekoppeld in <code>update</code>. Vul twee dingen aan in <code>scripts/code.js</code>:<br>1. In <code>saveSwatch</code> (de <code>Save</code>-knop): voeg de huidige kleur als nieuw staal toe via de gegeven functie <code>voegSwatchToe(global.huidigeKleur)</code>, voeg de kleur toe aan de array <code>global.kleuren</code> en bewaar die array als JSON in <code>localStorage</code> (sleutel <code>kleuren</code>, binnen <code>try/catch</code>).<br>2. Zorg dat de listener op de <code>Save</code>-knop in <code>setup</code> staat.<br><br>De favorieten zouden zo bewaard blijven na het herladen; hier controleren we dat een klik op <code>Save</code> een nieuw staal toevoegt aan <code>#swatchComponents</code>.",
      hint:
        'In setup: document.getElementById("btnSave").addEventListener("click", saveSwatch);  In saveSwatch: voegSwatchToe(global.huidigeKleur); global.kleuren.push(global.huidigeKleur); try { localStorage.setItem("kleuren", JSON.stringify(global.kleuren)); } catch (e) {}.  De swatches komen in #swatchComponents terecht via de gegeven voegSwatchToe.',
      topics: ["localStorage", "JSON.stringify", "arrays", "addEventListener", "createElement", "globale variabele"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>ColorPicker Pro</title>\n</head>\n<body>\n  <div class="colorPicker">\n    <div class="components">\n      <div class="component">\n        <span>0<input type="range" id="sldRed" class="slider" value="128" min="0" max="255">255</span>\n        <span>Red</span>\n        <span id="lblRed">0</span>\n      </div>\n      <div class="component">\n        <span>0<input type="range" id="sldGreen" class="slider" value="128" min="0" max="255">255</span>\n        <span>Green</span>\n        <span id="lblGreen">0</span>\n      </div>\n      <div class="component">\n        <span>0<input type="range" id="sldBlue" class="slider" value="128" min="0" max="255">255</span>\n        <span>Blue</span>\n        <span id="lblBlue">0</span>\n      </div>\n    </div>\n    <div class="swatch rounded" id="swatch"></div>\n    <input type="button" id="btnSave" value="Save">\n  </div>\n  <div id="swatchComponents"></div>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "styles/style.css",
          content:
            ".slider {\n  vertical-align: middle;\n}\n.component span:nth-of-type(2) {\n  display: inline-block;\n  width: 3em;\n  text-align: right;\n}\n.components {\n  display: inline-block;\n  height: 100%;\n}\n.colorPicker {\n  display: inline-block;\n  border: solid 5px lightgrey;\n  border-radius: 10px;\n  margin-bottom: 20px;\n}\n.swatch {\n  display: inline-block;\n  border: solid 1px black;\n  margin: 0 0 0 1em;\n  height: 4em;\n  width: 5em;\n}\n.swatch.rounded {\n  border-radius: 5px;\n}\n.swatch > input {\n  float: right;\n}",
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const global = {\n  huidigeKleur: "rgb(128, 128, 128)",\n  kleuren: [],\n};\n\nconst setup = () => {\n  document.querySelectorAll(".slider").forEach((slider) => {\n    slider.addEventListener("input", update);\n  });\n\n  // voeg hier de klik-listener voor de Save-knop (#btnSave -> saveSwatch) toe\n\n  update();\n};\n\nconst saveSwatch = () => {\n  // 1. voeg de huidige kleur als staal toe: voegSwatchToe(global.huidigeKleur)\n  // 2. push global.huidigeKleur in de array global.kleuren\n  // 3. bewaar global.kleuren als JSON in localStorage (sleutel "kleuren"), binnen try/catch\n};\n\nconst voegSwatchToe = (kleur) => {\n  const swatch = document.createElement("div");\n  swatch.className = "swatch";\n  swatch.style.background = kleur;\n  document.getElementById("swatchComponents").appendChild(swatch);\n};\n\nconst update = () => {\n  const red = document.getElementById("sldRed").value;\n  const green = document.getElementById("sldGreen").value;\n  const blue = document.getElementById("sldBlue").value;\n\n  document.getElementById("lblRed").innerHTML = red;\n  document.getElementById("lblGreen").innerHTML = green;\n  document.getElementById("lblBlue").innerHTML = blue;\n\n  const kleur = `rgb(${red}, ${green}, ${blue})`;\n  document.getElementById("swatch").style.background = kleur;\n  global.huidigeKleur = kleur;\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "static",
          id: "save-listener",
          label: "Je koppelt saveSwatch aan de Save-knop",
          file: "scripts/code.js",
          must: ["saveSwatch", "addEventListener"],
        },
        {
          type: "static",
          id: "storage-json-6",
          label: "Je bewaart de kleuren als JSON in localStorage",
          file: "scripts/code.js",
          must: ["localStorage", "JSON.stringify"],
        },
        {
          type: "css",
          id: "swatch-kleurt",
          label: "Het voorbeeld-staal krijgt de kleur van de sliders",
          before: [
            { action: "input", selector: "#sldRed", value: "200" },
            { action: "input", selector: "#sldGreen", value: "100" },
            { action: "input", selector: "#sldBlue", value: "50" },
          ],
          checks: [
            { selector: "#swatch", property: "background-color", equals: "rgb(200, 100, 50)" },
          ],
        },
        {
          type: "dom",
          id: "save-voegt-staal-toe",
          label: "Een klik op Save voegt een staal toe aan #swatchComponents",
          before: [{ action: "click", selector: "#btnSave", times: 1 }],
          assertions: [{ selector: "#swatchComponents .swatch", count: 1 }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const global = {\n  huidigeKleur: "rgb(128, 128, 128)",\n  kleuren: [],\n};\n\nconst setup = () => {\n  document.querySelectorAll(".slider").forEach((slider) => {\n    slider.addEventListener("input", update);\n  });\n\n  document.getElementById("btnSave").addEventListener("click", saveSwatch);\n\n  update();\n};\n\nconst saveSwatch = () => {\n  voegSwatchToe(global.huidigeKleur);\n  global.kleuren.push(global.huidigeKleur);\n  try {\n    localStorage.setItem("kleuren", JSON.stringify(global.kleuren));\n  } catch (e) {\n    // localStorage niet beschikbaar\n  }\n};\n\nconst voegSwatchToe = (kleur) => {\n  const swatch = document.createElement("div");\n  swatch.className = "swatch";\n  swatch.style.background = kleur;\n  document.getElementById("swatchComponents").appendChild(swatch);\n};\n\nconst update = () => {\n  const red = document.getElementById("sldRed").value;\n  const green = document.getElementById("sldGreen").value;\n  const blue = document.getElementById("sldBlue").value;\n\n  document.getElementById("lblRed").innerHTML = red;\n  document.getElementById("lblGreen").innerHTML = green;\n  document.getElementById("lblBlue").innerHTML = blue;\n\n  const kleur = `rgb(${red}, ${green}, ${blue})`;\n  document.getElementById("swatch").style.background = kleur;\n  global.huidigeKleur = kleur;\n};\n\nwindow.addEventListener("load", setup);',
      },
    },
  ],
};
