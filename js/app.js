import "./pwa.js";
import "./track.js";
import "./a11y.js";
import { initSchoolDetail, renderSessionRow, reportUrl } from "./school-detail.js";
import { SESSIONS } from "./sessions.js";
import { EXPLAINER } from "./explainer.js";
import { renderMap } from "./map.js";
import { initMyList, starBtn, refresh as syncMyList } from "./mylist.js";
import { UI, TEEN, LANGS, madeWith, SCHOOLS, PROGRAMS, SOURCES, FRASER, TAGS, BOARDS, TAG_ICON, VIBES } from "./content.js";
import { ensureAllDetails, ensureSchools } from "./details.js";
import { REGIONS, REGION_ORDER, REGION_SHORT, SYSTEMS, SYSTEM_ORDER, BOARD_META, BOARD_ORDER, boardClass } from "./geo.js";

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const MAX_COMPARE = 4;
const PAGE = 24; // schools rendered per "show more" step (the GTA directory has 300+)
// Regional programs (cards below) exist for these boards, all in Peel for now.
const PROG_REGION = { dpcdsb: "peel", peel: "peel" };

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

const state = {
  lang: "en",
  tone: store.get("tone") === "family" ? "family" : "teen",
  filters: { q: "", region: "", city: "", board: "", tag: "", start: "", entry: "", sort: "name" },
  shown: PAGE,
  sess: { area: "", board: "" },
  compare: ["goetz", "pocock", "cabot", "sfx"],
};

function detectLang() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (LANGS.includes(fromUrl)) return fromUrl;
  const saved = store.get("lang");
  if (LANGS.includes(saved)) return saved;
  // Device language (es / fr / en); anything else falls back to English.
  const nav = (navigator.language || "en").toLowerCase();
  return nav.startsWith("fr") ? "fr" : nav.startsWith("es") ? "es" : "en";
}

const t = () => (state.tone === "teen" ? { ...UI[state.lang], ...TEEN[state.lang] } : UI[state.lang]);
const L = (o) => (o == null ? "" : typeof o === "string" ? o : o[state.lang] || o.en);
const byId = (id) => SCHOOLS.find((s) => s.id === id);
const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/* ---------- Filtering ---------- */

function schoolText(s) {
  const kv = s.kv ? Object.values(s.kv).map(L).join(" ") : "";
  const progs = s.progs.map((p) => `${L(TAGS[p.k])} ${L(p.n)}`).join(" ");
  return `${s.name} ${s.addr} ${s.city} ${L(REGION_SHORT[s.region])} ${L(BOARDS[s.board])} ${progs} ${kv} ${s.focus ? L(s.focus) : ""}`;
}

function schoolMatches(s) {
  const f = state.filters;
  if (f.region && s.region !== f.region) return false;
  if (f.city && s.city !== f.city) return false;
  if (f.board && s.board !== f.board) return false;
  if (f.tag && !s.progs.some((p) => p.k === f.tag)) return false;
  if (f.q && !norm(schoolText(s)).includes(norm(f.q))) return false;
  return true;
}

function programMatches(p) {
  const f = state.filters;
  if (f.board && p.board !== f.board) return false;
  if (f.region && !(p.regions || [PROG_REGION[p.board]]).includes(f.region)) return false;
  if (f.tag && p.tag !== f.tag) return false;
  if (f.start && p.start !== f.start) return false;
  if (f.entry && p.entry !== f.entry) return false;
  const text = `${L(p.name)} ${p.hosts.map((h) => h.n).join(" ")} ${L(p.p)}`;
  if (f.q && !norm(text).includes(norm(f.q))) return false;
  return true;
}

/* ---------- Templates ---------- */

function progChips(s) {
  return s.progs.map((p) => `<span class="chip" ${p.n ? `title="${esc(L(p.n))}"` : ""}>${TAG_ICON[p.k] || ""} ${esc(L(TAGS[p.k]))}</span>`).join("");
}

// Change versus the previous year (2023-24 -> 2024-25). Neutral colours: it is information, not a verdict.
function trendChip(f, u) {
  if (f.prev == null) return "";
  const d = Math.round((f.score - f.prev) * 10) / 10;
  if (d === 0) return `<span class="trend flat" title="${esc(u.fraserPrev(f.prev.toFixed(1)))}">= 0.0</span>`;
  return `<span class="trend ${d > 0 ? "up" : "down"}" title="${esc(u.fraserPrev(f.prev.toFixed(1)))}"><span aria-hidden="true">${d > 0 ? "▲" : "▼"}</span> ${d > 0 ? "+" : "−"}${Math.abs(d).toFixed(1)}</span>`;
}

function fraserBlock(s) {
  const u = t();
  if (!s.fraser) return `<div class="fraser"><span class="small muted">${esc(u.fraserNone)}</span></div>`;
  const f = s.fraser;
  const prev = f.prev == null ? "" : ` · ${esc(u.fraserPrev(f.prev.toFixed(1)))}`;
  // Playful nod for teens: the only school scoring exactly 6.7.
  const sticker = state.tone === "teen" && f.score === 6.7 ? `<span class="sticker">${esc(u.sticker)}</span>` : "";
  return `<div class="fraser">
    <div class="fraser-pill"><small>${esc(u.fraserLabel)}</small>${f.score.toFixed(1)}<small>${esc(u.fraserOf)}</small></div>
    ${trendChip(f, u)}
    ${sticker}
    <div class="bar" role="img" aria-label="${f.score.toFixed(1)} ${esc(u.fraserOf)}"><i style="width:${f.score * 10}%"></i></div>
    <div class="meta">${esc(u.fraserRank(f.rank))}${prev}${s.fnote ? ` · <span class="warnnote">${esc(L(s.fnote))}</span>` : ""}</div>
  </div>`;
}

function schoolCard(s) {
  const u = t();
  const initials = s.name.replace(/[^A-Za-zÀ-ÿ ]/g, "").split(" ").filter((w) => /^[A-ZÀ-Ý]/.test(w) && !/^(SS|CSS)$/.test(w)).slice(0, 2).map((w) => w[0]).join("") || s.name[0];
  const progs = s.progs.length
    ? `<div class="chips">${progChips(s)}</div>`
    : `<p class="muted small">${esc(s.pending ? u.pendingDetail : u.noPrograms)}</p>`;
  const checked = state.compare.includes(s.id);
  return `
  <article class="card school clickable board-${boardClass(s.board)}" data-id="${s.id}" data-card="${s.id}">
    <div class="top"><div class="mono" aria-hidden="true">${esc(initials)}</div><div><h3 class="name">${esc(s.name)}</h3><div class="sub">${esc(L(BOARDS[s.board]))} · ${esc(s.addr)}</div></div>${starBtn("school", s.id)}</div>
    ${progs}
    ${fraserBlock(s)}
    <div class="cardfoot">
      <label class="cmp"><input type="checkbox" data-cmp="${s.id}" ${checked ? "checked" : ""}> ${esc(u.compare)}</label>
      <button type="button" class="viewbtn" data-school="${s.id}" aria-label="${esc(u.detail.profile)}: ${esc(s.name)}">${esc(u.detail.profile)} →</button>
    </div>
  </article>`;
}

function programCard(p) {
  const u = t();
  const hosts = p.hosts.map((h) => `<li${h.m ? ' class="miss"' : ""}>${esc(h.n)}${h.m ? ` <span class="pin">${esc(u.inMiss)}</span>` : ""}</li>`).join("");
  const second = p.second ? `<p class="muted small"><b>${esc(u.secondEntry)}</b>${esc(L(p.second))}</p>` : "";
  return `<article class="card prog clickable" data-pcard="${p.id}"><div class="prog-top"><h3>${TAG_ICON[p.tag] || ""} ${esc(L(p.name))}</h3>${starBtn("program", p.id)}</div>
    <div class="where">${esc(u.host)}</div><ul class="hosts">${hosts}</ul>
    <p>${esc(L(p.p))}</p>${second}
    <div class="meta"><span class="chip">${esc(u.startsAt[p.start])}</span><span class="chip apply">${esc(u.applyChip)}</span>
      <button type="button" class="viewbtn" data-program="${p.id}" aria-label="${esc(u.sess.pd.details)}: ${esc(L(p.name))}">${esc(u.sess.pd.details)} →</button></div></article>`;
}

function options(map, current) {
  const u = t();
  return `<option value="">${esc(u.all)}</option>` +
    Object.entries(map).map(([v, label]) => `<option value="${v}" ${current === v ? "selected" : ""}>${esc(label)}</option>`).join("");
}

const allOpt = () => `<option value="">${esc(t().all)}</option>`;
const regionOptions = (cur) => allOpt() + REGION_ORDER.map((r) => `<option value="${r}" ${cur === r ? "selected" : ""}>${esc(L(REGIONS[r]))}</option>`).join("");
function cityOptions(region, cur) {
  const cities = [...new Set(SCHOOLS.filter((s) => !region || s.region === region).map((s) => s.city))].sort((a, b) => a.localeCompare(b));
  return allOpt() + cities.map((c) => `<option value="${esc(c)}" ${cur === c ? "selected" : ""}>${esc(c)}</option>`).join("");
}
function boardOptions(cur) {
  return allOpt() + SYSTEM_ORDER.map((g) => `<optgroup label="${esc(L(SYSTEMS[g]))}">${BOARD_ORDER.filter((b) => BOARD_META[b].system === g).map((b) => `<option value="${b}" ${cur === b ? "selected" : ""}>${esc(L(BOARDS[b]))}</option>`).join("")}</optgroup>`).join("");
}

function tagOptions(current) {
  const u = t();
  return `<option value="">${esc(u.all)}</option>` +
    Object.keys(TAGS).map((k) => `<option value="${k}" ${current === k ? "selected" : ""}>${esc(L(TAGS[k]))}</option>`).join("");
}

function explainerHtml() {
  const E = EXPLAINER;
  const head = E.cols.map((c) => `<th scope="col">${esc(L(c.head))}${c.program ? ` <button type="button" class="viewlink" data-program="${c.program}">${esc(L(E.see))} →</button>` : ""}</th>`).join("");
  const rows = E.rows.map((r) => `<tr><th scope="row">${esc(L(r.l))}</th>${r.c.map((cell) => `<td>${esc(L(cell))}</td>`).join("")}</tr>`).join("");
  return `<section id="comparativa"><div class="sec-head"><h2>${esc(L(E.h))}</h2><p>${esc(L(E.p))}</p></div>
    <div class="cmp-wrap"><table class="cmp-table explain"><thead><tr><th scope="col"></th>${head}</tr></thead><tbody>${rows}</tbody></table></div>
    <p class="small muted" style="margin-top:10px">${esc(L(E.note))}</p></section>`;
}

function timeline() {
  const u = t();
  const rows = u.timeline.map((r) => {
    const segs = r.segs
      ? r.segs.map(([a, b, txt, soft]) => `<span class="seg ${soft ? "soft" : "core"}" style="grid-column:${a}/${b}">${esc(txt)}</span>`).join("")
      : `<span class="seg ${r.soft ? "soft" : "core"}" style="grid-column:${r.from}/${r.to}">${esc(r.txt)}</span>`;
    return `<div class="tl-row"><div class="tl-label">${esc(r.label)}<small>${esc(r.sub)}</small></div><div class="cols">${segs}</div></div>`;
  }).join("");
  const g = state.lang === "fr" ? ["9e", "10e", "11e", "12e"] : ["Gr 9", "Gr 10", "Gr 11", "Gr 12"];
  return `<div class="tl"><div class="tl-head"><span>${esc(u.tlOption)}</span><div class="cols">${g.map((x) => `<span>${x}</span>`).join("")}</div></div>${rows}
    <div class="legend"><span><i class="c"></i>${esc(u.tlConfirmed)}</span><span><i class="s"></i>${esc(u.tlSoft)}</span></div></div>`;
}

/* ---------- Render ---------- */

function renderShell() {
  const u = t();
  document.documentElement.lang = u.htmlLang;
  document.title = u.title;
  $('meta[name="description"]').content = u.metaDesc;
  $('meta[property="og:title"]').content = u.h1;
  $('meta[name="twitter:title"]').content = u.h1;
  $('meta[property="og:description"]').content = u.metaDesc;
  $('meta[name="twitter:description"]').content = u.metaDesc;
  $('meta[property="og:locale"]').content = u.ogLocale;
  $("#skip").textContent = u.skip;
  $("#theme-btn").setAttribute("aria-label", u.themeLabel);
  $("#lang-group").setAttribute("aria-label", u.langLabel);
  $("#tone-group").setAttribute("aria-label", u.tone.label);
  document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang)));
  document.querySelectorAll("[data-tone]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.tone === state.tone));
    b.textContent = u.tone[b.dataset.tone];
  });

  const f = state.filters;
  const q = `quiz?lang=${state.lang}`;
  $("#desk-nav").innerHTML =
    `<a href="#escuelas">${esc(u.bnav.escuelas)}</a><a href="#regionales">${esc(u.bnav.regionales)}</a><a href="#mapa">${esc(u.map.nav)}</a><a href="#comparar">${esc(u.nav.comparar)}</a><a href="#charlas">${esc(u.sess.nav)}</a><a href="#fechas">${esc(u.bnav.fechas)}</a><a href="${q}">${esc(u.bnav.quiz)}</a>${state.tone === "teen" ? `<a href="#descanso" class="gamelink" aria-label="${esc(u.game.h)}" title="${esc(u.game.h)}">🎮</a>` : ""}`;
  $("#bnav").setAttribute("aria-label", u.navLabel);
  $("#bnav").innerHTML =
    `<a href="#escuelas"><span aria-hidden="true">🏫</span>${esc(u.bnav.escuelas)}</a>` +
    `<a href="#regionales"><span aria-hidden="true">🎯</span>${esc(u.bnav.regionales)}</a>` +
    `<a href="${q}" class="hot"><span aria-hidden="true">✨</span>${esc(u.bnav.quiz)}</a>` +
    `<a href="#fechas"><span aria-hidden="true">📅</span>${esc(u.bnav.fechas)}</a>`;

  const vibes = VIBES.map((k) => `<button type="button" class="vibe" data-vibe="${k}">${TAG_ICON[k]} ${esc(L(TAGS[k]))}</button>`).join("");
  const dpCount = PROGRAMS.length;

  $("#app").innerHTML = `
  <main id="main">
  <header class="hero">
    <div class="eyebrow">${esc(u.eyebrow)}</div>
    <h1>${esc(u.h1a)} <span class="grad">${esc(u.h1b)}</span></h1>
    <p class="lead">${esc(u.lead)}</p>
    <div class="stats">
      <div class="stat"><b>${SCHOOLS.length}</b><span>${esc(u.statSchools)}</span></div>
      <div class="stat"><b>${new Set(SCHOOLS.map((s) => s.board)).size}</b><span>${esc(u.statBoards)}</span></div>
      <div class="stat"><b>${dpCount}</b><span>${esc(u.statPrograms)}</span></div>
    </div>
    <div class="vibes" role="group" aria-label="${esc(u.vibesLabel)}"><span class="vibes-label">${esc(u.vibesLabel)}</span>${vibes}</div>
    <div class="quiz-cta"><div><h2>${esc(u.quiz.h)}</h2><p>${esc(u.quiz.p)}</p></div><a class="cta" href="${q}">${esc(u.quiz.btn)} →</a></div>
    <p class="notice">${u.notice}</p>
    <p class="scope muted small">${esc(u.scope)}</p>
  </header>

  <section id="explorar"><div class="sec-head"><h2>${esc(u.exploreH)}</h2><p>${esc(u.exploreP)}</p></div>
    <form class="filters" id="filters" role="search" onsubmit="return false">
      <label class="field search">${esc(u.searchLabel)}<input type="search" id="f-q" value="${esc(f.q)}" placeholder="${esc(u.searchPh)}"></label>
      <label class="field">${esc(u.fRegion)}<select id="f-region">${regionOptions(f.region)}</select></label>
      <label class="field">${esc(u.fCity)}<select id="f-city">${cityOptions(f.region, f.city)}</select></label>
      <label class="field">${esc(u.fSystem)}<select id="f-board">${boardOptions(f.board)}</select></label>
      <label class="field">${esc(u.fTag)}<select id="f-tag">${tagOptions(f.tag)}</select></label>
      <label class="field">${esc(u.fStart)}<select id="f-start">${options(u.optStart, f.start)}</select></label>
      <label class="field">${esc(u.fEntry)}<select id="f-entry">${options(u.optEntry, f.entry)}</select></label>
      <label class="field">${esc(u.fSort)}<select id="f-sort">${Object.entries(u.optSort).map(([v, l]) => `<option value="${v}" ${f.sort === v ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>
      <button type="button" class="btn" id="f-reset">${esc(u.reset)}</button>
    </form>
    <p class="count" id="count" aria-live="polite"></p></section>

  <section id="escuelas"><div class="sec-head"><h2>${esc(u.escuelasH)}</h2><p>${esc(u.escuelasP)}</p></div>
    <div class="grid dir" id="schools"></div><div id="schools-more" class="morewrap"></div>
    <details class="fraser-note"><summary>${esc(u.fraserWhatH)}</summary><p>${esc(u.fraserWhat)}</p>
      <p><a href="${FRASER.url}" target="_blank" rel="noopener">${esc(L(FRASER.report))}</a></p></details></section>

  <section id="mapa"><div class="sec-head"><h2>${esc(u.map.h)}</h2><p>${esc(u.map.p)}</p></div><div id="map-host"></div></section>

  <section id="materias"><div class="sec-head"><h2>${esc(u.crs.finderH)}</h2><p>${esc(u.crs.finderP)}</p></div>
    <input type="search" class="mapsearch" id="cf-q" placeholder="${esc(u.crs.finderPh)}" aria-label="${esc(u.crs.finderH)}" autocomplete="off">
    <div id="cf-out" class="cf-out" aria-live="polite"></div>
    <p class="small muted">${esc(u.crs.finderSrc("2025-2026"))}</p></section>

  <section id="comparar"><div class="sec-head"><h2>${esc(u.compararH)}</h2><p>${esc(u.compararP)}</p></div>
    <div class="cmp-toggles" id="cmp-toggles"></div><div id="cmp-out"></div></section>

  <section id="regionales"><div class="sec-head"><h2>${esc(u.regionalesH)}</h2><p>${esc(u.regionalesP)}</p></div>
    <div class="grid" id="prog-dpcdsb"></div></section>

  <section id="otherprogs" hidden><div class="sec-head"><h2>${esc(u.otherH)}</h2><p>${esc(u.otherP)}</p></div>
    <div id="prog-other"></div></section>

  <section id="peel"><div class="sec-head"><h2>${esc(u.peelH)}</h2><p>${esc(u.peelP)}</p></div>
    <div class="grid" id="prog-peel"></div>
    <div class="grid" style="margin-top:14px">
      <div class="card"><h3>${esc(u.peelHowH)}</h3><p>${esc(u.peelHow)}</p></div>
      <div class="card"><h3>${esc(u.peelRuleH)}</h3><p>${esc(u.peelRule)}</p></div></div></section>

  <section id="charlas"><div class="sec-head"><h2>${esc(u.sess.h)}</h2><p>${esc(u.sess.p)}</p></div>
    <form class="filters" id="sess-filters" onsubmit="return false">
      <label class="field">${esc(u.sess.area)}<select id="s-area">${sessionAreas(u).map(([v, l]) => `<option value="${v}" ${state.sess.area === v ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>
      <label class="field">${esc(u.sess.board)}<select id="s-board">${[["", u.sess.allBoards], ...[...new Set(SESSIONS.map((e) => e.board).filter(Boolean))].sort((a, b) => BOARD_ORDER.indexOf(a) - BOARD_ORDER.indexOf(b)).map((b) => [b, L(BOARDS[b])])].map(([v, l]) => `<option value="${v}" ${state.sess.board === v ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>
    </form>
    <p class="count" id="sess-count" aria-live="polite"></p>
    <div class="slist" id="sess-list"></div>
    <p class="small muted">${esc(u.sess.calNote)} ${esc(u.sess.source)}</p></section>

  <section id="capas"><div class="sec-head"><h2>${esc(u.capasH)}</h2><p>${esc(u.capasP)}</p></div>
    <div class="grid">${u.layers.map((l) => `<div class="card layer"><span class="tag">${esc(l.tag)}</span><h3>${esc(l.h)}</h3><p>${esc(l.p)}</p></div>`).join("")}</div></section>

  <section id="grados"><div class="sec-head"><h2>${esc(u.gradosH)}</h2><p>${esc(u.gradosP)}</p></div>${timeline()}</section>

  ${explainerHtml()}

  <section id="siglas"><div class="sec-head"><h2>${esc(u.siglasH)}</h2></div>
    <dl class="gl">${u.glossary.map(([k, d, m]) => `<div class="gl-row"><dt>${esc(k)}</dt><dd>${esc(d)}${m ? ` <span>${esc(m)}</span>` : ""}</dd></div>`).join("")}</dl></section>

  <section id="fechas"><div class="sec-head"><h2>${esc(u.fechasH)}</h2><p>${esc(u.fechasP)}</p></div>
    <div class="dates">${u.dates.map((d) => `<div class="date"><span class="when">${esc(d.when)}</span><p><b>${esc(d.b)}</b> ${esc(d.p)}</p></div>`).join("")}</div></section>

  <section id="preguntas"><div class="sec-head"><h2>${esc(u.preguntasH)}</h2><p>${esc(u.preguntasP)}</p></div>
    <ol class="q">${u.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ol></section>

  ${state.tone === "teen" ? `<section id="descanso"><details class="gamebox" id="gamebox"><summary>${esc(u.game.h)}</summary>
    <p class="muted">${esc(u.game.p)}</p><div id="game-host"></div></details></section>` : ""}

  <section><div class="sec-head"><h2>${esc(u.pendingH)}</h2></div>
    <div class="pending"><p class="muted">${esc(u.pendingP)}</p><ul>${u.pending.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
    <div class="sources">${esc(u.sourcesH)}:<ul>${SOURCES.map(([n, h]) => `<li><a href="${h}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("")}</ul></div></section>
  </main>`;

  $("#foot").innerHTML = `<p>${esc(u.disclaimer)}</p><nav>${state.tone === "teen" ? `<a href="#descanso">${esc(u.game.h)}</a>` : ""}<a href="privacy?lang=${state.lang}">${esc(u.privacy)}</a><a href="${reportUrl("Highschool Navigator", state.lang)}" target="_blank" rel="noopener">${{ es: "Reportar un error", en: "Report an error", fr: "Signaler une erreur" }[state.lang]}</a><a href="#main">${esc(u.backTop)}</a></nav><p class="made">${madeWith(state.lang)}</p>`;
  bindFilters();
  renderResults();
  renderCompare();
  renderSessions();
  bindGame();
  syncMyList();
}

// The game is loaded only when someone opens the "Take a break" panel, so it never slows the page.
window.addEventListener("hashchange", () => {
  if (location.hash !== "#descanso") return;
  const box = $("#gamebox");
  if (box) { box.open = true; box.scrollIntoView({ block: "center" }); }
});

function bindGame() {
  const box = $("#gamebox");
  if (!box) return;
  if (location.hash === "#descanso") box.open = true;
  box.addEventListener("toggle", async () => {
    if (!box.open || $("#game-host").childElementCount) return;
    const { mountGame } = await import("./game.js");
    mountGame($("#game-host"), t().game);
  });
}

// Areas come from the sessions themselves, so new boards' cities appear as soon as their sessions are published.
function sessionAreas(u) {
  const cities = [...new Set(SESSIONS.map((e) => e.city).filter((c) => c && c !== "virtual"))].sort((a, b) => a.localeCompare(b));
  const name = (c) => c.replace(/(^|[ -])(\w)/g, (_, a, b) => a + b.toUpperCase());
  return [["", u.sess.all], ...cities.map((c) => [c, name(c)]), ["virtual", u.sess.virtual]];
}

function renderSessions() {
  const u = t();
  // The area and board lists come from the sessions themselves: refresh them when more boards' sessions have loaded.
  const sa = $("#s-area"), sb = $("#s-board");
  if (sa) sa.innerHTML = sessionAreas(u).map(([v, l]) => `<option value="${v}" ${state.sess.area === v ? "selected" : ""}>${esc(l)}</option>`).join("");
  if (sb) sb.innerHTML = [["", u.sess.allBoards], ...[...new Set(SESSIONS.map((e) => e.board).filter(Boolean))].sort((a, b) => BOARD_ORDER.indexOf(a) - BOARD_ORDER.indexOf(b)).map((b) => [b, L(BOARDS[b])])].map(([v, l]) => `<option value="${v}" ${state.sess.board === v ? "selected" : ""}>${esc(l)}</option>`).join("");
  const today = new Date().toISOString().slice(0, 10);
  let list = SESSIONS.filter((e) => !e.date || e.date >= today);
  if (state.sess.area) list = list.filter((e) => e.city === state.sess.area || e.city === "virtual");
  if (state.sess.board) list = list.filter((e) => e.board === state.sess.board);
  $("#sess-count").textContent = u.sess.count(list.length);
  $("#sess-list").innerHTML = list.length
    ? list.map((e) => renderSessionRow(e, { showSchool: true })).join("")
    : `<div class="empty">${esc(u.sess.none)}</div>`;
}

function renderResults() {
  const u = t();
  const f = state.filters;
  let schools = SCHOOLS.filter(schoolMatches);
  if (f.sort === "fraser") schools = [...schools].sort((a, b) => (b.fraser?.score ?? -1) - (a.fraser?.score ?? -1));
  else schools = [...schools].sort((a, b) => a.name.localeCompare(b.name));
  const progs = PROGRAMS.filter(programMatches);
  const dp = progs.filter((p) => p.board === "dpcdsb");
  const pe = progs.filter((p) => p.board === "peel");
  const empty = `<div class="empty">${esc(u.noResults)}</div>`;

  const shown = schools.slice(0, state.shown);
  const more = schools.length > shown.length
    ? `<div class="showmore"><button type="button" class="btn" id="show-more">${esc(u.showMore(Math.min(PAGE, schools.length - shown.length), schools.length - shown.length))}</button></div>` : "";
  $("#schools").innerHTML = schools.length ? shown.map(schoolCard).join("") : empty;
  $("#schools-more").innerHTML = more;
  const mh = $("#map-host");
  if (mh) renderMap(mh, { lang: state.lang, matchIds: schools.map((s) => s.id) });
  $("#prog-dpcdsb").innerHTML = dp.length ? dp.map(programCard).join("") : empty;
  $("#prog-peel").innerHTML = pe.length ? pe.map(programCard).join("") : empty;
  // Programs of the other boards (loaded from their collected details), grouped by board.
  const other = progs.filter((p) => p.board !== "dpcdsb" && p.board !== "peel");
  const sec = $("#otherprogs");
  if (sec) {
    sec.hidden = !PROGRAMS.some((p) => p.board !== "dpcdsb" && p.board !== "peel");
    $("#prog-other").innerHTML = other.length
      ? BOARD_ORDER.map((b) => { const l = other.filter((p) => p.board === b); return l.length ? `<h3 class="boardh">${esc(L(BOARDS[b]))}</h3><div class="grid">${l.map(programCard).join("")}</div>` : ""; }).join("")
      : empty;
  }
  $("#count").textContent = u.resultCount(schools.length, progs.length);
}

function compareOptions(free) {
  return BOARD_ORDER.map((b) => {
    const list = free.filter((s) => s.board === b);
    return list.length ? `<optgroup label="${esc(L(BOARDS[b]))}">${list.map((s) => `<option value="${s.id}">${esc(s.name)}${s.city !== "Mississauga" ? ` · ${esc(s.city)}` : ""}</option>`).join("")}</optgroup>` : "";
  }).join("");
}

function renderCompare() {
  const u = t();
  const chosen = state.compare.map(byId).filter(Boolean);
  ensureSchools(chosen.map((s) => s.id)).then((changed) => { if (changed) renderCompare(); }); // profiles of the compared schools load on demand
  const free = SCHOOLS.filter((s) => !state.compare.includes(s.id)).sort((a, b) => a.name.localeCompare(b.name));
  const canAdd = chosen.length < MAX_COMPARE;
  $("#cmp-toggles").innerHTML =
    chosen.map((s) => `<button type="button" class="btn chosen" data-remove="${s.id}" aria-label="${esc(u.compRemove)} ${esc(s.name)}">${esc(s.name)} ✕</button>`).join("") +
    (canAdd
      ? `<select id="cmp-add" class="btn" aria-label="${esc(u.compAdd)}"><option value="">${esc(u.compAdd)}</option>${compareOptions(free)}</select>`
      : `<span class="muted small">${esc(u.compareMax)}</span>`);

  if (chosen.length < 2) { $("#cmp-out").innerHTML = `<div class="empty">${esc(u.compEmpty)}</div>`; return; }
  const dash = u.none;
  const row = (label, fn) => `<tr><th scope="row">${esc(label)}</th>${chosen.map((s) => `<td>${fn(s)}</td>`).join("")}</tr>`;
  const r = u.compRows;
  const kv = (k) => (s) => (s.kv && s.kv[k] ? esc(L(s.kv[k])) : dash);
  $("#cmp-out").innerHTML = `<div class="cmp-wrap"><table class="cmp-table">
    <thead><tr><th scope="col">${esc(u.compCol)}</th>${chosen.map((s) => `<th scope="col"><button type="button" class="viewlink" data-school="${s.id}">${esc(s.name)}</button></th>`).join("")}</tr></thead>
    <tbody>
    ${row(r.board, (s) => esc(L(BOARDS[s.board])))}
    ${row(r.fraser, (s) => (s.fraser ? `<b>${s.fraser.score.toFixed(1)}</b> ${esc(u.fraserOf)}` : dash))}
    ${row(r.rank, (s) => (s.fraser ? esc(u.fraserRank(s.fraser.rank)) : dash))}
    ${row(r.prev, (s) => (s.fraser && s.fraser.prev != null ? s.fraser.prev.toFixed(1) : dash))}
    ${row(r.addr, (s) => esc(s.addr))}
    ${row(r.programs, (s) => (s.progs.length ? s.progs.map((p) => esc(L(TAGS[p.k]))).join(", ") : dash))}
    ${row(r.focus, (s) => (s.focus ? esc(L(s.focus)) : dash))}
    ${row(r.distinct, kv("distinct"))}
    ${row(r.shsm, kv("shsm"))}
    ${row(r.langs, kv("langs"))}
    ${row(r.entry, kv("entry"))}
    </tbody></table></div>
    <p class="count">${esc(u.fraserFoot)}<a href="${FRASER.url}" target="_blank" rel="noopener">${esc(L(FRASER.report))}</a></p>`;
}

/* ---------- Events ---------- */

function bindFilters() {
  const f = state.filters;
  $("#f-q").addEventListener("input", (e) => { f.q = e.target.value.trim(); state.shown = PAGE; renderResults(); });
  for (const k of ["region", "city", "board", "tag", "start", "entry", "sort"]) $(`#f-${k}`).addEventListener("change", (e) => {
    f[k] = e.target.value;
    if (k === "region") { f.city = ""; $("#f-city").innerHTML = cityOptions(f.region, ""); }
    state.shown = PAGE;
    renderResults();
  });
  $("#f-reset").addEventListener("click", () => { Object.assign(f, { q: "", region: "", city: "", board: "", tag: "", start: "", entry: "", sort: "name" }); state.shown = PAGE; renderShell(); });
}

function setCompare(id, on) {
  const has = state.compare.includes(id);
  if (on && !has) {
    state.compare.push(id);
    if (state.compare.length > MAX_COMPARE) state.compare.shift();
  } else if (!on && has) {
    state.compare = state.compare.filter((x) => x !== id);
  }
  renderCompare();
  document.querySelectorAll("[data-cmp]").forEach((cb) => { cb.checked = state.compare.includes(cb.dataset.cmp); });
}

let cfTimer = null;
document.addEventListener("input", (e) => {
  if (e.target.id !== "cf-q") return;
  clearTimeout(cfTimer);
  cfTimer = setTimeout(async () => { const { renderFinder } = await import("./course-finder.js"); renderFinder($("#cf-out"), e.target.value, state.lang); }, 220);
});
document.addEventListener("change", (e) => {
  if (e.target.matches("[data-cmp]")) setCompare(e.target.dataset.cmp, e.target.checked);
  if (e.target.id === "cmp-add" && e.target.value) setCompare(e.target.value, true);
  if (e.target.id === "s-area") { state.sess.area = e.target.value; renderSessions(); }
  if (e.target.id === "s-board") { state.sess.board = e.target.value; renderSessions(); }
});
document.addEventListener("click", (e) => {
  if (e.target.closest("#show-more")) { state.shown += PAGE; renderResults(); return; }
  const rm = e.target.closest("[data-remove]");
  if (rm) setCompare(rm.dataset.remove, false);
  const tone = e.target.closest("[data-tone]");
  if (tone && tone.dataset.tone !== state.tone) {
    state.tone = tone.dataset.tone;
    store.set("tone", state.tone);
    renderShell();
    return;
  }
  const vibe = e.target.closest("[data-vibe]");
  if (vibe) {
    const k = vibe.dataset.vibe;
    state.filters.tag = state.filters.tag === k ? "" : k;
    state.shown = PAGE;
    renderShell();
    $("#escuelas")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  const l = e.target.closest("[data-lang]");
  if (l && l.dataset.lang !== state.lang) {
    state.lang = l.dataset.lang;
    store.set("lang", state.lang);
    renderShell();
  }
});
$("#theme-btn").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  store.set("theme", next);
});

state.lang = detectLang();
// The profile modal is initialised first so its language getter is ready when rows are rendered.
initSchoolDetail({
  getLang: () => state.lang,
  onCompare: (id) => setCompare(id, !state.compare.includes(id)),
  isCompared: (id) => state.compare.includes(id),
});
initMyList({ getLang: () => state.lang });
renderShell();
// Board details (programs, admissions, sessions...) load after the first paint and refresh the lists.
ensureAllDetails().then((changed) => { if (changed) { renderResults(); renderSessions(); renderCompare(); } });
