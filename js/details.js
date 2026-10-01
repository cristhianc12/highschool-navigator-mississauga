// Lazy details collected from each school's and board's own website (see scripts/pipeline/).
// The directory loads fast with the roster only. Then, in three steps, and always merged in place into the shared data:
//   1. ensureBoards():     programs + every information session of each board (small, loaded after the first paint)
//   2. ensureSchool(id):   one school's profile (programs with notes, SHSM, focus, links) + its board's registration and admissions
//   3. courses:            loaded by the course finder / profile accordion (course-finder.js)
import { SCHOOLS, PROGRAMS } from "./content.js";
import { DETAIL_BOARDS } from "./data/summary.js";
import { EXTRAS } from "./school-extras.js";
import { ADMISSIONS, REGISTRATION } from "./admissions.js";
import { PROGRAM_INFO } from "./program-info.js";
import { addSessions } from "./sessions.js";
import { BOARD_META } from "./geo.js";

const OFFICIAL = { en: "Official program page", es: "Página oficial del programa", fr: "Page officielle du programme" };
const byId = new Map(SCHOOLS.map((s) => [s.id, s]));
const progId = (b, id) => (id ? `${b}-${String(id).replace(new RegExp(`^${b}-`), "")}` : null);
const cache = new Map(); // module path -> Promise

const load = (path) => {
  if (!cache.has(path)) cache.set(path, import(path).then((m) => m.default).catch(() => null));
  return cache.get(path);
};

/* ---------------- 1. programs and sessions ---------------- */

function mergeBoard(b, d) {
  for (const p of d.programs || []) {
    if (PROGRAMS.some((x) => x.id === p.id)) continue;
    const hosts = p.hosts.map((h) => ({ n: byId.get(h)?.name || h, m: false, id: h }));
    PROGRAMS.push({
      id: p.id, board: b, tag: p.tag, start: String(p.start), entry: ["boundary", "school"].includes(p.entry) ? "auto" : "apply", entryDetail: p.entry,
      name: p.name, p: p.p, second: p.second || null, hosts, url: p.url, regions: [...new Set(p.hosts.map((h) => byId.get(h)?.region).filter(Boolean))],
    });
    PROGRAM_INFO[p.id] = {
      who: p.info?.who, reqs: p.info?.reqs, how: p.info?.how, dates: p.info?.dates, keyDates: p.info?.keyDates,
      links: [{ l: OFFICIAL, u: p.url }, ...(p.info?.links || []).map((l) => ({ l: l.label || OFFICIAL, u: l.url }))],
    };
  }
  const boardName = BOARD_META[b].name.en.split(" (")[0];
  addSessions((d.sessions || []).map((e) => {
    const s = e.schoolId ? byId.get(e.schoolId) : e.school ? byId.get(e.school) : null;
    return {
      kind: e.kind, board: b, school: s ? s.name : boardName, city: s ? (s.city || "").toLowerCase() : "virtual",
      site: s ? EXTRAS[s.id]?.site || null : null, title: e.title, date: e.date || null, time: e.time || null, end: e.endTime || null,
      format: e.format || null, programId: progId(b, e.programId), links: [{ label: "Link", url: e.url }, ...(e.links || [])], programIds: [],
    };
  }));
}

/** Loads (once) the programs and sessions of the boards that have collected data. True when something was merged. */
export function ensureBoards(boards = DETAIL_BOARDS) {
  return Promise.all([...new Set(boards)].filter((b) => DETAIL_BOARDS.includes(b)).map(async (b) => {
    const key = `./data/details/${b}.js`;
    const fresh = !cache.has(key);
    const d = await load(key);
    if (fresh && d) mergeBoard(b, d);
    return fresh && !!d;
  })).then((r) => r.some(Boolean));
}

/* ---------------- 2. one school's profile ---------------- */

function mergeBoardExtras(b, x) {
  if (x.registration && !REGISTRATION[b]) REGISTRATION[b] = x.registration;
  for (const a of x.admissions || []) ADMISSIONS.push({ ...a, prog: progId(b, a.programId) });
}

function mergeSchool(r, s) {
  const ex = (EXTRAS[s.id] ||= { src: s.board });
  // The collected URL was confirmed by an agent; the roster URL (Ontario open data) can be dead or even taken over by another site.
  if (r.site && (!ex.site || !r.curated)) ex.site = r.site;
  if (r.cal && !ex.cal) ex.cal = r.cal;
  if (r.courses) ex.courses = true;
  if (!ex.shsm?.length && r.shsm) ex.shsm = r.shsm;
  if (!ex.other?.length && r.other) ex.other = r.other;
  if (r.curated) return; // hand-verified schools keep their own programs, focus and details
  s.progs = (r.progs || []).map((p) => ({ k: p.k, n: p.n, name: p.name, url: p.url }));
  if (r.shsm?.length && !s.progs.some((p) => p.k === "shsm")) s.progs.push({ k: "shsm", n: { en: r.shsm.join(", "), es: r.shsm.join(", "), fr: r.shsm.join(", ") } });
  if (r.focus) s.focus = r.focus;
  if (r.kv) s.kv = { distinct: r.kv.distinct, shsm: r.kv.shsm, langs: r.kv.langs, entry: r.kv.entry };
  s.pending = false;
  s.collected = r.at;
  s.missing = r.missing || [];
}

/** Loads (once) the profile of the given school(s) and the registration/admissions of their boards. True when something was merged. */
export function ensureSchools(ids) {
  return Promise.all([...new Set(ids)].map(async (id) => {
    const s = byId.get(id);
    if (!s || !DETAIL_BOARDS.includes(s.board)) return false;
    const kx = `./data/details/${s.board}/x.js`;
    const ks = `./data/details/${s.board}/${id}.js`;
    const freshX = !cache.has(kx), freshS = !cache.has(ks);
    const [x, r] = await Promise.all([load(kx), load(ks)]);
    if (freshX && x) mergeBoardExtras(s.board, x);
    if (freshS && r) mergeSchool(r, s);
    return (freshX && !!x) || (freshS && !!r);
  })).then((r) => r.some(Boolean));
}
export const ensureSchool = (id) => ensureSchools([id]);

/** Registration and admissions of a board (needed by program profiles). */
export async function ensureBoardExtras(b) {
  if (!DETAIL_BOARDS.includes(b)) return false;
  const k = `./data/details/${b}/x.js`;
  const fresh = !cache.has(k);
  const x = await load(k);
  if (fresh && x) mergeBoardExtras(b, x);
  return fresh && !!x;
}

// Kept for older call sites.
export const ensureAllDetails = ensureBoards;
