import type { ChapterContent } from "@/lib/types";

/* Labo 18 — JavaScript (deel 6): DOM-tree & nodes, events (addEventListener),
   event bubbling (target vs. currentTarget), het this-keyword en de colorpicker.
   Runner-conventie: elke .css -> <style>, elke .js -> <script> (einde body),
   elke .html -> body-markup. DOM-code zit in de setup-conventie en wordt
   gekoppeld aan het load-event. */

export const labo18: ChapterContent = {
  chapter: {
    id: "labo18",
    n: "18",
    title: "JavaScript deel 6: DOM-nodes & events",
    desc: "Selecteer DOM-nodes, reageer op events met addEventListener en bouw een colorpicker.",
    tag: "JS",
    difficulty: "medium",
  },
  theory: [
    {
      id: "t1",
      type: "mc",
      question:
        "Wat geeft document.querySelector(\".text\") terug als er meerdere elementen met class \"text\" bestaan?",
      options: [
        "Een NodeList met alle .text-elementen",
        "Het eerste element dat door de selector geselecteerd wordt",
        "Het laatste element dat door de selector geselecteerd wordt",
        "De waarde null",
      ],
      correctIndex: 1,
      explanation:
        "querySelector geeft een verwijzing naar het EERSTE passende element (of null als er geen is). Wil je alle elementen, gebruik dan querySelectorAll, dat een NodeList teruggeeft.",
    },
    {
      id: "t2",
      type: "mc",
      question:
        "Welke parameter krijgt een event listener-functie automatisch mee, en hoe achterhaal je daarmee het element waarop geklikt werd?",
      options: [
        "Een element-parameter; via element.id",
        "Een event-parameter; via event.target",
        "Een this-parameter; via this.target",
        "Geen parameter; je moet het element zelf opzoeken",
      ],
      correctIndex: 1,
      explanation:
        "Elke listener krijgt een event-object mee. event.target is het element waar het event ontstond (bv. waarop geklikt werd). event.currentTarget is het element waar de listener geregistreerd is.",
    },
    {
      id: "t3",
      type: "open",
      question:
        "Leg in je eigen woorden uit wat event bubbling is en wat het verschil is tussen event.target en event.currentTarget.",
      answer:
        "Bij event bubbling ontstaat een event op een element en borrelt het daarna omhoog door de DOM-tree, waardoor ook listeners van ancestors de kans krijgen te reageren. event.target is het element waar het event oorspronkelijk ontstond (bv. waarop geklikt werd); event.currentTarget is het element waarvan de listener nu uitgevoerd wordt. Vaak zijn ze gelijk, maar bij een listener op een ancestor verschillen ze.",
    },
    {
      id: "t4",
      type: "mc",
      question:
        "Waarom werkt het this-keyword niet zoals verwacht in een arrow function die als event listener gebruikt wordt?",
      options: [
        "Arrow functions hebben geen eigen this; this verwijst dan niet naar het element maar naar de omringende scope (bv. het Window-object)",
        "this is in elke functie verboden in deze cursus",
        "Arrow functions krijgen geen event-parameter",
        "this werkt enkel in functies die met var gedeclareerd zijn",
      ],
      correctIndex: 0,
      explanation:
        "Een arrow function heeft geen eigen this-binding. In een gewone function-listener verwijst this naar het element dat het event ontving, maar in een arrow function niet. Gebruik daarom event.currentTarget (of event.target): dat geeft altijd het juiste resultaat.",
    },
    {
      id: "t5",
      type: "open",
      question:
        "Noem een nadeel van werken met .innerHTML om nieuwe elementen toe te voegen, en welke node-methods je als alternatief kunt gebruiken.",
      answer:
        "Met .innerHTML vervang je telkens ALLE kinderen (bestaande verwijzingen en gekoppelde event listeners gaan verloren) en krijg je geen verwijzing naar de nieuwe elementen terug; de browser moet ook de HTML-tekst opnieuw ontleden. Als alternatief maak je nodes aan met document.createElement(...) (en eventueel document.createTextNode(...)) en voeg je ze toe via parent.appendChild(...); verwijderen doe je met parent.removeChild(...).",
    },
  ],
  exercises: [
    /* ── 1. demo events — klik kleurt paragraaf rood (event.target) ─────── */
    {
      id: "l18-demo-events",
      chapterId: "labo18",
      chapter: "JavaScript deel 6: DOM-nodes & events",
      n: 1,
      of: 6,
      title: "Klik maakt paragraaf rood",
      tag: "JS",
      difficulty: "easy",
      brief:
        "De pagina bevat meerdere <code>&lt;p class=\"text\"&gt;</code>-paragrafen. Selecteer ze in <code>setup</code> met <code>document.querySelectorAll(\".text\")</code> en koppel aan elke paragraaf een <code>click</code>-listener. Gebruik in de listener de <code>event</code>-parameter en zet <code>event.target.style.color</code> op <code>\"red\"</code>.",
      hint: 'Loop met een for-lus over de NodeList en doe texts[i].addEventListener("click", klik). Schrijf klik als const klik = (event) => { event.target.style.color = "red"; };',
      topics: ["querySelectorAll", "addEventListener", "event.target", "NodeList"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Demo events</title>\n</head>\n<body>\n  <p class="text">blablabla 1</p>\n  <p class="text">blablabla 2</p>\n  <p class="text">blablabla 3</p>\n  <p class="text">blablabla 4</p>\n  <p class="text">blablabla 5</p>\n  <p>Klik op een paragraaf om diens tekst rood te maken.</p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  // 1. selecteer alle paragrafen met class "text"\n  // 2. koppel aan elke paragraaf een "click"-listener (functie klik)\n};\n\n// schrijf hier de functie klik(event) die event.target rood maakt\n\nwindow.addEventListener("load", setup);',
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
          id: "uses-qsa-target",
          label: "Je gebruikt querySelectorAll, addEventListener en event.target",
          file: "scripts/code.js",
          must: ["querySelectorAll", "addEventListener", "/\\.target/"],
        },
        {
          type: "css",
          id: "klik-rood",
          label: "Na een klik op een paragraaf is die tekst rood",
          before: [{ action: "click", selector: ".text", times: 1 }],
          checks: [{ selector: ".text", property: "color", equals: "rgb(255, 0, 0)" }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const texts = document.querySelectorAll(".text");\n  for (let i = 0; i < texts.length; i++) {\n    texts[i].addEventListener("click", klik);\n  }\n};\n\nconst klik = (event) => {\n  event.target.style.color = "red";\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 2. oefening nodes 1 — querySelectorAll + tekst wijzigen ───────── */
    {
      id: "l18-nodes-1",
      chapterId: "labo18",
      chapter: "JavaScript deel 6: DOM-nodes & events",
      n: 2,
      of: 6,
      title: "Verander mij!",
      tag: "JS",
      difficulty: "easy",
      brief:
        "De pagina bevat één <code>&lt;p&gt;</code> met de tekst <code>Verander mij!</code>. Gebruik in <code>setup</code> de method <code>document.querySelectorAll(\"p\")</code> om het eerste p-element te vinden en zet de tekst om naar <code>Goed gedaan!</code>.",
      hint: 'querySelectorAll geeft een NodeList terug; pak het eerste element met [0]. Zet daarna element.textContent = "Goed gedaan!".',
      topics: ["querySelectorAll", "textContent", "NodeList"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Verander mij</title>\n</head>\n<body>\n  <p>Verander mij!</p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  // 1. selecteer alle p-elementen met querySelectorAll\n  // 2. zet de tekst van het eerste p-element op "Goed gedaan!"\n};\n\nwindow.addEventListener("load", setup);',
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
          id: "uses-qsa",
          label: "Je gebruikt querySelectorAll",
          file: "scripts/code.js",
          must: ["querySelectorAll"],
        },
        {
          type: "dom",
          id: "tekst-gewijzigd",
          label: 'De paragraaf toont "Goed gedaan!"',
          assertions: [{ selector: "p", textEquals: "Goed gedaan!" }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const paragrafen = document.querySelectorAll("p");\n  paragrafen[0].textContent = "Goed gedaan!";\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 3. oefening nodes 3 — createElement + appendChild bij klik ────── */
    {
      id: "l18-nodes-toevoegen",
      chapterId: "labo18",
      chapter: "JavaScript deel 6: DOM-nodes & events",
      n: 3,
      of: 6,
      title: "Paragraaf toevoegen bij klik",
      tag: "JS",
      difficulty: "medium",
      brief:
        "Bij een klik op de knop met id <code>toevoegen</code> moet er een nieuw <code>&lt;p&gt;</code>-element met de tekst <code>Toegevoegde paragraaf</code> in de <code>&lt;div id=\"myDIV\"&gt;</code> verschijnen. Maak het element aan met <code>document.createElement(\"p\")</code> en voeg het toe met <code>appendChild</code>.",
      hint: 'Koppel in setup een click-listener aan #toevoegen. Maak in die listener een p aan: const p = document.createElement("p"); p.textContent = "Toegevoegde paragraaf"; en doe document.getElementById("myDIV").appendChild(p).',
      topics: ["createElement", "appendChild", "addEventListener", "getElementById"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Node toevoegen</title>\n</head>\n<body>\n  <p>Klik op de knop om een p-element aan te maken.</p>\n  <div id="myDIV">Dit is een div-element</div>\n  <button id="toevoegen">klik om tekst toe te voegen</button>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "styles/style.css",
          content:
            "#myDIV {\n  border: 1px solid black;\n  margin-bottom: 10px;\n}",
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  // koppel een "click"-listener aan de knop met id "toevoegen"\n  // die functie maakt een p aan en plaatst hem in #myDIV\n};\n\nwindow.addEventListener("load", setup);',
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
          id: "uses-create-append",
          label: "Je gebruikt createElement en appendChild",
          file: "scripts/code.js",
          must: ["createElement", "appendChild"],
        },
        {
          type: "dom",
          id: "geen-p-voor-klik",
          label: "Vóór de klik staat er nog geen p in #myDIV",
          assertions: [{ selector: "#myDIV p", count: 0 }],
        },
        {
          type: "dom",
          id: "p-na-klik",
          label: 'Na de klik staat er een p met "Toegevoegde paragraaf" in #myDIV',
          before: [{ action: "click", selector: "#toevoegen", times: 1 }],
          assertions: [
            { selector: "#myDIV p", count: 1 },
            { selector: "#myDIV p", textEquals: "Toegevoegde paragraaf" },
          ],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const knop = document.getElementById("toevoegen");\n  knop.addEventListener("click", toevoegenP);\n};\n\nconst toevoegenP = () => {\n  const p = document.createElement("p");\n  p.textContent = "Toegevoegde paragraaf";\n  document.getElementById("myDIV").appendChild(p);\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 4. event bubbling — target vs currentTarget (dom + console) ──── */
    {
      id: "l18-bubbling",
      chapterId: "labo18",
      chapter: "JavaScript deel 6: DOM-nodes & events",
      n: 4,
      of: 6,
      title: "Bubbling: target vs. currentTarget",
      tag: "JS",
      difficulty: "medium",
      brief:
        "Koppel in <code>setup</code> één <code>click</code>-listener aan de <code>&lt;ul&gt;</code> (id <code>lijst</code>). Door event bubbling vangt die listener ook kliks op de <code>&lt;li&gt;</code>-kinderen op. Zet in de listener de tekst van <code>#uitvoer</code> op exact <code>target is LI, currentTarget is UL</code> met de waarden van <code>event.target.nodeName</code> en <code>event.currentTarget.nodeName</code>. Log diezelfde tekst ook naar de console.",
      hint: 'nodeName geeft hoofdletters (LI, UL). Bouw de tekst zo: const tekst = "target is " + event.target.nodeName + ", currentTarget is " + event.currentTarget.nodeName; en zet die zowel in #uitvoer (textContent) als in console.log.',
      topics: ["event bubbling", "event.target", "event.currentTarget", "nodeName"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Event bubbling</title>\n</head>\n<body>\n  <ul id="lijst">\n    <li class="item">test 1</li>\n    <li class="item">test 2</li>\n    <li class="item">test 3</li>\n  </ul>\n  <p id="uitvoer">Klik op een lijst-item.</p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  // koppel een "click"-listener (functie klik) aan de ul met id "lijst"\n};\n\n// schrijf hier de functie klik(event):\n//  - bouw de tekst met event.target.nodeName en event.currentTarget.nodeName\n//  - zet die tekst in #uitvoer en log ze ook naar de console\n\nwindow.addEventListener("load", setup);',
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
          id: "uses-currenttarget",
          label: "Je gebruikt event.target én event.currentTarget",
          file: "scripts/code.js",
          must: ["/\\.target/", "currentTarget"],
        },
        {
          type: "dom",
          id: "uitvoer-li-ul",
          label: 'Een klik op een li toont "target is LI, currentTarget is UL"',
          before: [{ action: "click", selector: ".item", times: 1 }],
          assertions: [{ selector: "#uitvoer", textEquals: "target is LI, currentTarget is UL" }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const lijst = document.getElementById("lijst");\n  lijst.addEventListener("click", klik);\n};\n\nconst klik = (event) => {\n  const tekst = "target is " + event.target.nodeName + ", currentTarget is " + event.currentTarget.nodeName;\n  document.getElementById("uitvoer").textContent = tekst;\n  console.log(tekst);\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 5. colorpicker — input-listeners updaten swatch + labels ─────── */
    {
      id: "l18-colorpicker",
      chapterId: "labo18",
      chapter: "JavaScript deel 6: DOM-nodes & events",
      n: 5,
      of: 6,
      title: "Colorpicker",
      tag: "JS",
      difficulty: "hard",
      brief:
        "Bouw de colorpicker af. Koppel aan elk van de drie sliders (<code>.rood_slider</code>, <code>.groen_slider</code>, <code>.blauw_slider</code>) een <code>input</code>-listener die dezelfde functie <code>updateColor</code> oproept. <code>updateColor</code> leest de drie <code>.value</code>'s, schrijft ze in <code>#rood_value</code>, <code>#groen_value</code> en <code>#blauw_value</code>, en zet de <code>backgroundColor</code> van <code>#color-box</code> op <code>rgb(r, g, b)</code>. Roep <code>updateColor</code> ook één keer op aan het einde van <code>setup</code>.",
      hint: 'Lees een slider met slider.value (een string). Bouw de kleur met een template string: `rgb(${r}, ${g}, ${b})`. Koppel listeners met slider.addEventListener("input", updateColor). De before-actie zet de slider-waarden via een input-actie.',
      topics: ["addEventListener", "input event", "value", "getElementById", "style.backgroundColor"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Colorpicker</title>\n</head>\n<body>\n  <div class="container">\n    <div class="sliders">\n      <div>\n        <input type="range" class="rood_slider" min="0" max="255" value="0">\n        <span>rood</span> <span id="rood_value">0</span>\n      </div>\n      <div>\n        <input type="range" class="groen_slider" min="0" max="255" value="0">\n        <span>groen</span> <span id="groen_value">0</span>\n      </div>\n      <div>\n        <input type="range" class="blauw_slider" min="0" max="255" value="0">\n        <span>blauw</span> <span id="blauw_value">0</span>\n      </div>\n    </div>\n    <div id="color-box"></div>\n  </div>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "styles/style.css",
          content:
            "body { font-family: Arial, sans-serif; padding: 20px; }\n.container { display: flex; gap: 40px; align-items: center; }\n.sliders > div { margin-bottom: 12px; }\ninput[type=\"range\"] { width: 200px; }\n#color-box { width: 150px; height: 150px; border: 2px solid #333; }",
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  const roodSlider = document.getElementsByClassName("rood_slider")[0];\n  const groenSlider = document.getElementsByClassName("groen_slider")[0];\n  const blauwSlider = document.getElementsByClassName("blauw_slider")[0];\n\n  const roodValue = document.getElementById("rood_value");\n  const groenValue = document.getElementById("groen_value");\n  const blauwValue = document.getElementById("blauw_value");\n\n  const colorBox = document.getElementById("color-box");\n\n  const updateColor = () => {\n    // 1. lees de drie slider-waarden (r, g, b)\n    // 2. toon ze in roodValue / groenValue / blauwValue\n    // 3. zet colorBox.style.backgroundColor op rgb(r, g, b)\n  };\n\n  // koppel aan elke slider een "input"-listener die updateColor oproept\n\n  // roep updateColor hier één keer op zodat de begintoestand klopt\n};\n\nwindow.addEventListener("load", setup);',
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
          id: "uses-input-listener",
          label: 'Je koppelt input-listeners met addEventListener("input", ...)',
          file: "scripts/code.js",
          must: ["addEventListener", "/[\"']input[\"']/"],
        },
        {
          type: "css",
          id: "box-kleur",
          label: "Na het verslepen van de rood-slider naar 255 is #color-box rood",
          before: [{ action: "input", selector: ".rood_slider", value: "255" }],
          checks: [
            { selector: "#color-box", property: "background-color", equals: "rgb(255, 0, 0)" },
          ],
        },
        {
          type: "dom",
          id: "label-update",
          label: "Het label #rood_value toont de slider-waarde 200",
          before: [{ action: "input", selector: ".rood_slider", value: "200" }],
          assertions: [{ selector: "#rood_value", textEquals: "200" }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const roodSlider = document.getElementsByClassName("rood_slider")[0];\n  const groenSlider = document.getElementsByClassName("groen_slider")[0];\n  const blauwSlider = document.getElementsByClassName("blauw_slider")[0];\n\n  const roodValue = document.getElementById("rood_value");\n  const groenValue = document.getElementById("groen_value");\n  const blauwValue = document.getElementById("blauw_value");\n\n  const colorBox = document.getElementById("color-box");\n\n  const updateColor = () => {\n    const r = roodSlider.value;\n    const g = groenSlider.value;\n    const b = blauwSlider.value;\n\n    roodValue.textContent = r;\n    groenValue.textContent = g;\n    blauwValue.textContent = b;\n\n    colorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;\n  };\n\n  roodSlider.addEventListener("input", updateColor);\n  groenSlider.addEventListener("input", updateColor);\n  blauwSlider.addEventListener("input", updateColor);\n\n  updateColor();\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 6. self-made — verwijder geklikt element via event.target ────── */
    {
      id: "l18-verwijder-bij-klik",
      chapterId: "labo18",
      chapter: "JavaScript deel 6: DOM-nodes & events",
      n: 6,
      of: 6,
      title: "Verwijder de geklikte foto",
      tag: "JS",
      difficulty: "medium",
      brief:
        "De <code>&lt;section id=\"galerij\"&gt;</code> bevat drie <code>&lt;img&gt;</code>'s. Koppel in <code>setup</code> één <code>click</code>-listener aan de <code>section</code> zelf (niet aan elke img). Dankzij event bubbling vang je zo elke klik op een afbeelding op. Verwijder met <code>event.target</code> de geklikte afbeelding uit de DOM-tree, maar enkel als er op een <code>IMG</code> geklikt werd.",
      hint: 'Koppel de listener aan #galerij. Controleer in de listener of event.target.nodeName === "IMG" en doe dan event.target.parentNode.removeChild(event.target) (of event.target.remove()).',
      topics: ["event bubbling", "event.target", "removeChild", "nodeName", "parentNode"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Galerij</title>\n</head>\n<body>\n  <p>Klik op een foto om ze te verwijderen.</p>\n  <section id="galerij">\n    <img id="foto1" class="foto" src="a.png" alt="foto 1">\n    <img class="foto" src="b.png" alt="foto 2">\n    <img class="foto" src="c.png" alt="foto 3">\n  </section>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  // koppel één "click"-listener (functie klik) aan de section met id "galerij"\n};\n\n// schrijf hier klik(event): verwijder event.target als er op een IMG geklikt werd\n\nwindow.addEventListener("load", setup);',
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
          id: "uses-target",
          label: "Je gebruikt event.target en één addEventListener",
          file: "scripts/code.js",
          must: ["/\\.target/", "addEventListener"],
        },
        {
          type: "dom",
          id: "start-drie",
          label: "Bij de start staan er 3 foto's",
          assertions: [{ selector: "#galerij img", count: 3 }],
        },
        {
          type: "dom",
          id: "na-klik-twee",
          label: "Na een klik op de eerste foto blijven er 2 over",
          before: [{ action: "click", selector: "#foto1", times: 1 }],
          assertions: [{ selector: "#galerij img", count: 2 }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const galerij = document.getElementById("galerij");\n  galerij.addEventListener("click", klik);\n};\n\nconst klik = (event) => {\n  if (event.target.nodeName === "IMG") {\n    event.target.parentNode.removeChild(event.target);\n  }\n};\n\nwindow.addEventListener("load", setup);',
      },
    },
  ],
};
