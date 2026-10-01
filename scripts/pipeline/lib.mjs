// Shared helpers for the data pipeline: politeness, caching and text cleanup.
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
export const CACHE = path.join(ROOT, "data/cache");
// Honest, compatible identification: some firewalls reject unknown bot-style strings but accept the standard "Mozilla/5.0 (compatible; ...)" form.
export const UA = "Mozilla/5.0 (compatible; HighschoolNavigatorGTA/1.0)";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const slug = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const lastHit = new Map();
/** GET with an on-disk cache, a per-host delay and retries. Returns { ok, status, url, text } (text only for text types). */
export async function get(url, { ttlHours = 24 * 7, delay = 400, binary = false, headers = {}, timeoutMs = 30000 } = {}) {
  await fs.mkdir(CACHE, { recursive: true });
  const key = crypto.createHash("sha1").update(url).digest("hex");
  const file = path.join(CACHE, key + (binary ? ".bin" : ".txt"));
  try {
    const st = await fs.stat(file);
    if (Date.now() - st.mtimeMs < ttlHours * 3600e3) {
      const meta = JSON.parse(await fs.readFile(file + ".json", "utf8"));
      return { ...meta, ...(binary ? { buf: await fs.readFile(file) } : { text: await fs.readFile(file, "utf8") }) };
    }
  } catch { /* cache miss */ }
  const host = new URL(url).host;
  for (let attempt = 0; attempt < 3; attempt++) {
    const wait = (lastHit.get(host) || 0) + delay - Date.now();
    if (wait > 0) await sleep(wait);
    lastHit.set(host, Date.now());
    try {
      const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA, "Accept-Language": "en-CA,en;q=0.9", Accept: "text/html,application/xhtml+xml,application/pdf,text/csv,*/*;q=0.8", ...headers }, signal: AbortSignal.timeout(timeoutMs) });
      const meta = { ok: res.ok, status: res.status, url: res.url, type: res.headers.get("content-type") || "" };
      if (res.status >= 500 || res.status === 429) { await sleep(1500 * (attempt + 1)); continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      if (res.ok) {
        await fs.writeFile(file, buf);
        await fs.writeFile(file + ".json", JSON.stringify(meta));
      }
      return { ...meta, ...(binary ? { buf } : { text: buf.toString("utf8") }) };
    } catch (e) {
      if (attempt === 2) return { ok: false, status: 0, url, error: String(e.message || e) };
      await sleep(1000 * (attempt + 1));
    }
  }
  return { ok: false, status: 0, url, error: "retries exhausted" };
}

export const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
export async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 1) + "\n");
}
