// Mock data for the web-dev exercise prototype (Dutch). Plain JS -> window.
// Structure is intentionally simple so real chapters/course material can be
// dropped in later via Claude Code.

window.APP_DATA = (function () {
  const user = {
    name: "Jij",
    handle: "@jij",
    level: 7,
    xp: 4820,
    xpToNext: 5200,
    streak: 12,
    rank: 4,
    solved: 73,
    accuracy: 89,
    minutes: 1140,
  };

  // chapters / blocks
  const chapters = [
    {
      id: "html",
      n: "01",
      title: "HTML Basis",
      desc: "Structuur, semantiek en de bouwstenen van elke pagina.",
      tag: "HTML",
      total: 12, done: 12,
      difficulty: "Makkelijk",
      hue: 18,
      locked: false,
    },
    {
      id: "css",
      n: "02",
      title: "CSS Styling",
      desc: "Selectors, het box-model, kleuren en typografie.",
      tag: "CSS",
      total: 14, done: 11,
      difficulty: "Makkelijk",
      hue: 265,
      locked: false,
    },
    {
      id: "layout",
      n: "03",
      title: "Flexbox & Grid",
      desc: "Moderne layouts bouwen die op elk scherm werken.",
      tag: "CSS",
      total: 16, done: 9,
      difficulty: "Gemiddeld",
      hue: 200,
      locked: false,
    },
    {
      id: "js",
      n: "04",
      title: "JavaScript Basis",
      desc: "Variabelen, functies, condities en loops.",
      tag: "JS",
      total: 18, done: 6,
      difficulty: "Gemiddeld",
      hue: 48,
      locked: false,
    },
    {
      id: "dom",
      n: "05",
      title: "DOM Manipulatie",
      desc: "De pagina aanpassen en tot leven brengen met JS.",
      tag: "JS",
      total: 15, done: 2,
      difficulty: "Gemiddeld",
      hue: 320,
      locked: false,
    },
    {
      id: "events",
      n: "06",
      title: "Events & Formulieren",
      desc: "Reageren op de gebruiker en input verwerken.",
      tag: "JS",
      total: 13, done: 0,
      difficulty: "Gemiddeld",
      hue: 150,
      locked: false,
    },
    {
      id: "responsive",
      n: "07",
      title: "Responsive Design",
      desc: "Media queries en mobiel-eerst denken.",
      tag: "CSS",
      total: 11, done: 0,
      difficulty: "Pittig",
      hue: 230,
      locked: true,
    },
    {
      id: "async",
      n: "08",
      title: "Async & Fetch",
      desc: "Data ophalen, promises en async/await.",
      tag: "JS",
      total: 14, done: 0,
      difficulty: "Pittig",
      hue: 285,
      locked: true,
    },
  ];

  // a few exercises for one chapter so the exercise screen feels real
  const exercises = {
    css: [
      { id: "css-1", title: "Tekst centreren", difficulty: "Makkelijk", xp: 40, done: true },
      { id: "css-2", title: "Een knop stylen", difficulty: "Makkelijk", xp: 50, done: true },
      { id: "css-3", title: "Kleuren & achtergrond", difficulty: "Gemiddeld", xp: 70, done: false, active: true },
      { id: "css-4", title: "Het box-model", difficulty: "Gemiddeld", xp: 80, done: false },
      { id: "css-5", title: "Hover-effecten", difficulty: "Pittig", xp: 110, done: false, locked: true },
    ],
  };

  // the active exercise — multi-file, JS-focused, behaviourally testable.
  // Run convention: every *.html file = body, *.css = <style>, *.js = <script> (in order).
  const activeExercise = {
    id: "dom-2",
    chapter: "DOM Manipulatie",
    chapterId: "dom",
    n: 2,
    of: 15,
    xp: 90,
    difficulty: "Gemiddeld",
    title: "Bouw een tel-knop",
    brief:
      "De HTML en opmaak staan klaar. Schrijf in <script.js> de logica: voeg een klik-listener toe aan de knop met id <inc> zodat het getal in <#count> bij elke klik met 1 omhoog gaat.",
    hint: "Tip: gebruik document.getElementById(\"inc\") en element.addEventListener(\"click\", ...). Houd de stand bij in een variabele en zet element.textContent.",
    // file tree the student starts with (can add/edit/delete files)
    files: [
      { name: "index.html", content: `<main>
  <h1>Teller</h1>
  <button id="inc">+1</button>
  <p>Aantal kliks: <span id="count">0</span></p>
</main>` },
      { name: "styles.css", content: `body { font-family: system-ui, sans-serif; color: #18150d; }
main { display: grid; gap: 14px; place-content: start; padding: 8px; }
h1 { font-size: 20px; margin: 0; }
button {
  font: 600 15px system-ui; padding: 10px 18px;
  border: 1px solid #18150d; background: #fff; border-radius: 4px; cursor: pointer;
}
button:active { transform: translateY(1px); }
#count { font-weight: 700; }` },
      { name: "script.js", content: `// Schrijf hier je code.
// 1. pak de knop met id "inc"
// 2. luister naar "click"
// 3. verhoog #count met 1

` },
    ],
    objectives: [
      { id: "listener", label: "Er reageert iets op een klik op #inc" },
      { id: "increment", label: "Een klik verhoogt de teller" },
      { id: "three", label: "Na 3 kliks staat er 3" },
      { id: "ael", label: "Je gebruikt addEventListener" },
    ],
    // model answer for "toon oplossing" (only script.js changes)
    solution: { "script.js": `const knop = document.getElementById("inc");
const teller = document.getElementById("count");
let aantal = 0;

knop.addEventListener("click", () => {
  aantal = aantal + 1;
  teller.textContent = aantal;
});` },
  };

  const leaderboard = [
    { rank: 1, name: "Lotte V.", handle: "@lotte", xp: 8420, level: 11, streak: 28, delta: 0, you: false },
    { rank: 2, name: "Sem D.", handle: "@semd", xp: 7980, level: 10, streak: 21, delta: 2, you: false },
    { rank: 3, name: "Noa K.", handle: "@noak", xp: 7110, level: 10, streak: 9, delta: -1, you: false },
    { rank: 4, name: "Jij", handle: "@jij", xp: 4820, level: 7, streak: 12, delta: 3, you: true },
    { rank: 5, name: "Daan B.", handle: "@daanb", xp: 4655, level: 7, streak: 4, delta: -1, you: false },
    { rank: 6, name: "Fenna M.", handle: "@fenna", xp: 4210, level: 6, streak: 15, delta: 0, you: false },
    { rank: 7, name: "Tijn S.", handle: "@tijns", xp: 3890, level: 6, streak: 2, delta: -3, you: false },
    { rank: 8, name: "Mila R.", handle: "@milar", xp: 3540, level: 6, streak: 7, delta: 1, you: false },
    { rank: 9, name: "Bram H.", handle: "@bramh", xp: 3120, level: 5, streak: 0, delta: -1, you: false },
    { rank: 10, name: "Sara P.", handle: "@sarap", xp: 2890, level: 5, streak: 5, delta: 0, you: false },
  ];

  const activity = [
    { day: "M", v: 3 }, { day: "D", v: 5 }, { day: "W", v: 2 },
    { day: "D", v: 6 }, { day: "V", v: 4 }, { day: "Z", v: 7 }, { day: "Z", v: 5 },
  ];

  const badges = [
    { id: "b1", icon: "flame", label: "12-dagen reeks", got: true },
    { id: "b2", icon: "zap", label: "100 oefeningen", got: false },
    { id: "b3", icon: "target", label: "90% accuraat", got: true },
    { id: "b4", icon: "crown", label: "Top 3", got: false },
  ];

  return { user, chapters, exercises, activeExercise, leaderboard, activity, badges };
})();
