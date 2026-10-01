// Course data helpers (lazy): the school course list for a profile and the cross-school course finder.
// The course calendars are official data read from each DPCDSB school's web page (see school-courses.js).
import { UI, SCHOOLS } from "./content.js";

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

async function buildIndex() {
  if (index) return index;
  const { COURSES } = await load();
  const map = new Map();
  for (const [id, areas] of Object.entries(COURSES)) {
    for (const [area, rows] of areas) {
      for (const [title, g9, g10, g11, g12] of rows) {
        const key = norm(title);
        if (!map.has(key)) map.set(key, { title, area, codes: new Set(), schools: [] });
        const e = map.get(key);
        const grades = [];
        [[9, g9], [10, g10], [11, g11], [12, g12]].forEach(([g, cell]) => { if (cell) { grades.push(g); cell.split(" ").forEach((cd) => e.codes.add(cd)); } });
        e.schools.push({ id, grades });
      }
    }
  }
  index = [...map.values()];
  return index;
}

/** Renders the finder results for a query into host. */
export async function renderFinder(host, q, lang) {
  const c = UI[lang].crs;
  const query = norm(q);
  if (query.length < 3) { host.innerHTML = query.length ? `<p class="muted small">${esc(c.finderMin)}</p>` : ""; return; }
  const idx = await buildIndex();
  const hits = idx.filter((e) => norm(e.title).includes(query) || [...e.codes].some((cd) => cd.toLowerCase().startsWith(query)))
    .sort((a, b) => b.schools.length - a.schools.length || a.title.localeCompare(b.title)).slice(0, 40);
  if (!hits.length) { host.innerHTML = `<p class="empty">${esc(c.finderNone)}</p>`; return; }
  const byId = new Map(SCHOOLS.map((s) => [s.id, s]));
  host.innerHTML = `<p class="count">${esc(c.finderCount(hits.length))}</p>` + hits.map((e) => `
    <article class="cf-item"><h4>${esc(e.title)} <span class="muted small">${esc([...e.codes].sort().join(", "))}</span></h4>
      <div class="small muted">${esc(e.area)} · ${esc(c.offeredIn)}:</div>
      <div class="cf-schools">${e.schools.map((s) => `<span class="cf-school"><button type="button" class="viewlink" data-school="${s.id}">${esc(byId.get(s.id)?.name || s.id)}</button><small>Gr ${s.grades.join(", ")}</small></span>`).join("")}</div>
    </article>`).join("");
}
