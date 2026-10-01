#!/usr/bin/env node
// Polite page reader for the scraping agents. Prints readable text (HTML or PDF) and the page's links,
// with an on-disk cache and a per-host delay, so agents spend tokens on content, not markup.
//   node scripts/pipeline/crawl.mjs page <url> [--links] [--max=12000] [--find=regex]
//   node scripts/pipeline/crawl.mjs links <url> [--match=regex]       (links only)
//   node scripts/pipeline/crawl.mjs sitemap <origin> [--match=regex]  (urls from sitemap.xml)
// Needs: NODE_USE_ENV_PROXY=1 (this environment routes traffic through a proxy).
import { load } from "cheerio";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { get, clean } from "./lib.mjs";

const [cmd, target, ...rest] = process.argv.slice(2);
const opt = Object.fromEntries(rest.filter((a) => a.startsWith("--")).map((a) => { const [k, v] = a.slice(2).split(/=(.*)/s); return [k, v ?? true]; }));
if (!cmd || !target) { console.error("usage: crawl.mjs page|links|sitemap <url>"); process.exit(2); }

const pdfText = (buf) => {
  const f = path.join(os.tmpdir(), `crawl-${process.pid}-${Date.now()}.pdf`);
  fs.writeFileSync(f, buf);
  try { return execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", f, "-"], { maxBuffer: 64 * 1024 * 1024 }).toString("utf8"); }
  finally { fs.rmSync(f, { force: true }); }
};

async function read(url) {
  const head = await get(url, { binary: true, ttlHours: 24 * 14, delay: 600, timeoutMs: 45000 });
  if (!head.ok) return { ok: false, status: head.status, url, error: head.error };
  if (/pdf/i.test(head.type) || /\.pdf(\?|$)/i.test(url)) return { ok: true, url: head.url, kind: "pdf", text: pdfText(head.buf), links: [] };
  const html = head.buf.toString("utf8");
  const $ = load(html);
  const links = [];
  $("a[href]").each((_, a) => {
    let href = $(a).attr("href");
    if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) return;
    try { href = new URL(href, head.url).href.replace(/#.*$/, ""); } catch { return; }
    links.push({ href, text: clean($(a).text()).slice(0, 90) });
  });
  $("script,style,noscript,svg,iframe,nav,footer,header form").remove();
  const main = $("main, [role=main], #content, .content, article").first();
  const root = main.length && clean(main.text()).length > 400 ? main : $("body");
  // a table row becomes one line: "cell | cell | cell"
  root.find("tr").each((_, tr) => { const cells = $(tr).children("th,td").map((_, c) => clean($(c).text())).get(); $(tr).text(cells.join(" | ")); });
  // keep headings, list items and table rows on their own lines
  root.find("h1,h2,h3,h4,h5,li,tr,p,br,div").each((_, el) => { $(el).append("\n"); });
  const text = root.text().split("\n").map(clean).filter(Boolean).join("\n");
  const seen = new Set();
  return { ok: true, url: head.url, kind: "html", title: clean($("title").text()), text, links: links.filter((l) => !seen.has(l.href) && seen.add(l.href)) };
}

if (cmd === "sitemap") {
  const origin = target.replace(/\/+$/, "");
  const urls = new Set();
  const walk = async (u, depth = 0) => {
    const r = await get(u, { ttlHours: 24 * 14, delay: 600 });
    if (!r.ok || !r.text) return;
    const locs = [...r.text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
    for (const l of locs) { if (/sitemap.*\.xml/i.test(l) && depth < 2) await walk(l, depth + 1); else urls.add(l); }
  };
  await walk(origin + "/sitemap.xml");
  const re = opt.match ? new RegExp(opt.match, "i") : null;
  const out = [...urls].filter((u) => !re || re.test(u));
  console.log(out.length ? out.join("\n") : "(no sitemap found)");
  process.exit(0);
}

const page = await read(target);
if (!page.ok) { console.log(`FETCH FAILED ${page.status || ""} ${page.error || ""} ${target}`); process.exit(1); }
if (cmd === "links") {
  const re = opt.match ? new RegExp(opt.match, "i") : null;
  for (const l of page.links.filter((l) => !re || re.test(l.href + " " + l.text))) console.log(`${l.text || "-"}\t${l.href}`);
  process.exit(0);
}
let text = page.text;
if (opt.find) {
  const re = new RegExp(opt.find, "i");
  const lines = text.split("\n");
  const keep = new Set();
  lines.forEach((l, i) => { if (re.test(l)) for (let k = Math.max(0, i - 2); k <= Math.min(lines.length - 1, i + 4); k++) keep.add(k); });
  text = [...keep].sort((a, b) => a - b).map((i) => lines[i]).join("\n") || "(no match for --find)";
}
const max = Number(opt.max || 12000);
console.log(`# ${page.title || page.url}\n# url: ${page.url} (${page.kind}, ${page.text.length} chars${text.length > max ? `, showing first ${max}` : ""})\n`);
console.log(text.slice(0, max));
if (opt.links && page.links.length) console.log("\n# LINKS\n" + page.links.slice(0, 200).map((l) => `${l.text || "-"}\t${l.href}`).join("\n"));
