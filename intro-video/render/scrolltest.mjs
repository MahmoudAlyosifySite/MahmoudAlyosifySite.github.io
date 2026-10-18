// Screenshot the site's scroll prologue at several scroll positions and viewport sizes.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const CHROME = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const url = process.argv[2] || 'http://127.0.0.1:8765/';
const outDir = process.argv[3] || '../out/scroll';
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME });
for (const [name, w, h, mobile] of [['laptop', 1491, 660, false], ['phone', 390, 844, true]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
  page.on('pageerror', e => console.error('[page]', e.message));
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(5500);
  await page.screenshot({ path: `${outDir}/${name}-0start.png` });
  for (const p of [0.12, 0.3, 0.42, 0.56, 0.7, 0.8, 0.9, 1.0]) {
    await page.evaluate(p => { const r = document.getElementById('prologue'); scrollTo({ top: r.offsetTop + p * (r.offsetHeight - innerHeight), behavior: 'instant' }); }, p);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${outDir}/${name}-p${String(Math.round(p * 100)).padStart(3, '0')}.png` });
  }
  await page.evaluate(() => scrollTo({ top: document.getElementById('prologue').offsetHeight + innerHeight * .3, behavior: 'instant' }));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${outDir}/${name}-zsite.png` });
  await page.close();
}
await browser.close();
