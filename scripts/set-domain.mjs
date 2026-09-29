// Usage: node scripts/set-domain.mjs my-new-name.vercel.app
// Rewrites the production domain in canonical/Open Graph/JSON-LD tags, sitemap.xml and robots.txt.
import { readFileSync, writeFileSync } from "node:fs";

const next = (process.argv[2] || "").replace(/^https?:\/\//, "").replace(/\/+$/, "");
if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(next)) {
  console.error("Usage: node scripts/set-domain.mjs <domain>   e.g. hs-mississauga.vercel.app");
  process.exit(1);
}
const files = ["index.html", "quiz.html", "privacy.html", "sitemap.xml", "robots.txt"];
const re = /https?:\/\/[a-z0-9.-]+\.(?:vercel\.app|ca|com|org)(?=\/|"|<|\s|$)/gi;
let total = 0;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  const out = src.replace(re, (m) => (m.includes("fonts.g") || m.includes("github.com") || m.includes("schema.org") || m.includes("w3.org") || m.includes("sitemaps.org") ? m : `https://${next}`));
  if (out !== src) { writeFileSync(f, out); total++; console.log("updated", f); }
}
console.log(`Done: ${total} file(s) now point to https://${next}`);
