/* ============================================================
   A line from Ptahhotep, carved as on a temple wall:
       wr mꜣꜥt wꜣḥ spdt — "Great is Maat, lasting in effect"
   Spellings (Allen, Middle Egyptian, via Wiktionary):
       wr:r · U2:mAa-a:t:Y1 · wAH-H-Y1V · M44-t:Y1

   Shared by the closing artwork (tools/build-closing-scene.mjs)
   and the column in the page margin (tools/build-margin-glyphs.mjs),
   so both carry the same inscription, sign for sign.

   carve({ F, CX, top }) lays the signs down one column whose axis
   is x = CX, starting at y = top, with F the sign size. It returns
   the <text> elements and the y where the column ends.
   ============================================================ */

const r1 = (n) => Math.round(n * 10) / 10;

// ink boxes at font-size 100, text-anchor middle, baseline 0 (measured in Noto Sans Egyptian Hieroglyphs)
export const INK = {
  '𓅨': [-56, 56, -94, -16], '𓂋': [-55, 55, -29, 0], '𓌴': [-62, 62, -84, -10], '𓐙': [-59, 58, -25, 0],
  '𓂝': [-71, 71, -58, 0], '𓏏': [-28, 27, -46, -20], '𓏛': [-56, 56, -50, -20],
  '𓎝': [-25, 26, -100, 1], '𓎛': [-18, 18, -100, 0], '𓇮': [-22, 23, -99, 19],
  // his name: m (owl), ḥ (wick), w (quail chick), d (hand)
  '𓅓': [-52, 51, -100, 2], '𓅱': [-39, 39, -100, 1], '𓂧': [-75, 74, -61, -8],
};

/** The signs, in reading order — what a font needs to be able to set. */
export const SIGNS = '𓅨𓂋𓌴𓐙𓂝𓏏𓏛𓎝𓎛𓇮𓅓𓅱𓂧';

/* His name, محمود, spelled sign for sign: m·ḥ·m·w·d. Egyptian has the same
   deep ḥ as Arabic ح (the twisted wick, 𓎛), so the spelling is exact:
       𓅓 m · 𓎛 ḥ · 𓅓 m · 𓅱 w · 𓂧 d
   carveName({ F, CX, top }) stacks them down the axis and returns the
   <text> elements and where the name ends. */
export function carveName({ F, CX, top: y0 }) {
  const glyphs = [];
  const put = (g, top, s) => {
    const [l, r, t, b] = INK[g];
    const k = (F * s) / 100;
    glyphs.push(`<text x="${r1(CX - ((l + r) / 2) * k)}" y="${r1(top - t * k)}" font-size="${r1(F * s)}">${g}</text>`);
    return (b - t) * k;
  };
  const gap = F * 0.12;
  let y = y0;
  y += put('𓅓', y, 0.6) + gap;
  y += put('𓎛', y, 0.6) + gap;
  y += put('𓅓', y, 0.6) + gap;
  y += put('𓅱', y, 0.6) + gap * 1.4;
  y += put('𓂧', y, 0.52);
  return { glyphs, bottom: y };
}

export function carve({ F, CX, top: y0 }) {
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
  let y = y0;
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
  return { glyphs, bottom: y };
}
