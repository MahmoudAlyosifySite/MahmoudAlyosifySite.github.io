/* ============================================================
   Prologue — the 30-second introduction film, scrubbed by scroll.

   Every frame is a pure function of film time, so instead of a
   video or an image sequence the page draws the film itself and
   takes its time from how far the visitor has scrolled through
   #prologue: down plays it, up plays it back. The first 4.5 s
   (the emblem resolving) play on their own when the page opens.

   The motion is ported from intro-video/film/film.js in its
   `?short` cut: the opening (0–12 s), then the closing, remapped.
   Skipped entirely for prefers-reduced-motion.
   ============================================================ */
(() => {
  const root = document.getElementById('prologue');
  if (!root) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { root.remove(); return; }

  const $ = id => document.getElementById('pl-' + id);
  const view = root.querySelector('.prologue__view'), stage = $('stage');
  const html = document.documentElement;

  // ── time helpers (the site's two curves) ──────────────────────
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const span = (t, a, b) => clamp((t - a) / (b - a));
  const lerp = (a, b, p) => a + (b - a) * p;
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const X = t => ((ax * t + bx) * t + cx) * t, Y = t => ((ay * t + by) * t + cy) * t;
    return x => {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let lo = 0, hi = 1, t = x;
      for (let i = 0; i < 24; i++) { const v = X(t); if (Math.abs(v - x) < 1e-5) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; }
      return Y(t);
    };
  }
  const E = bezier(.2, .7, .2, 1), S = bezier(.4, 0, .2, 1);
  const inn = (t, a, d = .75, f = E) => f(span(t, a, a + d));
  const out = (t, a, d = .5, f = S) => 1 - f(span(t, a, a + d));
  const bump = (t, a, d) => Math.sin(Math.PI * span(t, a, a + d));

  // short-cut time s (0–30) → film time t: 12–18 → 78–81 (×0.5), 18–21 → 81–84, 21–27 → 84–88.25, 27–30 → 88.25–90
  const filmT = s => s < 12 ? s : s < 18 ? 78 + (s - 12) * .5 : s < 21 ? 81 + (s - 18)
    : s < 27 ? 84 + (s - 21) * 4.25 / 6 : 88.25 + (s - 27) * 1.75 / 3;

  // ── layout: a 1920 × 1080 stage, or 1080 × 1920 on tall screens ──
  let tall = false, W = 1920, H = 1080;
  const dustCv = $('dust'), dctx = dustCv.getContext('2d');
  let motes = [];
  const mulberry32 = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  function fit() {
    const vw = view.clientWidth, vh = view.clientHeight;
    tall = vh > vw * 1.05;
    W = tall ? 1080 : 1920; H = tall ? 1920 : 1080;
    stage.classList.toggle('is-tall', tall);
    stage.style.width = W + 'px'; stage.style.height = H + 'px';
    const k = Math.min(vw / W, vh / H);
    stage.style.transform = `translate(${(vw - W * k) / 2}px, ${(vh - H * k) / 2}px) scale(${k})`;
    dustCv.width = W; dustCv.height = H;
    const r = mulberry32(1123);
    motes = [...Array(48)].map(() => ({ x: r() * W, y: r() * (H + 100), r: .8 + r() * 1.4, a: .12 + r() * .28, v: 6 + r() * 8, per: 7 + r() * 4, ph: r() * 6.28 }));
    wmW1 = $('wm1').offsetWidth; wmW2 = $('wm2').offsetWidth;
    last = -1;
  }
  let wmW1 = 660, wmW2 = 600;

  // ── drawing primitives ────────────────────────────────────────
  const centred = el => el.dataset.c !== undefined || (tall && el.dataset.tc !== undefined);
  function txt(el, t, a, b = 1e9, o = {}) {
    const p = inn(t, a, o.d ?? .75);
    el.style.opacity = p * out(t, b, o.od ?? .5);
    el.style.transform = `translate(${centred(el) ? '-50%' : '0'}, ${(1 - p) * 18}px)`;
  }
  const hair = (el, t, a, d, b = 1e9, bd = 1.5, origin = '50% 50%') => {
    el.style.transformOrigin = origin;
    el.style.transform = `scaleX(${inn(t, a, d) * (1 - E(span(t, b, b + bd)))})`;
  };
  const marker = (el, t, a) => { el.style.backgroundSize = `${inn(t, a) * 100}% .4em`; };
  const wipe = (el, x, feather) => { el.style.webkitMaskImage = el.style.maskImage = `linear-gradient(90deg, #000 ${x}px, transparent ${x + feather}px)`; };
  root.querySelectorAll('.pl-sweep[data-mask]').forEach(s => { s.style.webkitMaskImage = s.style.maskImage = `url("${s.dataset.mask}")`; });
  function sweep(el, t, a, d, peak) {
    const p = span(t, a, a + d);
    el.style.opacity = t > a && t < a + d ? peak * Math.sin(Math.PI * p) : 0;
    el.firstElementChild.style.left = `${lerp(-30, 130, S(p))}%`;
  }
  const hero = $('hero'), heroImg = hero.firstElementChild, glow = $('glow');
  let lastFilter = '';
  function portrait(o, bright, rim, scale) {
    hero.style.opacity = o; glow.style.opacity = o * rim;
    hero.style.transform = `scale(${scale})`;
    const f = `contrast(1.03) brightness(${bright.toFixed(3)}) drop-shadow(0 0 1px rgba(214,182,118,${(.70 * rim).toFixed(3)})) ` +
      `drop-shadow(-2px -1px 3px rgba(242,223,168,${(.32 * rim).toFixed(3)})) drop-shadow(0 0 22px rgba(201,165,94,${(.22 * rim).toFixed(3)})) ` +
      `drop-shadow(0 0 70px rgba(201,165,94,${(.10 * rim).toFixed(3)}))`;
    if (f !== lastFilter) { heroImg.style.filter = f; lastFilter = f; }
  }
  function dust(s, alpha) {
    dctx.clearRect(0, 0, W, H);
    if (alpha <= 0) return;
    dctx.fillStyle = '#C9A55E'; dctx.shadowColor = 'rgba(201,165,94,.8)'; dctx.shadowBlur = 4;
    for (const m of motes) {
      const y = ((m.y - m.v * s) % (H + 100) + (H + 100)) % (H + 100) - 50;
      const x = m.x + 6 * Math.sin(2 * Math.PI * s / m.per + m.ph);
      dctx.globalAlpha = m.a * alpha; dctx.beginPath(); dctx.arc(x, y, m.r, 0, 6.2832); dctx.fill();
    }
    dctx.globalAlpha = 1;
  }

  const s1 = $('s1'), s11 = $('s11');
  // ── one frame of the film at short-cut time s ─────────────────
  function frame(s) {
    const t = filmT(s);
    s1.style.visibility = t < 12 ? 'visible' : 'hidden';
    s11.style.visibility = t >= 78 ? 'visible' : 'hidden';
    let dip = Math.max(1 - Math.abs(t - 12) / .375, 1 - Math.abs(t - 78) / .375, 1 - span(t, 0, .01));
    if (t >= 89.5) dip = 1;
    $('dip').style.opacity = S(clamp(dip));
    dust(s, t < 40 ? clamp(span(t, .75, 3.75)) : .8 * out(t, 88.5, 1, x => x));

    if (t < 40) {
      portrait(inn(t, 6, 2.25, S) * out(t, 11.7, .5), lerp(.4, .98, inn(t, 6, 2.25, S)),
        inn(t, 6.75, 2.25, S) * out(t, 11.4, .4), 1 + .03 * clamp(span(t, 6, 12)));
    } else {
      const rim = inn(t, 81.75, 2.25, S) * (1 + .3 * bump(t, 86.25, 1.5)) * out(t, 88.4, .9);
      portrait(inn(t, 81, 2.25, S) * out(t, 88.5, 1), lerp(.4, .98, inn(t, 81, 2.25, S)), rim, 1 + .03 * Math.max(0, t - 81) / 6);
    }

    if (t < 12) {                                     // the mark, the portrait, the name
      hair($('hair1'), t, 1.5, 1.5, 6, 1.5); $('hair1').style.opacity = .8;
      const em = $('emblem1'), ei = inn(t, 3, 2.25), eo = E(span(t, 6, 7.5));
      em.style.opacity = ei * (1 - eo);
      em.style.transform = `translateY(${-40 * eo}px) scale(${lerp(.965, 1, ei)})`;
      em.style.filter = ei < 1 ? `blur(${(1 - ei) * 10}px)` : 'none';
      sweep(em.querySelector('.pl-sweep'), t, 4.5, 1.5, .55);
      const wm = $('wm1'); wipe(wm, lerp(-80, wmW1 + 80, S(span(t, 6.75, 8.25))), 80);
      wm.style.opacity = out(t, 11.25);
      sweep(wm.querySelector('.pl-sweep'), t, 10.5, 1.2, .45);
      txt($('k1'), t, 8.25, 11.25);
      hair($('line1'), t, 9, .75, 11.25, .5, tall ? '50% 50%' : '0 50%');
      txt($('alias'), t, 9, 11.25);
    }
    if (t >= 78) {                                    // a purpose, and the name card
      txt($('a'), t, 78.75, 80.625, { od: .375 }); txt($('b'), t, 79.5, 80.625, { od: .375 }); txt($('c'), t, 80.25, 80.625, { od: .375 });
      txt($('p1'), t, 81, 83.25); txt($('p2'), t, 81.75, 83.25); marker($('mk'), t, 82.5);
      const leftOut = out(t, 88.25, .75);
      const sig = $('sig'); sig.style.opacity = t >= 84 ? .07 * out(t, 88.25, 1) : 0;
      wipe(sig, lerp(-120, sig.offsetWidth + 120, S(span(t, 84, 86.25))), 120);
      const em = $('emblem2'), ei = inn(t, 84, 1.5, S);
      em.style.opacity = ei * leftOut; em.style.filter = ei < 1 ? `blur(${(1 - ei) * 6}px)` : 'none';
      sweep(em.querySelector('.pl-sweep'), t, 86.25, 1.5, .4);
      const wm = $('wm2'); wipe(wm, lerp(-80, wmW2 + 80, S(span(t, 84.75, 86.25))), 80);
      wm.style.opacity = t >= 84.75 ? leftOut : 0;
      hair($('hair2'), t, 84.75, 1.5); $('hair2').style.opacity = leftOut;
      txt($('url'), t, 85.5, 88.25, { od: .75 }); txt($('mail'), t, 86.25, 88.25, { od: .75 }); txt($('li'), t, 86.4, 88.25, { od: .75 });
    } else $('sig').style.opacity = 0;
  }

  // ── scroll → time, eased like a film gate, not a jump cut ─────
  const AUTO = 4.5, END = 29.4;
  const hint = root.querySelector('.prologue__hint'), skip = root.querySelector('.prologue__skip');
  const t0 = performance.now();
  let shown = 0, last = -1, raf = 0;
  const progress = () => clamp((scrollY - root.offsetTop) / (root.offsetHeight - innerHeight));
  function tick(now) {
    raf = 0;
    const p = progress();
    const auto = Math.min(AUTO, (now - t0) / 1000);
    const target = p > 0 ? Math.max(AUTO * (auto < AUTO ? auto / AUTO : 1), AUTO + p * (END - AUTO)) : auto;
    shown += (target - shown) * (Math.abs(target - shown) > 4 ? 1 : .14);
    if (Math.abs(target - shown) < .002) shown = target;
    if (Math.abs(shown - last) > .0005) { frame(shown); last = shown; }
    hint.style.opacity = clamp(span(auto, 3.8, 4.5)) * (1 - clamp(p * 25));
    skip.style.opacity = 1 - clamp(span(p, .9, 1));
    html.classList.toggle('is-prologue', scrollY < root.offsetTop + root.offsetHeight - innerHeight * .9);
    if (shown !== target || auto < AUTO) raf = requestAnimationFrame(tick);
  }
  const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
  addEventListener('scroll', wake, { passive: true });
  addEventListener('resize', () => { fit(); wake(); });
  skip.addEventListener('click', () => {
    const main = document.getElementById('main');
    scrollTo({ top: root.offsetTop + root.offsetHeight, behavior: 'instant' });
    main && main.focus({ preventScroll: true });
  });

  html.classList.toggle('is-prologue', scrollY < root.offsetTop + root.offsetHeight - innerHeight * .9);
  const start = () => { fit(); frame(0); wake(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
})();
