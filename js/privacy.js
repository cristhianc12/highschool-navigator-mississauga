import { LANGS } from "./content.js";
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
  const n = (navigator.language || "es").toLowerCase();
  return n.startsWith("fr") ? "fr" : n.startsWith("en") ? "en" : "es";
})();

function render() {
  const p = PRIV[lang];
  document.documentElement.lang = p.htmlLang;
  document.title = p.title;
  $("#back-link").textContent = p.back;
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
    <p><a href="${CONTACT_URL}" target="_blank" rel="noopener">${esc(p.contact)}</a></p>
    <p class="muted small">${esc(p.note)}</p>`;
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-lang]");
  if (b && b.dataset.lang !== lang) { lang = b.dataset.lang; store.set("lang", lang); render(); }
});
$("#theme-btn").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") ||
    (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  store.set("theme", next);
});
render();
