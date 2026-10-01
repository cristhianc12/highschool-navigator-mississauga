#!/usr/bin/env node
// Validates data/raw/<board>/*.json against schema.mjs.  node scripts/pipeline/validate.mjs [board ...]
import fs from "node:fs/promises";
import path from "node:path";
import { ROOT } from "./lib.mjs";
import { checkSchool, checkBoard } from "./schema.mjs";
import { SCHOOLS } from "../../js/content.js";
import { BOARDS } from "../../js/content.js";

const ctx = { ids: new Set(SCHOOLS.map((s) => s.id)), boards: new Set(Object.keys(BOARDS)) };
const boards = process.argv.slice(2).length ? process.argv.slice(2) : (await fs.readdir(path.join(ROOT, "data/raw")).catch(() => []));
let bad = 0, ok = 0;
for (const b of boards) {
  const dir = path.join(ROOT, "data/raw", b);
  const files = (await fs.readdir(dir).catch(() => [])).filter((f) => f.endsWith(".json") && !f.endsWith(".courses.json"));
  const seen = new Set(SCHOOLS.filter((s) => s.board === b).map((s) => s.id));
  for (const f of files) {
    let d;
    try { d = JSON.parse(await fs.readFile(path.join(dir, f), "utf8")); } catch (e) { console.log(`✗ ${b}/${f}: invalid JSON (${e.message})`); bad++; continue; }
    const isBoard = f === "_board.json";
    const errs = isBoard ? checkBoard(d, ctx) : checkSchool(d, ctx);
    if (!isBoard) { seen.delete(d.id); if (f !== d.id + ".json") errs.push(`file name must be ${d.id}.json`); if (SCHOOLS.find((s) => s.id === d.id)?.board !== b) errs.push("school belongs to another board"); }
    if (errs.length) { bad++; console.log(`✗ ${b}/${f}\n   - ${errs.join("\n   - ")}`); } else ok++;
  }
  if (seen.size) console.log(`… ${b}: ${seen.size} school(s) not done yet: ${[...seen].slice(0, 8).join(", ")}${seen.size > 8 ? "…" : ""}`);
}
console.log(`\n${ok} valid, ${bad} with problems`);
process.exit(bad ? 1 : 0);
