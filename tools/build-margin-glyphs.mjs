/* ============================================================
   Carves the line from Ptahhotep down the page margin.

       node tools/build-margin-glyphs.mjs

   The same inscription as the closing artwork —
       wr mꜣꜥt wꜣḥ spdt — "Great is Maat, lasting in effect"
   — set in one column between two ruled lines, like a door jamb
   in a temple. The page shows it fixed in the empty margin beside
   the text on wide screens (css/layout.css, .maat), and fills it
   with gold as the page is read (js/motion.js).

   Two copies of the column are written: the carved one, faint,
   and the lit one over it, which is uncovered from the top down.
   Everything between <!-- maat --> and <!-- /maat --> in
   index.html is replaced; edit this file, not the markup.
   ============================================================ */

import fs from 'node:fs';
import { carve } from './lib/maat.mjs';

const PAGE = 'index.html';
const INDENT = '  ';
const r1 = (n) => Math.round(n * 10) / 10;

const F = 34;                 // sign size, in column units
const RAIL = 24;              // half the width between the ruled lines
const PAD = 14;               // air between the rules' ends and the signs
const CX = RAIL + 2;          // the axis, leaving room for the rules' stroke
const TOP = PAD + 6;

const { glyphs, bottom } = carve({ F, CX, top: TOP });
const W = r1(CX * 2);
const H = r1(bottom + PAD + 6);

// the ruled lines: down both sides, closed at the head and foot, with
// a small lozenge at each end of the axis, as on a carved jamb
const L = CX - RAIL, R = CX + RAIL, T = 4, B = r1(H - 4);
const lozenge = (y) => `M${CX} ${r1(y - 3.2)}L${r1(CX + 3.2)} ${y}L${CX} ${r1(y + 3.2)}L${r1(CX - 3.2)} ${y}Z`;
const frame =
  `<path class="maat__rule" fill="none" stroke="currentColor" stroke-width=".9" d="M${L} ${T}H${R}M${L} ${B}H${R}M${L} ${T}V${B}M${R} ${T}V${B}"/>` +
  `<path class="maat__rule" fill="currentColor" d="${lozenge(T)}${lozenge(B)}"/>`;

const svg = (cls, inner) =>
  `<svg class="${cls}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" focusable="false">` +
  `${inner}<g class="maat__signs" fill="currentColor" text-anchor="middle">${glyphs.join('')}</g></svg>`;

const block = [
  `<!-- maat -->`,
  `<!-- A line from Ptahhotep down the margin — the same one carved in the`,
  `     closing artwork. Drawn by tools/build-margin-glyphs.mjs. -->`,
  `<div class="maat" id="maat" aria-hidden="true" style="--maat-ar:${W} / ${H}">`,
  `  ${svg('maat__svg', frame)}`,
  `  <span class="maat__lit">${svg('maat__svg', '')}</span>`,
  `  <span class="maat__cap"><i lang="egy-Latn">wr mꜣꜥt wꜣḥ spdt</i><span data-i18n="maat.cap">“Great is Maat, lasting in effect.” — Ptahhotep</span></span>`,
  `</div>`,
  `<!-- /maat -->`,
].map((l) => INDENT + l).join('\n');

const html = fs.readFileSync(PAGE, 'utf8');
const a = html.indexOf(`${INDENT}<!-- maat -->`);
const b = html.indexOf('<!-- /maat -->');
let next;
if (a >= 0 && b > a) {
  next = html.slice(0, a) + block + html.slice(b + '<!-- /maat -->'.length);
} else {
  // first run: seat it right after the section ruler
  const anchor = '<nav class="dots" aria-label="Section navigation"></nav>';
  const at = html.indexOf(anchor);
  if (at < 0) throw new Error(`${PAGE}: no section ruler to seat the column after`);
  const end = at + anchor.length;
  next = html.slice(0, end) + '\n\n' + block + html.slice(end);
}
if (next === html) console.log(`${PAGE} already has this column`);
else { fs.writeFileSync(PAGE, next, 'utf8'); console.log(`✓ margin column → ${PAGE} (${W} × ${H} units)`); }
