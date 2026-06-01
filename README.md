# CodeKwartier

Interactief oefenplatform voor **web development** (JavaScript, HTML & CSS) — gebouwd rond de cursus Web Development I (labo 13–22). Schrijf code in een echte editor, voer ze live uit in de browser, en laat ze automatisch verbeteren.

## Features

- **Multi-file editor** (Monaco) met live preview — student-code draait in een gesandboxde `<iframe>` (geen server nodig).
- **Automatische verbetering** via 5 strategieën: console-output, function-return, DOM-assertions, computed CSS en statische (regex) checks.
- **63 oefeningen** over 10 hoofdstukken (labo 13–22), in de cursus-conventies (`setup` + `load`-event, altijd `let`/`const`, arrow functions).
- **Theorie** per hoofdstuk (meerkeuze + open vragen, study-mode).
- **XP & voortgang**: levels, dagelijkse reeks (streak), badges, favorieten, notities — alles bewaard in `localStorage`.
- **Klassement** (optioneel, via Upstash Redis) met live polling, en een verborgen **adminpaneel** (`/admin`) + meldingen.
- **Light & dark mode** met system-detect.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind (utility-laag bovenop een eigen design-systeem) · Monaco Editor · Zustand (persist) · Upstash Redis (REST, Edge).

## Aan de slag

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). De app werkt **volledig lokaal** zonder configuratie (XP/voortgang in `localStorage`).

### Optioneel: server-features

Kopieer `.env.example` naar `.env.local` en vul in voor het online klassement, het adminpaneel en notificaties:

```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
ADMIN_PASSWORD=
ADMIN_SECRET=
```

### Build

```bash
npm run build
npm run start
```

> ⚠️ Draai `npm run build` niet terwijl `npm run dev` actief is — ze delen de `.next`-map.

## Structuur

```
app/            routes (dashboard, oefeningen, theorie, leaderboard, admin, examen, sandbox) + API-routes
components/     editor, runner, preview, output, sidebar, atomen
lib/            iframe-runner, grader (5 strategieën), store, level/XP, upstash, admin-auth
data/labos/     de hoofdstukken (labo 13–22) → geaggregeerd in data/content.ts
css/styles.css  het design-systeem (gamified dark)
styles/         light-palet + extra component-stijlen
```
