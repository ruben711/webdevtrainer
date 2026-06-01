import type { ChapterContent } from "@/lib/types";

/* Labo 20 — JavaScript (deel 8): Date-objecten, eigen objecten,
   object literals en JSON. Cumulatief: gebruikt enkel concepten t/m labo 20
   (DOM, addEventListener, arrays/forEach, setup-conventie, let/const, arrows). */

export const labo20: ChapterContent = {
  chapter: {
    id: "labo20",
    n: "20",
    title: "Objecten, Date & JSON",
    desc: "Werk met Date-objecten, eigen objecten, object literals en JSON (stringify/parse).",
    tag: "JS",
    difficulty: "medium",
  },
  theory: [
    {
      id: "t1",
      type: "mc",
      question:
        "Wat geeft new Date(2025, 0, 1) terug? Let goed op de maand-parameter.",
      options: [
        "1 februari 2025, want maanden tellen vanaf 1",
        "1 januari 2025, want de maand werkt als een index (0 = januari)",
        "Een foutmelding, want 0 is geen geldige maand",
      ],
      correctIndex: 1,
      explanation:
        "De maand-parameter werkt als een index in een array van maanden: 0 = januari, 1 = februari, ... 11 = december. new Date(2025, 0, 1) is dus 1 januari 2025.",
    },
    {
      id: "t2",
      type: "mc",
      question:
        "Hoe maak je een object literal met twee properties voornaam en leeftijd?",
      options: [
        'let p = { voornaam = "An"; leeftijd = 20; };',
        'let p = ( voornaam: "An", leeftijd: 20 );',
        'let p = { voornaam: "An", leeftijd: 20 };',
      ],
      correctIndex: 2,
      explanation:
        "Een object literal staat tussen accolades {}. Property en waarde scheid je met een dubbele punt, en tussen properties staat een komma (geen puntkomma, geen gelijkheidsteken).",
    },
    {
      id: "t3",
      type: "open",
      question:
        "Wat doen JSON.stringify(object) en JSON.parse(tekst), en waarin verschillen ze van elkaar?",
      answer:
        "JSON.stringify(object) zet een JavaScript-object om naar een JSON-string (tekst), bijvoorbeeld om het te bewaren of door te sturen. JSON.parse(tekst) doet het omgekeerde: het zet een JSON-string terug om naar een echt JavaScript-object zodat je opnieuw de properties kunt aanspreken.",
    },
    {
      id: "t4",
      type: "open",
      question:
        'Je hebt een object student met een geneste property adres dat zelf een property gemeente heeft. Hoe lees je de gemeente uit? Geef de twee notaties.',
      answer:
        'Met de punt-notatie: student.adres.gemeente. Of met de vierkante-haken-notatie: student["adres"]["gemeente"]. Beide geven dezelfde waarde terug.',
    },
    {
      id: "t5",
      type: "mc",
      question:
        "Welk verschil tussen een object literal en JSON klopt?",
      options: [
        "In JSON moeten property-namen altijd tussen dubbele aanhalingstekens staan; in een object literal mag dat ook zonder.",
        "JSON kan functies bevatten, een object literal niet.",
        "Er is geen enkel verschil, het is exact dezelfde syntax.",
      ],
      correctIndex: 0,
      explanation:
        'In JSON staan property-namen altijd tussen dubbele aanhalingstekens ("naam": ...) en bevat JSON enkel data — geen functies of commentaar. In een object literal mag je de naam zonder quotes schrijven als het een geldige identifier is.',
    },
  ],
  exercises: [
    /* ── 1. DATE: dagen tussen twee datums ─────────────────────── */
    {
      id: "l20-dagen-tussen",
      chapterId: "labo20",
      chapter: "Objecten, Date & JSON",
      n: 1,
      of: 6,
      title: "Dagen op de wereldbol",
      tag: "JS",
      difficulty: "medium",
      brief:
        'Bereken in <code>scripts/code.js</code> binnen <code>setup</code> het aantal hele dagen tussen <code>1 januari 2024</code> en <code>31 december 2024</code>. Gebruik twee <code>Date</code>-objecten en <code>getTime()</code>. Log de zin <code>Er zitten 365 dagen tussen.</code> en zet diezelfde zin ook in <code>#uitvoer</code>.',
      hint:
        'Maak new Date(2024, 0, 1) en new Date(2024, 11, 31) (maand is 0-gebaseerd!). Trek de getTime()-waarden van elkaar af en deel door (1000*60*60*24). Rond af met Math.floor.',
      topics: ["Date", "getTime", "Math.floor", "textContent", "setup"],
      examples: [{ label: "Console", output: "Er zitten 365 dagen tussen." }],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Dagen op de wereldbol</title>\n</head>\n<body>\n  <p id="uitvoer"></p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  // 1. maak een Date voor 1 januari 2024 en een voor 31 december 2024\n  //    (let op: de maand is 0-gebaseerd!)\n  // 2. bereken het verschil in milliseconden met getTime()\n  // 3. reken om naar dagen (deel door 1000*60*60*24) en rond af met Math.floor\n  // 4. log en toon: "Er zitten <aantal> dagen tussen."\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "static",
          id: "no-var",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
        {
          type: "static",
          id: "gebruikt-gettime",
          label: "Je gebruikt new Date en getTime",
          file: "scripts/code.js",
          must: ["new Date", "getTime"],
        },
        {
          type: "console",
          id: "logt-dagen",
          label: 'Je logt "Er zitten 365 dagen tussen."',
          expected: "Er zitten 365 dagen tussen.",
          match: "equals",
        },
        {
          type: "dom",
          id: "toont-dagen",
          label: 'In #uitvoer staat de zin met 365 dagen',
          assertions: [{ selector: "#uitvoer", textEquals: "Er zitten 365 dagen tussen." }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const start = new Date(2024, 0, 1);\n  const eind = new Date(2024, 11, 31);\n\n  const verschilMs = eind.getTime() - start.getTime();\n  const dagen = Math.floor(verschilMs / (1000 * 60 * 60 * 24));\n\n  const zin = "Er zitten " + dagen + " dagen tussen.";\n  console.log(zin);\n  document.getElementById("uitvoer").textContent = zin;\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 2. OBJECT LITERAL (genest) ────────────────────────────── */
    {
      id: "l20-object-literal",
      chapterId: "labo20",
      chapter: "Objecten, Date & JSON",
      n: 2,
      of: 6,
      title: "Een student-object bouwen",
      tag: "JS",
      difficulty: "easy",
      brief:
        'Maak in <code>scripts/code.js</code> binnen <code>setup</code> een object literal <code>student</code> met de properties <code>voornaam</code> (<code>"Lotte"</code>), <code>familienaam</code> (<code>"Peeters"</code>) en een genest object <code>adres</code> met daarin <code>gemeente</code> (<code>"Brugge"</code>). Log daarna exact: <code>Lotte Peeters woont in Brugge</code>.',
      hint:
        'Een object literal staat tussen accolades, properties scheid je met een komma en property:waarde met een dubbele punt. Het geneste adres lees je met student.adres.gemeente.',
      topics: ["object literal", "geneste objecten", "dot-notatie", "console.log"],
      examples: [{ label: "Console", output: "Lotte Peeters woont in Brugge" }],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Student-object</title>\n</head>\n<body>\n  <h1>Open de console 👇</h1>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  // 1. maak een object literal "student" met voornaam, familienaam\n  //    en een genest object "adres" met daarin gemeente\n  // 2. log: "<voornaam> <familienaam> woont in <gemeente>"\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "static",
          id: "no-var",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
        {
          type: "static",
          id: "heeft-genest-adres",
          label: "Je object heeft een genest adres-object",
          file: "scripts/code.js",
          must: ["/adres\\s*:\\s*\\{/"],
        },
        {
          type: "console",
          id: "logt-zin",
          label: 'Je logt "Lotte Peeters woont in Brugge"',
          expected: "Lotte Peeters woont in Brugge",
          match: "equals",
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const student = {\n    voornaam: "Lotte",\n    familienaam: "Peeters",\n    adres: {\n      straat: "Lindenlaan 7",\n      postcode: "8000",\n      gemeente: "Brugge",\n    },\n  };\n\n  console.log(student.voornaam + " " + student.familienaam + " woont in " + student.adres.gemeente);\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 3. JSON.stringify ─────────────────────────────────────── */
    {
      id: "l20-json-stringify",
      chapterId: "labo20",
      chapter: "Objecten, Date & JSON",
      n: 3,
      of: 6,
      title: "Object omzetten naar JSON",
      tag: "JS",
      difficulty: "medium",
      brief:
        'Het object <code>student1</code> staat al klaar. Zet het in <code>setup</code> om naar een JSON-string met <code>JSON.stringify</code>, log die string én zet ze in <code>#json</code> via <code>textContent</code>.',
      hint:
        'let tekst = JSON.stringify(student1); console.log(tekst); en daarna document.getElementById("json").textContent = tekst.',
      topics: ["JSON.stringify", "objecten", "textContent", "setup"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>JSON stringify</title>\n</head>\n<body>\n  <p id="json"></p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const student1 = {\n  voornaam: "Lotte",\n  familienaam: "Peeters",\n  adres: {\n    straat: "Lindenlaan 7",\n    postcode: "8000",\n    gemeente: "Brugge",\n  },\n  isIngeschreven: true,\n  hobbys: ["tekenen", "lopen"],\n};\n\nconst setup = () => {\n  // 1. zet student1 om naar een JSON-string met JSON.stringify\n  // 2. log die string\n  // 3. zet de string in #json met textContent\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "static",
          id: "gebruikt-stringify",
          label: "Je roept JSON.stringify aan",
          file: "scripts/code.js",
          must: ["/JSON\\.stringify\\s*\\(/"],
        },
        {
          type: "console",
          id: "logt-json-voornaam",
          label: "De JSON-string bevat de voornaam",
          expected: '"voornaam":"Lotte"',
          match: "includes",
        },
        {
          type: "console",
          id: "logt-json-gemeente",
          label: "De JSON-string bevat de geneste gemeente",
          expected: '"gemeente":"Brugge"',
          match: "includes",
        },
        {
          type: "dom",
          id: "toont-json",
          label: "De JSON-string staat ook in #json",
          assertions: [{ selector: "#json", textIncludes: '"hobbys":["tekenen","lopen"]' }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const student1 = {\n  voornaam: "Lotte",\n  familienaam: "Peeters",\n  adres: {\n    straat: "Lindenlaan 7",\n    postcode: "8000",\n    gemeente: "Brugge",\n  },\n  isIngeschreven: true,\n  hobbys: ["tekenen", "lopen"],\n};\n\nconst setup = () => {\n  const tekst = JSON.stringify(student1);\n  console.log(tekst);\n  document.getElementById("json").textContent = tekst;\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 4. JSON.parse ─────────────────────────────────────────── */
    {
      id: "l20-json-parse",
      chapterId: "labo20",
      chapter: "Objecten, Date & JSON",
      n: 4,
      of: 6,
      title: "JSON terug omzetten naar een object",
      tag: "JS",
      difficulty: "easy",
      brief:
        'De variabele <code>tekst</code> bevat een JSON-string. Zet ze in <code>setup</code> om naar een echt object met <code>JSON.parse</code> en log dan exact: <code>Sander Vandeputte (sander@vives.be)</code>.',
      hint:
        'let persoon = JSON.parse(tekst); daarna lees je persoon.voornaam, persoon.familienaam en persoon.email uit en bouw je de zin op.',
      topics: ["JSON.parse", "objecten", "dot-notatie", "console.log"],
      examples: [{ label: "Console", output: "Sander Vandeputte (sander@vives.be)" }],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>JSON parse</title>\n</head>\n<body>\n  <h1>Open de console 👇</h1>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const tekst = \'{"voornaam":"Sander","familienaam":"Vandeputte","email":"sander@vives.be"}\';\n\nconst setup = () => {\n  // 1. zet tekst om naar een echt object met JSON.parse\n  // 2. log: "<voornaam> <familienaam> (<email>)"\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "static",
          id: "gebruikt-parse",
          label: "Je roept JSON.parse aan",
          file: "scripts/code.js",
          must: ["/JSON\\.parse\\s*\\(/"],
        },
        {
          type: "static",
          id: "no-var",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
        {
          type: "console",
          id: "logt-persoon",
          label: 'Je logt "Sander Vandeputte (sander@vives.be)"',
          expected: "Sander Vandeputte (sander@vives.be)",
          match: "equals",
        },
      ],
      solution: {
        "scripts/code.js":
          'const tekst = \'{"voornaam":"Sander","familienaam":"Vandeputte","email":"sander@vives.be"}\';\n\nconst setup = () => {\n  const persoon = JSON.parse(tekst);\n  console.log(persoon.voornaam + " " + persoon.familienaam + " (" + persoon.email + ")");\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 5. PURE FUNCTIE: datum formatteren ────────────────────── */
    {
      id: "l20-formatteer-datum",
      chapterId: "labo20",
      chapter: "Objecten, Date & JSON",
      n: 5,
      of: 6,
      title: "Datum formatteren",
      tag: "JS",
      difficulty: "medium",
      brief:
        'Schrijf een <code>globale</code> functie <code>formatteerDatum(jaar, maand, dag)</code> die een <code>Date</code>-object maakt en de datum teruggeeft als tekst in het formaat <code>d-m-jjjj</code> (bv. <code>10-4-2025</code>). Gebruik <code>getDate()</code>, <code>getMonth()</code> en <code>getFullYear()</code>. (Hier gebruiken we GEEN setup: we testen de functie rechtstreeks.)',
      hint:
        'Maak new Date(jaar, maand - 1, dag) — maand is 0-gebaseerd, dus tel er 1 af. Geef terug: datum.getDate() + "-" + (datum.getMonth() + 1) + "-" + datum.getFullYear().',
      topics: ["functions", "return", "arrow", "Date", "getDate", "getMonth"],
      examples: [
        { input: "formatteerDatum(2025, 4, 10)", output: "10-4-2025" },
        { input: "formatteerDatum(1993, 12, 31)", output: "31-12-1993" },
      ],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf hier de globale functie formatteerDatum(jaar, maand, dag).\n// Ze geeft de datum terug als tekst \"d-m-jjjj\".\n",
        },
      ],
      checks: [
        {
          type: "function",
          id: "formatteert-correct",
          label: "formatteerDatum geeft de juiste tekst terug",
          name: "formatteerDatum",
          cases: [
            { args: [2025, 4, 10], expected: "10-4-2025" },
            { args: [1993, 12, 31], expected: "31-12-1993" },
            { args: [2000, 1, 1], expected: "1-1-2000" },
          ],
        },
        {
          type: "static",
          id: "arrow",
          label: "Je gebruikt een arrow function",
          file: "scripts/code.js",
          must: ["/=>/"],
        },
        {
          type: "static",
          id: "gebruikt-date",
          label: "Je gebruikt een Date-object",
          file: "scripts/code.js",
          must: ["new Date"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const formatteerDatum = (jaar, maand, dag) => {\n  const datum = new Date(jaar, maand - 1, dag);\n  return datum.getDate() + "-" + (datum.getMonth() + 1) + "-" + datum.getFullYear();\n};',
      },
    },

    /* ── 6. CONTACTMANAGER (vereenvoudigd, DOM + objecten) ──────── */
    {
      id: "l20-contactmanager",
      chapterId: "labo20",
      chapter: "Objecten, Date & JSON",
      n: 6,
      of: 6,
      title: "Mini-contactmanager",
      tag: "JS",
      difficulty: "hard",
      brief:
        'Bouw in <code>setup</code> een mini-contactmanager. De array <code>personen</code> staat klaar. Vul de functies in zodat: (1) bij het laden elke persoon als een <code>&lt;option&gt;</code> (tekst = <code>voornaam familienaam</code>) in <code>#lstPersonen</code> verschijnt; (2) bij een <code>change</code> op de lijst de naam van de gekozen persoon in <code>#detail</code> komt; (3) een klik op <code>#btnBewaar</code> een nieuw persoon-object (met de waarden uit <code>#txtVoornaam</code> en <code>#txtFamilienaam</code>) achteraan aan <code>personen</code> toevoegt en de lijst opnieuw tekent.',
      hint:
        'Gebruik personen.forEach((p, index) => ...) en document.createElement("option"); zet option.textContent en option.value = index. Voor de change-listener: e.target.value is de index. Voor bewaren: personen.push({ voornaam: ..., familienaam: ... }) en teken de lijst opnieuw.',
      topics: ["objecten", "arrays", "forEach", "addEventListener", "change", "createElement", "setup"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Contactmanager</title>\n</head>\n<body>\n  <select id="lstPersonen" size="6"></select>\n  <p>Geselecteerd: <span id="detail"></span></p>\n  <div>\n    <input type="text" id="txtVoornaam" value="">\n    <input type="text" id="txtFamilienaam" value="">\n    <input type="button" id="btnBewaar" value="Bewaar">\n  </div>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "styles/style.css",
          content:
            "body { font-family: system-ui, sans-serif; padding: 8px; }\n#lstPersonen { width: 260px; }\ninput[type=text] { display: block; margin: 4px 0; }",
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const personen = [\n  { voornaam: "Jan", familienaam: "Janssens" },\n  { voornaam: "Sander", familienaam: "Vandeputte" },\n];\n\n// Tekent alle personen als <option> in de lijst.\nconst toonPersonen = () => {\n  const lst = document.getElementById("lstPersonen");\n  lst.innerHTML = "";\n  // TODO: voeg per persoon een <option> toe (tekst = voornaam + " " + familienaam, value = index)\n};\n\n// Voegt een nieuw persoon toe op basis van de invulvelden.\nconst bewaarPersoon = () => {\n  // TODO: lees #txtVoornaam en #txtFamilienaam, push een nieuw object en teken de lijst opnieuw\n};\n\nconst setup = () => {\n  // TODO: teken de lijst, registreer de change-listener op #lstPersonen\n  //       (zet de naam van de gekozen persoon in #detail)\n  //       en de click-listener op #btnBewaar\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "static",
          id: "no-var",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
        {
          type: "static",
          id: "gebruikt-ael",
          label: "Je gebruikt createElement en een change-listener",
          file: "scripts/code.js",
          must: ["createElement", "/addEventListener\\(\\s*[\"']change[\"']/"],
        },
        {
          type: "dom",
          id: "lijst-init",
          label: "Bij het laden staan er 2 personen in de lijst",
          assertions: [{ selector: "#lstPersonen option", count: 2 }],
        },
        {
          type: "dom",
          id: "change-toont-naam",
          label: 'Bij selectie van de tweede persoon staat "Sander Vandeputte" in #detail',
          before: [{ action: "input", selector: "#lstPersonen", value: "1" }],
          assertions: [{ selector: "#detail", textEquals: "Sander Vandeputte" }],
        },
        {
          type: "dom",
          id: "bewaar-voegt-toe",
          label: "Na het bewaren van een nieuw persoon staan er 3 in de lijst",
          before: [
            { action: "input", selector: "#txtVoornaam", value: "Lotte" },
            { action: "input", selector: "#txtFamilienaam", value: "Peeters" },
            { action: "click", selector: "#btnBewaar", times: 1 },
          ],
          assertions: [
            { selector: "#lstPersonen option", count: 3 },
            { selector: "#lstPersonen", htmlIncludes: "Lotte Peeters" },
          ],
        },
      ],
      solution: {
        "scripts/code.js":
          'const personen = [\n  { voornaam: "Jan", familienaam: "Janssens" },\n  { voornaam: "Sander", familienaam: "Vandeputte" },\n];\n\nconst toonPersonen = () => {\n  const lst = document.getElementById("lstPersonen");\n  lst.innerHTML = "";\n  personen.forEach((p, index) => {\n    const option = document.createElement("option");\n    option.textContent = p.voornaam + " " + p.familienaam;\n    option.value = index;\n    lst.appendChild(option);\n  });\n};\n\nconst bewaarPersoon = () => {\n  const voornaam = document.getElementById("txtVoornaam").value;\n  const familienaam = document.getElementById("txtFamilienaam").value;\n  personen.push({ voornaam: voornaam, familienaam: familienaam });\n  toonPersonen();\n};\n\nconst setup = () => {\n  toonPersonen();\n\n  const lst = document.getElementById("lstPersonen");\n  lst.addEventListener("change", (e) => {\n    const index = parseInt(e.target.value);\n    const p = personen[index];\n    document.getElementById("detail").textContent = p.voornaam + " " + p.familienaam;\n  });\n\n  document.getElementById("btnBewaar").addEventListener("click", bewaarPersoon);\n};\n\nwindow.addEventListener("load", setup);',
      },
    },
  ],
};
