// Rasterise the wordmark and the signature (SVG) to transparent PNGs for PowerPoint.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(new URL('../render/package.json', import.meta.url));
const { chromium } = require('playwright-core');
const CHROME = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const b = await chromium.launch({ executablePath: CHROME });
const p = await b.newPage({ deviceScaleFactor: 1 });
for (const [src, out, w, extra] of [['../film/assets/wordmark.svg', 'assets/wordmark.png', 2000, ''],
                                    ['../film/assets/signature.svg', 'assets/signature.png', 2400, '']]) {
  const svg = readFileSync(new URL(src, import.meta.url), 'utf8');
  await p.setContent(`<html><body style="margin:0;background:transparent"><img id=i style="width:${w}px;display:block" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"></body></html>`);
  await p.waitForFunction(() => document.getElementById('i').complete);
  await (await p.$('#i')).screenshot({ path: out, omitBackground: true });
  console.log(out);
}
await b.close();
