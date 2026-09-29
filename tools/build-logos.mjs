/* ============================================================
   University logos, on the page's own background

       node tools/build-logos.mjs

   The originals are NEVER touched. This writes transparent WebP
   copies, one for each theme, to img/_web/logos/:

     Queen's University   queens.webp        as supplied (already transparent)
                          queens-dark.webp   its dark colours lifted, so the crimson
                                             and the navy read on black
     Assiut University    assiut.webp        the crest without its white ground:
                                             black and yellow on transparent
                          assiut-dark.webp   the same, with the black drawn in
                                             cream, for a dark page

   The Assiut crest is three inks on white — black, yellow and the
   white of the paper. Every pixel is therefore a mix of those three,
   and can be split back into its parts: the black and the yellow are
   kept as ink, the white becomes transparent. That is exact, edges
   included, where a "remove the white" threshold would leave a halo.
   ============================================================ */

import sharp from 'sharp';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'img', '_web', 'logos');

const WIDTH = { queens: 320, assiut: 240 };   // shown at ~40px; this covers 3x screens
const CREAM = [238, 234, 226];                // the site's ink on the dark theme (--ink)

async function readRGBA(file) {
  const { data, info } = await sharp(file, { failOn: 'none' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data: Buffer.from(data), w: info.width, h: info.height };
}

async function write(name, { data, w, h }, width) {
  const dest = path.join(OUT, name);
  await fs.mkdir(OUT, { recursive: true });
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 92, alphaQuality: 100, effort: 5 })
    .toFile(dest);
  const size = (await fs.stat(dest)).size;
  console.log(`  ✓ img/_web/logos/${name}  ${(size / 1024).toFixed(1)} KB`);
}

/* ── Queen's: lift the dark colours (hue kept) ───────────── */
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}
function hslToRgb(h, s, l) {
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map((v) => Math.round(v * 255));
}
function liftDark(img, gamma = 0.66) {
  const out = Buffer.from(img.data);
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) continue;
    const [h, s, l] = rgbToHsl(out[i], out[i + 1], out[i + 2]);
    const [r, g, b] = hslToRgb(h, s, Math.pow(l, gamma));   // dark colours rise most, light ones hardly move
    out[i] = r; out[i + 1] = g; out[i + 2] = b;
  }
  return { ...img, data: out };
}

/* ── Assiut: split every pixel into black / yellow / white ─ */
function dominantYellow(img) {
  // the most common strongly-saturated colour is the crest's yellow
  const bins = new Map();
  for (let i = 0; i < img.data.length; i += 4) {
    const [r, g, b, a] = [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]];
    if (a < 250) continue;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max < 150 || (max - min) / max < 0.6) continue;
    const k = `${r >> 3},${g >> 3},${b >> 3}`;
    bins.set(k, (bins.get(k) || 0) + 1);
  }
  const [best] = [...bins.entries()].sort((a, b) => b[1] - a[1])[0];
  return best.split(',').map((v) => (Number(v) << 3) + 4);
}
function split3(px, K, Y) {
  // px = wk*K + wy*Y + ww*W, wk + wy + ww = 1  →  two unknowns, least squares
  const W = [255, 255, 255];
  const a = [K[0] - W[0], K[1] - W[1], K[2] - W[2]];
  const b = [Y[0] - W[0], Y[1] - W[1], Y[2] - W[2]];
  const c = [px[0] - W[0], px[1] - W[1], px[2] - W[2]];
  const aa = a[0] * a[0] + a[1] * a[1] + a[2] * a[2], bb = b[0] * b[0] + b[1] * b[1] + b[2] * b[2];
  const ab = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const ac = a[0] * c[0] + a[1] * c[1] + a[2] * c[2], bc = b[0] * c[0] + b[1] * c[1] + b[2] * c[2];
  const det = aa * bb - ab * ab;
  let wk = (ac * bb - bc * ab) / det, wy = (bc * aa - ac * ab) / det;
  wk = Math.min(1, Math.max(0, wk)); wy = Math.min(1, Math.max(0, wy));
  const t = wk + wy;
  if (t > 1) { wk /= t; wy /= t; }
  return [wk, wy];
}
function inkOnTransparent(img, blackAs) {
  const K = [0, 0, 0], Y = dominantYellow(img);
  const out = Buffer.alloc(img.data.length);
  for (let i = 0; i < img.data.length; i += 4) {
    const a0 = img.data[i + 3] / 255;
    if (a0 === 0) continue;
    const [wk, wy] = split3([img.data[i], img.data[i + 1], img.data[i + 2]], K, Y);
    const ink = wk + wy;                                  // how much of this pixel is ink rather than paper
    if (ink < 0.004) continue;
    for (let c = 0; c < 3; c++) out[i + c] = Math.round((wk * blackAs[c] + wy * Y[c]) / ink);
    out[i + 3] = Math.round(255 * ink * a0);
  }
  return { ...img, data: out };
}

async function run() {
  console.log('University logos → img/_web/logos/');

  const q = path.join(ROOT, 'img', 'logo_q.png');
  if (existsSync(q)) {
    const img = await readRGBA(q);
    await write('queens.webp', img, WIDTH.queens);
    await write('queens-dark.webp', liftDark(img), WIDTH.queens);
  }

  const a = path.join(ROOT, 'img', 'Assiut university .png');
  if (existsSync(a)) {
    const img = await readRGBA(a);
    console.log(`  Assiut yellow ≈ rgb(${dominantYellow(img).join(', ')})`);
    await write('assiut.webp', inkOnTransparent(img, [0, 0, 0]), WIDTH.assiut);
    await write('assiut-dark.webp', inkOnTransparent(img, CREAM), WIDTH.assiut);
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
