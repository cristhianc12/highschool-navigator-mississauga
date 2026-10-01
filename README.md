# Highschool Navigator Mississauga

A free, independent, trilingual (**Spanish, English, Canadian French**) guide to every public, Catholic and French-language **high school in Mississauga, Ontario**, built for families preparing for **Grade 9 entry in September 2027**.

It describes what each school and program offers, how to get in and when to apply. It **does not recommend any school**.

## Features

- **Complete directory** of 33 Mississauga secondary schools across three systems:
  - DPCDSB (Catholic): 15 schools
  - Peel District School Board (public): 17 schools
  - French-language Catholic: 1 school
- **Regional programs** with host schools, Mississauga sites highlighted:
  - DPCDSB: AP, IB, STEM/STEAM, Arts, Sports, Bakery School, French Immersion, Extended French, Alternative program
  - Peel RLCP: IB (MYP and Pre-IB), Arts, AP, SciTech, IBT, Strings, Transportation/Engineering/Technology, Skilled Trades
- **Fraser Institute score** (out of 10), rank and previous-year score for each school, with a plain-language note on what the score does and does not measure.
- **Filters and search** by board, program type, starting grade and how you get in, plus sorting by name or Fraser score.
- **Side-by-side comparison** of up to 4 schools from any board.
- **Interactive school map:** a searchable list next to a real street map (Leaflet, self-hosted in `assets/vendor/leaflet`, with OpenStreetMap tiles). Numbered pins match the list; tap a pin or a list row for a card with score, programs, distance, directions and the profile; mark "my home" on the map (or use your location) to sort by straight-line distance; it follows the directory filters and marks schools saved in "My list". **Privacy:** tiles are requested from OpenStreetMap only after the person clicks "Load the map" (or asks to remember it); until then an offline preview is shown and the list works alone. For heavy traffic, switch the tile URL in `js/map.js` to a provider that allows it (OSM's tile policy discourages heavy use). School coordinates come from the official addresses (DPCDSB PDF) or OSM (`js/school-geo.js`).
- **Courses per school:** the profile of every DPCDSB school lists its official course calendar (2025-26, by subject area and grade, with Ontario course codes), and a **course finder** shows which schools offer a subject or code. Verified SHSM sectors and other programs (Co-op, Dual Credit, OYAP...) per school come from each school's own website (`js/school-extras.js`). Bakery School details (credits, sequence, deadline Jan 8, 2027, no transportation) come from Goetz's regional program page.
- **AP vs IB vs regular explainer**, a **year-over-year Fraser trend** (up/down vs the previous year), a **"data checked on" stamp** and a **Report an error** link (prefilled GitHub issue) on every profile.
- **Installable and offline-friendly (PWA):** web app manifest, icons and a small service worker (network-first for pages and scripts, cache-first for fonts and images; it never touches `/api/`).
- **My list:** star (☆/⭐) any school or program to build a personal shortlist, kept only on the device (`localStorage`, no account). The panel shows a plan with the dates that matter for the list and exports it to the calendar (one `.ics` with all dates), a PDF or plain text.
- **"Take a break" mini game (Teen tone):** a tiny endless runner with the 67 as the hero, loaded on demand; the best score stays on the device.
- **Program profiles:** click any regional program card to see who it is for, requirements (from Peel's official admissions table), how and when to apply, key dates (assessments, auditions, offer rounds), the information sessions at each host school, where it is offered (with links to the school profiles) and official links.
- **Information session calendar:** DPCDSB's official fall 2026 session schedule (school by school, with program presentations, flyers and links) plus Peel's program information nights, filterable by area and board, with **Add to calendar (.ics)** buttons. Sessions also appear inside each school and program profile.
- **School profile modal:** click any school (directory, comparison or questionnaire results) to see its Fraser score, programs, the regional programs it hosts and details, without leaving the page. Whole cards are clickable (with a visible "View profile" button and hover feedback) but text stays selectable: dragging, double or triple click to copy never opens the modal. Each profile has a shareable link (`#school-<id>`), Esc/Back closes it, and it is built on the native `<dialog>` element (bottom sheet on mobile).
- **Grade-by-grade timeline**, glossary, key dates and questions to bring to info sessions.
- **Teen-friendly design:** vibrant theme that follows the device light/dark setting, compact cards, one-tap "vibe" chips (IB, AP, Arts, STEM...), a sticky bottom navigation on mobile and a **Teen / Family tone switch** (same information, playful or neutral wording; light nods to trends live only in microcopy).
- **Interactive questionnaire** (`/quiz`): 12 short, tap-to-answer questions written for the student (with an optional family part on school system, transportation and a broad area of the city). It suggests possible schools and programs, explains why, and offers a **PDF download** of the result (generated in the browser). It is orientation, not counselling, and says so.
- **Optional anonymous data sharing**: with explicit opt-in, the answers can be stored anonymously in Postgres to study which options interest families.
- **Languages:** Spanish, English and Canadian French (`fr-CA`). The language is chosen from `?lang=`, then the saved choice, then the device language (Spanish, French or English), falling back to English.
- **Follows the device theme** (light when none is detected, switchable), responsive layout, keyboard-friendly and accessible markup.
- **SEO:** meta tags, Open Graph / Twitter card image, JSON-LD, `sitemap.xml`, `robots.txt`.
- **Analytics:** Vercel Web Analytics (enable it in the Vercel dashboard).

## Tech stack

Static site (HTML, CSS and ES modules) with no framework and no build step, plus one small Vercel serverless function for the optional anonymous questionnaire storage.

```
index.html          guide page shell, SEO tags, language and theme toggles
quiz.html           questionnaire page shell
css/styles.css      shared styles (light and dark themes)
css/quiz.css        questionnaire styles
js/content.js       ALL guide content: UI text (es/en/fr), schools, programs, Fraser data, sources
js/app.js           guide rendering, filters, comparison and language logic
js/quiz-content.js  questionnaire text (es/en/fr), options and scoring weights
js/quiz.js          questionnaire UI, recommendation engine, PDF export, anonymous share
js/school-detail.js school and program profile modal shared by the guide and the results
js/map.js           list + street map (Leaflet); js/school-geo.js coordinates; js/map-data.js offline preview shape
js/school-extras.js verified SHSM/other programs and official links per school
js/course-finder.js course list and course finder (lazy); js/school-courses.js course calendars (lazy, generated)
js/mylist.js        "My list" shortlist (localStorage), plan and exports
js/explainer.js     AP vs IB vs regular comparison
js/game.js          the "67 Runner" mini game (lazy loaded, Teen tone)
js/pwa.js, sw.js, manifest.webmanifest   installable app + offline support
js/sessions.js      information sessions data (DPCDSB PDF + Peel nights), formatting and .ics export
js/program-info.js  per-program details: audience, requirements, how to apply, key dates, links
privacy.html        trilingual privacy policy (js/privacy.js, js/privacy-content.js)
api/submit.js       POST /api/submit: validated, anonymous insert into Postgres (Neon)
api/cleanup.js      weekly retention job: deletes responses older than 24 months
scripts/set-domain.mjs  rewrites the production domain across the static files
db/schema.sql       table definition (also created lazily by the function)
db/queries.sql      example correlation queries
assets/             favicon, Open Graph image, self-hosted fonts (assets/fonts) and jsPDF (assets/vendor)
vercel.json         security headers and clean URLs
robots.txt, sitemap.xml
```

## Questionnaire and recommendations

- Answers add weights to **program types** (IB, AP, Arts, STEM, Sports, French Immersion, Extended French, Bakery, Skilled Trades, IBT, Strings, SHSM, Alternative). See `js/quiz-content.js`.
- Each school's score is the sum of the weights of the regional programs it hosts (`SCHOOLS[].progs` in `js/content.js`). Program cards use the same weights.
- Family answers apply filters and adjustments: school system (Catholic, public, French-language), and a penalty for matches that depend on a regional program when transportation is limited.
- The Fraser score is **not** used to recommend. Results are shown as bands (strong, good, possible), never as percentages.
- Schools without a regional program are not ranked; the results explain that the boundary school offers the regular program.
- The PDF is built client-side with [jsPDF](https://github.com/parallax/jsPDF) (self-hosted in `assets/vendor/`, MIT license). Nothing leaves the device unless the user opts in to share.

### Anonymous data storage (optional)

1. In the Vercel project, open **Storage / Marketplace** and add **Neon Postgres**. Connect it to the project so `DATABASE_URL` is injected (see `.env.example`).
2. Redeploy. The function creates the `quiz_responses` table on first use (or run `db/schema.sql` in the Neon SQL editor).
3. Analyze with `db/queries.sql`.

What is stored per response (schema v2): the **date only (no time)**, language, the answers (predefined options, including a broad area: east / central / west / other) and the ids of the suggested schools and programs. **Not stored:** names, emails, IP addresses, user agents, cookies, postal codes, exact timestamps, free text or any identifier. Sharing is opt-in, with a visible consent checkbox on the results page. If `DATABASE_URL` is not set, the endpoint returns 503 and the site tells the user sharing is not enabled; the questionnaire and PDF keep working.

Privacy safeguards built in:

- **Data minimization:** the payload is validated against the questionnaire definition (`api/submit.js`); unknown fields, free text and the old postal-code field are rejected.
- **Retention:** a weekly Vercel Cron (`/api/cleanup`, see `vercel.json`) deletes responses older than **24 months**. Optionally set `CRON_SECRET` in Vercel so only the cron can call it.
- **Small-group rule:** never analyze or publish groups of fewer than 5 responses. `db/queries.sql` already applies `having count(*) >= 5`.
- **No third parties on the page:** fonts and the PDF library are self-hosted, and a strict Content-Security-Policy in `vercel.json` blocks external resources.
- **Transparency:** a trilingual privacy policy at `/privacy` that mirrors exactly what the API stores. Update `js/privacy-content.js` whenever the stored fields change.
- **Ages:** the site says under-13s should use it with an adult; there are no accounts or contact fields.

This is a privacy-by-design setup, not legal advice. Have a privacy professional review it before you analyze or publish results.

### Changing the production domain

Rename the project in Vercel (Settings, General, Project Name), then run:

```bash
node scripts/set-domain.mjs your-new-name.vercel.app
```

It rewrites the canonical, Open Graph and JSON-LD URLs, `sitemap.xml` and `robots.txt`.

Note: because the data may relate to minors, keep the opt-in wording, avoid adding free-text fields, and review privacy obligations (for example PIPEDA) before analyzing or publishing results.

## Run locally

```bash
npx serve .
```

Then open http://localhost:3000 (or the port printed by `serve`). Add `?lang=fr` or `?lang=en` to force a language.

## Updating the content

Everything lives in [`js/content.js`](js/content.js):

| What | Where |
| --- | --- |
| Interface text and page copy | `UI.es`, `UI.en`, `UI.fr` |
| Schools, programs per school, Fraser score | `SCHOOLS` (`fraser: F(score, rank, previousScore)`) |
| Regional program cards and hosts | `PROGRAMS` |
| Program types used by the filter | `TAGS` |
| Sources list | `SOURCES` |

Every user-facing string is provided in all three languages. When adding a school or program, fill in `es`, `en` and `fr`.

### Yearly refresh checklist

1. Update each school's `fraser` values from the new Fraser Institute *Report Card on Ontario's Secondary Schools* (published each autumn) and the `FRASER` report label and URL.
2. Confirm application dates on the DPCDSB and Peel websites and update `UI.*.dates`.
3. Re-check regional program hosts (they change from year to year).
4. Bump `lastmod` in `sitemap.xml`.

## Data sources and accuracy

- **Fraser Institute**, *Report Card on Ontario's Secondary Schools 2025* (2024-25 school year), read directly from the official report.
- **DPCDSB** regional program pages and its Regional Secondary Programs 2025-26 document.
- **Peel DSB** Regional Learning Choices Programs pages (application window: Nov 3-24, 2026, for 2027-28 entry).

Scope notes:

- Private and independent schools are excluded.
- Programs listed per school are the *regional* programs confirmed in official sources. SHSM, Co-op and other offerings vary by school and should be confirmed with the school.
- The Fraser score is academic only (provincial test results). It is shown as a reference for public perception, not as a verdict on quality or fit.
- Some items are still marked "to be confirmed" on the site (exact addresses, full SHSM lists, DPCDSB application dates and fees).

## Privacy

The site has no accounts and sets no cookies. Language and theme choices are stored only in the browser's `localStorage`. The guide itself contains no personal data about any student or family. The questionnaire only stores data if the user explicitly opts in, and then only anonymous answers (see above).

## Deploy on Vercel

1. Import this repository at https://vercel.com/new.
2. Framework preset: **Other**. Leave build command and output directory empty.
3. Deploy, then enable **Analytics** in the project settings and, optionally, connect Neon Postgres (see above).
4. If the production URL differs from `highschool-gta-navigator.vercel.app`, update it in `index.html` (canonical, Open Graph, JSON-LD), `sitemap.xml` and `robots.txt`.

## Disclaimer

Independent informational site. Not affiliated with DPCDSB, the Peel District School Board or the Fraser Institute. Information may change: always verify with official sources.
