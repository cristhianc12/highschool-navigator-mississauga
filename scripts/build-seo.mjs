// Generates the static, crawlable pages that make the site easy to find:
//   - index.html (English home), es.html, fr.html: head tags (title, description, hreflang, Open Graph, JSON-LD)
//     and a plain-HTML copy of the key content that crawlers and link previews read before any JavaScript runs;
//   - board/<id>.html, region/<id>.html and their /es and /fr versions: one landing page per school board and
//     per region, listing its schools with links into the interactive guide;
//   - sitemap.xml with the language alternates.
// The interactive app replaces the static body as soon as it loads, so people see the full guide and crawlers see the content.
// Run: node scripts/build-seo.mjs   (after the roster or the copy changes). Output is committed.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SCHOOLS, UI, BOARDS } from "../js/content.js";
import { BOARD_META, BOARD_ORDER, REGION_ORDER, REGIONS, REGION_SHORT, SYSTEMS } from "../js/geo.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://highschool-gta-navigator.vercel.app";
const LANGS = ["en", "es", "fr"];
const LOCALE = { en: "en_CA", es: "es_CO", fr: "fr_CA" };
const HTML_LANG = { en: "en", es: "es", fr: "fr-CA" };
const NAME = "Highschool Navigator GTA";
const today = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const prefix = (l) => (l === "en" ? "" : `/${l}`);
const homeUrl = (l) => (l === "en" ? "/" : `/${l}`);
const pageUrl = (l, kind, id) => `${prefix(l)}/${kind}/${id}`;
const full = (path) => SITE + path;

/* ---------- copy (kept short; the app itself carries the detailed text) ---------- */
const T = {
  en: {
    boardTitle: (n) => `${n}: high schools, programs and dates`,
    regionTitle: (n) => `High schools in ${n}: programs, dates and Fraser scores`,
    boardH: (n) => `${n} high schools`,
    regionH: (n) => `High schools in ${n}`,
    boardP: (n, cnt, cities, sys) => `${cnt} secondary schools in ${cities}. See programs (AP, IB, Arts, STEM, French, trades), courses, how to register, application dates, information sessions and Fraser scores for the ${n} (${sys}), in English, Spanish and French.`,
    regionP: (n, cnt, boards) => `${cnt} public, Catholic and French-language secondary schools in ${n}, from ${boards}. Compare programs, courses, application dates and Fraser scores.`,
    schools: "Schools", open: "Open the interactive guide for this list", home: "All GTA high schools", quiz: "Take the 3-minute questionnaire",
    boards: "School boards", regions: "Areas", about: "Informational guide, not affiliated with any school board. Always confirm dates and requirements with the school or board.",
    homeH: "Find your high school in the GTA", scope: "Public, Catholic and French-language boards in Toronto, Peel, York, Durham and Halton.",
  },
  es: {
    boardTitle: (n) => `${n}: escuelas secundarias, programas y fechas`,
    regionTitle: (n) => `Escuelas secundarias en ${n}: programas, fechas y notas Fraser`,
    boardH: (n) => `Escuelas secundarias de ${n}`,
    regionH: (n) => `Escuelas secundarias en ${n}`,
    boardP: (n, cnt, cities, sys) => `${cnt} escuelas secundarias en ${cities}. Mira programas (AP, IB, Artes, STEM, francés, oficios), materias, cómo registrarte, fechas de aplicación, charlas informativas y notas Fraser del ${n} (${sys}), en español, inglés y francés.`,
    regionP: (n, cnt, boards) => `${cnt} escuelas secundarias públicas, católicas y de lengua francesa en ${n}, de ${boards}. Compara programas, materias, fechas de aplicación y notas Fraser.`,
    schools: "Escuelas", open: "Abrir la guía interactiva con esta lista", home: "Todas las secundarias del GTA", quiz: "Hacer el cuestionario de 3 minutos",
    boards: "Consejos escolares", regions: "Zonas", about: "Guía informativa, sin relación con ningún consejo escolar. Confirma siempre fechas y requisitos con la escuela o el consejo.",
    homeH: "Encuentra tu high school en el GTA", scope: "Consejos públicos, católicos y de lengua francesa en Toronto, Peel, York, Durham y Halton.",
  },
  fr: {
    boardTitle: (n) => `${n} : écoles secondaires, programmes et dates`,
    regionTitle: (n) => `Écoles secondaires de ${n} : programmes, dates et cotes Fraser`,
    boardH: (n) => `Écoles secondaires – ${n}`,
    regionH: (n) => `Écoles secondaires de ${n}`,
    boardP: (n, cnt, cities, sys) => `${cnt} écoles secondaires à ${cities}. Consulte les programmes (AP, BI, arts, STIM, français, métiers), les cours, l'inscription, les dates de demande, les séances d'information et les cotes Fraser pour ${n} (${sys}), en français, en anglais et en espagnol.`,
    regionP: (n, cnt, boards) => `${cnt} écoles secondaires publiques, catholiques et de langue française : ${n} (${boards}). Compare les programmes, les cours, les dates de demande et les cotes Fraser.`,
    schools: "Écoles", open: "Ouvrir le guide interactif avec cette liste", home: "Toutes les écoles secondaires de la RGT", quiz: "Faire le questionnaire de 3 minutes",
    boards: "Conseils scolaires", regions: "Régions", about: "Guide informatif, sans lien avec aucun conseil scolaire. Confirme toujours les dates et les exigences auprès de l'école ou du conseil.",
    homeH: "Trouve ton école secondaire dans la RGT", scope: "Conseils publics, catholiques et de langue française à Toronto, Peel, York, Durham et Halton.",
  },
};

const byBoard = (b) => SCHOOLS.filter((s) => s.board === b);
const byRegion = (r) => SCHOOLS.filter((s) => s.region === r);
const topCities = (list, n = 4) => {
  const c = {};
  for (const s of list) if (s.city) c[s.city] = (c[s.city] || 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);
};
const listFmt = (items, l) => new Intl.ListFormat(HTML_LANG[l], { style: "long", type: "conjunction" }).format(items);
const bname = (b, l) => BOARDS[b][l] || BOARDS[b].en;
const shortBoard = (b, l) => bname(b, l).replace(/\s*\(.*\)$/, "");

/* ---------- shared pieces ---------- */
function alternates(kind, id) {
  const url = (l) => (kind === "home" ? homeUrl(l) : pageUrl(l, kind, id));
  return LANGS.map((l) => `<link rel="alternate" hreflang="${HTML_LANG[l]}" href="${full(url(l))}">`).join("\n") +
    `\n<link rel="alternate" hreflang="x-default" href="${full(url("en"))}">`;
}

function head({ l, path, title, desc, kind, id, ld }) {
  const url = full(path);
  return `<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
${alternates(kind, id)}
<meta name="theme-color" content="#F6F4FF">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${NAME}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${LOCALE[l]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}/assets/og-image.png">
<script type="application/ld+json">
${JSON.stringify(ld)}
</script>`;
}

const crumbs = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: full(path) })),
});

function schoolLd(s) {
  const o = { "@type": "HighSchool", name: s.name, address: { "@type": "PostalAddress", addressLocality: s.city || "", addressRegion: "ON", addressCountry: "CA" } };
  if (s.site) o.url = s.site;
  return o;
}

function navLinks(l, current) {
  const t = T[l];
  const boards = BOARD_ORDER.filter((b) => byBoard(b).length).map((b) => `<li><a href="${pageUrl(l, "board", b)}">${esc(shortBoard(b, l))}</a></li>`).join("");
  const regions = REGION_ORDER.map((r) => `<li><a href="${pageUrl(l, "region", r)}">${esc(REGION_SHORT[r][l])}</a></li>`).join("");
  return `<nav aria-label="${esc(t.boards)}"><h2>${esc(t.regions)}</h2><ul>${regions}</ul><h2>${esc(t.boards)}</h2><ul>${boards}</ul></nav>`;
}

const wrapBody = (inner) => `<!--seo-body-->\n  <main class="seo-static">${inner}</main>\n  <!--/seo-body-->`;

function homeBody(l) {
  const t = T[l], u = UI[l];
  return wrapBody(`<h1>${esc(t.homeH)}</h1><p>${esc(u.metaDesc)}</p><p>${esc(t.scope)}</p>
    <p><a href="/quiz?lang=${l}">${esc(t.quiz)}</a></p>${navLinks(l)}<p>${esc(t.about)}</p>`);
}

function listBody(l, { h, p, schools, filterQuery }) {
  const t = T[l];
  const items = schools.map((s) => `<li><a href="${homeUrl(l)}#school-${s.id}">${esc(s.name)}</a>${s.city ? ` · ${esc(s.city)}` : ""}</li>`).join("");
  return wrapBody(`<p><a href="${homeUrl(l)}">← ${esc(t.home)}</a></p><h1>${esc(h)}</h1><p>${esc(p)}</p>
    <p><a href="${homeUrl(l)}?${filterQuery}#escuelas">${esc(t.open)} →</a></p>
    <h2>${esc(t.schools)} (${schools.length})</h2><ul>${items}</ul>
    <p><a href="/quiz?lang=${l}">${esc(t.quiz)}</a></p>${navLinks(l)}<p>${esc(t.about)}</p>`);
}

/* ---------- writing ---------- */
const tpl = readFileSync(join(ROOT, "index.html"), "utf8");
const swap = (html, tag, content) => html.replace(new RegExp(`<!--${tag}-->[\\s\\S]*?<!--/${tag}-->`), () => `<!--${tag}-->\n${content}\n<!--/${tag}-->`);

function render({ l, path, headArgs, body }) {
  let html = tpl;
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${HTML_LANG[l]}">`);
  html = swap(html, "seo-head", head({ l, path, ...headArgs }));
  html = html.replace(/<!--seo-body-->[\s\S]*?<!--\/seo-body-->/, () => body);
  // Pages in /es/…, /fr/… and /board/… need absolute asset URLs.
  html = html.replace(/(href|src)="(css|js|assets)\//g, '$1="/$2/').replace('class="brand" href="./"', `class="brand" href="${homeUrl(l)}"`);
  return html;
}

const written = [];
function write(path, html) {
  const file = path === "/" ? "index.html" : `${path.replace(/^\//, "")}.html`;
  mkdirSync(dirname(join(ROOT, file)), { recursive: true });
  writeFileSync(join(ROOT, file), html);
  written.push(path);
}

// Home in three languages.
for (const l of LANGS) {
  const u = UI[l], path = homeUrl(l);
  write(path, render({
    l, path, body: homeBody(l),
    headArgs: {
      title: u.title, desc: u.metaDesc, kind: "home",
      ld: { "@context": "https://schema.org", "@graph": [
        { "@type": "WebSite", name: NAME, url: full(path), inLanguage: HTML_LANG[l], description: u.metaDesc,
          potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${full(path)}?q={search_term_string}` }, "query-input": "required name=search_term_string" } },
        { "@type": "ItemList", name: T[l].boards, itemListElement: BOARD_ORDER.filter((b) => byBoard(b).length).map((b, i) => ({ "@type": "ListItem", position: i + 1, name: BOARD_META[b].full, url: full(pageUrl(l, "board", b)) })) },
      ] },
    },
  }));
}

// Boards and regions.
for (const l of LANGS) {
  const t = T[l];
  for (const b of BOARD_ORDER) {
    const list = byBoard(b);
    if (!list.length) continue;
    const path = pageUrl(l, "board", b);
    const sys = SYSTEMS[BOARD_META[b].system][l];
    const cities = listFmt(topCities(list), l);
    const name = BOARD_META[b].full;
    write(path, render({
      l, path, body: listBody(l, { h: t.boardH(name), p: t.boardP(name, list.length, cities, sys), schools: list, filterQuery: `board=${b}` }),
      headArgs: {
        title: `${t.boardTitle(name)} | ${NAME}`, desc: t.boardP(name, list.length, cities, sys), kind: "board", id: b,
        ld: { "@context": "https://schema.org", "@graph": [crumbs([[NAME, homeUrl(l)], [shortBoard(b, l), path]]),
          { "@type": "ItemList", name: t.boardH(name), numberOfItems: list.length, itemListElement: list.map((s, i) => ({ "@type": "ListItem", position: i + 1, item: schoolLd(s) })) }] },
      },
    }));
  }
  for (const r of REGION_ORDER) {
    const list = byRegion(r);
    if (!list.length) continue;
    const path = pageUrl(l, "region", r);
    const rn = REGION_SHORT[r][l];
    const boards = listFmt([...new Set(list.map((s) => s.board))].map((b) => shortBoard(b, l)), l);
    write(path, render({
      l, path, body: listBody(l, { h: t.regionH(rn), p: t.regionP(rn, list.length, boards), schools: list, filterQuery: `region=${r}` }),
      headArgs: {
        title: `${t.regionTitle(rn)} | ${NAME}`, desc: t.regionP(rn, list.length, boards), kind: "region", id: r,
        ld: { "@context": "https://schema.org", "@graph": [crumbs([[NAME, homeUrl(l)], [rn, path]]),
          { "@type": "ItemList", name: t.regionH(rn), numberOfItems: list.length, itemListElement: list.map((s, i) => ({ "@type": "ListItem", position: i + 1, item: schoolLd(s) })) }] },
      },
    }));
  }
}

// Sitemap with language alternates.
const groups = new Map();
for (const p of written) {
  const m = p.match(/^(?:\/(es|fr))?(\/(?:board|region)\/[a-z]+)?$/) || [];
  const key = p === "/" || p === "/es" || p === "/fr" ? "home" : (m[2] || p);
  groups.set(key, [...(groups.get(key) || []), p]);
}
const alt = (paths) => paths.map((p) => {
  const l = p.startsWith("/es") ? "es" : p.startsWith("/fr") ? "fr" : "en";
  return `    <xhtml:link rel="alternate" hreflang="${HTML_LANG[l]}" href="${full(p)}"/>`;
}).join("\n") + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${full(paths.find((p) => !/^\/(es|fr)(\/|$)/.test(p)))}"/>`;
const urls = [...groups.values()].flatMap((paths) => paths.map((p) => `  <url>\n    <loc>${full(p)}</loc>\n    <lastmod>${today}</lastmod>\n${alt(paths)}\n  </url>`));
for (const p of ["/quiz", "/privacy"]) urls.push(`  <url>\n    <loc>${full(p)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`);
writeFileSync(join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`);
console.log(`wrote ${written.length} pages + sitemap.xml`);
