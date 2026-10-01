// Writes data/work/<board>.json: the schools each agent has to cover (id, name, city, official site).
import fs from "node:fs/promises";
import path from "node:path";
import { ROOT } from "./lib.mjs";
import { ROSTER, CURATED_INFO } from "../../js/data/roster.js";
import { SCHOOLS } from "../../js/content.js";

const by = {};
for (const s of SCHOOLS) {
  const r = ROSTER.find((x) => x.id === s.id);
  const c = CURATED_INFO[s.id];
  (by[s.board] ||= []).push({ id: s.id, name: r?.name || c?.official || s.name, shortName: s.name, city: s.city, region: s.region, address: s.addr, site: (r?.site || c?.site || "").replace(/^http:/, "https:") || null, curated: !r });
}
await fs.mkdir(path.join(ROOT, "data/work"), { recursive: true });
for (const [b, list] of Object.entries(by)) {
  list.sort((a, b) => a.name.localeCompare(b.name));
  await fs.writeFile(path.join(ROOT, `data/work/${b}.json`), JSON.stringify(list, null, 1) + "\n");
  console.log(b.padEnd(10), list.length);
}
