// Mobile navigation: the bottom bar, the "More" sheet that lists every section, the active-section highlight
// and the back-to-top button. Plain DOM, no dependencies.
const x = (es, en, fr) => ({ es, en, fr });

// Every section of the page, in reading order. `bar` marks the ones that also sit in the bottom bar.
export const SECTIONS = [
  { id: "escuelas", icon: "🏫", l: x("Escuelas", "Schools", "Écoles") },
  { id: "mapa", icon: "🗺️", l: x("Mapa", "Map", "Carte") },
  { id: "materias", icon: "📚", l: x("Materias", "Courses", "Cours") },
  { id: "comparar", icon: "⚖️", l: x("Comparar", "Compare", "Comparer") },
  { id: "regionales", icon: "🎯", l: x("Programas", "Programs", "Programmes") },
  { id: "aplicar", icon: "📝", l: x("Cómo aplicar", "How to apply", "Postuler") },
  { id: "charlas", icon: "🎤", l: x("Charlas", "Info sessions", "Séances d'info") },
  { id: "fechas", icon: "📅", l: x("Fechas", "Key dates", "Dates clés") },
  { id: "capas", icon: "🧭", l: x("Cómo funciona", "How it works", "Comment ça marche") },
  { id: "grados", icon: "🪜", l: x("Por grado", "Grade by grade", "Année par année") },
  { id: "siglas", icon: "🔤", l: x("Glosario", "Glossary", "Glossaire") },
  { id: "preguntas", icon: "❓", l: x("Preguntas", "Questions", "Questions") },
];
const MORE = x("Más", "More", "Plus");
const MENU = x("Todas las secciones", "All sections", "Toutes les sections");
const CLOSE = x("Cerrar", "Close", "Fermer");
const TOP = x("Volver arriba", "Back to top", "Haut de page");
const QUIZ = x("Encuentra tu opción", "Find your fit", "Trouve ton école");
const PRIVACY = x("Privacidad", "Privacy", "Confidentialité");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sec = (id) => SECTIONS.find((s) => s.id === id);

/** Bottom bar: Schools, Programs, the questionnaire (highlighted), Dates and "More" (everything else). */
export function bottomBarHtml(lang, quizHref) {
  const l = (id) => esc(sec(id).l[lang] || sec(id).l.en);
  const a = (id) => `<a href="#${id}" data-sec="${id}"><span aria-hidden="true">${sec(id).icon}</span>${l(id)}</a>`;
  return a("escuelas") + a("regionales") +
    `<a href="${quizHref}" class="hot"><span aria-hidden="true">✨</span>${esc(QUIZ[lang] || QUIZ.en)}</a>` + a("fechas") +
    `<button type="button" data-more aria-haspopup="dialog" aria-expanded="false"><span aria-hidden="true">☰</span>${esc(MORE[lang] || MORE.en)}</button>`;
}

let sheet = null;
let opener = null;

export function closeSheet() {
  if (!sheet) return;
  sheet.remove(); sheet = null;
  document.documentElement.classList.remove("sheet-open");
  if (opener) { opener.setAttribute("aria-expanded", "false"); opener.focus?.(); }
}

export function openSheet(lang, { quizHref, game }, trigger) {
  closeSheet();
  opener = trigger || null;
  trigger?.setAttribute("aria-expanded", "true");
  const tile = (s) => `<a href="#${s.id}" data-sec="${s.id}" class="mtile"><span aria-hidden="true">${s.icon}</span>${esc(s.l[lang] || s.l.en)}</a>`;
  sheet = document.createElement("div");
  sheet.className = "msheet";
  sheet.innerHTML = `<div class="mback" data-close></div>
    <div class="mpanel" role="dialog" aria-modal="true" aria-label="${esc(MENU[lang] || MENU.en)}">
      <div class="mhead"><b>${esc(MENU[lang] || MENU.en)}</b><button type="button" class="mclose" data-close aria-label="${esc(CLOSE[lang] || CLOSE.en)}">×</button></div>
      <div class="mgrid">${SECTIONS.map(tile).join("")}
        <a href="${quizHref}" class="mtile hot"><span aria-hidden="true">✨</span>${esc(QUIZ[lang] || QUIZ.en)}</a>
        ${game ? `<a href="#descanso" class="mtile"><span aria-hidden="true">🎮</span>${esc(game)}</a>` : ""}
      </div>
      <p class="mfoot"><a href="/privacy?lang=${lang}">${esc(PRIVACY[lang] || PRIVACY.en)}</a></p></div>`;
  document.body.appendChild(sheet);
  document.documentElement.classList.add("sheet-open");
  sheet.addEventListener("click", (e) => { if (e.target.closest("[data-close]") || e.target.closest("a[href]")) closeSheet(); });
  sheet.querySelector(".mclose").focus();
  markActive();
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });

/* ---------- active section highlight ---------- */

let current = "";
function markActive() {
  document.querySelectorAll("[data-sec]").forEach((el) => {
    const on = el.dataset.sec === current;
    el.classList.toggle("on", on);
    if (on) el.setAttribute("aria-current", "location"); else el.removeAttribute("aria-current");
  });
}
let io = null;
/** Call after every render: watches the section elements and keeps the bar and the sheet in sync. */
export function watchSections() {
  io?.disconnect();
  io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { current = e.target.id; markActive(); }
  }, { rootMargin: "-35% 0px -55% 0px" });
  SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
  markActive();
}

/* ---------- back to top ---------- */

export function initBackToTop(getLang) {
  if (document.getElementById("totop")) return;
  const b = document.createElement("button");
  b.id = "totop"; b.type = "button"; b.className = "totop"; b.hidden = true;
  b.innerHTML = `<span aria-hidden="true">↑</span>`;
  document.body.appendChild(b);
  b.onclick = () => scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  let last = scrollY, ticking = false;
  const update = () => {
    ticking = false;
    const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    const past = scrollY / max > 0.3;
    const up = scrollY < last - 4;
    const down = scrollY > last + 4;
    if (!past) b.classList.remove("show");
    else if (up) b.classList.add("show");
    else if (down) b.classList.remove("show"); // out of the way while reading downwards
    b.hidden = !past && !b.classList.contains("show");
    b.setAttribute("aria-label", TOP[getLang()] || TOP.en);
    if (Math.abs(scrollY - last) > 4) last = scrollY;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
}
