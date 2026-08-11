/* ============================================================
   Image optimiser

       node tools/optimize-images.mjs

   Originals are NEVER touched. This writes web-sized WebP copies
   alongside them:

     img/Mahmoud's Photo Gallery/x.png  →  img/_web/gallery/x.webp   (view)
                                          img/_web/gallery/x@thumb.webp
     Certificates/Coursera/y.jpg        →  Certificates/_web/Coursera/y.webp

   The site loads the WebP; "open original" still points at the
   untouched file. Re-run after adding images, then re-run the two
   manifest builders.
   ============================================================ */

import sharp from 'sharp';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

/* Long-edge caps. A certificate has to stay readable; a gallery photo
   only has to look good in a ~940px frame. */
const VIEW_MAX   = 1800;
const THUMB_MAX  = 420;
const QUALITY    = 78;
const THUMB_Q    = 62;

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.bmp']);

let inBytes = 0, outBytes = 0, made = 0, skipped = 0;

const mb = (n) => (n / 1048576).toFixed(1) + ' MB';

/** Only rebuild when the source is newer than the derivative. */
async function isStale(src, dest) {
  if (!existsSync(dest)) return true;
  const [a, b] = await Promise.all([fs.stat(src), fs.stat(dest)]);
  return a.mtimeMs > b.mtimeMs;
}

async function derive(src, dest, max, quality) {
  await fs.mkdir(path.dirname(dest), { recursive: true });

  const srcSize = (await fs.stat(src)).size;
  inBytes += srcSize;

  if (!(await isStale(src, dest))) {
    outBytes += (await fs.stat(dest)).size;
    skipped++;
    return;
  }

  await sharp(src, { failOn: 'none' })
    .rotate()                       // honour EXIF orientation
    .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(dest);

  outBytes += (await fs.stat(dest)).size;
  made++;
}

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === '_web') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p));
    else if (IMAGE_EXT.has(path.extname(e.name).toLowerCase())) out.push(p);
  }
  return out;
}

async function run() {
  /* ── Photo gallery ─────────────────────────────────────── */
  const galleryDir = path.join(ROOT, 'img', "Mahmoud's Photo Gallery");
  if (existsSync(galleryDir)) {
    const files = await walk(galleryDir);
    console.log(`Photo gallery — ${files.length} image(s)`);
    for (const src of files) {
      const stem = path.basename(src, path.extname(src));
      const outDir = path.join(ROOT, 'img', '_web', 'gallery');
      await derive(src, path.join(outDir, `${stem}.webp`), VIEW_MAX, QUALITY);
      await derive(src, path.join(outDir, `${stem}@thumb.webp`), THUMB_MAX, THUMB_Q);
    }
  }

  /* ── Certificates (images only; PDFs pass through) ─────── */
  const certDir = path.join(ROOT, 'Certificates');
  if (existsSync(certDir)) {
    const files = await walk(certDir);
    console.log(`Certificates  — ${files.length} image(s)`);
    for (const src of files) {
      const rel = path.relative(certDir, src);
      const stem = path.join(path.dirname(rel), path.basename(rel, path.extname(rel)));
      const outDir = path.join(certDir, '_web');
      await derive(src, path.join(outDir, `${stem}.webp`), VIEW_MAX, QUALITY);
      await derive(src, path.join(outDir, `${stem}@thumb.webp`), THUMB_MAX, THUMB_Q);
    }
  }

  console.log('');
  console.log(`  generated ${made}, reused ${skipped}`);
  console.log(`  originals  ${mb(inBytes)}`);
  console.log(`  web copies ${mb(outBytes)}`);
  if (inBytes) console.log(`  saving     ${(100 - (outBytes / inBytes) * 100).toFixed(1)}%`);
  console.log('\nNow re-run the manifest builders:');
  console.log('  node tools/build-photo-gallery.mjs && node tools/build-certificates.mjs');
}

run().catch((e) => { console.error(e); process.exit(1); });
