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
- **Grade-by-grade timeline**, glossary, key dates and questions to bring to info sessions.
- **Interactive questionnaire** (`/quiz`): 12 short, tap-to-answer questions written for the student (with an optional family part on school system, transportation and postal area). It suggests possible schools and programs, explains why, and offers a **PDF download** of the result (generated in the browser). It is orientation, not counselling, and says so.
- **Optional anonymous data sharing**: with explicit opt-in, the answers can be stored anonymously in Postgres to study which options interest families.
- **Languages:** Spanish, English and Canadian French (`fr-CA`). The language is picked from `?lang=`, then the saved choice, then the browser language.
- **Light and dark themes**, responsive layout and keyboard-friendly, accessible markup.
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
api/submit.js       POST /api/submit: validated, anonymous insert into Postgres (Neon)
db/schema.sql       table definition (also created lazily by the function)
db/queries.sql      example correlation queries
assets/             favicon and Open Graph image
vercel.json         security headers and clean URLs
robots.txt, sitemap.xml
```

## Questionnaire and recommendations

- Answers add weights to **program types** (IB, AP, Arts, STEM, Sports, French Immersion, Extended French, Bakery, Skilled Trades, IBT, Strings, SHSM, Alternative). See `js/quiz-content.js`.
- Each school's score is the sum of the weights of the regional programs it hosts (`SCHOOLS[].progs` in `js/content.js`). Program cards use the same weights.
- Family answers apply filters and adjustments: school system (Catholic, public, French-language), and a penalty for matches that depend on a regional program when transportation is limited.
- The Fraser score is **not** used to recommend. Results are shown as bands (strong, good, possible), never as percentages.
- Schools without a regional program are not ranked; the results explain that the boundary school offers the regular program.
- The PDF is built client-side with [jsPDF](https://github.com/parallax/jsPDF) (loaded from cdnjs on demand). Nothing leaves the device unless the user opts in to share.

### Anonymous data storage (optional)

1. In the Vercel project, open **Storage / Marketplace** and add **Neon Postgres**. Connect it to the project so `DATABASE_URL` is injected (see `.env.example`).
2. Redeploy. The function creates the `quiz_responses` table on first use (or run `db/schema.sql` in the Neon SQL editor).
3. Analyze with `db/queries.sql`.

What is stored per response: schema version, language, the answers, the optional first 3 characters of the postal code, and the ids of the suggested schools and programs. **Not stored:** names, emails, IP addresses, user agents, cookies or any identifier. Sharing is opt-in, with a visible consent checkbox on the results page. If `DATABASE_URL` is not set, the endpoint returns 503 and the site tells the user sharing is not enabled; the questionnaire and PDF keep working.

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
4. If the production URL differs from `highschool-navigator-mississauga.vercel.app`, update it in `index.html` (canonical, Open Graph, JSON-LD), `sitemap.xml` and `robots.txt`.

## Disclaimer

Independent informational site. Not affiliated with DPCDSB, the Peel District School Board or the Fraser Institute. Information may change: always verify with official sources.
