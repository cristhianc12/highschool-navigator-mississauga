// Builds js/data/roster.js: every public, Catholic and French-language secondary school in the GTA
// (Toronto + Peel, York, Durham, Halton), from Ontario's open "School information and student demographics"
// dataset (Open Government Licence - Ontario). Schools already curated by hand in js/content.js keep their
// own record; they only receive city/region. Run: node scripts/pipeline/build-roster.mjs
import fs from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
import { get, ROOT, slug, clean, writeJson } from "./lib.mjs";
import { BOARD_BY_NAME, REGION_BY_CITY } from "./boards.mjs";
import { CURATED } from "./curated.mjs";

const pkg = await (await get("https://data.ontario.ca/api/3/action/package_show?id=school-information-and-student-demographics", { ttlHours: 24 })).text;
const yr = (u) => (u.match(/(\d{4})_(\d{2})/) || [0, 0, 0]).slice(1).join("");
const res = JSON.parse(pkg).result.resources.filter((r) => /_en[^/]*\.xlsx$/i.test(r.url)).sort((a, b) => yr(b.url).localeCompare(yr(a.url)))[0];
console.log("source:", res.name, res.url);
const file = await get(res.url, { binary: true, ttlHours: 24 * 14 });
const wb = new ExcelJS.Workbook();
await wb.xlsx.load(file.buf);
const ws = wb.worksheets[0];
const head = Array.from({ length: ws.columnCount }, (_, k) => clean(ws.getRow(1).getCell(k + 1).value));
const rows = [];
ws.eachRow((row, i) => {
  if (i === 1) return;
  const o = {};
  head.forEach((h, k) => { const v = row.getCell(k + 1).value; o[h] = v && typeof v === "object" && "text" in v ? v.text : v; });
  rows.push(o);
});

// Base list: Ontario's "Publicly Funded Schools" contact list (current month). The SIF file adds
// coordinates, enrolment and the municipality (matched by school number).
const cpkg = JSON.parse((await get("https://data.ontario.ca/api/3/action/package_show?id=ontario-public-school-contact-information", { ttlHours: 24 })).text).result;
const cres = cpkg.resources.find((r) => /_en\.txt$/i.test(r.url));
console.log("contact list:", cres.name);
const ctext = new TextDecoder("windows-1252").decode((await get(cres.url, { binary: true, ttlHours: 24 * 14 })).buf);
const [chead, ...clines] = ctext.split(/\r?\n/).filter(Boolean).map((l) => l.split("|"));
const contacts = clines.map((c) => Object.fromEntries(chead.map((h, k) => [h, clean(c[k])])));
const sif = new Map(rows.map((r) => [String(r["School Number"]).padStart(6, "0"), r]));

const KEEP_COND = new Set(["Not applicable", "Alternative", "Vocational/Occupational"]);
const city = (m) => clean(m).replace(/,\s*(City|Town|Township|Municipality|County|Region) of$/i, "").replace(/^(City|Town|Township) of /i, "");
const out = [];
for (const r of contacts) {
  const board = BOARD_BY_NAME[r["Board Name"]];
  if (!board) continue;
  const level = r["School Level"];
  if (!(level === "Secondary" || (level === "Elem/Sec" && /9/.test(r["Grade Range"] || "")))) continue;
  if (!KEEP_COND.has(r["School Special Conditions"])) continue;
  const x = sif.get(r["School Number"]) || {};
  // The postal city is the best everyday name; the SIF municipality covers postal names such as Thornhill or Woodbridge.
  const postal = city(r["City"]).replace(/\b(\w)(\w*)/g, (_, a, b) => a.toUpperCase() + b.toLowerCase());
  const c = REGION_BY_CITY[postal] || /^(Scarborough|North York|Etobicoke|East York|York|Agincourt|West Hill|Weston|Rexdale|Downsview)$/i.test(postal) ? postal : city(x["Municipality"] || r["City"]);
  const region = REGION_BY_CITY[c] || (/^(Scarborough|North York|Etobicoke|East York|York|Agincourt|West Hill|Weston|Rexdale|Downsview)$/i.test(c) ? "toronto" : null);
  if (!region) continue;
  const cityName = region === "toronto" ? "Toronto" : c;
  out.push({
    key: r["School Number"],
    name: r["School Name"], board, city: cityName, region,
    hood: region === "toronto" && /^[A-Za-z ]+$/.test(r["City"]) && r["City"].toLowerCase() !== "toronto" ? r["City"].replace(/\b(\w)(\w*)/g, (_, a, b) => a.toUpperCase() + b.toLowerCase()) : null,
    addr: r["Street"], postal: r["Postal Code"],
    geo: x["Latitude"] ? [Number(x["Latitude"]), Number(x["Longitude"])] : null,
    site: r["Website"] || null, boardSite: r["Board Website"] || null,
    phone: r["Phone"] || null,
    lang: r["School Language"] === "French" ? "fr" : "en",
    enrol: Number(x["Enrolment"]) || null,
    special: r["School Special Conditions"] === "Not applicable" ? null : r["School Special Conditions"],
    grades: r["Grade Range"],
  });
}
const seen = new Map();
for (const s of out) {
  let id = `${s.board}-${slug(s.name.replace(/\b(Secondary School|High School|Collegiate Institute|Catholic|Secondary|C\.?S\.?S\.?|S\.?S\.?)\b/gi, ""))}`.replace(/-$/, "");
  if (seen.has(id)) id += "-" + slug(s.city);
  seen.set(id, true);
  s.id = id;
}
// Curated schools: attach the official record, keep their ids.
const curatedInfo = {};
const taken = new Set();
for (const [id, [board, name]] of Object.entries(CURATED)) {
  const m = out.find((s) => s.board === board && s.name === name);
  if (!m) { console.warn("NOT FOUND in open data:", id, name); continue; }
  taken.add(m.key);
  curatedInfo[id] = { key: m.key, city: m.city, region: m.region, official: m.name, geo: m.geo, postal: m.postal, addr: m.addr, site: m.site, phone: m.phone, enrol: m.enrol };
}
await writeJson(path.join(ROOT, "data/roster.json"), { source: res.url, built: new Date().toISOString().slice(0, 10), schools: out, curated: curatedInfo });

// The site module: only schools that are not curated, as compact rows.
const r5 = (n) => Math.round(n * 1e5) / 1e5;
const rows2 = out.filter((s) => !taken.has(s.key)).sort((a, b) => a.board.localeCompare(b.board) || a.name.localeCompare(b.name)).map((s) => ({
  id: s.id, key: s.key, board: s.board, name: s.name, addr: s.addr, city: s.city, region: s.region,
  ...(s.hood ? { hood: s.hood } : {}), geo: s.geo ? [r5(s.geo[0]), r5(s.geo[1])] : null,
  ...(s.site ? { site: s.site } : {}), ...(s.phone ? { phone: s.phone } : {}),
  ...(s.enrol ? { enrol: s.enrol } : {}), ...(s.special ? { special: s.special } : {}), lang: s.lang, postal: s.postal,
}));
const cur = Object.fromEntries(Object.entries(curatedInfo).map(([id, c]) => [id, { city: c.city, region: c.region, key: c.key, official: c.official, addr: c.addr, geo: c.geo, postal: c.postal, ...(c.site ? { site: c.site } : {}), ...(c.phone ? { phone: c.phone } : {}), ...(c.enrol ? { enrol: c.enrol } : {}) }]));
const banner = `// GENERATED by scripts/pipeline/build-roster.mjs from Ontario's open school data (Open Government Licence - Ontario).
// Source: ${res.url}
// Do not edit by hand: re-run the script. Schools curated by hand live in content.js (see CURATED_INFO).
`;
await fs.mkdir(path.join(ROOT, "js/data"), { recursive: true });
await fs.writeFile(path.join(ROOT, "js/data/roster.js"), `${banner}export const ROSTER_BUILT = ${JSON.stringify(new Date().toISOString().slice(0, 10))};\nexport const CURATED_INFO = ${JSON.stringify(cur)};\nexport const ROSTER = [\n${rows2.map((r) => " " + JSON.stringify(r)).join(",\n")}\n];\n`);
console.log("schools:", out.length);
const byB = {}; for (const s of out) byB[s.board] = (byB[s.board] || 0) + 1; console.log(byB);
