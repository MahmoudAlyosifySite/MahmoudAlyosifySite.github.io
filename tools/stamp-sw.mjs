/* ============================================================
   Stamps sw.js with a content hash of everything it caches.

       node tools/stamp-sw.mjs

   Runs as part of `npm run build`. Without it you have to remember
   to bump the cache version by hand on every deploy — forget once
   and visitors keep seeing the previous CSS/JS from their cache.
   ============================================================ */

import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';

const WATCHED = [
  'index.html',
  'css/theme.css', 'css/layout.css', 'css/motion.css', 'css/chatbot.css',
  'js/data.js', 'js/i18n.js', 'js/ui.js', 'js/photo-gallery.js',
  'js/certificates.js', 'js/motion.js',
  'js/chatbot.js', 'js/providers.js', 'js/retriever.js', 'js/security.js',
  'data/certificates.json', 'data/photo-gallery.json', 'data/mahmoud-profile.json'
];

const hash = createHash('sha1');
for (const f of WATCHED) {
  if (existsSync(f)) hash.update(await fs.readFile(f));
}
const stamp = hash.digest('hex').slice(0, 10);

const swPath = 'sw.js';
const sw = await fs.readFile(swPath, 'utf8');
const next = sw.replace(/const VERSION = '[^']*';/, `const VERSION = 'ma-${stamp}';`);

if (next === sw) {
  console.log(`sw.js already at ma-${stamp}`);
} else {
  await fs.writeFile(swPath, next, 'utf8');
  console.log(`✓ sw.js cache version → ma-${stamp}`);
}
