// Frame-accurate capture of film.html: seek(t) for every frame, pipe PNGs into ffmpeg.
//   node render.mjs --out ../out/film_silent.mp4            full film, 30 fps
//   node render.mjs --from 36 --to 48 --fps 10 --out x.mp4  quick preview of a range
//   node render.mjs --stills 2,7.5,14 --dir ../out/stills   single PNG frames
//   node render.mjs --query short --to 30 --out ../out/short_silent.mp4   the 30-s website cut
import { chromium } from 'playwright-core';
import { spawn, execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFile } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const fps = +arg('fps', 30), from = +arg('from', 0), to = +arg('to', 90);
const W = 1920, H = 1080;
const CHROME = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const FFMPEG = execSync('py -3.13 -c "import imageio_ffmpeg as f;print(f.get_ffmpeg_exe())"').toString().trim();

// serve intro-video/ over http: CSS masks refuse file:// URLs
const root = resolve(here, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.m4a': 'audio/mp4', '.wav': 'audio/wav' };
const server = createServer((req, res) => {
  const f = resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(root)) { res.writeHead(403).end(); return; }
  readFile(f, (err, buf) => err ? res.writeHead(404).end() : res.writeHead(200, { 'Content-Type': types[extname(f).toLowerCase()] || 'application/octet-stream' }).end(buf));
}).listen(+arg('port', 0), '127.0.0.1');
await new Promise(r => server.once('listening', r));
const base = `http://127.0.0.1:${server.address().port}`;
if (process.argv.includes('--serve')) { console.log(`${base}/film/film.html?play`); await new Promise(() => {}); }

const browser = await chromium.launch({ executablePath: CHROME, args: ['--force-color-profile=srgb', '--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on('console', m => m.type() === 'error' && console.error('[page]', m.text()));
page.on('pageerror', e => console.error('[page]', e.message));
await page.goto(`${base}/film/film.html${arg('query') ? '?' + arg('query') : ''}`, { waitUntil: 'load' });
await page.evaluate(() => window.filmReady);
const cdp = await page.context().newCDPSession(page);
const grab = async t => {
  await page.evaluate(t => window.seek(t), t);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true });
  return Buffer.from(data, 'base64');
};

const stills = arg('stills');
if (stills) {
  const dir = resolve(arg('dir', resolve(here, '../out/stills')));
  mkdirSync(dir, { recursive: true });
  for (const s of stills.split(',')) writeFileSync(resolve(dir, `t${(+s).toFixed(2).padStart(6, '0')}.png`), await grab(+s));
  console.log('stills ->', dir);
} else {
  const out = resolve(arg('out', resolve(here, '../out/film_silent.mp4')));
  mkdirSync(dirname(out), { recursive: true });
  const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', fps >= 30 ? 'slow' : 'veryfast', '-crf', fps >= 30 ? '14' : '22',
    '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((to - from) * fps), t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const png = await grab(from + i / fps);
    if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % (fps * 5) === 0) console.log(`frame ${i}/${n}  t=${(from + i / fps).toFixed(1)}s  ${((Date.now() - t0) / 1000).toFixed(0)}s elapsed`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('video ->', out);
}
await browser.close();
server.close();
