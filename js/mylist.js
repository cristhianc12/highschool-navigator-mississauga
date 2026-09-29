// "My list": a personal shortlist of schools and programs, stored only on this device (localStorage).
// Elements with data-star / data-star-type toggle an item. The panel shows the list, a plan with the
// dates that matter for it, and lets the person export everything to their calendar (.ics), a PDF or text.
import { UI, SCHOOLS, PROGRAMS, TAGS, TAG_ICON, BOARDS } from "./content.js";
import { SESSIONS, sessionsForSchool, sessionsForProgram, fmtDate, eventTime, icsFor } from "./sessions.js";
import { renderSessionRow } from "./school-detail.js";
import { PROGRAM_INFO } from "./program-info.js";

const KEY = "hsList";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------------- storage ---------------- */
const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null");
    return { schools: Array.isArray(v?.schools) ? v.schools : [], programs: Array.isArray(v?.programs) ? v.programs : [] };
  } catch { return { schools: [], programs: [] }; }
};
const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* storage unavailable */ } };

let ctx = { getLang: () => "en" };
let dlg = null;
const langOf = () => ctx.getLang();
const Lx = (o) => (o == null ? "" : typeof o === "string" ? o : o[langOf()] || o.en);
const T = () => UI[langOf()].list;

export const inList = (type, id) => read()[type + "s"].includes(id);
export const listCount = () => { const v = read(); return v.schools.length + v.programs.length; };

/** Star button markup. Compact (icon only) or with a text label. */
export function starBtn(type, id, { label = false } = {}) {
  const on = inList(type, id);
  const t = T();
  return `<button type="button" class="star${label ? " labeled" : ""}" data-star="${id}" data-star-type="${type}" aria-pressed="${on}" aria-label="${esc(on ? t.saved : t.add)}" title="${esc(on ? t.saved : t.add)}"><span aria-hidden="true">${on ? "⭐" : "☆"}</span>${label ? `<span>${esc(on ? t.saved : t.add)}</span>` : ""}</button>`;
}

export function toggle(type, id) {
  const v = read();
  const arr = v[type + "s"];
  const i = arr.indexOf(id);
  i >= 0 ? arr.splice(i, 1) : arr.push(id);
  write(v);
  refresh();
  window.dispatchEvent(new Event("mylist:change"));
  if (dlg?.open) renderPanel();
}

/** Re-sync every star button and the counter in the page. */
export function refresh() {
  const t = T();
  document.querySelectorAll("[data-star]").forEach((b) => {
    const on = inList(b.dataset.starType, b.dataset.star);
    b.setAttribute("aria-pressed", String(on));
    const txt = on ? t.saved : t.add;
    b.setAttribute("aria-label", txt); b.title = txt;
    const icon = b.querySelector("span[aria-hidden]"); if (icon) icon.textContent = on ? "⭐" : "☆";
    if (b.classList.contains("labeled")) { const l = b.querySelectorAll("span")[1]; if (l) l.textContent = txt; }
  });
  const btn = document.getElementById("list-btn");
  if (btn) {
    const n = listCount();
    btn.innerHTML = `<span aria-hidden="true">${n ? "⭐" : "☆"}</span> <span class="lb-text">${esc(t.btn)}</span>${n ? ` <b>${n}</b>` : ""}`;
    btn.setAttribute("aria-label", `${t.btn}${n ? `: ${n}` : ""}`);
  }
}

/* ---------------- plan ---------------- */
function collect() {
  const v = read();
  const schools = v.schools.map((id) => SCHOOLS.find((s) => s.id === id)).filter(Boolean);
  const programs = v.programs.map((id) => PROGRAMS.find((p) => p.id === id)).filter(Boolean);
  const seen = new Set();
  const events = [];
  const add = (e) => { if (!seen.has(e.id)) { seen.add(e.id); events.push(e); } };
  schools.forEach((s) => sessionsForSchool(s).forEach(add));
  programs.forEach((p) => sessionsForProgram(p).forEach(add));
  events.sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999") || (a.time || "99").localeCompare(b.time || "99"));
  return { schools, programs, events };
}

function planTexts() {
  const { programs } = collect();
  const t = T();
  const out = [];
  if (programs.some((p) => p.board === "peel")) out.push(t.applyPeel);
  if (programs.some((p) => p.board === "dpcdsb")) out.push(t.applyDp);
  programs.forEach((p) => { const k = PROGRAM_INFO[p.id]?.keyDates; if (k) out.push(`${Lx(p.name)}: ${Lx(k)}`); });
  return out;
}

function renderPanel() {
  const t = T();
  const u = UI[langOf()];
  const { schools, programs, events } = collect();
  const empty = !schools.length && !programs.length;
  const chip = (s) => `<li class="ml-item"><span>${esc(s.name)} <span class="muted small">${esc(Lx(BOARDS[s.board]))}${s.fraser ? ` · ${u.fraserLabel} ${s.fraser.score.toFixed(1)}` : ""}</span></span>
      <span class="ml-actions"><button type="button" class="viewlink" data-school="${s.id}">${esc(u.detail.profile)}</button>${starBtn("school", s.id)}</span></li>`;
  const pchip = (p) => `<li class="ml-item"><span>${TAG_ICON[p.tag] || ""} ${esc(Lx(p.name))} <span class="muted small">${esc(Lx(BOARDS[p.board]))}</span></span>
      <span class="ml-actions"><button type="button" class="viewlink" data-program="${p.id}">${esc(u.sess.pd.details)}</button>${starBtn("program", p.id)}</span></li>`;
  dlg.innerHTML = `<div class="dhead"><div class="mono" aria-hidden="true">⭐</div>
      <div class="dtitle"><h2>${esc(t.h)}</h2><p class="small muted">${esc(t.local)}</p></div>
      <button type="button" class="dclose" data-ml="close" aria-label="${esc(u.detail.close)}">✕</button></div>
    <div class="dbody">
      ${empty ? `<p class="empty">${esc(t.empty)}</p>` : `
      ${schools.length ? `<section class="dsec"><h3>${esc(t.schools)}</h3><ul class="ml-list">${schools.map(chip).join("")}</ul></section>` : ""}
      ${programs.length ? `<section class="dsec"><h3>${esc(t.programs)}</h3><ul class="ml-list">${programs.map(pchip).join("")}</ul></section>` : ""}
      <section class="dsec"><h3>${esc(t.planH)}</h3>
        ${planTexts().map((x) => `<p class="small">• ${esc(x)}</p>`).join("")}
        ${events.length ? events.map((e) => renderSessionRow(e, { showSchool: true })).join("") : `<p class="muted small">${esc(t.noSessions)}</p>`}
        <p class="small muted">${esc(u.sess.calNote)}</p></section>`}
    </div>
    <div class="dfoot">${empty ? "" : `
      <button type="button" class="btn" data-ml="ics">📅 ${esc(t.icsAll)}</button>
      <button type="button" class="btn" data-ml="pdf">⬇ ${esc(t.pdf)}</button>
      <button type="button" class="btn" data-ml="copy">${esc(t.copy)}</button>
      <button type="button" class="btn" data-ml="clear">${esc(t.clear)}</button>`}
      <span class="small muted" role="status" aria-live="polite" id="ml-msg"></span></div>`;
}

/* ---------------- exports ---------------- */
function plainText() {
  const t = T();
  const u = UI[langOf()];
  const { schools, programs, events } = collect();
  const L = [t.h, ""];
  if (schools.length) { L.push(t.schools + ":"); schools.forEach((s) => L.push(`- ${s.name} (${Lx(BOARDS[s.board])})${s.fraser ? ` · ${u.fraserLabel} ${s.fraser.score.toFixed(1)}` : ""}`)); L.push(""); }
  if (programs.length) { L.push(t.programs + ":"); programs.forEach((p) => L.push(`- ${Lx(p.name)} (${Lx(BOARDS[p.board])}) · ${p.hosts.map((h) => h.n).join(", ")}`)); L.push(""); }
  const plan = planTexts(); if (plan.length) { L.push(t.planH + ":"); plan.forEach((x) => L.push("- " + x)); L.push(""); }
  events.forEach((e) => L.push(`- ${e.date ? fmtDate(e.date, langOf()) : u.sess.tbc}${eventTime(e, langOf()) ? " " + eventTime(e, langOf()) : ""}: ${e.school}`));
  L.push("", "https://hs-mississauga-navigator.vercel.app/");
  return L.join("\n");
}

function downloadBlob(name, type, data) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([data], { type }));
  a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

function downloadAllIcs() {
  const { events } = collect();
  const S = UI[langOf()].sess;
  const evs = events.filter((e) => e.date);
  const one = (e) => {
    const program = e.programId ? PROGRAMS.find((p) => p.id === e.programId) : null;
    const title = e.kind === "program" && program ? `${S.kindProgram}: ${Lx(program.name)} – ${e.school}` : `${S.forSchool}: ${e.school}`;
    const block = icsFor(e, title, S.calNote).split("\r\n");
    return block.slice(block.indexOf("BEGIN:VEVENT"), block.indexOf("END:VEVENT") + 1).join("\r\n");
  };
  const cal = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Highschool Navigator//EN", "CALSCALE:GREGORIAN", ...evs.map(one), "END:VCALENDAR"].join("\r\n");
  downloadBlob("my-list-dates.ics", "text/calendar;charset=utf-8", cal);
}

function loadJsPdf() {
  if (window.jspdf) return Promise.resolve(window.jspdf.jsPDF);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "assets/vendor/jspdf.umd.min.js";
    s.onload = () => resolve(window.jspdf.jsPDF);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function downloadPdf() {
  const JsPDF = await loadJsPdf();
  const doc = new JsPDF({ unit: "mm", format: "letter" });
  const W = 216, M = 16, CW = W - M * 2, H = 279;
  let y = 20;
  const teal = [109, 61, 242], muted = [86, 90, 120], ink = [21, 18, 43];
  const ensure = (h) => { if (y + h > H - 16) { doc.addPage(); y = 18; } };
  const write = (text, { size = 10.5, bold = false, color = ink, gap = 1.2, indent = 0 } = {}) => {
    doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(size); doc.setTextColor(...color);
    doc.splitTextToSize(String(text), CW - indent).forEach((ln) => { ensure(size * 0.42 + 1); doc.text(ln, M + indent, y); y += size * 0.42 + 0.9; });
    y += gap;
  };
  const t = T(), u = UI[langOf()];
  const { schools, programs, events } = collect();
  doc.setFillColor(...teal); doc.rect(0, 0, W, 26, "F");
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text(t.h, M, 16);
  y = 38;
  if (schools.length) { write(t.schools, { size: 13, bold: true, color: teal }); schools.forEach((s) => { write(`${s.name}  -  ${Lx(BOARDS[s.board])}${s.fraser ? `  -  ${u.fraserLabel} ${s.fraser.score.toFixed(1)}` : ""}`, { bold: true, gap: 0.3 }); if (s.progs.length) write(s.progs.map((p) => Lx(TAGS[p.k])).join(", "), { size: 9.5, color: muted, gap: 2 }); }); }
  if (programs.length) { y += 2; write(t.programs, { size: 13, bold: true, color: teal }); programs.forEach((p) => { write(Lx(p.name), { bold: true, gap: 0.3 }); write(p.hosts.map((h) => h.n).join(", "), { size: 9.5, color: muted, gap: 2 }); }); }
  const plan = planTexts();
  if (plan.length) { y += 2; write(t.planH, { size: 13, bold: true, color: teal }); plan.forEach((x) => write("- " + x, { size: 10 })); }
  if (events.length) { y += 2; write(u.sess.h, { size: 13, bold: true, color: teal }); events.forEach((e) => write(`${e.date ? fmtDate(e.date, langOf()) : u.sess.tbc}${eventTime(e, langOf()) ? "  " + eventTime(e, langOf()) : ""}  -  ${e.school}`, { size: 10, gap: 0.6 })); }
  y += 4; write(`${u.disclaimer}`, { size: 8.5, color: muted });
  doc.save("my-list.pdf");
}

/* ---------------- init ---------------- */
function ensureDialog() {
  if (dlg) return;
  dlg = document.createElement("dialog");
  dlg.className = "sdlg board-dpcdsb";
  dlg.setAttribute("aria-label", "My list");
  document.body.appendChild(dlg);
  dlg.addEventListener("click", async (e) => {
    if (e.target === dlg || e.target.closest('[data-ml="close"]')) return dlg.close();
    const a = e.target.closest("[data-ml]")?.dataset.ml;
    const msg = () => dlg.querySelector("#ml-msg");
    if (a === "ics") downloadAllIcs();
    if (a === "pdf") { try { await downloadPdf(); } catch { msg().textContent = "PDF error"; } }
    if (a === "copy") { try { await navigator.clipboard.writeText(plainText()); msg().textContent = T().copied; } catch { /* clipboard unavailable */ } }
    if (a === "clear") { write({ schools: [], programs: [] }); refresh(); renderPanel(); }
    // Opening a profile from the list: close the list first so the two modals never stack.
    if (e.target.closest("[data-school], [data-program]")) dlg.close();
  });
}

export function openMyList() { ensureDialog(); renderPanel(); if (!dlg.open) dlg.showModal(); }

export function initMyList(options = {}) {
  ctx = { ...ctx, ...options };
  document.addEventListener("click", (e) => {
    const s = e.target.closest("[data-star]");
    if (s) { e.preventDefault(); e.stopPropagation(); toggle(s.dataset.starType, s.dataset.star); return; }
    if (e.target.closest("#list-btn")) openMyList();
  }, true); // capture: a star inside a clickable card must not open the card
  window.addEventListener("storage", refresh);
  refresh();
}
