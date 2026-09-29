// School profile modal, shared by the guide and the questionnaire results.
// Any element with data-school="<id>" opens it. Uses the native <dialog> element, which gives
// focus trapping, Esc to close and focus restoration for free. The URL hash (#school-<id>) makes
// a profile shareable, and the browser Back button closes it.
import { UI, SCHOOLS, PROGRAMS, TAGS, TAG_ICON, BOARDS, FRASER } from "./content.js";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const HASH = "#school-";
const OFFICIAL = {
  dpcdsb: "https://www.dpcdsb.org/schools/school-directory",
  peel: "https://www.peelschools.org/",
};

// "St. Joseph CSS" and "St. Joseph" must match: strip punctuation, parentheses and CSS/SS.
const key = (n) => String(n).toLowerCase().replace(/\(.*?\)/g, "").replace(/[.'’]/g, "").replace(/\b(css|ss)\b/g, "").replace(/\s+/g, " ").trim();

let dlg = null;
let ctx = { getLang: () => "en", onCompare: null, isCompared: null };
let currentId = null;

export function hostedPrograms(school) {
  const k = key(school.name);
  return PROGRAMS.filter((p) => p.hosts.some((h) => key(h.n) === k));
}

function render(school) {
  const lang = ctx.getLang();
  const u = UI[lang];
  const d = u.detail;
  const L = (o) => (o == null ? "" : typeof o === "string" ? o : o[lang] || o.en);
  const f = school.fraser;
  const hosted = hostedPrograms(school);
  const initials = school.name.replace(/[^A-Za-zÀ-ÿ ]/g, "").split(" ").filter((w) => /^[A-ZÀ-Ý]/.test(w) && !/^(SS|CSS)$/.test(w)).slice(0, 2).map((w) => w[0]).join("") || school.name[0];

  const fraser = f
    ? `<section class="dsec"><h3>${esc(d.fraserH)}</h3>
        <div class="dfraser"><div class="dscore">${f.score.toFixed(1)}<small> ${esc(u.fraserOf)}</small></div>
        <div class="dbar"><div class="bar" role="img" aria-label="${f.score.toFixed(1)} ${esc(u.fraserOf)}"><i style="width:${f.score * 10}%"></i></div>
        <p class="small muted">${esc(u.fraserRank(f.rank))}${f.prev == null ? "" : ` · ${esc(u.fraserPrev(f.prev.toFixed(1)))}`}</p></div></div>
        ${school.fnote ? `<p class="small warnnote">${esc(L(school.fnote))}</p>` : ""}
        <p class="small muted">${esc(d.fraserAcademic)} <a href="${FRASER.url}" target="_blank" rel="noopener">${esc(d.reportLink)}</a></p></section>`
    : `<section class="dsec"><h3>${esc(d.fraserH)}</h3><p class="muted">${esc(u.fraserNone)}</p></section>`;

  const chips = school.progs.length
    ? `<div class="chips">${school.progs.map((p) => `<span class="chip">${TAG_ICON[p.k] || ""} ${esc(L(TAGS[p.k]))}</span>`).join("")}</div>
       <ul class="dnotes">${school.progs.filter((p) => p.n).map((p) => `<li><b>${esc(L(TAGS[p.k]))}:</b> ${esc(L(p.n))}</li>`).join("")}</ul>`
    : `<p class="muted">${esc(u.noPrograms)}</p>`;

  const hostedHtml = hosted.length
    ? `<section class="dsec"><h3>${esc(d.hostedH)}</h3>${hosted.map((p) => `<article class="dprog">
        <h4>${TAG_ICON[p.tag] || ""} ${esc(L(p.name))}</h4><p class="small">${esc(L(p.p))}</p>
        ${p.second ? `<p class="small muted"><b>${esc(u.secondEntry)}</b>${esc(L(p.second))}</p>` : ""}
        <div class="chips"><span class="chip">${esc(u.startsAt[p.start])}</span><span class="chip apply">${esc(u.applyChip)}</span></div></article>`).join("")}</section>`
    : "";

  const kv = school.kv
    ? `<section class="dsec"><h3>${esc(d.detailsH)}</h3><p class="dfocus"><b>${esc(u.lblFocus)}</b> ${esc(L(school.focus))}</p>
        <dl class="kv">${["distinct", "shsm", "langs", "entry"].map((k) => `<dt>${esc(u.compRows[k])}</dt><dd>${esc(L(school.kv[k]))}</dd>`).join("")}</dl></section>`
    : "";

  const boardNote = school.board === "fr" ? `<p class="small muted">${esc(d.frenchNote)}</p>` : "";
  const official = OFFICIAL[school.board]
    ? `<a class="btn" href="${OFFICIAL[school.board]}" target="_blank" rel="noopener">${esc(d.officialLink)} ↗</a>` : "";
  const cmp = ctx.onCompare
    ? `<button type="button" class="btn" id="d-compare">${esc(ctx.isCompared?.(school.id) ? d.inCompare : d.addCompare)}</button>` : "";

  dlg.setAttribute("aria-label", school.name);
  dlg.className = `sdlg board-${school.board}`;
  dlg.innerHTML = `<div class="dhead board-${school.board}">
      <div class="mono" aria-hidden="true">${esc(initials)}</div>
      <div class="dtitle"><h2>${esc(school.name)}</h2><p class="small muted">${esc(L(BOARDS[school.board]))} · ${esc(school.addr)}</p></div>
      <button type="button" class="dclose" id="d-close" aria-label="${esc(d.close)}">✕</button></div>
    <div class="dbody">
      ${fraser}
      <section class="dsec"><h3>${esc(d.programsH)}</h3>${chips}</section>
      ${hostedHtml}${kv}${boardNote}
    </div>
    <div class="dfoot">${cmp}${official}<button type="button" class="btn" id="d-copy">${esc(d.copy)}</button><span class="small muted" id="d-msg" role="status" aria-live="polite"></span></div>`;
}

function ensureDialog() {
  if (dlg) return;
  dlg = document.createElement("dialog");
  dlg.className = "sdlg";
  document.body.appendChild(dlg);
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) return closeSchool(); // click on the backdrop
    if (e.target.closest("#d-close")) return closeSchool();
    if (e.target.closest("#d-copy")) {
      const url = location.origin + location.pathname + location.search + HASH + currentId;
      const d = UI[ctx.getLang()].detail;
      navigator.clipboard?.writeText(url).then(() => { dlg.querySelector("#d-msg").textContent = d.copied; }).catch(() => {});
    }
    if (e.target.closest("#d-compare") && ctx.onCompare) {
      ctx.onCompare(currentId);
      const d = UI[ctx.getLang()].detail;
      dlg.querySelector("#d-compare").textContent = ctx.isCompared?.(currentId) ? d.inCompare : d.addCompare;
    }
  });
  // Esc or a programmatic close: keep the URL in sync.
  dlg.addEventListener("close", () => {
    if (currentId && location.hash.startsWith(HASH)) history.replaceState(null, "", location.pathname + location.search);
    currentId = null;
  });
}

export function openSchool(id) {
  const school = SCHOOLS.find((s) => s.id === id);
  if (!school) return;
  ensureDialog();
  currentId = id;
  render(school);
  if (!dlg.open) dlg.showModal();
  dlg.querySelector(".dbody").scrollTop = 0;
  if (location.hash !== HASH + id) history.pushState({ school: id }, "", location.pathname + location.search + HASH + id);
}

export function closeSchool() {
  if (!dlg?.open) return;
  // If we pushed a history entry, going back closes it and keeps Back consistent.
  if (history.state?.school) history.back();
  else dlg.close();
}

export function initSchoolDetail(options = {}) {
  ctx = { ...ctx, ...options };
  let cardTimer = null;
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-school]");
    if (t) { e.preventDefault(); openSchool(t.dataset.school); return; }

    // Whole-card click. It must never get in the way of copying text, so it does nothing when the
    // person is selecting (drag, double or triple click) and waits a moment before opening.
    const card = e.target.closest("[data-card]");
    if (!card || e.target.closest("a, button, input, label, select, textarea, summary, dialog")) return;
    clearTimeout(cardTimer);
    if (e.detail > 1) return; // double / triple click = selecting a word or paragraph
    const id = card.dataset.card;
    cardTimer = setTimeout(() => {
      if (String(window.getSelection?.() || "").trim()) return; // text is selected: leave it alone
      openSchool(id);
    }, 260);
  });
  window.addEventListener("popstate", () => {
    if (location.hash.startsWith(HASH)) openSchool(location.hash.slice(HASH.length));
    else if (dlg?.open) dlg.close();
  });
  if (location.hash.startsWith(HASH)) openSchool(location.hash.slice(HASH.length));
}

/** Re-render the open profile (e.g. after a language change). */
export function refreshSchool() {
  if (dlg?.open && currentId) { const s = SCHOOLS.find((x) => x.id === currentId); if (s) render(s); }
}
