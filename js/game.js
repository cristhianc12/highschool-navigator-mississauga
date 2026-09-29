// "67 Runner": a tiny endless runner (Chrome-dino style) for the Teen tone. No libraries, no network,
// no data collected. The best score stays in this device's localStorage. Loaded lazily when opened.
//
// Keyboard: Space / Arrow Up to jump, Enter to start or restart. Touch/click on the canvas also jumps.
// With "reduce motion" enabled the game runs slower and without screen shake or flashes.

const HERO = "67"; // swap this constant to change the main character
const OBSTACLES = ["📚", "📝", "⏰", "🎒"];
const COINS = ["🌐", "🎓", "🎨", "🔬", "⚽", "🥐"]; // program icons
const BEST_KEY = "hs67best";

const store = {
  get() { try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; } },
  set(v) { try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* storage unavailable */ } },
};

export function mountGame(host, s) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  host.innerHTML = `
    <div class="game">
      <canvas tabindex="0" aria-label="${s.aria}"></canvas>
      <div class="game-bar">
        <span class="game-score" aria-hidden="true"></span>
        <button type="button" class="btn small" data-game="start">${s.start}</button>
      </div>
      <p class="small muted">${s.hint}${reduce ? " " + s.reduced : ""}</p>
      <p class="sr-only" role="status" aria-live="polite" data-game="live"></p>
    </div>`;
  const canvas = host.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = host.querySelector(".game-score");
  const startBtn = host.querySelector('[data-game="start"]');
  const live = host.querySelector('[data-game="live"]');

  const W = 640, H = 200, GROUND = 160;
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#888";
  let best = store.get();
  let raf = 0, last = 0, running = false, over = false;
  let hero, items, dist, coins, speed, spawnIn, flash, t0;

  const fit = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || W;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round((w * H / W) * dpr);
    ctx.setTransform(canvas.width / W, 0, 0, canvas.width / W, 0, 0);
  };
  const ro = new ResizeObserver(fit);
  ro.observe(canvas);

  const reset = () => {
    hero = { x: 60, y: GROUND, vy: 0, w: 46, h: 34, onGround: true };
    items = []; dist = 0; coins = 0; speed = reduce ? 200 : 260; spawnIn = 1.1; flash = 0; over = false; t0 = 0;
  };

  const jump = () => {
    if (!running) return;
    if (hero.onGround) { hero.vy = -560; hero.onGround = false; }
  };

  const score = () => Math.floor(dist / 12) + coins * 5;

  const spawn = () => {
    const coin = Math.random() < 0.28;
    const high = coin && Math.random() < 0.6;
    items.push({
      x: W + 20, coin,
      y: coin ? (high ? GROUND - 78 : GROUND - 26) : GROUND,
      w: coin ? 26 : 30, h: coin ? 26 : 34,
      g: coin ? COINS[(Math.random() * COINS.length) | 0] : OBSTACLES[(Math.random() * OBSTACLES.length) | 0],
    });
    spawnIn = (0.9 + Math.random() * 1.1) * (300 / speed) * 1.6;
  };

  const hit = (a, b) => a.x < b.x + b.w - 6 && a.x + a.w - 6 > b.x && a.y - a.h < b.y && a.y > b.y - b.h + 6;

  const update = (dt) => {
    dist += speed * dt;
    speed = Math.min((reduce ? 340 : 520), speed + (reduce ? 3 : 7) * dt * 10 / 10);
    hero.vy += 1500 * dt; hero.y += hero.vy * dt;
    if (hero.y >= GROUND) { hero.y = GROUND; hero.vy = 0; hero.onGround = true; }
    spawnIn -= dt; if (spawnIn <= 0) spawn();
    for (const it of items) it.x -= speed * dt;
    items = items.filter((it) => it.x > -50 && !it.taken);
    for (const it of items) {
      if (!hit(hero, it)) continue;
      if (it.coin) { it.taken = true; coins++; } else { end(); return; }
    }
    if (!flash && score() >= 67 && !hero.hit67) { hero.hit67 = true; flash = 1.2; live.textContent = s.sixtySeven; }
    if (flash > 0) flash -= dt;
  };

  const end = () => {
    running = false; over = true;
    const sc = score();
    if (sc > best) { best = sc; store.set(best); }
    live.textContent = `${s.over} ${sc}. ${s.best} ${best}.`;
    startBtn.textContent = s.again;
    startBtn.focus({ preventScroll: true });
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    // sky + ground line using the theme tokens
    ctx.fillStyle = css("--surface2");
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = css("--line"); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, GROUND + 4); ctx.lineTo(W, GROUND + 4); ctx.stroke();
    // moving dashes
    ctx.fillStyle = css("--line");
    for (let i = 0; i < 12; i++) ctx.fillRect(((i * 70 - dist * 0.6) % (W + 70) + W + 70) % (W + 70) - 20, GROUND + 14, 22, 3);

    // items
    ctx.font = "26px system-ui, 'Segoe UI Emoji', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    for (const it of items) ctx.fillText(it.g, it.x + it.w / 2, it.y);

    // hero: rounded tile with the number
    const bob = running && hero.onGround && !reduce ? Math.sin(dist / 18) * 1.5 : 0;
    const hx = hero.x, hy = hero.y - hero.h + bob;
    const g = ctx.createLinearGradient(hx, hy, hx + hero.w, hy + hero.h);
    g.addColorStop(0, css("--accent")); g.addColorStop(1, css("--pink"));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.roundRect(hx, hy, hero.w, hero.h, 10); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "800 22px 'Bricolage Grotesque', system-ui, sans-serif";
    ctx.fillText(HERO, hx + hero.w / 2, hy + hero.h - 9);

    // 67 banner (no flashing: a soft fade)
    if (flash > 0) {
      ctx.globalAlpha = Math.min(1, flash);
      ctx.fillStyle = css("--accent"); ctx.font = "800 34px 'Bricolage Grotesque', system-ui, sans-serif";
      ctx.fillText(s.sixtySeven, W / 2, 70);
      ctx.globalAlpha = 1;
    }
    if (!running) {
      ctx.fillStyle = css("--ink"); ctx.globalAlpha = 0.85; ctx.font = "700 20px 'Figtree', system-ui, sans-serif";
      ctx.fillText(over ? `${s.over} · ${score()}` : s.ready, W / 2, 92);
      ctx.globalAlpha = 1;
    }
    scoreEl.textContent = `${s.score} ${running || over ? score() : 0} · ${s.best} ${best}`;
  };

  const loop = (ts) => {
    if (!running) { draw(); return; }
    const dt = Math.min(0.033, ((ts - last) / 1000) || 0.016); last = ts;
    update(dt); draw();
    raf = requestAnimationFrame(loop);
  };

  const start = () => {
    cancelAnimationFrame(raf);
    reset(); running = true; last = performance.now();
    startBtn.textContent = s.restart; live.textContent = "";
    canvas.focus({ preventScroll: true });
    raf = requestAnimationFrame(loop);
  };

  startBtn.addEventListener("click", start);
  canvas.addEventListener("pointerdown", (e) => { e.preventDefault(); running ? jump() : start(); });
  canvas.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); running ? jump() : start(); }
    if (e.key === "Enter") { e.preventDefault(); start(); }
  });
  // Pause when the page is hidden so it never runs in the background.
  document.addEventListener("visibilitychange", () => { if (document.hidden && running) { running = false; cancelAnimationFrame(raf); live.textContent = s.paused; startBtn.textContent = s.start; over = false; } });

  reset(); fit(); draw();
  return { destroy() { cancelAnimationFrame(raf); ro.disconnect(); host.innerHTML = ""; } };
}
