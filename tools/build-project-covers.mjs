/* ============================================================
   Draws a cover for every project, and one for the paper.

       node tools/build-project-covers.mjs            all of them
       node tools/build-project-covers.mjs simclr     just one

   Each cover is a plate in the site's own hand: night and gold,
   the title in Gloock, a figure that says what the work did, a
   drawing of the idea in gold line, and his signature in the
   corner. They are composed here as HTML + SVG, photographed by
   headless Chrome (or Edge) at 1600 × 1000, and saved as WebP:

       img/_web/projects/<slug>.webp       1600 × 1000
       img/_web/projects/<slug>@800.webp    800 × 500

   Fonts come from Google Fonts, so the machine needs the network.
   Edit the drawings here and re-run; never edit the pictures.
   ============================================================ */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const OUT = 'img/_web/projects';
const W = 1600, H = 1000;
const SIGNATURE = pathToFileURL(path.resolve('img/prologue/signature.svg')).href;

const GOLD = '#C9A55E', GOLD_INK = '#D6B676', PALE = '#F2DFA8', LIGHT = '#FFF1CC';
const INK = '#EEEAE2', INK2 = '#C2BEB6', INK3 = '#908C85';

const r1 = (n) => Math.round(n * 10) / 10;
let seed = 1;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const reseed = (s) => { seed = s; };

/* ── drawing helpers ─────────────────────────────────────── */
const glow = (x, y, k = 1, o = 1) =>
  `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(7 * k)}" fill="${PALE}" opacity="${r1(0.26 * o * 100) / 100}" filter="url(#g-soft)"/>` +
  `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(3 * k)}" fill="${LIGHT}" opacity="${o}"/>`;
const line = (x1, y1, x2, y2, o = 0.5, w = 1.4, extra = '') =>
  `<path d="M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}" stroke="${GOLD}" stroke-width="${w}" opacity="${o}" fill="none" ${extra}/>`;
const mono = (x, y, s, size = 17, o = 0.75, anchor = 'start', fill = GOLD_INK) =>
  `<text x="${r1(x)}" y="${r1(y)}" font-family="Chivo Mono" font-size="${size}" letter-spacing="2" fill="${fill}" opacity="${o}" text-anchor="${anchor}">${s}</text>`;
const arrow = (x1, y1, x2, y2, o = 0.7) => {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 12;
  const p1 = [x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45)];
  const p2 = [x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45)];
  return line(x1, y1, x2, y2, o, 1.6) +
    `<path d="M${r1(p1[0])} ${r1(p1[1])}L${r1(x2)} ${r1(y2)}L${r1(p2[0])} ${r1(p2[1])}" stroke="${GOLD}" stroke-width="1.6" fill="none" opacity="${o}" stroke-linecap="round" stroke-linejoin="round"/>`;
};
/** a field of faint stars over the drawing's half of the plate */
const dust = (n, x0 = 620, x1 = 1560, y0 = 60, y1 = 940) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0), big = rnd() > 0.9;
    s += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${big ? 1.6 : 0.9}" fill="${PALE}" opacity="${r1((0.12 + rnd() * 0.3) * 100) / 100}"/>`;
  }
  return s;
};
const star = (x, y, s = 40, o = 0.9) =>
  `<path d="M${x} ${y - s}C${x + s * 0.08} ${y - s * 0.08} ${x + s * 0.08} ${y - s * 0.08} ${x + s} ${y}C${x + s * 0.08} ${y + s * 0.08} ${x + s * 0.08} ${y + s * 0.08} ${x} ${y + s}C${x - s * 0.08} ${y + s * 0.08} ${x - s * 0.08} ${y + s * 0.08} ${x - s} ${y}C${x - s * 0.08} ${y - s * 0.08} ${x - s * 0.08} ${y - s * 0.08} ${x} ${y - s}Z" fill="${LIGHT}" opacity="${o}"/>`;

const DEFS = `<defs>
<filter id="g-soft" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="g-wide" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
<linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6E7BF"/><stop offset=".55" stop-color="${GOLD}"/><stop offset="1" stop-color="#8E6E34"/></linearGradient>
<linearGradient id="g-gold-h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${GOLD}" stop-opacity="0"/><stop offset=".25" stop-color="${GOLD}"/><stop offset=".75" stop-color="${GOLD}"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></linearGradient>
<linearGradient id="g-fade-d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GOLD}" stop-opacity=".28"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></linearGradient>
<linearGradient id="g-mask-l" x1="0" y1="0" x2="1" y2="0"><stop offset=".36" stop-color="#000"/><stop offset=".43" stop-color="#fff"/></linearGradient>
<radialGradient id="g-sigfade"><stop offset="0" stop-color="#000" stop-opacity=".9"/><stop offset=".55" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<mask id="m-art" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><rect width="1600" height="1000" fill="url(#g-mask-l)"/><ellipse cx="1360" cy="896" rx="290" ry="120" fill="url(#g-sigfade)"/></mask>
<clipPath id="c-plate"><rect x="35" y="35" width="1530" height="930"/></clipPath>
<radialGradient id="g-iris" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="${LIGHT}"/><stop offset=".35" stop-color="${PALE}"/><stop offset="1" stop-color="#8E6E34"/></radialGradient>
</defs>`;

/* ── the drawings ─────────────────────────────────────────
   Each returns SVG drawn on the plate's own 1600 × 1000 units.
   The text sits on the left; the drawing on the right two-thirds. */

const ART = {
  /* MinimalLM — the answer stops where it is complete, not where it runs out */
  minimallm() {
    reseed(11);
    let s = dust(70);
    const x0 = 700, cw = 46, gap = 9, step = cw + gap;
    // the model's uncertainty over the answer: it settles where the answer ends
    let d = '';
    for (let i = 0; i <= 80; i++) {
      const x = x0 + i * 10;
      const t = i / 80;
      const y = 250 + Math.sin(i * 0.42) * 20 * (1 - t * 0.5) + Math.sin(i * 1.13 + 1) * 6 - (x > 1060 ? Math.min(1, (x - 1060) / 40) * 30 : 0);
      d += `${i ? 'L' : 'M'}${r1(x)} ${r1(y)}`;
    }
    s += `<path d="${d}" fill="none" stroke="${GOLD}" stroke-width="1.6" opacity=".45"/>`;
    s += mono(x0, 196, 'ENTROPY', 15, 0.55);
    // baseline: the whole long answer
    s += mono(x0, 432, 'BASELINE', 15, 0.5);
    for (let i = 0; i < 15; i++) {
      const x = x0 + i * step;
      s += `<rect x="${x}" y="450" width="${cw}" height="${cw}" rx="3" fill="none" stroke="${GOLD}" stroke-width="1.3" opacity="${r1((0.42 - i * 0.012) * 100) / 100}"/>`;
      s += line(x + 12, 473, x + cw - 12, 473, 0.25, 1.2);
    }
    // MinimalLM: the same answer, complete, half as long
    s += mono(x0, 572, 'MINIMALLM', 15, 0.9);
    const n = 7;
    for (let i = 0; i < n; i++) {
      const x = x0 + i * step;
      s += `<rect x="${x}" y="590" width="${cw}" height="${cw}" rx="3" fill="${GOLD}" fill-opacity=".14" stroke="${PALE}" stroke-width="1.6"/>`;
      s += line(x + 12, 613, x + cw - 12, 613, 0.7, 1.4);
    }
    const xp = x0 + n * step;       // the full stop
    s += `<rect x="${xp}" y="590" width="${cw}" height="${cw}" rx="3" fill="${GOLD}" fill-opacity=".2" stroke="${PALE}" stroke-width="1.6"/>`;
    s += `<circle cx="${xp + cw / 2}" cy="${590 + cw - 12}" r="4.5" fill="${LIGHT}"/>`;
    const xs = xp + step;           // the stop token
    s += `<rect x="${xs - 6}" y="584" width="${cw + 12}" height="${cw + 12}" rx="5" fill="${PALE}" opacity=".35" filter="url(#g-wide)"/>`;
    s += `<rect x="${xs}" y="590" width="${cw}" height="${cw}" rx="3" fill="url(#g-gold)"/>`;
    s += `<rect x="${xs + 15}" y="605" width="16" height="16" rx="1.5" fill="#0B0B0C"/>`;
    s += mono(xs + cw / 2, 668, 'EOS', 14, 0.9, 'middle');
    // the completeness gate: stopping is allowed only here
    const xg = xp + cw + gap / 2;
    s += `<path d="M${xg} 190V720" stroke="${PALE}" stroke-width="1.4" stroke-dasharray="5 7" opacity=".8"/>`;
    s += glow(xg, 190, 1.2) + glow(xg, 720, 1.2);
    s += mono(xg + 14, 744, 'COMPLETE · STOP', 15, 0.8);
    // what was never generated
    for (let i = n + 2; i < 15; i++) {
      const x = x0 + i * step;
      s += `<rect x="${x}" y="590" width="${cw}" height="${cw}" rx="3" fill="none" stroke="${GOLD}" stroke-width="1.1" stroke-dasharray="4 5" opacity="${r1((0.3 - (i - n - 2) * 0.035) * 100) / 100}"/>`;
    }
    const bx0 = x0 + (n + 2) * step, bx1 = x0 + 15 * step - gap;
    s += `<path d="M${bx0} 662V672H${bx1}V662" fill="none" stroke="${GOLD}" stroke-width="1.2" opacity=".55"/>`;
    s += mono((bx0 + bx1) / 2, 700, 'NEVER GENERATED', 15, 0.6, 'middle');
    return s;
  },

  /* HORUS Sentinel — the eye over a living graph, agents circling it */
  'horus-sentinel'() {
    reseed(23);
    let s = dust(60);
    const cx = 1090, cy = 430;
    // the knowledge graph around the eye
    const nodes = [];
    for (let i = 0; i < 26; i++) {
      const a = rnd() * Math.PI * 2, rr = 250 + rnd() * 170;
      nodes.push([cx + Math.cos(a) * rr * 1.25, cy + Math.sin(a) * rr * 0.82]);
    }
    nodes.forEach((p, i) => {
      nodes.forEach((q, j) => {
        if (j <= i) return;
        const dd = Math.hypot(p[0] - q[0], p[1] - q[1]);
        if (dd < 175) s += line(p[0], p[1], q[0], q[1], 0.22, 1.1);
      });
    });
    nodes.slice(0, 7).forEach((p) => { s += line(p[0], p[1], cx - 10, cy - 20, 0.1, 1); });
    nodes.forEach((p, i) => { s += glow(p[0], p[1], i % 4 === 0 ? 1.15 : 0.8, i % 3 ? 0.75 : 1); });
    // agents on their orbit
    s += `<ellipse cx="${cx}" cy="${cy}" rx="440" ry="250" fill="none" stroke="${GOLD}" stroke-width="1.2" stroke-dasharray="3 9" opacity=".5"/>`;
    for (let i = 0; i < 6; i++) {
      const a = -0.5 + i * 1.05;
      const x = cx + Math.cos(a) * 440, y = cy + Math.sin(a) * 250, r = 13;
      let hx = '';
      for (let k = 0; k < 6; k++) { const b = (k / 6) * Math.PI * 2 + Math.PI / 6; hx += `${k ? 'L' : 'M'}${r1(x + Math.cos(b) * r)} ${r1(y + Math.sin(b) * r)}`; }
      s += `<path d="${hx}Z" fill="#0B0B0C" stroke="${PALE}" stroke-width="1.6"/><circle cx="${r1(x)}" cy="${r1(y)}" r="3" fill="${LIGHT}"/>`;
    }
    // the wedjat eye, drawn in gold
    const e = (dx, dy) => `${r1(cx - 300 + dx)} ${r1(cy - 200 + dy)}`;
    s += `<g fill="none" stroke="url(#g-gold)" stroke-linecap="round" stroke-linejoin="round">
<path d="M${e(42, 92)}C${e(170, 34)} ${e(420, 26)} ${e(574, 70)}" stroke-width="22"/>
<path d="M${e(70, 196)}C${e(170, 112)} ${e(390, 104)} ${e(540, 176)}L${e(606, 172)}" stroke-width="13"/>
<path d="M${e(70, 196)}C${e(170, 262)} ${e(370, 268)} ${e(486, 210)}" stroke-width="11"/>
<path d="M${e(230, 252)}L${e(214, 382)}C${e(211, 404)} ${e(240, 410)} ${e(248, 392)}" stroke-width="13"/>
<path d="M${e(304, 258)}C${e(322, 318)} ${e(348, 352)} ${e(410, 364)}C${e(470, 374)} ${e(494, 330)} ${e(466, 310)}C${e(446, 296)} ${e(418, 312)} ${e(432, 332)}" stroke-width="11"/>
</g>`;
    s += `<circle cx="${e(296, 0).split(' ')[0]}" cy="${e(0, 182).split(' ')[1]}" r="74" fill="${PALE}" opacity=".25" filter="url(#g-wide)"/>`;
    s += `<circle cx="${e(296, 0).split(' ')[0]}" cy="${e(0, 182).split(' ')[1]}" r="56" fill="url(#g-iris)"/>`;
    s += `<circle cx="${r1(cx - 300 + 278)}" cy="${r1(cy - 200 + 164)}" r="11" fill="#FFFDF5" opacity=".9"/>`;
    return s;
  },

  /* RL-Cloud-Autoscaler — capacity that follows demand, step by step */
  'rl-autoscaler'() {
    reseed(5);
    let s = dust(50);
    const x0 = 690, x1 = 1520, yb = 720, yt = 250;
    // axes
    s += line(x0, yb, x1, yb, 0.5, 1.2) + line(x0, yt - 40, x0, yb, 0.5, 1.2);
    for (let x = x0 + 80; x < x1; x += 80) s += line(x, yb, x, yb + 8, 0.45, 1.2);
    for (let y = yb - 100; y > yt - 20; y -= 100) s += line(x0, y, x1, y, 0.08, 1);
    // demand: daily swells, a sudden spike
    const N = 166, dem = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      let v = 0.42 + 0.2 * Math.sin(t * Math.PI * 3.2 - 0.6) + 0.06 * Math.sin(t * 40) * Math.sin(t * 7);
      v += 0.34 * Math.exp(-Math.pow((t - 0.72) / 0.035, 2));
      dem.push(Math.max(0.08, Math.min(0.98, v)));
    }
    const X = (i) => x0 + (i / N) * (x1 - x0), Y = (v) => yb - v * (yb - yt);
    let d = '';
    dem.forEach((v, i) => { d += `${i ? 'L' : 'M'}${r1(X(i))} ${r1(Y(v))}`; });
    s += `<path d="${d}L${x1} ${yb}L${x0} ${yb}Z" fill="url(#g-fade-d)"/>`;
    s += `<path d="${d}" fill="none" stroke="${GOLD}" stroke-width="1.6" opacity=".6"/>`;
    // capacity, as the agent provisions it: whole servers, a step ahead
    let c = '', prev = null;
    for (let i = 0; i <= N; i += 8) {
      const ahead = Math.max(...dem.slice(i, Math.min(N, i + 10) + 1));
      const lvl = Math.ceil((ahead + 0.04) * 10) / 10;
      const x = X(i), y = Y(Math.min(lvl, 1));
      c += prev === null ? `M${r1(x)} ${r1(y)}` : `H${r1(x)}V${r1(y)}`;
      prev = y;
    }
    c += `H${x1}`;
    s += `<path d="${c}" fill="none" stroke="${PALE}" stroke-width="7" opacity=".25" filter="url(#g-soft)"/>`;
    s += `<path d="${c}" fill="none" stroke="${PALE}" stroke-width="2.6" stroke-linejoin="round"/>`;
    s += mono(x1, yb + 40, 'TIME', 15, 0.5, 'end');
    s += mono(x0 + 14, yt - 52, 'CAPACITY  ─  DEMAND ░', 15, 0.6);
    // servers, racked
    for (let i = 0; i < 5; i++) {
      const y = 790 + i * 0;
      s += `<rect x="${x0 + 40 + i * 74}" y="${y}" width="56" height="34" rx="3" fill="none" stroke="${GOLD}" stroke-width="1.3" opacity="${i < 4 ? 0.7 : 0.3}"/>`;
      s += `<circle cx="${x0 + 52 + i * 74}" cy="${y + 17}" r="3" fill="${i < 4 ? LIGHT : GOLD}" opacity="${i < 4 ? 0.95 : 0.35}"/>`;
      s += line(x0 + 62 + i * 74, y + 17, x0 + 86 + i * 74, y + 17, i < 4 ? 0.6 : 0.25, 1.2);
    }
    // the policy, acting on the state
    const px = 1120, py = 290;
    s += `<circle cx="${px}" cy="${py}" r="52" fill="#0B0B0C" stroke="${PALE}" stroke-width="1.6"/>`;
    s += `<text x="${px}" y="${py + 18}" font-family="Gloock" font-size="54" fill="${PALE}" text-anchor="middle">π</text>`;
    s += `<path d="M${px - 74} ${py + 30}A80 80 0 0 0 ${px - 30} ${py + 76}" fill="none" stroke="${GOLD}" stroke-width="1.4" opacity=".7"/>`;
    s += `<path d="M${px + 74} ${py - 30}A80 80 0 0 0 ${px + 30} ${py - 76}" fill="none" stroke="${GOLD}" stroke-width="1.4" opacity=".7"/>`;
    s += mono(px + 62, py - 78, 'ACT', 14, 0.6) + mono(px - 62, py + 100, 'REWARD', 14, 0.6, 'end');
    return s;
  },

  /* SimCLR — two views of one picture, drawn together; the rest pushed apart */
  simclr() {
    reseed(42);
    let s = dust(50);
    // the picture: the pyramids, framed
    const pic = (x, y, sz, rot = 0, extra = '', o = 1) => `
<g transform="translate(${x} ${y}) rotate(${rot})" opacity="${o}">
<rect x="${-sz / 2}" y="${-sz / 2}" width="${sz}" height="${sz}" rx="3" fill="#0E0E10" stroke="${PALE}" stroke-width="1.6" ${extra}/>
<circle cx="${r1(sz * 0.22)}" cy="${r1(-sz * 0.2)}" r="${r1(sz * 0.08)}" fill="${PALE}" opacity=".8"/>
<path d="M${r1(-sz * 0.42)} ${r1(sz * 0.3)}L${r1(-sz * 0.1)} ${r1(-sz * 0.12)}L${r1(sz * 0.2)} ${r1(sz * 0.3)}Z" fill="url(#g-gold)" opacity=".9"/>
<path d="M${r1(sz * 0.06)} ${r1(sz * 0.3)}L${r1(sz * 0.24)} ${r1(sz * 0.06)}L${r1(sz * 0.42)} ${r1(sz * 0.3)}Z" fill="${GOLD}" opacity=".6"/>
<path d="M${r1(-sz * 0.46)} ${r1(sz * 0.3)}H${r1(sz * 0.46)}" stroke="${PALE}" stroke-width="1.2" opacity=".6"/>
</g>`;
    s += pic(770, 440, 190);
    s += mono(770, 570, 'x', 18, 0.7, 'middle');
    // two augmentations: a crop, and a colour shift with grain
    s += `<path d="M870 400C930 330 960 280 1000 262" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity=".6" stroke-dasharray="2 6"/>`;
    s += `<path d="M870 480C930 550 960 600 1000 618" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity=".6" stroke-dasharray="2 6"/>`;
    s += pic(1060, 250, 130, -9, 'stroke-dasharray="7 5"');
    s += `<g opacity=".95">${pic(1060, 630, 130, 7)}</g>`;
    for (let i = 0; i < 70; i++) s += `<circle cx="${r1(1000 + rnd() * 120)}" cy="${r1(570 + rnd() * 120)}" r=".9" fill="${LIGHT}" opacity="${r1(rnd() * 0.5 * 100) / 100}"/>`;
    s += mono(1060, 342, 'CROP · FLIP', 13, 0.6, 'middle') + mono(1060, 726, 'COLOUR · BLUR', 13, 0.6, 'middle');
    // the encoder f(·) for each view
    const enc = (y) => `<path d="M1160 ${y - 46}L1236 ${y - 26}V${y + 26}L1160 ${y + 46}Z" fill="#0E0E10" stroke="${GOLD}" stroke-width="1.5"/>` +
      `<text x="1198" y="${y + 9}" font-family="Gloock" font-style="italic" font-size="26" fill="${PALE}" text-anchor="middle">f</text>`;
    s += arrow(1128, 250, 1156, 250, 0.7) + arrow(1128, 630, 1156, 630, 0.7);
    s += enc(250) + enc(630);
    // the hypersphere where the views land
    const sx = 1390, sy = 440, R = 150;
    s += `<circle cx="${sx}" cy="${sy}" r="${R}" fill="none" stroke="${GOLD}" stroke-width="1.4" opacity=".6"/>`;
    s += `<ellipse cx="${sx}" cy="${sy}" rx="${R}" ry="44" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".3"/>`;
    s += `<ellipse cx="${sx}" cy="${sy}" rx="56" ry="${R}" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".22"/>`;
    for (let i = 0; i < 22; i++) {
      const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * (R - 14);
      const x = sx + Math.cos(a) * rr, y = sy + Math.sin(a) * rr;
      s += `<circle cx="${r1(x)}" cy="${r1(y)}" r="3.4" fill="none" stroke="${GOLD}" stroke-width="1.2" opacity=".55"/>`;
    }
    const p1 = [sx + 40, sy - 52], p2 = [sx + 66, sy - 24];
    s += `<path d="M1236 250C1300 250 1350 300 ${p1[0]} ${p1[1]}" fill="none" stroke="${PALE}" stroke-width="1.4" opacity=".55"/>`;
    s += `<path d="M1236 630C1320 630 1400 560 ${p2[0]} ${p2[1]}" fill="none" stroke="${PALE}" stroke-width="1.4" opacity=".55"/>`;
    s += `<path d="M${p1[0]} ${p1[1]}Q${p1[0] + 34} ${p1[1] - 6} ${p2[0]} ${p2[1]}" fill="none" stroke="${LIGHT}" stroke-width="2.4"/>`;
    s += glow(p1[0], p1[1], 1.5) + glow(p2[0], p2[1], 1.5);
    s += mono(sx, sy + R + 40, 'z · PULL TOGETHER', 13, 0.65, 'middle');
    return s;
  },

  /* Horus-OSINT — events on a turning globe, and a model to ask about them */
  'horus-osint'() {
    reseed(7);
    let s = dust(50);
    const cx = 1080, cy = 470, R = 300, tilt = 0.32;
    s += `<circle cx="${cx}" cy="${cy}" r="${R + 30}" fill="${GOLD}" opacity=".06" filter="url(#g-wide)"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#0D0D0F" stroke="${PALE}" stroke-width="1.6" opacity=".9"/>`;
    s += `<clipPath id="c-globe"><circle cx="${cx}" cy="${cy}" r="${R - 1}"/></clipPath><g clip-path="url(#c-globe)"><g transform="rotate(-18 ${cx} ${cy})">`;
    for (let k = -2; k <= 2; k++) {               // parallels
      const lat = (k / 3) * (Math.PI / 2), yy = cy + Math.sin(lat) * R, rr = Math.cos(lat) * R;
      s += `<ellipse cx="${cx}" cy="${r1(yy)}" rx="${r1(rr)}" ry="${r1(rr * tilt)}" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".3"/>`;
    }
    for (let k = 0; k < 6; k++) {                 // meridians
      const rx = Math.abs(Math.cos((k / 6) * Math.PI)) * R;
      s += `<ellipse cx="${cx}" cy="${cy}" rx="${r1(rx)}" ry="${R}" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".26"/>`;
    }
    s += `</g></g>`;
    // events, clustered where the world is busiest
    const hubs = [[-0.2, -0.25], [0.15, -0.35], [0.3, 0.05], [-0.35, 0.2], [0.05, 0.3], [0.45, -0.1]];
    const pts = [];
    hubs.forEach(([hx, hy], h) => {
      const n = 6 + Math.floor(rnd() * 8);
      for (let i = 0; i < n; i++) {
        const x = cx + (hx + (rnd() - 0.5) * 0.22) * R, y = cy + (hy + (rnd() - 0.5) * 0.18) * R;
        if (Math.hypot(x - cx, y - cy) < R - 12) pts.push([x, y, h]);
      }
    });
    pts.forEach(([x, y], i) => { s += glow(x, y, i % 5 === 0 ? 1.1 : 0.6, i % 3 ? 0.7 : 1); });
    // arcs between hubs, above the surface
    for (let i = 0; i < hubs.length - 1; i += 1) {
      const a = [cx + hubs[i][0] * R, cy + hubs[i][1] * R], b = [cx + hubs[i + 1][0] * R, cy + hubs[i + 1][1] * R];
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 90;
      s += `<path d="M${r1(a[0])} ${r1(a[1])}Q${r1(mx)} ${r1(my)} ${r1(b[0])} ${r1(b[1])}" fill="none" stroke="${PALE}" stroke-width="1.3" opacity=".55"/>`;
    }
    // the assistant, answering from the records
    const bx = 1310, by = 210;
    s += `<rect x="${bx}" y="${by}" width="210" height="112" rx="8" fill="#0D0D0F" stroke="${PALE}" stroke-width="1.5"/>`;
    s += `<path d="M${bx + 40} ${by + 112}L${bx + 18} ${by + 150}L${bx + 72} ${by + 112}" fill="#0D0D0F" stroke="${PALE}" stroke-width="1.5" stroke-linejoin="round"/>`;
    s += `<rect x="${bx + 41}" y="${by + 108}" width="30" height="6" fill="#0D0D0F"/>`;
    [0, 1, 2].forEach((i) => { s += line(bx + 24, by + 34 + i * 24, bx + 24 + [150, 120, 84][i], by + 34 + i * 24, 0.75, 2); });
    s += mono(bx + 105, by - 18, 'LLAMA-3-8B · LoRA', 13, 0.7, 'middle');
    return s;
  },

  /* Automated Multimodal Agent — a PDF goes in, a narrated deck comes out */
  'multimodal-agent'() {
    reseed(3);
    let s = dust(50);
    // the PDF
    const px = 690, py = 250, pw = 190, ph = 250;
    s += `<path d="M${px} ${py}H${px + pw - 44}L${px + pw} ${py + 44}V${py + ph}H${px}Z" fill="#0E0E10" stroke="${PALE}" stroke-width="1.6"/>`;
    s += `<path d="M${px + pw - 44} ${py}V${py + 44}H${px + pw}" fill="none" stroke="${PALE}" stroke-width="1.4"/>`;
    for (let i = 0; i < 7; i++) s += line(px + 24, py + 80 + i * 22, px + pw - 24 - (i % 3) * 24, py + 80 + i * 22, 0.45, 2);
    s += mono(px + 24, py + 50, 'PDF', 20, 0.95, 'start', PALE);
    // the agent, coordinating
    const ax = 1010, ay = 375;
    s += arrow(px + pw + 18, ay, ax - 72, ay, 0.75);
    s += `<circle cx="${ax}" cy="${ay}" r="64" fill="#0E0E10" stroke="${PALE}" stroke-width="1.6"/>`;
    s += `<circle cx="${ax}" cy="${ay}" r="92" fill="none" stroke="${GOLD}" stroke-width="1.1" stroke-dasharray="3 8" opacity=".6"/>`;
    s += star(ax, ay, 26, 0.95);
    [[-0.6, 'EXTRACT'], [1.5, 'DESIGN'], [3.6, 'NARRATE']].forEach(([a, label]) => {
      const x = ax + Math.cos(a) * 92, y = ay + Math.sin(a) * 92;
      s += glow(x, y, 1.1);
    });
    s += mono(ax, ay + 160, 'EXTRACT · DESIGN · NARRATE', 13, 0.65, 'middle');
    // the deck: a stack of slides
    s += arrow(ax + 100, ay, 1150, ay, 0.75);
    const sx = 1170, sw = 330, sh = 186, sy = 282;
    for (let k = 2; k >= 1; k--) s += `<rect x="${sx + k * 16}" y="${sy - k * 14}" width="${sw}" height="${sh}" rx="4" fill="#0E0E10" stroke="${GOLD}" stroke-width="1.2" opacity="${0.6 - k * 0.15}"/>`;
    s += `<rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="4" fill="#0E0E10" stroke="${PALE}" stroke-width="1.6"/>`;
    s += `<rect x="${sx + 22}" y="${sy + 22}" width="180" height="16" rx="2" fill="url(#g-gold)"/>`;
    for (let i = 0; i < 4; i++) { s += `<circle cx="${sx + 30}" cy="${sy + 66 + i * 26}" r="3" fill="${PALE}"/>` + line(sx + 44, sy + 66 + i * 26, sx + 44 + [130, 150, 110, 140][i], sy + 66 + i * 26, 0.55, 2); }
    s += `<rect x="${sx + 214}" y="${sy + 58}" width="94" height="104" rx="3" fill="none" stroke="${GOLD}" stroke-width="1.2" opacity=".7"/>`;
    s += `<path d="M${sx + 224} ${sy + 150}L${sx + 252} ${sy + 106}L${sx + 272} ${sy + 132}L${sx + 286} ${sy + 116}L${sx + 300} ${sy + 150}Z" fill="${GOLD}" opacity=".55"/>`;
    // and its narration
    const wy = 600;
    s += `<path d="M${sx} ${wy - 12}H${sx + 18}L${sx + 36} ${wy - 30}V${wy + 30}L${sx + 18} ${wy + 12}H${sx}Z" fill="${PALE}"/>`;
    s += `<path d="M${sx + 50} ${wy - 22}A30 30 0 0 1 ${sx + 50} ${wy + 22}M${sx + 62} ${wy - 38}A50 50 0 0 1 ${sx + 62} ${wy + 38}" fill="none" stroke="${PALE}" stroke-width="2" opacity=".7"/>`;
    for (let i = 0; i < 46; i++) {
      const x = sx + 92 + i * 5.2, a = (Math.abs(Math.sin(i * 0.7) * Math.sin(i * 0.19)) * 0.85 + 0.12) * 40;
      s += `<path d="M${r1(x)} ${r1(wy - a)}V${r1(wy + a)}" stroke="${PALE}" stroke-width="2.4" stroke-linecap="round" opacity="${r1((0.45 + (i % 4) * 0.12) * 100) / 100}"/>`;
    }
    return s;
  },

  /* SCRAP — two orbits, one meeting point, seen two days early */
  scrap() {
    reseed(9);
    let s = dust(90);
    const ex = 1300, ey = 1120, ER = 420;
    s += `<circle cx="${ex}" cy="${ey}" r="${ER + 40}" fill="${GOLD}" opacity=".13" filter="url(#g-wide)"/>`;
    s += `<circle cx="${ex}" cy="${ey}" r="${ER}" fill="#0D0D0F" stroke="${PALE}" stroke-width="1.8"/>`;
    s += `<clipPath id="c-earth"><circle cx="${ex}" cy="${ey}" r="${ER - 1}"/></clipPath><g clip-path="url(#c-earth)">`;
    for (let k = 1; k <= 3; k++) s += `<ellipse cx="${ex}" cy="${ey - k * 100}" rx="${r1(Math.sqrt(ER * ER - (k * 100) ** 2))}" ry="${r1(22 + k * 5)}" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".24"/>`;
    for (let k = -3; k <= 3; k++) s += `<ellipse cx="${ex}" cy="${ey}" rx="${r1(Math.abs(Math.sin((k / 8) * Math.PI)) * ER)}" ry="${ER}" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".18"/>`;
    s += `</g>`;
    // two orbits around the same Earth, tilted apart
    const orbit = (rx, ry, rot) => (t) => {
      const a = (rot * Math.PI) / 180, x = Math.cos(t) * rx, y = Math.sin(t) * ry;
      return [ex + x * Math.cos(a) - y * Math.sin(a), ey + x * Math.sin(a) + y * Math.cos(a)];
    };
    const A = orbit(660, 600, -12), B = orbit(560, 720, 18);
    s += `<ellipse cx="${ex}" cy="${ey}" rx="660" ry="600" transform="rotate(-12 ${ex} ${ey})" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity=".6"/>`;
    s += `<ellipse cx="${ex}" cy="${ey}" rx="560" ry="720" transform="rotate(18 ${ex} ${ey})" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity=".6" stroke-dasharray="10 7"/>`;
    // where they meet, on the upper left of the Earth: found, not guessed
    let best = null;
    for (let i = 0; i < 1440; i++) {
      const ta = (i / 1440) * Math.PI * 2, p = A(ta);
      if (p[0] > ex || p[1] > ey - 200) continue;
      for (let j = 0; j < 1440; j++) {
        const tb = (j / 1440) * Math.PI * 2, q = B(tb);
        const d = Math.hypot(p[0] - q[0], p[1] - q[1]);
        if (!best || d < best.d) best = { d, ta, tb, p };
      }
    }
    const [cxp, cyp] = best.p;
    for (let k = 1; k <= 3; k++) s += `<circle cx="${r1(cxp)}" cy="${r1(cyp)}" r="${k * 26}" fill="none" stroke="${PALE}" stroke-width="1.2" opacity="${r1((0.75 - k * 0.2) * 100) / 100}" ${k === 1 ? '' : 'stroke-dasharray="4 6"'}/>`;
    s += glow(cxp, cyp, 2.2);
    // the satellites, each on its way in along its own orbit
    const sat = (p, rot) => `<g transform="translate(${r1(p[0])} ${r1(p[1])}) rotate(${rot})"><rect x="-9" y="-9" width="18" height="18" rx="2" fill="${PALE}"/><rect x="-46" y="-6" width="30" height="12" fill="none" stroke="${PALE}" stroke-width="1.6"/><rect x="16" y="-6" width="30" height="12" fill="none" stroke="${PALE}" stroke-width="1.6"/><path d="M-16 0H-9M9 0H16" stroke="${PALE}" stroke-width="1.6"/></g>`;
    const sa = A(best.ta - 0.5), sb = B(best.tb + 0.42);
    s += sat(sa, -30) + sat(sb, 24);
    s += mono(cxp, cyp - 100, 'CLOSEST APPROACH', 14, 0.8, 'middle');
    s += mono(sa[0] + 62, sa[1] + 6, 'T−48 h', 15, 0.8);
    return s;
  },

  /* Human vs. agentic pull requests — two branches into one review */
  'agentic-prs'() {
    reseed(13);
    let s = dust(50);
    const y0 = 560, x0 = 690, x1 = 1520;
    s += `<path d="M${x0} ${y0}H${x1}" stroke="${PALE}" stroke-width="3" opacity=".85"/>`;
    for (let x = x0 + 30; x < x1; x += 90) s += `<circle cx="${x}" cy="${y0}" r="8" fill="#0B0B0C" stroke="${PALE}" stroke-width="2.4"/>`;
    s += mono(x1, y0 + 44, 'MAIN', 14, 0.55, 'end');
    // the human branch: above
    s += `<path d="M${x0 + 120} ${y0}C${x0 + 170} 390 ${x0 + 220} 380 ${x0 + 300} 380H1130C1210 380 1250 400 1290 ${y0}" fill="none" stroke="${GOLD}" stroke-width="2.4"/>`;
    [880, 960, 1040, 1120].forEach((x) => { s += `<circle cx="${x}" cy="380" r="9" fill="${GOLD}"/>`; });
    // a person
    s += `<circle cx="826" cy="304" r="16" fill="none" stroke="${PALE}" stroke-width="2"/><path d="M798 352C800 330 852 330 854 352" fill="none" stroke="${PALE}" stroke-width="2"/>`;
    s += mono(870, 316, 'HUMAN', 14, 0.75);
    // the agent branch: below
    s += `<path d="M${x0 + 200} ${y0}C${x0 + 250} 730 ${x0 + 300} 740 ${x0 + 380} 740H1200C1280 740 1320 720 1370 ${y0}" fill="none" stroke="${GOLD}" stroke-width="2.4" stroke-dasharray="10 6"/>`;
    [960, 1040, 1120, 1200].forEach((x) => { s += `<rect x="${x - 9}" y="731" width="18" height="18" rx="2" fill="#0B0B0C" stroke="${PALE}" stroke-width="2.2"/>`; });
    // a robot
    s += `<rect x="806" y="790" width="40" height="32" rx="6" fill="none" stroke="${PALE}" stroke-width="2"/><circle cx="819" cy="806" r="3" fill="${PALE}"/><circle cx="833" cy="806" r="3" fill="${PALE}"/><path d="M826 790V778" stroke="${PALE}" stroke-width="2"/><circle cx="826" cy="775" r="3" fill="${PALE}"/>`;
    s += mono(870, 812, 'AGENT', 14, 0.75);
    // the reviews, where each one is merged
    const bubbles = (x, y, n) => {
      let b = '';
      for (let i = 0; i < n; i++) {
        const yy = y - i * 38;
        b += `<rect x="${x}" y="${yy}" width="74" height="28" rx="6" fill="#0E0E10" stroke="${GOLD}" stroke-width="1.3" opacity="${r1((0.95 - i * 0.12) * 100) / 100}"/>`;
        b += line(x + 12, yy + 14, x + 60, yy + 14, 0.6, 2);
      }
      return b;
    };
    s += `<circle cx="1290" cy="${y0}" r="13" fill="${PALE}"/>` + glow(1290, y0, 1.3);
    s += `<circle cx="1370" cy="${y0}" r="13" fill="${PALE}"/>` + glow(1370, y0, 1.3);
    s += bubbles(1306, 470, 2) + bubbles(1390, 640, 2);
    s += `<path d="M1390 652V${y0 + 120}" stroke="none"/>`;
    // the scales: which costs reviewers more?
    const bx = 1180, by = 160;
    s += `<path d="M${bx} ${by - 30}V${by + 70}M${bx - 40} ${by + 70}H${bx + 40}" stroke="${PALE}" stroke-width="2"/>`;
    s += `<path d="M${bx - 120} ${by - 14}L${bx + 120} ${by - 14}" stroke="${PALE}" stroke-width="2.2"/>`;
    s += `<circle cx="${bx}" cy="${by - 30}" r="5" fill="${PALE}"/>`;
    s += `<path d="M${bx - 120} ${by - 14}L${bx - 150} ${by + 42}H${bx - 90}Z" fill="none" stroke="${GOLD}" stroke-width="1.5"/>`;
    s += `<path d="M${bx + 120} ${by - 14}L${bx + 90} ${by + 42}H${bx + 150}Z" fill="none" stroke="${GOLD}" stroke-width="1.5"/>`;
    s += mono(bx, by + 110, 'REVIEW EFFORT', 13, 0.6, 'middle');
    return s;
  },

  /* AudioShield — one voice, real on one side, forged on the other */
  audioshield() {
    reseed(17);
    let s = dust(40);
    const x0 = 690, x1 = 1520, cy = 470, mid = 1105;
    // spectrogram behind
    for (let i = 0; i < 46; i++) for (let j = 0; j < 12; j++) {
      const v = Math.abs(Math.sin(i * 0.4 + j * 0.7) * Math.cos(j * 0.3 - i * 0.11));
      s += `<rect x="${x0 + i * 18}" y="${250 + j * 36}" width="16" height="32" fill="${GOLD}" opacity="${r1(v * 0.09 * 100) / 100}"/>`;
    }
    // the waveform
    for (let i = 0; i < 120; i++) {
      const x = x0 + 10 + i * 6.8;
      const env = Math.exp(-Math.pow((i - 60) / 46, 2)) * 0.85 + 0.15;
      const a = (Math.abs(Math.sin(i * 0.9) * 0.6 + Math.sin(i * 0.23) * 0.4)) * env * 170 + 6;
      const real = x < mid;
      const jitter = real ? 0 : (rnd() - 0.5) * 18;
      s += `<path d="M${r1(x)} ${r1(cy - a + jitter)}V${r1(cy + a + jitter)}" stroke="${real ? PALE : GOLD}" stroke-width="${real ? 3 : 2.2}" stroke-linecap="round" opacity="${real ? 0.95 : 0.6}" ${real ? '' : 'stroke-dasharray="6 5"'}/>`;
    }
    // the detector's window
    s += `<rect x="${mid - 120}" y="${cy - 230}" width="240" height="460" rx="4" fill="none" stroke="${LIGHT}" stroke-width="1.6"/>`;
    [[mid - 120, cy - 230], [mid + 120, cy - 230], [mid - 120, cy + 230], [mid + 120, cy + 230]].forEach(([x, y]) => { s += glow(x, y, 1.1); });
    s += `<path d="M${mid} ${cy - 230}V${cy + 230}" stroke="${LIGHT}" stroke-width="1" stroke-dasharray="3 6" opacity=".6"/>`;
    s += mono(mid, cy - 250, 'CNN', 16, 0.9, 'middle', PALE);
    // the verdicts
    s += `<rect x="760" y="760" width="120" height="40" rx="20" fill="none" stroke="${PALE}" stroke-width="1.6"/>` + mono(820, 786, 'REAL', 16, 0.95, 'middle', PALE);
    s += `<rect x="1330" y="760" width="120" height="40" rx="20" fill="none" stroke="${GOLD}" stroke-width="1.4" stroke-dasharray="5 5"/>` + mono(1390, 786, 'FAKE', 16, 0.7, 'middle');
    return s;
  },

  /* Vitalism — a face, a camera, and the pulse read off the skin */
  vitalism() {
    reseed(19);
    let s = dust(50);
    const fx = 930, fy = 450;
    // the face, drawn in a few lines
    s += `<path d="M${fx} ${fy - 230}C${fx + 120} ${fy - 230} ${fx + 160} ${fy - 120} ${fx + 150} ${fy}C${fx + 140} ${fy + 120} ${fx + 80} ${fy + 210} ${fx} ${fy + 220}C${fx - 80} ${fy + 210} ${fx - 140} ${fy + 120} ${fx - 150} ${fy}C${fx - 160} ${fy - 120} ${fx - 120} ${fy - 230} ${fx} ${fy - 230}Z" fill="#0E0E10" stroke="${PALE}" stroke-width="1.8"/>`;
    // eyes, nose and mouth as the landmarks a face tracker finds
    const eye = (x) => `<path d="M${x - 34} ${fy - 14}Q${x} ${fy - 34} ${x + 34} ${fy - 14}Q${x} ${fy + 2} ${x - 34} ${fy - 14}Z" fill="none" stroke="${PALE}" stroke-width="1.6" opacity=".85"/><circle cx="${x}" cy="${fy - 15}" r="6" fill="${PALE}" opacity=".8"/>`;
    s += eye(fx - 62) + eye(fx + 62);
    s += `<path d="M${fx - 6} ${fy + 4}L${fx - 18} ${fy + 72}Q${fx} ${fy + 82} ${fx + 18} ${fy + 72}" fill="none" stroke="${PALE}" stroke-width="1.5" opacity=".6"/>`;
    s += `<path d="M${fx - 46} ${fy + 128}Q${fx} ${fy + 120} ${fx + 46} ${fy + 128}" fill="none" stroke="${PALE}" stroke-width="1.6" opacity=".7"/>`;
    const lm = [];
    for (let i = 0; i <= 16; i++) {           // the jaw line
      const a = Math.PI * (0.06 + 0.88 * (i / 16));
      lm.push([fx + Math.cos(a) * 146 * (i % 16 ? 1 : 1), fy + 10 + Math.sin(a) * 200]);
    }
    [[-96, -48], [-62, -54], [-28, -48], [28, -48], [62, -54], [96, -48], [0, 30], [-46, 128], [46, 128], [0, 120]].forEach(([dx, dy]) => lm.push([fx + dx, fy + dy]));
    lm.forEach(([x, y]) => { s += `<circle cx="${r1(x)}" cy="${r1(y)}" r="2.6" fill="${LIGHT}" opacity=".85"/>`; });
    for (let i = 0; i < 16; i++) s += line(lm[i][0], lm[i][1], lm[i + 1][0], lm[i + 1][1], 0.35, 1);
    // regions of skin the camera reads
    const roi = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${GOLD}" fill-opacity=".12" stroke="${LIGHT}" stroke-width="1.4" stroke-dasharray="5 4"/>`;
    s += roi(fx - 70, fy - 170, 140, 70) + roi(fx - 120, fy + 30, 60, 50) + roi(fx + 60, fy + 30, 60, 50);
    for (let i = 0; i < 9; i++) s += line(fx - 150, fy - 200 + i * 52, fx + 150, fy - 200 + i * 52, 0.07, 1);
    // the camera
    const cx = 690, cy = 220;
    s += `<rect x="${cx}" y="${cy}" width="74" height="52" rx="6" fill="none" stroke="${PALE}" stroke-width="1.8"/><circle cx="${cx + 37}" cy="${cy + 26}" r="15" fill="none" stroke="${PALE}" stroke-width="1.8"/><circle cx="${cx + 37}" cy="${cy + 26}" r="5" fill="${LIGHT}"/>`;
    s += `<path d="M${cx + 80} ${cy + 26}L${fx - 70} ${fy - 170}M${cx + 80} ${cy + 26}L${fx - 120} ${fy + 30}" stroke="${GOLD}" stroke-width="1.1" stroke-dasharray="2 6" opacity=".6"/>`;
    // the pulse, read off the skin
    const x0 = fx + 190, x1 = 1520, y0 = 340;
    let d = `M${fx + 70} ${fy - 135}C${fx + 130} ${fy - 135} ${fx + 140} ${y0} ${x0} ${y0}`;
    for (let x = x0; x <= x1; x += 4) {
      const t = ((x - x0) % 92) / 92;
      const y = y0 - (Math.exp(-Math.pow((t - 0.22) / 0.07, 2)) * 70 + Math.exp(-Math.pow((t - 0.5) / 0.09, 2)) * 22) + 6 * Math.sin(t * Math.PI);
      d += `L${r1(x)} ${r1(y)}`;
    }
    s += `<path d="${d}" fill="none" stroke="${PALE}" stroke-width="6" opacity=".25" filter="url(#g-soft)"/>`;
    s += `<path d="${d}" fill="none" stroke="${PALE}" stroke-width="2.4" stroke-linejoin="round"/>`;
    // the heart
    const hx = 1400, hy = 520;
    s += `<path d="M${hx} ${hy + 46}C${hx - 70} ${hy}, ${hx - 60} ${hy - 54}, ${hx} ${hy - 22}C${hx + 60} ${hy - 54}, ${hx + 70} ${hy}, ${hx} ${hy + 46}Z" fill="url(#g-gold)"/>`;
    s += mono(hx, hy + 96, 'rPPG · BPM', 14, 0.75, 'middle');
    return s;
  },

  /* the paper — a page, its title, and the stop that ends it well */
  paper() {
    reseed(29);
    let s = dust(60);
    const px = 980, py = 120, pw = 470, ph = 640;
    s += `<g transform="rotate(4 ${px + pw / 2} ${py + ph / 2})">`;
    s += `<rect x="${px + 24}" y="${py + 20}" width="${pw}" height="${ph}" rx="3" fill="#0E0E10" stroke="${GOLD}" stroke-width="1.2" opacity=".5"/>`;
    s += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="3" fill="#111113" stroke="${PALE}" stroke-width="1.6"/>`;
    s += `<text x="${px + pw / 2}" y="${py + 74}" font-family="Gloock" font-size="30" fill="${INK}" text-anchor="middle">Say Less, Mean Better</text>`;
    s += line(px + 120, py + 102, px + pw - 120, py + 102, 0.5, 1.2);
    for (let i = 0; i < 3; i++) s += line(px + 150 + i * 6, py + 128 + i * 18, px + pw - 150 - i * 6, py + 128 + i * 18, 0.4, 2);
    const col = (x, y, n, w, cut) => {
      let c = '';
      for (let i = 0; i < n; i++) {
        const yy = y + i * 20, ww = i === n - 1 ? w * 0.55 : w - (i % 4) * 10;
        c += line(x, yy, x + ww, yy, i >= cut ? 0.14 : 0.55, 2);
      }
      return c;
    };
    s += col(px + 40, py + 220, 14, 180, 99) + col(px + 250, py + 220, 7, 180, 99);
    // the second column ends early, and cleanly
    s += `<circle cx="${px + 250 + 180 * 0.55 + 12}" cy="${py + 220 + 6 * 20}" r="4.5" fill="${LIGHT}"/>`;
    s += `<rect x="${px + 250 + 180 * 0.55 + 26}" y="${py + 220 + 6 * 20 - 9}" width="18" height="18" rx="2" fill="url(#g-gold)"/>`;
    for (let i = 7; i < 14; i++) s += line(px + 250, py + 220 + i * 20, px + 250 + 170, py + 220 + i * 20, 0.12, 2, 'stroke-dasharray="4 6"');
    // a figure
    s += `<rect x="${px + 40}" y="${py + 520}" width="390" height="90" rx="2" fill="none" stroke="${GOLD}" stroke-width="1.1" opacity=".6"/>`;
    [0.9, 0.48, 0.86, 0.45, 0.88, 0.47].forEach((v, i) => {
      s += `<rect x="${px + 64 + i * 60}" y="${py + 600 - v * 70}" width="22" height="${v * 70}" fill="${i % 2 ? PALE : GOLD}" opacity="${i % 2 ? 0.9 : 0.35}"/>`;
    });
    s += `</g>`;
    s += mono(1215, 830, 'arXiv:2611.04107 · cs.CL', 15, 0.7, 'middle');
    return s;
  },
};

/* ── the covers ───────────────────────────────────────────── */
const COVERS = [
  { slug: 'minimallm', no: '01', kicker: 'MSc thesis · Queen\'s University', title: 'MinimalLM', sub: 'Verbosity-aware decoding', hook: '47.6%', cap: 'fewer generated tokens · no answer cut off' },
  { slug: 'horus-sentinel', no: '02', kicker: 'Multi-agent system', title: 'HORUS Sentinel', sub: 'Autonomous OSINT & threat intelligence', hook: 'Hours → minutes', hookSize: 92, cap: 'of analyst work, by a swarm of agents' },
  { slug: 'rl-autoscaler', no: '03', kicker: 'Deep reinforcement learning', title: 'RL-Cloud-Autoscaler', titleSize: 60, sub: 'Autonomous cloud provisioning', hook: 'PPO · DQN', hookSize: 112, cap: 'agents that scale the cloud in real time' },
  { slug: 'simclr', no: '04', kicker: 'Self-supervised learning', title: 'SimCLR-Vision-SSL', titleSize: 62, sub: 'Contrastive representation learning', hook: '84.30%', cap: 'top-1 accuracy · 42-experiment sweep' },
  { slug: 'horus-osint', no: '05', kicker: 'LLM fine-tuning · cloud', title: 'Horus-OSINT', sub: 'Threat-intelligence assistant', hook: '159,826', cap: 'GTD / GDELT records · Llama-3-8B on AWS' },
  { slug: 'multimodal-agent', no: '06', kicker: 'Agentic workflow', title: 'Multimodal Agent', sub: 'PDF → narrated PowerPoint', hook: 'PDF → slides', hookSize: 104, cap: 'presented at Queen\'s · AI in Teaching & Learning 2026' },
  { slug: 'scrap', no: '07', kicker: 'Applied ML · space safety', title: 'SCRAP', sub: 'Satellite collision risk prediction', hook: '48 h', cap: 'or more of warning before closest approach' },
  { slug: 'agentic-prs', no: '08', kicker: 'Empirical software engineering', title: 'Human vs. Agentic PRs', sub: 'Analysing review effort', hook: 'Which takes more review?', hookSize: 84, cap: 'agent vs. human pull requests, mined from GitHub' },
  { slug: 'audioshield', no: '09', kicker: 'Audio deep learning', title: 'AudioShield', sub: 'Deepfake audio detection', hook: 'Real or fake?', hookSize: 100, cap: 'a CNN that hears the forgery' },
  { slug: 'vitalism', no: '10', kicker: 'Graduation project · Grade A+', title: 'Vitalism Solution', sub: 'Contactless vital signs via rPPG', hook: 'Contactless', hookSize: 104, cap: 'vital signs from video · Imagine Cup semi-finalist' },
  { slug: 'paper', no: 'arXiv', kicker: 'Paper · cs.CL · 2026', title: 'Say Less, Mean Better', sub: 'Training-free verbosity control for language models', hook: '47.6%', cap: 'fewer tokens · 19–68% faster · nothing cut off', titleSize: 68 },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function page(c) {
  const art = ART[c.slug]();
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gloock&family=Ysabeau+Office:ital,wght@0,400..700;1,400..600&family=Chivo+Mono:wght@400;500&display=block">
<style>
html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#0B0B0C}
.c{position:relative;width:${W}px;height:${H}px;overflow:hidden;
  background:radial-gradient(900px 640px at 1090px 450px,rgba(201,165,94,.13),rgba(201,165,94,.04) 55%,rgba(201,165,94,0) 75%),#0B0B0C}
.art{position:absolute;inset:0}
.frame{position:absolute;inset:34px;border:1px solid rgba(201,165,94,.36)}
.frame::before,.frame::after{content:'';position:absolute;width:26px;height:26px;border:solid ${GOLD};opacity:.9}
.frame::before{left:-6px;top:-6px;border-width:2px 0 0 2px}
.frame::after{right:-6px;bottom:-6px;border-width:0 2px 2px 0}
.kicker{position:absolute;left:96px;top:92px;font:500 21px/1 'Chivo Mono',monospace;letter-spacing:.2em;text-transform:uppercase;color:${GOLD_INK}}
.no{position:absolute;right:96px;top:92px;font:400 21px/1 'Chivo Mono',monospace;letter-spacing:.2em;color:${INK3}}
.title{position:absolute;left:92px;top:136px;max-width:600px;text-wrap:balance;font:${c.titleSize || 80}px/1.02 Gloock,serif;color:${INK};letter-spacing:-.01em}
.sub{margin-top:18px;font:italic 400 30px/1.3 'Ysabeau Office',sans-serif;color:${INK2};letter-spacing:0}
.hook{position:absolute;left:92px;bottom:150px;max-width:620px}
.hook b{display:block;font:400 ${c.hookSize || 150}px/.95 Gloock,serif;letter-spacing:-.02em;
  background:linear-gradient(180deg,#F8EBC6 0%,${GOLD} 62%,#9A773A 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 0 22px rgba(214,182,118,.22))}
.hook span{display:block;margin-top:22px;max-width:560px;font:400 20px/1.55 'Chivo Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:${INK2}}
.rule{position:absolute;left:96px;bottom:118px;width:120px;height:2px;background:${GOLD}}
.sig{position:absolute;right:76px;bottom:58px;width:330px;opacity:.34;-webkit-mask-image:linear-gradient(100deg,rgba(0,0,0,.35) 0%,#000 45%,rgba(0,0,0,.55) 100%);mask-image:linear-gradient(100deg,rgba(0,0,0,.35) 0%,#000 45%,rgba(0,0,0,.55) 100%)}
/* the signature is a mark, not a specimen: faint, uneven, and crossed by a fine
   gold hatching, so it cannot be lifted cleanly off the picture */
.sig-hatch{position:absolute;right:60px;bottom:44px;width:362px;height:150px;opacity:.5;pointer-events:none;background:repeating-linear-gradient(-58deg,rgba(201,165,94,.16) 0 1px,transparent 1px 7px),repeating-linear-gradient(32deg,rgba(11,11,12,.55) 0 1px,transparent 1px 9px);-webkit-mask-image:radial-gradient(closest-side,#000 55%,transparent);mask-image:radial-gradient(closest-side,#000 55%,transparent)}
</style></head><body><div class="c">
<svg class="art" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${DEFS}<g clip-path="url(#c-plate)"><g mask="url(#m-art)">${art}</g></g></svg>
<div class="frame"></div>
<div class="kicker">${esc(c.kicker)}</div>
<div class="no">${esc(c.no)}</div>
<div class="title">${c.title.includes('-') ? `<span style="white-space:nowrap">${esc(c.title)}</span>` : esc(c.title)}<div class="sub">${esc(c.sub)}</div></div>
<div class="hook"><b>${esc(c.hook)}</b><span>${esc(c.cap)}</span></div>
<img class="sig" src="${SIGNATURE}" alt="">
<div class="sig-hatch"></div>
</div></body></html>`;
}

function findBrowser() {
  const cands = [
    process.env.CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const hit = cands.find((p) => fs.existsSync(p));
  if (!hit) throw new Error('No Chrome or Edge found — set CHROME to its path.');
  return hit;
}

const only = process.argv.slice(2);
const todo = only.length ? COVERS.filter((c) => only.includes(c.slug)) : COVERS;
if (!todo.length) throw new Error(`No cover called ${only.join(', ')} — try one of: ${COVERS.map((c) => c.slug).join(', ')}`);

const browser = findBrowser();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'covers-'));
fs.mkdirSync(OUT, { recursive: true });

for (const c of todo) {
  const html = path.join(tmp, `${c.slug}.html`);
  const png = path.join(tmp, `${c.slug}.png`);
  fs.writeFileSync(html, page(c), 'utf8');
  execFileSync(browser, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${path.join(tmp, 'profile')}`, '--force-device-scale-factor=1',
    `--window-size=${W},${H}`, '--virtual-time-budget=10000', '--allow-file-access-from-files',
    `--screenshot=${png}`, pathToFileURL(html).href,
  ], { stdio: 'ignore' });
  const img = sharp(png).resize(W, H, { fit: 'cover', position: 'left top' });
  await img.clone().webp({ quality: 84, effort: 6 }).toFile(path.join(OUT, `${c.slug}.webp`));
  await img.clone().resize(800, 500).webp({ quality: 82, effort: 6 }).toFile(path.join(OUT, `${c.slug}@800.webp`));
  const kb = (f) => (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0);
  console.log(`✓ ${c.slug.padEnd(17)} ${kb(`${c.slug}.webp`)} KB · ${kb(`${c.slug}@800.webp`)} KB`);
}
fs.rmSync(tmp, { recursive: true, force: true });
