// Lazy per-board details (collected from each school's and board's own website, see scripts/pipeline/).
// The directory loads fast with the roster only; details (programs, admissions, sessions, registration)
// are imported per board and merged into the shared data (SCHOOLS, PROGRAMS, SESSIONS, ...) in place.
import { SCHOOLS, PROGRAMS } from "./content.js";
import { DETAIL_BOARDS } from "./data/summary.js";
import { EXTRAS } from "./school-extras.js";
import { ADMISSIONS, REGISTRATION } from "./admissions.js";
import { PROGRAM_INFO } from "./program-info.js";
import { addSessions } from "./sessions.js";
import { BOARD_META } from "./geo.js";

const loaded = new Map(); // board -> Promise

const L3 = (o) => (o && typeof o === "object" ? o : null);
const OFFICIAL = { en: "Official program page", es: "Página oficial del programa", fr: "Page officielle du programme" };

function merge(b, d) {
  const byId = new Map(SCHOOLS.map((s) => [s.id, s]));
  const events = [];
  for (const [id, r] of Object.entries(d.schools || {})) {
    const s = byId.get(id);
    if (!s) continue;
    const ex = (EXTRAS[id] ||= { src: b });
    if (r.site && !ex.site) ex.site = r.site;
    if (r.cal && !ex.cal) ex.cal = r.cal;
    if (r.courses) ex.courses = true;
    if (!ex.shsm?.length && r.shsm) ex.shsm = r.shsm;
    if (!ex.other?.length && r.other) ex.other = r.other;
    if (!r.curated) {
      // scraped schools: replace the "details pending" placeholder with what the school's pages state
      s.progs = (r.progs || []).map((p) => ({ k: p.k, n: p.n, name: p.name, url: p.url }));
      if (r.shsm?.length && !s.progs.some((p) => p.k === "shsm")) s.progs.push({ k: "shsm", n: { en: r.shsm.join(", "), es: r.shsm.join(", "), fr: r.shsm.join(", ") } });
      if (r.focus) s.focus = r.focus;
      if (r.kv) s.kv = { distinct: r.kv.distinct, shsm: r.kv.shsm, langs: r.kv.langs, entry: r.kv.entry };
      s.pending = false;
      s.collected = r.at || d.scrapedAt;
      s.missing = r.missing || [];
    }
    for (const a of r.admissions || []) ADMISSIONS.push({ ...a, school: id, prog: a.programId ? `${b}-${a.programId.replace(new RegExp(`^${b}-`), "")}` : null });
    for (const e of r.sessions || []) events.push({ ...e, board: b, school: s.name, city: (s.city || "").toLowerCase(), site: ex.site || null, schoolId: id });
  }
  for (const p of d.programs || []) {
    if (PROGRAMS.some((x) => x.id === p.id)) continue;
    const hosts = p.hosts.map((h) => { const s = byId.get(h); return { n: s?.name || h, m: false, id: h }; });
    PROGRAMS.push({ id: p.id, board: b, tag: p.tag, start: String(p.start), entry: p.entry, name: p.name, p: p.p, second: L3(p.second), hosts, url: p.url, regions: [...new Set(p.hosts.map((h) => byId.get(h)?.region).filter(Boolean))] });
    PROGRAM_INFO[p.id] = {
      who: p.info?.who, reqs: p.info?.reqs, how: p.info?.how, dates: p.info?.dates, keyDates: p.info?.keyDates,
      links: [{ l: OFFICIAL, u: p.url }, ...((p.info?.links || []).map((l) => ({ l: l.label || OFFICIAL, u: l.url })))],
    };
  }
  for (const e of d.sessions || []) {
    events.push({ ...e, board: b, school: e.school ? (byId.get(e.school)?.name || e.school) : BOARD_META[b].name.en.split(" (")[0], city: e.school ? (byId.get(e.school)?.city || "").toLowerCase() : "virtual" });
  }
  if (d.registration && !REGISTRATION[b]) REGISTRATION[b] = d.registration;
  addSessions(events.map((e) => ({
    kind: e.kind, board: e.board, school: e.school, city: e.city, site: e.site || null, title: e.title, date: e.date || null, time: e.time || null, end: e.endTime || null,
    format: e.format || null, programId: e.programId ? `${b}-${e.programId.replace(new RegExp(`^${b}-`), "")}` : null, links: [{ label: "Link", url: e.url }, ...(e.links || [])], programIds: [],
  })));
}

/** Loads (once) the details of the given boards. Resolves to true when something new was merged. */
export function ensureDetails(boards) {
  const todo = [...new Set(boards)].filter((b) => DETAIL_BOARDS.includes(b));
  return Promise.all(todo.map((b) => {
    if (!loaded.has(b)) loaded.set(b, import(`./data/details/${b}.js`).then((m) => { merge(b, m.default); return true; }).catch(() => false));
    return loaded.get(b);
  })).then((r) => r.some(Boolean));
}
export const ensureAllDetails = () => ensureDetails(DETAIL_BOARDS);
