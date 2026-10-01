# Data pipeline (GTA high schools)

Roster (`build-roster.mjs`) → per-board scraping by agents (`data/raw/<board>/`) → `validate.mjs` → `build-details.mjs`
(site modules in `js/data/`). Nothing reaches the site without passing validation, and every fact keeps its source URL.

## Tools (run with `NODE_USE_ENV_PROXY=1 NODE_NO_WARNINGS=1` from the repo root)

- `node scripts/pipeline/crawl.mjs page <url> [--links] [--find=regex] [--max=N]` : readable text of a page or PDF (cached, polite).
- `node scripts/pipeline/crawl.mjs links <url> [--match=regex]` : links of a page.
- `node scripts/pipeline/crawl.mjs sitemap <origin> [--match=regex]` : URLs from sitemap.xml.
- `node scripts/pipeline/extract-courses.mjs <school-id> <url> [<url> ...]` : course list (Ontario course codes) from a course calendar page or PDF into `data/raw/<board>/<id>.courses.json`.
- `node scripts/pipeline/validate.mjs <board>` : checks your files against `schema.mjs`. Fix every error.
- `data/work/<board>.json` : your school list (id, official name, city, website).

## Files an agent writes

`data/raw/<board>/<school-id>.json` for each school and `data/raw/<board>/_board.json` once. Field rules are in
`schema.mjs` (read it). Text fields that people read are trilingual objects `{ "en", "es", "fr" }`: write the English from the
source, then translate it faithfully into Spanish (es) and Canadian French (fr-CA). Program names, SHSM sector names and course titles stay as published (English).

## Accuracy rules (non-negotiable)

1. Only record what a page you actually read states. Never infer, never fill from memory, never copy from another school.
2. Every program/admission/session carries the URL of the page that states it. List every page you used in `sources`.
3. Not found → leave the field out (or `null`) and add a short note to `missing`. An empty honest record is better than a guess.
4. Dates are for the 2026-27 school year / Grade 9 entry in September 2027 unless the page says otherwise; if a page is for an older year, do not use it for dates or fees.
5. Do not collect personal data (names of staff, student info). Programs, courses, requirements, fees, dates and official links only.
6. Respect the sites: use the crawl tool (it rate-limits and caches). No logins, no forms, no bypassing blocks.
