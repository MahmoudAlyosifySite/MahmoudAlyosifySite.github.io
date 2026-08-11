/* ============================================================
   Certificate manifest builder
   ------------------------------------------------------------
   Scans Certificates/<Category>/ and writes data/certificates.json,
   which the site reads at runtime.

   Run after adding, removing or renaming any certificate:

       node tools/build-certificates.mjs

   Adding a certificate = drop the file in the right folder and
   re-run. No UI code changes, ever.
   ============================================================ */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CERT_DIR = join(ROOT, 'Certificates');
const OUT = join(ROOT, 'data', 'certificates.json');
const OVERRIDES = join(ROOT, 'tools', 'certificate-titles.json');

/* The five categories, in display order. Folder name is the source of truth. */
const CATEGORIES = [
  {
    id: 'coursera',
    folder: 'Coursera',
    name: { en: 'Coursera', ar: 'كورسيرا' },
    blurb: { en: 'Courses and specialisations completed on Coursera.', ar: 'دورات وتخصصات مكتملة على كورسيرا.' },
    icon: 'coursera'
  },
  {
    id: 'competitions',
    folder: 'Competitions',
    name: { en: 'Competitions', ar: 'المسابقات' },
    blurb: { en: 'Hackathons, awards and competition achievements.', ar: 'هاكاثونات وجوائز وإنجازات في المسابقات.' },
    icon: 'trophy'
  },
  {
    id: 'activities',
    folder: 'Activities-Volunteering',
    name: { en: 'Activities & Volunteering', ar: 'الأنشطة والتطوّع' },
    blurb: { en: 'Community work, leadership and student activities.', ar: 'عمل مجتمعي وقيادة وأنشطة طلابية.' },
    icon: 'people'
  },
  {
    id: 'technical',
    folder: 'Technical-Courses',
    name: { en: 'Technical Courses', ar: 'الدورات التقنية' },
    blurb: { en: 'Training from universities, institutes and platforms.', ar: 'تدريب من جامعات ومعاهد ومنصات مختلفة.' },
    icon: 'code'
  },
  {
    id: 'other',
    folder: 'Other',
    name: { en: 'Other Certificates', ar: 'شهادات أخرى' },
    blurb: { en: 'Everything else worth showing.', ar: 'كل ما يستحق العرض من الشهادات الأخرى.' },
    icon: 'doc'
  }
];

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);
const PDF_EXT = new Set(['.pdf']);

/** Turn a filename into a human title. */
function titleFromFilename(file) {
  return basename(file, extname(file))
    .replace(/[_]+/g, ' ')
    // Keep hyphens that sit inside a word (e.g. "Front-End"); turn the rest into spaces.
    .replace(/\s-\s|-{2,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Filenames a camera or screenshot tool produced, rather than a real title. */
function looksGeneric(title) {
  return /^(img|dsc|dscn|photo|image|screenshot|annotation|scan|untitled|whatsapp|file|cert(ificate)?)\b/i.test(title)
      || /^\d+$/.test(title);
}

async function build() {
  if (!existsSync(CERT_DIR)) {
    console.error(`Certificates directory not found: ${CERT_DIR}`);
    process.exit(1);
  }

  let overrides = {};
  try {
    overrides = JSON.parse(await readFile(OVERRIDES, 'utf8'));
  } catch {
    console.warn('No tools/certificate-titles.json — using filenames only.');
  }

  const categories = [];
  let total = 0;
  let generic = 0;

  for (const cat of CATEGORIES) {
    const dir = join(CERT_DIR, cat.folder);
    let names = [];
    try {
      names = await readdir(dir);
    } catch {
      console.warn(`  · missing folder, skipped: Certificates/${cat.folder}`);
      categories.push({ ...cat, count: 0, items: [] });
      continue;
    }

    const items = [];
    for (const file of names.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))) {
      if (file.startsWith('.')) continue;
      const abs = join(dir, file);
      if (!(await stat(abs)).isFile()) continue;

      const ext = extname(file).toLowerCase();
      const isImage = IMAGE_EXT.has(ext);
      const isPdf = PDF_EXT.has(ext);
      if (!isImage && !isPdf) continue;

      const key = `${cat.folder}/${file}`;
      const o = overrides[key] || {};
      const fallback = titleFromFilename(file);
      const title = o.title || fallback;

      if (!o.title && looksGeneric(fallback)) generic++;

      items.push({
        // Encoded once here so the runtime never has to think about spaces.
        src: `Certificates/${encodeURIComponent(cat.folder)}/${encodeURIComponent(file)}`,
        file,
        type: isPdf ? 'pdf' : 'image',
        title,
        ...(o.issuer ? { issuer: o.issuer } : {}),
        ...(o.year ? { year: o.year } : {}),
        ...(o.verify ? { verify: o.verify } : {}),
        ...(o.course ? { course: o.course } : {})
      });
      total++;
    }

    categories.push({ ...cat, count: items.length, items });
    console.log(`  · ${cat.folder.padEnd(24)} ${String(items.length).padStart(2)} file(s)`);
  }

  const manifest = {
    generated: new Date().toISOString().slice(0, 10),
    total,
    categories
  };

  await writeFile(OUT, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`\n✓ data/certificates.json — ${total} certificates in ${categories.length} categories`);
  if (generic) {
    console.log(`\n  ${generic} file(s) still have camera/screenshot filenames.`);
    console.log('  Rename them to the real certificate title and re-run this script;');
    console.log('  the site picks the new titles up with no code changes.');
  }
}

build().catch((e) => { console.error(e); process.exit(1); });
