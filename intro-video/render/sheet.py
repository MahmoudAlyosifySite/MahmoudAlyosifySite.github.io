# tile review stills into 2x3 sheets: py -3.13 sheet.py <stills dir> <out prefix>
import sys, glob, os
from PIL import Image, ImageDraw
fs = sorted(glob.glob(os.path.join(sys.argv[1], 't*.png')))
for k in range(0, len(fs), 6):
    sheet = Image.new('RGB', (1920, 1620), (40, 40, 40)); d = ImageDraw.Draw(sheet)
    for i, f in enumerate(fs[k:k + 6]):
        im = Image.open(f).convert('RGB').resize((956, 538), Image.LANCZOS)
        x, y = (i % 2) * 962, (i // 2) * 542; sheet.paste(im, (x, y)); d.text((x + 6, y + 4), os.path.basename(f), fill=(255, 0, 0))
    sheet.save(f'{sys.argv[2]}{k // 6}.jpg', quality=88)
