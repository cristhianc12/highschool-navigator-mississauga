// The raw data contract shared by the scraping agents, the validator and the site builder.
// See scripts/pipeline/README.md for the human-readable version.
export const TAGS = ["ib", "ap", "arts", "stem", "sports", "fi", "ef", "bakery", "trades", "ibt", "strings", "alt", "shsm", "gifted", "other"];
export const START = ["9", "10", "11", "12"];
// apply: application; audition: audition/portfolio; boundary: automatic by home address; lottery; transfer: request to attend out of boundary;
// school: no application, placement through the school or its guidance team (for example IPRC or timetable selection).
export const ENTRY = ["apply", "audition", "boundary", "lottery", "transfer", "school"];
export const SESSION_KINDS = ["school", "program", "general"];
export const SESSION_FORMATS = ["In person", "Virtual", "Hybrid"];

const isStr = (v) => typeof v === "string" && v.trim().length > 0;
const isUrl = (v) => isStr(v) && /^https:\/\/[^\s]+$/.test(v);
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const isTime = (v) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
export const isTri = (v) => v && typeof v === "object" && ["en", "es", "fr"].every((k) => isStr(v[k]));

/** Returns a list of problems (empty = valid). `ctx.ids` is the set of known school ids. */
export function checkSchool(d, ctx) {
  const errs = [];
  const e = (m) => errs.push(m);
  if (!ctx.ids.has(d.id)) e(`unknown school id ${d.id}`);
  if (!isDate(d.scrapedAt)) e("scrapedAt must be YYYY-MM-DD");
  if (d.site != null && !isUrl(d.site)) e("site must be an https URL or null");
  if (!Array.isArray(d.sources) || !d.sources.length || !d.sources.every(isUrl)) e("sources: non-empty array of https URLs (every page you used)");
  for (const [i, p] of (d.programs || []).entries()) {
    const w = `programs[${i}]`;
    if (!TAGS.includes(p.tag)) e(`${w}.tag must be one of ${TAGS.join(",")}`);
    if (!isStr(p.name)) e(`${w}.name required (official name as published)`);
    if (!isTri(p.note)) e(`${w}.note must be {en,es,fr}, one factual sentence`);
    if (p.entry != null && !ENTRY.includes(p.entry)) e(`${w}.entry must be one of ${ENTRY.join(",")}`);
    if (!isUrl(p.url)) e(`${w}.url (the page that states it) required`);
  }
  for (const k of ["shsm", "other"]) if (d[k] != null && !(Array.isArray(d[k]) && d[k].every(isStr))) e(`${k} must be an array of strings`);
  if (d.focus != null && !isTri(d.focus)) e("focus must be {en,es,fr} or null");
  if (d.kv != null) for (const k of ["distinct", "shsm", "langs", "entry"]) if (d.kv[k] != null && !isTri(d.kv[k])) e(`kv.${k} must be {en,es,fr} or null`);
  if (d.calendarUrl != null && !isUrl(d.calendarUrl)) e("calendarUrl must be an https URL or null");
  for (const [i, a] of (d.admissions || []).entries()) {
    const w = `admissions[${i}]`;
    if (!isStr(a.program)) e(`${w}.program required`);
    if (a.tag != null && !TAGS.includes(a.tag)) e(`${w}.tag invalid`);
    for (const k of ["elig", "marks", "fee", "dates"]) if (a[k] != null && !isTri(a[k])) e(`${w}.${k} must be {en,es,fr} or null`);
    for (const k of ["submit", "know"]) if (a[k] != null && !(Array.isArray(a[k]) && a[k].every(isTri))) e(`${w}.${k} must be an array of {en,es,fr}`);
    if (!isUrl(a.url)) e(`${w}.url required`);
  }
  for (const [i, s] of (d.sessions || []).entries()) e0(errs, `sessions[${i}]`, s);
  if (!Array.isArray(d.missing)) e("missing: array of strings naming what the pages did not state (may be empty)");
  return errs;
}

function e0(errs, w, s) {
  if (!SESSION_KINDS.includes(s.kind)) errs.push(`${w}.kind must be one of ${SESSION_KINDS.join(",")}`);
  if (s.date != null && !isDate(s.date)) errs.push(`${w}.date must be YYYY-MM-DD or null`);
  if (s.time != null && !isTime(s.time)) errs.push(`${w}.time must be HH:MM (24h) or null`);
  if (s.format != null && !SESSION_FORMATS.includes(s.format)) errs.push(`${w}.format must be one of ${SESSION_FORMATS.join(",")}`);
  if (!isStr(s.title)) errs.push(`${w}.title required`);
  if (!isUrl(s.url)) errs.push(`${w}.url required`);
}

export function checkBoard(d, ctx) {
  const errs = [];
  const e = (m) => errs.push(m);
  if (!ctx.boards.has(d.board)) e(`unknown board ${d.board}`);
  if (!isDate(d.scrapedAt)) e("scrapedAt must be YYYY-MM-DD");
  if (!Array.isArray(d.sources) || !d.sources.every(isUrl)) e("sources must be https URLs");
  const r = d.registration;
  if (r) {
    if (!Array.isArray(r.steps) || !r.steps.length || !r.steps.every(isTri)) e("registration.steps: array of {en,es,fr}");
    if (!Array.isArray(r.docs) || !r.docs.every(isTri)) e("registration.docs: array of {en,es,fr} (may be empty)");
    if (!isTri(r.note)) e("registration.note must be {en,es,fr}");
    if (!isUrl(r.url)) e("registration.url required");
    if (r.dates != null && !(Array.isArray(r.dates) && r.dates.every(isTri))) e("registration.dates: array of {en,es,fr}");
  } else e("registration missing (use null only if the board truly publishes no secondary registration page, and say so in notes)");
  for (const [i, p] of (d.programs || []).entries()) {
    const w = `programs[${i}]`;
    if (!/^[a-z0-9-]+$/.test(p.id || "")) e(`${w}.id must be a lowercase slug`);
    if (!TAGS.includes(p.tag)) e(`${w}.tag invalid`);
    if (!isTri(p.name) || !isTri(p.p)) e(`${w}.name and .p must be {en,es,fr}`);
    if (!START.includes(String(p.start))) e(`${w}.start must be one of ${START.join(",")}`);
    if (!ENTRY.includes(p.entry)) e(`${w}.entry must be one of ${ENTRY.join(",")}`);
    if (!Array.isArray(p.hosts) || !p.hosts.length || !p.hosts.every((h) => ctx.ids.has(h))) e(`${w}.hosts must be known school ids`);
    if (!isUrl(p.url)) e(`${w}.url required`);
    if (p.info) {
      for (const k of ["who", "how", "dates", "keyDates"]) if (p.info[k] != null && !isTri(p.info[k])) e(`${w}.info.${k} must be {en,es,fr}`);
      if (p.info.reqs != null && !(Array.isArray(p.info.reqs) && p.info.reqs.every(isTri))) e(`${w}.info.reqs must be an array of {en,es,fr}`);
    }
  }
  for (const [i, s] of (d.sessions || []).entries()) e0(errs, `sessions[${i}]`, s);
  return errs;
}
