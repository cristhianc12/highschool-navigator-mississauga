import { LANGS, madeWith, SCHOOLS, PROGRAMS, TAGS, BOARDS } from "./content.js";
import { QUIZ_UI, QUIZ_TEEN, QUESTIONS, TAG_WHY } from "./quiz-content.js";
import { initSchoolDetail } from "./school-detail.js";

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

const sess = {
  get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  del(k) { try { sessionStorage.removeItem(k); } catch { /* storage unavailable */ } },
};
const SAVE_KEY = "quizProgress";

const state = {
  lang: "en",
  tone: store.get("tone") === "family" ? "family" : "teen",
  step: -1, answers: {}, result: null, shared: false,
};

const t = () => (state.tone === "teen" ? { ...QUIZ_UI[state.lang], ...QUIZ_TEEN[state.lang] } : QUIZ_UI[state.lang]);
const L = (o) => (o == null ? "" : typeof o === "string" ? o : o[state.lang] || o.en);
const TOTAL = QUESTIONS.length;

function detectLang() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (LANGS.includes(fromUrl)) return fromUrl;
  const saved = store.get("lang");
  if (LANGS.includes(saved)) return saved;
  // Device language (es / fr / en); anything else falls back to English.
  const nav = (navigator.language || "en").toLowerCase();
  return nav.startsWith("fr") ? "fr" : nav.startsWith("es") ? "es" : "en";
}

/* ------------------------------------------------------------------ */
/* Recommendation engine (transparent rule-based scoring)              */
/* ------------------------------------------------------------------ */

const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

function recommend(a) {
  const tagScore = {};
  const sp = { prog: 0, regular: 0, board: null, transport: 0 };
  for (const q of QUESTIONS) {
    for (const v of asArray(a[q.id])) {
      const opt = q.o.find((o) => o.v === v);
      if (!opt) continue;
      for (const [k, w] of Object.entries(opt.w)) {
        if (k === "_board") sp.board = w;
        else if (k === "_transport") sp.transport = w;
        else if (k === "_prog") sp.prog += w;
        else if (k === "_regular") sp.regular += w;
        else tagScore[k] = (tagScore[k] || 0) + w;
      }
    }
  }

  const boardOk = (b) => sp.board === "catholic" ? b !== "peel" : sp.board === "public" ? b === "peel" : true;

  const rows = SCHOOLS.filter((s) => boardOk(s.board) && s.progs.length).map((s) => {
    let sc = 0;
    const hits = [];
    const seen = new Set();
    for (const p of s.progs) {
      if (seen.has(p.k)) continue;
      seen.add(p.k);
      const w = tagScore[p.k] || 0;
      sc += w;
      if (w > 0) hits.push({ k: p.k, w });
    }
    if (sp.prog) sc += 1;
    if (sp.regular) sc -= 1;
    if (hits.length && sp.transport) sc -= sp.transport;
    if (sp.board === "french" && s.board === "fr") sc += 6;
    hits.sort((x, y) => y.w - x.w);
    return { s, sc, hits };
  }).sort((x, y) => y.sc - x.sc || x.s.name.localeCompare(y.s.name));

  const top = rows.filter((r) => r.sc > 0).slice(0, 5);
  const best = top[0]?.sc || 1;
  const schools = top.map((r) => ({ ...r, ratio: r.sc / best, dependsOnRegional: r.hits.length > 0 && sp.transport > 0 }));

  const programs = PROGRAMS
    .filter((p) => boardOk(p.board))
    .map((p) => ({ p, sc: tagScore[p.tag] || 0 }))
    .filter((r) => r.sc > 0)
    .sort((x, y) => y.sc - x.sc || L(x.p.name).localeCompare(L(y.p.name)))
    .slice(0, 5);

  return { schools, programs, wantsRegular: sp.regular > 0, transport: sp.transport };
}

function bandOf(ratio) { return ratio >= 0.8 ? "strong" : ratio >= 0.5 ? "good" : "possible"; }

function answerLabels(qid) {
  const q = QUESTIONS.find((x) => x.id === qid);
  return asArray(state.answers[qid]).map((v) => q.o.find((o) => o.v === v)).filter(Boolean).map((o) => L(o.l));
}

function profileLine() {
  const parts = [];
  const i = answerLabels("q1"), l = answerLabels("q2"), f = answerLabels("q5");
  const lab = { es: ["Te gusta", "Aprendes mejor", "Miras hacia"], en: ["You enjoy", "You learn best", "You look toward"], fr: ["Tu aimes", "Tu apprends mieux", "Tu vises"] }[state.lang];
  if (i.length) parts.push(`${lab[0]}: ${i.join(", ")}`);
  if (l.length) parts.push(`${lab[1]}: ${l[0]}`);
  if (f.length) parts.push(`${lab[2]}: ${f[0]}`);
  return parts.join(" · ");
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

function chrome() {
  const u = t();
  document.documentElement.lang = state.lang === "fr" ? "fr-CA" : state.lang;
  document.title = u.title;
  $('meta[name="description"]').content = u.metaDesc;
  $("#skip").textContent = u.back;
  $("#back-link").innerHTML = `<span class="bk-full">← ${esc(u.back)}</span><span class="bk-short">← ${esc(u.backShort)}</span>`;
  $("#theme-btn").setAttribute("aria-label", u.themeLabel);
  $("#lang-group").setAttribute("aria-label", u.langLabel);
  document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang)));
  const tl = { es: ["Teen", "Familia"], en: ["Teen", "Family"], fr: ["Ado", "Famille"] }[state.lang];
  document.querySelectorAll("[data-tone]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.tone === state.tone));
    b.textContent = b.dataset.tone === "teen" ? tl[0] : tl[1];
  });
  $("#back-link").href = `./?lang=${state.lang}`;
  $("#priv-link").href = `privacy?lang=${state.lang}`;
  $("#priv-link").textContent = u.privacy;
  $("#made").innerHTML = madeWith(state.lang);
}

function render() {
  chrome();
  const app = $("#app");
  if (state.step < 0) app.innerHTML = renderIntro();
  else if (state.step < TOTAL) app.innerHTML = renderQuestion(state.step);
  else app.innerHTML = renderResults();
  const h = app.querySelector("h1, h2");
  if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  window.scrollTo({ top: 0 });
}

function renderIntro() {
  const u = t();
  return `<section class="intro">
    <div class="eyebrow">${esc(u.eyebrow)}</div>
    <h1>${esc(u.h1)}</h1>
    <p class="lead">${esc(u.lead)}</p>
    <ul class="ticks">${u.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
    <p class="notice small">${esc(u.notAdvice)}</p>
    <p class="muted small">${esc(u.ageNote)}</p>
    <button type="button" class="cta" id="start">${esc(u.start)} →</button>
  </section>`;
}

function renderQuestion(i) {
  const u = t();
  const q = QUESTIONS[i];
  const part = q.part === "about" ? u.partAbout : u.partFamily;
  const pct = Math.round((i / TOTAL) * 100);
  const cur = state.answers[q.id];
  const hint = q.type === "multi" ? u.pickUpTo(q.max) : u.pickOne;
  const body = `<div class="opts" role="group" aria-label="${esc(L(q.t))}">${q.o.map((o) => {
    const on = asArray(cur).includes(o.v);
    return `<button type="button" class="opt${on ? " on" : ""}" data-opt="${o.v}" aria-pressed="${on}"><span class="emo" aria-hidden="true">${o.e}</span><span>${esc(L(o.l))}</span></button>`;
  }).join("")}</div>`;
  const isLast = i === TOTAL - 1;
  const canNext = asArray(cur).length > 0;
  // Light easter egg for the teen tone: "6..." on question 6 and "...7" on question 7.
  const tick = state.tone === "teen" ? (i === 5 ? u.tick6 : i === 6 ? u.tick7 : "") : "";
  const optional = q.part === "family";
  return `<section class="qcard">
    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>
    <div class="qmeta"><span class="part">${esc(part)}</span><span>${esc(u.q(i + 1, TOTAL))}${tick ? ` <b class="tick">${esc(tick)}</b>` : ""}</span></div>
    <h2>${esc(L(q.t))}</h2>
    ${hint ? `<p class="muted small">${esc(hint)}</p>` : ""}
    ${body}
    <div class="nav">
      <button type="button" class="btn" id="prev" ${i === 0 ? "disabled" : ""}>← ${esc(u.prev)}</button>
      <span class="grow"></span>
      ${optional ? `<button type="button" class="btn" id="skip-q">${esc(u.skip)}</button>` : ""}
      <button type="button" class="cta small" id="next" ${canNext ? "" : "disabled"}>${esc(isLast ? u.finish : u.next)} →</button>
    </div>
  </section>`;
}

function renderResults() {
  const u = t();
  const r = state.result;
  const profile = profileLine();
  const schools = r.schools.length
    ? r.schools.map((row) => {
      const s = row.s;
      const why = row.hits.slice(0, 2).map((h) => `<li>${esc(L(TAGS[h.k]))}: ${esc(L(TAG_WHY[h.k]))}</li>`).join("");
      const notes = [row.dependsOnRegional ? u.transportNote : "", s.board === "fr" ? u.frenchNote : ""].filter(Boolean)
        .map((n) => `<p class="muted small">${esc(n)}</p>`).join("");
      return `<article class="res board-${s.board}">
        <div class="res-top"><h3><button type="button" class="viewlink" data-school="${s.id}">${esc(s.name)}</button></h3><span class="band ${bandOf(row.ratio)}">${esc(u.bands[bandOf(row.ratio)])}</span></div>
        <div class="sub">${esc(L(BOARDS[s.board]))}</div>
        <div class="chips">${s.progs.map((p) => `<span class="chip">${esc(L(TAGS[p.k]))}</span>`).join("")}</div>
        <p class="small"><b>${esc(u.whyLabel)}</b></p><ul class="why">${why}</ul>${notes}</article>`;
    }).join("")
    : `<p class="empty">${esc(u.noSignal)}</p>`;
  const progs = r.programs.length
    ? r.programs.map(({ p }) => `<article class="res">
        <div class="res-top"><h3>${esc(L(p.name))}</h3><span class="chip">${esc(L(BOARDS[p.board]))}</span></div>
        <p class="small">${esc(L(TAG_WHY[p.tag]))}</p>
        <p class="small muted"><b>${esc(u.hosts)}</b>${p.hosts.map((h) => esc(h.n) + (h.m ? ` (${esc(u.inMiss)})` : "")).join(", ")}</p></article>`).join("")
    : "";
  return `<section class="results">
    <div class="eyebrow">${esc(u.eyebrow)}</div>
    <h1>${esc(u.resultsH)}</h1>
    <p class="lead">${esc(u.resultsLead)}</p>

    <div class="toolbar">
      <div class="tb-row">
        <button type="button" class="cta small" id="pdf">⬇ ${esc(u.pdf)}</button>
        <a class="btn small" href="./?lang=${state.lang}#escuelas">${esc(u.seeGuide)}</a>
        <button type="button" class="btn small" id="retake">${esc(u.retake)}</button>
      </div>
      <div class="tb-row tb-share">
        <label class="check"><input type="checkbox" id="consent" ${state.shared ? "checked disabled" : ""}> ${esc(u.shareCheck)}</label>
        <button type="button" class="btn small" id="share" disabled>${esc(u.shareBtn)}</button>
      </div>
      <details class="tb-info"><summary>${esc(u.shareH)}</summary>
        <p class="small muted">${esc(u.shareP)}</p>
        <p class="small"><a href="privacy?lang=${state.lang}" target="_blank" rel="noopener">${esc(u.privacy)}</a></p></details>
      <p class="small" id="share-msg" role="status" aria-live="polite"></p>
    </div>
    <p class="scrollcue">${esc(u.below)}</p>

    ${profile ? `<h2>${esc(u.profileH)}</h2><p class="profile">${esc(profile)}</p>` : ""}
    <h2>${esc(u.schoolsH)}</h2>
    <div class="resgrid">${schools}</div>
    ${r.wantsRegular ? `<p class="notice small">${esc(u.regularNote)}</p>` : ""}
    ${progs ? `<h2>${esc(u.programsH)}</h2><div class="resgrid">${progs}</div>` : ""}
    <h2>${esc(u.nextH)}</h2>
    <ol class="steps">${u.nextSteps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    <p class="notice small">${esc(u.notAdvice)}</p>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

function saveProgress() {
  sess.set(SAVE_KEY, JSON.stringify({ step: state.step, answers: state.answers, shared: state.shared }));
}

function restoreProgress() {
  try {
    const p = JSON.parse(sess.get(SAVE_KEY) || "null");
    if (!p || typeof p.step !== "number" || typeof p.answers !== "object") return;
    state.answers = p.answers;
    state.shared = !!p.shared;
    state.step = Math.min(Math.max(p.step, -1), TOTAL);
    if (state.step >= TOTAL) state.result = recommend(state.answers);
  } catch { /* ignore corrupt data */ }
}

function go(step) { state.step = step; if (step >= TOTAL) state.result = recommend(state.answers); saveProgress(); render(); }

document.addEventListener("click", (e) => {
  const lang = e.target.closest("[data-lang]");
  if (lang && lang.dataset.lang !== state.lang) {
    state.lang = lang.dataset.lang; store.set("lang", state.lang); render(); return;
  }
  const tone = e.target.closest("[data-tone]");
  if (tone && tone.dataset.tone !== state.tone) {
    state.tone = tone.dataset.tone; store.set("tone", state.tone); render(); return;
  }
  if (e.target.closest("#start")) return go(0);
  if (e.target.closest("#prev")) return go(Math.max(0, state.step - 1));
  if (e.target.closest("#skip-q")) return go(state.step + 1);
  if (e.target.closest("#next")) return advance();
  if (e.target.closest("#retake")) { state.answers = {}; state.result = null; state.shared = false; sess.del(SAVE_KEY); return go(-1); }
  if (e.target.closest("#pdf")) return makePdf();
  if (e.target.closest("#share")) return share();
  const opt = e.target.closest("[data-opt]");
  if (opt) pick(opt.dataset.opt);
});

document.addEventListener("change", (e) => { if (e.target.id === "consent") $("#share").disabled = !e.target.checked; });

function pick(v) {
  const q = QUESTIONS[state.step];
  if (q.type === "multi") {
    const cur = asArray(state.answers[q.id]);
    state.answers[q.id] = cur.includes(v) ? cur.filter((x) => x !== v) : cur.length < q.max ? [...cur, v] : cur;
    saveProgress();
    const app = $("#app");
    app.querySelectorAll("[data-opt]").forEach((b) => {
      const on = state.answers[q.id].includes(b.dataset.opt);
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on));
    });
    $("#next").disabled = state.answers[q.id].length === 0;
  } else {
    state.answers[q.id] = v;
    saveProgress();
    render();
    setTimeout(() => { if (state.step < TOTAL && QUESTIONS[state.step]?.id === q.id) advance(); }, 220);
  }
}

function advance() { go(state.step + 1); }

/* ------------------------------------------------------------------ */
/* Anonymous share                                                     */
/* ------------------------------------------------------------------ */

async function share() {
  const u = t();
  const msg = $("#share-msg");
  const btn = $("#share");
  btn.disabled = true;
  const r = state.result;
  const body = {
    v: 2,
    lang: state.lang,
    answers: state.answers,
    topSchools: r.schools.map((x) => x.s.id),
    topPrograms: r.programs.map((x) => x.p.id),
  };
  try {
    const res = await fetch("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { state.shared = true; saveProgress(); msg.textContent = u.shareOk; $("#consent").disabled = true; return; }
    msg.textContent = res.status === 404 || res.status === 503 ? u.shareOff : u.shareErr;
  } catch {
    msg.textContent = u.shareErr;
  }
  btn.disabled = false;
}

/* ------------------------------------------------------------------ */
/* PDF (generated in the browser, nothing leaves the device)           */
/* ------------------------------------------------------------------ */

function loadJsPdf() {
  if (window.jspdf) return Promise.resolve(window.jspdf.jsPDF);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "assets/vendor/jspdf.umd.min.js"; // self-hosted: no third-party request
    s.onload = () => resolve(window.jspdf.jsPDF);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function makePdf() {
  const u = t();
  const btn = $("#pdf");
  const label = btn.textContent;
  btn.disabled = true; btn.textContent = u.pdfBusy;
  try {
    const JsPDF = await loadJsPdf();
    const doc = new JsPDF({ unit: "mm", format: "letter" });
    const W = 216, M = 16, CW = W - M * 2, H = 279;
    let y = 0;
    const teal = [11, 122, 134], ink = [18, 34, 45], muted = [86, 106, 122];

    const ensure = (h) => { if (y + h > H - 16) { doc.addPage(); y = 18; } };
    const write = (text, { size = 10.5, bold = false, color = ink, gap = 1.5, indent = 0 } = {}) => {
      doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(size); doc.setTextColor(...color);
      const lines = doc.splitTextToSize(String(text), CW - indent);
      const lh = size * 0.42;
      lines.forEach((ln) => { ensure(lh + 1); doc.text(ln, M + indent, y); y += lh + 0.9; });
      y += gap;
    };
    const heading = (text) => { ensure(14); y += 3; write(text, { size: 13, bold: true, color: teal, gap: 1 }); };

    doc.setFillColor(...teal); doc.rect(0, 0, W, 34, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(19);
    doc.text(doc.splitTextToSize(u.pdfTitle, CW), M, 16);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10.5);
    doc.text(u.pdfSub, M, 26);
    y = 44;
    const locale = { es: "es-CO", en: "en-CA", fr: "fr-CA" }[state.lang];
    write(`${u.pdfDate}: ${new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}`, { size: 9.5, color: muted, gap: 3 });

    // Disclaimer box
    const dl = doc.splitTextToSize(u.pdfDisclaimer, CW - 8);
    const boxH = dl.length * 4.3 + 12;
    doc.setFillColor(251, 234, 203); doc.roundedRect(M, y - 4, CW, boxH, 2, 2, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); doc.setTextColor(120, 70, 0); doc.text(u.pdfDisclaimerH, M + 4, y + 1);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(...ink);
    dl.forEach((ln, i) => doc.text(ln, M + 4, y + 7 + i * 4.3));
    y += boxH + 4;

    const profile = profileLine();
    if (profile) { heading(u.profileH); write(profile); }

    const r = state.result;
    heading(u.schoolsH);
    if (!r.schools.length) write(u.noSignal);
    r.schools.forEach((row) => {
      ensure(30);
      write(`${row.s.name}  -  ${u.bands[bandOf(row.ratio)]}`, { size: 11.5, bold: true, gap: 0.5 });
      write(`${L(BOARDS[row.s.board])} · ${row.s.progs.map((p) => L(TAGS[p.k])).join(", ")}`, { size: 9.5, color: muted, gap: 0.5 });
      row.hits.slice(0, 2).forEach((h) => write(`- ${L(TAGS[h.k])}: ${L(TAG_WHY[h.k])}`, { size: 10, indent: 3, gap: 0 }));
      if (row.dependsOnRegional) write(u.transportNote, { size: 9, color: muted, indent: 3, gap: 0 });
      if (row.s.board === "fr") write(u.frenchNote, { size: 9, color: muted, indent: 3, gap: 0 });
      y += 2.5;
    });
    if (r.wantsRegular) write(u.regularNote, { size: 9.5, color: muted });

    if (r.programs.length) {
      heading(u.programsH);
      r.programs.forEach(({ p }) => {
        ensure(20);
        write(L(p.name), { size: 11, bold: true, gap: 0.5 });
        write(L(TAG_WHY[p.tag]), { size: 10, gap: 0.5 });
        write(`${u.hosts}${p.hosts.map((h) => h.n + (h.m ? ` (${u.inMiss})` : "")).join(", ")}`, { size: 9, color: muted, gap: 2.5 });
      });
    }

    heading(u.nextH);
    u.nextSteps.forEach((s, i) => write(`${i + 1}. ${s}`, { gap: 0.8 }));

    heading(u.pdfAnswersH);
    QUESTIONS.forEach((q) => {
      const a = answerLabels(q.id);
      if (a.length) write(`${L(q.t)} ${a.join(", ")}`, { size: 9, color: muted, gap: 0.6 });
    });

    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(...muted);
      doc.text(doc.splitTextToSize(u.pdfFooter, CW - 14), M, H - 10);
      doc.text(`${i} / ${pages}`, W - M, H - 10, { align: "right" });
    }
    doc.save(`highschool-navigator-${state.lang}.pdf`);
  } catch {
    alert("PDF error");
  } finally {
    btn.disabled = false; btn.textContent = label;
  }
}

/* ------------------------------------------------------------------ */

$("#theme-btn").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  store.set("theme", next);
});

state.lang = detectLang();
restoreProgress();
render();
initSchoolDetail({ getLang: () => state.lang });
