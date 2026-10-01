#!/usr/bin/env node
// Writes data/review.md: what was collected per board and school, and what a person should look at.
import fs from "node:fs/promises";
import path from "node:path";
import { ROOT } from "./lib.mjs";
import { SCHOOLS, BOARDS } from "../../js/content.js";

const raw = path.join(ROOT, "data/raw");
const lines = ["# Data review", "", `Generated ${new Date().toISOString().slice(0, 10)} by scripts/pipeline/report.mjs. Every fact in \`data/raw\` carries its source URL; \`missing\` lists what the pages did not state.`, ""];
const tot = { schools: 0, withData: 0, programs: 0, courses: 0, sessions: 0, adm: 0 };
const attention = [];
for (const b of Object.keys(BOARDS)) {
  const schools = SCHOOLS.filter((s) => s.board === b);
  const dir = path.join(raw, b);
  const files = new Set((await fs.readdir(dir).catch(() => [])));
  const board = files.has("_board.json") ? JSON.parse(await fs.readFile(path.join(dir, "_board.json"), "utf8")) : null;
  lines.push(`## ${BOARDS[b].en}`, "", board ? `Board file: registration ${board.registration ? "yes" : "NO"}, ${board.programs?.length || 0} board programs, ${board.sessions?.length || 0} board sessions.` : "Board file: none.", "", "| School | Programs | Courses | Sessions | Admissions | Site | Notes |", "|---|---:|---:|---:|---:|---|---|");
  for (const s of schools) {
    tot.schools++;
    if (!files.has(s.id + ".json")) { lines.push(`| ${s.name} | – | – | – | – | | not collected |`); attention.push(`${BOARDS[b].en}: ${s.name} has no collected data`); continue; }
    const d = JSON.parse(await fs.readFile(path.join(dir, s.id + ".json"), "utf8"));
    let n = 0;
    if (files.has(s.id + ".courses.json")) n = JSON.parse(await fs.readFile(path.join(dir, s.id + ".courses.json"), "utf8")).courses.reduce((a, [, r]) => a + r.length, 0);
    tot.withData++; tot.programs += (d.programs || []).length; tot.courses += n; tot.sessions += (d.sessions || []).length; tot.adm += (d.admissions || []).length;
    const note = (d.missing || []).slice(0, 2).join("; ").replace(/\|/g, "/").slice(0, 160);
    lines.push(`| ${s.name} | ${(d.programs || []).length} | ${n || "–"} | ${(d.sessions || []).length} | ${(d.admissions || []).length} | ${d.site ? "yes" : "no"} | ${note} |`);
    if (!d.site) attention.push(`${BOARDS[b].en}: ${s.name} has no confirmed website`);
  }
  lines.push("");
}
lines.push("## Totals", "", `${tot.withData} of ${tot.schools} schools collected; ${tot.programs} school-level programs, ${tot.courses} courses, ${tot.sessions} school sessions, ${tot.adm} admissions entries.`, "", "## Needs a human look", "", ...attention.map((a) => `- ${a}`), "");
await fs.writeFile(path.join(ROOT, "data/review.md"), lines.join("\n"));
console.log(`data/review.md written: ${tot.withData}/${tot.schools} schools, ${attention.length} items to look at`);
