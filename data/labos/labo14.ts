import type { ChapterContent } from "@/lib/types";

/* Labo 14 — JavaScript (deel 2): arrays, dialoogvensters, innerHTML lezen/aanpassen
   en strings (value uitlezen, substring). Cumulatief: GEEN DOM-events
   (addEventListener) — die komen pas in labo 18. DOM-code draait rechtstreeks in
   de setup-functie, gekoppeld aan het load-event. */

export const labo14: ChapterContent = {
  chapter: {
    id: "labo14",
    n: "14",
    title: "JavaScript deel 2",
    desc: "Arrays, dialoogvensters en tekst lezen/aanpassen in de DOM met innerHTML en substring.",
    tag: "JS",
    difficulty: "medium",
  },

  theory: [
    {
      id: "t1",
      type: "mc",
      question:
        "Je hebt een array familie = [\"Sander\", \"Jasper\", \"Lucas\"]. Welke uitdrukking geeft het aantal elementen (3) terug?",
      options: ["familie.count", "familie.length", "familie.size()", "familie.length()"],
      correctIndex: 1,
      explanation:
        "Een array heeft een property length (geen functie, dus zonder haakjes) die het aantal elementen teruggeeft.",
    },
    {
      id: "t2",
      type: "mc",
      question:
        "Met welke array-functie voeg je een element achteraan toe?",
      options: ["unshift", "shift", "push", "pop"],
      correctIndex: 2,
      explanation:
        "push voegt achteraan toe, pop verwijdert achteraan. shift/unshift werken vooraan. Dit werkt ook op een array die met const is gedeclareerd.",
    },
    {
      id: "t3",
      type: "open",
      question:
        "Wat is de return value van window.confirm(...) als de gebruiker op 'ok' klikt, en wat als die op 'cancel' klikt?",
      answer:
        "confirm geeft een boolean terug: true als de gebruiker op 'ok' klikt en false als die op 'cancel' klikt.",
    },
    {
      id: "t4",
      type: "open",
      question:
        "Wat geeft window.prompt(...) terug als de gebruiker tekst intypt en op 'ok' klikt, en wat als die op 'cancel' klikt?",
      answer:
        "Bij 'ok' geeft prompt de ingetypte tekst terug als string. Bij 'cancel' geeft prompt null terug.",
    },
    {
      id: "t5",
      type: "mc",
      question:
        'Wat is het resultaat van "appelboom".substring(2, 5)?',
      options: ['"appel"', '"pel"', '"pelb"', '"elb"'],
      correctIndex: 1,
      explanation:
        "substring(start, eind) telt vanaf index 0 tot (maar niet inclusief) de eindindex. Indexen 2,3,4 zijn p, e, l → \"pel\".",
    },
    {
      id: "t6",
      type: "open",
      question:
        'Waarom moet code die de DOM uitleest of aanpast in een setup-functie staan die je koppelt met window.addEventListener("load", setup)?',
      answer:
        "De browser voert <script> uit terwijl hij de pagina nog opbouwt. Pas na het load-event is de hele DOM-tree klaar. Door je code in setup te zetten en die aan load te koppelen, draait ze pas wanneer alle elementen bestaan.",
    },
  ],

  exercises: [
    /* ── 1. Arrays + console ───────────────────────────────────── */
    {
      id: "l14-arrays",
      chapterId: "labo14",
      chapter: "JavaScript deel 2",
      n: 1,
      of: 7,
      title: "Familieleden in een array",
      tag: "JS",
      difficulty: "easy",
      brief:
        "Maak in <code>scripts/code.js</code> een array <code>familieleden</code> met exact deze vijf namen, in deze volgorde: <code>Sander</code>, <code>Jasper</code>, <code>Lucas</code>, <code>Jona</code>, <code>Bent</code>. Log daarna met <code>console.log</code>: eerst het aantal elementen (gebruik <code>.length</code>), dan het eerste, het derde en het vijfde element.",
      hint: 'Een array maak je met const familieleden = ["Sander", ...]. Het aantal elementen is familieleden.length. Het eerste element is familieleden[0], het derde familieleden[2], het vijfde familieleden[4].',
      topics: ["arrays", "length", "index", "console.log"],
      examples: [{ label: "Console", output: "5\nSander\nLucas\nBent" }],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// 1. Maak een array familieleden met 5 namen.\n// 2. Log het aantal elementen (.length).\n// 3. Log het eerste, derde en vijfde element.\n\n",
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
          type: "console",
          id: "logt-lengte",
          label: "Je logt het aantal elementen (5)",
          expected: "5",
          match: "includes",
        },
        {
          type: "console",
          id: "logt-elementen",
          label: 'Je logt het eerste, derde en vijfde element (Sander, Lucas, Bent)',
          expected: "Sander\nLucas\nBent",
          match: "includes",
        },
      ],
      solution: {
        "scripts/code.js":
          'const familieleden = ["Sander", "Jasper", "Lucas", "Jona", "Bent"];\n\nconsole.log(familieleden.length);\nconsole.log(familieleden[0]);\nconsole.log(familieleden[2]);\nconsole.log(familieleden[4]);',
      },
    },

    /* ── 2. push / pass-by-reference (pure function) ───────────── */
    {
      id: "l14-voegnaamtoe",
      chapterId: "labo14",
      chapter: "JavaScript deel 2",
      n: 2,
      of: 7,
      title: "Een naam toevoegen (pass-by-reference)",
      tag: "JS",
      difficulty: "medium",
      brief:
        "Schrijf een <code>globale</code> functie <code>voegNaamToe(array, naam)</code> die <code>naam</code> achteraan aan <code>array</code> toevoegt met <code>push</code> en daarna het nieuwe aantal elementen (de nieuwe <code>length</code>) <code>return</code>t. Omdat een array via referentie wordt doorgegeven, blijft de toevoeging zichtbaar in de oorspronkelijke array.",
      hint: "const voegNaamToe = (array, naam) => { array.push(naam); return array.length; }; — push wijzigt de array zelf (pass-by-reference).",
      topics: ["arrays", "push", "functions", "return", "pass-by-reference"],
      examples: [
        { input: 'voegNaamToe(["Sander"], "Bent")', output: "2" },
        { input: 'voegNaamToe([], "Lucas")', output: "1" },
      ],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf de globale functie voegNaamToe(array, naam).\n// Voeg naam achteraan toe met push en geef de nieuwe length terug.\n\n",
        },
      ],
      checks: [
        {
          type: "function",
          id: "voegnaamtoe-werkt",
          label: "voegNaamToe voegt toe en geeft de nieuwe length terug",
          name: "voegNaamToe",
          cases: [
            { args: [["Sander"], "Bent"], expected: 2 },
            { args: [[], "Lucas"], expected: 1 },
            { args: [["a", "b", "c"], "d"], expected: 4 },
          ],
        },
        {
          type: "static",
          id: "gebruikt-push",
          label: "Je gebruikt push",
          file: "scripts/code.js",
          must: ["push"],
        },
        {
          type: "static",
          id: "arrow",
          label: "Je gebruikt een arrow function",
          file: "scripts/code.js",
          must: ["/=>/"],
        },
      ],
      solution: {
        "scripts/code.js":
          "const voegNaamToe = (array, naam) => {\n  array.push(naam);\n  return array.length;\n};",
      },
    },

    /* ── 3. innerHTML aanpassen in setup (dom) ─────────────────── */
    {
      id: "l14-innerhtml",
      chapterId: "labo14",
      chapter: "JavaScript deel 2",
      n: 3,
      of: 7,
      title: "Tekst wijzigen met innerHTML",
      tag: "JS",
      difficulty: "easy",
      brief:
        'In de body staat <code>&lt;p id="txtOutput"&gt;Hello world!&lt;/p&gt;</code>. Vul <code>setup</code> in <code>scripts/code.js</code> aan: haal het element op met <code>getElementById</code> en zet zijn <code>innerHTML</code> op <code>Welkom!</code>. Na het laden van de pagina mag er dus geen "Hello world!" meer staan, maar "Welkom!".',
      hint: 'In setup: const pElement = document.getElementById("txtOutput"); pElement.innerHTML = "Welkom!";',
      topics: ["getElementById", "innerHTML", "setup", "load"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>innerHTML</title>\n</head>\n<body>\n  <p id="txtOutput">Hello world!</p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  // 1. haal het element met id "txtOutput" op\n  // 2. zet zijn innerHTML op "Welkom!"\n};\n\nwindow.addEventListener("load", setup);',
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
          id: "gebruikt-innerhtml",
          label: "Je gebruikt innerHTML",
          file: "scripts/code.js",
          must: ["innerHTML"],
        },
        {
          type: "dom",
          id: "toont-welkom",
          label: 'Na het laden staat er "Welkom!" in #txtOutput',
          assertions: [{ selector: "#txtOutput", textEquals: "Welkom!" }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const pElement = document.getElementById("txtOutput");\n  pElement.innerHTML = "Welkom!";\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 4. value uitlezen + textContent (dom) ─────────────────── */
    {
      id: "l14-kopieer",
      chapterId: "labo14",
      chapter: "JavaScript deel 2",
      n: 4,
      of: 7,
      title: "Een tekstveld uitlezen",
      tag: "JS",
      difficulty: "medium",
      brief:
        'Het tekstveld <code>#txtInput</code> heeft al een ingevulde waarde. Vul <code>setup</code> aan: lees de <code>value</code> van <code>#txtInput</code> uit en zet die tekst in de paragraaf <code>#txtOutput</code> (gebruik <code>textContent</code>). Na het laden moet in <code>#txtOutput</code> dezelfde tekst staan als in het veld.',
      hint: 'In setup: const tekst = document.getElementById("txtInput").value; document.getElementById("txtOutput").textContent = tekst;',
      topics: ["getElementById", "value", "textContent", "setup"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Kopieer</title>\n</head>\n<body>\n  <input id="txtInput" type="text" value="CodeKwartier">\n  <p id="txtOutput">geen output</p>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  // 1. lees de value van #txtInput uit\n  // 2. zet die tekst in #txtOutput met textContent\n};\n\nwindow.addEventListener("load", setup);',
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
          id: "gebruikt-value",
          label: "Je leest .value uit",
          file: "scripts/code.js",
          must: [".value"],
        },
        {
          type: "dom",
          id: "kopieert-tekst",
          label: 'Na het laden staat "CodeKwartier" in #txtOutput',
          assertions: [{ selector: "#txtOutput", textEquals: "CodeKwartier" }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const tekst = document.getElementById("txtInput").value;\n  document.getElementById("txtOutput").textContent = tekst;\n};\n\nwindow.addEventListener("load", setup);',
      },
    },

    /* ── 5. substring (pure function) ──────────────────────────── */
    {
      id: "l14-substring",
      chapterId: "labo14",
      chapter: "JavaScript deel 2",
      n: 5,
      of: 7,
      title: "Een stuk uit een tekst knippen",
      tag: "JS",
      difficulty: "medium",
      brief:
        "Schrijf een <code>globale</code> functie <code>knip(tekst, start, eind)</code> die met <code>substring</code> het deel van <code>tekst</code> tussen index <code>start</code> en <code>eind</code> teruggeeft. Voorbeeld: <code>knip(\"appelboom\", 2, 5)</code> geeft <code>\"pel\"</code>.",
      hint: "const knip = (tekst, start, eind) => tekst.substring(start, eind); — substring telt vanaf 0 tot (niet inclusief) eind.",
      topics: ["strings", "substring", "functions", "return"],
      examples: [
        { input: 'knip("appelboom", 2, 5)', output: "pel" },
        { input: 'knip("JavaScript", 0, 4)', output: "Java" },
      ],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf de globale functie knip(tekst, start, eind) met substring.\n\n",
        },
      ],
      checks: [
        {
          type: "function",
          id: "knip-werkt",
          label: "knip geeft het juiste deel van de tekst terug",
          name: "knip",
          cases: [
            { args: ["appelboom", 2, 5], expected: "pel" },
            { args: ["JavaScript", 0, 4], expected: "Java" },
            { args: ["CodeKwartier", 4, 12], expected: "Kwartier" },
          ],
        },
        {
          type: "static",
          id: "gebruikt-substring",
          label: "Je gebruikt substring",
          file: "scripts/code.js",
          must: ["substring"],
        },
      ],
      solution: {
        "scripts/code.js":
          "const knip = (tekst, start, eind) => tekst.substring(start, eind);",
      },
    },

    /* ── 6. ZELF: initialen uit een array (pure function) ──────── */
    {
      id: "l14-initialen",
      chapterId: "labo14",
      chapter: "JavaScript deel 2",
      n: 6,
      of: 7,
      title: "Initialen uit namen",
      tag: "JS",
      difficulty: "hard",
      brief:
        "Schrijf een <code>globale</code> functie <code>initialen(namen)</code> die een array van namen krijgt en één string teruggeeft met de eerste letter van elke naam, gescheiden door punten. Voorbeeld: <code>initialen([\"Sander\", \"Jasper\", \"Bent\"])</code> geeft <code>\"S.J.B\"</code>. Gebruik <code>.length</code> en <code>substring</code> (of indexering) om over de namen te lopen.",
      hint: 'Begin met een lege string. Loop met een for-lus van 0 tot namen.length. Neem per naam de eerste letter (naam.substring(0, 1)). Zet een punt voor elke letter behalve de eerste.',
      topics: ["arrays", "length", "substring", "loops", "strings"],
      examples: [
        { input: 'initialen(["Sander", "Jasper", "Bent"])', output: "S.J.B" },
        { input: 'initialen(["Lucas"])', output: "L" },
      ],
      files: [
        {
          name: "scripts/code.js",
          content:
            "// Schrijf de globale functie initialen(namen).\n// Geef de eerste letter van elke naam terug, gescheiden door punten.\n\n",
        },
      ],
      checks: [
        {
          type: "function",
          id: "initialen-werkt",
          label: "initialen bouwt de juiste string met punten",
          name: "initialen",
          cases: [
            { args: [["Sander", "Jasper", "Bent"]], expected: "S.J.B" },
            { args: [["Lucas"]], expected: "L" },
            { args: [["Jona", "Pim", "Sara", "Tijn"]], expected: "J.P.S.T" },
          ],
        },
        {
          type: "static",
          id: "no-var",
          label: "Je gebruikt geen var",
          file: "scripts/code.js",
          mustNot: ["/\\bvar\\b/"],
        },
        {
          type: "static",
          id: "gebruikt-length",
          label: "Je gebruikt .length",
          file: "scripts/code.js",
          must: [".length"],
        },
      ],
      solution: {
        "scripts/code.js":
          'const initialen = (namen) => {\n  let resultaat = "";\n  for (let i = 0; i < namen.length; i = i + 1) {\n    const letter = namen[i].substring(0, 1);\n    if (i === 0) {\n      resultaat = letter;\n    } else {\n      resultaat = resultaat + "." + letter;\n    }\n  }\n  return resultaat;\n};',
      },
    },

    /* ── 7. ZELF: array -> lijst met innerHTML (setup, dom) ────── */
    {
      id: "l14-namenlijst",
      chapterId: "labo14",
      chapter: "JavaScript deel 2",
      n: 7,
      of: 7,
      title: "Een array tonen als lijst",
      tag: "JS",
      difficulty: "hard",
      brief:
        'In de body staat een leeg lijstelement <code>&lt;ul id="lijst"&gt;&lt;/ul&gt;</code>. Maak in <code>setup</code> een array met exact <code>Appel</code>, <code>Peer</code>, <code>Banaan</code> en vul de <code>innerHTML</code> van <code>#lijst</code> met een <code>&lt;li&gt;</code>-element per fruitsoort. Na het laden moeten er drie <code>&lt;li&gt;</code>\'s in de lijst staan.',
      hint: 'Bouw een string op: loop over de array en doe per element html = html + "<li>" + array[i] + "</li>". Zet daarna document.getElementById("lijst").innerHTML = html;',
      topics: ["arrays", "loops", "innerHTML", "setup", "DOM"],
      files: [
        {
          name: "index.html",
          content:
            '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet" href="styles/style.css">\n  <title>Namenlijst</title>\n</head>\n<body>\n  <ul id="lijst"></ul>\n  <script type="text/javascript" charset="utf-8" src="scripts/code.js"></script>\n</body>\n</html>',
          readOnly: true,
        },
        {
          name: "scripts/code.js",
          content:
            'const setup = () => {\n  // 1. maak een array met "Appel", "Peer", "Banaan"\n  // 2. bouw een string met een <li> per element\n  // 3. zet die in de innerHTML van #lijst\n};\n\nwindow.addEventListener("load", setup);',
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
          id: "gebruikt-innerhtml",
          label: "Je gebruikt innerHTML",
          file: "scripts/code.js",
          must: ["innerHTML"],
        },
        {
          type: "dom",
          id: "drie-items",
          label: "Er staan exact 3 <li>-elementen in de lijst",
          assertions: [{ selector: "#lijst li", count: 3 }],
        },
        {
          type: "dom",
          id: "eerste-item",
          label: 'Het eerste item is "Appel"',
          assertions: [{ selector: "#lijst li", textIncludes: "Appel" }],
        },
      ],
      solution: {
        "scripts/code.js":
          'const setup = () => {\n  const fruit = ["Appel", "Peer", "Banaan"];\n  let html = "";\n  for (let i = 0; i < fruit.length; i = i + 1) {\n    html = html + "<li>" + fruit[i] + "</li>";\n  }\n  document.getElementById("lijst").innerHTML = html;\n};\n\nwindow.addEventListener("load", setup);',
      },
    },
  ],
};
