/* =====================================================================
   viva.prep classroom decks: shared engine
   - 1600 x 900 stage, scaled to any screen
   - Next / Back walk through step builds first, then slides
   - typing terminals, kinetic headlines, counters, section wipes
   - soft synthesized sound (M to mute), confetti, break timer
   - teacher mode (type the unlock word) for notes and presenter window
   A deck page sets window.DECK = { id, title, sections: [...] } and
   may register scenes in window.DeckFX before this file loads.
   ===================================================================== */
(function () {
  "use strict";
  const CFG = window.DECK || {};
  const RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = document.getElementById("stage");
  const slides = Array.from(stage.querySelectorAll(".slide"));
  const SECS = CFG.sections || [];
  const UNLOCK = (CFG.unlock || "teach").toLowerCase();
  let cur = -1, stepN = 0, token = 0, wiping = false, scene = null;

  // ---------------------------------------------------------------- storage (can throw in private windows)
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  };

  // ---------------------------------------------------------------- speaker notes (encoded so they do not show as plain text)
  let NOTES = {};
  try {
    const blob = document.getElementById("deck-notes");
    if (blob) {
      const b64 = blob.textContent.trim().split("").reverse().join("");
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      NOTES = JSON.parse(new TextDecoder().decode(bytes));
    }
  } catch (e) { NOTES = {}; }
  slides.forEach((s, i) => { const a = s.querySelector("aside.notes"); if (a && !NOTES[i]) NOTES[i] = a.textContent.trim(); });
  let teacher = store.get("deck-teacher") === "1";
  document.body.classList.toggle("teacher", teacher);

  // ---------------------------------------------------------------- chrome
  function mk(tag, attrs, parent, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const progress = mk("div", { id: "progress" }, stage);
  const secmap = mk("div", { id: "secmap" }, stage, '<div class="trk"></div><div class="lbl"></div>');
  const wipe = mk("div", { id: "wipe" }, stage, '<div class="blob" style="width:620px;height:620px;right:-140px;top:-180px"></div><div class="blob" style="width:380px;height:380px;right:260px;bottom:-200px"></div><div class="wp"></div><div class="wn"></div><div class="wd"></div>');
  const toast = mk("div", { id: "toast" }, document.body);
  const blank = mk("div", { id: "blank" }, document.body);
  const hint = mk("div", { id: "hint" }, document.body, "Press <b>→</b> or click to move on &nbsp;·&nbsp; <b>?</b> for keys &nbsp;·&nbsp; <b>F</b> full screen");
  const help = mk("div", { id: "help" }, document.body, '<div class="box"><h3>Keys</h3>' +
    [["Next step / slide", "→  Space  click"], ["Back", "←  Backspace"], ["Jump to a slide", "number, then Enter"], ["All slides", "O"], ["Full screen", "F"], ["White screen", "B"], ["Replay this slide", "R"], ["Sound on / off", "M"]]
      .map((r) => `<div class="row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join("") +
    '<div class="row tm"><span>Speaker notes on this screen</span><b>N</b></div><div class="row tm"><span>Presenter window</span><b>P</b></div>' +
    '<div class="row"><span>Close</span><b>Esc</b></div></div>');
  const overview = mk("div", { id: "overview" }, document.body, '<h3>All slides</h3><div class="grid"></div>');
  const notesBox = mk("div", { id: "notesbox" }, document.body);
  const navbtns = mk("div", { id: "navbtns", class: "no-advance" }, document.body,
    '<a href="/present" title="All presentations">All decks</a><button data-n="o" title="All slides">☰</button><button data-n="p" title="Back">←</button><button data-n="n" title="Next">→</button>');
  navbtns.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    e.stopPropagation();
    if (b.dataset.n === "n") next(); else if (b.dataset.n === "p") prev(); else openOverview();
  });

  slides.forEach((s, i) => { if (!s.hasAttribute("data-nonum")) mk("div", { class: "num" }, s, `${i + 1} / ${slides.length}`); });
  document.querySelectorAll(".logos img").forEach((img) => { img.addEventListener("error", () => { img.style.display = "none"; }); });

  // ---------------------------------------------------------------- fit the stage to the window
  function fit() {
    const k = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    stage.style.transform = `translate(-50%, -50%) scale(${k})`;
  }
  window.addEventListener("resize", fit); fit();

  // ---------------------------------------------------------------- sound: tiny synthesized cues, no audio files
  const SFX = (() => {
    let ctx = null, on = store.get("deck-sound") !== "off";
    const ac = () => { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } } if (ctx && ctx.state === "suspended") ctx.resume(); return ctx; };
    function tone(f1, f2, dur, type, vol, delay) {
      const c = ac(); if (!c || !on) return;
      const t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
      o.type = type || "sine"; o.frequency.setValueAtTime(f1, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.08, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
    }
    function noise(dur, f1, f2, vol) {
      const c = ac(); if (!c || !on) return;
      const t = c.currentTime, n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / n);
      const src = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
      src.buffer = buf; fl.type = "bandpass"; fl.Q.value = 0.9; fl.frequency.setValueAtTime(f1, t); fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
      g.gain.value = vol || 0.12; src.connect(fl).connect(g).connect(c.destination); src.start(t);
    }
    return {
      unlock: ac,
      whoosh: () => noise(0.55, 300, 2600, 0.16),
      swish: () => noise(0.26, 900, 3200, 0.06),
      tick: () => tone(1800 + Math.random() * 400, null, 0.025, "square", 0.01),
      pop: () => tone(520, 1100, 0.12, "sine", 0.07),
      step: () => tone(660, 880, 0.08, "triangle", 0.035),
      chime: () => { tone(784, null, 0.35, "sine", 0.07); tone(1175, null, 0.5, "sine", 0.06, 0.12); tone(1568, null, 0.6, "sine", 0.04, 0.24); },
      error: () => tone(220, 160, 0.25, "sawtooth", 0.03),
      toggle() { on = !on; store.set("deck-sound", on ? "on" : "off"); if (on) this.pop(); return on; },
      get on() { return on; },
    };
  })();

  // ---------------------------------------------------------------- helpers for scenes
  function later(alive, ms, fn) { setTimeout(() => { if (alive()) fn(); }, RM ? Math.min(ms, 60) : ms); }
  function confetti(slide, opts) {
    if (RM) return;
    opts = opts || {};
    const cv = mk("canvas", { class: "fx", width: 1600, height: 900 }, slide), g = cv.getContext("2d");
    const cols = ["#FF4D2E", "#FF9E00", "#FFC21A", "#00A862", "#2563FF", "#7C3AED", "#FF2E88", "#00B2D6"];
    const P = [], x0 = opts.x || 800, y0 = opts.y || 560, n = opts.n || 180;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * (opts.spread || 2.2), v = 10 + Math.random() * 14;
      P.push({ x: x0 + (Math.random() - 0.5) * 80, y: y0, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3, w: 10 + Math.random() * 10, h: 6 + Math.random() * 8, c: cols[i % cols.length], s: Math.random() < 0.3 });
    }
    let f = 0;
    (function tick() {
      g.clearRect(0, 0, 1600, 900); f++;
      P.forEach((p) => {
        p.vy += 0.38; p.vx *= 0.99; p.vy *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.globalAlpha = Math.max(0, 1 - f / 200);
        if (p.s) { g.beginPath(); g.arc(0, 0, p.w / 2.4, 0, 6.28); g.fill(); } else g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 2);
        g.restore();
      });
      if (f < 200) requestAnimationFrame(tick); else cv.remove();
    })();
  }

  // ---------------------------------------------------------------- kinetic headlines
  function kinetic(root) {
    let n = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(" ")); return; }
            const sp = document.createElement("span"); sp.className = "kw"; sp.textContent = w; sp.style.setProperty("--i", n++); frag.appendChild(sp);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== "BR") {
          if (/^(SPAN|B|EM|I|STRONG|CODE)$/.test(c.tagName) && !c.querySelector("br")) { c.classList.add("kw"); c.style.setProperty("--i", n++); }
          else walk(c);
        }
      });
    };
    walk(root); root.classList.add("kin");
  }
  stage.querySelectorAll(".slide .hl, .slide .kin-me").forEach(kinetic);

  // ---------------------------------------------------------------- counters
  function runCounters(s, alive) {
    s.querySelectorAll("[data-count]").forEach((el) => {
      const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), pre = el.dataset.pre || "", suf = el.dataset.suf || "", sep = el.dataset.sep;
      const fmt = (v) => { let t = v.toFixed(dec); if (sep) t = t.replace(/\B(?=(\d{3})+(?!\d))/g, ","); return pre + t + suf; };
      el.textContent = fmt(0);
      later(alive, +(el.dataset.delay || 300), () => {
        const t0 = performance.now(), dur = RM ? 1 : +(el.dataset.dur || 1600);
        (function f(t) { if (!alive()) return; const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = fmt(to * e); if (k < 1) requestAnimationFrame(f); })(t0);
      });
    });
  }

  // ---------------------------------------------------------------- terminals
  // <div class="term" data-type>: lines .ln.cmd are typed, .ln.out appear; data-s="k" = appears on step k (default 0)
  stage.querySelectorAll(".term").forEach((t) => {
    t.querySelectorAll(".ln.cmd").forEach((l) => { if (!l.dataset.txt) l.dataset.txt = l.textContent; });
    if (!t.hasAttribute("data-nocopy") && t.querySelector(".ln.cmd")) {
      const b = mk("button", { class: "copy-btn no-advance", title: "Copy the commands" }, t, "Copy");
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const txt = Array.from(t.querySelectorAll(".ln.cmd")).map((l) => l.dataset.txt).join("\n");
        const done = () => { b.textContent = "Copied"; b.classList.add("done"); setTimeout(() => { b.textContent = "Copy"; b.classList.remove("done"); }, 1400); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, done); else done();
      });
    }
  });
  function showLineNow(l) { l.classList.add("shown"); if (l.classList.contains("cmd")) l.textContent = l.dataset.txt; }
  function playTerminalStep(s, k, alive, instant) {
    s.querySelectorAll(".term[data-type]").forEach((t) => {
      t.querySelectorAll(".ln").forEach((l) => { const ls = +(l.dataset.s || 0); if (ls > k) l.classList.remove("shown"); else if (ls < k || instant) showLineNow(l); });
      if (instant) return;
      const lines = Array.from(t.querySelectorAll(".ln")).filter((l) => +(l.dataset.s || 0) === k && !l.classList.contains("shown"));
      let delay = k === 0 ? +(t.dataset.delay || 700) : 200;
      lines.forEach((l) => {
        if (l.classList.contains("cmd")) {
          const txt = l.dataset.txt, speed = +(t.dataset.speed || 34);
          later(alive, delay, () => {
            l.classList.add("shown"); l.innerHTML = '<span class="typed"></span><span class="caret"></span>';
            const span = l.querySelector(".typed"); let i = 0;
            (function typeOne() {
              if (!alive()) return;
              if (!l.querySelector(".typed")) return; // shown instantly meanwhile
              if (i >= txt.length) { const c = l.querySelector(".caret"); if (c) c.remove(); return; }
              span.textContent += txt[i++]; if (i % 2) SFX.tick();
              setTimeout(typeOne, RM ? 0 : speed * (0.6 + Math.random() * 0.8));
            })();
          });
          delay += txt.length * speed + 420;
        } else {
          later(alive, delay, () => showLineNow(l));
          delay += +(l.dataset.gap || 110);
        }
      });
    });
  }

  // ---------------------------------------------------------------- scenes: built-in + registered by the deck page
  const FX = window.DeckFX || {};
  FX.timer = (s, ctx) => {
    const v = s.querySelector(".tt .v"), ring = s.querySelector(".ring-fg"), mins = +(s.dataset.mins || 5), C = 2 * Math.PI * 300;
    let left = mins * 60, total = left, run = false, h = null;
    ring.style.strokeDasharray = C;
    const draw = () => { v.textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0"); ring.style.strokeDashoffset = C * (1 - left / total); };
    draw();
    const btn = s.querySelector(".t-go"), add = s.querySelector(".t-add");
    const tick = () => { if (!ctx.alive()) { clearInterval(h); return; } left = Math.max(0, left - 1); draw(); if (left === 0) { clearInterval(h); run = false; btn.textContent = "Start again"; SFX.chime(); confetti(s, { y: 760 }); } };
    btn.onclick = (e) => { e.stopPropagation(); if (run) { clearInterval(h); run = false; btn.textContent = "Resume"; } else { if (left === 0) { left = total = mins * 60; } h = setInterval(tick, 1000); run = true; btn.textContent = "Pause"; SFX.pop(); } };
    add.onclick = (e) => { e.stopPropagation(); left += 60; total = Math.max(total, left); draw(); };
    return { stop() { clearInterval(h); } };
  };

  // ---------------------------------------------------------------- steps
  const maxStep = (s) => Math.max(+(s.dataset.steps || 0), ...Array.from(s.querySelectorAll("[data-step]")).map((e) => +e.dataset.step), ...Array.from(s.querySelectorAll(".ln[data-s]")).map((e) => +e.dataset.s), 0);
  function applyStep(s, n, alive, instant) {
    // state classes st-1 .. st-n let a slide's own CSS drive a scene step by step
    const ms = maxStep(s);
    if (instant) s.classList.add("no-anim");
    for (let k = 1; k <= ms; k++) s.classList.toggle("st-" + k, k <= n);
    s.dataset.at = n;
    if (instant) { void s.offsetWidth; requestAnimationFrame(() => requestAnimationFrame(() => s.classList.remove("no-anim"))); }
    s.querySelectorAll("[data-step]").forEach((e) => {
      const k = +e.dataset.step;
      if (instant) e.style.transition = "none";
      e.classList.toggle("on", k <= n);
      e.classList.toggle("past", k < n);
      if (instant) { void e.offsetWidth; e.style.transition = ""; }
    });
    playTerminalStep(s, n, alive, instant);
    if (scene && scene.step) scene.step(n, instant);
    if (instant) return;
    s.querySelectorAll("[data-confetti]").forEach((e) => { if (+e.dataset.confetti === n) later(alive, +(e.dataset.cdelay || 300), () => { confetti(s, { x: +(e.dataset.cx || 800), y: +(e.dataset.cy || 600) }); SFX.chime(); }); });
  }

  // ---------------------------------------------------------------- navigation
  const secIndex = (i) => { const n = slides[i].dataset.sec; if (n == null) return null; const k = SECS.indexOf(n); return k >= 0 ? k : null; };
  const trk = secmap.querySelector(".trk"), lbl = secmap.querySelector(".lbl");
  trk.innerHTML = SECS.map(() => "<i></i>").join("") + '<b class="run"></b>';
  const runDot = trk.querySelector(".run"), pips = trk.querySelectorAll("i");
  function updateMap(i) {
    const k = secIndex(i);
    secmap.classList.toggle("on", k !== null);
    pips.forEach((p, n) => p.classList.toggle("past", k !== null && n < k));
    if (k !== null) { runDot.style.transform = `translateX(${k * 17}px)`; lbl.textContent = SECS[k]; }
  }
  let curAlive = () => false;
  function enter(i, atEnd) {
    const s = slides[i], my = ++token, alive = () => my === token;
    curAlive = alive;
    if (scene && scene.stop) scene.stop();
    scene = null;
    s.querySelectorAll("canvas.fx").forEach((c) => c.remove());
    // forget the state of an earlier visit without animating it away
    s.classList.add("no-anim");
    Array.from(s.classList).forEach((c) => { if (/^st-\d+$/.test(c)) s.classList.remove(c); });
    s.querySelectorAll("[data-step]").forEach((e) => e.classList.remove("on", "past"));
    s.classList.remove("play", "asking");
    void s.offsetWidth;
    s.classList.remove("no-anim");
    s.classList.add("active");
    void s.offsetWidth;
    s.classList.add("play");
    stepN = atEnd ? maxStep(s) : 0;
    if (s.hasAttribute("data-ask") && !atEnd) { s.classList.add("asking"); return; }
    start(s, alive, atEnd);
  }
  function start(s, alive, atEnd) {
    runCounters(s, alive);
    const name = s.dataset.fx;
    if (name && FX[name]) scene = FX[name](s, { alive, later: (ms, fn) => later(alive, ms, fn), sfx: SFX, confetti: (o) => confetti(s, o), RM }) || null;
    applyStep(s, stepN, alive, !!atEnd);
    if (s.hasAttribute("data-confetti-enter") && !atEnd) later(alive, +(s.dataset.confettiEnter || 600), () => { confetti(s); SFX.chime(); });
  }
  function reveal(s) {
    s.classList.remove("asking", "play"); void s.offsetWidth; s.classList.add("play");
    SFX.swish(); start(s, curAlive, false); updateNotes();
  }
  function go(i, atEnd) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (cur >= 0 && cur !== i) slides[cur].classList.remove("active", "play", "asking");
    cur = i; enter(i, atEnd);
    progress.style.width = ((i + 1) / slides.length) * 100 + "%";
    updateMap(i);
    try { history.replaceState(null, "", "#" + (i + 1)); } catch (e) { /* file:// */ }
    updateNotes();
  }
  const GRADS = ["var(--g-hot)", "var(--g-cool)", "var(--g-fresh)", "linear-gradient(100deg,#FF2E88,#7C3AED)", "linear-gradient(100deg,#FF9E00,#FF4D2E)", "linear-gradient(100deg,#00B2D6,#2563FF)"];
  function wipeTo(i, k) {
    wiping = true;
    wipe.style.background = GRADS[k % GRADS.length];
    wipe.querySelector(".wp").textContent = "Part " + (k + 1) + " of " + SECS.length;
    wipe.querySelector(".wn").textContent = SECS[k];
    wipe.querySelector(".wd").innerHTML = SECS.map((_, n) => '<i class="' + (n < k ? "past" : n === k ? "now" : "") + '"></i>').join("");
    wipe.style.display = "block"; SFX.whoosh();
    const into = wipe.animate([{ clipPath: "circle(0% at 0% 100%)" }, { clipPath: "circle(150% at 0% 100%)" }], { duration: 640, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" });
    wipe.querySelector(".wn").animate([{ opacity: 0, transform: "translateY(60px)" }, { opacity: 1, transform: "none" }], { duration: 600, delay: 240, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
    wipe.querySelector(".wp").animate([{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: 180, easing: "ease-out", fill: "backwards" });
    into.onfinish = () => setTimeout(() => {
      go(i);
      const out = wipe.animate([{ clipPath: "circle(150% at 100% 0%)" }, { clipPath: "circle(0% at 100% 0%)" }], { duration: 580, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" });
      out.onfinish = () => { wipe.style.display = "none"; wiping = false; };
    }, 950);
  }
  function next() {
    if (wiping) return;
    SFX.unlock();
    const s = slides[cur];
    if (s.classList.contains("asking")) { reveal(s); return; }
    if (stepN < maxStep(s)) { stepN++; applyStep(s, stepN, curAlive, false); SFX.step(); updateNotes(); return; }
    const ni = cur + 1; if (ni >= slides.length) return;
    const a = secIndex(cur), b = secIndex(ni);
    if (!RM && b !== null && b !== a) wipeTo(ni, b); else { go(ni); SFX.swish(); }
  }
  function prev() {
    if (wiping) return;
    const s = slides[cur];
    if (stepN > 0 && !s.classList.contains("asking")) { stepN--; applyStep(s, stepN, curAlive, true); updateNotes(); return; }
    if (cur > 0) go(cur - 1, true);
  }
  function showToast(t) { toast.textContent = t; toast.style.opacity = 1; clearTimeout(showToast.h); showToast.h = setTimeout(() => (toast.style.opacity = 0), 1800); }
  function openOverview() {
    const g = overview.querySelector(".grid");
    g.innerHTML = slides.map((s, i) => `<button data-i="${i}" class="${i === cur ? "cur" : ""}"><span>${i + 1}${s.dataset.sec ? " · " + esc(s.dataset.sec) : ""}</span>${esc(s.dataset.name || "Slide " + (i + 1))}</button>`).join("");
    overview.style.display = "flex";
  }
  overview.addEventListener("click", (e) => { e.stopPropagation(); const b = e.target.closest("button"); overview.style.display = "none"; if (b) go(+b.dataset.i); });
  help.addEventListener("click", (e) => { e.stopPropagation(); help.style.display = "none"; });
  function toggleFull() { if (!document.fullscreenElement) { const el = document.documentElement; if (el.requestFullscreen) el.requestFullscreen().catch(() => {}); } else document.exitFullscreen(); }

  // ---------------------------------------------------------------- input
  let typed = "", secret = "", secretT = 0;
  function onKey(e) {
    const k = e.key;
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    hideHint(); SFX.unlock();
    if (/^[a-z]$/i.test(k)) { // teacher unlock word, typed anywhere within a few seconds
      const now = Date.now(); if (now - secretT > 2500) secret = ""; secretT = now; secret = (secret + k.toLowerCase()).slice(-UNLOCK.length);
      if (secret === UNLOCK) {
        teacher = !teacher; store.set("deck-teacher", teacher ? "1" : "0"); document.body.classList.toggle("teacher", teacher);
        showToast(teacher ? "Teacher mode on: N for notes, P for presenter window" : "Teacher mode off");
        if (!teacher) notesBox.style.display = "none";
        secret = ""; return;
      }
    }
    if (overview.style.display === "flex" || help.style.display === "flex") { if (["Escape", "?", "o", "O"].includes(k)) { overview.style.display = "none"; help.style.display = "none"; } return; }
    if (/^[0-9]$/.test(k)) { typed += k; return; }
    if (k === "Enter" && typed) { go(parseInt(typed, 10) - 1); typed = ""; e.preventDefault(); return; }
    typed = "";
    if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(k)) { e.preventDefault(); if (blank.style.display === "block") { blank.style.display = "none"; return; } next(); }
    else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)) { e.preventDefault(); prev(); }
    else if (k === "Home") go(0);
    else if (k === "End") go(slides.length - 1, true);
    else if (k === "f" || k === "F") toggleFull();
    else if (k === "r" || k === "R") go(cur);
    else if (k === "b" || k === "B" || k === ".") blank.style.display = blank.style.display === "block" ? "none" : "block";
    else if (k === "o" || k === "O") openOverview();
    else if ((k === "n" || k === "N") && teacher) { notesBox.style.display = notesBox.style.display === "block" ? "none" : "block"; updateNotes(); }
    else if ((k === "p" || k === "P") && teacher) openPresenter();
    else if (k === "m" || k === "M") showToast(SFX.toggle() ? "Sound on" : "Sound off");
    else if (k === "?") help.style.display = "flex";
    else if (k === "Escape") { blank.style.display = "none"; notesBox.style.display = "none"; }
  }
  document.addEventListener("keydown", onKey);
  document.addEventListener("click", (e) => {
    if (e.target.closest(".no-advance, input, button, a, #help, #overview, #notesbox")) return;
    if (blank.style.display === "block") { blank.style.display = "none"; return; }
    hideHint();
    (e.clientX < window.innerWidth * 0.25 ? prev : next)();
  });
  let touchX = null, touchY = null;
  document.addEventListener("touchstart", (e) => { document.body.classList.add("touch"); touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY; touchX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
  }, { passive: true });
  let mmT = null;
  document.addEventListener("mousemove", () => { document.body.classList.add("mouse-moving"); clearTimeout(mmT); mmT = setTimeout(() => document.body.classList.remove("mouse-moving"), 2200); });

  // ---------------------------------------------------------------- hint, notes, presenter window
  function hideHint() { hint.classList.add("gone"); }
  setTimeout(hideHint, 7000);
  const notesOf = (i) => NOTES[i] || "";
  const nameOf = (i) => (slides[i] && slides[i].dataset.name) || "Slide " + (i + 1);
  const fmtNotes = (t) => esc(t).replace(/^(SAY|ASK|DO|TIP|WATCH|IF|TIME)\b:?/gm, (m, w) => `<b class="k-${w.toLowerCase()}">${w}</b>`);
  let pw = null, startTime = null;
  function updateNotes() {
    if (!teacher) return;
    const s = slides[cur], ms = maxStep(s), stepTxt = ms ? `  ·  step ${stepN} of ${ms}` : "";
    if (notesBox.style.display === "block") notesBox.innerHTML = `<b>${cur + 1}. ${esc(nameOf(cur))}${stepTxt}</b>\n\n` + fmtNotes(notesOf(cur));
    if (pw && !pw.closed) {
      const d = pw.document;
      d.getElementById("cnt").textContent = `Slide ${cur + 1} of ${slides.length}: ${nameOf(cur)}${stepTxt}`;
      d.getElementById("txt").innerHTML = fmtNotes(notesOf(cur)) || "<i>No notes for this slide.</i>";
      d.getElementById("nxt").textContent = cur + 1 < slides.length ? "Next slide: " + nameOf(cur + 1) : "Last slide";
      const plan = s.dataset.min; d.getElementById("plan").textContent = plan != null ? "Plan: reach this by " + plan + " min" : "";
    }
  }
  function openPresenter() {
    if (pw && !pw.closed) { pw.focus(); return; }
    pw = window.open("", "deckNotes_" + (CFG.id || "deck"), "width=1000,height=740");
    if (!pw) { showToast("Pop-up blocked. Allow pop-ups, or press N for notes here."); return; }
    pw.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Presenter: ' + esc(CFG.title || "Deck") + '</title><style>' +
      'body{margin:0;font:21px/1.55 system-ui,"Segoe UI",sans-serif;background:#fff;color:#0E1020;display:flex;flex-direction:column;height:100vh}' +
      '#top{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:14px 24px;background:#F5F7FC;border-bottom:2px solid #E3E6EF}#cnt{font-weight:800}' +
      '#right{display:flex;gap:18px;align-items:center}#plan{color:#5F6580;font-weight:600}#clk{font:800 30px system-ui;color:#FF4D2E;font-variant-numeric:tabular-nums}' +
      '#txt{flex:1;overflow:auto;padding:22px 30px;white-space:pre-wrap;font-size:24px}' +
      '#txt b{display:inline-block;font:800 14px system-ui;letter-spacing:.1em;padding:3px 10px;border-radius:999px;color:#fff;background:#2563FF;margin-right:8px;vertical-align:3px}' +
      '#txt b.k-ask{background:#7C3AED}#txt b.k-do{background:#00A862}#txt b.k-tip,#txt b.k-watch{background:#FF9E00;color:#0E1020}#txt b.k-if{background:#FF2E88}#txt b.k-time{background:#0E1020}' +
      '#bot{display:flex;gap:12px;align-items:center;padding:12px 24px;background:#F5F7FC;border-top:2px solid #E3E6EF}' +
      '#nxt{flex:1;color:#33384D;font-weight:600}button{font:800 19px system-ui;padding:12px 24px;border-radius:999px;border:0;cursor:pointer}#rs{background:#E3E6EF;color:#0E1020}#pv{background:#0E1020;color:#fff}#nx{background:#FF4D2E;color:#fff}' +
      '</style></head><body><div id="top"><span id="cnt"></span><span id="right"><span id="plan"></span><span id="clk">00:00</span></span></div><div id="txt"></div>' +
      '<div id="bot"><span id="nxt"></span><button id="rs" title="Restart the clock">Reset clock</button><button id="pv">Back</button><button id="nx">Next</button></div></body></html>');
    pw.document.close();
    pw.document.getElementById("pv").onclick = prev;
    pw.document.getElementById("nx").onclick = next;
    pw.document.getElementById("rs").onclick = () => { startTime = Date.now(); };
    pw.document.addEventListener("keydown", onKey);
    startTime = Date.now();
    const clk = setInterval(() => {
      if (!pw || pw.closed) { clearInterval(clk); return; }
      const s = Math.floor((Date.now() - startTime) / 1000);
      pw.document.getElementById("clk").textContent = (s >= 3600 ? Math.floor(s / 3600) + ":" : "") + String(Math.floor(s / 60) % 60).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
    }, 1000);
    updateNotes();
  }

  // ---------------------------------------------------------------- start
  const fromHash = parseInt((location.hash || "").replace("#", ""), 10);
  const startAt = fromHash >= 1 && fromHash <= slides.length ? fromHash - 1 : 0;
  const begin = () => go(startAt);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(begin); else begin();
  window.Deck = { go, next, prev, get cur() { return cur; }, get step() { return stepN; }, slides, sfx: SFX, confetti };
})();
