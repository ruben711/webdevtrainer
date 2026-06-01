import type { ChapterContent } from "@/lib/types";

/* ════════════════════════════════════════════════════════════════════
   Labo 15 — JavaScript (deel 3)
   Onderwerpen (uit de labo-PDF + uitgewerkte voorbeelden):
   · Event based programming: addEventListener + het window "load"-event
     (de setup-conventie window.addEventListener("load", setup))
   · Een HTMLCollection overlopen met een for-lus
     (getElementsByClassName / getElementsByTagName)
   · CSS properties instellen via JavaScript: .style, .className, .classList
   · De DOM-property textContent
   · Number: parseInt, parseFloat, .toFixed(n) en getal ↔ tekst

   Cumulatief: bouwt verder op labo 13 (variabelen let/const, functies,
   arrow functions) en labo 14 (arrays, strings, innerHTML, getElementById /
   getElementsByClassName / getElementsByTagName). Alles t/m labo 15.
   ════════════════════════════════════════════════════════════════════ */

export const labo15: ChapterContent = {
  chapter: {
    id: "labo15",
    n: "15",
    title: "JavaScript deel 3 — events, CSS via JS & Number",
    desc: "Reageer op events met het load-event, overloop een HTMLCollection, pas CSS aan via JavaScript en reken met Number.",
    tag: "JS",
    difficulty: "medium",
  },

  theory: [
    {
      id: "t1",
      type: "mc",
      question:
        "Waarom koppelen we onze initialisatiecode aan het load-event met window.addEventListener(\"load\", setup) in plaats van de code zomaar bovenaan te zetten?",
      options: [
        "Omdat var anders niet werkt",
        "Zodat de code pas draait wanneer de DOM-tree volledig is opgebouwd en alle elementen dus bestaan",
        "Omdat de console anders leeg blijft",
        "Omdat een arrow function altijd op het load-event moet staan",
      ],
      correctIndex: 1,
      explanation:
        "De JavaScript kan al beginnen lopen voordat de browser klaar is met het opbouwen van de DOM-tree. Door op het load-event te wachten, bestaan de elementen zeker al wanneer setup draait, zodat we er event listeners aan kunnen koppelen.",
    },
    {
      id: "t2",
      type: "mc",
      question:
        "Wat is het verschil tussen het tweede argument bij element.addEventListener(\"click\", doeIets) en element.addEventListener(\"click\", doeIets())?",
      options: [
        "Er is geen verschil, beide werken identiek",
        "Met haakjes wordt de functie meteen één keer uitgevoerd in plaats van pas bij de klik",
        "Zonder haakjes geeft het een foutmelding",
        "Met haakjes wordt de listener twee keer gekoppeld",
      ],
      correctIndex: 1,
      explanation:
        'Je geeft enkel de naam van de listener mee, zonder haakjes. Met haakjes (doeIets()) roep je de functie meteen op en geef je het resultaat ervan door als listener — meestal niet wat je wil.',
    },
    {
      id: "t3",
      type: "open",
      question:
        "getElementsByClassName en getElementsByTagName geven een HTMLCollection terug. Hoe overloop je zo'n collection om met elk element iets te doen, en waarom gebruik je daarvoor .length?",
      answer:
        "Je gebruikt een for-lus die telt van 0 tot collection.length, en spreekt elk element aan met collection[i] (net zoals bij een array). Je gebruikt .length omdat je op voorhand niet weet hoeveel elementen er zijn — zo blijft je code werken ongeacht het aantal matches en hoef je niets te hardcoderen.",
    },
    {
      id: "t4",
      type: "mc",
      question:
        "Je wil de tekst van een paragraaf zonder kinderen vervangen door platte tekst (geen HTML). Welke property gebruik je het best?",
      options: [".style", ".className", ".textContent", ".value"],
      correctIndex: 2,
      explanation:
        "Met textContent zet je platte tekst; eventuele HTML-tags worden letterlijk overgenomen en niet als nodes verwerkt. innerHTML zou je gebruiken als je wél HTML wil laten interpreteren.",
    },
    {
      id: "t5",
      type: "open",
      question:
        'Uit een cel haal je de string "10.00 Eur". Hoe maak je daar een Number van om mee te rekenen, en hoe toon je een berekend bedrag nadien met exact 2 cijfers na de komma?',
      answer:
        'Je zet de string om met parseFloat(\"10.00 Eur\") — parseFloat negeert alles wat niet meer op een getal lijkt, dus het \" Eur\"-stuk wordt genegeerd en je krijgt het Number 10. Om een resultaat met 2 decimalen te tonen gebruik je getal.toFixed(2), wat een string teruggeeft (bv. (12.5).toFixed(2) geeft \"12.50\").',
    },
    {
      id: "t6",
      type: "mc",
      question:
        "Wanneer kies je beter voor .style (rechtstreeks een CSS-property zetten) i.p.v. een class toe te voegen met .className of .classList?",
      options: [
        "Altijd — .style is sneller dan classes",
        "Nooit — classes zijn altijd verplicht",
        "Wanneer er te veel mogelijke waarden zijn om een aparte class voor elke te maken, bv. een vrij gekozen rgb-kleur of een positie (left/top)",
        "Enkel als je geen CSS-bestand hebt",
      ],
      correctIndex: 2,
      explanation:
        "Normaal hou je opmaak in CSS-classes (presentatie blijft in de CSS). Maar bij een color picker (16,7 miljoen kleuren) of bewegende figuren (eindeloos veel posities) is een class per waarde onbegonnen werk; dan stel je de property rechtstreeks in via .style.",
    },
  ],

  exercises: [
    /* ── 1. paragrafen — HTMLCollection overlopen + class toevoegen ── */
    {
      id: "l15-paragrafen",
      chapterId: "labo15",
      chapter: "JavaScript deel 3 — events, CSS via JS & Number",
      n: 1,
      of: 7,
      title: "Belangrijke paragrafen laten opvallen",
      tag: "JS",
      difficulty: "medium",
      brief:
        'In de HTML staan vier paragrafen; de tweede en de vierde hebben de class <code>belangrijk</code>. In <code>styles/style.css</code> staan al regels: <code>.belangrijk</code> is dikgedrukt en <code>.opvallend</code> kleurt rood. Vul <code>scripts/code.js</code> aan binnen <code>setup</code>: haal álle elementen met class <code>belangrijk</code> op met <code>getElementsByClassName</code>, overloop die <code>HTMLCollection</code> met een <code>for</code>-lus en geef elk ervan óók de class <code>opvallend</code> (via <code>className</code>). Hardcodeer niet wélke paragrafen het zijn.',
      hint: 'const lijst = document.getElementsByClassName("belangrijk"); loop met for (let i = 0; i < lijst.length; i++) en doe lijst[i].className += " opvallend"; (let op de spatie zodat de bestaande class behouden blijft).',
      topics: ["getElementsByClassName", "HTMLCollection", "for", "className", "load event"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Paragrafen</title>\n</head>\n<body>\n  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n  <p class="belangrijk">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n  <p class="belangrijk">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "styles/style.css",
          content:
            ".belangrijk {\n  font-weight: bold;\n}\n\n.opvallend {\n  color: red;\n}\n",
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  // 1. haal alle elementen met class "belangrijk" op\n  // 2. overloop de HTMLCollection met een for-lus\n  // 3. geef elk element ook de class "opvallend" (gebruik className)\n};\n\nwindow.addEventListener("load", setup);',
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
          id: "gebcn-loop",
          label: "Je gebruikt getElementsByClassName en een for-lus",
          file: "scripts/code.js",
          must: ["getElementsByClassName", "/\\bfor\\b/", "className"],
        },
        {
          type: "css",
          id: "rood",
          label: "De belangrijke paragrafen staan in het rood (kleur rgb(255, 0, 0))",
          checks: [
            { selector: ".belangrijk", property: "color", equals: "rgb(255, 0, 0)" },
          ],
        },
        {
          type: "dom",
          id: "twee-opvallend",
          label: "Precies twee elementen hebben nu de class opvallend",
          assertions: [{ selector: ".opvallend", count: 2 }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const lijst = document.getElementsByClassName("belangrijk");\n\n  for (let i = 0; i < lijst.length; i++) {\n    lijst[i].className += " opvallend";\n  }\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 2. demo slider — addEventListener input/change + console ── */
    {
      id: "l15-slider-melding",
      chapterId: "labo15",
      chapter: "JavaScript deel 3 — events, CSS via JS & Number",
      n: 2,
      of: 7,
      title: "Slider die zijn waarde logt",
      tag: "JS",
      difficulty: "medium",
      brief:
        'De pagina bevat een schuifbalk: <code>&lt;input type="range" class="slider"&gt;</code>. Koppel in <code>setup</code> aan die slider zowel een <code>"input"</code>- als een <code>"change"</code>-listener (Chrome en Safari verwarren beide events). Telkens de waarde verandert, log je naar de console exact <code>de waarde van de slider is momenteel : <i>x</i></code>, waarbij <i>x</i> de huidige waarde is. Maak het gekleurde blokje (<code>.colorDemo</code>) bovendien rood via <code>.style</code>.',
      hint: 'Pak de slider met document.getElementsByClassName("slider")[0]. Schrijf een update-functie die console.log("de waarde van de slider is momenteel : " + slider.value) doet, en koppel die met addEventListener voor "input" én "change". Zet colorDemo.style.backgroundColor = "red".',
      topics: ["addEventListener", "input event", "change event", "console.log", "style"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Slider</title>\n</head>\n<body>\n  <p>Versleep de slider en kijk naar de console.</p>\n  <input type="range" class="slider" value="50" min="0" max="100">\n  <p>Een gekleurd blokje:</p>\n  <div class="colorDemo"></div>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "styles/style.css",
          content:
            ".colorDemo {\n  width: 100px;\n  height: 100px;\n  border: 1px solid black;\n}\n",
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  const slider = document.getElementsByClassName("slider")[0];\n  const blokje = document.getElementsByClassName("colorDemo")[0];\n\n  // 1. maak het blokje rood via .style\n  // 2. schrijf een update-functie die de waarde van de slider logt\n  // 3. koppel update aan zowel "input" als "change"\n};\n\nwindow.addEventListener("load", setup);',
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
          id: "twee-events",
          label: 'Je koppelt zowel "input" als "change"',
          file: "scripts/code.js",
          must: ['/addEventListener\\(\\s*["\']input["\']/', '/addEventListener\\(\\s*["\']change["\']/'],
        },
        {
          type: "console",
          id: "log-bij-sleep",
          label: 'Na het verslepen log je "de waarde van de slider is momenteel : 80"',
          before: [{ action: "input", selector: ".slider", value: "80" }],
          expected: "de waarde van de slider is momenteel : 80",
          match: "includes",
        },
        {
          type: "css",
          id: "blokje-rood",
          label: "Het blokje is rood (rgb(255, 0, 0))",
          checks: [
            { selector: ".colorDemo", property: "background-color", equals: "rgb(255, 0, 0)" },
          ],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const slider = document.getElementsByClassName("slider")[0];\n  const blokje = document.getElementsByClassName("colorDemo")[0];\n\n  blokje.style.backgroundColor = "red";\n\n  const update = () => {\n    console.log("de waarde van de slider is momenteel : " + slider.value);\n  };\n\n  slider.addEventListener("input", update);\n  slider.addEventListener("change", update);\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 3. colorpicker — 3 sliders -> rgb string via .style ── */
    {
      id: "l15-colorpicker",
      chapterId: "labo15",
      chapter: "JavaScript deel 3 — events, CSS via JS & Number",
      n: 3,
      of: 7,
      title: "Colorpicker met drie sliders",
      tag: "JS",
      difficulty: "hard",
      brief:
        'Er zijn drie sliders (classes <code>rood_slider</code>, <code>groen_slider</code>, <code>blauw_slider</code>, elk 0–255) en een vakje met id <code>color-box</code>. Schrijf in <code>setup</code> één <code>update</code>-functie die de drie waarden uitleest, ze als tekst toont in <code>#rood_value</code>, <code>#groen_value</code> en <code>#blauw_value</code> (via <code>textContent</code>), en het vakje de bijhorende kleur geeft met <code>colorBox.style.backgroundColor = `rgb(...)`</code>. Koppel <code>update</code> aan het <code>"input"</code>-event van elke slider.',
      hint: 'Lees r/g/b uit met slider.value. Zet bv. roodValue.textContent = r. Bouw de kleur met een template-string: `rgb(${r}, ${g}, ${b})` en zet die op colorBox.style.backgroundColor. Koppel dezelfde update-functie aan de drie sliders met addEventListener("input", update).',
      topics: ["addEventListener", "input event", "style", "textContent", "template strings"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Colorpicker</title>\n</head>\n<body>\n  <div>\n    <input type="range" class="rood_slider" min="0" max="255" value="0">\n    rood <span id="rood_value">0</span>\n  </div>\n  <div>\n    <input type="range" class="groen_slider" min="0" max="255" value="0">\n    groen <span id="groen_value">0</span>\n  </div>\n  <div>\n    <input type="range" class="blauw_slider" min="0" max="255" value="0">\n    blauw <span id="blauw_value">0</span>\n  </div>\n  <div id="color-box"></div>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "styles/style.css",
          content:
            "#color-box {\n  width: 150px;\n  height: 150px;\n  border: 2px solid #333;\n}\n",
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  const roodSlider = document.getElementsByClassName("rood_slider")[0];\n  const groenSlider = document.getElementsByClassName("groen_slider")[0];\n  const blauwSlider = document.getElementsByClassName("blauw_slider")[0];\n\n  const roodValue = document.getElementById("rood_value");\n  const groenValue = document.getElementById("groen_value");\n  const blauwValue = document.getElementById("blauw_value");\n\n  const colorBox = document.getElementById("color-box");\n\n  const update = () => {\n    // 1. lees de drie waarden uit\n    // 2. toon ze als tekst in de span-elementen (textContent)\n    // 3. zet colorBox.style.backgroundColor op rgb(r, g, b)\n  };\n\n  // koppel update aan het "input"-event van de drie sliders\n\n  update();\n};\n\nwindow.addEventListener("load", setup);',
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
          id: "style-en-textcontent",
          label: "Je gebruikt .style.backgroundColor en textContent",
          file: "scripts/code.js",
          must: ["backgroundColor", "textContent", "addEventListener"],
        },
        {
          type: "css",
          id: "kleur-na-sleep",
          label: "Sleep rood→200, groen→100, blauw→50 ⇒ vakje wordt rgb(200, 100, 50)",
          before: [
            { action: "input", selector: ".rood_slider", value: "200" },
            { action: "input", selector: ".groen_slider", value: "100" },
            { action: "input", selector: ".blauw_slider", value: "50" },
          ],
          checks: [
            { selector: "#color-box", property: "background-color", equals: "rgb(200, 100, 50)" },
          ],
        },
        {
          type: "dom",
          id: "labels-na-sleep",
          label: "De getoonde waarde naast rood is 200 na het verslepen",
          before: [{ action: "input", selector: ".rood_slider", value: "200" }],
          assertions: [{ selector: "#rood_value", textEquals: "200" }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const roodSlider = document.getElementsByClassName("rood_slider")[0];\n  const groenSlider = document.getElementsByClassName("groen_slider")[0];\n  const blauwSlider = document.getElementsByClassName("blauw_slider")[0];\n\n  const roodValue = document.getElementById("rood_value");\n  const groenValue = document.getElementById("groen_value");\n  const blauwValue = document.getElementById("blauw_value");\n\n  const colorBox = document.getElementById("color-box");\n\n  const update = () => {\n    const r = roodSlider.value;\n    const g = groenSlider.value;\n    const b = blauwSlider.value;\n\n    roodValue.textContent = r;\n    groenValue.textContent = g;\n    blauwValue.textContent = b;\n\n    colorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;\n  };\n\n  roodSlider.addEventListener("input", update);\n  groenSlider.addEventListener("input", update);\n  blauwSlider.addEventListener("input", update);\n\n  update();\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 4. kleurenwisselaar — onafhankelijke toggle-knoppen ── */
    {
      id: "l15-kleurenwisselaar",
      chapterId: "labo15",
      chapter: "JavaScript deel 3 — events, CSS via JS & Number",
      n: 4,
      of: 7,
      title: "Kleurenwisselaar met drie knoppen",
      tag: "JS",
      difficulty: "medium",
      brief:
        'Er staan drie knoppen op de pagina. Geef ze in <code>setup</code> eerst allemaal een witte achtergrond. Koppel daarna aan elke knop een klik-listener: bij een klik wordt de knop <code>blue</code>, bij een tweede klik weer <code>white</code>, enzovoort. Elke knop werkt <b>onafhankelijk</b> van de andere. Overloop de knoppen met <code>getElementsByTagName("button")</code> en een <code>for</code>-lus.',
      hint: 'Loop één keer om elke knop wit te maken (knoppen[i].style.backgroundColor = "white"). Loop nog eens om aan elke knop een click-listener te koppelen; lees binnenin knop.style.backgroundColor en zet hem op "blue" als hij "white" is, anders terug "white".',
      topics: ["getElementsByTagName", "for", "addEventListener", "click event", "style"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Kleurenwisselaar</title>\n</head>\n<body>\n  <button>Knop 1</button>\n  <button>Knop 2</button>\n  <button>Knop 3</button>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "styles/style.css",
          content:
            "button {\n  border: 3px solid black;\n  padding: 6px 12px;\n  font-size: 18px;\n}\n",
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  const knoppen = document.getElementsByTagName("button");\n\n  // 1. maak elke knop wit (style.backgroundColor = "white")\n\n  // 2. koppel aan elke knop een click-listener die wisselt tussen "blue" en "white"\n};\n\nwindow.addEventListener("load", setup);',
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
          id: "tag-loop-click",
          label: "Je gebruikt getElementsByTagName, een for-lus en een click-listener",
          file: "scripts/code.js",
          must: ["getElementsByTagName", "/\\bfor\\b/", '/addEventListener\\(\\s*["\']click["\']/'],
        },
        {
          type: "css",
          id: "start-wit",
          label: "Bij het laden zijn de knoppen wit (rgb(255, 255, 255))",
          checks: [
            { selector: "button", property: "background-color", equals: "rgb(255, 255, 255)" },
          ],
        },
        {
          type: "css",
          id: "klik-blauw",
          label: "Eén klik op de eerste knop maakt enkel die knop blauw (rgb(0, 0, 255))",
          before: [{ action: "click", selector: "button", times: 1 }],
          checks: [
            { selector: "button", property: "background-color", equals: "rgb(0, 0, 255)" },
          ],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const knoppen = document.getElementsByTagName("button");\n\n  for (let i = 0; i < knoppen.length; i++) {\n    knoppen[i].style.backgroundColor = "white";\n  }\n\n  for (let i = 0; i < knoppen.length; i++) {\n    knoppen[i].addEventListener("click", () => {\n      const knop = knoppen[i];\n      if (knop.style.backgroundColor === "white") {\n        knop.style.backgroundColor = "blue";\n      } else {\n        knop.style.backgroundColor = "white";\n      }\n    });\n  }\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 5. producten — parseFloat/parseInt/toFixed + herbereken ── */
    {
      id: "l15-producten",
      chapterId: "labo15",
      chapter: "JavaScript deel 3 — events, CSS via JS & Number",
      n: 5,
      of: 7,
      title: "Producten herberekenen",
      tag: "JS",
      difficulty: "hard",
      brief:
        'In de tabel hebben de prijscellen class <code>prijs</code> (bv. <code>10.00 Eur</code>), de aantalvelden class <code>aantal</code> (een <code>&lt;input type="number"&gt;</code>), de btw-cellen class <code>btw</code> (bv. <code>6%</code>) en de subtotaalcellen class <code>subtotaal</code>. Vul in <code>setup</code> de functie <code>herbereken</code> aan en koppel ze aan de klik op <code>#herbereken</code>. Per rij bereken je <code>prijs × aantal × (1 + btw/100)</code>, toon je dat in de subtotaalcel als <code>… Eur</code> met 2 decimalen, en tel je alles op tot het eindtotaal in <code>#totaal</code>. Lees de hardgecodeerde waarden uit de DOM (niets hardcoderen).',
      hint: 'Haal de cellen op met getElementsByClassName. In de lus: parseFloat(prijzen[i].textContent), parseInt(aantallen[i].value), parseInt(btw[i].textContent). Reken subtotaal uit, doe subtotaal.toFixed(2) en zet subtot[i].textContent = subtotaal + " Eur". Hou een lopend totaal bij en zet eindtotaal.textContent = totaal.toFixed(2) + " Eur".',
      topics: ["parseFloat", "parseInt", "toFixed", "textContent", "getElementsByClassName", "click event"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Producten</title>\n</head>\n<body>\n  <table>\n    <thead>\n      <tr><th>Product</th><th>Prijs</th><th>Aantal</th><th>BTW</th><th>Subtotaal</th></tr>\n    </thead>\n    <tbody>\n      <tr>\n        <td>Product 1</td>\n        <td class="prijs">10.00 Eur</td>\n        <td><input type="number" class="aantal" value="0"></td>\n        <td class="btw">6%</td>\n        <td class="subtotaal">0.00 Eur</td>\n      </tr>\n      <tr>\n        <td>Product 2</td>\n        <td class="prijs">15.00 Eur</td>\n        <td><input type="number" class="aantal" value="0"></td>\n        <td class="btw">21%</td>\n        <td class="subtotaal">0.00 Eur</td>\n      </tr>\n      <tr>\n        <td colspan="4"><b>Totaal</b></td>\n        <td id="totaal">0.00 Eur</td>\n      </tr>\n    </tbody>\n  </table>\n  <button id="herbereken">Herbereken</button>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "styles/style.css",
          content:
            "table, th, td {\n  border: 1px solid;\n  border-collapse: collapse;\n}\n",
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  const prijzen = document.getElementsByClassName("prijs");\n  const aantallen = document.getElementsByClassName("aantal");\n  const btwWaarde = document.getElementsByClassName("btw");\n  const subtot = document.getElementsByClassName("subtotaal");\n  const eindTotaal = document.getElementById("totaal");\n\n  const herbereken = () => {\n    let totaal = 0;\n\n    for (let i = 0; i < prijzen.length; i++) {\n      // 1. lees prijs (parseFloat), aantal (parseInt) en btw (parseInt) uit\n      // 2. bereken subtotaal = prijs * aantal * (1 + btw / 100)\n      // 3. toon het met 2 decimalen in subtot[i] en tel het bij totaal op\n    }\n\n    // 4. toon het eindtotaal in #totaal met 2 decimalen\n  };\n\n  document.getElementById("herbereken").addEventListener("click", herbereken);\n};\n\nwindow.addEventListener("load", setup);',
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
          id: "number-functies",
          label: "Je gebruikt parseFloat, parseInt en toFixed",
          file: "scripts/code.js",
          must: ["parseFloat", "parseInt", "toFixed"],
        },
        {
          type: "dom",
          id: "subtotaal-rij1",
          label: "2 stuks van Product 1 (10.00, 6% btw) geeft subtotaal 21.20 Eur",
          before: [
            { action: "input", selector: ".aantal", value: "2" },
            { action: "click", selector: "#herbereken", times: 1 },
          ],
          assertions: [
            { selector: ".subtotaal", textEquals: "21.20 Eur" },
          ],
        },
        {
          type: "dom",
          id: "totaal-correct",
          label: "Met 2 stuks van elk product klopt het eindtotaal (57.50 Eur)",
          before: [
            { action: "input", selector: ".aantal", value: "2" },
            { action: "click", selector: "#herbereken", times: 1 },
          ],
          assertions: [{ selector: "#totaal", textEquals: "57.50 Eur" }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const prijzen = document.getElementsByClassName("prijs");\n  const aantallen = document.getElementsByClassName("aantal");\n  const btwWaarde = document.getElementsByClassName("btw");\n  const subtot = document.getElementsByClassName("subtotaal");\n  const eindTotaal = document.getElementById("totaal");\n\n  const herbereken = () => {\n    let totaal = 0;\n\n    for (let i = 0; i < prijzen.length; i++) {\n      const prijs = parseFloat(prijzen[i].textContent);\n      const aantal = parseInt(aantallen[i].value, 10);\n      const btw = parseInt(btwWaarde[i].textContent, 10);\n\n      const subtotaal = prijs * aantal * (1 + btw / 100);\n      subtot[i].textContent = subtotaal.toFixed(2) + " Eur";\n      totaal += subtotaal;\n    }\n\n    eindTotaal.textContent = totaal.toFixed(2) + " Eur";\n  };\n\n  document.getElementById("herbereken").addEventListener("click", herbereken);\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 6. EIGEN — pure functie rond Number/toFixed ── */
    {
      id: "l15-prijs-formatteren",
      chapterId: "labo15",
      chapter: "JavaScript deel 3 — events, CSS via JS & Number",
      n: 6,
      of: 7,
      title: "Een prijs netjes formatteren",
      tag: "JS",
      difficulty: "easy",
      brief:
        'Schrijf een <code>globale</code> arrow-functie <code>formatPrijs(getal)</code> die het bedrag <code>return</code>t als een string met exact twee cijfers na de komma, gevolgd door <code>" Eur"</code>. Bv. <code>formatPrijs(10)</code> geeft <code>"10.00 Eur"</code> en <code>formatPrijs(3.5)</code> geeft <code>"3.50 Eur"</code>. (Hier gebruiken we GEEN setup: we testen de functie rechtstreeks.)',
      hint: "Gebruik de Number-method .toFixed(2): die geeft al een string met 2 decimalen terug. Plak daar met + de tekst \" Eur\" achter: const formatPrijs = (getal) => getal.toFixed(2) + \" Eur\";",
      topics: ["functions", "arrow", "return", "toFixed", "Number"],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf hier de globale arrow-functie formatPrijs(getal)\n// die bv. voor 10 de string \"10.00 Eur\" teruggeeft.\n",
        },
      ],
      checks: [
        {
          type: "function",
          id: "format-werkt",
          label: "formatPrijs formatteert correct met 2 decimalen en \" Eur\"",
          name: "formatPrijs",
          cases: [
            { args: [10], expected: "10.00 Eur" },
            { args: [3.5], expected: "3.50 Eur" },
            { args: [0], expected: "0.00 Eur" },
            { args: [12.345], expected: "12.35 Eur" },
          ],
        },
        {
          type: "static",
          id: "arrow-tofixed",
          label: "Je gebruikt een arrow function en toFixed",
          file: "scripts/code.js",
          must: ["/=>/", "toFixed"],
        },
        {
          type: "static",
          id: "no-var",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js": 'const formatPrijs = (getal) => getal.toFixed(2) + " Eur";',
      },
    },

    /* ── 7. EIGEN — HTMLCollection loop + textContent ── */
    {
      id: "l15-takenlijst-nummeren",
      chapterId: "labo15",
      chapter: "JavaScript deel 3 — events, CSS via JS & Number",
      n: 7,
      of: 7,
      title: "Taken automatisch nummeren",
      tag: "JS",
      difficulty: "medium",
      brief:
        'De pagina bevat een lijst van taken: meerdere <code>&lt;li&gt;</code>-elementen met class <code>taak</code>. Schrijf in <code>setup</code> code die alle taken ophaalt met <code>getElementsByClassName</code> en met een <code>for</code>-lus elke taak vóóraan nummert, zodat de tekst wordt <code>1. <i>(originele tekst)</i></code>, <code>2. …</code>, enzovoort. Gebruik <code>textContent</code> om de tekst te lezen én te overschrijven. Werk algemeen: het mag voor om het even hoeveel taken werken.',
      hint: 'const taken = document.getElementsByClassName("taak"); loop met for (let i = 0; i < taken.length; i++). Het nummer is i + 1 (want i begint bij 0). Lees de oude tekst met taken[i].textContent en zet taken[i].textContent = (i + 1) + ". " + oudeTekst.',
      topics: ["getElementsByClassName", "HTMLCollection", "for", "textContent", "load event"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Takenlijst</title>\n</head>\n<body>\n  <ul>\n    <li class="taak">Afwas doen</li>\n    <li class="taak">Stofzuigen</li>\n    <li class="taak">Boodschappen</li>\n  </ul>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  // 1. haal alle elementen met class "taak" op\n  // 2. overloop ze met een for-lus\n  // 3. zet de tekst om naar "<nummer>. <originele tekst>" via textContent\n};\n\nwindow.addEventListener("load", setup);',
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
          id: "loop-textcontent",
          label: "Je gebruikt getElementsByClassName, een for-lus en textContent",
          file: "scripts/code.js",
          must: ["getElementsByClassName", "/\\bfor\\b/", "textContent"],
        },
        {
          type: "dom",
          id: "eerste-taak",
          label: 'De eerste taak begint met "1. "',
          assertions: [{ selector: ".taak", textEquals: "1. Afwas doen" }],
        },
        {
          type: "dom",
          id: "alle-genummerd",
          label: "Er zijn drie genummerde taken in de lijst",
          assertions: [
            { selector: "ul", textIncludes: "1. Afwas doen" },
            { selector: "ul", textIncludes: "2. Stofzuigen" },
            { selector: "ul", textIncludes: "3. Boodschappen" },
          ],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const taken = document.getElementsByClassName("taak");\n\n  for (let i = 0; i < taken.length; i++) {\n    const oudeTekst = taken[i].textContent;\n    taken[i].textContent = (i + 1) + ". " + oudeTekst;\n  }\n};\n\nwindow.addEventListener("load", setup);',
      },
    },
  ],
};
