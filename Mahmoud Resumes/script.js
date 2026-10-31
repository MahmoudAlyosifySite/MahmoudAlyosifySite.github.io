/* ============================================================
   Mahmoud Alyosify — Choose Your CV
   Shows every CV as a picture of its first page, filters them,
   and swaps between the shelves and one CV. Each CV has its own
   address (/cv/#<role>), so it can be sent on its own, and the
   browser's Back button returns to the shelves.
   ============================================================ */

(() => {
  'use strict';

  const ROLES = [
    { id: 'llm-genai',      group: 'engineering', file: '01-llm-generative-ai-engineer.pdf',                 title: 'LLM & Generative AI Engineer',            audience: 'Teams building with large language models, RAG, fine-tuning, or decoding-time inference.' },
    { id: 'ml-engineer',    group: 'engineering', file: '02-machine-learning-engineer.pdf',                   title: 'Machine Learning Engineer',               audience: 'Classic ML and production model roles — pipelines, training, evaluation, deployment.' },
    { id: 'computer-vision',group: 'engineering', file: '03-computer-vision-engineer.pdf',                    title: 'Computer Vision Engineer',                audience: 'Image and video pipelines — detection, segmentation, self-supervised vision.' },
    { id: 'rl-engineer',    group: 'engineering', file: '04-reinforcement-learning-engineer.pdf',             title: 'Reinforcement Learning Engineer',         audience: 'RL research and engineering — agents, environments, policy optimisation.' },
    { id: 'ai-research',    group: 'engineering', file: '05-ai-research-engineer.pdf',                        title: 'AI Research Engineer',                    audience: 'Research-leaning roles — experiment design, evaluation, applied or published research.' },
    { id: 'edge-ai',        group: 'engineering', file: '06-edge-and-efficient-ai-engineer.pdf',              title: 'Edge & Efficient AI Engineer',            audience: 'On-device inference, model compression, latency- and cost-efficient AI.' },
    { id: 'agent-systems',  group: 'engineering', file: '07-ai-agent-systems-engineer.pdf',                   title: 'AI Agent Systems Engineer',               audience: 'Multi-agent architectures, tool use, autonomous and agentic workflows.' },
    { id: 'nlp-engineer',   group: 'engineering', file: '08-nlp-engineer.pdf',                                title: 'NLP Engineer',                            audience: 'Text understanding, information extraction, and language pipelines.' },
    { id: 'data-scientist', group: 'engineering', file: '09-data-scientist.pdf',                              title: 'Data Scientist',                          audience: 'Analysis, modelling, and insight-driven decision support.' },
    { id: 'ai-security',    group: 'engineering', file: '10-ai-security-and-threat-intelligence-engineer.pdf',title: 'AI Security & Threat Intelligence Engineer', audience: 'AI-driven security tooling, threat intelligence, OSINT platforms.' },
    { id: 'mlops-cloud',    group: 'engineering', file: '11-mlops-and-cloud-ai-engineer.pdf',                 title: 'MLOps & Cloud AI Engineer',               audience: 'Cloud infrastructure, CI/CD, and model serving at scale on AWS.' },
    { id: 'software-eng',   group: 'engineering', file: '12-software-engineer.pdf',                           title: 'Software Engineer',                       audience: 'General software engineering roles — systems, backend, full-stack.' },
    { id: 'ai-instructor',  group: 'engineering', file: '13-ai-instructor-and-technical-trainer.pdf',         title: 'AI Instructor & Technical Trainer',       audience: 'Teaching, curriculum design, and technical training roles.' },
    { id: 'academic-cv',    group: 'special',     file: '14-academic-cv-phd-scholarship.pdf',                 title: 'Academic CV — PhD & Scholarship',         audience: 'PhD applications, scholarships, and academic admissions committees.' },
    { id: 'volunteering',   group: 'special',     file: '15-volunteering-fellowships-and-exchange-programmes.pdf', title: 'Volunteering, Fellowships & Exchange Programmes', audience: 'Fellowship, exchange, and volunteering-programme applications.' }
  ];

  const GENERAL = {
    id: 'general', title: 'General CV',
    audience: "Not sure which role fits? Referrals, networking & LinkedIn intros with no role attached.",
    file: 'general-cv.pdf'
  };

  const ALL = [GENERAL, ...ROLES];
  const PDF_DIR = 'assets/pdfs/';
  const PREVIEW_DIR = 'assets/previews/';
  const PREVIEWS = window.CV_PREVIEWS || {};
  // Absolute: the page's <base> points every relative address at "Mahmoud Resumes/".
  const PAGE = '/cv/';
  const SITE_TITLE = document.title;

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // A phone (or any touch screen) cannot show a PDF inside a page — it gets the pages as pictures.
  const asPictures = () => window.matchMedia('(max-width: 820px), (hover: none) and (pointer: coarse)').matches;

  const ICON = {
    eye: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ── Pictures of a CV, addressed by a hash of its PDF ──────── */
  function preview(role) {
    const p = PREVIEWS[role.file];
    if (!p) return null;
    const name = role.file.replace(/\.pdf$/i, '');
    const v = `?v=${p.v}`;
    return {
      thumb: `${PREVIEW_DIR}${name}-thumb.webp${v}`,
      pages: Array.from({ length: p.pages }, (_, i) => `${PREVIEW_DIR}${name}-p${i + 1}.png${v}`)
    };
  }

  function paperImg(role, sizes, eager = false) {
    const pv = preview(role);
    if (!pv) return '<span class="paper__blank" aria-hidden="true">CV</span>';
    return `<img src="${pv.thumb}" srcset="${pv.thumb} 480w, ${pv.pages[0]} 1400w" sizes="${sizes}"
      width="480" height="679" alt="" decoding="async"${eager ? '' : ' loading="lazy"'}>`;
  }

  const href = (role) => `${PAGE}#${role.id}`;
  const dlLink = (role, cls, inner) =>
    `<a class="${cls}" href="${PDF_DIR}${role.file}" download="${role.file}"
      aria-label="Download the ${esc(role.title)} as a PDF" title="Download PDF">${inner}</a>`;

  /* ── The shelves ──────────────────────────────────────────── */
  function cardHTML(role, i) {
    return `
      <article class="cv-card reveal" style="--d:${i}" data-role="${role.id}">
        <a class="cv-card__open" href="${href(role)}" data-open="${role.id}">
          <span class="paper">
            ${paperImg(role, '(max-width: 560px) 44vw, 220px')}
            <span class="paper__view">${ICON.eye}View CV</span>
          </span>
          <span class="cv-card__title">${esc(role.title)}</span>
        </a>
        ${dlLink(role, 'cv-card__dl', ICON.download)}
      </article>`;
  }

  function featureHTML(role) {
    return `
      <article class="cv-feature reveal" style="--d:3" data-role="${role.id}">
        <a class="cv-feature__paper" href="${href(role)}" data-open="${role.id}" tabindex="-1" aria-hidden="true">
          <span class="paper paper--stack">
            ${paperImg(role, '(max-width: 560px) 34vw, 210px', true)}
            <span class="paper__view">${ICON.eye}View CV</span>
          </span>
        </a>
        <div class="cv-feature__body">
          <p class="cv-feature__kicker">Start here</p>
          <h2 class="cv-feature__title">${esc(role.title)}</h2>
          <p class="cv-feature__text">${esc(role.audience)}</p>
          <div class="cv-feature__actions">
            <a class="btn btn-primary" href="${href(role)}" data-open="${role.id}">${ICON.eye}View CV</a>
            ${dlLink(role, 'btn btn-ghost', `${ICON.download}Download`)}
          </div>
        </div>
      </article>`;
  }

  function render() {
    $('#feature').innerHTML = featureHTML(GENERAL);
    for (const group of ['engineering', 'special']) {
      const roles = ROLES.filter((r) => r.group === group);
      $(`#grid-${group}`).innerHTML = roles.map((r, i) => cardHTML(r, i + 4)).join('');
      $(`#count-${group}`).textContent = roles.length;
    }
  }

  function findRole(id) {
    return ALL.find((r) => r.id === id) || null;
  }

  /* ── Filter ───────────────────────────────────────────────── */
  function initFilter() {
    const input = $('#role-filter');
    const noResults = $('#no-results');

    input.addEventListener('input', () => {
      const term = input.value.trim().toLowerCase();
      const matches = (role) => !term || `${role.title} ${role.audience}`.toLowerCase().includes(term);
      let any = false;

      const feature = $('.cv-feature');
      feature.hidden = !matches(GENERAL);
      if (!feature.hidden) any = true;

      $$('.role-group').forEach((group) => {
        let shown = 0;
        $$('.cv-card', group).forEach((card) => {
          const ok = matches(findRole(card.dataset.role));
          card.hidden = !ok;
          if (ok) shown++;
        });
        group.hidden = shown === 0;
        if (shown) any = true;
      });

      noResults.hidden = any;
      $('#no-results-term').textContent = input.value.trim();
    });
  }

  /* ── One CV ───────────────────────────────────────────────── */
  let listScroll = 0;

  function showCv(role) {
    const pdf = PDF_DIR + role.file;
    $('#cv-title').textContent = role.title;
    $('#cv-audience').textContent = role.audience;
    $('#cv-download').href = pdf;
    $('#cv-download').setAttribute('download', role.file);
    $('#cv-newtab').href = pdf;
    $('#pdf-chrome-name').textContent = role.file;
    $('#pdf-fallback-link').href = pdf;
    document.title = `${role.title} — Mahmoud Alyosify CV`;

    const pv = preview(role);
    const pictures = Boolean(pv) && asPictures();
    $('#pdf-wrap').hidden = pictures;
    $('#cv-pages').hidden = !pictures;
    if (pictures) {
      $('#pdf-frame').src = 'about:blank';
      $('#cv-pages').innerHTML = pv.pages.map((src, i) =>
        `<img class="cv-page" src="${src}" width="1400" height="1980" alt="${esc(role.title)} — page ${i + 1} of ${pv.pages.length}"
          decoding="async"${i ? ' loading="lazy"' : ''}>`).join('')
        + `<div class="cv-end">${dlLink(role, 'btn btn-primary', `${ICON.download}Download PDF`)}</div>`;
    } else {
      $('#cv-pages').innerHTML = '';
      $('#pdf-frame').src = pdf;
    }

    // The other CVs, small, to move between them without going back.
    $('#cv-more').innerHTML = ALL.filter((r) => r.id !== role.id).map((r) => `
      <a class="cv-mini" href="${href(r)}" data-open="${r.id}">
        <span class="paper">${paperImg(r, '96px')}</span>
        <span class="cv-mini__title">${esc(r.title)}</span>
      </a>`).join('');
    $('#cv-more').scrollLeft = 0;
  }

  function route({ focus = false } = {}) {
    const role = findRole(decodeURIComponent(location.hash.slice(1)));
    const wasList = !$('#role-select').hidden;
    if (role) {
      if (wasList) listScroll = window.scrollY;
      showCv(role);
      $('#role-select').hidden = true;
      $('#cv-view').hidden = false;
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (focus) $('#cv-title').focus({ preventScroll: true });
    } else {
      $('#cv-view').hidden = true;
      $('#role-select').hidden = false;
      $('#pdf-frame').src = 'about:blank';
      document.title = SITE_TITLE;
      if (!wasList) window.scrollTo({ top: listScroll, behavior: 'instant' });
    }
  }

  function go(url) {
    history.pushState(null, '', url);
    route({ focus: true });
  }

  function initNavigation() {
    document.addEventListener('click', (e) => {
      // A new tab, a new window or a download stays the browser's business.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest('[data-open]');
      if (link) { e.preventDefault(); go(href({ id: link.dataset.open })); return; }
      if (e.target.closest('#back-btn')) { e.preventDefault(); go(PAGE); }
    });
    window.addEventListener('popstate', () => route());
  }

  /* ── Boot ─────────────────────────────────────────────────── */
  function boot() {
    $('#year').textContent = new Date().getFullYear();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    render();
    initFilter();
    initNavigation();
    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
