// High-contrast option for accessibility. The choice is kept on this device (localStorage "contrast");
// until the person chooses, the device setting (prefers-contrast: more) decides.
const KEY = "contrast";
const COFFEE = { es: "Invítanos un café", en: "Buy us a coffee", fr: "Offrez-nous un café" };
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};
const L = {
  es: { on: "Alto contraste: activado", off: "Alto contraste: desactivado" },
  en: { on: "High contrast: on", off: "High contrast: off" },
  fr: { on: "Contraste élevé : activé", off: "Contraste élevé : désactivé" },
};

const isHigh = () => document.documentElement.getAttribute("data-contrast") === "high";

function apply(high) {
  if (high) document.documentElement.setAttribute("data-contrast", "high"); else document.documentElement.removeAttribute("data-contrast");
  document.querySelectorAll("[data-contrast-toggle]").forEach((x) => x.setAttribute("aria-pressed", String(high)));
  const b = document.getElementById("contrast-btn");
  if (!b) return;
  const t = L[(document.documentElement.lang || "en").slice(0, 2)] || L.en;
  b.setAttribute("aria-pressed", String(high));
  b.setAttribute("aria-label", high ? t.on : t.off);
  b.title = high ? t.on : t.off;
}

const saved = store.get(KEY);
apply(saved ? saved === "high" : matchMedia("(prefers-contrast: more)").matches);
matchMedia("(prefers-contrast: more)").addEventListener?.("change", (e) => { if (!store.get(KEY)) apply(e.matches); });

document.addEventListener("click", (e) => {
  if (!e.target.closest("#contrast-btn, [data-contrast-toggle]")) return;
  const next = !isHigh();
  store.set(KEY, next ? "high" : "normal");
  apply(next);
});
// The language can change after load: keep the button label in the page language.
const labelCoffee = () => { const c = document.getElementById("coffee-link"); if (!c) return; const l = COFFEE[(document.documentElement.lang || "en").slice(0, 2)] || COFFEE.en; c.setAttribute("aria-label", l); c.title = l; };
labelCoffee();
new MutationObserver(() => { apply(isHigh()); labelCoffee(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
