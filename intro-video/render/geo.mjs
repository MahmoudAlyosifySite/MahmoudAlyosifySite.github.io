// Precompute map geometry for scenes 2 and 9 into film/assets/geo.js
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';
const req = p => JSON.parse(readFileSync(new URL('./node_modules/' + p, import.meta.url)));
const c50 = req('world-atlas/countries-50m.json'), land = feature(req('world-atlas/land-50m.json'), 'land');
const egypt = feature(c50, c50.objects.countries).features.find(f => f.properties.name === 'Egypt');

// Scene 2: Egypt, equirectangular, k px/deg, centred at (1350, 520)
const k2 = 56, c2 = [30.8, 26.85], P2 = ([lon, lat]) => [+(1350 + (lon - c2[0]) * k2).toFixed(1), +(520 - (lat - c2[1]) * k2).toFixed(1)];
const rings = (egypt.geometry.type === 'Polygon' ? [egypt.geometry.coordinates] : egypt.geometry.coordinates).map(p => p[0]);
const ring = rings.sort((a, b) => b.length - a.length)[0];
const pts = []; let last = null;
for (const q of ring) { const p = P2(q); if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > 3) { pts.push(p); last = p; } }
const egyptPath = 'M' + pts.map(p => p.join(' ')).join('L') + 'Z';
// the Nile, south -> north, then the two Delta branches
const nile = [[31.3, 22.0], [31.7, 22.7], [32.6, 23.2], [32.9, 24.1], [32.87, 24.6], [32.6, 25.3], [32.64, 25.7], [32.72, 26.16], [32.3, 26.2], [31.7, 26.55], [31.5, 26.9], [31.18, 27.18], [30.85, 27.7], [30.75, 28.1], [30.95, 28.6], [31.1, 29.07], [31.25, 29.6], [31.24, 30.04], [31.15, 30.2]];
const rosetta = [[31.15, 30.2], [30.9, 30.6], [30.6, 31.0], [30.37, 31.46]];
const damietta = [[31.15, 30.2], [31.3, 30.6], [31.55, 31.1], [31.84, 31.52]];
const line = a => 'M' + a.map(P2).map(p => p.join(' ')).join('L');

// Scene 9: dotted land, k px/deg, centred on (-22.6E, 36N) at (960, 540), 14 px grid
const k9 = 11, c9 = [-22.6, 36], P9 = ([lon, lat]) => [960 + (lon - c9[0]) * k9, 540 - (lat - c9[1]) * k9];
const dots = [];
for (let y = 7; y < 1080; y += 14) for (let x = 7; x < 1920; x += 14) {
  const lon = c9[0] + (x - 960) / k9, lat = c9[1] - (y - 540) / k9;
  if (geoContains(land, [lon, lat])) dots.push(x, y);
}
const geo = {
  egyptPath, nilePath: line(nile), rosettaPath: line(rosetta), damiettaPath: line(damietta),
  assiut2: P2([31.18, 27.18]), cairo2: P2([31.24, 30.04]),
  dots, assiut9: P9([31.18, 27.18]), kingston9: P9([-76.49, 44.23]),
};
writeFileSync(new URL('../film/assets/geo.js', import.meta.url), 'window.GEO=' + JSON.stringify(geo) + ';\n');
console.log('egypt pts', pts.length, 'dots', dots.length / 2, 'assiut2', geo.assiut2, 'assiut9', geo.assiut9, 'kingston9', geo.kingston9);
