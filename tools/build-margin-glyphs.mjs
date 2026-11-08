/* ============================================================
   Carves the line from Ptahhotep down the page margin, and his
   name under it.

       node tools/build-margin-glyphs.mjs

   The same inscription as the closing artwork —
       wr mꜣꜥt wꜣḥ spdt — "Great is Maat, lasting in effect"
   — set in one tall, narrow column between two ruled lines, like a
   door jamb in a temple, and at its foot, under a dividing line,
   his name محمود in a cartouche: 𓅓𓎛𓅓𓅱𓂧 (m·ḥ·m·w·d).

   The page shows it fixed in the empty margin beside the text on
   wide screens, as tall as the screen allows (css/layout.css, .maat),
   and fills the maxim with gold as the page is read (js/motion.js).
   The name is gilded from the start.

   Three layers are written: the carved column, faint; the maxim
   again, lit, uncovered from the top down; and the name, lit.
   Everything between <!-- maat --> and <!-- /maat --> in
   index.html is replaced; edit this file, not the markup.
   ============================================================ */

import fs from 'node:fs';
import { carve, carveName } from './lib/maat.mjs';

const PAGE = 'index.html';
const INDENT = '  ';
const r1 = (n) => Math.round(n * 10) / 10;

const F = 34;                 // sign size, in column units
const RAIL = 20;              // half the width between the ruled lines
const PAD = 14;               // air between the rules' ends and the signs
const CX = RAIL + 2;          // the axis, leaving room for the rules' stroke
const TOP = PAD + 6;

// the maxim
const maxim = carve({ F, CX, top: TOP });
// a dividing line, then the cartouche
const yDiv = r1(maxim.bottom + PAD);
const cTop = r1(yDiv + PAD * 0.9);       // the cartouche's top
const cPad = F * 0.24;                   // air inside it, above and below the signs
const name = carveName({ F, CX, top: cTop + cPad });
const cBottom = r1(name.bottom + cPad);
const cHalf = RAIL - 4;                  // half its width
const tie = r1(cBottom + 4.5);           // the bar that ties it, at its foot
const W = r1(CX * 2);
const H = r1(tie + PAD + 6);

// the ruled lines: down both sides, closed at the head and foot, with
// a small lozenge at each end of the axis, as on a carved jamb
const L = CX - RAIL, R = CX + RAIL, T = 4, B = r1(H - 4);
const lozenge = (y) => `M${CX} ${r1(y - 3.2)}L${r1(CX + 3.2)} ${y}L${CX} ${r1(y + 3.2)}L${r1(CX - 3.2)} ${y}Z`;
const frame =
  `<path class="maat__rule" fill="none" stroke="currentColor" stroke-width=".9" d="M${L} ${T}H${R}M${L} ${B}H${R}M${L} ${T}V${B}M${R} ${T}V${B}M${L} ${yDiv}H${R}"/>` +
  `<path class="maat__rule" fill="currentColor" d="${lozenge(T)}${lozenge(B)}"/>`;
// the cartouche: a rope oval round the name, tied by a bar at its foot
const cartouche =
  `<rect fill="none" stroke="currentColor" stroke-width="1.3" x="${r1(CX - cHalf)}" y="${cTop}" width="${r1(cHalf * 2)}" height="${r1(cBottom - cTop)}" rx="${r1(cHalf)}"/>` +
  `<path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M${r1(CX - cHalf - 2)} ${tie}H${r1(CX + cHalf + 2)}"/>`;

const signs = (g) => `<g class="maat__signs" fill="currentColor" text-anchor="middle">${g.join('')}</g>`;
const svg = (inner) =>
  `<svg class="maat__svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" focusable="false">${inner}</svg>`;

const block = [
  `<!-- maat -->`,
  `<!-- A line from Ptahhotep down the margin — the same one carved in the`,
  `     closing artwork — and his name in a cartouche at its foot.`,
  `     Drawn by tools/build-margin-glyphs.mjs. -->`,
  `<div class="maat" id="maat" aria-hidden="true" style="--maat-ar:${W} / ${H}">`,
  `  ${svg(frame + signs(maxim.glyphs) + cartouche + signs(name.glyphs))}`,
  `  <span class="maat__lit">${svg(signs(maxim.glyphs))}</span>`,
  `  <span class="maat__name">${svg(cartouche + signs(name.glyphs))}</span>`,
  `  <span class="maat__cap"><i lang="egy-Latn">wr mꜣꜥt wꜣḥ spdt</i><span data-i18n="maat.cap">“Great is Maat, lasting in effect.” — Ptahhotep</span><i lang="egy-Latn">mḥmwd</i><span data-i18n="maat.name">His name in the cartouche: Mahmoud</span></span>`,
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
