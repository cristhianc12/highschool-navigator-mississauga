import "./pwa.js";
import { trackingOff, setTrackingOff, autoOff } from "./track.js";
import { LANGS, madeWith } from "./content.js";
import { PRIV, CONTACT_URL, UPDATED } from "./privacy-content.js";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

let lang = (() => {
  const q = new URLSearchParams(location.search).get("lang");
  if (LANGS.includes(q)) return q;
  const s = store.get("lang");
  if (LANGS.includes(s)) return s;
  // Device language (es / fr / en); anything else falls back to English.
  const nav = (navigator.language || "en").toLowerCase();
  return nav.startsWith("fr") ? "fr" : nav.startsWith("es") ? "es" : "en";
})();

function statsSection(st) {
  const auto = autoOff();
  const off = trackingOff();
  return `<section class="ps" id="stats"><h2>${esc(st.h)}</h2>
    ${st.p.map((x) => `<p>${esc(x)}</p>`).join("")}<ul>${st.ul.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <p class="small muted">${esc(st.small)}</p>
    <p><span role="status" aria-live="polite" id="stats-state">${esc(auto ? st.state.auto : off ? st.state.off : st.state.on)}</span></p>
    ${auto ? "" : `<p><button type="button" class="btn" id="stats-toggle">${esc(off ? st.on : st.off)}</button></p>`}</section>`;
}

document.addEventListener("click", (e) => {
  if (!e.target.closest("#stats-toggle")) return;
  setTrackingOff(!trackingOff());
  render();
  document.querySelector("#stats-toggle")?.focus();
});

function render() {
  const p = PRIV[lang];
  document.documentElement.lang = p.htmlLang;
  document.title = p.title;
  $("#back-link").textContent = p.back;
  $("#made").innerHTML = madeWith(lang);
  $("#back-link").href = `./?lang=${lang}`;
  document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  const locale = { es: "es-CO", en: "en-CA", fr: "fr-CA" }[lang];
  const date = new Date(UPDATED + "T12:00:00").toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  $("#app").innerHTML = `
    <h1>${esc(p.h1)}</h1>
    <p class="muted small">${esc(p.updated)}: ${esc(date)}</p>
    <p class="tldr">${esc(p.tldr)}</p>
    ${p.sections.map((s) => `<section class="ps"><h2>${esc(s.h)}</h2>
      ${(s.p || []).map((x) => `<p>${esc(x)}</p>`).join("")}
      ${s.ul ? `<ul>${s.ul.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</section>`).join("")}
    ${statsSection(p.stats)}
    <p><a href="${CONTACT_URL}" target="_blank" rel="noopener">${esc(p.contact)}</a></p>
    <p class="muted small">${esc(p.note)}</p>`;
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-lang]");
  if (b && b.dataset.lang !== lang) { lang = b.dataset.lang; store.set("lang", lang); render(); }
});
$("#theme-btn").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  store.set("theme", next);
});
render();
