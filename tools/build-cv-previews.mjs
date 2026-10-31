/* ============================================================
   CV previews

       node tools/build-cv-previews.mjs

   The CV page (/cv/) shows every CV as a small picture of its
   first page, and on phones — where a PDF set inside a page does
   not display — the pages themselves, as pictures. This renders
   them from the PDFs in "Mahmoud Resumes/assets/pdfs/" with
   pdftoppm (Poppler — it comes with MiKTeX and TeX Live; set
   PDFTOPPM to its path if it is not on PATH) and writes:

     assets/previews/<name>-thumb.webp   the first page, 480 px wide
     assets/previews/<name>-p<n>.png     every page, 1400 px wide — sixteen
                                         colours: half the weight of a WebP
                                         of a page of type, and sharper
     assets/previews/previews.js         a version and a page count per PDF

   The version is a hash of the PDF: a CV that has not changed is
   skipped, and a rebuilt one gets new preview addresses, so the
   service worker (images are cache-first) never shows an old one.
   Re-run after rebuilding any CV.
   ============================================================ */

import sharp from 'sharp';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ASSETS   = path.join('Mahmoud Resumes', 'assets');
const PDFS     = path.join(ASSETS, 'pdfs');
const OUT      = path.join(ASSETS, 'previews');
const MANIFEST = path.join(OUT, 'previews.js');
const PDFTOPPM = process.env.PDFTOPPM || 'pdftoppm';

const PAGE_W  = 1400;   // a phone at 3x, or a tablet at 2x, reads it crisply
const THUMB_W = 480;    // a card is ~220 px wide; this is it at 2x
const PAGE_COLOURS = 16;
const THUMB_Q = 74;

const readManifest = async () => {
  if (!existsSync(MANIFEST)) return {};
  const m = (await fs.readFile(MANIFEST, 'utf8')).match(/=\s*(\{[\s\S]*\});/);
  return m ? JSON.parse(m[1]) : {};
};

const old = await readManifest();
const files = (await fs.readdir(PDFS)).filter((f) => /\.pdf$/i.test(f)).sort();
await fs.mkdir(OUT, { recursive: true });
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cv-previews-'));

const next = {};
let made = 0, skipped = 0;

for (const file of files) {
  const name = file.replace(/\.pdf$/i, '');
  const v = createHash('sha1').update(await fs.readFile(path.join(PDFS, file))).digest('hex').slice(0, 8);
  if (old[file] && old[file].v === v && existsSync(path.join(OUT, `${name}-thumb.webp`))) {
    next[file] = old[file];
    skipped++;
    continue;
  }

  // One folder per PDF, so pdftoppm's numbered pages cannot mix.
  const dir = path.join(tmp, name);
  await fs.mkdir(dir);
  execFileSync(PDFTOPPM, ['-png', '-scale-to-x', String(PAGE_W), '-scale-to-y', '-1', path.join(PDFS, file), path.join(dir, 'p')]);
  const pngs = (await fs.readdir(dir))
    .filter((f) => f.endsWith('.png'))
    .sort((a, b) => parseInt(a.match(/(\d+)\.png$/)[1], 10) - parseInt(b.match(/(\d+)\.png$/)[1], 10));

  // A CV that lost a page must not keep showing it.
  for (const f of await fs.readdir(OUT)) {
    if (f.startsWith(`${name}-p`) && /-p\d+\.(png|webp)$/.test(f)) await fs.unlink(path.join(OUT, f));
  }

  for (const [i, png] of pngs.entries()) {
    await sharp(path.join(dir, png)).png({ palette: true, colors: PAGE_COLOURS, compressionLevel: 9 })
      .toFile(path.join(OUT, `${name}-p${i + 1}.png`));
  }
  await sharp(path.join(dir, pngs[0])).resize({ width: THUMB_W }).webp({ quality: THUMB_Q })
    .toFile(path.join(OUT, `${name}-thumb.webp`));

  next[file] = { v, pages: pngs.length };
  made++;
  console.log(`✓ ${file} — ${pngs.length} page${pngs.length === 1 ? '' : 's'}`);
}

// Previews of a CV that is gone go with it.
const keep = new Set(Object.keys(next).map((f) => f.replace(/\.pdf$/i, '')));
for (const f of await fs.readdir(OUT)) {
  const m = f.match(/^(.*)-(thumb\.webp|p\d+\.(png|webp))$/);
  if (m && !keep.has(m[1])) await fs.unlink(path.join(OUT, f));
}

await fs.writeFile(MANIFEST,
  '/* Built by tools/build-cv-previews.mjs — do not edit by hand. */\n'
  + `window.CV_PREVIEWS = ${JSON.stringify(next, null, 2)};\n`, 'utf8');
await fs.rm(tmp, { recursive: true, force: true });

console.log(`CV previews: ${made} built, ${skipped} unchanged.`);
