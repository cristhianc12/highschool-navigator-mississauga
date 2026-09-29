// Service worker: makes the site installable and usable offline after the first visit.
// Strategy: network-first for pages, scripts and styles (so updates always arrive), cache-first for
// fonts, images and vendor files. It never touches /api/ or /_vercel/ and stores nothing personal.
// Bump VERSION when the list of files changes.
const VERSION = "v6";
const CACHE = `hs-navigator-${VERSION}`;
const CORE = [
  "/", "/quiz", "/privacy", "/manifest.webmanifest",
  "/css/styles.css", "/css/quiz.css",
  "/js/app.js", "/js/content.js", "/js/sessions.js", "/js/program-info.js", "/js/school-detail.js", "/js/mylist.js",
  "/js/explainer.js", "/js/map.js", "/js/map-data.js", "/js/quiz.js", "/js/quiz-content.js", "/js/privacy.js", "/js/privacy-content.js", "/js/game.js",
  "/js/school-geo.js", "/js/school-extras.js", "/js/admissions.js", "/js/course-finder.js", "/assets/vendor/leaflet/leaflet.css", "/assets/vendor/leaflet/leaflet.js",
  "/assets/fonts/bricolage-latin.woff2", "/assets/fonts/figtree-latin.woff2", "/assets/favicon.svg", "/assets/icon-192.png", "/assets/icon-512.png",
  "/assets/vendor/jspdf.umd.min.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(CORE.map((u) => c.add(new Request(u, { cache: "reload" })).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("hs-navigator-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

const isDynamic = (req, url) => req.mode === "navigate" || /\.(js|css|html|webmanifest)$/.test(url.pathname) || url.pathname === "/";

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_vercel/")) return;

  if (isDynamic(req, url)) {
    // network first, fall back to the cache when offline
    e.respondWith(
      fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req).then((hit) => hit || caches.match("/")))
    );
    return;
  }
  // cache first for static assets
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  })));
});
