// Voluntary support link ("buy us a coffee"). Set SUPPORT_URL to the donation page (Ko-fi, Buy Me a Coffee,
// GitHub Sponsors...). While it is empty nothing is shown. It is a plain link: no scripts, no widgets.
export const SUPPORT_URL = "https://buymeacoffee.com/cristhianc10";

const T = {
  es: { p: "Gratis para la comunidad, sin anuncios. Si te sirvió, puedes", a: "invitarnos un café ☕" },
  en: { p: "Free for the community, no ads. If it helped your family, you can", a: "buy us a coffee ☕" },
  fr: { p: "Gratuit pour la communauté, sans publicité. Si ça a aidé ta famille, tu peux", a: "nous offrir un café ☕" },
};

export const supportHtml = (lang) => {
  if (!SUPPORT_URL) return "";
  const t = T[lang] || T.en;
  return `<span class="support">${t.p} <a href="${SUPPORT_URL}" target="_blank" rel="noopener" data-support>${t.a}</a></span>`;
};

/* A quiet card that closes the page, and a one-time small pill once someone has clearly been using the site.
   Neither blocks anything; the pill can be closed and then stays away for 30 days. */
const CARD = {
  es: { h: "¿Te sirvió esta guía?", p: "Es gratis, sin anuncios ni cuentas, y la mantiene una familia del GTA. Si quieres, puedes invitarnos un café; ayuda a pagar el hosting y a mantener los datos al día.", a: "Invitar un café ☕", n: "Es totalmente opcional." },
  en: { h: "Did this guide help?", p: "It is free, with no ads or accounts, and kept up by a GTA family. If you like, you can buy us a coffee; it helps cover hosting and keeps the data fresh.", a: "Buy us a coffee ☕", n: "Completely optional." },
  fr: { h: "Ce guide t'a aidé?", p: "Il est gratuit, sans publicité ni compte, et entretenu par une famille de la RGT. Si tu veux, offre-nous un café : ça aide à payer l'hébergement et à garder les données à jour.", a: "Offrir un café ☕", n: "Entièrement facultatif." },
};
const PILL = { es: "¿Te está sirviendo? Invítanos un café ☕", en: "Finding this useful? Buy us a coffee ☕", fr: "Ça t'est utile? Offre-nous un café ☕" };
const CLOSE = { es: "Cerrar", en: "Close", fr: "Fermer" };

export const supportCard = (lang) => {
  if (!SUPPORT_URL) return "";
  const c = CARD[lang] || CARD.en;
  return `<aside class="supportcard"><span class="sc-cup" aria-hidden="true">☕</span><div class="sc-txt"><h3>${c.h}</h3><p>${c.p}</p></div><div class="sc-act"><a class="cta" href="${SUPPORT_URL}" target="_blank" rel="noopener" data-support>${c.a}</a><small>${c.n}</small></div></aside>`;
};

const KEY = "hsCoffeeSeen";
const mem = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } } };

export function initSupportNudge(getLang) {
  if (!SUPPORT_URL || document.getElementById("coffee-pill")) return;
  const seen = Number(mem.get(KEY) || 0);
  if (seen && Date.now() - seen < 30 * 864e5) return;
  const t0 = Date.now();
  const show = () => {
    removeEventListener("scroll", check);
    const lang = getLang();
    const el = document.createElement("div");
    el.id = "coffee-pill"; el.className = "coffee-pill"; el.setAttribute("role", "status");
    el.innerHTML = `<a href="${SUPPORT_URL}" target="_blank" rel="noopener" data-support>${PILL[lang] || PILL.en}</a><button type="button" aria-label="${CLOSE[lang] || CLOSE.en}">×</button>`;
    el.querySelector("button").onclick = () => { mem.set(KEY, String(Date.now())); el.remove(); };
    el.querySelector("a").addEventListener("click", () => mem.set(KEY, String(Date.now())));
    document.body.appendChild(el);
    setTimeout(() => { if (el.isConnected) { mem.set(KEY, String(Date.now())); el.classList.add("out"); setTimeout(() => el.remove(), 600); } }, 30000);
  };
  const check = () => {
    const h = document.documentElement;
    const pct = (scrollY + innerHeight) / Math.max(h.scrollHeight, 1);
    if (pct > 0.3 && Date.now() - t0 > 12000) show();
  };
  addEventListener("scroll", check, { passive: true });
}
