import { UI, SCHOOLS, PROGRAMS, SOURCES, FRASER } from "./content.js";

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } },
};

const state = {
  lang: "es",
  filters: { q: "", system: "", start: "", entry: "" },
  compare: new Set(SCHOOLS.map((s) => s.id)),
};

function detectLang() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (fromUrl === "es" || fromUrl === "en") return fromUrl;
  const saved = store.get("lang");
  if (saved === "es" || saved === "en") return saved;
  return (navigator.language || "es").toLowerCase().startsWith("en") ? "en" : "es";
}

const t = () => UI[state.lang];
const L = (o) => (typeof o === "string" ? o : o[state.lang]);

function matches(item, text) {
  const f = state.filters;
  if (f.system && item.system !== f.system) return false;
  if (f.start && item.start !== f.start) return false;
  if (f.entry && item.entry !== f.entry) return false;
  if (f.q && !text.toLowerCase().includes(f.q.toLowerCase())) return false;
  return true;
}

/* ---------- Plantillas ---------- */

function chip(c) { return `<span class="chip ${c.k}">${esc(L(c.t))}</span>`; }

function schoolCard(s) {
  const u = t();
  const f = s.fraser;
  const kv = ["distinct", "shsm", "langs", "entry"]
    .map((k) => `<dt>${esc(u.compRows[k])}</dt><dd>${esc(L(s.kv[k]))}</dd>`).join("");
  return `
  <article class="card school ${s.cls}" data-id="${s.id}">
    <div class="top"><div class="mono" aria-hidden="true">${s.mono}</div><div><div class="name">${esc(s.name)}</div><div class="sub">${esc(s.addr)}</div></div></div>
    <div class="chips">${s.chips.map(chip).join("")}</div>
    <p class="focus"><b>${esc(u.lblFocus)}</b> ${esc(L(s.focus))}</p>
    <dl class="kv">${kv}</dl>
    <div class="fraser">
      <div class="fraser-head"><span class="fraser-label">${esc(u.fraserLabel)}</span><span class="fraser-score">${f.score.toFixed(1)}</span><span class="fraser-of">${esc(u.fraserOf)}</span></div>
      <div class="bar" role="img" aria-label="${f.score.toFixed(1)} ${esc(u.fraserOf)}"><i style="width:${f.score * 10}%"></i></div>
      <small>${esc(u.fraserRank(f.rank))} · ${esc(u.fraserPrev(f.prev.toFixed(1)))}</small>
    </div>
    <label class="cmp"><input type="checkbox" data-cmp="${s.id}" ${state.compare.has(s.id) ? "checked" : ""}> ${esc(u.compare)}</label>
  </article>`;
}

function programCard(p) {
  const u = t();
  const where = p.host ? `<div class="where">${esc(u.host)}${esc(p.host)}</div>` : "";
  const chips = p.chips
    ? p.chips.map(chip).join("")
    : `<span class="chip">${esc(u.startsAt[p.start])}</span><span class="chip apply">${state.lang === "es" ? "Solicitud" : "Application"}</span>`;
  return `<article class="card prog"><h3>${esc(p.name)}</h3>${where}<p>${esc(L(p.p))}</p><div class="meta">${chips}</div></article>`;
}

function options(map, current) {
  const u = t();
  return `<option value="">${esc(u.all)}</option>` +
    Object.entries(map).map(([v, label]) => `<option value="${v}" ${current === v ? "selected" : ""}>${esc(label)}</option>`).join("");
}

function timeline() {
  const u = t();
  const rows = u.timeline.map((r) => {
    const segs = r.segs
      ? r.segs.map(([a, b, txt, soft]) => `<span class="seg ${soft ? "soft" : "core"}" style="grid-column:${a}/${b}">${esc(txt)}</span>`).join("")
      : `<span class="seg ${r.soft ? "soft" : "core"}" style="grid-column:${r.from}/${r.to}">${esc(r.txt)}</span>`;
    return `<div class="tl-row"><div class="tl-label">${esc(r.label)}<small>${esc(r.sub)}</small></div><div class="cols">${segs}</div></div>`;
  }).join("");
  return `<div class="tl"><div class="tl-head"><span>${esc(u.tlOption)}</span><div class="cols"><span>Gr 9</span><span>Gr 10</span><span>Gr 11</span><span>Gr 12</span></div></div>${rows}
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
  $('meta[property="og:locale"]').content = state.lang === "es" ? "es_CO" : "en_CA";
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
      <span class="fact"><b>${esc(u.factSchools)}</b> ${esc(u.factSchoolsV)}</span>
    </div>
    <p class="notice">${u.notice}</p>
    <nav class="jump" aria-label="${esc(u.navLabel)}">${nav}</nav>
  </header>

  <section id="capas"><div class="sec-head"><h2>${esc(u.capasH)}</h2><p>${esc(u.capasP)}</p></div>
    <div class="grid">${u.layers.map((l) => `<div class="card layer"><span class="tag">${esc(l.tag)}</span><h3>${esc(l.h)}</h3><p>${esc(l.p)}</p></div>`).join("")}</div></section>

  <section id="explorar"><div class="sec-head"><h2>${esc(u.exploreH)}</h2><p>${esc(u.exploreP)}</p></div>
    <form class="filters" id="filters" role="search" onsubmit="return false">
      <label class="field search">${esc(u.searchLabel)}<input type="search" id="f-q" value="${esc(f.q)}" placeholder="${esc(u.searchPh)}"></label>
      <label class="field">${esc(u.fSystem)}<select id="f-system">${options(u.optSystem, f.system)}</select></label>
      <label class="field">${esc(u.fStart)}<select id="f-start">${options(u.optStart, f.start)}</select></label>
      <label class="field">${esc(u.fEntry)}<select id="f-entry">${options(u.optEntry, f.entry)}</select></label>
      <button type="button" class="btn" id="f-reset">${esc(u.reset)}</button>
    </form>
    <p class="count" id="count" aria-live="polite"></p></section>

  <section id="escuelas"><div class="sec-head"><h2>${esc(u.escuelasH)}</h2><p>${esc(u.escuelasP)}</p></div>
    <div class="grid two" id="schools"></div>
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
  const schools = SCHOOLS.filter((s) => matches(s, `${s.name} ${L(s.focus)} ${Object.values(s.kv).map(L).join(" ")} ${s.tags}`));
  const progs = PROGRAMS.filter((p) => matches(p, `${p.name} ${p.host || ""} ${L(p.p)}`));
  const dp = progs.filter((p) => p.system === "dpcdsb");
  const pe = progs.filter((p) => p.system === "peel");
  const empty = `<div class="empty">${esc(u.noResults)}</div>`;

  $("#schools").innerHTML = schools.length ? schools.map(schoolCard).join("") : empty;
  $("#prog-dpcdsb").innerHTML = dp.length ? dp.map(programCard).join("") : empty;
  $("#prog-peel").innerHTML = pe.length ? pe.map(programCard).join("") : empty;
  $("#count").textContent = u.resultCount(schools.length + progs.length);
}

function renderCompare() {
  const u = t();
  $("#cmp-toggles").innerHTML = SCHOOLS.map((s) =>
    `<button type="button" class="btn" data-toggle="${s.id}" aria-pressed="${state.compare.has(s.id)}">${esc(s.name)}</button>`).join("");
  const chosen = SCHOOLS.filter((s) => state.compare.has(s.id));
  if (chosen.length < 2) { $("#cmp-out").innerHTML = `<div class="empty">${esc(u.compEmpty)}</div>`; return; }
  const row = (label, fn) => `<tr><th scope="row">${esc(label)}</th>${chosen.map((s) => `<td>${fn(s)}</td>`).join("")}</tr>`;
  const r = u.compRows;
  $("#cmp-out").innerHTML = `<div class="cmp-wrap"><table class="cmp-table">
    <thead><tr><th scope="col">${esc(u.compCol)}</th>${chosen.map((s) => `<th scope="col">${esc(s.name)}</th>`).join("")}</tr></thead>
    <tbody>
    ${row(r.fraser, (s) => `<b>${s.fraser.score.toFixed(1)}</b> ${esc(u.fraserOf)}`)}
    ${row(r.rank, (s) => esc(u.fraserRank(s.fraser.rank)))}
    ${row(r.prev, (s) => s.fraser.prev.toFixed(1))}
    ${row(r.addr, (s) => esc(s.addr))}
    ${row(r.focus, (s) => esc(L(s.focus)))}
    ${row(r.distinct, (s) => esc(L(s.kv.distinct)))}
    ${row(r.shsm, (s) => esc(L(s.kv.shsm)))}
    ${row(r.langs, (s) => esc(L(s.kv.langs)))}
    ${row(r.entry, (s) => esc(L(s.kv.entry)))}
    </tbody></table></div>
    <p class="count">${esc(u.fraserFoot)}<a href="${FRASER.url}" target="_blank" rel="noopener">${esc(L(FRASER.report))}</a></p>`;
}

/* ---------- Eventos ---------- */

function bindFilters() {
  const f = state.filters;
  const upd = () => { renderResults(); };
  $("#f-q").addEventListener("input", (e) => { f.q = e.target.value.trim(); upd(); });
  for (const k of ["system", "start", "entry"]) $(`#f-${k}`).addEventListener("change", (e) => { f[k] = e.target.value; upd(); });
  $("#f-reset").addEventListener("click", () => { Object.assign(f, { q: "", system: "", start: "", entry: "" }); renderShell(); });
}

function toggleCompare(id) {
  state.compare.has(id) ? state.compare.delete(id) : state.compare.add(id);
  renderCompare();
  const cb = document.querySelector(`[data-cmp="${id}"]`);
  if (cb) cb.checked = state.compare.has(id);
}

document.addEventListener("change", (e) => { if (e.target.matches("[data-cmp]")) toggleCompare(e.target.dataset.cmp); });
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-toggle]");
  if (b) toggleCompare(b.dataset.toggle);
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
