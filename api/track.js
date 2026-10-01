// POST /api/track: privacy-first usage statistics (counts only).
// Each request carries a few coarse environment labels (language, device class, OS and browser family,
// viewport band) and up to 25 events (a name plus up to two enumerated labels). The server validates every
// value against an allow-list, adds them to DAILY TOTALS and forgets the request. Nothing identifies a
// person: no cookies, no IP address, no user agent string, no session id, no exact time, no free text.
// Only the country and province that Vercel derives from the request are kept (e.g. CA / ON), never the IP.
// What is counted is documented in js/privacy-content.js and README.md.
import { neon } from "@neondatabase/serverless";
import { SCHOOLS } from "../js/content.js";
import { REGION_ORDER, BOARD_META } from "../js/geo.js";

const E = (...v) => new Set(v);
const SCHOOL_IDS = new Set(SCHOOLS.map((s) => s.id));
const CITIES = new Set(SCHOOLS.map((s) => s.city));
const TAGS = E("ib", "ap", "arts", "stem", "sports", "fi", "ef", "bakery", "trades", "ibt", "strings", "alt", "shsm", "gifted", "other");
const BOARDS = new Set(Object.keys(BOARD_META));
const REGIONS = new Set(REGION_ORDER);
const ANY = null; // no second label
const ID = /^[a-z0-9-]{1,60}$/;
const SLUG = /^[a-z0-9_-]{1,24}$/;
const HOST = /^[a-z0-9.-]{3,40}$/;
const empty = (s) => (v) => v === "" || s.has(v);

// event -> [validator for label a, validator for label b]. A validator is a Set, a RegExp or a function.
const RULES = {
  pv: [E("home", "quiz", "privacy"), ANY],
  visit: [E("direct", "search", "social", "school", "email", "other"), E("web", "pwa")],
  campaign: [SLUG, ANY],
  env: [E("light", "dark"), E("teen", "family")],
  engage: [E("lt10s", "10-60s", "1-5m", "gt5m"), E("0", "25", "50", "75", "100")],
  school_open: [SCHOOL_IDS, E("card", "map", "compare", "sessions", "courses", "quiz", "profile", "other")],
  program_open: [ID, E("card", "map", "compare", "sessions", "courses", "quiz", "profile", "other")],
  coffee: [E("topbar", "hero", "footer", "card", "pill", "quiz", "other"), ANY],
  outbound: [E("support", "directions", "report", "fraser", "osm", "register", "flyer", "board", "school", "other"), HOST],
  filter: [E("region", "city", "board", "tag", "start", "entry", "sort", "vibe", "search", "prog_board", "prog_region", "prog_tag", "prog_start", "prog_entry", "prog_search"), (v, a) => ({
    region: empty(REGIONS), city: empty(CITIES), board: empty(BOARDS), tag: empty(TAGS), vibe: empty(TAGS),
    prog_board: empty(BOARDS), prog_region: empty(REGIONS), prog_tag: empty(TAGS), prog_start: empty(E("9", "10", "11", "12")), prog_entry: empty(E("auto", "apply")), prog_search: empty(E("")),
    start: empty(E("9", "10", "11")), entry: (x) => x === "" || /^[a-z]{3,12}$/.test(x), sort: empty(E("name", "fraser")), search: empty(E("")),
  }[a]?.(v) ?? false)],
  compare: [E("add", "remove"), ANY],
  mylist: [E("add", "remove", "export_ics", "export_pdf", "export_copy"), ANY],
  map: [E("load", "locate", "home", "legend", "region", "search"), (v, a) => (a === "legend" ? E("public", "catholic", "french", "mine").has(v) : a === "region" ? empty(REGIONS)(v) : v === "")],
  quiz: [E("start", "step", "done", "pdf", "share", "cta"), (v, a) => (a === "step" ? /^q([1-9]|1[0-2])$/.test(v) : v === "")],
  ui: [E("lang", "tone", "theme", "show_more", "share_link", "pwa_installed"), (v, a) => (a === "lang" ? E("es", "en", "fr").has(v) : a === "tone" ? E("teen", "family").has(v) : v === "")],
  courses: [E("finder"), ANY],
  session: [E("ics", "area", "board"), (v, a) => (a === "board" ? empty(BOARDS)(v) : a === "area" ? /^[a-z -]{0,30}$/.test(v) : v === "")],
  game: [E("open"), ANY],
  err: [/^[a-z-]+\.js$/, ANY],
};
const DIMS = { lang: E("es", "en", "fr"), device: E("mobile", "tablet", "desktop"), os: E("android", "ios", "chromeos", "windows", "macos", "linux", "other"), browser: E("samsung", "edge", "opera", "firefox", "chrome", "safari", "other"), vp: E("xs", "sm", "md", "lg", "xl") };

const ok = (rule, v, a) => (rule === ANY ? v === "" : rule instanceof Set ? rule.has(v) : rule instanceof RegExp ? rule.test(v) : !!rule(v, a));
const BOT = /bot|crawl|spider|headless|lighthouse|preview|facebookexternalhit|slurp|pingdom|monitor/i;

let sql = null;
let ready = false;
async function ensureTable() {
  if (ready) return;
  await sql`create table if not exists metrics_daily (
    day date not null,
    event text not null, a text not null default '', b text not null default '',
    lang text not null, device text not null, os text not null, browser text not null, vp text not null,
    country text not null default '', region text not null default '',
    n integer not null default 0,
    primary key (day, event, a, b, lang, device, os, browser, vp, country, region)
  )`;
  ready = true;
}

function validate(body) {
  if (!body || typeof body !== "object" || body.v !== 1 || !Array.isArray(body.e) || body.e.length === 0 || body.e.length > 25) return null;
  const d = body.d;
  if (!d || typeof d !== "object") return null;
  for (const [k, set] of Object.entries(DIMS)) if (!set.has(d[k])) return null;
  const events = [];
  for (const ev of body.e) {
    if (!Array.isArray(ev) || ev.length !== 3) continue;
    const [name, a, b] = ev;
    const r = RULES[name];
    if (!r || typeof a !== "string" || typeof b !== "string") continue;
    if (!ok(r[0], a, a) || !ok(r[1], b, a)) continue;
    events.push([name, a, b]);
  }
  return events.length ? { d, events } : null;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).end(); }
  if (BOT.test(req.headers["user-agent"] || "")) return res.status(204).end(); // checked here and never stored
  let body = req.body;
  if (typeof body === "string") {
    if (body.length > 4000) return res.status(413).end();
    try { body = JSON.parse(body); } catch { return res.status(400).end(); }
  }
  const data = validate(body);
  if (!data) return res.status(400).end();
  if (!process.env.DATABASE_URL) return res.status(204).end(); // statistics are simply off until a database is connected

  const country = /^[A-Z]{2}$/.test(req.headers["x-vercel-ip-country"] || "") ? req.headers["x-vercel-ip-country"] : "";
  const region = country === "CA" && /^[A-Z0-9]{1,3}$/.test(req.headers["x-vercel-ip-country-region"] || "") ? req.headers["x-vercel-ip-country-region"] : "";

  // Aggregate identical events of this request, then add them to today's totals (Toronto day).
  const counts = new Map();
  for (const [name, a, b] of data.events) { const k = `${name}\u0000${a}\u0000${b}`; counts.set(k, (counts.get(k) || 0) + 1); }
  try {
    sql = sql || neon(process.env.DATABASE_URL);
    await ensureTable();
    const { lang, device, os, browser, vp } = data.d;
    await sql.transaction([...counts].map(([k, n]) => {
      const [event, a, b] = k.split("\u0000");
      return sql`insert into metrics_daily (day, event, a, b, lang, device, os, browser, vp, country, region, n)
        values ((now() at time zone 'America/Toronto')::date, ${event}, ${a}, ${b}, ${lang}, ${device}, ${os}, ${browser}, ${vp}, ${country}, ${region}, ${n})
        on conflict (day, event, a, b, lang, device, os, browser, vp, country, region) do update set n = metrics_daily.n + excluded.n`;
    }));
    return res.status(204).end();
  } catch {
    return res.status(204).end(); // statistics must never break or slow the site
  }
}
