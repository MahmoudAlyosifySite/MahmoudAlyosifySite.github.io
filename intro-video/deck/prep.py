# Prepare the deck's images from the film's assets (intro-video/film/assets).
# Photos are graded like the film but left uncropped, so the crop stays editable in PowerPoint.
#   py -3.13 prep.py
import json, math, os, re
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
FILM = os.path.join(HERE, '..', 'film', 'assets')
OUT = os.path.join(HERE, 'assets')
os.makedirs(OUT, exist_ok=True)
GOLD = (201, 165, 94)
W, H = 1920, 1080


def grade(im, sat=.82, con=1.04, bri=.92, sepia=.06):
    im = ImageEnhance.Color(im).enhance(sat)
    im = ImageEnhance.Contrast(im).enhance(con)
    im = ImageEnhance.Brightness(im).enhance(bri)
    if sepia:
        g = im.convert('L')
        sep = Image.merge('RGB', [g.point(lambda v: min(255, v * 1.07)), g.point(lambda v: v * .95), g.point(lambda v: v * .82)])
        im = Image.blend(im, sep, sepia)
    return im


# ── photos: name -> (source, grade kwargs) ──
VINTAGE = dict(sat=.5, con=1.02, bri=.9, sepia=.3)
BLUE = dict(sat=.72)
photos = {
    'toddler': VINTAGE, 'childhood': VINTAGE, 'horse': {}, 'fci': {}, 'student': {}, 'youth': {}, 'luxor': {},
    'union': {}, 'hackathon': {}, 'ideal': BLUE, 'vitalism': {}, 'graduation': {}, 'officers': dict(bri=.86),
    'service': dict(bri=.81), 'teach': dict(bri=.82), 'microsoft': {}, 'nti': BLUE, 'lab': dict(sat=.8, bri=.8),
    'queens-snow': BLUE, 'computing': dict(sat=.8, bri=.9, sepia=.05), 'vision': {}, 'heritage': {},
}
dims = {}
for name, kw in photos.items():
    im = Image.open(os.path.join(FILM, name + '.jpg')).convert('RGB')
    im.thumbnail((2000, 2000), Image.LANCZOS)
    grade(im, **kw).save(os.path.join(OUT, name + '.jpg'), quality=86, optimize=True)
    dims[name] = im.size

# ── logos and marks, real colours, as PNG ──
for name, src in {'emblem': 'emblem.png', 'mascot': 'mascot.png', 'assiut': 'assiut.webp', 'queens-logo': 'queens-logo.webp',
                  'einstein-misr': 'einstein-misr.png'}.items():
    im = Image.open(os.path.join(FILM, src)).convert('RGBA')
    if name == 'mascot':
        im.thumbnail((800, 800), Image.LANCZOS)
    im.save(os.path.join(OUT, name + '.png'))
    dims[name] = im.size

# ── the hero portrait with its gold rim light and bottom melt baked in (storyboard §1.8) ──
P = 1400
por = Image.open(os.path.join(FILM, 'portrait.png')).convert('RGBA').resize((P, P), Image.LANCZOS)
a = por.split()[3]
melt = Image.linear_gradient('L').resize((P, P))                      # 0 at top -> 255 at bottom
melt = melt.point(lambda v: 255 if v < 199 else int(255 * (1 - (v - 199) / 56)))
pad = 200
canvas = Image.new('RGBA', (P + 2 * pad, P + 2 * pad), (0, 0, 0, 0))
A = Image.new('L', canvas.size, 0); A.paste(a, (pad, pad))
def glow(radius, alpha, colour=GOLD):
    m = A.filter(ImageFilter.GaussianBlur(radius)).point(lambda v: int(v * alpha))
    layer = Image.new('RGBA', canvas.size, colour + (0,)); layer.putalpha(m); return layer
for r, al in ((98, .10 * 1.4), (31, .22 * 1.4), (2, .7)):
    canvas = Image.alpha_composite(canvas, glow(r, al))
lit = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); lit.paste(por, (pad, pad)); canvas = Image.alpha_composite(canvas, lit)
M = Image.new('L', canvas.size, 255); M.paste(melt, (pad, pad)); M.paste(Image.new('L', (canvas.size[0], pad), 0), (0, P + pad))
canvas.putalpha(ImageChops.multiply(canvas.split()[3], M))
canvas.save(os.path.join(OUT, 'portrait-rim.png'))
dims['portrait-rim'] = canvas.size

# ── soft gold air behind the portrait ──
g = Image.new('RGBA', (1120, 1120), (0, 0, 0, 0)); px = g.load()
for y in range(1120):
    for x in range(1120):
        d = math.hypot(x - 560, y - 459) / 560
        if d < 1: px[x, y] = GOLD + (int(255 * .20 * (1 - d) ** 1.6),)
g.save(os.path.join(OUT, 'backglow.png'))

# ── background: near-black with the film's vignette ──
bg = Image.new('RGB', (W, H), (11, 11, 12)); v = Image.new('L', (W, H), 0); vp = v.load()
for y in range(0, H):
    for x in range(0, W):
        d = math.hypot((x - W / 2) / (W / 2), (y - H / 2) / (H / 2)) / math.sqrt(2) * 1.41
        vp[x, y] = int(255 * .55 * min(1, max(0, (d - .58) / .42)))
Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, v).save(os.path.join(OUT, 'bg.png'))

# ── gradients that keep text off busy photos ──
def hgrad(w, h, stops, name):
    im = Image.new('RGBA', (w, h)); p = im.load()
    for x in range(w):
        t = x / (w - 1); al = stops[-1][1]
        for (t0, a0), (t1, a1) in zip(stops, stops[1:]):
            if t0 <= t <= t1: al = a0 + (a1 - a0) * (t - t0) / (t1 - t0); break
        for y in range(h): p[x, y] = (11, 11, 12, int(255 * al))
    im.save(os.path.join(OUT, name))
hgrad(1920, 8, [(0, .95), (.26, .82), (.44, .45), (.62, 0), (1, 0)], 'grad-left.png')
hgrad(300, 8, [(0, 1), (.5, .6), (1, 0)], 'grad-edge.png')
vg = Image.new('RGBA', (8, 220)); p = vg.load()
for y in range(220):
    for x in range(8): p[x, y] = (11, 11, 12, int(255 * .9 * y / 219))
vg.save(os.path.join(OUT, 'grad-bottom.png'))

# ── a soft dark corner under the map text (scene 9) ──
import numpy as np
yy, xx = np.mgrid[0:520, 0:1300]
d = np.sqrt((xx / 1300) ** 2 + ((519 - yy) / 520) ** 2)
al = np.clip((1 - d) / .55, 0, 1) ** 1.3 * .95
Image.fromarray(np.dstack([np.full_like(al, 11), np.full_like(al, 11), np.full_like(al, 12), al * 255]).astype('uint8'), 'RGBA').save(os.path.join(OUT, 'shade-corner.png'))

# ── the site's marker stroke (theme.css --marker) ──
mk = Image.new('RGBA', (800, 80), (0, 0, 0, 0)); d = ImageDraw.Draw(mk)
pts = [(9, 11), (70, 9.6), (140, 9), (210, 7.6), (330, 5), (397, 3.2), (391, 29.6), (320, 30.4), (250, 31.6), (180, 32.8), (60, 35.4), (2.6, 36.2)]
d.polygon([(x * 2, y * 2) for x, y in pts], fill=GOLD + (int(255 * .42),))
mk.save(os.path.join(OUT, 'marker.png'))

# ── the dotted North Atlantic (scene 9), gold at the film's opacity ──
geo = json.loads(re.sub(r'^window\.GEO=|;\s*$', '', open(os.path.join(FILM, 'geo.js'), encoding='utf-8').read()))
dots = Image.new('RGBA', (W * 2, H * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(dots)
for i in range(0, len(geo['dots']), 2):
    x, y = geo['dots'][i] * 2, geo['dots'][i + 1] * 2
    d.ellipse((x - 2.6, y - 2.6, x + 2.6, y + 2.6), fill=GOLD + (int(255 * .36),))
dots.save(os.path.join(OUT, 'world-dots.png'))

json.dump({'dims': dims, 'geo': {k: geo[k] for k in geo if k != 'dots'}}, open(os.path.join(OUT, 'meta.json'), 'w'), indent=1)
print('assets ->', OUT, len(os.listdir(OUT)), 'files')
