// Interactive map of the schools. A self-contained SVG (no tiles, no third-party requests): the city
// outline and highways come from OpenStreetMap data simplified at build time (see map-data.js).
// Drag to pan, wheel / pinch / buttons to zoom, click a dot (or press Enter) to open the school profile.
import { MAP } from "./map-data.js";
import { UI, SCHOOLS, BOARDS } from "./content.js";
import { inList } from "./mylist.js";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const MIN_K = 1, MAX_K = 9;
const view = { x: 0, y: 0, k: 1 }; // module-level so the view survives re-renders

const BOARD_COLOR = { dpcdsb: "var(--accent)", peel: "var(--sky)", fr: "var(--pink)" };
let last = null; // { host, lang, matchIds }

const vb = () => `${view.x} ${view.y} ${MAP.w / view.k} ${MAP.h / view.k}`;
function clamp() {
  const w = MAP.w / view.k, h = MAP.h / view.k;
  view.x = Math.min(Math.max(view.x, -w * 0.15), MAP.w - w * 0.85);
  view.y = Math.min(Math.max(view.y, -h * 0.15), MAP.h - h * 0.85);
}

export function renderMap(host, { lang, matchIds }) {
  last = { host, lang, matchIds };
  const u = UI[lang];
  const m = u.map;
  const dots = SCHOOLS.filter((s) => MAP.schools[s.id]).map((s) => {
    const [x, y] = MAP.schools[s.id];
    const on = !matchIds || matchIds.includes(s.id);
    const mine = inList("school", s.id);
    return `<g class="mdot${on ? "" : " dim"}${mine ? " mine" : ""}" data-school="${s.id}" data-x="${x}" data-y="${y}" role="button" tabindex="${on ? 0 : -1}" aria-label="${esc(s.name)}, ${esc(BOARDS[s.board][lang])}${mine ? ", " + esc(m.mine) : ""}" style="--c:${BOARD_COLOR[s.board]}">
      ${mine ? `<circle class="ring" cx="${x}" cy="${y}" r="9"/>` : ""}<circle class="pt" cx="${x}" cy="${y}" r="6"/></g>`;
  }).join("");
  const roads = MAP.roads.map((r) => `<path class="mroad" d="${r.d}"/>`).join("");
  const labels = MAP.labels.map((l) => `<text class="mlab" x="${l.p[0]}" y="${l.p[1]}">${esc(l.name)}</text>`).join("");
  host.innerHTML = `
    <div class="mapbox">
      <svg class="mapsvg" viewBox="${vb()}" role="group" aria-label="${esc(m.aria)}" preserveAspectRatio="xMidYMid meet">
        <defs><clipPath id="mclip"><path d="${MAP.city}"/></clipPath></defs>
        <path class="mcity" d="${MAP.city}"/>
        <g clip-path="url(#mclip)">${roads}</g>
        <path class="mcityline" d="${MAP.city}"/>
        <g class="mlabels">${labels}</g>
        <g class="mdots">${dots}</g>
      </svg>
      <div class="mtools" role="group" aria-label="${esc(m.zoom)}">
        <button type="button" class="btn small" data-map="in" aria-label="${esc(m.zoomIn)}">＋</button>
        <button type="button" class="btn small" data-map="out" aria-label="${esc(m.zoomOut)}">－</button>
        <button type="button" class="btn small" data-map="reset">${esc(m.reset)}</button>
      </div>
      <div class="mtip" hidden></div>
    </div>
    <div class="mlegend small muted">
      ${["dpcdsb", "peel", "fr"].map((b) => `<span><i style="background:${BOARD_COLOR[b]}"></i>${esc(BOARDS[b][lang])}</span>`).join("")}
      <span><i class="ringi"></i>${esc(m.mine)}</span>
    </div>
    <p class="small muted">${esc(m.hint)} ${esc(m.attrib)}: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></p>`;
  applyScale(host);
  bind(host, lang);
}

// Keep dots and labels the same size on screen while zooming.
function applyScale(host) {
  const k = view.k;
  host.querySelectorAll(".mdot").forEach((g) => {
    const x = +g.dataset.x, y = +g.dataset.y;
    g.querySelector(".pt").setAttribute("r", (6 / k ** 0.6).toFixed(2));
    g.querySelector(".ring")?.setAttribute("r", (10 / k ** 0.6).toFixed(2));
    g.style.setProperty("--sw", (2 / k ** 0.6).toFixed(2));
  });
  host.querySelectorAll(".mlab").forEach((t) => { t.style.fontSize = (15 / k ** 0.7).toFixed(1) + "px"; });
  host.querySelectorAll(".mroad").forEach((p) => { p.style.strokeWidth = (3 / k ** 0.7).toFixed(2); });
  const svg = host.querySelector(".mapsvg");
  if (svg) svg.setAttribute("viewBox", vb());
}

function svgPoint(svg, cx, cy) {
  const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function zoomAt(host, factor, cx, cy) {
  const svg = host.querySelector(".mapsvg");
  const k2 = Math.min(MAX_K, Math.max(MIN_K, view.k * factor));
  if (k2 === view.k) return;
  const p = cx == null ? { x: view.x + MAP.w / view.k / 2, y: view.y + MAP.h / view.k / 2 } : svgPoint(svg, cx, cy);
  // keep the point under the cursor fixed
  view.x = p.x - (p.x - view.x) * (view.k / k2);
  view.y = p.y - (p.y - view.y) * (view.k / k2);
  view.k = k2; clamp(); applyScale(host);
}

let bound = new WeakSet();
function bind(host, lang) {
  const svg = host.querySelector(".mapsvg");
  const tip = host.querySelector(".mtip");
  const box = host.querySelector(".mapbox");
  let drag = null, moved = false;
  const pointers = new Map();
  let pinch = null;

  svg.addEventListener("pointerdown", (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
    drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; moved = false;
  });
  svg.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2 && pinch) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt(host, d / pinch, (a.x + b.x) / 2, (a.y + b.y) / 2); pinch = d; moved = true; return;
    }
    if (!drag) return;
    const r = svg.getBoundingClientRect();
    const scale = (MAP.w / view.k) / r.width;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) { moved = true; svg.classList.add("grabbing"); }
    if (moved) { view.x = drag.vx - dx * Math.max(scale, (MAP.h / view.k) / r.height); view.y = drag.vy - dy * Math.max(scale, (MAP.h / view.k) / r.height); clamp(); svg.setAttribute("viewBox", vb()); }
  });
  const end = (e) => { pointers.delete(e.pointerId); if (pointers.size < 2) pinch = null; if (!pointers.size) { drag = null; svg.classList.remove("grabbing"); } };
  svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end); svg.addEventListener("pointerleave", end);
  // A drag must not count as a click on a dot.
  svg.addEventListener("click", (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  svg.addEventListener("wheel", (e) => { e.preventDefault(); zoomAt(host, e.deltaY < 0 ? 1.25 : 0.8, e.clientX, e.clientY); }, { passive: false });
  svg.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.closest(".mdot")) { e.preventDefault(); e.target.closest(".mdot").dispatchEvent(new MouseEvent("click", { bubbles: true })); } });

  host.querySelector(".mtools").addEventListener("click", (e) => {
    const a = e.target.closest("[data-map]")?.dataset.map;
    if (a === "in") zoomAt(host, 1.5); if (a === "out") zoomAt(host, 1 / 1.5);
    if (a === "reset") { view.x = 0; view.y = 0; view.k = 1; applyScale(host); }
  });

  // Tooltip with the school name on hover / focus.
  const show = (g) => {
    const s = SCHOOLS.find((x) => x.id === g.dataset.school);
    if (!s) return;
    const r = g.getBoundingClientRect(), b = box.getBoundingClientRect();
    tip.textContent = `${s.name}${s.fraser ? " · " + s.fraser.score.toFixed(1) : ""}`;
    tip.hidden = false;
    tip.style.left = `${r.left - b.left + r.width / 2}px`; tip.style.top = `${r.top - b.top - 8}px`;
  };
  svg.addEventListener("pointerover", (e) => { const g = e.target.closest(".mdot"); if (g) show(g); });
  svg.addEventListener("focusin", (e) => { const g = e.target.closest(".mdot"); if (g) show(g); });
  svg.addEventListener("pointerout", () => { tip.hidden = true; });
  svg.addEventListener("focusout", () => { tip.hidden = true; });
}

// Re-render when the shortlist changes so the star rings stay in sync.
window.addEventListener("mylist:change", () => { if (last && last.host.isConnected) renderMap(last.host, last); });
