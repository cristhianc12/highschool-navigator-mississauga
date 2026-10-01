# Scraping agent brief (all boards)

You collect facts about GTA high schools from the schools' and boards' OWN websites for a trilingual (es / en / fr-CA) guide
for families. Read `scripts/pipeline/README.md` (rules + tools) and `scripts/pipeline/schema.mjs` (the contract) first. Everything is run from
the repo root with `NODE_USE_ENV_PROXY=1 NODE_NO_WARNINGS=1`. You write ONLY under `data/raw/<board>/`. You never run git and never edit other files.

A finished example of the whole output is `data/raw/hdsb/` (board + 18 schools). Open `_board.json` and two school files before you start, and match
their shape and level of detail. Do not copy their content.

## What to produce

1. **School files**: for each school in your slice, `data/raw/<board>/<school-id>.json`, valid per `checkSchool`.
   - `programs`: each special program / pathway the school's own pages or the board's school page state (IB, AP, arts, STEM, sports, French Immersion/Extended French,
     SHSM, gifted/enrichment, trades/OYAP, alternative...). Allowed tags are in `schema.mjs`. Official name as published, one factual trilingual sentence, `entry`, and the URL of the page that says it.
   - `shsm` sector names, `other` (Co-operative Education, Dual Credit, OYAP, etc., only if stated), `focus`/`kv` only if the school's own pages support them (leave out otherwise).
   - `calendarUrl`: the school's course calendar / course selection guide page, if any.
   - `admissions`: for programs with their own entry process (eligibility, what to submit, marks, fees, dates, things to know), each with its source URL.
   - `sessions`: information nights / open houses / program nights for the 2026-27 school year (Grade 9 entry in Sept 2027), real ISO dates and 24h times, format.
   - `site`: the confirmed official URL of the school.
   - `missing`: short English notes on what you looked for and did not find.
2. **Course lists**: when a school publishes its courses (calendar page, PDF, Google Doc/Sheet, course selection sheet), run
   `node scripts/pipeline/extract-courses.mjs <school-id> <url> [<url>...] --year=2026-2027` (use the year the source states). It handles HTML, PDF, Google Docs/Slides/Sheets
   (paste the normal share URL; it rewrites it to the export URL) and CSV. A quality gate repairs or drops unreadable titles automatically: do NOT hand-edit titles. Check the printed count; if
   it is tiny, find the real course-list page. Spot-check ~5 rows against the page text. If a source needs a login or is a scanned image, say so in `missing`.
3. **Board file** (`_board.json`, ONLY if your message says you own it): secondary registration (steps, documents, note, contact as ONE plain English string, official URL, key dates), board-level programs students apply to
   across schools (with `hosts` = school ids from the work list, `start` 9/10/11/12, `entry`, `info` when stated), and board-wide information sessions.
4. Run `node scripts/pipeline/validate.mjs <board>` and fix every problem for your files.

## Language rules (important)

- Every reader-facing text is `{ "en", "es", "fr" }`. Write `en` from the source (paraphrase, short, factual), then translate faithfully.
- **Informal address**: Spanish uses tú ("Crea", "Completa", "Lleva"), French uses tu ("Crée", "Remplis", "Apporte"). Never usted / vous. es = neutral Latin American Spanish, fr = Canadian French.
- Program names, SHSM sectors, course titles, tool and portal names stay as published (English).

## Fields: how to choose values

- `entry`: `apply` (application), `audition`, `boundary` (automatic by home address), `lottery`, `transfer` (request to attend out of boundary), `school` (no application; placement through the school/guidance).
- `start`: first grade the program is taken (9, 10, 11 or 12).
- Dates: only the 2026-27 cycle. Old-year pages are not sources for dates or fees.
- French-language boards: read the French pages (those are the originals); write `en` as your faithful translation, `fr` as the original wording (tu-form where you address the reader), and `es`.

## Curated schools (work list `curated: true`)

These (Mississauga schools of Peel and Dufferin-Peel, plus Sainte-Famille) already have a hand-verified record on the site. For them write a file with ONLY what is missing:
`programs: []`, `sessions` (2026-27 info nights not yet listed: it is fine if some duplicate, the site de-duplicates), `calendarUrl` + courses (Peel schools and Sainte-Famille; the 15 Dufferin-Peel Mississauga schools
already have course lists, skip courses for them), `shsm`/`other` only if the school's page states them, `site`, and `missing`. Do not restate their programs.

## Method and limits

- Start at the school's site (`site` in the work list; fix it if wrong), then use `crawl.mjs links <url> --match=regex` / `sitemap <origin> --match=regex` to find program, course, SHSM, French, co-op, admissions, open-house pages.
  Board sites often hold the program details for all schools (read those once for the whole board, then reuse the facts for each host school, with the board page as the source URL).
- WebSearch is allowed only to locate a page. Never guess, never fill from memory or from another school. Not found = omit + `missing`.
- No logins, no forms, no bypassing blocks (record blocked hosts in `missing`). No personal data about staff or students.
- Keep notes short. Aim to finish your slice; if something would take disproportionate effort, move on and note it.

## Final report (concise)

Schools done, counts (programs, courses, sessions, admissions), what could not be found, blocked hosts, validator result, and any tool/schema problem worth fixing.
