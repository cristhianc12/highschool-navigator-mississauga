import { UI, LANGS, SCHOOLS, PROGRAMS, SOURCES, FRASER, TAGS, BOARDS } from "./content.js";

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const MAX_COMPARE = 4;

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

const state = {
  lang: "es",
  filters: { q: "", system: "", tag: "", start: "", entry: "", sort: "name" },
  compare: ["goetz", "pocock", "cabot", "sfx"],
};

function detectLang() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (LANGS.includes(fromUrl)) return fromUrl;
  const saved = store.get("lang");
  if (LANGS.includes(saved)) return saved;
  const nav = (navigator.language || "es").toLowerCase();
  return nav.startsWith("fr") ? "fr" : nav.startsWith("en") ? "en" : "es";
}

const t = () => UI[state.lang];
const L = (o) => (o == null ? "" : typeof o === "string" ? o : o[state.lang] || o.en);
const byId = (id) => SCHOOLS.find((s) => s.id === id);
const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/* ---------- Filtering ---------- */

function schoolText(s) {
  const kv = s.kv ? Object.values(s.kv).map(L).join(" ") : "";
  const progs = s.progs.map((p) => `${L(TAGS[p.k])} ${L(p.n)}`).join(" ");
  return `${s.name} ${s.addr} ${L(BOARDS[s.board])} ${progs} ${kv} ${s.focus ? L(s.focus) : ""}`;
}

function schoolMatches(s) {
  const f = state.filters;
  if (f.system && s.board !== f.system) return false;
  if (f.tag && !s.progs.some((p) => p.k === f.tag)) return false;
  if (f.q && !norm(schoolText(s)).includes(norm(f.q))) return false;
  return true;
}

function programMatches(p) {
  const f = state.filters;
  if (f.system && p.board !== f.system) return false;
  if (f.tag && p.tag !== f.tag) return false;
  if (f.start && p.start !== f.start) return false;
  if (f.entry && p.entry !== f.entry) return false;
  const text = `${L(p.name)} ${p.hosts.map((h) => h.n).join(" ")} ${L(p.p)}`;
  if (f.q && !norm(text).includes(norm(f.q))) return false;
  return true;
}

/* ---------- Templates ---------- */

function progChips(s) {
  return s.progs.map((p) => `<span class="chip" ${p.n ? `title="${esc(L(p.n))}"` : ""}>${esc(L(TAGS[p.k]))}</span>`).join("");
}

function fraserBlock(s) {
  const u = t();
  if (!s.fraser) return `<div class="fraser"><small>${esc(u.fraserNone)}</small></div>`;
  const f = s.fraser;
  const prev = f.prev == null ? "" : ` · ${esc(u.fraserPrev(f.prev.toFixed(1)))}`;
  return `<div class="fraser">
    <div class="fraser-head"><span class="fraser-label">${esc(u.fraserLabel)}</span><span class="fraser-score">${f.score.toFixed(1)}</span><span class="fraser-of">${esc(u.fraserOf)}</span></div>
    <div class="bar" role="img" aria-label="${f.score.toFixed(1)} ${esc(u.fraserOf)}"><i style="width:${f.score * 10}%"></i></div>
    <small>${esc(u.fraserRank(f.rank))}${prev}</small>
    ${s.fnote ? `<small class="warnnote">${esc(L(s.fnote))}</small>` : ""}
  </div>`;
}

function schoolCard(s) {
  const u = t();
  const initials = s.name.replace(/[^A-Za-zÀ-ÿ ]/g, "").split(" ").filter((w) => /^[A-ZÀ-Ý]/.test(w) && !/^(SS|CSS)$/.test(w)).slice(0, 2).map((w) => w[0]).join("") || s.name[0];
  const more = s.kv ? `<details class="more"><summary>${esc(u.moreInfo)}</summary>
      <p class="focus"><b>${esc(u.lblFocus)}</b> ${esc(L(s.focus))}</p>
      <dl class="kv">${["distinct", "shsm", "langs", "entry"].map((k) => `<dt>${esc(u.compRows[k])}</dt><dd>${esc(L(s.kv[k]))}</dd>`).join("")}</dl></details>` : "";
  const progs = s.progs.length
    ? `<div class="chips">${progChips(s)}</div>`
    : `<p class="muted small">${esc(u.noPrograms)}</p>`;
  const checked = state.compare.includes(s.id);
  return `
  <article class="card school board-${s.board}" data-id="${s.id}">
    <div class="top"><div class="mono" aria-hidden="true">${esc(initials)}</div><div><div class="name">${esc(s.name)}</div><div class="sub">${esc(L(BOARDS[s.board]))} · ${esc(s.addr)}</div></div></div>
    ${progs}
    ${fraserBlock(s)}
    ${more}
    <label class="cmp"><input type="checkbox" data-cmp="${s.id}" ${checked ? "checked" : ""}> ${esc(u.compare)}</label>
  </article>`;
}

function programCard(p) {
  const u = t();
  const hosts = p.hosts.map((h) => `<li${h.m ? ' class="miss"' : ""}>${esc(h.n)}${h.m ? ` <span class="pin">${esc(u.inMiss)}</span>` : ""}</li>`).join("");
  const second = p.second ? `<p class="muted small"><b>${esc(u.secondEntry)}</b>${esc(L(p.second))}</p>` : "";
  return `<article class="card prog"><h3>${esc(L(p.name))}</h3>
    <div class="where">${esc(u.host)}</div><ul class="hosts">${hosts}</ul>
    <p>${esc(L(p.p))}</p>${second}
    <div class="meta"><span class="chip">${esc(u.startsAt[p.start])}</span><span class="chip apply">${esc(u.applyChip)}</span></div></article>`;
}

function options(map, current) {
  const u = t();
  return `<option value="">${esc(u.all)}</option>` +
    Object.entries(map).map(([v, label]) => `<option value="${v}" ${current === v ? "selected" : ""}>${esc(label)}</option>`).join("");
}

function tagOptions(current) {
  const u = t();
  return `<option value="">${esc(u.all)}</option>` +
    Object.keys(TAGS).map((k) => `<option value="${k}" ${current === k ? "selected" : ""}>${esc(L(TAGS[k]))}</option>`).join("");
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
  document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang)));

  const nav = Object.entries(u.nav).map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join("");
  const f = state.filters;

  $("#app").innerHTML = `
  <main id="main">
  <header class="hero">
    <div class="eyebrow">${esc(u.eyebrow)}</div>
    <h1>${esc(u.h1)}</h1>
    <p class="lead">${esc(u.lead)}</p>
    <div class="facts">
      <span class="fact"><b>${esc(u.factBoards)}</b> ${esc(u.factBoardsV)}</span>
      <span class="fact"><b>${esc(u.factSchools)}</b> ${esc(u.factSchoolsN(SCHOOLS.length))}</span>
    </div>
    <p class="notice">${u.notice}</p>
    <p class="scope muted small">${esc(u.scope)}</p>
    <nav class="jump" aria-label="${esc(u.navLabel)}">${nav}</nav>
  </header>

  <section id="capas"><div class="sec-head"><h2>${esc(u.capasH)}</h2><p>${esc(u.capasP)}</p></div>
    <div class="grid">${u.layers.map((l) => `<div class="card layer"><span class="tag">${esc(l.tag)}</span><h3>${esc(l.h)}</h3><p>${esc(l.p)}</p></div>`).join("")}</div></section>

  <section id="explorar"><div class="sec-head"><h2>${esc(u.exploreH)}</h2><p>${esc(u.exploreP)}</p></div>
    <form class="filters" id="filters" role="search" onsubmit="return false">
      <label class="field search">${esc(u.searchLabel)}<input type="search" id="f-q" value="${esc(f.q)}" placeholder="${esc(u.searchPh)}"></label>
      <label class="field">${esc(u.fSystem)}<select id="f-system">${options(u.optSystem, f.system)}</select></label>
      <label class="field">${esc(u.fTag)}<select id="f-tag">${tagOptions(f.tag)}</select></label>
      <label class="field">${esc(u.fStart)}<select id="f-start">${options(u.optStart, f.start)}</select></label>
      <label class="field">${esc(u.fEntry)}<select id="f-entry">${options(u.optEntry, f.entry)}</select></label>
      <label class="field">${esc(u.fSort)}<select id="f-sort">${Object.entries(u.optSort).map(([v, l]) => `<option value="${v}" ${f.sort === v ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>
      <button type="button" class="btn" id="f-reset">${esc(u.reset)}</button>
    </form>
    <p class="count" id="count" aria-live="polite"></p></section>

  <section id="escuelas"><div class="sec-head"><h2>${esc(u.escuelasH)}</h2><p>${esc(u.escuelasP)}</p></div>
    <div class="grid" id="schools"></div>
    <details class="fraser-note"><summary>${esc(u.fraserWhatH)}</summary><p>${esc(u.fraserWhat)}</p>
      <p><a href="${FRASER.url}" target="_blank" rel="noopener">${esc(L(FRASER.report))}</a></p></details></section>

  <section id="comparar"><div class="sec-head"><h2>${esc(u.compararH)}</h2><p>${esc(u.compararP)}</p></div>
    <div class="cmp-toggles" id="cmp-toggles"></div><div id="cmp-out"></div></section>

  <section id="regionales"><div class="sec-head"><h2>${esc(u.regionalesH)}</h2><p>${esc(u.regionalesP)}</p></div>
    <div class="grid" id="prog-dpcdsb"></div></section>

  <section id="peel"><div class="sec-head"><h2>${esc(u.peelH)}</h2><p>${esc(u.peelP)}</p></div>
    <div class="grid" id="prog-peel"></div>
    <div class="grid" style="margin-top:14px">
      <div class="card"><h3>${esc(u.peelHowH)}</h3><p>${esc(u.peelHow)}</p></div>
      <div class="card"><h3>${esc(u.peelRuleH)}</h3><p>${esc(u.peelRule)}</p></div></div></section>

  <section id="grados"><div class="sec-head"><h2>${esc(u.gradosH)}</h2><p>${esc(u.gradosP)}</p></div>${timeline()}</section>

  <section id="siglas"><div class="sec-head"><h2>${esc(u.siglasH)}</h2></div>
    <dl class="gl">${u.glossary.map(([k, d, m]) => `<div class="gl-row"><dt>${esc(k)}</dt><dd>${esc(d)}${m ? ` <span>${esc(m)}</span>` : ""}</dd></div>`).join("")}</dl></section>

  <section id="fechas"><div class="sec-head"><h2>${esc(u.fechasH)}</h2><p>${esc(u.fechasP)}</p></div>
    <div class="dates">${u.dates.map((d) => `<div class="date"><span class="when">${esc(d.when)}</span><p><b>${esc(d.b)}</b> ${esc(d.p)}</p></div>`).join("")}</div></section>

  <section id="preguntas"><div class="sec-head"><h2>${esc(u.preguntasH)}</h2><p>${esc(u.preguntasP)}</p></div>
    <ol class="q">${u.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ol></section>

  <section><div class="sec-head"><h2>${esc(u.pendingH)}</h2></div>
    <div class="pending"><p class="muted">${esc(u.pendingP)}</p><ul>${u.pending.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
    <div class="sources">${esc(u.sourcesH)}:<ul>${SOURCES.map(([n, h]) => `<li><a href="${h}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("")}</ul></div></section>
  </main>`;

  $("#foot").innerHTML = `<p>${esc(u.disclaimer)}</p><a href="#main">${esc(u.backTop)}</a>`;
  bindFilters();
  renderResults();
  renderCompare();
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

  $("#schools").innerHTML = schools.length ? schools.map(schoolCard).join("") : empty;
  $("#prog-dpcdsb").innerHTML = dp.length ? dp.map(programCard).join("") : empty;
  $("#prog-peel").innerHTML = pe.length ? pe.map(programCard).join("") : empty;
  $("#count").textContent = u.resultCount(schools.length, progs.length);
}

function renderCompare() {
  const u = t();
  const chosen = state.compare.map(byId).filter(Boolean);
  const free = SCHOOLS.filter((s) => !state.compare.includes(s.id)).sort((a, b) => a.name.localeCompare(b.name));
  const canAdd = chosen.length < MAX_COMPARE;
  $("#cmp-toggles").innerHTML =
    chosen.map((s) => `<button type="button" class="btn chosen" data-remove="${s.id}" aria-label="${esc(u.compRemove)} ${esc(s.name)}">${esc(s.name)} ✕</button>`).join("") +
    (canAdd
      ? `<select id="cmp-add" class="btn" aria-label="${esc(u.compAdd)}"><option value="">${esc(u.compAdd)}</option>${free.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("")}</select>`
      : `<span class="muted small">${esc(u.compareMax)}</span>`);

  if (chosen.length < 2) { $("#cmp-out").innerHTML = `<div class="empty">${esc(u.compEmpty)}</div>`; return; }
  const dash = u.none;
  const row = (label, fn) => `<tr><th scope="row">${esc(label)}</th>${chosen.map((s) => `<td>${fn(s)}</td>`).join("")}</tr>`;
  const r = u.compRows;
  const kv = (k) => (s) => (s.kv ? esc(L(s.kv[k])) : dash);
  $("#cmp-out").innerHTML = `<div class="cmp-wrap"><table class="cmp-table">
    <thead><tr><th scope="col">${esc(u.compCol)}</th>${chosen.map((s) => `<th scope="col">${esc(s.name)}</th>`).join("")}</tr></thead>
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
  $("#f-q").addEventListener("input", (e) => { f.q = e.target.value.trim(); renderResults(); });
  for (const k of ["system", "tag", "start", "entry", "sort"]) $(`#f-${k}`).addEventListener("change", (e) => { f[k] = e.target.value; renderResults(); });
  $("#f-reset").addEventListener("click", () => { Object.assign(f, { q: "", system: "", tag: "", start: "", entry: "", sort: "name" }); renderShell(); });
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

document.addEventListener("change", (e) => {
  if (e.target.matches("[data-cmp]")) setCompare(e.target.dataset.cmp, e.target.checked);
  if (e.target.id === "cmp-add" && e.target.value) setCompare(e.target.value, true);
});
document.addEventListener("click", (e) => {
  const rm = e.target.closest("[data-remove]");
  if (rm) setCompare(rm.dataset.remove, false);
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
renderShell();
