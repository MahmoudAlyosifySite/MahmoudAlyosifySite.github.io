/* ============================================================
   Mahmoud Alyosify — Choose Your CV
   Renders role cards from ROLES, filters them, and swaps between
   the role-select view and the PDF preview view.
   ============================================================ */

(() => {
  'use strict';

  const ROLES = [
    { id: 'llm-genai',      group: 'engineering', file: '01-llm-generative-ai-engineer.pdf',                 icon: '🤖', title: 'LLM & Generative AI Engineer',            audience: 'Teams building with large language models, RAG, fine-tuning, or decoding-time inference.' },
    { id: 'ml-engineer',    group: 'engineering', file: '02-machine-learning-engineer.pdf',                   icon: '🧮', title: 'Machine Learning Engineer',               audience: 'Classic ML and production model roles — pipelines, training, evaluation, deployment.' },
    { id: 'computer-vision',group: 'engineering', file: '03-computer-vision-engineer.pdf',                    icon: '👁️', title: 'Computer Vision Engineer',                audience: 'Image and video pipelines — detection, segmentation, self-supervised vision.' },
    { id: 'rl-engineer',    group: 'engineering', file: '04-reinforcement-learning-engineer.pdf',             icon: '🎮', title: 'Reinforcement Learning Engineer',         audience: 'RL research and engineering — agents, environments, policy optimisation.' },
    { id: 'ai-research',    group: 'engineering', file: '05-ai-research-engineer.pdf',                        icon: '🔬', title: 'AI Research Engineer',                    audience: 'Research-leaning roles — experiment design, evaluation, applied or published research.' },
    { id: 'edge-ai',        group: 'engineering', file: '06-edge-and-efficient-ai-engineer.pdf',              icon: '⚡', title: 'Edge & Efficient AI Engineer',            audience: 'On-device inference, model compression, latency- and cost-efficient AI.' },
    { id: 'agent-systems',  group: 'engineering', file: '07-ai-agent-systems-engineer.pdf',                   icon: '🕸️', title: 'AI Agent Systems Engineer',               audience: 'Multi-agent architectures, tool use, autonomous and agentic workflows.' },
    { id: 'nlp-engineer',   group: 'engineering', file: '08-nlp-engineer.pdf',                                icon: '💬', title: 'NLP Engineer',                            audience: 'Text understanding, information extraction, and language pipelines.' },
    { id: 'data-scientist', group: 'engineering', file: '09-data-scientist.pdf',                              icon: '📊', title: 'Data Scientist',                          audience: 'Analysis, modelling, and insight-driven decision support.' },
    { id: 'ai-security',    group: 'engineering', file: '10-ai-security-and-threat-intelligence-engineer.pdf',icon: '🛡️', title: 'AI Security & Threat Intelligence Engineer', audience: 'AI-driven security tooling, threat intelligence, OSINT platforms.' },
    { id: 'mlops-cloud',    group: 'engineering', file: '11-mlops-and-cloud-ai-engineer.pdf',                 icon: '☁️', title: 'MLOps & Cloud AI Engineer',               audience: 'Cloud infrastructure, CI/CD, and model serving at scale on AWS.' },
    { id: 'software-eng',   group: 'engineering', file: '12-software-engineer.pdf',                           icon: '💻', title: 'Software Engineer',                       audience: 'General software engineering roles — systems, backend, full-stack.' },
    { id: 'ai-instructor',  group: 'engineering', file: '13-ai-instructor-and-technical-trainer.pdf',         icon: '🎓', title: 'AI Instructor & Technical Trainer',       audience: 'Teaching, curriculum design, and technical training roles.' },
    { id: 'academic-cv',    group: 'special',     file: '14-academic-cv-phd-scholarship.pdf',                 icon: '📚', title: 'Academic CV — PhD & Scholarship',         audience: 'PhD applications, scholarships, and academic admissions committees.' },
    { id: 'volunteering',   group: 'special',     file: '15-volunteering-fellowships-and-exchange-programmes.pdf', icon: '🌍', title: 'Volunteering, Fellowships & Exchange Programmes', audience: 'Fellowship, exchange, and volunteering-programme applications.' }
  ];

  const GENERAL = {
    id: 'general', icon: '🧭', title: 'General CV',
    audience: "Not sure which role fits? Referrals, networking & LinkedIn intros with no role attached.",
    file: 'general-cv.pdf'
  };

  const PDF_DIR = 'assets/pdfs/';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Render role cards ────────────────────────────────────── */
  function roleCardHTML(role, delay) {
    return `
      <button class="role-card reveal" style="--d:${delay}" data-role="${role.id}">
        <span class="role-icon">${role.icon}</span>
        <span class="role-body">
          <span class="role-title">${role.title}</span>
          <span class="role-audience">${role.audience}</span>
        </span>
        <span class="role-arrow" aria-hidden="true">→</span>
      </button>`;
  }

  function renderGrids() {
    const engineering = ROLES.filter((r) => r.group === 'engineering');
    const special = ROLES.filter((r) => r.group === 'special');
    $('#grid-engineering').innerHTML = engineering.map((r, i) => roleCardHTML(r, i)).join('');
    $('#grid-special').innerHTML = special.map((r, i) => roleCardHTML(r, i)).join('');
  }

  function findRole(id) {
    if (id === 'general') return GENERAL;
    return ROLES.find((r) => r.id === id) || null;
  }

  /* ── Filter ───────────────────────────────────────────────── */
  function initFilter() {
    const input = $('#role-filter');
    const groups = $$('.role-group');
    const noResults = $('#no-results');
    const noResultsTerm = $('#no-results-term');

    input.addEventListener('input', () => {
      const term = input.value.trim().toLowerCase();
      let anyVisible = false;

      groups.forEach((group) => {
        const cards = $$('.role-card', group);
        let groupHasMatch = false;

        cards.forEach((card) => {
          const title = $('.role-title', card).textContent.toLowerCase();
          const audience = $('.role-audience', card).textContent.toLowerCase();
          const match = !term || title.includes(term) || audience.includes(term);
          card.hidden = !match;
          if (match) groupHasMatch = true;
        });

        // Featured group has no filterable text worth hiding on — keep it
        // visible unless the term actively excludes it.
        if (group.dataset.group === 'featured') {
          const card = $('.role-card', group);
          const title = $('.role-title', card).textContent.toLowerCase();
          const audience = $('.role-audience', card).textContent.toLowerCase();
          const match = !term || title.includes(term) || audience.includes(term);
          card.hidden = !match;
          groupHasMatch = match;
        }

        group.hidden = !groupHasMatch;
        if (groupHasMatch) anyVisible = true;
      });

      noResults.hidden = anyVisible;
      noResultsTerm.textContent = input.value.trim();
    });
  }

  /* ── View switching ───────────────────────────────────────── */
  function openCv(id) {
    const role = findRole(id);
    if (!role) return;

    const pdfPath = PDF_DIR + role.file;
    $('#cv-icon').textContent = role.icon;
    $('#cv-title').textContent = role.title;
    $('#cv-audience').textContent = role.audience;
    $('#cv-download').href = pdfPath;
    $('#cv-download').setAttribute('download', role.file);
    $('#cv-newtab').href = pdfPath;
    $('#pdf-frame').src = pdfPath;
    $('#pdf-chrome-name').textContent = role.file;
    $('#pdf-fallback-link').href = pdfPath;

    $('#role-select').hidden = true;
    $('#cv-view').hidden = false;
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  function closeCv() {
    $('#cv-view').hidden = true;
    $('#role-select').hidden = false;
    $('#pdf-frame').src = '';
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  function initNavigation() {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.role-card');
      if (card) openCv(card.dataset.role);
    });
    $('#back-btn').addEventListener('click', closeCv);
  }

  /* ── Typewriter subtitle ──────────────────────────────────── */
  function initTypewriter() {
    const out = $('#typewriter');
    const phrases = [
      'AI & Machine Learning Engineer.',
      'MSc AI · Queen’s University, Canada.',
      'One CV per role — pick yours.'
    ];
    if (reducedMotion()) { out.textContent = phrases[0]; return; }

    let i = 0, c = 0, deleting = false;
    const tick = () => {
      const word = phrases[i];
      c += deleting ? -1 : 1;
      out.textContent = word.slice(0, c);
      let delay = deleting ? 28 : 55;
      if (!deleting && c === word.length) { delay = 1700; deleting = true; }
      else if (deleting && c === 0) { deleting = false; i = (i + 1) % phrases.length; delay = 300; }
      setTimeout(tick, delay);
    };
    tick();
  }

  /* ── Background particle canvas ───────────────────────────── */
  function initParticles() {
    const canvas = $('#bg-canvas');
    if (!canvas || reducedMotion()) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles;

    const COLORS = ['#6b3fd4', '#b14bd8', '#f0a13a', '#3ad0c8'];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function makeParticles() {
      const count = Math.min(60, Math.floor((w * h) / 26000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        c: COLORS[Math.floor(Math.random() * COLORS.length)]
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.5;
        ctx.fill();
      });
      requestAnimationFrame(frame);
    }

    resize();
    makeParticles();
    frame();
    window.addEventListener('resize', () => { resize(); makeParticles(); });
  }

  /* ── Boot ─────────────────────────────────────────────────── */
  function boot() {
    $('#year').textContent = new Date().getFullYear();
    renderGrids();
    initFilter();
    initNavigation();
    initTypewriter();
    initParticles();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
