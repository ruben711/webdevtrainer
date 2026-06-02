import type { ChapterContent } from "@/lib/types";
import { chatExercise } from "./labo22-chat";

/* ════════════════════════════════════════════════════════════════════
   Labo 22 — My internet startpage (eindproject)
   Herhalingslabo: combineert DOM, events, arrays, objecten, Date, timers,
   JSON en (local)Storage uit labo 18 t/m 21.

   Belangrijk voor de runner: de grading-iframe draait in een opaque origin
   (sandbox="allow-scripts" zonder allow-same-origin). Daardoor gooit
   localStorage een SecurityError en is window.open geblokkeerd. De
   modeloplossingen vangen dat netjes op met try/catch — exact de robuuste
   stijl die je ook in productie wil — zodat de pagina blijft werken.
   ════════════════════════════════════════════════════════════════════ */

export const labo22: ChapterContent = {
  chapter: {
    id: "labo22",
    n: "22",
    title: "My internet startpage",
    desc: "Eindproject: bouw je eigen startpagina met klok, begroeting, snelle links en een zoek-history.",
    tag: "JS",
    difficulty: "hard",
  },
  theory: [
    {
      id: "t1",
      type: "mc",
      question:
        "Je wil een array van objecten bewaren in localStorage. Welke regel klopt?",
      options: [
        'localStorage.setItem("data", lijst);',
        'localStorage.setItem("data", JSON.stringify(lijst));',
        'localStorage.save("data", lijst);',
        'localStorage.setItem(JSON.parse(lijst));',
      ],
      correctIndex: 1,
      explanation:
        "localStorage bewaart enkel strings. Een array/object zet je daarom eerst om met JSON.stringify(...). Bij het uitlezen doe je het omgekeerde met JSON.parse(...).",
    },
    {
      id: "t2",
      type: "mc",
      question:
        "getItem geeft null terug als de sleutel nog niet bestaat. Wat is de veilige manier om je opgeslagen lijst terug op te bouwen?",
      options: [
        "Meteen JSON.parse() doen, null is toch een lege array.",
        "Eerst controleren of het resultaat niet null is, en pas dan JSON.parse() oproepen.",
        "localStorage.clear() oproepen voor je leest.",
        "Niets controleren, getItem geeft altijd een array terug.",
      ],
      correctIndex: 1,
      explanation:
        'const opgeslagen = localStorage.getItem("key"); if (opgeslagen !== null) { lijst = JSON.parse(opgeslagen); } — anders zou JSON.parse(null) fout lopen of een verkeerde waarde geven.',
    },
    {
      id: "t3",
      type: "mc",
      question:
        "Met welke Date-method haal je het uur (0 t/m 23) van het huidige tijdstip op?",
      options: ["getTime()", "getHour()", "getHours()", "getUur()"],
      correctIndex: 2,
      explanation:
        "new Date().getHours() geeft een getal van 0 tot 23. (getMinutes() en getSeconds() bestaan ook; getMonth() telt wel vanaf 0.)",
    },
    {
      id: "t4",
      type: "open",
      question:
        "Je wil een klok die élke seconde de tijd ververst. Welke timer-functie gebruik je daarvoor, en waarin verschilt die van setTimeout?",
      answer:
        "setInterval(fn, 1000) voert fn herhaaldelijk uit, elke 1000 milliseconden. setTimeout(fn, 1000) voert fn maar één keer uit na 1000 milliseconden. Voor een tikkende klok heb je dus setInterval nodig.",
    },
    {
      id: "t5",
      type: "open",
      question:
        "In de startpagina bewaar je elk uitgevoerd commando als object in een array. Waarom is een array van objecten hier handiger dan losse variabelen?",
      answer:
        "Je weet vooraf niet hoeveel commando's de gebruiker zal ingeven. Met een array kun je er telkens één bijduwen (.push) en later met een lus (forEach) alle items overlopen om de history op te bouwen. Elk object bundelt bovendien de bij elkaar horende gegevens (title, text, url) onder één naam.",
    },
  ],
  exercises: [
    /* ── 1. Begroeting op basis van het uur (pure functie) ─────────── */
    {
      id: "l22-begroeting",
      chapterId: "labo22",
      chapter: "My internet startpage",
      n: 1,
      of: 6,
      title: "Begroeting volgens het uur",
      tag: "JS",
      difficulty: "easy",
      brief:
        "Schrijf een <code>globale</code> arrow-functie <code>begroeting(uur)</code> die een passende begroeting <code>return</code>t op basis van het uur (0 t/m 23): " +
        "<code>0–5</code> &rarr; <code>Goedenacht</code>, <code>6–11</code> &rarr; <code>Goedemorgen</code>, <code>12–17</code> &rarr; <code>Goedemiddag</code>, <code>18–23</code> &rarr; <code>Goedenavond</code>. " +
        "(Geen <code>setup</code> nodig: we testen de functie rechtstreeks.)",
      hint: 'Gebruik if/else met vergelijkingen, bv. if (uur < 6) return "Goedenacht"; — werk van klein naar groot uur, of gebruik aparte grenzen (< 6, < 12, < 18).',
      topics: ["functions", "return", "arrow", "if/else", "vergelijkingen"],
      examples: [
        { label: "begroeting(8)", output: "Goedemorgen" },
        { label: "begroeting(14)", output: "Goedemiddag" },
        { label: "begroeting(23)", output: "Goedenavond" },
      ],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf hier de globale functie begroeting(uur).\n// Ze geeft een string terug op basis van het uur (0 t/m 23).\n",
        },
      ],
      checks: [
        {
          type: "function",
          id: "begroeting-werkt",
          label: "begroeting(uur) geeft de juiste begroeting terug",
          name: "begroeting",
          cases: [
            { args: [0], expected: "Goedenacht" },
            { args: [5], expected: "Goedenacht" },
            { args: [6], expected: "Goedemorgen" },
            { args: [11], expected: "Goedemorgen" },
            { args: [12], expected: "Goedemiddag" },
            { args: [17], expected: "Goedemiddag" },
            { args: [18], expected: "Goedenavond" },
            { args: [23], expected: "Goedenavond" },
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
          id: "no-var",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const begroeting = (uur) => {\n  if (uur < 6) {\n    return "Goedenacht";\n  }\n  if (uur < 12) {\n    return "Goedemorgen";\n  }\n  if (uur < 18) {\n    return "Goedemiddag";\n  }\n  return "Goedenavond";\n};',
      },
    },

    /* ── 2. Een tikkende klok (Date + setInterval + format-functie) ── */
    {
      id: "l22-klok",
      chapterId: "labo22",
      chapter: "My internet startpage",
      n: 2,
      of: 6,
      title: "Een tikkende klok",
      tag: "JS",
      difficulty: "medium",
      brief:
        "Bouw een klok bovenaan je startpagina. Werk in twee stappen in <code>scripts/code.js</code>. " +
        "<strong>(1)</strong> Schrijf een <code>globale</code> arrow-functie <code>formatTijd(uur, minuten, seconden)</code> die drie getallen krijgt en de tijd teruggeeft als <code>uu:mm:ss</code>, telkens met twee cijfers (dus <code>09:05:03</code>, niet <code>9:5:3</code>). " +
        "<strong>(2)</strong> Maak in <code>setup</code> een functie <code>toonTijd</code> die met <code>new Date()</code> de huidige tijd ophaalt (via <code>getHours()</code>, <code>getMinutes()</code>, <code>getSeconds()</code>), die via <code>formatTijd</code> formatteert en in <code>#klok</code> zet. " +
        "Roep <code>toonTijd</code> meteen één keer op én daarna elke seconde met <code>setInterval</code>.",
      hint:
        'Voor twee cijfers: const padNul = (n) => n < 10 ? "0" + n : "" + n; en formatTijd geeft dan padNul(uur) + ":" + padNul(minuten) + ":" + padNul(seconden). ' +
        'In toonTijd: const nu = new Date(); document.getElementById("klok").textContent = formatTijd(nu.getHours(), nu.getMinutes(), nu.getSeconds()); roep toonTijd() één keer op en doe setInterval(toonTijd, 1000).',
      topics: ["Date", "getHours", "setInterval", "functions", "return", "strings", "DOM"],
      examples: [
        { label: "formatTijd(9, 5, 3)", output: "09:05:03" },
        { label: "formatTijd(23, 59, 7)", output: "23:59:07" },
      ],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Klok</title>\n</head>\n<body>\n  <h1>Welkom</h1>\n  <p id="klok"></p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            '// 1. Globale functie: drie getallen -> "uu:mm:ss" (telkens 2 cijfers).\nconst formatTijd = (uur, minuten, seconden) => {\n  // TODO\n};\n\nconst setup = () => {\n  // 2. toonTijd: lees new Date(), formatteer met formatTijd en zet in #klok.\n  // Roep toonTijd meteen op en daarna elke seconde met setInterval.\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "function",
          id: "format-werkt",
          label: 'formatTijd(uur, minuten, seconden) geeft "uu:mm:ss" terug',
          name: "formatTijd",
          cases: [
            { args: [9, 5, 3], expected: "09:05:03" },
            { args: [23, 59, 7], expected: "23:59:07" },
            { args: [0, 0, 0], expected: "00:00:00" },
            { args: [13, 8, 0], expected: "13:08:00" },
          ],
        },
        {
          type: "dom",
          id: "klok-gevuld",
          label: "De klok toont een tijd in de vorm uu:mm:ss",
          assertions: [
            { selector: "#klok", textIncludes: ":" },
          ],
        },
        {
          type: "static",
          id: "gebruikt-date-interval",
          label: "Je gebruikt new Date, getHours en setInterval",
          file: "scripts/code.js",
          must: ["new Date", "getHours", "setInterval"],
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
        "scripts/code.js":
          '// Hulpfunctie: zet een getal < 10 om naar twee cijfers ("9" -> "09").\nconst padNul = (n) => (n < 10 ? "0" + n : "" + n);\n\nconst formatTijd = (uur, minuten, seconden) => {\n  return padNul(uur) + ":" + padNul(minuten) + ":" + padNul(seconden);\n};\n\nconst setup = () => {\n  const klok = document.getElementById("klok");\n\n  const toonTijd = () => {\n    const nu = new Date();\n    klok.textContent = formatTijd(nu.getHours(), nu.getMinutes(), nu.getSeconds());\n  };\n\n  toonTijd();\n  setInterval(toonTijd, 1000);\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 3. Snelle links uit een array (DOM) ───────────────────────── */
    {
      id: "l22-snelle-links",
      chapterId: "labo22",
      chapter: "My internet startpage",
      n: 3,
      of: 6,
      title: "Snelle links uit een array",
      tag: "JS",
      difficulty: "medium",
      brief:
        "Bouw de snelle-links van je startpagina dynamisch op. In <code>scripts/code.js</code> staat een array <code>links</code> met objecten " +
        "(<code>{ naam, url }</code>). Vul binnen <code>setup</code> de <code>&lt;ul id=\"links\"&gt;</code> met voor elk object een <code>&lt;li&gt;</code> " +
        "waarin een <code>&lt;a&gt;</code> zit: de <code>href</code> = de <code>url</code>, de tekst = de <code>naam</code>.",
      hint: 'Gebruik links.forEach((link) => { ... }). Maak per link een li met document.createElement("li") en een a met document.createElement("a"). Zet a.href = link.url; a.textContent = link.naam; voeg de a toe aan de li (li.appendChild(a)) en de li aan de ul.',
      topics: ["arrays", "forEach", "createElement", "appendChild", "setAttribute", "DOM"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Snelle links</title>\n</head>\n<body>\n  <h1>Snelle links</h1>\n  <ul id="links"></ul>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const links = [\n  { naam: "Google", url: "https://www.google.com" },\n  { naam: "YouTube", url: "https://www.youtube.com" },\n  { naam: "Wikipedia", url: "https://www.wikipedia.org" },\n];\n\nconst setup = () => {\n  const lijst = document.getElementById("links");\n  // 1. overloop elke link in de array\n  // 2. maak een <li> met daarin een <a> (href = url, tekst = naam)\n  // 3. voeg de <li> toe aan de <ul>\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "dom",
          id: "drie-items",
          label: "Er staan drie <li> met links in de lijst",
          assertions: [
            { selector: "#links li", count: 3 },
            { selector: "#links li a", count: 3 },
          ],
        },
        {
          type: "dom",
          id: "eerste-link-klopt",
          label: "De eerste link wijst naar Google",
          assertions: [
            { selector: "#links li:first-child a", textEquals: "Google" },
            {
              selector: "#links li:first-child a",
              attrEquals: { name: "href", value: "https://www.google.com" },
            },
          ],
        },
        {
          type: "static",
          id: "gebruikt-foreach",
          label: "Je gebruikt forEach en createElement",
          file: "scripts/code.js",
          must: ["forEach", "createElement"],
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
        "scripts/code.js":
          'const links = [\n  { naam: "Google", url: "https://www.google.com" },\n  { naam: "YouTube", url: "https://www.youtube.com" },\n  { naam: "Wikipedia", url: "https://www.wikipedia.org" },\n];\n\nconst setup = () => {\n  const lijst = document.getElementById("links");\n  links.forEach((link) => {\n    const li = document.createElement("li");\n    const a = document.createElement("a");\n    a.href = link.url;\n    a.textContent = link.naam;\n    li.appendChild(a);\n    lijst.appendChild(li);\n  });\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 4. Commando ontleden (pure functies, kern van het project) ── */
    {
      id: "l22-commando",
      chapterId: "labo22",
      chapter: "My internet startpage",
      n: 4,
      of: 6,
      title: "Een zoekcommando ontleden",
      tag: "JS",
      difficulty: "medium",
      brief:
        "De startpagina gebruikt commando's als <code>/g webdesign</code>: een prefix (<code>/g</code>, <code>/y</code>, <code>/x</code>, <code>/i</code>) + een spatie + de zoekopdracht. " +
        "Schrijf twee <code>globale</code> arrow-functies. " +
        "<code>siteNaam(prefix)</code> geeft de naam: <code>/g</code>&rarr;<code>Google</code>, <code>/y</code>&rarr;<code>YouTube</code>, <code>/x</code>&rarr;<code>X</code>, <code>/i</code>&rarr;<code>Instagram</code>. " +
        "<code>maakUrl(prefix, query)</code> geeft de zoek-URL: " +
        "Google &rarr; <code>https://www.google.com/search?q=</code> + query, YouTube &rarr; <code>https://www.youtube.com/results?search_query=</code> + query, " +
        "X &rarr; <code>https://x.com/hashtag/</code> + query, Instagram &rarr; <code>https://www.instagram.com/explore/tags/</code> + query.",
      hint: "Met if-vergelijkingen op de prefix kies je per geval de juiste naam/URL. In maakUrl plak je gewoon de query achter de basis-URL (string + string). Hou de waarden exact zoals in de opgave.",
      topics: ["functions", "return", "arrow", "if/else", "strings"],
      examples: [
        { label: 'siteNaam("/y")', output: "YouTube" },
        {
          label: 'maakUrl("/g", "webdesign")',
          output: "https://www.google.com/search?q=webdesign",
        },
      ],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// 1. siteNaam(prefix): geeft de naam van de website terug.\n// 2. maakUrl(prefix, query): geeft de volledige zoek-URL terug.\n// Beide globaal (niet in setup), want we testen ze rechtstreeks.\n",
        },
      ],
      checks: [
        {
          type: "function",
          id: "sitenaam-werkt",
          label: "siteNaam(prefix) geeft de juiste naam terug",
          name: "siteNaam",
          cases: [
            { args: ["/g"], expected: "Google" },
            { args: ["/y"], expected: "YouTube" },
            { args: ["/x"], expected: "X" },
            { args: ["/i"], expected: "Instagram" },
          ],
        },
        {
          type: "function",
          id: "maakurl-werkt",
          label: "maakUrl(prefix, query) bouwt de juiste URL",
          name: "maakUrl",
          cases: [
            {
              args: ["/g", "webdesign"],
              expected: "https://www.google.com/search?q=webdesign",
            },
            {
              args: ["/y", "arctic monkeys"],
              expected: "https://www.youtube.com/results?search_query=arctic monkeys",
            },
            {
              args: ["/x", "COVID19"],
              expected: "https://x.com/hashtag/COVID19",
            },
            {
              args: ["/i", "viveshwbkortrijk"],
              expected: "https://www.instagram.com/explore/tags/viveshwbkortrijk",
            },
          ],
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
        "scripts/code.js":
          'const siteNaam = (prefix) => {\n  if (prefix === "/g") return "Google";\n  if (prefix === "/y") return "YouTube";\n  if (prefix === "/x") return "X";\n  if (prefix === "/i") return "Instagram";\n  return "";\n};\n\nconst maakUrl = (prefix, query) => {\n  if (prefix === "/g") return "https://www.google.com/search?q=" + query;\n  if (prefix === "/y") return "https://www.youtube.com/results?search_query=" + query;\n  if (prefix === "/x") return "https://x.com/hashtag/" + query;\n  if (prefix === "/i") return "https://www.instagram.com/explore/tags/" + query;\n  return "";\n};',
      },
    },

    /* ── 5. EINDPROJECT: My internet startpage (DOM + storage + JSON) ─ */
    {
      id: "l22-startpagina",
      chapterId: "labo22",
      chapter: "My internet startpage",
      n: 5,
      of: 6,
      title: "Eindproject: My internet startpage",
      tag: "JS",
      difficulty: "hard",
      brief:
        "Bouw nu de startpagina. De gebruiker typt een commando (bv. <code>/g webdesign</code>) in <code>#input</code> en klikt op <code>#go</code>. " +
        "Maak in <code>setup</code> een klik-listener die: " +
        "<strong>(1)</strong> de input leest en split op de eerste spatie in een <code>prefix</code> en een <code>query</code>; " +
        "<strong>(2)</strong> bij een onbekende prefix (niet <code>/g /y /x /i</code>) stopt met een <code>alert</code> (en niets toevoegt); " +
        "<strong>(3)</strong> anders een geschiedenis-kaartje bouwt in <code>#history</code>: een <code>&lt;div class=\"card\"&gt;</code> met daarin " +
        "een <code>&lt;h5 class=\"card-title\"&gt;</code> (de sitenaam) en een <code>&lt;p class=\"card-text\"&gt;</code> (de query); " +
        "<strong>(4)</strong> het commando als object <code>{ title, text, url }</code> in de array <code>history</code> duwt en die in <code>localStorage</code> bewaart; " +
        "<strong>(5)</strong> de input terug leegmaakt. " +
        "Bij het laden lees je een bestaande <code>history</code> terug uit <code>localStorage</code> en teken je de kaartjes opnieuw. " +
        "De helpers <code>siteNaam</code> en <code>maakUrl</code> zijn al gegeven.",
      hint:
        'Lezen: const tekst = document.getElementById("input").value.trim(); const spatie = tekst.indexOf(" "); const prefix = tekst.substring(0, spatie); const query = tekst.substring(spatie + 1);. ' +
        'Maak een functie toonKaart(item) die één kaartje in #history tekent (createElement + appendChild + textContent) — die roep je zowel bij een nieuw commando als bij het herladen op. ' +
        "Omdat localStorage soms niet beschikbaar is, zet je het lezen/schrijven veilig in een try/catch.",
      topics: [
        "addEventListener",
        "DOM",
        "createElement",
        "appendChild",
        "arrays",
        "forEach",
        "objecten",
        "JSON",
        "localStorage",
      ],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>My internet startpage</title>\n</head>\n<body>\n  <h1>My internet startpage</h1>\n  <input id="input" placeholder="Bv. /g webdesign">\n  <button id="go">GO!</button>\n\n  <h2>History</h2>\n  <div id="history"></div>\n\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "styles/style.css",
          content:
            ".card {\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  padding: 12px;\n  margin-top: 8px;\n}\n\n.card-title {\n  margin: 0 0 4px 0;\n}\n\n.card-text {\n  margin: 0;\n}",
        },
        {
          name: "scripts/code.js",
          content:
            '// Gegeven helpers — laat deze staan.\nconst siteNaam = (prefix) => {\n  if (prefix === "/g") return "Google";\n  if (prefix === "/y") return "YouTube";\n  if (prefix === "/x") return "X";\n  if (prefix === "/i") return "Instagram";\n  return "";\n};\n\nconst maakUrl = (prefix, query) => {\n  if (prefix === "/g") return "https://www.google.com/search?q=" + query;\n  if (prefix === "/y") return "https://www.youtube.com/results?search_query=" + query;\n  if (prefix === "/x") return "https://x.com/hashtag/" + query;\n  if (prefix === "/i") return "https://www.instagram.com/explore/tags/" + query;\n  return "";\n};\n\n// Globale array met alle uitgevoerde commando\'s.\nlet history = [];\n\n// Tekent één kaartje in #history op basis van een item { title, text, url }.\nconst toonKaart = (item) => {\n  // TODO: maak een <div class="card"> met <h5 class="card-title"> en <p class="card-text">\n};\n\nconst setup = () => {\n  // TODO 1: lees een bestaande history uit localStorage (veilig met try/catch)\n  //         en teken voor elk item een kaartje met toonKaart.\n\n  // TODO 2: voeg aan #go een klik-listener toe die:\n  //  - de input leest en split in prefix + query\n  //  - bij een onbekende prefix een alert toont en stopt\n  //  - anders een item { title, text, url } maakt, in history duwt,\n  //    een kaartje tekent, in localStorage bewaart en de input leegmaakt.\n};\n\nwindow.addEventListener("load", setup);',
        },
      ],
      checks: [
        {
          type: "dom",
          id: "kaart-toegevoegd",
          label: 'Na "/g webdesign" + klik verschijnt er één kaartje',
          before: [
            { action: "input", selector: "#input", value: "/g webdesign" },
            { action: "click", selector: "#go" },
          ],
          assertions: [
            { selector: "#history .card", count: 1 },
            { selector: "#history .card-title", textEquals: "Google" },
            { selector: "#history .card-text", textEquals: "webdesign" },
          ],
        },
        {
          id: "meerdere-kaartjes",
          type: "dom",
          label: "Twee commando's na elkaar geven twee kaartjes in de history",
          before: [
            { action: "input", selector: "#input", value: "/g webdesign" },
            { action: "click", selector: "#go" },
            { action: "input", selector: "#input", value: "/y arctic monkeys" },
            { action: "click", selector: "#go" },
          ],
          assertions: [
            { selector: "#history .card", count: 2 },
            { selector: "#history .card:nth-of-type(2) .card-title", textEquals: "YouTube" },
            { selector: "#history .card:nth-of-type(2) .card-text", textEquals: "arctic monkeys" },
          ],
        },
        {
          id: "onbekende-prefix",
          type: "dom",
          label: "Een onbekende prefix voegt geen kaartje toe",
          before: [
            { action: "input", selector: "#input", value: "/b iets" },
            { action: "click", selector: "#go" },
          ],
          assertions: [{ selector: "#history .card", count: 0 }],
        },
        {
          type: "static",
          id: "conventies",
          label: "Je gebruikt addEventListener, localStorage en maakt de input leeg; geen var",
          file: "scripts/code.js",
          must: ["addEventListener", "localStorage", "/\\.value\\s*=\\s*[\"']{2}/"],
          mustNot: ["/\\bvar\\b/"],
        },
      ],
      solution: {
        "scripts/code.js":
          '// Gegeven helpers — laat deze staan.\nconst siteNaam = (prefix) => {\n  if (prefix === "/g") return "Google";\n  if (prefix === "/y") return "YouTube";\n  if (prefix === "/x") return "X";\n  if (prefix === "/i") return "Instagram";\n  return "";\n};\n\nconst maakUrl = (prefix, query) => {\n  if (prefix === "/g") return "https://www.google.com/search?q=" + query;\n  if (prefix === "/y") return "https://www.youtube.com/results?search_query=" + query;\n  if (prefix === "/x") return "https://x.com/hashtag/" + query;\n  if (prefix === "/i") return "https://www.instagram.com/explore/tags/" + query;\n  return "";\n};\n\n// Globale array met alle uitgevoerde commando\'s.\nlet history = [];\n\nconst toonKaart = (item) => {\n  const container = document.getElementById("history");\n\n  const card = document.createElement("div");\n  card.className = "card";\n\n  const titel = document.createElement("h5");\n  titel.className = "card-title";\n  titel.textContent = item.title;\n\n  const tekst = document.createElement("p");\n  tekst.className = "card-text";\n  tekst.textContent = item.text;\n\n  card.appendChild(titel);\n  card.appendChild(tekst);\n  container.appendChild(card);\n};\n\n// localStorage is in een sandbox niet altijd beschikbaar -> veilig opslaan/lezen.\nconst bewaar = () => {\n  try {\n    localStorage.setItem("history", JSON.stringify(history));\n  } catch (e) {\n    // opslaan kan mislukken (bv. in een sandbox); dan werken we gewoon zonder.\n  }\n};\n\nconst laad = () => {\n  try {\n    const opgeslagen = localStorage.getItem("history");\n    if (opgeslagen !== null) {\n      history = JSON.parse(opgeslagen);\n    }\n  } catch (e) {\n    history = [];\n  }\n};\n\nconst verwerk = () => {\n  const tekst = document.getElementById("input").value.trim();\n  const spatie = tekst.indexOf(" ");\n  if (spatie === -1) {\n    alert("Geef een commando én een zoekopdracht in.");\n    return;\n  }\n\n  const prefix = tekst.substring(0, spatie);\n  const query = tekst.substring(spatie + 1).trim();\n\n  const naam = siteNaam(prefix);\n  if (naam === "" || query === "") {\n    alert("Ongeldig commando: " + tekst);\n    return;\n  }\n\n  const item = {\n    title: naam,\n    text: query,\n    url: maakUrl(prefix, query),\n  };\n\n  history.push(item);\n  toonKaart(item);\n  bewaar();\n\n  // url openen in een nieuw tabblad (kan in een sandbox geblokkeerd zijn).\n  try {\n    window.open(item.url, "_blank");\n  } catch (e) {\n    // genegeerd\n  }\n\n  document.getElementById("input").value = "";\n};\n\nconst setup = () => {\n  laad();\n  history.forEach((item) => {\n    toonKaart(item);\n  });\n\n  const knop = document.getElementById("go");\n  knop.addEventListener("click", verwerk);\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 6. De ultieme oefening: een werkende chat ─────────────────── */
    chatExercise,
  ],
};
