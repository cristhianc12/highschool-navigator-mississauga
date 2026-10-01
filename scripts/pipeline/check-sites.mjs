#!/usr/bin/env node
// Checks every school website of the roster (and what the scraping agents confirmed): dead links and hijacked
// domains (a school's old address that now serves casino or spam pages) must not be shown to families.
//   node scripts/pipeline/check-sites.mjs        -> data/site-checks.json  (+ data/site-overrides.json for the bad ones)
import fs from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";
import { ROOT, UA, clean, sleep } from "./lib.mjs";
import { ROSTER } from "../../js/data/roster.js";

const rawSites = {};
for (const b of await fs.readdir(path.join(ROOT, "data/raw")).catch(() => [])) {
  for (const f of (await fs.readdir(path.join(ROOT, "data/raw", b))).filter((f) => f.endsWith(".json") && !f.endsWith(".courses.json") && f !== "_board.json")) {
    const d = JSON.parse(await fs.readFile(path.join(ROOT, "data/raw", b, f), "utf8"));
    if (d.id) rawSites[d.id] = d.site || null;
  }
}
const https = (u) => (/^https?:\/\//i.test(u) ? u : "https://" + u).replace(/^http:/i, "https:");
const SPAM = /casino|gambl|betting|\bslots?\b|poker|jackpot|sportsbook|viagra|porn|escort|loan approval/i;
const STOP = new Set(["secondary", "school", "high", "collegiate", "institute", "catholic", "the", "and", "of", "college", "academy", "centre", "center", "learning", "alternative", "district", "st", "saint"]);
const words = (n) => n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z]+/).filter((w) => w.length > 2 && !STOP.has(w));

const jobs = ROSTER.map((r) => ({ id: r.id, name: r.name, url: rawSites[r.id] !== undefined ? rawSites[r.id] : r.site })).filter((j) => j.url);
const last = new Map();
async function check(j) {
  const url = https(j.url);
  const host = new URL(url).host;
  const wait = (last.get(host) || 0) + 500 - Date.now();
  if (wait > 0) await sleep(wait);
  last.set(host, Date.now());
  try {
    const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA, "Accept-Language": "en-CA,en;q=0.9" }, signal: AbortSignal.timeout(20000) });
    const html = await res.text();
    const $ = load(html);
    const title = clean($("title").text()).slice(0, 120);
    const text = clean($("body").text()).slice(0, 4000).toLowerCase();
    const finalHost = new URL(res.url).host;
    const hit = words(j.name).filter((w) => (title + " " + text + " " + finalHost).toLowerCase().includes(w));
    let verdict = "ok";
    if (res.status >= 400 && res.status !== 403) verdict = "dead";
    else if (res.status === 403) verdict = "blocked"; // bot protection: the page may be fine for people
    else if (SPAM.test(title + " " + text.slice(0, 1500))) verdict = "hijacked";
    else if (!hit.length && words(j.name).length) verdict = "mismatch";
    return { id: j.id, url, finalUrl: res.url, status: res.status, title, verdict };
  } catch (e) {
    return { id: j.id, url, status: 0, verdict: "dead", error: String(e.cause?.code || e.message).slice(0, 60) };
  }
}
const out = [];
const queue = [...jobs];
await Promise.all(Array.from({ length: 8 }, async () => { for (let j; (j = queue.shift());) out.push(await check(j)); }));
out.sort((a, b) => a.id.localeCompare(b.id));
await fs.writeFile(path.join(ROOT, "data/site-checks.json"), JSON.stringify({ checked: new Date().toISOString().slice(0, 10), results: out }, null, 1) + "\n");
const bad = out.filter((r) => ["dead", "hijacked"].includes(r.verdict));
const prev = JSON.parse(await fs.readFile(path.join(ROOT, "data/site-overrides.json"), "utf8").catch(() => "{}"));
for (const r of bad) prev[r.id] = null; // never show these; an agent-confirmed site (raw data) still wins at build time
for (const r of out) if (r.verdict === "ok" && r.id in prev && prev[r.id] === null) delete prev[r.id];
await fs.writeFile(path.join(ROOT, "data/site-overrides.json"), JSON.stringify(prev, null, 1) + "\n");
const c = {}; for (const r of out) c[r.verdict] = (c[r.verdict] || 0) + 1;
console.log(c, "overrides:", Object.keys(prev).length);
for (const r of out.filter((r) => ["hijacked", "mismatch"].includes(r.verdict))) console.log(r.verdict, r.id, r.url, "|", r.title);
