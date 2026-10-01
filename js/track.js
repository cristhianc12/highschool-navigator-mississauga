// Privacy-first usage statistics. Counts only: no cookies, no IDs, no IP, no free text, no exact times.
// Every event is a name plus up to two short, enumerated labels; the server adds them to daily totals.
// It uses nothing that needs a browser permission: only what the page already knows (screen width,
// user-agent family, language) and ordinary clicks. It is OFF when the browser sends Do Not Track or
// Global Privacy Control, or when the person turned it off on the privacy page.
// What is counted is listed in privacy-content.js and in README.md: keep the three in sync.

const KEY_OFF = "hsNoTrack";
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* storage unavailable */ } },
};

export const trackingOff = () =>
  store.get(KEY_OFF) === "1" || navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;
export const setTrackingOff = (off) => (off ? store.set(KEY_OFF, "1") : store.del(KEY_OFF));
export const autoOff = () => navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;

/* ---------------- coarse environment (families only, never raw strings) ---------------- */

function env() {
  const ua = navigator.userAgent || "";
  const touch = matchMedia("(pointer:coarse)").matches;
  const w = Math.min(screen.width || innerWidth, innerWidth || screen.width);
  const os = /Android/i.test(ua) ? "android" : /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && touch) ? "ios" : /CrOS/i.test(ua) ? "chromeos" : /Windows/i.test(ua) ? "windows" : /Mac OS X|Macintosh/i.test(ua) ? "macos" : /Linux/i.test(ua) ? "linux" : "other";
  const browser = /SamsungBrowser/i.test(ua) ? "samsung" : /Edg\//i.test(ua) ? "edge" : /OPR\/|Opera/i.test(ua) ? "opera" : /Firefox|FxiOS/i.test(ua) ? "firefox" : /Chrome|CriOS/i.test(ua) ? "chrome" : /Safari/i.test(ua) ? "safari" : "other";
  const tablet = /iPad|Tablet/i.test(ua) || (os === "android" && !/Mobile/i.test(ua)) || (os === "ios" && Math.min(screen.width, screen.height) >= 700);
  const device = tablet ? "tablet" : touch && w < 820 ? "mobile" : "desktop";
  const vp = innerWidth < 480 ? "xs" : innerWidth < 768 ? "sm" : innerWidth < 1024 ? "md" : innerWidth < 1440 ? "lg" : "xl";
  return { lang: (document.documentElement.lang || "en").slice(0, 2).toLowerCase(), device, os, browser, vp };
}

function refClass() {
  let host = "";
  try { host = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : ""; } catch { /* ignore */ }
  if (!host || host === location.hostname) return "direct";
  if (/(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave|startpage|qwant)\./.test(host)) return "search";
  if (/(facebook|instagram|twitter|^t\.co|^x\.com|reddit|tiktok|whatsapp|linkedin|youtube|pinterest|telegram|snapchat)/.test(host)) return "social";
  if (/\.(on\.ca)$|dpcdsb|peelschools|tdsb|tcdsb|yrdsb|ycdsb|hdsb|hcdsb|ddsb|dcdsb|viamonde|monavenir|kprschools|pvnccdsb/.test(host)) return "school";
  if (/mail\.|outlook|gmail|yahoo\.com$/.test(host)) return "email";
  return "other";
}

/* ---------------- queue and sending ---------------- */

const queue = [];
let timer = null;
let sentVisit = false;
const dedupe = new Set(); // once-per-page-view events

function flush() {
  clearTimeout(timer); timer = null;
  if (!queue.length) return;
  const body = JSON.stringify({ v: 1, d: env(), e: queue.splice(0, 25) });
  try {
    if (!(navigator.sendBeacon && navigator.sendBeacon("/api/track", new Blob([body], { type: "text/plain" })))) {
      fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(() => {});
    }
  } catch { /* never break the page for statistics */ }
}

/** Counts one event. name: short event id; a, b: short enumerated labels (see api/track.js). */
export function track(name, a = "", b = "") {
  if (trackingOff() || navigator.webdriver) return;
  queue.push([name, String(a).slice(0, 48), String(b).slice(0, 48)]);
  if (queue.length >= 12) flush(); else if (!timer) timer = setTimeout(flush, 4000);
}
const once = (key, ...args) => { if (dedupe.has(key)) return; dedupe.add(key); track(...args); };

/* ---------------- page views, visits and engagement ---------------- */

const pageName = () => (/quiz/.test(location.pathname) ? "quiz" : /privacy/.test(location.pathname) ? "privacy" : "home");
const t0 = Date.now();
let maxScroll = 0;

function start() {
  if (trackingOff()) return;
  track("pv", pageName());
  let fresh = false;
  try { fresh = sessionStorage.getItem("hsV") !== "1"; sessionStorage.setItem("hsV", "1"); } catch { fresh = !sentVisit; }
  if (fresh && !sentVisit) {
    sentVisit = true;
    const mode = matchMedia("(display-mode: standalone)").matches || navigator.standalone ? "pwa" : "web";
    track("visit", refClass(), mode);
    let utm = "";
    try { utm = (new URLSearchParams(location.search).get("utm_source") || "").toLowerCase(); } catch { /* ignore */ }
    if (/^[a-z0-9_-]{1,24}$/.test(utm)) track("campaign", utm);
    track("env", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light", pageName() === "home" && localStorage.getItem("tone") === "teen" ? "teen" : "family");
  }
}

addEventListener("scroll", () => {
  const h = document.documentElement;
  const pct = ((scrollY + innerHeight) / Math.max(h.scrollHeight, 1)) * 100;
  if (pct > maxScroll) maxScroll = pct;
}, { passive: true });

function engage() {
  if (dedupe.has("engage")) return;
  dedupe.add("engage");
  const s = Math.round((Date.now() - t0) / 1000);
  const time = s < 10 ? "lt10s" : s < 60 ? "10-60s" : s < 300 ? "1-5m" : "gt5m";
  const depth = maxScroll >= 95 ? "100" : maxScroll >= 70 ? "75" : maxScroll >= 45 ? "50" : maxScroll >= 20 ? "25" : "0";
  track("engage", time, depth);
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") { engage(); flush(); dedupe.delete("engage"); } });
addEventListener("pagehide", () => { engage(); flush(); });

/* ---------------- clicks and choices (delegated, no changes needed in the page code) ---------------- */

const where = (el) =>
  el.closest("dialog") ? "profile" : el.closest("#map-host") ? "map" : el.closest("#cmp-out, #cmp-toggles") ? "compare" : el.closest("#sess-list") ? "sessions" :
  el.closest("#cf-out") ? "courses" : el.closest(".res") ? "quiz" : el.closest("#schools, #prog-dpcdsb, #prog-peel, #prog-other") ? "card" : "other";

const BOARD_HOSTS = /(dpcdsb|peelschools|tdsb|tcdsb|yrdsb|ycdsb|hdsb|hcdsb|ddsb|dcdsb|csviamonde|cscmonavenir|kprschools|pvnccdsb)\./;
function outboundKind(a, host) {
  if (/google\.[a-z.]+$/.test(host) && /maps/.test(a.href)) return "directions";
  if (a.hasAttribute("data-support")) return "support";
  if (/github\.com$/.test(host)) return "report";
  if (/fraserinstitute/.test(host)) return "fraser";
  if (/openstreetmap/.test(host)) return "osm";
  if (/teams\.microsoft|zoom|eventbrite/.test(host)) return "register";
  if (/\.pdf(\?|$)/i.test(a.href)) return "flyer";
  if (BOARD_HOSTS.test(host)) return /^www\./.test(host) ? "board" : "school";
  return "other";
}

document.addEventListener("click", (e) => {
  if (trackingOff()) return;
  const t = e.target;
  if (!(t instanceof Element)) return;
  const a = t.closest("a[href]");
  if (a) {
    let host = "";
    try { const u = new URL(a.href, location.href); if (u.origin !== location.origin) host = u.hostname.replace(/^www\./, ""); } catch { /* ignore */ }
    if (a.hasAttribute("data-support")) {
      const el = a.closest(".topbar") ? "topbar" : a.closest(".hero") ? "hero" : a.closest(".supportcard") ? "card" : a.closest(".coffee-pill") ? "pill" : a.closest(".foot") ? "footer" : pageName() === "quiz" ? "quiz" : "other";
      track("coffee", el);
    }
    if (host) { track("outbound", outboundKind(a, host), host.slice(0, 40)); return; }
  }
  const sc = t.closest("[data-school], [data-card]");
  if (sc && !t.closest("[data-cmp], .star")) { track("school_open", sc.dataset.school || sc.dataset.card, where(sc)); return; }
  const pr = t.closest("[data-program], [data-pcard]");
  if (pr) { track("program_open", pr.dataset.program || pr.dataset.pcard, where(pr)); return; }
  const star = t.closest(".star"); // state before the click toggles it
  if (star) return track("mylist", star.getAttribute("aria-pressed") === "true" ? "remove" : "add");
  const lang = t.closest("[data-lang]"); if (lang) return track("ui", "lang", lang.dataset.lang);
  const tone = t.closest("[data-tone]"); if (tone) return track("ui", "tone", tone.dataset.tone);
  if (t.closest("#theme-btn")) return track("ui", "theme");
  const vibe = t.closest("[data-vibe]"); if (vibe) return track("filter", "vibe", vibe.dataset.vibe);
  const map = t.closest("[data-map]"); if (map) return track("map", map.dataset.map);
  const lg = t.closest("[data-legend]"); if (lg) return track("map", "legend", lg.dataset.legend);
  const ml = t.closest("[data-ml]"); if (ml && ["ics", "pdf", "copy"].includes(ml.dataset.ml)) return track("mylist", "export_" + ml.dataset.ml);
  if (t.closest("[data-ics]")) return track("session", "ics");
  if (t.closest("#show-more, #sess-show-more")) return track("ui", "show_more");
  if (t.closest("#d-copy")) return track("ui", "share_link");
  if (t.closest(".quiz-cta a, a.cta[href^='quiz']")) return track("quiz", "cta");
  if (t.closest("#gamebox")) once("game", "game", "open");
}, true);

document.addEventListener("change", (e) => {
  if (trackingOff()) return;
  const t = e.target;
  if (!(t instanceof Element)) return;
  if (t.matches("[data-cmp]")) return track("compare", t.checked ? "add" : "remove");
  if (t.id === "cmp-add") return track("compare", "add");
  const f = t.id && t.id.match(/^f-(region|city|board|tag|sort)$/);
  if (f) return track("filter", f[1], t.value);
  const pfm = t.id && t.id.match(/^p-(board|region|tag|start|entry)$/);
  if (pfm) return track("filter", "prog_" + pfm[1], t.value);
  if (t.id === "cf-board") return once("finderboard", "courses", "finder");
  if (t.id === "s-area") return track("session", "area", t.value);
  if (t.id === "s-board") return track("session", "board", t.value);
  if (t.classList.contains("maparea")) return track("map", "region", t.value);
});

document.addEventListener("input", (e) => {
  if (trackingOff()) return;
  const id = e.target?.id;
  if (id === "f-q") once("search", "filter", "search");
  else if (id === "p-q") once("psearch", "filter", "prog_search");
  else if (id === "cf-q") once("finder", "courses", "finder");
  else if (e.target?.classList?.contains("mapsearch")) once("mapsearch", "map", "search");
});

window.addEventListener("appinstalled", () => track("ui", "pwa_installed"));
window.addEventListener("error", (e) => {
  const f = String(e.filename || "").split("/").pop().replace(/\?.*$/, "");
  if (/^[a-z-]+\.js$/.test(f)) once("err-" + f, "err", f);
});

/** Explicit hooks for flows that live inside one module (the questionnaire). */
export const trackQuiz = (step, detail = "") => track("quiz", step, detail);

start();
