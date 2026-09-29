// Profile modal for schools and regional programs, shared by the guide and the questionnaire results.
// Elements with data-school="<id>" / data-program="<id>" open it (and so do whole cards marked with
// data-card / data-pcard). It uses the native <dialog> element, which provides focus trapping, Esc to
// close and focus restoration. The URL hash (#school-<id> / #program-<id>) makes a profile shareable,
// and the browser Back button closes it.
import { UI, SCHOOLS, PROGRAMS, TAGS, TAG_ICON, BOARDS, FRASER } from "./content.js";
import { PROGRAM_INFO, PEEL_MAIN_LINK } from "./program-info.js";
import { starBtn } from "./mylist.js";
import { EXTRAS } from "./school-extras.js";
import { SESSIONS, sessionsForSchool, sessionsForProgram, schoolKey, fmtDate, eventTime, downloadIcs } from "./sessions.js";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const OFFICIAL = {
  dpcdsb: "https://www.dpcdsb.org/schools/school-directory",
  peel: "https://www.peelschools.org/",
};

let dlg = null;
let ctx = { getLang: () => "en", onCompare: null, isCompared: null };
let current = null; // { type: "school" | "program", id }
let depth = 0; // history entries pushed by the open modal

const langOf = () => ctx.getLang();
const Lx = (o) => (o == null ? "" : typeof o === "string" ? o : o[langOf()] || o.en);
const schoolByKey = (name) => SCHOOLS.find((s) => schoolKey(s.name) === schoolKey(name));

/* ---------------- verification stamp and error reports ---------------- */

export const VERIFIED = "2026-09-29"; // update whenever the data is re-checked against official sources
const REPO = "https://github.com/cristhianc12/highschool-navigator-mississauga";
const VTXT = {
  es: { checked: "Datos verificados el", report: "Reportar un error", title: "Error en los datos", body: (n) => `Sitio: ${n}\n\n¿Qué está mal o desactualizado?\n\nFuente oficial (enlace):\n` },
  en: { checked: "Data checked on", report: "Report an error", title: "Data error", body: (n) => `Page: ${n}\n\nWhat is wrong or out of date?\n\nOfficial source (link):\n` },
  fr: { checked: "Données vérifiées le", report: "Signaler une erreur", title: "Erreur dans les données", body: (n) => `Page : ${n}\n\nQu'est-ce qui est erroné ou périmé?\n\nSource officielle (lien) :\n` },
};
export function reportUrl(name, lang) {
  const t = VTXT[lang] || VTXT.en;
  return `${REPO}/issues/new?title=${encodeURIComponent(`${t.title}: ${name}`)}&body=${encodeURIComponent(t.body(name))}`;
}
export function verifiedHtml(name) {
  const lang = langOf();
  const t = VTXT[lang];
  const locale = { es: "es-CO", en: "en-CA", fr: "fr-CA" }[lang];
  const date = new Date(VERIFIED + "T12:00:00").toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  return `<p class="dverified small muted">${esc(t.checked)} ${esc(date)} · <a href="${reportUrl(name, lang)}" target="_blank" rel="noopener">${esc(t.report)}</a></p>`;
}

/* ---------------- shared pieces ---------------- */

function trendChip(f, u) {
  if (f.prev == null) return "";
  const d = Math.round((f.score - f.prev) * 10) / 10;
  const t = esc(u.fraserPrev(f.prev.toFixed(1)));
  if (d === 0) return `<span class="trend flat" title="${t}">= 0.0</span>`;
  return `<span class="trend ${d > 0 ? "up" : "down"}" title="${t}"><span aria-hidden="true">${d > 0 ? "▲" : "▼"}</span> ${d > 0 ? "+" : "−"}${Math.abs(d).toFixed(1)}</span>`;
}

function sessionRow(e, opts = {}) {
  const u = UI[langOf()];
  const S = u.sess;
  const date = e.date ? esc(fmtDate(e.date, langOf())) : esc(S.tbc);
  const time = e.time || e.timeNote ? esc(eventTime(e, langOf())) : (e.date ? esc(S.tba) : "");
  const kind = e.kind === "program" ? S.kindProgram : e.kind === "general" ? S.kindGeneral : S.kindSchool;
  const program = e.programId ? PROGRAMS.find((p) => p.id === e.programId) : null;
  const what = e.kind === "program" && program ? `${TAG_ICON[program.tag] || ""} ${Lx(program.name)}` : (e.title || "");
  const info = e.links.find((l) => l.label === "Link");
  const flyers = e.links.filter((l) => /^Flyer/.test(l.label));
  const school = schoolByKey(e.school);
  const who = opts.showSchool
    ? (school ? `<button type="button" class="viewlink" data-school="${school.id}">${esc(e.school)}</button>` : `<span>${esc(e.school)}</span>`)
    : "";
  const presented = (e.programIds || []).filter((p) => p.id || p.name).map((p) => {
    const pr = PROGRAMS.find((x) => x.id === p.id);
    return pr ? `<button type="button" class="viewlink" data-program="${pr.id}">${TAG_ICON[pr.tag] || ""} ${esc(Lx(pr.name))}</button>` : esc(p.name);
  });
  const btns = [
    info ? `<a class="btn small" href="${info.url}" target="_blank" rel="noopener">${esc(S.info)} ↗</a>` : "",
    ...flyers.map((f) => `<a class="btn small" href="${f.url}" target="_blank" rel="noopener">${esc(S.flyer)}${/English/.test(f.label) ? " (EN)" : /French/.test(f.label) ? " (FR)" : ""} ↗</a>`),
    e.date ? `<button type="button" class="btn small" data-ics="${e.id}">📅 ${esc(S.cal)}</button>` : "",
  ].join("");
  return `<div class="srow">
    <div class="sdate"><b>${date}</b><span>${time}</span></div>
    <div class="sbody">
      <div class="stitle">${who}${who ? " · " : ""}${esc(kind)}${what ? `: ${what.startsWith("<") ? what : esc(what)}` : ""}${e.format ? ` <span class="chip">${esc(e.format === "Virtual" ? S.virtual : e.format)}</span>` : ""}</div>
      ${presented.length ? `<div class="small muted">${esc(S.presented)} ${presented.join(", ")}</div>` : ""}
      ${btns ? `<div class="sbtns">${btns}</div>` : ""}
    </div></div>`;
}

function icsForEvent(id) {
  const e = SESSIONS.find((x) => x.id === id);
  if (!e || !e.date) return;
  const S = UI[langOf()].sess;
  const program = e.programId ? PROGRAMS.find((p) => p.id === e.programId) : null;
  const title = e.kind === "program" && program ? `${S.kindProgram}: ${Lx(program.name)} – ${e.school}` : `${S.forSchool}: ${e.school}`;
  const info = e.links.find((l) => l.label === "Link");
  downloadIcs(e, title, `${S.calNote}${info ? " " + info.url : ""}`);
}

/** Session row markup, also used by the sessions calendar section of the guide. */
export const renderSessionRow = (e, opts) => sessionRow(e, opts);

const headHtml = (icon, title, sub, boardCls) => `<div class="dhead ${boardCls}">
    <div class="mono" aria-hidden="true">${esc(icon)}</div>
    <div class="dtitle"><h2>${esc(title)}</h2><p class="small muted">${sub}</p></div>
    <button type="button" class="dclose" id="d-close" aria-label="${esc(UI[langOf()].detail.close)}">✕</button></div>`;

const footHtml = (extra) => `<div class="dfoot">${extra}<button type="button" class="btn" id="d-copy">${esc(UI[langOf()].detail.copy)}</button><span class="small muted" id="d-msg" role="status" aria-live="polite"></span></div>`;

/* ---------------- school profile ---------------- */

function renderSchool(school) {
  const lang = langOf();
  const u = UI[lang];
  const d = u.detail;
  const S = u.sess;
  const L = Lx;
  const f = school.fraser;
  const hostedList = PROGRAMS.filter((p) => p.hosts.some((h) => schoolKey(h.n) === schoolKey(school.name)));
  const initials = school.name.replace(/[^A-Za-zÀ-ÿ ]/g, "").split(" ").filter((w) => /^[A-ZÀ-Ý]/.test(w) && !/^(SS|CSS)$/.test(w)).slice(0, 2).map((w) => w[0]).join("") || school.name[0];

  const fraser = f
    ? `<section class="dsec"><h3>${esc(d.fraserH)}</h3>
        <div class="dfraser"><div class="dscore">${f.score.toFixed(1)}<small> ${esc(u.fraserOf)}</small></div>${trendChip(f, u)}
        <div class="dbar"><div class="bar" role="img" aria-label="${f.score.toFixed(1)} ${esc(u.fraserOf)}"><i style="width:${f.score * 10}%"></i></div>
        <p class="small muted">${esc(u.fraserRank(f.rank))}${f.prev == null ? "" : ` · ${esc(u.fraserPrev(f.prev.toFixed(1)))}`}</p></div></div>
        ${school.fnote ? `<p class="small warnnote">${esc(L(school.fnote))}</p>` : ""}
        <p class="small muted">${esc(d.fraserAcademic)} <a href="${FRASER.url}" target="_blank" rel="noopener">${esc(d.reportLink)}</a></p></section>`
    : `<section class="dsec"><h3>${esc(d.fraserH)}</h3><p class="muted">${esc(u.fraserNone)}</p></section>`;

  const chips = school.progs.length
    ? `<div class="chips">${school.progs.map((p) => `<span class="chip">${TAG_ICON[p.k] || ""} ${esc(L(TAGS[p.k]))}</span>`).join("")}</div>
       <ul class="dnotes">${school.progs.filter((p) => p.n).map((p) => `<li><b>${esc(L(TAGS[p.k]))}:</b> ${esc(L(p.n))}</li>`).join("")}</ul>`
    : `<p class="muted">${esc(u.noPrograms)}</p>`;

  const hostedHtml = hostedList.length
    ? `<section class="dsec"><h3>${esc(d.hostedH)}</h3>${hostedList.map((p) => `<article class="dprog clickable" data-pcard="${p.id}">
        <h4>${TAG_ICON[p.tag] || ""} ${esc(L(p.name))}</h4><p class="small">${esc(L(p.p))}</p>
        ${p.second ? `<p class="small muted"><b>${esc(u.secondEntry)}</b>${esc(L(p.second))}</p>` : ""}
        <div class="chips"><span class="chip">${esc(u.startsAt[p.start])}</span><span class="chip apply">${esc(u.applyChip)}</span>
        <button type="button" class="viewbtn" data-program="${p.id}">${esc(S.pd.details)} →</button></div></article>`).join("")}</section>`
    : "";

  const sess = sessionsForSchool(school);
  const sessHtml = sess.length
    ? `<section class="dsec"><h3>${esc(S.forSchool)}</h3>${sess.map((e) => sessionRow(e)).join("")}<p class="small muted">${esc(S.calNote)}</p></section>`
    : "";

  const ex = EXTRAS[school.id];
  const crs = u.crs;
  const extraHtml = ex && (ex.shsm?.length || ex.other?.length || ex.site)
    ? `<section class="dsec"><h3>${esc(crs.extraH)}</h3>
        ${ex.shsm?.length ? `<p class="small"><b>${esc(crs.shsmL)}:</b> ${ex.shsm.map(esc).join(" · ")}</p>` : ""}
        ${ex.other?.length ? `<p class="small"><b>${esc(crs.otherL)}:</b> ${ex.other.map(esc).join(" · ")}</p>` : ""}
        <div class="sbtns">${ex.site ? `<a class="btn small" href="${ex.site}" target="_blank" rel="noopener">${esc(crs.siteL)} ↗</a>` : ""}${ex.cal ? `<a class="btn small" href="${ex.cal}" target="_blank" rel="noopener">${esc(crs.calL)} ↗</a>` : ""}</div></section>`
    : "";
  const coursesHtml = ex?.cal
    ? `<section class="dsec"><h3>${esc(crs.h)}</h3><details class="dcourses" data-courses="${school.id}"><summary>${esc(crs.show)}</summary><div class="dcourses-body"></div></details></section>`
    : (ex?.src === "peel" ? `<section class="dsec"><p class="small muted">${esc(crs.peelNote)}</p></section>` : "");

  const kv = school.kv
    ? `<section class="dsec"><h3>${esc(d.detailsH)}</h3><p class="dfocus"><b>${esc(u.lblFocus)}</b> ${esc(L(school.focus))}</p>
        <dl class="kv">${["distinct", "shsm", "langs", "entry"].map((k) => `<dt>${esc(u.compRows[k])}</dt><dd>${esc(L(school.kv[k]))}</dd>`).join("")}</dl></section>`
    : "";

  const boardNote = school.board === "fr" ? `<p class="small muted">${esc(d.frenchNote)}</p>` : "";
  const site = sess.map((e) => e.site).find(Boolean);
  const siteBtn = site ? `<a class="btn" href="${site}" target="_blank" rel="noopener">${esc(S.website)} ↗</a>` : "";
  const official = OFFICIAL[school.board]
    ? `<a class="btn" href="${OFFICIAL[school.board]}" target="_blank" rel="noopener">${esc(d.officialLink)} ↗</a>` : "";
  const cmp = ctx.onCompare
    ? `<button type="button" class="btn" id="d-compare">${esc(ctx.isCompared?.(school.id) ? d.inCompare : d.addCompare)}</button>` : "";

  dlg.setAttribute("aria-label", school.name);
  dlg.className = `sdlg board-${school.board}`;
  dlg.innerHTML = headHtml(initials, school.name, `${esc(L(BOARDS[school.board]))} · ${esc(school.addr)}`, `board-${school.board}`) +
    `<div class="dbody">${fraser}${sessHtml}<section class="dsec"><h3>${esc(d.programsH)}</h3>${chips}</section>${hostedHtml}${extraHtml}${coursesHtml}${kv}${boardNote}${verifiedHtml(school.name)}</div>` +
    footHtml(starBtn("school", school.id, { label: true }) + cmp + siteBtn + (site ? "" : official));
  // Course list is loaded only when the person opens it (86 KB of data).
  const det = dlg.querySelector("[data-courses]");
  if (det) det.addEventListener("toggle", async () => {
    const body = det.querySelector(".dcourses-body");
    det.querySelector("summary").textContent = det.open ? crs.hide : crs.show;
    if (det.open && !body.childElementCount) { const { renderSchoolCourses } = await import("./course-finder.js"); renderSchoolCourses(body, school.id, langOf()); }
  });
}

/* ---------------- program profile ---------------- */

function renderProgram(p) {
  const lang = langOf();
  const u = UI[lang];
  const S = u.sess;
  const P = S.pd;
  const info = PROGRAM_INFO[p.id] || {};
  const L = Lx;
  const sess = sessionsForProgram(p);
  const hosts = p.hosts.map((h) => {
    const school = schoolByKey(h.n);
    const name = h.n.replace(/ CSS| SS/g, "");
    const label = school
      ? `<button type="button" class="viewlink" data-school="${school.id}">${esc(h.n)}</button>`
      : esc(h.n);
    return `<li${h.m ? ' class="miss"' : ""}>${label}${h.m ? ` <span class="pin">${esc(u.inMiss)}</span>` : ""}</li>`;
  }).join("");

  const links = [...(info.links || []), ...(p.board === "peel" ? [PEEL_MAIN_LINK] : [])]
    .map((l) => `<a class="btn" href="${l.u}" target="_blank" rel="noopener">${esc(L(l.l))} ↗</a>`).join("");

  dlg.setAttribute("aria-label", L(p.name));
  dlg.className = `sdlg board-${p.board === "peel" ? "peel" : "dpcdsb"}`;
  dlg.innerHTML = headHtml(TAG_ICON[p.tag] || "★", L(p.name), `${esc(L(BOARDS[p.board]))} · ${esc(u.startsAt[p.start])}`, `board-${p.board === "peel" ? "peel" : "dpcdsb"}`) +
    `<div class="dbody">
      <section class="dsec"><p>${esc(L(p.p))}</p>${info.who ? `<p class="dfocus"><b>${esc(P.who)}:</b> ${esc(L(info.who))}</p>` : ""}
        ${p.second ? `<p class="small muted"><b>${esc(u.secondEntry)}</b>${esc(L(p.second))}</p>` : ""}</section>
      ${info.reqs ? `<section class="dsec"><h3>${esc(P.reqs)}</h3><ul class="dnotes">${info.reqs.map((r) => `<li>${esc(L(r))}</li>`).join("")}</ul></section>` : ""}
      ${info.how ? `<section class="dsec"><h3>${esc(P.how)}</h3><p class="small">${esc(L(info.how))}</p>${info.dates ? `<p class="small muted">${esc(L(info.dates))}</p>` : ""}</section>` : ""}
      ${info.keyDates ? `<section class="dsec"><h3>${esc(P.keyDates)}</h3><p class="small">${esc(L(info.keyDates))}</p></section>` : ""}
      ${sess.length ? `<section class="dsec"><h3>${esc(P.sessions)}</h3>${sess.map((e) => sessionRow(e, { showSchool: true })).join("")}<p class="small muted">${esc(S.calNote)}</p></section>` : ""}
      <section class="dsec"><h3>${esc(P.hosts)}</h3><ul class="hosts">${hosts}</ul></section>
      ${links ? `<section class="dsec"><h3>${esc(P.links)}</h3><div class="sbtns">${links}</div></section>` : ""}
      ${verifiedHtml(L(p.name))}
    </div>` + footHtml(starBtn("program", p.id, { label: true }));
}

/* ---------------- open / close ---------------- */

function ensureDialog() {
  if (dlg) return;
  dlg = document.createElement("dialog");
  dlg.className = "sdlg";
  document.body.appendChild(dlg);
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) return closeProfile(); // click on the backdrop
    if (e.target.closest("#d-close")) return closeProfile();
    const ics = e.target.closest("[data-ics]");
    if (ics) return icsForEvent(ics.dataset.ics);
    if (e.target.closest("#d-copy") && current) {
      const url = location.origin + location.pathname + location.search + "#" + current.type + "-" + current.id;
      const d = UI[langOf()].detail;
      navigator.clipboard?.writeText(url).then(() => { dlg.querySelector("#d-msg").textContent = d.copied; }).catch(() => {});
    }
    if (e.target.closest("#d-compare") && ctx.onCompare && current?.type === "school") {
      ctx.onCompare(current.id);
      const d = UI[langOf()].detail;
      dlg.querySelector("#d-compare").textContent = ctx.isCompared?.(current.id) ? d.inCompare : d.addCompare;
    }
  });
  // Esc or a programmatic close: keep the URL in sync.
  dlg.addEventListener("close", () => {
    if (current && /^#(school|program)-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
    current = null;
    depth = 0;
  });
}

function openProfile(type, id) {
  const item = type === "school" ? SCHOOLS.find((s) => s.id === id) : PROGRAMS.find((p) => p.id === id);
  if (!item) return;
  ensureDialog();
  current = { type, id };
  type === "school" ? renderSchool(item) : renderProgram(item);
  if (!dlg.open) dlg.showModal();
  dlg.querySelector(".dbody").scrollTop = 0;
  const hash = `#${type}-${id}`;
  if (location.hash !== hash) { history.pushState({ profile: true }, "", location.pathname + location.search + hash); depth++; }
}

export const openSchool = (id) => openProfile("school", id);
export const openProgram = (id) => openProfile("program", id);

export function closeProfile() {
  if (!dlg?.open) return;
  // Undo every history entry pushed while the modal was open (a program can open a school, etc.),
  // so closing lands back on the page and Back stays consistent.
  if (depth > 0) { const n = depth; depth = 0; history.go(-n); }
  else dlg.close();
}
export const closeSchool = closeProfile;

const fromHash = () => {
  const m = location.hash.match(/^#(school|program)-(.+)$/);
  return m ? { type: m[1], id: m[2] } : null;
};

export function initSchoolDetail(options = {}) {
  ctx = { ...ctx, ...options };
  let cardTimer = null;
  document.addEventListener("click", (e) => {
    const ics = e.target.closest("[data-ics]");
    if (ics && !dlg?.contains(ics)) { icsForEvent(ics.dataset.ics); return; }

    const s = e.target.closest("[data-school]");
    if (s) { e.preventDefault(); openSchool(s.dataset.school); return; }
    const p = e.target.closest("[data-program]");
    if (p) { e.preventDefault(); openProgram(p.dataset.program); return; }

    // Whole-card click. It must never get in the way of copying text, so it does nothing when the
    // person is selecting (drag, double or triple click) and waits a moment before opening.
    const card = e.target.closest("[data-card], [data-pcard]");
    if (!card || e.target.closest("a, button, input, label, select, textarea, summary")) return;
    clearTimeout(cardTimer);
    if (e.detail > 1) return; // double / triple click = selecting a word or paragraph
    const open = card.dataset.card ? () => openSchool(card.dataset.card) : () => openProgram(card.dataset.pcard);
    cardTimer = setTimeout(() => {
      if (String(window.getSelection?.() || "").trim()) return; // text is selected: leave it alone
      open();
    }, 260);
  });
  window.addEventListener("popstate", () => {
    const h = fromHash();
    if (h) { depth = Math.max(0, depth - 1); openProfile(h.type, h.id); }
    else if (dlg?.open) dlg.close();
  });
  const h = fromHash();
  if (h) openProfile(h.type, h.id);
}
