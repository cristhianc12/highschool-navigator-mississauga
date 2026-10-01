// Course data helpers (lazy): the school course list for a profile and the cross-school course finder.
// The course calendars are official data read from each DPCDSB school's web page (see school-courses.js).
import { UI, SCHOOLS, BOARDS } from "./content.js";
import { BOARD_ORDER } from "./geo.js";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

import { COURSE_BOARDS } from "./data/summary.js";

let data = null;
let index = null;
// DPCDSB's hand-checked calendars (school-courses.js) plus the course lists collected for the other schools (data/courses/<board>.js).
async function load() {
  if (!data) data = (async () => {
    const dp = await import("./school-courses.js");
    const COURSES = { ...dp.COURSES };
    const YEAR = Object.fromEntries(Object.keys(dp.COURSES).map((id) => [id, dp.COURSE_YEAR]));
    const mods = await Promise.all(COURSE_BOARDS.map((b) => import(`./data/courses/${b}.js`).catch(() => null)));
    for (const m of mods) if (m) for (const [id, areas] of Object.entries(m.default.courses)) if (!COURSES[id]) { COURSES[id] = areas; YEAR[id] = m.default.year[id] || null; }
    return { COURSES, YEAR };
  })();
  return data;
}

/** Accordion with every course of one school, grouped by subject area. */
export async function renderSchoolCourses(host, schoolId, lang) {
  const c = UI[lang].crs;
  host.innerHTML = `<p class="small muted">${esc(c.loading)}</p>`;
  const { COURSES, YEAR } = await load();
  const areas = COURSES[schoolId] || [];
  host.innerHTML = `<p class="small muted">${esc(c.intro(YEAR[schoolId]))}</p>` + areas.map(([name, rows]) => `
    <details class="carea"><summary>${esc(name)} <span class="muted small">(${rows.length})</span></summary>
      <div class="cwrap"><table class="ctable"><thead><tr><th>${esc(c.course)}</th><th>9</th><th>10</th><th>11</th><th>12</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${esc(r[0])}</td>${[1, 2, 3, 4].map((i) => `<td>${esc(r[i] || "–")}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>`).join("");
}

// ---------- Course finder ----------
// One entry per course title. Ministry course codes are province-wide, so codes are shortened to their first five
// characters (school suffixes such as AVI1O0 / AVI1O1 collapse to AVI1O), codes that do not fit the title are ignored,
// and a school appears once with all the grades where it offers the course.
const code5 = (c) => c.slice(0, 5);

async function buildIndex() {
  if (index) return index;
  const { COURSES } = await load();
  const raw = new Map();
  for (const [id, areas] of Object.entries(COURSES)) {
    for (const [area, rows] of areas) {
      for (const [title, ...cells] of rows) {
        const key = norm(title);
        let e = raw.get(key);
        if (!e) raw.set(key, (e = { title, areas: {}, rows: [] }));
        e.areas[area] = (e.areas[area] || 0) + 1;
        cells.forEach((cell, i) => {
          if (!cell) return;
          const codes = [...new Set(cell.split(/\s+/).filter(Boolean).map(code5))];
          e.rows.push({ id, grade: 9 + i, codes });
        });
      }
    }
  }
  index = [...raw.values()].map((e) => {
    // A row whose codes belong to another subject is a table extraction slip: only keep the title's own code families.
    const votes = {}, seen = new Set();
    for (const r of e.rows) for (const c of r.codes) { const k = `${c.slice(0, 3)}|${r.id}`; if (!seen.has(k)) { seen.add(k); votes[c.slice(0, 3)] = (votes[c.slice(0, 3)] || 0) + 1; } }
    const max = Math.max(...Object.values(votes), 1);
    const ok = new Set(Object.entries(votes).filter(([, n]) => max < 2 || n >= Math.max(2, Math.ceil(max * 0.2))).map(([p]) => p));
    const schools = new Map(), codes = new Map();
    for (const r of e.rows) {
      const good = r.codes.filter((c) => ok.has(c.slice(0, 3)));
      if (!good.length) continue;
      if (!schools.has(r.id)) schools.set(r.id, new Set());
      schools.get(r.id).add(r.grade);
      for (const c of good) codes.set(c, (codes.get(c) || 0) + 1);
    }
    const area = Object.entries(e.areas).sort((a, b) => b[1] - a[1])[0][0];
    return { title: e.title, area, codes: [...codes].sort((a, b) => a[0][3].localeCompare(b[0][3]) || b[1] - a[1] || a[0].localeCompare(b[0])).map(([c]) => c), schools: [...schools].map(([id, g]) => ({ id, grades: [...g].sort((x, y) => x - y) })) };
  }).filter((e) => e.schools.length);
  return index;
}

// 9, 10, 11, 12 -> "9–12"; 9, 11 -> "9, 11"
function gradeText(gs) {
  const out = [];
  for (let i = 0; i < gs.length;) {
    let j = i;
    while (j + 1 < gs.length && gs[j + 1] === gs[j] + 1) j++;
    out.push(j - i >= 2 ? `${gs[i]}–${gs[j]}` : gs.slice(i, j + 1).join(", "));
    i = j + 1;
  }
  return out.join(", ");
}

const RESULTS = 5; // courses shown first
const STEP = 10; // and added by each "Show more"
const SCHOOLS_SHOWN = 5; // schools listed on a card before "+N more"

/** Renders the finder results for a query into host. opts.board filters by school board; the board list is filled in too. */
export async function renderFinder(host, q, lang, opts = {}) {
  const u = UI[lang];
  const c = u.crs;
  const query = norm(q);
  const idx = await buildIndex();
  const sel = document.getElementById("cf-board");
  if (sel && sel.options.length <= 1) {
    const used = new Set(idx.flatMap((e) => e.schools.map((s) => SCHOOLS.find((x) => x.id === s.id)?.board)).filter(Boolean));
    for (const b of BOARD_ORDER) if (used.has(b)) sel.add(new Option(BOARDS[b][lang] || BOARDS[b].en, b));
    sel.value = opts.board || "";
  }
  if (query.length < 3) { host.innerHTML = query.length ? `<p class="muted small">${esc(c.finderMin)}</p>` : ""; return; }
  const byId = new Map(SCHOOLS.map((s) => [s.id, s]));
  const limit = Number(host.dataset.limit) || RESULTS;
  const hits = idx
    .filter((e) => norm(e.title).includes(query) || e.codes.some((cd) => cd.toLowerCase().startsWith(query)))
    .map((e) => ({ ...e, schools: opts.board ? e.schools.filter((s) => byId.get(s.id)?.board === opts.board) : e.schools }))
    .filter((e) => e.schools.length)
    .sort((a, b) => b.schools.length - a.schools.length || a.title.localeCompare(b.title));
  if (!hits.length) { host.innerHTML = `<p class="empty">${esc(c.finderNone)}</p>`; return; }
  const shown = hits.slice(0, limit);
  const card = (e) => {
    const sorted = [...e.schools].sort((x, y) => BOARD_ORDER.indexOf(byId.get(x.id)?.board) - BOARD_ORDER.indexOf(byId.get(y.id)?.board) || (byId.get(x.id)?.name || "").localeCompare(byId.get(y.id)?.name || ""));
    const item = (s) => `<span class="cf-school"><button type="button" class="viewlink" data-school="${s.id}">${esc(byId.get(s.id)?.name || s.id)}</button><small>${esc(gradeText(s.grades))}</small></span>`;
    const group = (list) => {
      const rows = [];
      for (const b of BOARD_ORDER) {
        const l = list.filter((s) => byId.get(s.id)?.board === b);
        if (l.length) rows.push(`<div class="cf-board"><span class="cf-boardname">${esc(BOARDS[b][lang] || BOARDS[b].en)}</span><div class="cf-schools">${l.map(item).join("")}</div></div>`);
      }
      return rows.join("");
    };
    const head = sorted.slice(0, SCHOOLS_SHOWN), rest = sorted.slice(SCHOOLS_SHOWN);
    const codes = e.codes.slice(0, 6).join(", ") + (e.codes.length > 6 ? ` +${e.codes.length - 6}` : "");
    return `<article class="cf-item"><h4>${esc(e.title)} <span class="cf-codes">${esc(codes)}</span></h4>
      <div class="small muted">${esc(e.area)} · ${esc(c.offeredIn)} ${esc(c.schoolsN(e.schools.length))}</div>
      ${group(head)}${rest.length ? `<details class="cf-more"><summary>${esc(c.moreSchools(rest.length))}</summary>${group(rest)}</details>` : ""}
    </article>`;
  };
  const more = hits.length > shown.length ? `<div class="showmore"><button type="button" class="btn" id="cf-show-more">${esc(u.showMore(Math.min(STEP, hits.length - shown.length), hits.length - shown.length))}</button></div>` : "";
  host.innerHTML = `<p class="count">${esc(c.finderCount(hits.length))}</p>${shown.map(card).join("")}${more}`;
}
