/* ============================================================
   Photo gallery manifest builder

       node tools/build-photo-gallery.mjs

   Order is fixed and intentional:
     1. Start.*        — always the opening photo
     2. everything else — oldest to newest, by date
     3. last.*         — always the closing photo

   "Date" is taken from an EXIF-style date in the filename when
   there is one (e.g. 2023-05-01, 20230501, "Bio FCI 2023"),
   otherwise from the file's modified time.
   ============================================================ */

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const galleryDir = path.join(root, 'img', "Mahmoud's Photo Gallery");
const outFile = path.join(root, 'data', 'photo-gallery.json');

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.avif']);

const isImage = (name) => SUPPORTED.has(path.extname(name).toLowerCase());
const baseName = (name) => path.basename(name, path.extname(name));

/** Pull a date out of the filename if one is in there. */
function dateFromName(name) {
  const s = baseName(name);

  // 2023-05-01 / 2023_05_01 / 2023.05.01
  let m = s.match(/(20\d{2})[-_.](\d{2})[-_.](\d{2})/);
  if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]);

  // 20230501
  m = s.match(/\b(20\d{2})(\d{2})(\d{2})\b/);
  if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]);

  // bare year, e.g. "Bio FCI 2023"
  m = s.match(/\b(20\d{2})\b/);
  if (m) return Date.UTC(+m[1], 0, 1);

  return null;
}

function build() {
  if (!fs.existsSync(galleryDir)) {
    console.error(`Gallery folder not found: ${galleryDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(galleryDir, { withFileTypes: true })
    .filter((e) => e.isFile() && isImage(e.name) && !e.name.startsWith('.'))
    .map((e) => e.name);

  const isStart = (n) => /^start$/i.test(baseName(n));
  const isLast = (n) => /^last$/i.test(baseName(n));

  const start = files.filter(isStart);
  const end = files.filter(isLast);
  const middle = files.filter((n) => !isStart(n) && !isLast(n));

  // Oldest → newest. Filename date wins over mtime; ties fall back to name.
  const stamp = (n) => dateFromName(n) ?? fs.statSync(path.join(galleryDir, n)).mtimeMs;
  middle.sort((a, b) => {
    const d = stamp(a) - stamp(b);
    return d !== 0 ? d : a.localeCompare(b, 'en', { numeric: true });
  });

  const ordered = [...start, ...middle, ...end];

  // Encode each path segment. The folder name has spaces and an apostrophe,
  // and filenames contain "&" and a smart quote — all of which break a raw URL.
  const FOLDER = ['img', "Mahmoud's Photo Gallery"].map(encodeURIComponent).join('/');
  const WEB = 'img/_web/gallery';

  const items = ordered.map((file, i) => {
    const stem = baseName(file);
    const web = path.join(root, 'img', '_web', 'gallery', `${stem}.webp`);
    // Serve the optimised copy when it exists; fall back to the original so
    // the gallery still works if the optimiser hasn't been run.
    const hasWeb = fs.existsSync(web);

    return {
      src: hasWeb ? `${WEB}/${encodeURIComponent(stem)}.webp`
                  : `${FOLDER}/${encodeURIComponent(file)}`,
      full: `${FOLDER}/${encodeURIComponent(file)}`,
      file,
      alt: `Mahmoud Alyosify — photo ${i + 1} of ${ordered.length}`,
      pinned: isStart(file) ? 'start' : isLast(file) ? 'end' : undefined
    };
  });

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify({
    generated: new Date().toISOString().slice(0, 10),
    total: items.length,
    images: items
  }, null, 2) + '\n');

  console.log(`✓ data/photo-gallery.json — ${items.length} photo(s)`);
  console.log(`  first: ${ordered[0] ?? '—'}`);
  console.log(`  last:  ${ordered.at(-1) ?? '—'}`);
  if (!start.length) console.log('  note: no Start.png found — add one to pin the opening photo.');
  if (!end.length) console.log('  note: no last.png found — add one to pin the closing photo.');
}

build();
