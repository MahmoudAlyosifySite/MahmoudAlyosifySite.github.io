// Deterministic timeline. Every CSS animation in the page is authored against t = 0 (page load)
// and frozen; seek(t) moves all of them, plus any JS frame hooks (canvas, counters), to time t.
// Open film.html?play to watch it in real time with the score.
(() => {
  const hooks = [];
  window.onFrame = fn => hooks.push(fn);

  window.seek = t => {
    for (const a of document.getAnimations()) { a.pause(); a.currentTime = t * 1000; }
    for (const fn of hooks) fn(t);
  };

  // small helpers shared by scenes
  window.clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  window.ease = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  window.span = (t, a, b) => clamp((t - a) / (b - a));
  window.rng = seed => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  const imgs = () => Promise.all([...document.images].map(i => i.decode().catch(() => console.error('img failed: ' + i.src))));
  window.filmReady = new Promise(r => addEventListener('load', r))
    .then(() => Promise.all(['72px Gloock', '44px "Ysabeau Office"', 'italic 500 48px "Ysabeau Office"', '22px "Chivo Mono"', '500 22px "Chivo Mono"'].map(f => document.fonts.load(f))))
    .then(() => Promise.all([document.fonts.ready, imgs()]))
    .then(() => { seek(0); return true; });

  if (location.search.includes('play')) {
    filmReady.then(() => {
      const audio = new Audio('../music/score.m4a');
      const go = () => {
        removeEventListener('click', go);
        const start = performance.now(); audio.play().catch(() => {});
        const tick = () => { const t = (performance.now() - start) / 1000; seek(Math.min(t, 90)); if (t < 90) requestAnimationFrame(tick); };
        tick();
      };
      addEventListener('click', go);
    });
  }
})();
