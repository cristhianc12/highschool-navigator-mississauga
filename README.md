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
- **Languages:** Spanish, English and Canadian French (`fr-CA`). The language is picked from `?lang=`, then the saved choice, then the browser language.
- **Light and dark themes**, responsive layout and keyboard-friendly, accessible markup.
- **SEO:** meta tags, Open Graph / Twitter card image, JSON-LD, `sitemap.xml`, `robots.txt`.
- **Analytics:** Vercel Web Analytics (enable it in the Vercel dashboard).

## Tech stack

Plain static site: HTML, CSS and ES modules. No framework, no build step, no dependencies.

```
index.html          page shell, SEO tags, language and theme toggles
css/styles.css      styles (light and dark themes)
js/content.js       ALL content: UI text (es/en/fr), schools, programs, Fraser data, sources
js/app.js           rendering, filters, comparison and language logic
assets/             favicon and Open Graph image
vercel.json         security headers and clean URLs
robots.txt, sitemap.xml
```

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

The site has no accounts, forms or cookies. Language and theme choices are stored only in the browser's `localStorage`. The site is anonymized: it contains no personal data about any student or family.

## Deploy on Vercel

1. Import this repository at https://vercel.com/new.
2. Framework preset: **Other**. Leave build command and output directory empty.
3. Deploy, then enable **Analytics** in the project settings.
4. If the production URL differs from `highschool-navigator-mississauga.vercel.app`, update it in `index.html` (canonical, Open Graph, JSON-LD), `sitemap.xml` and `robots.txt`.

## Disclaimer

Independent informational site. Not affiliated with DPCDSB, the Peel District School Board or the Fraser Institute. Information may change: always verify with official sources.
