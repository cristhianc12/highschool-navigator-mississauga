#!/usr/bin/env node
// Extracts the course list (Ontario course codes + titles) from course calendar pages or PDFs.
//   node scripts/pipeline/extract-courses.mjs <school-id> <url> [<url> ...]  [--year=2026-2027]
// Writes data/raw/<board>/<school-id>.courses.json  = { year, sources, courses: [[area, [[title, g9, g10, g11, g12], ...]], ...] }
// It reads codes such as ENG1D, MPM1D, ICS3U: anything without a valid code is ignored, so it cannot invent courses.
// Always spot-check the output against the page (the agent brief says how).
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT } from "./lib.mjs";
import { SCHOOLS } from "../../js/content.js";
import { cleanCourses } from "./course-quality.mjs";

const args = process.argv.slice(2);
const year = (args.find((a) => a.startsWith("--year=")) || "").slice(7) || null;
const [id, ...urls] = args.filter((a) => !a.startsWith("--"));
const school = SCHOOLS.find((s) => s.id === id);
if (!school || !urls.length) { console.error("usage: extract-courses.mjs <school-id> <url>..."); process.exit(2); }

const CODE = /\b([A-Z]{3}[1-4][A-Z](?:[0-9A-Z])?)\b/g;
const area = (code, title) => {
  if (/co-?op/i.test(title)) return "Cooperative Education";
  const p = code.slice(0, 3);
  if (/^(ESL|ELD|EAE)/.test(p)) return "English as a Second Language";
  if (p === "ICS" || p === "ICD" || p === "TEJ" && false) return "Computer Studies";
  if (/^HR/.test(p)) return "Religious Education";
  if (/^N/.test(p)) return "First Nations, Métis and Inuit Studies";
  if (/^O/.test(p) || /^E/.test(p)) return "English";
  const first = p[0];
  return { A: "Arts", B: "Business Studies", C: "Canadian and World Studies", D: "Cooperative Education", F: "French as a Second Language", G: "Guidance and Career Education", H: "Social Sciences and Humanities", I: "Interdisciplinary Studies", L: "International Languages", M: "Mathematics", P: "Health and Physical Education", S: "Science", T: "Technological Education" }[first] || "Other";
};
const gradeOf = (code) => ({ 1: 9, 2: 10, 3: 11, 4: 12 }[code[3]]);
const tidy = (t) => t.replace(/[|•·\t]+/g, " ").replace(/\s{2,}/g, " ").replace(/^[\s\-–—:,.(]+|[\s\-–—:,.)]+$/g, "").replace(/\bGrade \d+\b.*$/i, "").trim();

const found = new Map(); // key: normalised title + area
const add = (title, code) => {
  title = tidy(title);
  if (title.length < 3 || title.length > 90 || /^[A-Z]{3}[1-4]/.test(title) || /^\d+$/.test(title)) return;
  const a = area(code, title);
  const key = a + "|" + title.toLowerCase();
  if (!found.has(key)) found.set(key, { title, area: a, g: {} });
  const g = gradeOf(code);
  const cell = (found.get(key).g[g] ||= new Set());
  cell.add(code);
};

for (const url of urls) {
  const text = execFileSync("node", [path.join(ROOT, "scripts/pipeline/crawl.mjs"), "page", url, "--max=2000000"], { env: process.env, maxBuffer: 256 * 1024 * 1024 }).toString("utf8").split("\n").filter((l) => !l.startsWith("# "));
  for (let i = 0; i < text.length; i++) {
    const line = text[i].trim();
    const codes = [...line.matchAll(CODE)].map((m) => m[1]);
    if (!codes.length) continue;
    const rest = line.replace(CODE, " ");
    let title = tidy(rest);
    if (line.includes(" | ")) {
      // table row ("a | b | c"): the title is the first short, capitalised cell that holds no course code
      const cells = line.split(" | ").map((c) => c.trim());
      const cand = cells.find((c) => c && !new RegExp(CODE.source).test(c) && /^[A-Z0-9][^|]{2,69}$/.test(tidy(c)) && !/^(n\/a|yes|no|full|grade|\d+)$/i.test(c));
      if (cand) title = tidy(cand);
    }
    if (title.length < 3) title = tidy(text[i - 1] || ""); // code on its own line: the title is the previous line
    if (title.length < 3 && text[i + 1] && !CODE.test(text[i + 1])) title = tidy(text[i + 1]);
    CODE.lastIndex = 0;
    for (const c of new Set(codes)) add(title, c);
  }
}

const byArea = new Map();
for (const e of found.values()) {
  const row = [e.title, ...[9, 10, 11, 12].map((g) => [...(e.g[g] || [])].join(" "))];
  (byArea.get(e.area) || byArea.set(e.area, []).get(e.area)).push(row);
}
const raw = [...byArea.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([a, rows]) => [a, rows.sort((x, y) => x[0].localeCompare(y[0]))]);
const { courses, fixed, dropped } = cleanCourses(raw);
const total = courses.reduce((n, [, r]) => n + r.length, 0);
const out = path.join(ROOT, "data/raw", school.board, `${id}.courses.json`);
await fs.mkdir(path.dirname(out), { recursive: true });
await fs.writeFile(out, JSON.stringify({ year, sources: urls, courses }) + "\n");
console.log(`${id}: ${total} courses in ${courses.length} areas -> ${path.relative(ROOT, out)} (titles repaired from code: ${fixed}, unreadable rows dropped: ${dropped})`);
if (total < 25) console.log("WARNING: very few courses found. Check the page (it may be a menu page: find the real calendar/course list link) and re-run.");
