// Quality gate for course titles. Ontario course CODES are province-wide (ENG1D = English, Grade 9, Academic), so when a
// scraped title is mangled (table fragments, truncated text) we fall back to the title that the verified calendars give
// for that code, and otherwise drop the row: a missing course is better than a wrong one.
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib.mjs";

const DICT_FILE = path.join(ROOT, "scripts/pipeline/course-codes.json");
export const dict = fs.existsSync(DICT_FILE) ? JSON.parse(fs.readFileSync(DICT_FILE, "utf8")) : {};

/** Repairs the usual extraction damage (leftover brackets after the code was cut out, list bullets, notes). */
export function tidyTitle(t) {
  t = String(t || "").replace(/\s+/g, " ").trim();
  t = t.replace(/^[*•·\-–—\/=\s]+/, "").replace(/^[A-E]\s*[–-]\s+/, "");
  t = t.replace(/\s*\([^)]*$/, "");          // "Name (University/College" -> "Name"
  t = t.replace(/\s*\(\s*\)/g, "");          // "Name ( )" -> "Name"
  t = t.replace(/\s*[-–]\s*(full|waitlisted|full\/waitlisted|online only).*$/i, "").replace(/\s+ONLINE ONLY$/i, "");
  t = t.replace(/[\s,;:/(\-–]+$/, "").trim();
  return t;
}

const JUNK = /^(course title|course name|course|male|female|grade|prerequisite|prereq|recommendation|credit|type|code|description|pathway|sector|title|n\/a|none|see |please |note|page|semester|level)\b/i;
export function goodTitle(t) {
  t = String(t || "").trim();
  if (t.length < 3 || t.length > 70) return false;
  if (!/^[A-Z0-9]/.test(t)) return false; // official titles start with a capital letter or a digit
  if ((t.match(/\(/g) || []).length !== (t.match(/\)/g) || []).length) return false;
  if (/[|*\\]/.test(t) || /\/\s*$/.test(t) || /^[A-Z]\d\b/.test(t) || /\b(req\.?|prerequisite)\b/i.test(t)) return false;
  if (JUNK.test(t) || t.split(/\s+/).length > 9) return false;
  if (/\b(university|college|workplace|open)\s*\/\s*\w+/i.test(t)) return false; // "Open/University/College" fragments
  if (!/[a-z]{3}/i.test(t) || (/^[A-Z ]+$/.test(t) && t.length <= 15)) return false; // table headers such as "ARTS"
  return true;
}

const codesOf = (cell) => String(cell || "").split(/\s+/).filter((c) => /^[A-Z]{3}[1-4][A-Z0-9]{1,2}$/.test(c));

/** Cleans [[area, [[title, g9..g12]]]]: fixes or drops bad titles. Returns { courses, fixed, dropped }. */
export function cleanCourses(areas) {
  let fixed = 0, dropped = 0;
  const out = [];
  for (const [area, rows] of areas) {
    const keep = [];
    for (const row of rows) {
      let [title, ...cells] = row;
      // prerequisite lists and waitlist notes are not course rows: drop them instead of "repairing" them
      if (/\b(req\.?|prerequisites?|waitlist\w*|full\/)\b/i.test(title) || /^[^(]*\)/.test(title)) { dropped++; continue; }
      title = tidyTitle(title);
      if (!goodTitle(title)) {
        const codes = cells.flatMap(codesOf);
        const canon = codes.map((c) => dict[c.slice(0, 5)]).find(Boolean);
        if (canon) { title = canon; fixed++; } else { dropped++; continue; }
      }
      keep.push([title, ...cells]);
    }
    // merge rows that ended up with the same title
    const merged = new Map();
    for (const [t, ...cells] of keep) {
      const k = t.toLowerCase();
      if (!merged.has(k)) merged.set(k, [t, "", "", "", ""]);
      const m = merged.get(k);
      cells.forEach((c, i) => { const set = new Set([...codesOf(m[i + 1]), ...codesOf(c)]); m[i + 1] = [...set].sort().join(" "); });
    }
    if (merged.size) out.push([area, [...merged.values()].sort((a, b) => a[0].localeCompare(b[0]))]);
  }
  return { courses: out, fixed, dropped };
}
