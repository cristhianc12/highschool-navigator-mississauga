// Builds scripts/pipeline/course-codes.json (course code -> title) from the verified DPCDSB calendars
// (js/school-courses.js): only cells holding exactly one code are used, and the most common title wins.
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib.mjs";
import { COURSES } from "../../js/school-courses.js";
import { goodTitle, tidyTitle } from "./course-quality.mjs";

const votes = {};
for (const areas of Object.values(COURSES)) for (const [, rows] of areas) for (const [title, ...cells] of rows) for (const cell of cells) {
  const codes = String(cell || "").split(/\s+/).filter(Boolean).map((c) => c.slice(0, 5));
  if (new Set(codes).size !== 1 || !/^[A-Z]{3}[1-4][A-Z0-9]$/.test(codes[0])) continue;
  if (title.length > 70 || /[*|]/.test(title)) continue;
  ((votes[codes[0]] ||= {})[title] = (votes[codes[0]][title] || 0) + 1);
}
// Also learn from clean titles in the collected course lists (a code's first 5 characters identify the course).
const rawRoot = path.join(ROOT, "data/raw");
for (const b of fs.existsSync(rawRoot) ? fs.readdirSync(rawRoot) : []) for (const f of fs.readdirSync(path.join(rawRoot, b)).filter((f) => f.endsWith(".courses.json"))) {
  for (const [, rows] of JSON.parse(fs.readFileSync(path.join(rawRoot, b, f), "utf8")).courses) for (const [t0, ...cells] of rows) {
    const title = tidyTitle(t0);
    if (!goodTitle(title)) continue;
    for (const cell of cells) { const codes = String(cell || "").split(/\s+/).filter(Boolean).map((c) => c.slice(0, 5)); if (new Set(codes).size === 1) ((votes[codes[0]] ||= {})[title] = (votes[codes[0]][title] || 0) + 1); }
  }
}
const dict = Object.fromEntries(Object.entries(votes).map(([c, v]) => [c, Object.entries(v).sort((a, b) => b[1] - a[1] || a[0].length - b[0].length)[0][0]]).sort());
fs.writeFileSync(path.join(ROOT, "scripts/pipeline/course-codes.json"), JSON.stringify(dict, null, 0) + "\n");
console.log(Object.keys(dict).length, "codes");
