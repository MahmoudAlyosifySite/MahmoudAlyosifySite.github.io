/* ============================================================
   Draws the closing artwork's scene into index.html.

       node tools/build-closing-scene.mjs

   The scene is an inline SVG on a 1700 × 500 "world": the three
   pyramids of Giza in gold, a perspective floor, light from the
   capstone, a neural network rising off it as an inverted pyramid,
   a line of light to his raised hand, circuit traces behind him,
   and a line from Ptahhotep carved down the left edge. The
   photograph and the signature sit over it in the page itself.

   Everything is computed here, so edit this file — not the SVG —
   and re-run it. It replaces <svg class="ff__scene">…</svg> in
   index.html and nothing else. Coordinates are scene units.
   ============================================================ */

import fs from 'node:fs';

const PAGE = 'index.html';
const INDENT = '                ';
const r1 = (n) => Math.round(n * 10) / 10;
const pt = (p) => `${r1(p[0])} ${r1(p[1])}`;
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// seeded PRNG
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

const HZ = 412;               // horizon
const APEX = [985, 176];      // the Great Pyramid's apex

const out = [];
const P = (s) => out.push(s);

P(`<svg class="ff__scene" viewBox="0 0 1700 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">`);
P(`<defs>
<radialGradient id="ff-sky" cx="985" cy="250" r="640" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#C9A55E" stop-opacity=".2"/><stop offset=".45" stop-color="#C9A55E" stop-opacity=".06"/><stop offset="1" stop-color="#C9A55E" stop-opacity="0"/></radialGradient>
<radialGradient id="ff-halo" cx="1400" cy="170" r="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#D6B676" stop-opacity=".16"/><stop offset="1" stop-color="#D6B676" stop-opacity="0"/></radialGradient>
<radialGradient id="ff-apex" cx="${APEX[0]}" cy="${APEX[1]}" r="120" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF1CC" stop-opacity=".95"/><stop offset=".18" stop-color="#F2D493" stop-opacity=".5"/><stop offset="1" stop-color="#C9A55E" stop-opacity="0"/></radialGradient>
<radialGradient id="ff-ray" cx="${APEX[0]}" cy="${APEX[1]}" r="430" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F6DFA4" stop-opacity=".55"/><stop offset=".5" stop-color="#C9A55E" stop-opacity=".12"/><stop offset="1" stop-color="#C9A55E" stop-opacity="0"/></radialGradient>
<radialGradient id="ff-pool" cx="990" cy="${HZ + 6}" r="470" gradientTransform="matrix(1 0 0 .12 0 ${r1((HZ + 6) * 0.88)})" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#E2C27E" stop-opacity=".5"/><stop offset="1" stop-color="#C9A55E" stop-opacity="0"/></radialGradient>
<linearGradient id="ff-hz" x1="0" y1="0" x2="1700" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#C9A55E" stop-opacity="0"/><stop offset=".25" stop-color="#C9A55E" stop-opacity=".35"/><stop offset=".58" stop-color="#F2DFA8" stop-opacity=".9"/><stop offset=".85" stop-color="#C9A55E" stop-opacity=".35"/><stop offset="1" stop-color="#C9A55E" stop-opacity="0"/></linearGradient>
<linearGradient id="ff-lit" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#F7E8BE"/><stop offset=".28" stop-color="#DDBA72"/><stop offset=".68" stop-color="#B18A43"/><stop offset="1" stop-color="#7A5C2C"/></linearGradient>
<linearGradient id="ff-shade" x1="0" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="#A07E3E"/><stop offset=".42" stop-color="#5E4721"/><stop offset="1" stop-color="#2A2010"/></linearGradient>
<linearGradient id="ff-floor" x1="0" y1="${HZ}" x2="0" y2="500" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".25" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>
<linearGradient id="ff-floor-x" x1="0" y1="0" x2="1700" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".35"/><stop offset=".55" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient>
<mask id="ff-floor-m" maskUnits="userSpaceOnUse" x="0" y="${HZ}" width="1700" height="${500 - HZ}"><rect x="0" y="${HZ}" width="1700" height="${500 - HZ}" fill="url(#ff-floor)"/></mask>
<mask id="ff-floor-mx" maskUnits="userSpaceOnUse" x="0" y="${HZ}" width="1700" height="${500 - HZ}"><rect x="0" y="${HZ}" width="1700" height="${500 - HZ}" fill="url(#ff-floor-x)"/></mask>
<linearGradient id="ff-link" x1="1087" y1="48" x2="1210" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#D6B676" stop-opacity=".2"/><stop offset="1" stop-color="#FFF1CC"/></linearGradient>
<filter id="ff-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="ff-bloom" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="9"/></filter>
<symbol id="ff-star" viewBox="-10 -10 20 20" overflow="visible"><path d="M-10 0L-.9-.9 0-10 .9-.9 10 0 .9.9 0 10-.9.9Z"/></symbol>
</defs>`);

// ── sky glow
P(`<rect width="1700" height="500" fill="url(#ff-sky)"/>`);
P(`<rect width="1700" height="500" fill="url(#ff-halo)"/>`);

// ── light rays from the apex (behind everything that stands)
{
  const rays = [-74, -61, -47, -33, 33, 47, 61, 74, -88, 88];
  const widths = [1.6, 2.4, 1.2, 2.8, 2.8, 1.2, 2.4, 1.6, 1, 1];
  let d = '';
  rays.forEach((deg, i) => {
    const a = (deg - 90) * Math.PI / 180;
    const w = widths[i] * Math.PI / 180;
    const L = 470;
    const p1 = [APEX[0] + Math.cos(a - w) * L, APEX[1] + Math.sin(a - w) * L];
    const p2 = [APEX[0] + Math.cos(a + w) * L, APEX[1] + Math.sin(a + w) * L];
    d += `M${pt(APEX)}L${pt(p1)}L${pt(p2)}Z`;
  });
  P(`<path class="ff__rays ff-fade" fill="url(#ff-ray)" d="${d}"/>`);
}

// ── particles: a field of data points, denser near the light
{
  let d = '', dBright = '';
  for (let i = 0; i < 120; i++) {
    let x, y;
    if (i < 55) {            // around the network and the apex
      const ang = rnd() * Math.PI * 2, rad = Math.pow(rnd(), 0.7) * 330;
      x = APEX[0] + Math.cos(ang) * rad * 1.5; y = 150 + Math.sin(ang) * rad * 0.55;
    } else { x = rnd() * 1700; y = rnd() * (HZ - 20); }
    if (y < 4 || y > HZ - 6 || x < 4 || x > 1696) continue;
    const r = 0.45 + rnd() * 1.0;
    const seg = `M${r1(x - r)} ${r1(y)}a${r1(r)} ${r1(r)} 0 1 0 ${r1(2 * r)} 0a${r1(r)} ${r1(r)} 0 1 0 ${r1(-2 * r)} 0`;
    if (rnd() < 0.22) dBright += seg; else d += seg;
  }
  P(`<g class="ff-fade" style="--dd:.2s"><path fill="#D6B676" opacity=".38" d="${d}"/><path fill="#FFF1CC" opacity=".75" d="${dBright}"/></g>`);
}

// ── circuit traces: behind him, peeking around his head, and running off the edges
{
  const traces = [
    'M1700 62H1622L1590 94V142',
    'M1700 104H1646L1626 124V196',
    'M1528 0V30L1556 58H1612',
    'M1700 232H1668L1650 214V160',
    'M1478 0V18L1494 34',
  ];
  const nodes = [[1590, 142], [1626, 196], [1612, 58], [1650, 160], [1494, 34]];
  P(`<g class="ff__traces" fill="none" stroke="#C9A55E" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity=".5">`);
  traces.forEach((d, i) => P(`<path d="${d}" pathLength="1" data-draw style="--dd:${(0.5 + i * 0.12).toFixed(2)}s"/>`));
  P(`</g>`);
  P(`<g class="ff__vias ff-fade" style="--dd:1.3s" fill="#0A0A0B" stroke="#D6B676" stroke-width="1.1">${nodes.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2"/>`).join('')}</g>`);
  P(`<g class="ff-fade" style="--dd:1.3s" fill="#D6B676">${nodes.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1"/>`).join('')}</g>`);
}

// ── the floor: a horizon of light and a perspective grid
{
  let d = '';
  const vp = [APEX[0], HZ];
  for (let k = -16; k <= 16; k++) {
    const bx = vp[0] + k * 96;
    // start a little below the horizon so the lines don't knot at the vanishing point
    const t0 = 0.12;
    const s = lerp(vp, [bx, 500], t0);
    d += `M${pt(s)}L${r1(bx)} 500`;
  }
  for (let k = 1; k <= 8; k++) {
    const y = HZ + (500 - HZ) * Math.pow(k / 8, 1.9);
    d += `M0 ${r1(y)}H1700`;
  }
  P(`<g mask="url(#ff-floor-mx)"><path class="ff-fade" style="--dd:.35s" mask="url(#ff-floor-m)" fill="none" stroke="#C9A55E" stroke-width=".8" opacity=".5" d="${d}"/></g>`);
  P(`<rect class="ff-fade" style="--dd:.2s" x="0" y="${HZ - 60}" width="1700" height="120" fill="url(#ff-pool)"/>`);
}

// ── the pyramids
function pyramid({ A, L, F, R, courses, cap = 0, hidden = false, id }) {
  const g = [];
  g.push(`<g class="ff__pyr">`);
  g.push(`<path fill="url(#ff-shade)" d="M${pt(A)}L${pt(F)}L${pt(R)}Z"/>`);
  g.push(`<path fill="url(#ff-lit)" d="M${pt(A)}L${pt(L)}L${pt(F)}Z"/>`);
  // stone courses, parallel to each base edge
  let dl = '', dr = '';
  for (let i = 1; i < courses; i++) {
    const t = Math.pow(i / courses, 0.92);
    if (t < cap + 0.01) continue;
    dl += `M${pt(lerp(A, L, t))}L${pt(lerp(A, F, t))}`;
    dr += `M${pt(lerp(A, F, t))}L${pt(lerp(A, R, t))}`;
  }
  g.push(`<path fill="none" stroke="#4A3612" stroke-width=".7" opacity=".38" d="${dl}"/>`);
  g.push(`<path fill="none" stroke="#F2DFA8" stroke-width=".6" opacity=".09" d="${dr}"/>`);
  // rim light on the lit edge and the ridge
  g.push(`<path fill="none" stroke="#FBEFD0" stroke-width="1.1" stroke-linecap="round" opacity=".85" d="M${pt(A)}L${pt(L)}M${pt(A)}L${pt(F)}"/>`);
  g.push(`<path fill="none" stroke="#C9A55E" stroke-width=".8" opacity=".5" d="M${pt(A)}L${pt(R)}"/>`);
  if (hidden) {
    const B = [L[0] + R[0] - F[0], L[1] + R[1] - F[1] - 6];
    g.push(`<path class="ff-fade" style="--dd:1.1s" fill="none" stroke="#E2C27E" stroke-width=".8" stroke-dasharray="3 4" opacity=".55" d="M${pt(A)}L${pt(B)}M${pt(L)}L${pt(B)}L${pt(R)}"/>`);
  }
  if (cap) {
    const cl = lerp(A, L, cap), cf = lerp(A, F, cap), cr = lerp(A, R, cap);
    g.push(`<path fill="#FFF4D6" d="M${pt(A)}L${pt(cl)}L${pt(cf)}Z"/><path fill="#E6C27C" d="M${pt(A)}L${pt(cf)}L${pt(cr)}Z"/>`);
  }
  g.push(`</g>`);
  return g.join('');
}

const khafre = { A: [1150, 222], L: [1004, 410], F: [1180, 416], R: [1300, 408], courses: 22 };
const khufu = { A: APEX, L: [800, 412], F: [1022, 422], R: [1172, 410], courses: 27, cap: 0.085, hidden: true };
const menkaure = { A: [812, 334], L: [742, 414], F: [824, 419], R: [874, 413], courses: 10 };

P(pyramid(khafre));
P(pyramid(khufu));
P(pyramid(menkaure));

// vertices of the Great Pyramid, marked as on a model
{
  const v = [khufu.L, khufu.F, khufu.R, khafre.R, menkaure.L];
  P(`<g class="ff-fade" style="--dd:1.1s" fill="#0A0A0B" stroke="#F2DFA8" stroke-width="1">${v.map((p) => `<circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="2.6"/>`).join('')}</g>`);
}

// ── the network: an inverted pyramid of light standing on the capstone
const layers = [[APEX]];
{
  const spec = [[3, 132], [5, 90], [7, 48]];
  for (const [n, y] of spec) {
    const h = APEX[1] - y, half = 0.8 * h;
    const row = [];
    for (let i = 0; i < n; i++) row.push([APEX[0] - half + (2 * half * i) / (n - 1), y]);
    layers.push(row);
  }
  layers.forEach((row, li) => {
    if (li === 0) return;
    let d = '';
    for (const a of layers[li - 1]) for (const b of row) d += `M${pt(a)}L${pt(b)}`;
    P(`<path class="ff__syn" pathLength="1" data-draw style="--dd:${(0.55 + li * 0.32).toFixed(2)}s" fill="none" stroke="#D6B676" stroke-width=".7" opacity="${li === 3 ? '.3' : '.38'}" d="${d}"/>`);
  });
  // the outline, the mirror of the pyramid's edges
  const top = layers[3];
  P(`<path pathLength="1" data-draw style="--dd:.5s" fill="none" stroke="#F2DFA8" stroke-width="1" opacity=".7" d="M${pt(top[0])}L${pt(APEX)}L${pt(top[top.length - 1])}"/>`);
  // the hand reaches the network: a line of light from its last neuron to his raised hand
  const last = top[top.length - 1];
  P(`<path class="ff__link" pathLength="1" data-draw style="--dd:1.75s" fill="none" stroke="url(#ff-link)" stroke-width="1.6" stroke-linecap="round" d="M${pt(last)}C1132 30 1174 22 1210 32"/>`);
  P(`<path pathLength="1" data-draw style="--dd:1.75s" fill="none" stroke="#F6DFA4" stroke-width="5" opacity=".35" filter="url(#ff-glow)" d="M${pt(last)}C1132 30 1174 22 1210 32"/>`);
  // neurons
  layers.forEach((row, li) => {
    if (li === 0) return;
    P(`<g class="ff-fade" style="--dd:${(0.75 + li * 0.32).toFixed(2)}s">` +
      row.map(([x, y], i) => {
        const big = (li + i) % 2 === 0;
        return `<circle cx="${r1(x)}" cy="${r1(y)}" r="${big ? 5.5 : 4}" fill="#F2DFA8" opacity=".22" filter="url(#ff-glow)"/><circle cx="${r1(x)}" cy="${r1(y)}" r="${big ? 2.6 : 2}" fill="#FFF1CC"/>`;
      }).join('') + `</g>`);
  });
}

// ── the capstone's light
P(`<circle class="ff-fade" style="--dd:.3s" cx="${APEX[0]}" cy="${APEX[1]}" r="120" fill="url(#ff-apex)"/>`);
P(`<g class="ff-fade" style="--dd:.45s" fill="#FFF4D6">
<use href="#ff-star" x="${APEX[0] - 34}" y="${APEX[1] - 34}" width="68" height="68" opacity=".9"/>
<use href="#ff-star" x="${APEX[0] - 70}" y="${APEX[1] - 6}" width="140" height="12" opacity=".55"/>
<use href="#ff-star" x="1198" y="20" width="24" height="24" opacity=".85"/>
<use href="#ff-star" x="${r1(layers[3][3][0] - 7)}" y="${r1(layers[3][3][1] - 7)}" width="14" height="14" opacity=".7"/>
<use href="#ff-star" x="${r1(layers[2][1][0] - 5)}" y="${r1(layers[2][1][1] - 5)}" width="10" height="10" opacity=".6"/>
</g>`);

// ── a line from Ptahhotep, carved as on a temple wall:
//    wr mꜣꜥt wꜣḥ spdt — "Great is Maat, lasting in effect"
//    Spellings (Allen, Middle Egyptian, via Wiktionary): wr:r · U2:mAa-a:t:Y1 · wAH-H-Y1V · M44-t:Y1
{
  // ink boxes at font-size 100, text-anchor middle, baseline 0 (measured in Noto Sans Egyptian Hieroglyphs)
  const INK = {
    '𓅨': [-56, 56, -94, -16], '𓂋': [-55, 55, -29, 0], '𓌴': [-62, 62, -84, -10], '𓐙': [-59, 58, -25, 0],
    '𓂝': [-71, 71, -58, 0], '𓏏': [-28, 27, -46, -20], '𓏛': [-56, 56, -50, -20],
    '𓎝': [-25, 26, -100, 1], '𓎛': [-18, 18, -100, 0], '𓇮': [-22, 23, -99, 19],
  };
  const F = 34;                       // the column's sign size, in scene units
  const CX = 58;                      // the column's axis
  const glyphs = [];
  // place sign g so its ink box is centred on cx with its top at top, scaled by s (of F)
  const put = (g, cx, top, s = 1, rot = 0) => {
    const [l, r, t, b] = INK[g];
    const k = (F * s) / 100;
    const fs = r1(F * s);
    if (!rot) {
      glyphs.push(`<text x="${r1(cx - ((l + r) / 2) * k)}" y="${r1(top - t * k)}" font-size="${fs}">${g}</text>`);
      return (b - t) * k;
    }
    // turned upright: rotate about the ink centre
    const icx = ((l + r) / 2) * k, icy = ((t + b) / 2) * k;
    const h = (r - l) * k;
    glyphs.push(`<text transform="translate(${r1(cx)} ${r1(top + h / 2)}) rotate(-90) translate(${r1(-icx)} ${r1(-icy)})" font-size="${fs}">${g}</text>`);
    return h;
  };
  const W = (g, s = 1) => (INK[g][1] - INK[g][0]) * F * s / 100;
  const gap = F * 0.2;
  let y = 138;
  // wr:r
  y += put('𓅨', CX, y, 0.9) + gap * 0.3;
  y += put('𓂋', CX, y, 0.8) + gap;
  // U2:mAa
  y += put('𓌴', CX, y, 0.9) + gap * 0.3;
  y += put('𓐙', CX, y, 0.82) + gap;
  // a:t:Y1
  y += put('𓂝', CX, y, 0.72) + gap * 0.25;
  y += put('𓏏', CX, y, 0.8) + gap * 0.25;
  y += put('𓏛', CX, y, 0.72) + gap;
  // wAH-H-Y1V, side by side
  {
    const s = 0.82, sy = 0.62;
    const w1 = W('𓎝', s), w2 = W('𓎛', s), w3 = (INK['𓏛'][3] - INK['𓏛'][2]) * F * sy / 100;
    const sp = F * 0.08, total = w1 + w2 + w3 + 2 * sp;
    let x = CX - total / 2;
    const h = put('𓎝', x + w1 / 2, y, s); x += w1 + sp;
    put('𓎛', x + w2 / 2, y, s); x += w2 + sp;
    const hr = (INK['𓏛'][1] - INK['𓏛'][0]) * F * sy / 100;
    put('𓏛', x + w3 / 2, y + (h - hr), sy, 1);
    y += h + gap;
  }
  // M44-t:Y1 — the thorn, and t over the roll beside it
  {
    const s = 0.82, s2 = 0.5;
    const w1 = W('𓇮', s), w2 = W('𓏛', s2), sp = F * 0.1, total = w1 + w2 + sp;
    let x = CX - total / 2;
    const h = put('𓇮', x + w1 / 2, y, s); x += w1 + sp;
    const ht = (INK['𓏏'][3] - INK['𓏏'][2]) * F * 0.62 / 100, hy = (INK['𓏛'][3] - INK['𓏛'][2]) * F * s2 / 100;
    const top2 = y + h - ht - hy - F * 0.06;
    put('𓏏', x + w2 / 2, top2, 0.62);
    put('𓏛', x + w2 / 2, y + h - hy, s2);
    y += h;
  }
  P(`<g class="ff__glyphs ff-fade" style="--dd:.6s" fill="#D6B676" opacity=".34" text-anchor="middle">${glyphs.join('')}</g>`);
}

// ── the horizon line, over the pyramids' feet
P(`<path class="ff-fade" style="--dd:.25s" fill="none" stroke="url(#ff-hz)" stroke-width="1.2" d="M0 ${HZ + 1}H1700"/>`);

P(`</svg>`);

const svg = out.join('\n').split('\n').map((l, i) => (i ? INDENT + l : l)).join('\n');
const html = fs.readFileSync(PAGE, 'utf8');
const start = html.indexOf('<svg class="ff__scene"');
if (start < 0) throw new Error(`${PAGE}: no <svg class="ff__scene"> to replace`);
const end = html.indexOf('</svg>', start) + '</svg>'.length;
const next = html.slice(0, start) + svg + html.slice(end);
if (next === html) console.log(`${PAGE} already has this scene`);
else { fs.writeFileSync(PAGE, next, 'utf8'); console.log(`✓ closing scene → ${PAGE} (${(svg.length / 1024).toFixed(1)} KB)`); }
