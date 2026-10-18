// Build "Mahmoud Alyosify — Introduction" as an editable PowerPoint deck: every scene of the
// 90-second film and of the 30-second website cut, laid out like the film's frames.
// Coordinates are the film's 1920 × 1080 pixels (÷144 = inches on a 13.33" slide); type sizes are px ÷ 2 = pt.
//   node build.js && py -3.13 post.py
const path = require('path');
const fs = require('fs');
const pptxgen = require('pptxgenjs');
const SKILL = process.env.PPTX_SKILL;
const { applyTheme } = require(path.join(SKILL, 'scripts', 'apply_theme.js'));
const meta = require('./assets/meta.json');
const M = require('./assets/measure.json');
const A = f => path.join(__dirname, 'assets', f);
const I = v => +(v / 144).toFixed(4);

const THEME = {
  name: 'Alyosify Black and Gold', headFontFace: 'Gloock', bodyFontFace: 'Ysabeau Office',
  colors: { dk1: '0B0B0C', lt1: 'EEEAE2', dk2: '141416', lt2: 'C2BEB6', accent1: 'C9A55E', accent2: 'D6B676',
    accent3: '908C85', accent4: 'F2DFA8', accent5: 'A9843F', accent6: '111113', hlink: 'D6B676', folHlink: 'C9A55E' },
};
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Mahmoud Alyosify — Introduction';
pres.author = 'Mahmoud Alyosify';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const PAPER = C.text1, INK = C.background1, INK2 = C.background2, GOLD = C.accent1, GOLDINK = C.accent2, INK3 = C.accent3, PAPER3 = C.accent6;
const MONO = 'Chivo Mono', MONO5 = 'Chivo Mono Medium', SERIF = 'Gloock', SANS = 'Ysabeau Office', SANS5 = 'Ysabeau Office Medium';

pres.defineSlideMaster({ title: 'FILM', background: { path: A('bg.png') } });

// ── recorded for post.py: crops, animations, transitions ──
const crops = {}, decks = [];
let cur = null;
function slide(section, title, { advance, transition = 'fade', notes = '' }) {
  if (section) pres.addSection({ title: section });
  const s = pres.addSlide({ masterName: 'FILM', sectionTitle: currentSection });
  cur = { n: decks.length + 1, title, advance, transition, anims: [] };
  decks.push(cur);
  s.addNotes(`${title}\n${notes}`);
  return s;
}
let currentSection = '';
function section(t) { currentSection = t; pres.addSection({ title: t }); }
const anim = (name, type, delay, dur = 750, extra = {}) => cur.anims.push({ name, type, delay, dur, ...extra });
const nm = s => `s${cur.n}-${s}`;

// ── primitives ──
function text(s, id, str, o) {
  const name = nm(id);
  const w = o.w ?? 1400, x = o.align === 'center' ? o.x - w / 2 : o.x;
  s.addText(str, {
    objectName: name, x: I(x), y: I(o.y), w: I(w), h: I(o.h ?? o.size * 1.4),
    fontFace: o.font ?? SANS, fontSize: o.size / 2, color: o.color ?? INK, italic: !!o.italic, align: o.align ?? 'left',
    valign: 'top', margin: 0, charSpacing: o.cs, lineSpacingMultiple: o.lh, isTextBox: true, fit: 'none', wrap: true,
  });
  return name;
}
const kicker = (s, id, str, x, y, o = {}) => text(s, id, str.toUpperCase(), { x, y, size: 22, font: MONO5, color: GOLDINK, cs: 3.1, w: o.w ?? 1100, align: o.align, lh: o.lh, h: o.h });
const head = (s, id, str, x, y, o = {}) => text(s, id, str, { x, y, size: o.size ?? 72, font: SERIF, lh: .95, w: o.w ?? 1400, align: o.align, h: o.h, color: o.color });
const lead = (s, id, str, x, y, o = {}) => text(s, id, str, { x, y, size: 44, lh: 1.1, w: o.w ?? 900, align: o.align, h: o.h });
const sec = (s, id, str, x, y, o = {}) => text(s, id, str, { x, y, size: 34, lh: 1.15, color: o.color ?? INK2, w: o.w ?? 1100, align: o.align, h: o.h });
const quote = (s, id, str, x, y, o = {}) => text(s, id, str, { x, y, size: o.size ?? 48, font: SANS5, italic: true, lh: 1.1, w: o.w ?? 1000, h: o.h });

function img(s, id, file, x, y, w, h, o = {}) {
  const name = nm(id);
  s.addImage({ path: A(file), x: I(x), y: I(y), w: I(w), h: I(h), objectName: name, transparency: o.transparency,
    shadow: o.shadow ? { type: 'outer', blur: 18, offset: 8, angle: 90, color: '000000', opacity: .6 } : undefined });
  return name;
}
// a photo framed like the film's Ken Burns state: [scale over cover, focus x, focus y, screen x, screen y]
function photo(s, id, file, x, y, w, h, [sc, fx, fy, sx, sy], o = {}) {
  const [iw, ih] = meta.dims[file.replace(/\.\w+$/, '')];
  const k = Math.max(w / iw, h / ih) * sc, dw = iw * k, dh = ih * k;
  const cx = Math.min(0, Math.max(w - dw, sx - fx * dw)), cy = Math.min(0, Math.max(h - dh, sy - fy * dh));
  const l = -cx / k, t = -cy / k, r = l + w / k, b = t + h / k;
  const name = img(s, id, file, x, y, w, h, { shadow: o.inset });
  crops[name] = { l: Math.round(l / iw * 1e5), t: Math.round(t / ih * 1e5), r: Math.round((iw - r) / iw * 1e5), b: Math.round((ih - b) / ih * 1e5) };
  return name;
}
function line(s, id, x1, y1, x2, y2, o = {}) {
  s.addShape(pres.shapes.LINE, { objectName: nm(id), x: I(Math.min(x1, x2)), y: I(Math.min(y1, y2)), w: I(Math.abs(x2 - x1)), h: I(Math.abs(y2 - y1)),
    flipV: (y2 < y1) !== (x2 < x1) && x1 !== x2 && y1 !== y2, line: { color: o.color ?? GOLD, width: o.width ?? .75, transparency: o.transparency } });
  return nm(id);
}
function dot(s, id, cx, cy, r, o = {}) {
  s.addShape(pres.shapes.OVAL, { objectName: nm(id), x: I(cx - r), y: I(cy - r), w: I(2 * r), h: I(2 * r),
    fill: o.fill === 'none' ? { type: 'none' } : { color: o.fill ?? PAPER, transparency: o.fillT },
    line: o.line === false ? { type: 'none' } : { color: o.line ?? GOLD, width: o.lw ?? 1, transparency: o.lineT } });
  return nm(id);
}
// open or closed polylines in film px, drawn as one editable freeform; segs = [[x,y],...] or [[[x,y]...],[...]]
function freeform(s, id, segs, o = {}) {
  if (!Array.isArray(segs[0][0])) segs = [segs];
  const all = segs.flat(), xs = all.map(p => p[0]), ys = all.map(p => p[1]);
  const x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0 || 1, h = Math.max(...ys) - y0 || 1;
  const points = [];
  for (const seg of segs) seg.forEach(([x, y], i) => points.push({ x: I(x - x0), y: I(y - y0), ...(i === 0 ? { moveTo: true } : {}) }));
  if (o.close) points.push({ close: true });
  s.addShape(pres.shapes.CUSTOM_GEOMETRY, { objectName: nm(id), x: I(x0), y: I(y0), w: I(w), h: I(h), points,
    fill: o.fill ? { color: o.fill, transparency: o.fillT } : { type: 'none' },
    line: { color: o.color ?? GOLD, width: o.width ?? .75, transparency: o.transparency } });
  return nm(id);
}
const parsePath = d => d.replace(/^M/, '').replace(/Z$/, '').split('L').map(p => p.trim().split(/\s+/).map(Number));

// the gold thread of the journey along the foot of scenes 2–8
const YEARS = [[2000, 220], [2019, 560], [2023, 900], [2025, 1300], [2026, 1700]];
function thread(s, at) {
  line(s, 'thread', 160, 1000, 1760, 1000, { transparency: 45 });
  YEARS.forEach(([yr, x]) => {
    dot(s, `node${yr}`, x, 1000, 5, { lw: 1 });
    text(s, `year${yr}`, String(yr), { x, y: 1014, size: 20, font: MONO, color: Math.abs(x - at) < 12 ? GOLDINK : INK3, align: 'center', w: 120, cs: 2 });
  });
  dot(s, 'halo', at, 1000, 11, { fill: GOLD, fillT: 70, line: false });
  dot(s, 'playhead', at, 1000, 4, { fill: GOLD, line: false });
}
// the site's marker stroke under a phrase, sitting on the text's lower third
const marker = (s, id, x, y, w, size) => img(s, id, 'marker.png', x - size * .06, y + size * .62, w + size * .12, size * .42);
// the portrait (rim light baked in) on the right, bottom-anchored, like §1.8
function portrait(s) {
  img(s, 'backglow', 'backglow.png', 840, 0, 1120, 1120);
  const k = 1000 / 1400, pad = 200 * k;
  return img(s, 'portrait', 'portrait-rim.png', 900 - pad, 80 - pad, 1800 * k, 1800 * k);
}
const wordmarkH = w => w * 466 / 2000;

// ════════════════════════════ THE FILM · 90 s ════════════════════════════
section('The film · 90 seconds');

let s = slide(null, '1 · The Mark', { advance: 6000, transition: 'fade', notes: 'Film 0–6 s. A hairline draws, then the emblem resolves out of the dark.' });
line(s, 'hair', 750, 760, 1170, 760, { transparency: 20 });
img(s, 'emblem', 'emblem.png', 750, 332, 420, 376);
anim(nm('hair'), 'wipeL', 1500, 1500); anim(nm('emblem'), 'zoom', 3000, 2250);

s = slide(null, '2 · Mahmoud Alyosify', { advance: 6000, transition: 'black', notes: 'Film 6–12 s. The portrait emerges, the rim light finds him, the name writes itself.' });
const p2 = portrait(s);
img(s, 'wordmark', 'wordmark.png', 160, 400, 660, wordmarkH(660));
kicker(s, 'roles', 'AI Engineer · Researcher · Educator', 160, 598);
line(s, 'rule', 160, 640, 400, 640);
text(s, 'alias', 'also known as Mahmoud Sayed Youssef', { x: 160, y: 660, size: 30, italic: true, color: INK3, w: 900 });
anim(p2, 'fade', 0, 2250); anim(nm('backglow'), 'fade', 750, 2250); anim(p2, 'grow', 0, 6000, { scale: 103 });
anim(nm('wordmark'), 'wipeL', 750, 1500); anim(nm('roles'), 'rise', 2250); anim(nm('rule'), 'wipeL', 3000); anim(nm('alias'), 'rise', 3000);

s = slide(null, '3 · Origins', { advance: 3000, transition: 'fade', notes: 'Film 12–15 s. Egypt and the Nile draw in gold; a node marks Assiut.' });
const G = meta.geo;
freeform(s, 'egypt', parsePath(G.egyptPath), { close: true, transparency: 65 });
freeform(s, 'nile', parsePath(G.nilePath), { width: 1 });
freeform(s, 'delta', [parsePath(G.rosettaPath), parsePath(G.damiettaPath)]);
dot(s, 'cairo', G.cairo2[0], G.cairo2[1], 3, { fill: GOLD, fillT: 65, line: false });
dot(s, 'assiut', G.assiut2[0], G.assiut2[1], 5, { lw: 1 });
text(s, 'assiutLabel', 'ASSIUT', { x: G.assiut2[0] + 22, y: G.assiut2[1] - 11, size: 20, font: MONO, color: INK3, w: 200, cs: 2 });
kicker(s, 'born', 'Born 23 November 2000', 160, 360);
lead(s, 'began', 'It began in Assiut, Upper Egypt.', 160, 420);
thread(s, 220);
anim(nm('egypt'), 'fade', 0, 1500); anim(nm('nile'), 'wipeB', 750, 1500); anim(nm('delta'), 'fade', 1900, 600);
anim(nm('assiut'), 'zoom', 1500, 500); anim(nm('assiutLabel'), 'fade', 1900); anim(nm('cairo'), 'fade', 2000);
anim(nm('born'), 'rise', 750); anim(nm('began'), 'rise', 1500);

s = slide(null, '4 · Childhood', { advance: 3750, transition: 'black', notes: 'Film 14.25–18 s. Three framed photos: as a toddler, at nursery school, on horseback among the palms. No age on screen.' });
kicker(s, 'born', 'Born 23 November 2000', 160, 360);
quote(s, 'einstein', 'His physics teachers called him\n“Egypt’s Einstein.”', 160, 420);
marker(s, 'mark', 160, 420 + 53, M.einstein[0] + M.einstein[1], 48);
photo(s, 'toddler', 'toddler.jpg', 820, 230, 310, 520, [1.04, .47, .45, 155, 260], { inset: true });
photo(s, 'nursery', 'childhood.jpg', 1150, 290, 290, 420, [1.0, .5, .40, 145, 190], { inset: true });
photo(s, 'horse', 'horse.jpg', 1460, 250, 300, 480, [1.04, .40, .36, 150, 210], { inset: true });
thread(s, 220);
anim(nm('toddler'), 'fade', 150, 900); anim(nm('nursery'), 'fade', 750, 900); anim(nm('horse'), 'fade', 1350, 900);
anim(nm('einstein'), 'rise', 1500); anim(nm('mark'), 'wipeL', 2250);

s = slide(null, '5 · Assiut University', { advance: 3000, transition: 'fade', notes: 'Film 18–21 s. The class of 2023 in front of the Faculty of Computers and Information.' });
photo(s, 'class', 'fci.jpg', 0, 0, 1920, 1080, [1.12, .5, .45, 1200, 540]);
img(s, 'shade', 'grad-left.png', 0, 0, 1920, 1080); img(s, 'foot', 'grad-bottom.png', 0, 860, 1920, 220);
img(s, 'logo', 'assiut.png', 160, 250, 150 * 240 / 352, 150);
kicker(s, 'years', '2019 – 2023', 160, 440);
head(s, 'uni', 'Assiut University', 160, 480);
sec(s, 'faculty', 'Faculty of Computers and Information', 160, 575);
thread(s, 560);
anim(nm('class'), 'fade', 0, 750); anim(nm('class'), 'grow', 0, 3000, { scale: 104 });
anim(nm('logo'), 'fade', 750, 1000); anim(nm('years'), 'rise', 1500); anim(nm('uni'), 'rise', 1500); anim(nm('faculty'), 'rise', 2250);

s = slide(null, '6 · The university years', { advance: 3000, transition: 'black', notes: 'Film 21–24 s. At FCI, a studio portrait, and the Nile trip in Luxor (2020).' });
img(s, 'logo', 'assiut.png', 160, 250, 150 * 240 / 352, 150);
kicker(s, 'years', '2019 – 2023', 160, 440);
head(s, 'uni', 'Assiut University', 160, 480);
sec(s, 'degree', 'B.Sc. Computer & Information Science\nBioinformatics', 160, 575, { w: 600 });
photo(s, 'fci', 'student.jpg', 780, 300, 330, 430, [1.0, .5, .4, 165, 215], { inset: true });
photo(s, 'portrait', 'youth.jpg', 1130, 250, 300, 520, [1.0, .5, .45, 150, 260], { inset: true });
photo(s, 'luxor', 'luxor.jpg', 1450, 230, 310, 551, [1.25, .58, .45, 155, 245], { inset: true });
thread(s, 815);
anim(nm('degree'), 'rise', 100); anim(nm('fci'), 'fade', 0, 900); anim(nm('portrait'), 'fade', 600, 900); anim(nm('luxor'), 'fade', 1100, 900);

s = slide(null, '7 · He learned to lead', { advance: 6000, transition: 'black', notes: 'Film 24–30 s. Student Union, Smart Cities Hackathon, Ideal Student, Vitalism Solution.' });
head(s, 'title', 'He learned to lead.', 960, 150, { align: 'center' });
const panels = [['union', 'union.jpg', [1.04, .5, .55, 190, 280], 'STUDENT UNION', 'Scientific Committee Secretary'],
  ['hackathon', 'hackathon.jpg', [1.04, .47, .40, 190, 280], '1ST PLACE', 'Smart Cities Hackathon · 2022'],
  ['ideal', 'ideal.jpg', [1.04, .66, .38, 190, 280], 'IDEAL STUDENT', '2022–2023'],
  ['vitalism', 'vitalism.jpg', [1.04, .50, .42, 190, 280], 'VITALISM SOLUTION', 'Imagine Cup semi-finalist']];
panels.forEach(([id, file, kb, top, bottom], i) => {
  const x = 160 + i * 406;
  photo(s, id, file, x, 280, 380, 560, kb, { inset: true });
  s.addText([{ text: top, options: { color: GOLDINK, fontFace: MONO5, breakLine: true } }, { text: bottom, options: { color: INK2, fontFace: MONO } }],
    { objectName: nm(id + 'Cap'), x: I(x - 20), y: I(864), w: I(420), h: I(70), fontSize: 10, align: 'center', valign: 'top', margin: 0, isTextBox: true, lineSpacingMultiple: 1.2 });
  anim(nm(id), 'wipeB', 750 + i * 1100, 750); anim(nm(id + 'Cap'), 'fade', 1100 + i * 1100, 600);
});
thread(s, 900);
anim(nm('title'), 'rise', 0);

s = slide(null, '8 · Graduated', { advance: 6000, transition: 'black', notes: 'Film 30–36 s. July 2023, GPA 3.53 / 4.00, graduation project graded A+.' });
photo(s, 'grad', 'graduation.jpg', 0, 0, 1920, 1080, [1.14, .52, .38, 1240, 470]);
img(s, 'shade', 'grad-left.png', 0, 0, 1920, 1080);
kicker(s, 'date', 'July 2023', 160, 420);
head(s, 'title', 'Graduated.', 160, 460);
marker(s, 'mark', 160, 460, M.graduated[1], 72);
sec(s, 'gpa', 'GPA 3.53 / 4.00\nGraduation project graded A+', 160, 560);
thread(s, 900);
anim(nm('grad'), 'fade', 0, 750); anim(nm('grad'), 'grow', 0, 6000, { scale: 106 });
anim(nm('date'), 'rise', 750); anim(nm('title'), 'rise', 1500); anim(nm('mark'), 'wipeL', 2250); anim(nm('gpa'), 'rise', 3000);

s = slide(null, '9 · Service', { advance: 6000, transition: 'black', notes: 'Film 36–42 s. Military service as a systems engineer, 2024–2025.' });
kicker(s, 'years', '2024 – 2025', 160, 400);
lead(s, 'role', 'Military service,\nas a systems engineer.', 160, 440, { w: 680 });
sec(s, 'tolls', 'Back-end systems for toll roads serving\nover half of Egypt’s vehicles.', 160, 575, { w: 680 });
quote(s, 'kept', 'He kept learning when\nthere was little room to.', 160, 690, { size: 40, w: 680 });
photo(s, 'officers', 'officers.jpg', 860, 250, 440, 550, [1.10, .5, .42, 220, 250], { inset: true });
photo(s, 'gate', 'service.jpg', 1340, 250, 400, 550, [1.20, .5, .55, 200, 300], { inset: true });
thread(s, 1100);
anim(nm('officers'), 'fade', 400, 1100); anim(nm('gate'), 'fade', 1600, 1100);
anim(nm('years'), 'rise', 750); anim(nm('role'), 'rise', 1500); anim(nm('tolls'), 'rise', 3000); anim(nm('kept'), 'rise', 4750);

s = slide(null, '10 · Einstein Misr', { advance: 3000, transition: 'fade', notes: 'Film 42–45 s. Teaching since 2020 on his channel, Einstein Misr.' });
photo(s, 'board', 'teach.jpg', 760, 200, 1000, 593, [1.10, .5, .45, 500, 296], { inset: true });
img(s, 'logo', 'einstein-misr.png', 150, 150, 150, 150);
kicker(s, 'channel', 'Einstein Misr · since 2020', 160, 330);
lead(s, 'lessons', 'Arabic lessons\nin algorithms,\ndiscrete maths\nand probability.', 160, 376, { w: 560 });
thread(s, 1300);
anim(nm('board'), 'fade', 0, 900); anim(nm('logo'), 'zoom', 400, 1000); anim(nm('channel'), 'rise', 750); anim(nm('lessons'), 'rise', 1500);

s = slide(null, '11 · 10,000+ learners', { advance: 3000, transition: 'fade', notes: 'Film 45–48 s. 10,000+ learners and 700K+ YouTube views.' });
head(s, 'learners', '10,000+', 560, 430, { size: 150, align: 'center', w: 760, color: GOLDINK });
kicker(s, 'learnersLabel', 'Learners', 560, 600, { align: 'center', w: 500 });
head(s, 'views', '700K+', 1260, 430, { size: 150, align: 'center', w: 640, color: GOLDINK });
kicker(s, 'viewsLabel', 'YouTube views', 1260, 600, { align: 'center', w: 500 });
line(s, 'rule', 910, 440, 910, 640, { transparency: 30 });
thread(s, 1300);
anim(nm('learners'), 'zoom', 0, 1500); anim(nm('learnersLabel'), 'rise', 400); anim(nm('views'), 'zoom', 750, 1500);
anim(nm('viewsLabel'), 'rise', 1150); anim(nm('rule'), 'wipeT', 2250, 500);

s = slide(null, '12 · From trainee to instructor', { advance: 3000, transition: 'black', notes: 'Film 48–51 s. Trained at NTI (photo at Microsoft, Smart Village), later its machine-learning instructor.' });
kicker(s, 'nti', 'National Telecommunication\nInstitute', 160, 350, { lh: 1.6, h: 80 });
lead(s, 'trainee', 'From trainee\nto machine-learning\ninstructor.', 160, 440, { w: 620 });
sec(s, 'hours', '300+ hours · 100+ students', 160, 630);
photo(s, 'microsoft', 'microsoft.jpg', 800, 360, 540, 360, [1.02, .55, .52, 270, 180], { inset: true });
photo(s, 'building', 'nti.jpg', 1360, 280, 400, 520, [1.0, .5, .58, 200, 300], { inset: true });
thread(s, 1300);
anim(nm('microsoft'), 'fade', 0, 900); anim(nm('building'), 'fade', 600, 900);
anim(nm('nti'), 'rise', 0); anim(nm('trainee'), 'rise', 750); anim(nm('hours'), 'rise', 1500);

s = slide(null, '13 · He builds', { advance: 3000, transition: 'fade', notes: 'Film 51–54 s.' });
photo(s, 'lab', 'lab.jpg', 900, 0, 1020, 1080, [1.0, .5, .45, 510, 540]);
img(s, 'edge', 'grad-edge.png', 900, 0, 320, 1080);
head(s, 'builds', 'He builds\nintelligent systems.', 160, 420, { w: 760 });
thread(s, 1300);
anim(nm('lab'), 'fade', 0, 900); anim(nm('lab'), 'grow', 0, 3000, { scale: 104 }); anim(nm('builds'), 'rise', 400);

s = slide(null, '14 · Intelligent systems', { advance: 6000, transition: 'none', notes: 'Film 54–60 s. A network whose outputs are his projects. A hard cut follows, on the climax downbeat.' });
{
  const mulberry32 = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const nr = mulberry32(808);
  const layers = [[4, 400], [8, 820], [6, 1240]].map(([n, x], li) => [...Array(n)].map((_, i) => {
    const y = 330 + (820 - 330) * i / (n - 1);
    return { x: x + (nr() - .5) * 48, y: y + (li === 2 ? 0 : (nr() - .5) * 48) };
  }));
  for (let li = 0; li < 2; li++) {
    const segs = []; for (const a of layers[li]) for (const b of layers[li + 1]) segs.push([[a.x, a.y], [b.x, b.y]]);
    freeform(s, `edges${li + 1}`, segs, { transparency: 70 });
    anim(nm(`edges${li + 1}`), 'wipeL', li * 500, 600);
  }
  const projects = ['AudioShield', 'SimCLR-Vision-SSL', 'SCRAP', 'Horus-OSINT', 'HORUS Sentinel', 'RL-Cloud-Autoscaler'];
  layers.forEach((L, li) => L.forEach((p, i) => {
    const out = li === 2;
    dot(s, `n${li}${i}`, p.x, p.y, 6, out ? { fill: GOLD, lw: 1 } : { lw: 1 });
    anim(nm(`n${li}${i}`), 'fade', out ? 1000 + i * 600 : li * 400, 500);
    if (out) {
      text(s, `p${i}`, projects[i].toUpperCase(), { x: p.x + 26, y: p.y - 15, size: 24, font: MONO, color: i === 5 ? GOLDINK : INK2, w: 520, cs: 1 });
      anim(nm(`p${i}`), 'rise', 1000 + i * 600, 500);
    }
  }));
  sec(s, 'fields', 'LLMs · Agents · Computer Vision · Reinforcement Learning', 960, 880, { align: 'center', w: 1300 });
  anim(nm('fields'), 'rise', 4000);
}
thread(s, 1300);

s = slide(null, '15 · From Egypt to Canada', { advance: 6000, transition: 'black', notes: 'Film 60–66 s. September 2025: the arc from Assiut to Kingston, Ontario.' });
img(s, 'world', 'world-dots.png', 0, 0, 1920, 1080);
img(s, 'shade', 'shade-corner.png', 0, 560, 1300, 520);
{
  const [ax, ay] = G.assiut9, [kx, ky] = G.kingston9, cx = (ax + kx) / 2, cy = (ay + ky) / 2 - 360;
  const arc = [...Array(49)].map((_, i) => { const t = i / 48; return [(1 - t) ** 2 * ax + 2 * (1 - t) * t * cx + t * t * kx, (1 - t) ** 2 * ay + 2 * (1 - t) * t * cy + t * t * ky]; });
  freeform(s, 'arc', arc, { width: 1.25 });
  dot(s, 'assiut', ax, ay, 5, { lw: 1 }); dot(s, 'kingston', kx, ky, 5, { lw: 1 });
  // the maple leaf, from the flag's construction, as one line
  const cmds = 'l45-863-111-98-859 151 116-320-20-73-941-762 212-99 34-79-186-572 542 115 73-38 105-247 423 454 111-57-204-1052 327 189 91-27 332-652 332 652 91 27 327-189-204 1052 111 57 423-454 105 247 73 38 542-115-186 572 34 79 212 99-941 762-20 73 116 320-859-151-111 98 45 863'
    .slice(1).match(/-?\d+/g).map(Number);
  let px = -90, py = 2030; const leaf = [[px, py]];
  for (let i = 0; i < cmds.length; i += 2) { px += cmds[i]; py += cmds[i + 1]; leaf.push([px, py]); }
  const ys = leaf.map(p => p[1]), xs = leaf.map(p => p[0]), lk = 90 / (Math.max(...ys) - Math.min(...ys));
  const lcx = (Math.max(...xs) + Math.min(...xs)) / 2, lby = Math.max(...ys);
  freeform(s, 'leaf', leaf.map(([x, y]) => [kx + (x - lcx) * lk, ky - 70 + (y - lby) * lk]), { close: true });
  kicker(s, 'kingstonLabel', 'Kingston, Ontario', kx + 26, ky + 18, { w: 600 });
  anim(nm('assiut'), 'zoom', 500, 500); anim(nm('arc'), 'wipeR', 750, 2250); anim(nm('kingston'), 'zoom', 2900, 500);
  anim(nm('leaf'), 'wipeB', 3000, 1500); anim(nm('kingstonLabel'), 'rise', 3400);
}
kicker(s, 'date', 'September 2025', 160, 840);
head(s, 'title', 'From Egypt to Canada.', 160, 880);
anim(nm('world'), 'fade', 0, 1500); anim(nm('date'), 'rise', 750); anim(nm('title'), 'rise', 1500);

s = slide(null, '16 · Queen’s University', { advance: 3000, transition: 'fade', notes: 'Film 66–69 s. MSc in Artificial Intelligence, Digilians Presidential Scholarship.' });
photo(s, 'snow', 'queens-snow.jpg', 840, 0, 1080, 1080, [1.0, .62, .45, 540, 540]);
img(s, 'edge', 'grad-edge.png', 840, 0, 220, 1080);
img(s, 'crest', 'queens-logo.png', 150, 290, 220, 220 * 243 / 320);
head(s, 'title', 'Queen’s University', 160, 500, { w: 800 });
lead(s, 'msc', 'MSc in Artificial Intelligence', 160, 590, { w: 800 });
kicker(s, 'scholarship', 'Digilians Presidential Scholarship', 160, 670, { w: 800 });
line(s, 'rule', 160, 710, 460, 710);
anim(nm('snow'), 'fade', 0, 750); anim(nm('snow'), 'grow', 0, 3000, { scale: 104 }); anim(nm('crest'), 'fade', 375, 1000);
anim(nm('title'), 'rise', 750); anim(nm('msc'), 'rise', 1500); anim(nm('scholarship'), 'rise', 2250); anim(nm('rule'), 'wipeL', 2250, 600);

s = slide(null, '17 · MinimalLM', { advance: 3000, transition: 'fade', notes: 'Film 69–72 s. His MSc research project, at the School of Computing.' });
photo(s, 'computing', 'computing.jpg', 960, 300, 840, 468, [1.0, .5, .5, 420, 234], { inset: true });
kicker(s, 'kicker', 'MSc research project · 2026', 160, 400);
head(s, 'title', 'MinimalLM', 160, 445, { size: 112, color: GOLDINK, w: 760 });
quote(s, 'question', 'Can a language model say less\nand lose nothing a reader needs?', 160, 600, { w: 780 });
marker(s, 'mark', 160 + M.sayless[0], 600, M.sayless[1], 48);
anim(nm('computing'), 'fade', 400, 900); anim(nm('kicker'), 'rise', 0); anim(nm('title'), 'letters', 750, 750);
anim(nm('question'), 'rise', 1500); anim(nm('mark'), 'wipeL', 2250);

s = slide(null, '18 · Say less', { advance: 3300, transition: 'fade', notes: 'Film 72–75.3 s. An illustrative answer stops early at a STOP gate; the redundant tail falls away. Not a reported result.' });
{
  const tokens = ['Kingston', 'is', 'in', 'Ontario', ',', 'Canada', '.', 'In', 'summary', ',', 'as', 'mentioned', ',', 'Kingston', 'is', 'located', 'in', 'Ontario', '.'];
  const widths = tokens.map(t => t.length * M.mono24 + 20), gap = 8;
  let x = (1920 - (widths.reduce((a, b) => a + b) + gap * (tokens.length - 1))) / 2;
  tokens.forEach((t, i) => {
    const tail = i >= 7;
    s.addText(t, { objectName: nm(`t${i}`), shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: I(3), x: I(x), y: I(530), w: I(widths[i]), h: I(52),
      fontFace: MONO, fontSize: 12, color: tail ? INK2 : INK, align: 'center', valign: 'middle', margin: 0, isTextBox: true,
      fill: { color: PAPER3 }, line: { color: tail ? INK : GOLD, width: .5, transparency: tail ? 88 : 40 } });
    anim(nm(`t${i}`), 'rise', i * 60, 300);
    if (tail) anim(nm(`t${i}`), 'dim', 1500 + (i - 7) * 40, 600);
    if (i === 6) {
      const gx = x + widths[i] + gap / 2;
      line(s, 'gate', gx, 496, gx, 616, { width: 1 });
      text(s, 'stop', 'STOP', { x: gx, y: 468, size: 20, font: MONO5, color: GOLDINK, align: 'center', w: 120, cs: 2 });
      anim(nm('gate'), 'wipeT', 600, 500); anim(nm('stop'), 'fade', 600, 500);
    }
    x += widths[i] + gap;
  });
  sec(s, 'method', 'Training-free. Measured for meaning, latency and energy.', 960, 680, { align: 'center', w: 1400 });
  sec(s, 'team', 'He led a four-student team.', 960, 732, { align: 'center', w: 1000, color: INK });
  anim(nm('method'), 'rise', 1600); anim(nm('team'), 'rise', 2000);
}

s = slide(null, '19 · Enable the future', { advance: 3500, transition: 'black', notes: 'Film 75.3–78 s. Antoine de Saint-Exupéry, Citadelle. The place of the photo is never named.' });
photo(s, 'vision', 'vision.jpg', 1180, 200, 560, 644, [1.0, .3, .45, 280, 322], { inset: true });
quote(s, 'quote', '“As for the future,\nyour task is not to foresee it,\nbut to enable it.”', 160, 380, { w: 900 });
marker(s, 'mark', 160 + M.enable[0], 380 + 2 * 53, M.enable[1], 48);
kicker(s, 'author', '— Antoine de Saint-Exupéry', 160, 590);
anim(nm('vision'), 'fade', 0, 900); anim(nm('quote'), 'rise', 150); anim(nm('author'), 'rise', 900); anim(nm('mark'), 'wipeL', 1300);

s = slide(null, '20 · He learns. He builds. He teaches.', { advance: 3000, transition: 'fade', notes: 'Film 78–81 s. In traditional dress under gold lights; the photo gives way to the portrait in the same place.' });
photo(s, 'heritage', 'heritage.jpg', 900, 0, 1020, 1080, [1.40, .47, .27, 500, 420]);
img(s, 'edge', 'grad-edge.png', 900, 0, 320, 1080);
head(s, 'learns', 'He learns.', 160, 370); head(s, 'builds', 'He builds.', 160, 460); head(s, 'teaches', 'He teaches.', 160, 550);
anim(nm('heritage'), 'fade', 200, 800); anim(nm('learns'), 'rise', 750); anim(nm('builds'), 'rise', 1500); anim(nm('teaches'), 'rise', 2250);

s = slide(null, '21 · A purpose', { advance: 3000, transition: 'fade', notes: 'Film 81–84 s. The portrait returns, exactly where it first appeared.' });
const p21 = portrait(s);
head(s, 'give', 'Let’s give intelligence', 160, 440);
head(s, 'purpose', 'a purpose.', 160, 520);
marker(s, 'mark', 160, 520, M.purpose[1], 72);
anim(p21, 'fade', 0, 2250); anim(nm('backglow'), 'fade', 750, 2250); anim(p21, 'grow', 0, 9000, { scale: 104 });
anim(nm('give'), 'rise', 0); anim(nm('purpose'), 'rise', 750); anim(nm('mark'), 'wipeL', 1500);

function endCard(s, withMascot, slow = 1) {
  img(s, 'signature', 'signature.png', 210, 301, 1500, 1500 * 827 / 2400, { transparency: 93 });
  portrait(s);
  img(s, 'emblem', 'emblem.png', 405, 174, 170, 170 * 942 / 1053);
  img(s, 'wordmark', 'wordmark.png', 190, 380, 600, wordmarkH(600));
  line(s, 'rule', 380, 545, 600, 545);
  text(s, 'url', 'mahmoudalyosifysite.github.io', { x: 490, y: 578, size: 28, font: MONO, color: GOLDINK, align: 'center', w: 760, cs: 1 });
  text(s, 'mail', 'mahmoud.alyosify@gmail.com', { x: 490, y: 636, size: 24, font: MONO, color: INK2, align: 'center', w: 760, cs: 1.5 });
  text(s, 'li', 'linkedin.com/in/mahmoudalyosify', { x: 490, y: 676, size: 24, font: MONO, color: INK2, align: 'center', w: 760, cs: 1.5 });
  const t = v => Math.round(v * slow);
  anim(nm('signature'), 'wipeL', 0, t(2250)); anim(nm('emblem'), 'zoom', 0, t(1500)); anim(nm('wordmark'), 'wipeL', t(750), t(1500));
  anim(nm('rule'), 'wipeL', t(750), t(1500)); anim(nm('url'), 'rise', t(1500)); anim(nm('mail'), 'rise', t(2250)); anim(nm('li'), 'rise', t(2400));
  if (withMascot) {
    img(s, 'mascot', 'mascot.png', 283, 810, 140 * 1024 / 1536, 140);
    text(s, 'ask', 'Ask Mahmoud AI on the site.', { x: 390, y: 866, size: 26, italic: true, color: INK3, w: 600 });
    anim(nm('mascot'), 'rise', 3000, 1000); anim(nm('ask'), 'rise', 3200);
  }
}
s = slide(null, '22 · Mahmoud Alyosify', { advance: 6000, transition: 'fade', notes: 'Film 84–90 s. The end card; the signature writes itself behind him.' });
endCard(s, true);

// ════════════════════════════ WEBSITE CUT · 30 s ════════════════════════════
section('Website cut · 30 seconds');

s = slide(null, 'W1 · The Mark', { advance: 6000, transition: 'fade', notes: 'Website cut 0–6 s (also the scroll prologue on the site).' });
line(s, 'hair', 750, 760, 1170, 760, { transparency: 20 });
img(s, 'emblem', 'emblem.png', 750, 332, 420, 376);
anim(nm('hair'), 'wipeL', 1500, 1500); anim(nm('emblem'), 'zoom', 3000, 2250);

s = slide(null, 'W2 · Mahmoud Alyosify', { advance: 6000, transition: 'black', notes: 'Website cut 6–12 s.' });
const pw = portrait(s);
img(s, 'wordmark', 'wordmark.png', 160, 400, 660, wordmarkH(660));
kicker(s, 'roles', 'AI Engineer · Researcher · Educator', 160, 598);
line(s, 'rule', 160, 640, 400, 640);
text(s, 'alias', 'also known as Mahmoud Sayed Youssef', { x: 160, y: 660, size: 30, italic: true, color: INK3, w: 900 });
anim(pw, 'fade', 0, 2250); anim(nm('backglow'), 'fade', 750, 2250); anim(pw, 'grow', 0, 6000, { scale: 103 });
anim(nm('wordmark'), 'wipeL', 750, 1500); anim(nm('roles'), 'rise', 2250); anim(nm('rule'), 'wipeL', 3000); anim(nm('alias'), 'rise', 3000);

s = slide(null, 'W3 · He learns. He builds. He teaches.', { advance: 6000, transition: 'black', notes: 'Website cut 12–18 s. Centred on black, slower than in the film.' });
head(s, 'learns', 'He learns.', 960, 400, { align: 'center', w: 900 });
head(s, 'builds', 'He builds.', 960, 490, { align: 'center', w: 900 });
head(s, 'teaches', 'He teaches.', 960, 580, { align: 'center', w: 900 });
anim(nm('learns'), 'rise', 1500, 1500); anim(nm('builds'), 'rise', 3000, 1500); anim(nm('teaches'), 'rise', 4500, 1500);

s = slide(null, 'W4 · A purpose', { advance: 3000, transition: 'black', notes: 'Website cut 18–21 s.' });
const pw4 = portrait(s);
head(s, 'give', 'Let’s give intelligence', 160, 440);
head(s, 'purpose', 'a purpose.', 160, 520);
marker(s, 'mark', 160, 520, M.purpose[1], 72);
anim(pw4, 'fade', 0, 2250); anim(nm('backglow'), 'fade', 750, 2250); anim(pw4, 'grow', 0, 9000, { scale: 104 });
anim(nm('give'), 'rise', 0); anim(nm('purpose'), 'rise', 750); anim(nm('mark'), 'wipeL', 1500);

s = slide(null, 'W5 · Mahmoud Alyosify', { advance: 8000, transition: 'fade', notes: 'Website cut 21–30 s. The end card, slower, without the mascot line.' });
endCard(s, false, 1.41);

(async () => {
  const out = path.join(__dirname, 'Mahmoud-Alyosify-Introduction.pptx');
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  fs.writeFileSync(path.join(__dirname, 'build-meta.json'), JSON.stringify({ crops, slides: decks }, null, 1));
  console.log('wrote', out, decks.length, 'slides');
})();
