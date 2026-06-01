import type { ChapterContent } from "@/lib/types";

/* ════════════════════════════════════════════════════════════════════
   Labo 17 — JavaScript (deel 5): strings & arrays, formwaarden
   Onderwerpen: deelteksten (slice/substring), trim/toUpperCase/toLowerCase,
   strings vergelijken (==, ===, localeCompare), arrays sorteren met een
   vergelijkingsfunctie, en waarden uit een formulier uitlezen
   (.value, .checked, getElementsByName, .options/.selected).
   Cumulatief: addEventListener is sinds labo 14 gekend en wordt hier gebruikt
   voor de form-oefeningen, net zoals in de cursusvoorbeelden van labo 17.
   ════════════════════════════════════════════════════════════════════ */

export const labo17: ChapterContent = {
  chapter: {
    id: "labo17",
    n: "17",
    title: "JavaScript deel 5: strings & arrays",
    desc: "Deelteksten, strings vergelijken, arrays sorteren en formwaarden uitlezen.",
    tag: "JS",
    difficulty: "medium",
  },
  theory: [
    {
      id: "t1",
      type: "mc",
      question:
        'Wat toont console.log("Hello world".slice(3, 8)); ? Let op: de rechtergrens is niet inclusief.',
      options: ['"lo wo"', '"lo wor"', '"o wor"', '"llo w"'],
      correctIndex: 0,
      explanation:
        "slice(3, 8) neemt de karakters op index 3 t/m 7 (8 is niet inclusief): 'lo wo'. De cursus raadt slice aan boven substring/substr.",
    },
    {
      id: "t2",
      type: "mc",
      question:
        "Waarom vergelijk je strings best met s1.localeCompare(s2) en niet met s1 < s2 of s1 > s2 ?",
      options: [
        "localeCompare is sneller dan < en >",
        "< en > werken niet op strings, enkel op getallen",
        "< en > zijn gebaseerd op ASCII-codes en geven niet altijd de juiste alfabetische volgorde",
        "localeCompare geeft een boolean terug, dat is handiger",
      ],
      correctIndex: 2,
      explanation:
        "De operatoren < en > vergelijken op ASCII-code (bv. hoofdletters vóór kleine letters) en werken niet in alle browsers gelijk. localeCompare geeft -1, 0 of 1 en houdt rekening met de alfabetische volgorde.",
    },
    {
      id: "t3",
      type: "open",
      question:
        "Je geeft sort() een vergelijkingsfunctie compare(a, b) mee. Wat moet die teruggeven opdat a vóór b komt, en wat als a en b gelijk zijn?",
      answer:
        "compare moet een negatief getal teruggeven als a vóór b moet komen (a < b), 0 als ze gelijk zijn, en een positief getal als a na b moet komen (a > b). Voor getallen volstaat return a - b; voor strings return a.localeCompare(b).",
    },
    {
      id: "t4",
      type: "mc",
      question:
        'Je leest een waarde uit met document.getElementById("leeftijd").value, en het input-element heeft type="number". Welk type heeft die waarde in JavaScript?',
      options: [
        "Altijd een number",
        "Altijd een string, ook bij type=number",
        "Een boolean",
        "Een number als het een geldig getal is, anders een string",
      ],
      correctIndex: 1,
      explanation:
        ".value levert altijd een string op, ook bij type=number. Wil je rekenen, zet je ze eerst om met Number(...) of parseInt(...).",
    },
    {
      id: "t5",
      type: "open",
      question:
        "Hoe vraag je op of een checkbox aangevinkt is, en hoe haal je alle radiobuttons van dezelfde groep op om te weten welke gekozen is?",
      answer:
        'Voor een checkbox lees je de .checked property (een boolean). Voor radiobuttons haal je de groep op met document.getElementsByName("naam") (een NodeList) en overloop je ze: het element met .checked === true bevat de gekozen .value.',
    },
  ],
  exercises: [
    /* ── 1. initialen (zelf) — string-basis: slice + trim + toUpperCase ─ */
    {
      id: "l17-initialen",
      chapterId: "labo17",
      chapter: "JavaScript deel 5: strings & arrays",
      n: 1,
      of: 7,
      title: "Initialen maken",
      tag: "JS",
      difficulty: "easy",
      brief:
        'Schrijf in <code>scripts/code.js</code> een <code>arrow function</code> <code>initialen(voornaam, familienaam)</code> die de twee initialen als HOOFDLETTERS teruggeeft. Verwijder eerst spaties vooraan/achteraan met <code>trim()</code>, neem dan het eerste karakter met <code>slice(0, 1)</code> en zet het om met <code>toUpperCase()</code>. <code>initialen(\"jan\", \"janssens\")</code> geeft <code>\"JJ\"</code>. Het testbestand roept je functie aan en logt het resultaat.',
      hint: "Per naam: naam.trim().slice(0, 1).toUpperCase(). Plak de twee letters aan elkaar met +. Schrijf één arrow function met const, en vergeet de return niet.",
      topics: ["slice", "trim", "toUpperCase", "functions", "return"],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf hier de arrow function initialen(voornaam, familienaam)\n// Tip: naam.trim().slice(0, 1).toUpperCase()\nconst initialen = (voornaam, familienaam) => {\n  // ...\n};\n",
        },
        {
          name: "scripts/test.js",
          content:
            '// Dit testbestand roept jouw functie aan. Je hoeft het niet te wijzigen.\nconsole.log(initialen("jan", "janssens"));\nconsole.log(initialen("  ada ", "Lovelace"));\nconsole.log(initialen("guido", "van rossum"));',
          readOnly: true,
        },
      ],
      checks: [
        {
          type: "console",
          id: "initialen-werkt",
          label: "initialen geeft JJ, AL en GV terug",
          expected: "JJ\nAL\nGV",
          match: "equals",
        },
        {
          type: "static",
          id: "geen-var",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
        {
          type: "static",
          id: "gebruikt-toupper",
          label: "Je gebruikt toUpperCase",
          file: "scripts/code.js",
          must: ["toUpperCase"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const initialen = (voornaam, familienaam) => {\n  const eerste = voornaam.trim().slice(0, 1).toUpperCase();\n  const tweede = familienaam.trim().slice(0, 1).toUpperCase();\n  return eerste + tweede;\n};',
      },
    },

    /* ── 2. trigrams (labo-eigen) — deeltekst in een loop ────────────── */
    {
      id: "l17-trigrams",
      chapterId: "labo17",
      chapter: "JavaScript deel 5: strings & arrays",
      n: 2,
      of: 7,
      title: "Trigrams",
      tag: "JS",
      difficulty: "medium",
      brief:
        'Een <code>trigram</code> is een opeenvolging van drie letters in een woord. Vul <code>setup</code> aan: bereken alle trigrams van het woord <code>\"onoorbaar\"</code>, plak ze met <code>\" - \"</code> aan elkaar, zet die tekst in <code>#output</code> én log ze met <code>console.log</code>. De verwachte tekst is <code>ono - noo - oor - orb - rba - baa - aar</code>.',
      hint: 'Loop met for (let i = 0; i <= woord.length - 3; i++) en haal telkens woord.slice(i, i + 3) op. Verzamel ze in een array en gebruik array.join(" - ").',
      topics: ["slice", "substring", "loops", "arrays", "join", "textContent"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Trigrams</title>\n</head>\n<body>\n  <p id="output"></p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  const woord = "onoorbaar";\n  const trigrams = [];\n\n  // 1. loop tot woord.length - 3 en haal telkens een deeltekst van 3 karakters op\n  // 2. zet de trigrams samen met " - "\n  // 3. plaats het resultaat in #output en log het met console.log\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "console",
          id: "trigrams-console",
          label: "Je logt de juiste trigrams",
          expected: "ono - noo - oor - orb - rba - baa - aar",
          match: "equals",
        },
        {
          type: "dom",
          id: "trigrams-dom",
          label: "#output bevat de juiste trigrams",
          assertions: [
            { selector: "#output", textEquals: "ono - noo - oor - orb - rba - baa - aar" },
          ],
        },
        {
          type: "static",
          id: "geen-var",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
        {
          type: "static",
          id: "gebruikt-deeltekst",
          label: "Je gebruikt slice of substring",
          file: "scripts/code.js",
          must: ["/slice|substring/"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const woord = "onoorbaar";\n  const trigrams = [];\n\n  for (let i = 0; i <= woord.length - 3; i++) {\n    trigrams.push(woord.slice(i, i + 3));\n  }\n\n  const tekst = trigrams.join(" - ");\n  document.getElementById("output").textContent = tekst;\n  console.log(tekst);\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 3. de en het (labo-eigen) — standalone-woord vervangen ──────── */
    {
      id: "l17-de-en-het",
      chapterId: "labo17",
      chapter: "JavaScript deel 5: strings & arrays",
      n: 3,
      of: 7,
      title: "De wordt het",
      tag: "JS",
      difficulty: "hard",
      brief:
        'Schrijf in <code>scripts/code.js</code> een <code>arrow function</code> <code>vervang(zin)</code> die elk los woord <code>\"de\"</code> of <code>\"De\"</code> vervangt door <code>\"het\"</code> en de nieuwe zin teruggeeft. Een <code>\"de\"</code> midden in een woord (zoals in <code>\"ronde\"</code>) mag je NIET vervangen. <code>Gebruik geen</code> <code>replace</code>, <code>replaceAll</code> of <code>split</code> — werk met <code>slice</code> en de tekens errond. Het testbestand logt je resultaten.',
      hint: 'Loop teken per teken. Een "de" is een los woord als zin.slice(i, i + 2) gelijk is aan "de" of "De", én links staat het begin van de zin of een spatie (i === 0 || zin[i-1] === " "), én rechts staat het einde of een spatie. Plak dan "het" en sla het tweede teken over met i++.',
      topics: ["slice", "substring", "strings vergelijken", "loops", "return"],
      files: [
        {
          name: "scripts/code.js",
          content:
            '// Schrijf hier de arrow function vervang(zin)\n// Vervang elk LOS woord \'de\'/\'De\' door \'het\'. Geen replace/replaceAll/split!\nconst vervang = (zin) => {\n  // ...\n};\n',
        },
        {
          name: "scripts/test.js",
          content:
            '// Dit testbestand roept jouw functie aan. Je hoeft het niet te wijzigen.\nconsole.log(vervang("Gisteren zat de jongen op de stoep en at de helft van de appel"));\nconsole.log(vervang("de man riep de"));\nconsole.log(vervang("De hond"));\nconsole.log(vervang("ronde tafel"));',
          readOnly: true,
        },
      ],
      checks: [
        {
          type: "console",
          id: "vervang-werkt",
          label: "vervang zet enkel losse 'de'/'De' om naar 'het'",
          expected:
            "Gisteren zat het jongen op het stoep en at het helft van het appel\nhet man riep het\nhet hond\nronde tafel",
          match: "equals",
        },
        {
          type: "static",
          id: "geen-replace-split",
          label: "Je gebruikt geen replace, replaceAll of split",
          file: "scripts/code.js",
          mustNot: ["replace", "split"],
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
          'const vervang = (zin) => {\n  let resultaat = "";\n  for (let i = 0; i < zin.length; i++) {\n    const isDe = zin.slice(i, i + 2) === "de" || zin.slice(i, i + 2) === "De";\n    const linksOk = i === 0 || zin[i - 1] === " ";\n    const rechtsOk = i + 2 === zin.length || zin[i + 2] === " ";\n    if (isDe && linksOk && rechtsOk) {\n      resultaat += "het";\n      i++;\n    } else {\n      resultaat += zin[i];\n    }\n  }\n  return resultaat;\n};',
      },
    },

    /* ── 4. alfabetisch eerste (zelf) — localeCompare ────────────────── */
    {
      id: "l17-alfabetisch-eerste",
      chapterId: "labo17",
      chapter: "JavaScript deel 5: strings & arrays",
      n: 4,
      of: 7,
      title: "Welk woord komt eerst?",
      tag: "JS",
      difficulty: "easy",
      brief:
        'Schrijf in <code>scripts/code.js</code> een <code>arrow function</code> <code>alfabetischEerste(a, b)</code> die van twee woorden het woord teruggeeft dat alfabetisch eerst komt. Gebruik <code>localeCompare</code>, NIET de operatoren <code>&lt;</code> of <code>&gt;</code>. Bij gelijke woorden geef je <code>a</code> terug. Het testbestand logt je resultaten.',
      hint: "a.localeCompare(b) geeft een negatief getal als a vóór b komt, 0 bij gelijk, positief als a na b komt. Geef a terug als a.localeCompare(b) <= 0, anders b.",
      topics: ["localeCompare", "strings vergelijken", "functions", "return"],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf hier de arrow function alfabetischEerste(a, b)\n// Gebruik localeCompare, niet < of >.\nconst alfabetischEerste = (a, b) => {\n  // ...\n};\n",
        },
        {
          name: "scripts/test.js",
          content:
            '// Dit testbestand roept jouw functie aan. Je hoeft het niet te wijzigen.\nconsole.log(alfabetischEerste("zebra", "aap"));\nconsole.log(alfabetischEerste("appel", "beer"));\nconsole.log(alfabetischEerste("kat", "kat"));',
          readOnly: true,
        },
      ],
      checks: [
        {
          type: "console",
          id: "eerste-werkt",
          label: "alfabetischEerste kiest het juiste woord",
          expected: "aap\nappel\nkat",
          match: "equals",
        },
        {
          type: "static",
          id: "gebruikt-localecompare",
          label: "Je gebruikt localeCompare",
          file: "scripts/code.js",
          must: ["localeCompare"],
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
          "const alfabetischEerste = (a, b) => {\n  if (a.localeCompare(b) <= 0) {\n    return a;\n  }\n  return b;\n};",
      },
    },

    /* ── 5. sorteer gemeenten (zelf) — sort met vergelijkingsfunctie ─── */
    {
      id: "l17-sorteer-gemeenten",
      chapterId: "labo17",
      chapter: "JavaScript deel 5: strings & arrays",
      n: 5,
      of: 7,
      title: "Gemeenten sorteren",
      tag: "JS",
      difficulty: "medium",
      brief:
        'Schrijf in <code>scripts/code.js</code> een <code>arrow function</code> <code>sorteerGemeenten(gemeenten)</code> die een array van gemeentenamen alfabetisch gesorteerd teruggeeft. Geef een vergelijkingsfunctie mee aan <code>sort</code> die met <code>localeCompare</code> vergelijkt. Het testbestand logt de gesorteerde lijst met komma\'s.',
      hint: "Maak eerst een kopie met gemeenten.slice(), zodat je het origineel niet wijzigt. Sorteer dan: kopie.sort((a, b) => a.localeCompare(b)) en geef de kopie terug.",
      topics: ["sort", "localeCompare", "arrays", "vergelijkingsfunctie", "slice"],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf hier de arrow function sorteerGemeenten(gemeenten)\n// Sorteer alfabetisch met een vergelijkingsfunctie die localeCompare gebruikt.\nconst sorteerGemeenten = (gemeenten) => {\n  // ...\n};\n",
        },
        {
          name: "scripts/test.js",
          content:
            '// Dit testbestand roept jouw functie aan. Je hoeft het niet te wijzigen.\nconsole.log(sorteerGemeenten(["Kortrijk", "Brugge", "Antwerpen", "Gent"]).join(", "));\nconsole.log(sorteerGemeenten(["ezel", "aap"]).join(", "));',
          readOnly: true,
        },
      ],
      checks: [
        {
          type: "console",
          id: "sorteren-werkt",
          label: "sorteerGemeenten sorteert alfabetisch",
          expected: "Antwerpen, Brugge, Gent, Kortrijk\naap, ezel",
          match: "equals",
        },
        {
          type: "static",
          id: "gebruikt-sort",
          label: "Je gebruikt sort",
          file: "scripts/code.js",
          must: ["sort"],
        },
        {
          type: "static",
          id: "gebruikt-localecompare",
          label: "Je gebruikt localeCompare",
          file: "scripts/code.js",
          must: ["localeCompare"],
        },
      ],
      solution: {
        "scripts/code.js":
          "const sorteerGemeenten = (gemeenten) => {\n  const kopie = gemeenten.slice();\n  kopie.sort((a, b) => a.localeCompare(b));\n  return kopie;\n};",
      },
    },

    /* ── 6. formwaarden (labo-eigen) — .checked / radio / select ─────── */
    {
      id: "l17-formwaarden",
      chapterId: "labo17",
      chapter: "JavaScript deel 5: strings & arrays",
      n: 6,
      of: 7,
      title: "Formwaarden uitlezen",
      tag: "JS",
      difficulty: "medium",
      brief:
        'Het formulier is al ingevuld. Vul <code>setup</code> aan: voeg een klik-listener toe aan de knop <code>#toon</code> die de gekozen waarden uitleest en in <code>#resultaat</code> zet, in dit formaat: <code>Roker: true | Moedertaal: nl | Buurland: Nederland | Bestelling: brood, melk</code>. Lees de checkbox met <code>.checked</code>, de radiogroep met <code>getElementsByName</code>, de enkelvoudige select met <code>.value</code> en de multi-select via <code>.options</code> + <code>.selected</code>.',
      hint: 'Roep event.preventDefault() aan zodat de form niet verstuurt. Radiogroep: loop over document.getElementsByName("moedertaal") en pak de .value waar .checked true is. Multi-select: loop over select.options en push opties[i].value waar opties[i].selected. Plak de gekozen waarden met ", " via join.',
      topics: ["addEventListener", "checked", "getElementsByName", "options", "selected", "value"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Formwaarden</title>\n</head>\n<body>\n  <form>\n    <div>\n      <label for="isRoker">Is roker</label>\n      <input type="checkbox" id="isRoker" checked>\n    </div>\n    <div id="moedertaal">\n      <input type="radio" name="moedertaal" id="nl" value="nl" checked>\n      <label for="nl">Nederlands</label>\n      <input type="radio" name="moedertaal" id="fr" value="fr">\n      <label for="fr">Frans</label>\n      <input type="radio" name="moedertaal" id="en" value="en">\n      <label for="en">Engels</label>\n    </div>\n    <div>\n      <label for="land">Favoriete buurland</label>\n      <select id="land">\n        <option value="Nederland" selected>Nederland</option>\n        <option value="Frankrijk">Frankrijk</option>\n        <option value="Duitsland">Duitsland</option>\n      </select>\n    </div>\n    <div>\n      <label for="bestelling">Bestelling</label>\n      <select id="bestelling" size="6" multiple>\n        <option value="aardappelen">aardappelen</option>\n        <option value="brood" selected>brood</option>\n        <option value="melk" selected>melk</option>\n        <option value="biefstuk">biefstuk</option>\n        <option value="chips">chips</option>\n        <option value="krant">krant</option>\n      </select>\n    </div>\n    <button id="toon">Toon resultaat</button>\n  </form>\n  <p id="resultaat"></p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  const knop = document.getElementById("toon");\n  knop.addEventListener("click", (event) => {\n    event.preventDefault();\n\n    // 1. checkbox: .checked\n    // 2. radiogroep: getElementsByName("moedertaal"), pak de gekozen .value\n    // 3. enkelvoudige select: .value\n    // 4. multi-select: loop over .options en verzamel de .selected waarden\n    // 5. zet alles samen in #resultaat (en log eventueel met console.log)\n  });\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "static",
          id: "gebruikt-getelementsbyname",
          label: "Je gebruikt getElementsByName voor de radiogroep",
          file: "scripts/code.js",
          must: ["getElementsByName"],
        },
        {
          type: "dom",
          id: "resultaat-roker-taal",
          label: "Na de klik staan roker en moedertaal in #resultaat",
          before: [{ action: "click", selector: "#toon", times: 1 }],
          assertions: [
            { selector: "#resultaat", textIncludes: "Roker: true" },
            { selector: "#resultaat", textIncludes: "Moedertaal: nl" },
          ],
        },
        {
          type: "dom",
          id: "resultaat-land-bestelling",
          label: "Na de klik staan buurland en bestelling in #resultaat",
          before: [{ action: "click", selector: "#toon", times: 1 }],
          assertions: [
            { selector: "#resultaat", textIncludes: "Buurland: Nederland" },
            { selector: "#resultaat", textIncludes: "Bestelling: brood, melk" },
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
          'const setup = () => {\n  const knop = document.getElementById("toon");\n  knop.addEventListener("click", (event) => {\n    event.preventDefault();\n\n    const roker = document.getElementById("isRoker").checked;\n\n    const radios = document.getElementsByName("moedertaal");\n    let moedertaal = "";\n    for (let i = 0; i < radios.length; i++) {\n      if (radios[i].checked) {\n        moedertaal = radios[i].value;\n      }\n    }\n\n    const land = document.getElementById("land").value;\n\n    const opties = document.getElementById("bestelling").options;\n    const bestelling = [];\n    for (let i = 0; i < opties.length; i++) {\n      if (opties[i].selected) {\n        bestelling.push(opties[i].value);\n      }\n    }\n\n    const tekst =\n      "Roker: " + roker +\n      " | Moedertaal: " + moedertaal +\n      " | Buurland: " + land +\n      " | Bestelling: " + bestelling.join(", ");\n\n    document.getElementById("resultaat").textContent = tekst;\n    console.log(tekst);\n  });\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 7. email valideren (labo-eigen) — string-validatie ──────────── */
    {
      id: "l17-valideer-email",
      chapterId: "labo17",
      chapter: "JavaScript deel 5: strings & arrays",
      n: 7,
      of: 7,
      title: "E-mailadres valideren",
      tag: "JS",
      difficulty: "medium",
      brief:
        'Schrijf in <code>scripts/code.js</code> een <code>arrow function</code> <code>valideerEmail(email)</code> die <code>true</code> teruggeeft voor een geldig adres en anders <code>false</code>. Regels (zoals in de form-validatie van het labo): na <code>trim()</code> moet er exact één <code>@</code>-teken zijn, met minstens één karakter vóór én na de <code>@</code>. Extra spaties links/rechts zijn toegelaten. Het testbestand logt je resultaten.',
      hint: 'Werk op email.trim(). Tel de @-tekens en onthoud de positie van de laatste in een for-loop. Geldig als aantal === 1 én de positie > 0 én positie < lengte - 1. Gebruik GEEN regex of split — oefen met losse karakters (email[i] === "@").',
      topics: ["strings", "trim", "loops", "validatie", "return"],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf hier de arrow function valideerEmail(email)\n// Geldig = na trim exact 1 @-teken, met minstens 1 karakter ervoor en erna.\nconst valideerEmail = (email) => {\n  // ...\n};\n",
        },
        {
          name: "scripts/test.js",
          content:
            '// Dit testbestand roept jouw functie aan. Je hoeft het niet te wijzigen.\nconsole.log(valideerEmail("jan@vives.be"));\nconsole.log(valideerEmail("a@b"));\nconsole.log(valideerEmail("  x@y  "));\nconsole.log(valideerEmail("geenapestaart"));\nconsole.log(valideerEmail("@b"));\nconsole.log(valideerEmail("a@"));\nconsole.log(valideerEmail("a@@b"));',
          readOnly: true,
        },
      ],
      checks: [
        {
          type: "console",
          id: "email-werkt",
          label: "valideerEmail keurt adressen correct goed of af",
          expected: "true\ntrue\ntrue\nfalse\nfalse\nfalse\nfalse",
          match: "equals",
        },
        {
          type: "static",
          id: "geen-var",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
        {
          type: "static",
          id: "gebruikt-trim",
          label: "Je gebruikt trim",
          file: "scripts/code.js",
          must: ["trim"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const valideerEmail = (email) => {\n  const waarde = email.trim();\n  let aantal = 0;\n  let positie = -1;\n  for (let i = 0; i < waarde.length; i++) {\n    if (waarde[i] === "@") {\n      aantal++;\n      positie = i;\n    }\n  }\n  return aantal === 1 && positie > 0 && positie < waarde.length - 1;\n};',
      },
    },
  ],
};
