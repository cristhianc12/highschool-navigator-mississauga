#!/usr/bin/env node
// Reads data/sources/fraser-2025.pdf (Fraser Institute, Report Card on Ontario's Secondary Schools 2025; supplied by the
// site owner) into data/fraser-2025.json: every row of the ranking table (rank, previous rank, trend, school, city, rating, previous rating).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT } from "./lib.mjs";

const pdf = path.join(ROOT, "data/sources/fraser-2025.pdf");
const text = execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", pdf, "-"], { maxBuffer: 64 * 1024 * 1024 }).toString("utf8");
const ROW = /(\d{1,3})\s+(\d{1,3}|n\/a)\s+(n\/a|[—pq–-])\s+(\S.*?)\s{2,}(\S.*?)\s{2,}(\d{1,2}\.\d)\s+(\d{1,2}\.\d|n\/a)(?=\s|$)/g;
const rows = [];
for (const line of text.split("\n")) for (const m of line.matchAll(ROW)) rows.push({ rank: +m[1], lastRank: m[2] === "n/a" ? null : +m[2], trend: m[3], name: m[4].trim(), city: m[5].trim(), score: +m[6], prev: m[7] === "n/a" ? null : +m[7] });
fs.writeFileSync(path.join(ROOT, "data/fraser-2025.json"), JSON.stringify({ source: "Fraser Institute, Report Card on Ontario's Secondary Schools 2025 (2024-25 school year)", rows }, null, 0) + "\n");
console.log(rows.length, "rows; ranks", Math.min(...rows.map((r) => r.rank)), "-", Math.max(...rows.map((r) => r.rank)));
