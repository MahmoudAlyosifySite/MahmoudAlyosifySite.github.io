// The film's timeline: every visual is a pure function of t (seconds). See ../storyboard.md.
// 80 BPM: 1 beat = 0.75 s, 1 bar = 3 s, 30 bars.
(() => {
  const $ = id => document.getElementById(id);
  const W = 1920, H = 1080;

  // ── easing (the site's two curves) ──────────────────────────────
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const X = t => ((ax * t + bx) * t + cx) * t, Y = t => ((ay * t + by) * t + cy) * t;
    return x => {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let lo = 0, hi = 1, t = x;
      for (let i = 0; i < 30; i++) { const v = X(t); if (Math.abs(v - x) < 1e-5) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; }
      return Y(t);
    };
  }
  const E = bezier(.2, .7, .2, 1), S = bezier(.4, 0, .2, 1), L = x => clamp(x);
  const lerp = (a, b, p) => a + (b - a) * p;
  const inn = (t, a, d = .75, f = E) => f(span(t, a, a + d));
  const out = (t, a, d = .5, f = S) => 1 - f(span(t, a, a + d));
  const bump = (t, a, d) => { const p = span(t, a, a + d); return Math.sin(Math.PI * p); };
  // piecewise keyframes [[t, v], ...] with easing f between keys
  const kf = (t, k, f = E) => {
    if (t <= k[0][0]) return k[0][1];
    for (let i = 1; i < k.length; i++) if (t <= k[i][0]) return lerp(k[i - 1][1], k[i][1], f(span(t, k[i - 1][0], k[i][0])));
    return k[k.length - 1][1];
  };

  // ── text: fade up 18 px over one beat, fade out in place ────────
  const centered = el => el.dataset.c !== undefined;
  function txt(el, t, a, b = 1e9, o = {}) {
    const dy = o.dy ?? 18, d = o.d ?? .75, od = o.od ?? .5;
    const words = el._words;
    const vOut = out(t, b, od);
    if (words && !o.noStagger) {
      el.style.opacity = t >= a ? vOut : 0;
      el.style.transform = centered(el) ? 'translateX(-50%)' : '';
      words.forEach((w, i) => { const p = inn(t, a + i * .06, d); w.style.opacity = p; w.style.transform = `translateY(${(1 - p) * dy}px)`; });
      return;
    }
    const p = inn(t, a, d);
    el.style.opacity = p * vOut;
    el.style.transform = `translate(${centered(el) ? '-50%' : '0'}, ${(1 - p) * dy}px)`;
  }
  // split .stg elements into word spans (keeps <br> and nested spans)
  function splitWords(el) {
    const words = [];
    const walk = node => {
      for (const ch of [...node.childNodes]) {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); words.push(s);
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1 && ch.tagName !== 'BR') walk(ch);
      }
    };
    walk(el); el._words = words;
  }
  document.querySelectorAll('.stg').forEach(splitWords);

  const marker = (el, t, a, d = .75) => { el.style.backgroundSize = `${inn(t, a, d) * 100}% .4em`; };
  const hair = (el, t, a, d = 1.5, b = 1e9, bd = 1.5, origin = '50% 50%') => {
    el.style.transformOrigin = origin;
    el.style.transform = `scaleX(${inn(t, a, d) * (1 - E(span(t, b, b + bd)))})`;
  };
  const draw = (el, p) => { el.style.strokeDashoffset = 1 - p; };
  // foil sweep across a masked target
  document.querySelectorAll('.sweep[data-mask]').forEach(s => {
    s.style.webkitMaskImage = s.style.maskImage = `url(${s.dataset.mask})`;
  });
  function sweep(el, t, a, d, peak) {
    const p = span(t, a, a + d);
    el.style.opacity = t > a && t < a + d ? peak * Math.sin(Math.PI * p) : 0;
    el.firstElementChild.style.left = `${lerp(-30, 130, S(p))}%`;
  }

  // ── photos: Ken Burns, linear. [scale over cover, focus x, focus y, screen x, screen y] ──
  function kb(el, t, t0, t1, from, to) {
    const img = el.firstElementChild, w = el._w ??= el.offsetWidth, h = el._h ??= el.offsetHeight;
    const iw = img.naturalWidth, ih = img.naturalHeight, p = L(span(t, t0, t1));
    const [s, fx, fy, sx, sy] = from.map((v, i) => lerp(v, to[i], p));
    const k = Math.max(w / iw, h / ih) * s, dw = iw * k, dh = ih * k;
    const x = clamp(sx - fx * dw, w - dw, 0), y = clamp(sy - fy * dh, h - dh, 0);
    img.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
  }

  // ── seeded randomness ───────────────────────────────────────────
  const mulberry32 = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  // ── grain: 8 precomputed noise plates, one per frame in turn ────
  const gctx = $('grain').getContext('2d');
  const plates = [...Array(8)].map((_, n) => {
    const r = mulberry32(9001 + n), d = gctx.createImageData(1280, 720);
    for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (r() + r() + r() - 1.5) * 120; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    return d;
  });

  // ── gold dust ───────────────────────────────────────────────────
  const dctx = $('dust').getContext('2d');
  const dr = mulberry32(1123);
  const motes = [...Array(48)].map(() => ({ x: dr() * W, y: dr() * (H + 100), r: .8 + dr() * 1.4, a: .12 + dr() * .28,
    v: 6 + dr() * 8, amp: 6, per: 7 + dr() * 4, ph: dr() * 6.28 }));
  function dust(t, alpha) {
    dctx.clearRect(0, 0, W, H);
    if (alpha <= 0) return;
    dctx.fillStyle = '#C9A55E'; dctx.shadowColor = 'rgba(201,165,94,.8)'; dctx.shadowBlur = 4;
    for (const m of motes) {
      const y = ((m.y - m.v * t) % (H + 100) + (H + 100)) % (H + 100) - 50;
      const x = m.x + m.amp * Math.sin(2 * Math.PI * t / m.per + m.ph);
      dctx.globalAlpha = m.a * alpha; dctx.beginPath(); dctx.arc(x, y, m.r, 0, 6.2832); dctx.fill();
    }
    dctx.globalAlpha = 1;
  }

  // ── the hero portrait (§1.8) ────────────────────────────────────
  const hero = $('hero'), heroImg = hero.firstElementChild, heroGlow = $('heroGlow');
  function portrait(o, bright, rim, scale) {
    hero.style.opacity = o; heroGlow.style.opacity = o * rim;
    hero.style.transform = `scale(${scale})`;
    const r = rim;
    heroImg.style.filter = `contrast(1.03) brightness(${bright}) ` +
      `drop-shadow(0 0 1px rgba(214,182,118,${(.70 * r).toFixed(3)})) drop-shadow(-2px -1px 3px rgba(242,223,168,${(.32 * r).toFixed(3)})) ` +
      `drop-shadow(0 0 22px rgba(201,165,94,${(.22 * r).toFixed(3)})) drop-shadow(0 0 70px rgba(201,165,94,${(.10 * r).toFixed(3)}))`;
  }

  // ── the thread (scenes 2–8) ─────────────────────────────────────
  const years = [[2000, 220], [2019, 560], [2023, 900], [2025, 1300], [2026, 1700]];
  const yearEls = years.map(([y, x]) => {
    const n = document.createElement('div'); n.className = 'tnode'; n.style.left = x + 'px'; $('thread').appendChild(n);
    const l = document.createElement('div'); l.className = 'tyear'; l.style.left = x + 'px'; l.textContent = y; $('thread').appendChild(l);
    return [x, l];
  });
  const headX = t => kf(t, [[12, 160], [13.5, 220], [18, 220], [19.5, 560], [22.5, 560], [24.75, 815], [27, 815], [28.5, 900],
    [36, 900], [37.5, 1100], [42, 1100], [43.5, 1300]]);

  // ── scene 2: the map of Egypt ───────────────────────────────────
  $('s2egypt').setAttribute('d', GEO.egyptPath); $('s2nile').setAttribute('d', GEO.nilePath);
  $('s2ros').setAttribute('d', GEO.rosettaPath); $('s2dam').setAttribute('d', GEO.damiettaPath);
  const [ax2, ay2] = GEO.assiut2;
  for (const id of ['s2pulse', 's2pulse2', 's2node']) { $(id).setAttribute('cx', ax2); $(id).setAttribute('cy', ay2); }
  $('s2cairo').setAttribute('cx', GEO.cairo2[0]); $('s2cairo').setAttribute('cy', GEO.cairo2[1]);
  $('s2lab').setAttribute('x', ax2 + 22); $('s2lab').setAttribute('y', ay2 + 7);
  $('s2map').style.transformOrigin = `${ax2}px ${ay2}px`;

  // ── scene 8: the network ────────────────────────────────────────
  const net = $('s8net'), NS = 'http://www.w3.org/2000/svg';
  const nr = mulberry32(808);
  const layers = [[4, 400], [8, 820], [6, 1240]].map(([n, x], li) => [...Array(n)].map((_, i) => {
    const y0 = 330, y1 = 820, y = n === 1 ? (y0 + y1) / 2 : y0 + (y1 - y0) * i / (n - 1);
    return { x: x + (nr() - .5) * 48, y: y + (li === 2 ? 0 : (nr() - .5) * 48) };
  }));
  const edges = [];
  const eg = document.createElementNS(NS, 'g'); net.appendChild(eg);
  for (let li = 0; li < 2; li++) for (const a of layers[li]) for (const b of layers[li + 1]) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', `M${a.x} ${a.y}L${b.x} ${b.y}`); p.setAttribute('pathLength', '1');
    p.setAttribute('class', 'draw'); p.setAttribute('stroke-width', '1');
    eg.appendChild(p); edges.push({ el: p, li, a, b });
  }
  const pulses = [...Array(4)].map(() => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 3);
    c.setAttribute('fill', '#E2C27E'); c.style.filter = 'drop-shadow(0 0 4px rgba(201,165,94,.9))'; net.appendChild(c); return c; });
  const nodeEls = layers.flat().map(n => { const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', n.x); c.setAttribute('cy', n.y); c.setAttribute('r', 6); c.setAttribute('fill', '#0B0B0C');
    c.setAttribute('stroke', '#C9A55E'); c.setAttribute('stroke-width', '1.5'); net.appendChild(c); n.el = c; return c; });
  const projects = ['AudioShield', 'SimCLR-Vision-SSL', 'SCRAP', 'Horus-OSINT', 'HORUS Sentinel', 'RL-Cloud-Autoscaler'];
  const outLabels = layers[2].map((n, i) => { const tx = document.createElementNS(NS, 'text');
    tx.setAttribute('x', n.x + 26); tx.setAttribute('y', n.y + 8); tx.textContent = projects[i].toUpperCase();
    tx.setAttribute('style', "font:400 24px 'Chivo Mono',monospace;letter-spacing:.08em"); net.appendChild(tx); return tx; });
  // a pulse's route: input -> hidden -> output, re-chosen each trip from a seeded table
  const routes = [...Array(64)].map((_, i) => { const r = mulberry32(500 + i);
    return [layers[0][Math.floor(r() * 4)], layers[1][Math.floor(r() * 8)], layers[2][Math.floor(r() * 6)]]; });

  // ── scene 9: dotted world, arc, maple leaf ──────────────────────
  { const c = $('s9dots').getContext('2d'); c.fillStyle = '#C9A55E';
    for (let i = 0; i < GEO.dots.length; i += 2) { c.beginPath(); c.arc(GEO.dots[i], GEO.dots[i + 1], 1.3, 0, 6.2832); c.fill(); } }
  const [asx, asy] = GEO.assiut9, [kx, ky] = GEO.kingston9;
  const arcD = `M${asx} ${asy}Q${(asx + kx) / 2} ${(asy + ky) / 2 - 360} ${kx} ${ky}`;
  $('s9arc').setAttribute('d', arcD);
  const arcEl = $('s9arc'), arcLen = (() => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', arcD); p.setAttribute('fill', 'none'); p.style.visibility = 'hidden'; net.appendChild(p); const l = p.getTotalLength(); p._l = l; arcEl._probe = p; return l; })();
  const tail = [...Array(18)].map((_, i) => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('fill', '#E2C27E'); $('s9tail').appendChild(c); return c; });
  for (const id of ['s9pulse', 's9king']) { $(id).setAttribute('cx', kx); $(id).setAttribute('cy', ky); }
  $('s9asn').setAttribute('cx', asx); $('s9asn').setAttribute('cy', asy);
  // the maple leaf, from the flag's construction, as one continuous line
  const leaf = 'm-90 2030l45-863-111-98-859 151 116-320-20-73-941-762 212-99 34-79-186-572 542 115 73-38 105-247 423 454 111-57-204-1052 327 189 91-27 332-652 332 652 91 27 327-189-204 1052 111 57 423-454 105 247 73 38 542-115-186 572 34 79 212 99-941 762-20 73 116 320-859-151-111 98 45 863z';
  const leafEl = $('s9leaf'); leafEl.setAttribute('d', leaf);
  { const b = leafEl.getBBox(), k = 90 / b.height;
    leafEl.setAttribute('transform', `translate(${kx - (b.x + b.width / 2) * k} ${ky - 70 - (b.y + b.height) * k}) scale(${k})`);
    leafEl.style.vectorEffect = 'non-scaling-stroke'; }
  $('s9cam').style.transformOrigin = `${kx}px ${ky}px`;
  $('s9lab').style.left = kx + 26 + 'px'; $('s9lab').style.top = ky + 18 + 'px';

  // ── scene 10: token pills ───────────────────────────────────────
  const tokens = ['Kingston', 'is', 'in', 'Ontario', ',', 'Canada', '.', 'In', 'summary', ',', 'as', 'mentioned', ',', 'Kingston', 'is', 'located', 'in', 'Ontario', '.'];
  const row = $('s10row'), pills = tokens.map(s => { const p = document.createElement('div'); p.className = 'pill'; p.textContent = s; row.appendChild(p); return p; });
  const gap = 8; let rowX0, rowX1, gateX;
  const measure = () => {   // after the fonts have loaded
    let px = 0; pills.forEach(p => { p._x = px; px += p.offsetWidth + gap; });
    rowX0 = (W - (px - gap)) / 2; rowX1 = (W - (pills[7]._x - gap)) / 2; gateX = pills[7]._x - gap / 2 - .75;
  };
  const gate = document.createElement('div'); gate.className = 'gate'; gate.innerHTML = '<span>STOP</span>'; row.appendChild(gate);
  // letters of "MinimalLM"
  { const el = document.querySelector('#s10t .letters'); el.innerHTML = [...el.textContent].map(c => `<span class="l">${c}</span>`).join(''); }
  const letters = [...document.querySelectorAll('#s10t .l')];

  // ── scene ranges, dissolves through paper ───────────────────────
  const scenes = [...document.querySelectorAll('.scene')].map(s => [s, +s.dataset.in, +s.dataset.out]);
  const dips = [12, 18, 24, 30, 36, 42, 51, 66, 78];

  // ?short: the 30-s website cut. The opening (0–12 s) as is, then the closing from 78 s,
  // slowed so each line breathes: 12–18 → 78–81 (×0.5), 18–21 → 81–84, 21–27 → 84–88.25, 27–30 → 88.25–90.
  const SHORT = location.search.includes('short');
  const shortT = s => s < 12 ? s : s < 18 ? 78 + (s - 12) * .5 : s < 21 ? 81 + (s - 18)
    : s < 27 ? 84 + (s - 21) * 4.25 / 6 : 88.25 + (s - 27) * 1.75 / 3;
  if (SHORT) [['s11a', 400], ['s11b', 490], ['s11c', 580]].forEach(([id, top]) => {   // centred on black, no photo
    const el = $(id); el.style.left = '960px'; el.style.top = top + 'px'; el.dataset.c = '';
  });

  let measured = false;
  onFrame(real => {
    if (!measured) { measure(); measured = true; }
    const t = SHORT ? shortT(real) : real;
    const frame = Math.round(real * 30);
    for (const [s, a, b] of scenes) s.style.visibility = t >= a && t < b ? 'visible' : 'hidden';
    let dip = 0; for (const c of dips) dip = Math.max(dip, 1 - Math.abs(t - c) / .375);
    dip = Math.max(dip, 1 - span(t, 0, .01));            // frame 0 is pure paper
    if (t >= 89.5) dip = 1;
    $('dip').style.opacity = S(clamp(dip));

    gctx.putImageData(plates[frame % 8], 0, 0);
    const dustA = kf(t, [[.75, 0], [3.75, 1], [12, 1], [13, .5], [36, .5], [37, .7], [59.6, .7], [60, 0], [60.5, 1], [78, 1], [79, .8], [88.5, .8], [89.5, 0]], L);
    dust(real, dustA);

    // ── hero portrait (scene 1 and scene 11) ──
    if (t < 40) {
      const o = inn(t, 6, 2.25, S) * out(t, 11.7, .5, S);
      portrait(o, lerp(.4, .98, inn(t, 6, 2.25, S)), inn(t, 6.75, 2.25, S) * out(t, 11.4, .4, S), 1 + .03 * L(span(t, 6, 12)));
    } else {
      const o = inn(t, 81, 2.25, S) * out(t, 88.5, 1, S);
      const rim = inn(t, 81.75, 2.25, S) * (1 + .3 * bump(t, 86.25, 1.5)) * out(t, 88.4, .9, S);
      portrait(o, lerp(.4, .98, inn(t, 81, 2.25, S)), rim, 1 + .03 * (t - 81) / 6 * (t > 81));
    }

    // ── Scene 1 · The Mark ──
    if (t < 12) {
      hair($('s1hair'), t, 1.5, 1.5, 6, 1.5); $('s1hair').style.opacity = .8;
      const em = $('s1emblem'), ei = inn(t, 3, 2.25), eo = E(span(t, 6, 7.5));
      em.style.opacity = ei * (1 - eo);
      em.style.transform = `translateY(${-40 * eo}px) scale(${lerp(.965, 1, ei)})`;
      em.style.filter = `blur(${(1 - ei) * 10}px)`;
      sweep(em.querySelector('.sweep'), t, 4.5, 1.5, .55);
      const wm = $('s1wm'), wp = lerp(-80, 740, S(span(t, 6.75, 8.25)));
      wm.style.webkitMaskImage = wm.style.maskImage = `linear-gradient(90deg, #000 ${wp}px, transparent ${wp + 80}px)`;
      wm.style.opacity = out(t, 11.25);
      sweep(wm.querySelector('.sweep'), t, 10.5, 1.2, .45);
      txt($('s1k'), t, 8.25, 11.25);
      hair($('s1line'), t, 9, .75, 11.25, .5, '0 50%');
      txt($('s1alias'), t, 9, 11.25);
    }

    // ── the thread (12–60) ──
    $('thread').style.opacity = t >= 12 && t < 60 ? inn(t, 12, .75, S) : 0;
    $('playhead').style.opacity = 0;
    if (t >= 11 && t < 61) {
      const x = headX(t), ph = $('playhead');
      for (const [nx, l] of yearEls) l.classList.toggle('on', Math.abs(nx - x) < 12);
      if (t < 60) {
        ph.style.left = x + 'px'; ph.style.top = '1000px';
        ph.style.opacity = inn(t, 12, .75, S) * (1 + .6 * L(span(t, 59.25, 59.9)));
        ph.style.transform = `scale(${1 + .5 * L(span(t, 59.25, 59.9))})`;
      }
    }
    // network collapses at 59.625: the thread survives until the hard cut
    if (t >= 60 && t < 61.5) {
      // the playhead rises to Assiut and becomes the comet
      const p = inn(t, 60, .75), ph = $('playhead');
      const x = (1 - p) ** 2 * 1300 + 2 * (1 - p) * p * 1330 + p * p * asx, y = (1 - p) ** 2 * 1000 + 2 * (1 - p) * p * 760 + p * p * asy;
      ph.style.left = x + 'px'; ph.style.top = y + 'px'; ph.style.opacity = t < 60.75 ? 1 : 0; ph.style.transform = 'scale(1.2)';
    }
    if (t >= 61.5) $('playhead').style.opacity = 0;

    // ── Scene 2 · Origins ──
    if (t >= 12 && t < 18) {
      const zoom = S(span(t, 14.25, 15.1));
      $('s2map').style.transform = `translateY(${-14 * L(span(t, 12, 14.25))}px) scale(${(1 + .04 * L(span(t, 12, 14.25))) * (1 + .8 * zoom)})`;
      const fadeAll = out(t, 14.25, .75, S);
      const td = $('s2td'); td.style.opacity = inn(t, 14.4, .9, S) * out(t, 17.25, .375);
      kb(td, t, 14.25, 18.4, [1.04, .47, .45, 155, 260], [1.10, .47, .44, 155, 252]);
      const ph = $('s2ph'); ph.style.opacity = inn(t, 15.0, .9, S) * out(t, 17.25, .375);
      kb(ph, t, 14.75, 18.4, [1.0, .5, .40, 145, 190], [1.06, .5, .38, 145, 184]);
      const hs = $('s2hs'); hs.style.opacity = inn(t, 15.6, .9, S) * out(t, 17.25, .375);
      kb(hs, t, 15.4, 18.4, [1.04, .40, .36, 150, 210], [1.10, .40, .34, 150, 202]);
      draw($('s2egypt'), inn(t, 12, 2.25)); draw($('s2nile'), inn(t, 12.75, 1.5));
      draw($('s2ros'), inn(t, 13.9, .6)); draw($('s2dam'), inn(t, 13.9, .6));
      $('s2map').style.opacity = fadeAll;
      $('s2cairo').setAttribute('opacity', .35 * inn(t, 14.0, .75));
      const n = inn(t, 13.5, .5); $('s2node').setAttribute('opacity', n); $('s2node').setAttribute('r', 5 * lerp(.6, 1, n));
      $('s2lab').setAttribute('opacity', inn(t, 13.9, .75) * .9);
      const pu = (el, a) => { const p = L(span(t, a, a + 1.5)); el.setAttribute('r', lerp(10, 46, E(p))); el.setAttribute('opacity', p > 0 && p < 1 ? .5 * (1 - p) : 0); };
      pu($('s2pulse'), 13.5); pu($('s2pulse2'), 17.25);
      txt($('s2k'), t, 12.75, 17.25);
      txt($('s2l1'), t, 13.5, 15);
      txt($('s2l2'), t, 15.75, 17.25);
      marker($('s2mk'), t, 16.5);
    }

    // ── Scene 3 · Assiut University ──
    if (t >= 18 && t < 24) {
      kb($('s3ph'), t, 17.625, 24.375, [1.30, .5, .27, 1200, 540], [1.12, .5, .45, 1200, 540]);
      const cls = out(t, 20.75, .75, S); $('s3ph').style.opacity = cls; $('s3g1').style.opacity = cls; $('s3g2').style.opacity = cls;
      const st = $('s3st'); st.style.opacity = inn(t, 20.9, .9, S) * out(t, 23.25, .5);
      kb(st, t, 20.75, 24.375, [1.0, .5, .4, 165, 215], [1.05, .5, .38, 165, 207]);
      const yo = $('s3yo'); yo.style.opacity = inn(t, 21.5, .9, S) * out(t, 23.25, .5);
      kb(yo, t, 21.25, 24.375, [1.0, .5, .45, 150, 260], [1.05, .5, .43, 150, 250]);
      const lx = $('s3lx'); lx.style.opacity = inn(t, 22.1, .9, S) * out(t, 23.25, .5);
      kb(lx, t, 21.75, 24.375, [1.25, .58, .45, 155, 245], [1.32, .58, .44, 155, 237]);
      $('s3logo').style.opacity = inn(t, 18.75, 1, S) * out(t, 23.25);
      txt($('s3k'), t, 19.5, 23.25); txt($('s3h'), t, 19.5, 23.25);
      txt($('s3s'), t, 20.25, 21, { od: .5 }); txt($('s3d'), t, 21.1, 23.25);
    }

    // ── Scene 4 · First Wins ──
    if (t >= 24 && t < 30) {
      txt($('s4h'), t, 24, 29.25);
      const panel = (id, a, dimAt, from, to) => {
        const el = $(id), p = inn(t, a, .75, S);
        el.style.clipPath = `inset(${(1 - p) * 100}% 0 0 0 round 3px)`;
        el.style.opacity = p > 0 ? 1 : 0;
        const dim = dimAt ? .55 + .45 * (1 - inn(t, dimAt, .5, S)) : 1;
        const back = inn(t, 29.25, .4, S);
        el.style.filter = `brightness(${lerp(dim, 1, back)})`;
        el.style.opacity = (p > 0 ? 1 : 0) * out(t, 29.6, .4);
        kb(el, t, 24, 30, from, to);
      };
      panel('s4u', 24.75, 25.85, [1.04, .50, .55, 190, 280], [1.08, .50, .55, 190, 280]);
      panel('s4a', 25.85, 26.95, [1.04, .47, .40, 190, 280], [1.08, .47, .40, 190, 280]);
      panel('s4b', 26.95, 28.05, [1.04, .66, .38, 190, 280], [1.08, .66, .38, 190, 280]);
      panel('s4c', 28.05, 0, [1.04, .50, .42, 190, 280], [1.08, .50, .42, 190, 280]);
      txt($('s4cu'), t, 25.1, 25.85, { od: .35 }); txt($('s4ca'), t, 26.2, 26.95, { od: .35 });
      txt($('s4cb'), t, 27.3, 28.05, { od: .35 }); txt($('s4cc'), t, 28.4, 29.25);
    }

    // ── Scene 5 · Graduation ──
    if (t >= 30 && t < 36) {
      kb($('s5ph'), t, 29.625, 36.375, [1.14, .52, .38, 1240, 470], [1.22, .52, .38, 1260, 460]);
      $('s5bloom').style.opacity = .18 * bump(t, 34.5, 1.1);
      txt($('s5k'), t, 30.75, 35.25); txt($('s5h'), t, 31.5, 35.25); marker($('s5mk'), t, 32.25);
      txt($('s5s'), t, 33, 35.25);
    }

    // ── Scene 6 · Service ──
    if (t >= 36 && t < 42) {
      const of = $('s6of'); of.style.opacity = inn(t, 36.4, 1.1, S) * out(t, 41.25, .5);
      of.querySelector('img').style.filter = 'saturate(.8) contrast(1.04) brightness(.86) sepia(.06)';
      kb(of, t, 36, 42.4, [1.10, .5, .42, 220, 250], [1.16, .5, .40, 220, 245]);
      const ph = $('s6ph'); ph.style.opacity = inn(t, 37.6, 1.1, S) * out(t, 41.25, .5);
      ph.querySelector('img').style.filter = 'saturate(.82) contrast(1.04) brightness(.81) sepia(.06)';
      kb(ph, t, 37, 42.4, [1.20, .5, .55, 200, 300], [1.26, .5, .53, 200, 290]);
      txt($('s6k'), t, 36.75, 41.25); txt($('s6l1'), t, 37.5, 41.25);
      txt($('s6l2'), t, 39, 40.25); txt($('s6l3'), t, 40.75, 41.25, { od: .5 });
    }

    // ── Scene 7 · Teaching ──
    if (t >= 42 && t < 51) {
      const ph = $('s7ph'), blur = inn(t, 45, .75, S);
      ph.style.opacity = inn(t, 42, .9, S) * lerp(1, .0, blur);
      ph.querySelector('img').style.filter = `brightness(${lerp(.82, .35, blur)}) saturate(.82) contrast(1.04) sepia(.06) blur(${14 * blur}px)`;
      kb(ph, t, 42, 45.75, [1.10, .62, .45, 500, 296], [1.10, .40, .45, 500, 296]);
      const lg = $('s7logo'); lg.style.opacity = inn(t, 42.4, 1, S) * out(t, 44.625, .375); lg.style.transform = `scale(${lerp(.96, 1, inn(t, 42.4, 1.2))})`;
      txt($('s7k'), t, 42.75, 44.625, { od: .375 }); txt($('s7l'), t, 43.5, 44.625, { od: .375 });
      const n1 = $('s7n1'), n2 = $('s7n2');
      txt(n1, t, 45, 47.5); txt($('s7n1l'), t, 45.4, 47.5);
      n1.textContent = Math.round(10000 * inn(t, 45, 1.5)).toLocaleString('en-US') + '+';
      txt(n2, t, 45.75, 47.5); txt($('s7n2l'), t, 46.15, 47.5);
      n2.textContent = Math.round(700 * inn(t, 45.75, 1.5)) + 'K+';
      const rl = $('s7rule'); rl.style.transform = `scaleY(${inn(t, 47.25, .5)})`; rl.style.opacity = .7 * out(t, 47.5);
      const ms = $('s7ms'); ms.style.opacity = inn(t, 47.9, .9, S) * out(t, 50.25, .5);
      kb(ms, t, 47.625, 51.375, [1.02, .55, .52, 270, 180], [1.08, .58, .52, 270, 180]);
      const nti = $('s7nti'); nti.style.opacity = inn(t, 48.5, .9, S) * out(t, 50.25, .5);
      kb(nti, t, 48.25, 51.375, [1.0, .5, .58, 200, 300], [1.06, .5, .56, 200, 290]);
      txt($('s7k2'), t, 48, 50.25); txt($('s7l2'), t, 48.75, 50.25); txt($('s7s2'), t, 49.5, 50.25);
    }

    // ── Scene 8 · Building ──
    if (t >= 51 && t < 60) {
      const lab = inn(t, 51, .9, S) * out(t, 53.625, .75, S);
      $('s8ph').style.opacity = lab; $('s8fade').style.opacity = lab;
      $('s8ph').querySelector('img').style.filter = 'saturate(.8) contrast(1.04) brightness(.8) sepia(.06)';
      kb($('s8ph'), t, 51, 54.4, [1.0, .5, .45, 510, 540], [1.06, .5, .42, 510, 520]);
      const bright = lerp(.18, .45, L(span(t, 58, 59.25)));
      const collapse = out(t, 59.625, .375, S);
      $('s8cam').style.transform = `scale(${1 + .06 * L(span(t, 57.75, 60))})`;
      $('s8cam').style.transformOrigin = '960px 575px';
      $('s8cam').style.opacity = collapse;
      for (const e of edges) { draw(e.el, inn(t, 54 + e.li * .5, .6, S)); e.el.style.opacity = bright; }
      layers.flat().forEach((n, i) => { n.el.style.opacity = inn(t, 53.8 + (i < 4 ? 0 : i < 12 ? .4 : .9), .5); });
      layers[2].forEach((n, i) => {
        const on = inn(t, 55 + i * .6, .5);
        n.el.setAttribute('fill', on > .01 ? `rgba(201,165,94,${on})` : '#0B0B0C');
        n.el.style.filter = on > .01 ? `drop-shadow(0 0 ${6 * on}px rgba(201,165,94,.8))` : '';
        const lab = outLabels[i];
        lab.style.opacity = on * out(t, 59.25);
        const newest = t < 55 + (i + 1) * .6 || i === 5;
        lab.style.fill = newest ? '#D6B676' : '#C2BEB6';
        lab.style.transform = `translateY(${(1 - on) * 12}px)`;
      });
      // travelling pulses: each one makes a trip of 2.2 s, input -> hidden -> output
      pulses.forEach((c, k) => {
        const tt = t - 54.6 - k * .55;
        if (tt < 0) { c.style.opacity = 0; return; }
        const trip = Math.floor(tt / 2.2), q = (tt % 2.2) / 2.2, [a, b, o] = routes[(trip * 4 + k) % routes.length];
        const [p, r] = q < .5 ? [a, b] : [b, o], u = (q % .5) * 2;
        c.setAttribute('cx', lerp(p.x, r.x, u)); c.setAttribute('cy', lerp(p.y, r.y, u));
        c.style.opacity = Math.sin(Math.PI * q) * .9;
      });
      txt($('s8h'), t, 51.4, 53.4); txt($('s8s'), t, 58, 59.25);
    }

    // ── Scene 9A · From Egypt to Canada ──
    if (t >= 60 && t < 66) {
      $('s9dots').style.opacity = .36 * inn(t, 60, 1.5, S);
      const cam = L(span(t, 63, 66));
      $('s9cam').style.transform = `translate(${90 * cam}px, ${40 * cam}px) scale(${1 + .10 * cam})`;
      $('s9asn').setAttribute('opacity', inn(t, 60.5, .5));
      const p = inn(t, 60.75, 2.25, bezier(.45, 0, .25, 1));
      draw(arcEl, p);
      const probe = arcEl._probe;
      tail.forEach((c, i) => {
        const l = p * arcLen - i * 7;
        if (p <= 0 || p >= 1 || l < 0) { c.setAttribute('opacity', 0); return; }
        const pt = probe.getPointAtLength(l);
        c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y);
        c.setAttribute('r', i === 0 ? 3.5 : 2.6 * (1 - i / tail.length));
        c.setAttribute('opacity', i === 0 ? 1 : .55 * (1 - i / tail.length));
        c.style.filter = i === 0 ? 'drop-shadow(0 0 10px rgba(201,165,94,.9))' : '';
      });
      const arr = L(span(t, 63, 64.5));
      $('s9pulse').setAttribute('r', lerp(10, 60, E(arr))); $('s9pulse').setAttribute('opacity', arr > 0 && arr < 1 ? .6 * (1 - arr) : 0);
      $('s9king').setAttribute('opacity', inn(t, 62.9, .4));
      draw(leafEl, inn(t, 63, 1.5));
      txt($('s9lab'), t, 63.4, 65.25);
      txt($('s9k'), t, 60.75, 65.25); txt($('s9h'), t, 61.5, 65.25);
    }

    // ── Scene 9B · Queen's (photo stays into scene 10) ──
    if (t >= 66 && t < 72) {
      const ph = $('s9ph');
      ph.style.opacity = inn(t, 66, .75, S) * out(t, 68.9, .85, S);
      $('s9fade').style.opacity = ph.style.opacity;
      kb(ph, t, 66, 70, [1.0, .60, .45, 590, 540], [1.05, .60, .42, 590, 520]);
      $('s9logo').style.opacity = inn(t, 66.375, 1, S) * out(t, 68.625, .375);
      txt($('s9h2'), t, 66.75, 68.625, { od: .375 }); txt($('s9l2'), t, 67.5, 68.625, { od: .375 }); txt($('s9s2'), t, 68.25, 68.7, { od: .3 });
      hair($('s9line'), t, 68.25, .6, 68.7, .3, '0 50%');
    }

    // ── Scene 10 · MinimalLM ──
    if (t >= 69 && t < 78) {
      const cp = $('s10ph'); cp.style.opacity = inn(t, 69.4, .9, S) * out(t, 71.4, .6, S);
      cp.querySelector('img').style.filter = 'saturate(.8) contrast(1.04) brightness(.9) sepia(.05)';
      kb(cp, t, 69, 72, [1.0, .5, .5, 420, 234], [1.04, .5, .5, 420, 234]);
      txt($('s10k'), t, 69, 71.625);
      const title = $('s10t'); title.style.opacity = out(t, 71.625); title.style.transform = '';
      letters.forEach((l, i) => { const p = inn(t, 69.75 + i * .04, .75); l.style.opacity = p; l.style.transform = `translateY(${(1 - p) * 18}px)`; });
      const gp = span(t, 70.875, 72);
      $('s10glint').style.opacity = t > 70.875 && t < 72 ? .8 * Math.sin(Math.PI * gp) : 0;
      $('s10glint').style.backgroundPosition = `${lerp(100, 0, S(gp))}% 0`;
      txt($('s10q'), t, 70.5, 71.625); marker($('s10mk'), t, 71.25);
      // tokens
      const fall = span(t, 73.5, 74.25);
      row.style.transform = `translateX(${lerp(rowX0, rowX1, E(fall))}px)`;
      pills.forEach((p, i) => {
        const a = inn(t, 72 + i * .06, .3, S), tail = i >= 7;
        const f = tail ? inn(t, 73.5 + (i - 7) * .04, .6, S) : 0;
        p.style.left = p._x + 'px';
        p.style.opacity = a * (tail ? lerp(1, .12, f) : 1) * out(t, 75, .4);
        p.style.transform = `translateY(${(1 - a) * 10 + 12 * f}px)`;
        const lit = tail ? 0 : inn(t, 73.5, .75, S);
        p.style.color = lit ? `rgb(${lerp(194, 238, lit)},${lerp(190, 234, lit)},${lerp(182, 226, lit)})` : '';
        p.style.borderColor = lit ? `rgba(201,165,94,${.6 * lit})` : '';
      });
      const g = inn(t, 72.6, .6);
      gate.style.left = gateX + 'px'; gate.style.opacity = g * out(t, 75, .4); gate.style.transform = `translateY(${(g - 1) * 20}px)`;
      txt($('s10a'), t, 73.6, 75, { od: .4 }); txt($('s10b'), t, 74.0, 75, { od: .4 });
      // a line of wisdom beside the photo with the jet (no mention of where it was taken)
      const vp = $('s10vp'); vp.style.opacity = inn(t, 75.3, .9, S) * out(t, 77.5, .4);
      kb(vp, t, 75, 78.4, [1.0, .3, .45, 280, 322], [1.05, .3, .44, 280, 316]);
      txt($('s10qq'), t, 75.45, 77.5, { od: .4 }); marker($('s10qmk'), t, 76.6);
      txt($('s10qa'), t, 76.2, 77.5, { od: .4 });
    }

    // ── Scene 11 · A Purpose ──
    if (t >= 78) {
      const hp = $('s11ph'), ho = inn(t, 78.2, .8, S) * out(t, 80.7, .8, S);
      hp.style.opacity = ho; $('s11fade').style.opacity = ho;
      kb(hp, t, 78, 81.5, [1.40, .47, .27, 500, 420], [1.46, .47, .27, 500, 410]);
      txt($('s11a'), t, 78.75, 80.625, { od: .375 }); txt($('s11b'), t, 79.5, 80.625, { od: .375 }); txt($('s11c'), t, 80.25, 80.625, { od: .375 });
      txt($('s11p1'), t, 81, 83.25); txt($('s11p2'), t, 81.75, 83.25); marker($('s11mk'), t, 82.5);
      const leftOut = out(t, 88.25, .75, S);
      const sig = $('sig'), sp = lerp(-120, 1620, S(span(t, 84, 86.25)));
      sig.style.opacity = t >= 84 ? .06 * out(t, 88.25, 1, S) : 0;
      sig.style.webkitMaskImage = sig.style.maskImage = `linear-gradient(90deg, #000 ${sp}px, transparent ${sp + 120}px)`;
      const em = $('s11emblem'), ei = inn(t, 84, 1.5, S);
      em.style.opacity = ei * leftOut; em.style.filter = `blur(${(1 - ei) * 6}px)`;
      sweep(em.querySelector('.sweep'), t, 86.25, 1.5, .4);
      const wm = $('s11wm'), wp = lerp(-80, 680, S(span(t, 84.75, 86.25)));
      wm.style.webkitMaskImage = wm.style.maskImage = `linear-gradient(90deg, #000 ${wp}px, transparent ${wp + 80}px)`;
      wm.style.opacity = t >= 84.75 ? leftOut : 0;
      hair($('s11hair'), t, 84.75, 1.5); $('s11hair').style.opacity = leftOut;
      txt($('s11url'), t, 85.5, 88.25, { od: .75 }); txt($('s11mail'), t, 86.25, 88.25, { od: .75 }); txt($('s11li'), t, 86.4, 88.25, { od: .75 });
      const bot = $('s11bot'), bp = inn(t, 87, 1, S);
      bot.style.opacity = .92 * bp * leftOut; bot.style.transform = `translateY(${-10 * L(span(t, 87, 89))}px)`;
      txt($('s11ask'), t, 87.2, 88.25, { od: .75 });
      if (SHORT) { hp.style.opacity = 0; $('s11fade').style.opacity = 0; bot.style.opacity = 0; $('s11ask').style.opacity = 0; }
    } else $('sig').style.opacity = 0;
  });
})();
