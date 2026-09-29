// School map: a searchable list next to a real street map (Leaflet + OpenStreetMap tiles).
// Privacy: the street map is loaded only after the person clicks "Load the map" (or asked us to remember
// that choice), because their browser then requests tiles from OpenStreetMap. Until then the list works on
// its own and a decorative offline preview is shown. Marking "my home" happens on the device: the point is
// kept in memory only and is never stored or sent anywhere.
import { UI, SCHOOLS, BOARDS, TAG_ICON, TAGS } from "./content.js";
import { GEO } from "./school-geo.js";
import { MAP } from "./map-data.js";
import { inList, starBtn } from "./mylist.js";
import { openSchool } from "./school-detail.js";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const COLOR = { dpcdsb: "#6D3DF2", peel: "#0A7BB8", fr: "#C2287E" };
const CONSENT_KEY = "hsMapOk";
const CENTER = [43.5890, -79.6441];

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* storage unavailable */ } },
};

// Module state: survives re-renders of the page (filters change often).
const S = { host: null, lang: null, matchIds: null, q: "", home: null, picking: false, loaded: false, map: null, L: null, markers: new Map(), group: null, homeMarker: null, lastKey: "" };

// Fixed number per school (alphabetical), so a pin, its list row and its popup always match.
const NUM = new Map([...SCHOOLS].sort((a, b) => a.name.localeCompare(b.name)).map((s, i) => [s.id, i + 1]));
const LABEL_ZOOM = 13; // school names appear next to the pins from this zoom level
const t = () => UI[S.lang].map;

function km(a, b) {
  const R = 6371, rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]), dLon = rad(b[1] - a[1]);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
const distOf = (s) => (S.home && GEO[s.id] ? km(S.home, GEO[s.id]) : null);
const fmtKm = (d) => (d < 10 ? d.toFixed(1) : Math.round(d)).toString();

function visible() {
  let list = SCHOOLS.filter((s) => GEO[s.id] && (!S.matchIds || S.matchIds.includes(s.id)));
  if (S.q) list = list.filter((s) => norm(`${s.name} ${BOARDS[s.board][S.lang]}`).includes(norm(S.q)));
  return list.sort((a, b) => (S.home ? distOf(a) - distOf(b) : a.name.localeCompare(b.name)));
}

/* ---------------- layout ---------------- */
export function renderMap(host, { lang, matchIds }) {
  S.matchIds = matchIds;
  const fresh = S.host !== host || S.lang !== lang || !host.querySelector(".mapwrap");
  S.host = host; S.lang = lang;
  if (fresh) build();
  sync();
}

function build() {
  const m = t();
  if (S.map) { try { S.map.remove(); } catch { /* already gone */ } S.map = null; S.markers.clear(); S.group = null; S.homeMarker = null; S.lastKey = ""; }
  S.host.innerHTML = `
    <div class="mapwrap">
      <div class="mapside">
        <input type="search" class="mapsearch" placeholder="${esc(m.search)}" aria-label="${esc(m.search)}" value="${esc(S.q)}">
        <div class="maptools">
          <button type="button" class="btn small" data-map="home"></button>
          <button type="button" class="btn small" data-map="locate">🎯 ${esc(m.locate)}</button>
        </div>
        <p class="small muted" id="map-note"></p>
        <div class="mapcount small muted" aria-live="polite"></div>
        <ul class="maplist" aria-label="${esc(m.listAria)}"></ul>
      </div>
      <div class="mapmain"><div class="mapstage" id="map-stage" aria-label="${esc(m.aria)}"></div>
        <div class="mlegend" role="group" aria-label="${esc(m.legendH)}">
          ${["dpcdsb", "peel", "fr"].map((b) => `<span><i class="lgpin" style="background:${COLOR[b]}"></i>${esc(BOARDS[b][S.lang])}</span>`).join("")}
          <span><i class="lgpin mine"></i>⭐ ${esc(m.mine)}</span>
          <span><i class="lghome">🏠</i>${esc(m.legendHome)}</span>
          <span class="lgnum">${esc(m.legendNum)}</span>
        </div></div>
    </div>`;
  const stage = S.host.querySelector("#map-stage");
  if (S.loaded || store.get(CONSENT_KEY) === "1") loadMap(stage); else showGate(stage);
  bind();
}

function showGate(stage) {
  const m = t();
  const preview = `<svg class="gate-svg" viewBox="0 0 ${MAP.w} ${MAP.h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="${MAP.city}" class="mcity"/><path d="${MAP.city}" class="mcityline"/>${MAP.roads.map((r) => `<path class="mroad" d="${r.d}" style="stroke-width:4"/>`).join("")}</svg>`;
  stage.innerHTML = `${preview}<div class="mapgate"><h3>${esc(m.gateH)}</h3><p class="small">${esc(m.gateP)}</p>
    <label class="check small"><input type="checkbox" id="map-remember"> ${esc(m.remember)}</label>
    <button type="button" class="cta small" data-map="load">${esc(m.load)}</button></div>`;
}

/* ---------------- list ---------------- */
function updateList() {
  const m = t();
  const list = visible();
  S.host.querySelector(".mapcount").textContent = `${m.count(list.length)}${S.home ? " · " + m.sortedByDist : ""}`;
  S.host.querySelector(".maplist").innerHTML = list.length ? list.map((s) => {
    const d = distOf(s);
    return `<li class="mapitem" data-id="${s.id}">
      <button type="button" class="mi-main" data-focus="${s.id}"><span class="mi-num" style="background:${COLOR[s.board]}" aria-hidden="true">${NUM.get(s.id)}</span>
        <span class="mi-text"><b>${esc(s.name)}</b><small>${esc(BOARDS[s.board][S.lang])}${s.fraser ? " · " + s.fraser.score.toFixed(1) : ""}${d != null ? " · " + esc(m.dist(fmtKm(d))) : ""}</small></span></button>
      ${starBtn("school", s.id)}<button type="button" class="viewbtn" data-open="${s.id}">${esc(m.view)} →</button></li>`;
  }).join("") : `<li class="empty">${esc(m.none)}</li>`;
  const btn = S.host.querySelector('[data-map="home"]');
  btn.textContent = S.home ? `✖ ${m.homeClear}` : (S.picking ? `📍 ${m.homePick}` : `📍 ${m.home}`);
  S.host.querySelector("#map-note").textContent = S.picking ? m.homePick : (S.home ? m.homeNote : "");
}

/* ---------------- markers ---------------- */
function pinIcon(s) {
  const mine = inList("school", s.id);
  return S.L.divIcon({ className: "pinwrap", iconSize: [36, 36], iconAnchor: [18, 18], tooltipAnchor: [0, -18],
    html: `<span class="mappin ${mine ? "mine" : ""}" style="--pc:${COLOR[s.board]}">${NUM.get(s.id)}${mine ? '<i aria-hidden="true">⭐</i>' : ""}</span>` });
}

function popupHtml(s) {
  const m = t();
  const u = UI[S.lang];
  const d = distOf(s);
  const [lat, lon] = GEO[s.id];
  const progs = s.progs.slice(0, 4).map((p) => `<span class="chip">${TAG_ICON[p.k] || ""} ${esc(TAGS[p.k][S.lang])}</span>`).join("");
  return `<div class="spop"><h4><span class="popnum" style="background:${COLOR[s.board]}">${NUM.get(s.id)}</span> ${esc(s.name)}</h4>
    <p class="small">${esc(BOARDS[s.board][S.lang])}${s.fraser ? ` · ${esc(u.fraserLabel)} <b>${s.fraser.score.toFixed(1)}</b>${esc(u.fraserOf)}` : ""}</p>
    ${d != null ? `<p class="small">${esc(m.dist(fmtKm(d)))}</p>` : ""}
    ${progs ? `<div class="chips">${progs}</div>` : ""}
    <div class="sbtns"><button type="button" class="cta small" data-open="${s.id}">${esc(m.view)} →</button>
      <a class="btn small" href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}" target="_blank" rel="noopener">${esc(m.directions)} ↗</a>
      ${starBtn("school", s.id)}</div></div>`;
}

function updateMarkers() {
  if (!S.map) return;
  const L = S.L;
  const list = visible();
  const ids = new Set(list.map((s) => s.id));
  for (const [id, mk] of S.markers) if (!ids.has(id)) { mk.remove(); S.markers.delete(id); }
  const labels = S.map.getZoom() >= LABEL_ZOOM;
  for (const s of list) {
    let mk = S.markers.get(s.id);
    if (!mk) {
      mk = L.marker(GEO[s.id], { icon: pinIcon(s), title: s.name, alt: s.name, keyboard: true, riseOnHover: true }).addTo(S.map);
      mk.bindPopup(() => popupHtml(s), { maxWidth: 290, className: "schoolpop", autoPanPadding: [20, 20] });
      S.markers.set(s.id, mk);
    } else mk.setIcon(pinIcon(s));
    mk.unbindTooltip().bindTooltip(esc(s.name), { direction: "top", offset: [0, -4], permanent: labels, className: "pinlabel" });
  }
  // Fit the view only when the set of schools changes (not while typing in the search box).
  const key = [...ids].sort().join(",");
  if (key !== S.lastKey) {
    S.lastKey = key;
    if (list.length) {
      const b = L.latLngBounds(list.map((s) => GEO[s.id]));
      if (S.home) b.extend(S.home);
      S.map.fitBounds(b, { padding: [36, 36], maxZoom: 15 });
    }
  }
  updateHomeMarker();
}

function updateHomeMarker() {
  if (!S.map) return;
  if (S.homeMarker) { S.homeMarker.remove(); S.homeMarker = null; }
  if (!S.home) return;
  const L = S.L;
  S.homeMarker = L.marker(S.home, { draggable: true, title: t().myHome, alt: t().myHome, icon: L.divIcon({ className: "pinwrap", iconSize: [36, 36], iconAnchor: [18, 34], html: '<span class="homepin" aria-hidden="true">🏠</span>' }) }).addTo(S.map);
  S.homeMarker.bindTooltip(esc(t().myHome), { direction: "top", offset: [0, -30] });
  S.homeMarker.on("dragend", () => { const p = S.homeMarker.getLatLng(); S.home = [p.lat, p.lng]; updateList(); });
}

function sync() {
  updateList();
  updateMarkers();
}

/* ---------------- Leaflet ---------------- */
function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  return new Promise((resolve, reject) => {
    const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "assets/vendor/leaflet/leaflet.css"; document.head.appendChild(css);
    const s = document.createElement("script"); s.src = "assets/vendor/leaflet/leaflet.js";
    s.onload = () => resolve(window.L); s.onerror = reject; document.head.appendChild(s);
  });
}

async function loadMap(stage) {
  stage.innerHTML = `<div class="maploading small muted">…</div>`;
  try { S.L = await loadLeaflet(); } catch { showGate(stage); return; }
  if (!stage.isConnected) return;
  stage.innerHTML = "";
  const L = S.L;
  S.loaded = true;
  S.map = L.map(stage, { center: CENTER, zoom: 11, minZoom: 9, maxZoom: 18, scrollWheelZoom: false });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>' }).addTo(S.map);
  // The wheel zooms the map only after the map was clicked, so scrolling the page never gets trapped.
  S.map.on("click", () => S.map.scrollWheelZoom.enable());
  S.map.on("mouseout", () => S.map.scrollWheelZoom.disable());
  S.map.on("zoomend", updateMarkers);
  S.map.on("click", (e) => { if (S.picking) setHome([e.latlng.lat, e.latlng.lng]); });
  S.map.on("popupopen", (e) => {
    const el = e.popup.getElement();
    if (el._hs) return;
    el._hs = true;
    el.addEventListener("click", (ev) => { const b = ev.target.closest("[data-open]"); if (b) openSchool(b.dataset.open); });
  });
  updateMarkers();
  setTimeout(() => S.map && S.map.invalidateSize(), 60);
}

function setHome(p) {
  S.home = p; S.picking = false;
  if (S.map) S.map.getContainer().classList.remove("picking");
  S.lastKey = ""; // refit to include home
  sync();
}

/* ---------------- events ---------------- */
function bind() {
  const host = S.host;
  if (host._mapBound) return; // the host element survives re-builds: attach the listeners once
  host._mapBound = true;
  host.addEventListener("input", (e) => { if (e.target.classList.contains("mapsearch")) { S.q = e.target.value.trim(); sync(); } });
  host.addEventListener("click", (e) => {
    const a = e.target.closest("[data-map]")?.dataset.map;
    if (a === "load") {
      if (host.querySelector("#map-remember")?.checked) store.set(CONSENT_KEY, "1");
      loadMap(host.querySelector("#map-stage"));
    }
    if (a === "home") {
      if (S.home) { S.home = null; S.picking = false; sync(); return; }
      if (!S.map) { host.querySelector('[data-map="load"]')?.focus(); return; }
      S.picking = !S.picking; S.map.getContainer().classList.toggle("picking", S.picking); updateList();
    }
    if (a === "locate") {
      if (!navigator.geolocation) { host.querySelector("#map-note").textContent = t().geoErr; return; }
      navigator.geolocation.getCurrentPosition((pos) => setHome([pos.coords.latitude, pos.coords.longitude]), () => { host.querySelector("#map-note").textContent = t().geoErr; }, { timeout: 8000, maximumAge: 60000 });
    }
    const focus = e.target.closest("[data-focus]")?.dataset.focus;
    if (focus) {
      const mk = S.markers.get(focus);
      if (S.map && mk) { S.map.flyTo(GEO[focus], Math.max(S.map.getZoom(), 15), { duration: 0.6 }); setTimeout(() => mk.openPopup(), 650); host.querySelector(".mapstage").scrollIntoView({ block: "nearest", behavior: "smooth" }); }
      else openSchool(focus); // no map loaded: the list item opens the profile directly
    }
    const open = e.target.closest(".mapside [data-open]")?.dataset.open;
    if (open) openSchool(open);
  });
}

// Keep pins and list stars in sync with "My list".
window.addEventListener("mylist:change", () => { if (S.host?.isConnected) { updateMarkers(); } });
