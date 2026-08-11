/* ============================================================
   Mahmoud Alyosify — UI layer
   Rendering, i18n, nav, lightbox, counters, enquiry form.

   Note on innerHTML: every template below is built from js/data.js
   and js/i18n.js, which are first-party files in this repository.
   No user-supplied or model-generated content is ever passed here —
   that path lives in js/security.js and builds DOM nodes only.
   ============================================================ */

(() => {
  'use strict';

  /* ── Enquiry form ──────────────────────────────────────────
     Get a free access key at https://web3forms.com (takes a minute).
     Leave it empty and the form falls back to a pre-filled mailto:
     so it works from day one.                                    */
  const WEB3FORMS_KEY = '';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  let lang = 'en';

  const t = (key) => (window.I18N[lang] && window.I18N[lang][key]) ?? window.I18N.en[key] ?? '';
  const L = (val) => (val && typeof val === 'object' ? (val[lang] ?? val.en) : val);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ── Icons ─────────────────────────────────────────────── */
  const ICON = {
    github:   '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.65h.05a4.17 4.17 0 0 1 3.75-2.06c4 0 4.75 2.64 4.75 6.07V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.86V21h-4V9z"/></svg>',
    youtube:  '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.53A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.88.53 9.38.53 9.38.53s7.5 0 9.38-.53a3 3 0 0 0 2.12-2.12A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>',
    hf:       '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M8.5 10h.01M15.5 10h.01M8 14.5a5 5 0 0 0 8 0"/></svg>',
    kaggle:   '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 3v11.3L14.9 8h3.4l-5.4 5.7 5.6 7.3h-3.5l-4.1-5.6L9 16.9V21H6V3h3z"/></svg>',
    medium:   '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6.9 7.2a.9.9 0 0 0-.3-.75L4.5 4.2v-.3h6.4l4.95 10.9L20.2 3.9H24v.3l-1.8 1.7a.5.5 0 0 0-.2.5v12.6a.5.5 0 0 0 .2.5l1.75 1.7v.3h-8.8v-.3l1.8-1.75c.18-.18.18-.23.18-.5V8.87l-5.06 12.8h-.68L5.5 8.87v8.58c-.05.36.07.72.32.98l2.36 2.85v.3H1.5v-.3l2.36-2.85c.25-.26.36-.63.3-.98V7.2z"/></svg>',
    x:        '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23zm-1.16 17.52h1.83L7.02 4.13H5.05l12.03 15.64z"/></svg>',
    udemy:    '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2 1 8l11 6 11-6-11-6zM5 12.5v4c0 2.5 3.1 4.5 7 4.5s7-2 7-4.5v-4l-7 3.8-7-3.8z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.05L2 22l5.1-1.34A10 10 0 1 0 12 2zm5.5 14.2c-.24.66-1.4 1.27-1.93 1.31-.5.05-1.13.07-1.82-.11a15.3 15.3 0 0 1-6.55-5.8c-.5-.84-.82-1.8-.82-2.72 0-.92.48-1.7.87-2.06.19-.18.42-.26.62-.26h.44c.16 0 .35 0 .52.4.2.47.68 1.66.74 1.78.06.12.1.26.02.42-.34.68-.7.65-.52.96.7 1.2 1.4 1.62 2.46 2.15.18.09.29.08.4-.05.11-.13.46-.54.58-.72.12-.19.24-.15.4-.09.17.06 1.06.5 1.24.6.18.09.3.13.35.2.04.09.04.5-.2 1.16z"/></svg>'
  };

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */

  function renderHeroStats() {
    $('#hero-stats').innerHTML = SITE.stats.map((s) => `
      <li>
        <span class="hero__stat-v" data-count="${s.value}" data-suffix="${esc(s.suffix)}">0</span>
        <span class="hero__stat-l">${esc(L(s.label))}</span>
      </li>`).join('');
  }

  function renderAbout() {
    const lead = $('#about-lead');
    lead.innerHTML = L(SITE.about.lead)
      .split(' ')
      .map((w) => `<span class="w">${esc(w)}</span>`)
      .join(' ');
    $('#about-body').textContent = L(SITE.about.body);
    $('#about-facts').innerHTML = SITE.about.facts.map((f) => `
      <li>
        <span class="facts__icon">${f.icon}</span>
        <span>
          <span class="facts__k">${esc(L(f.k))}</span><br />
          <span class="facts__v">${esc(L(f.v))}</span>
        </span>
      </li>`).join('');
  }

  function renderTimeline() {
    $('#timeline').innerHTML =
      '<span class="timeline__progress" aria-hidden="true"></span>' +
      SITE.experience.map((e) => {
        const org = e.url
          ? `<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(L(e.org))}</a>`
          : esc(L(e.org));
        return `
        <li class="tl-item" data-reveal>
          <span class="tl-item__dot" aria-hidden="true"></span>
          <p class="tl-item__date">${esc(L(e.date))}</p>
          <h3 class="tl-item__role">${esc(L(e.role))}</h3>
          <p class="tl-item__org">${org}</p>
          <ul class="tl-item__points">${L(e.points).map((p) => `<li>${p}</li>`).join('')}</ul>
        </li>`;
      }).join('');
  }

  function renderProjects() {
    $('#projects-grid').innerHTML = SITE.projects.map((p) => {
      const links = [];
      if (p.repo) links.push(`<a class="btn btn--ghost btn--sm" href="${esc(p.repo)}" target="_blank" rel="noopener">${ICON.github}<span>${esc(t('proj.code'))}</span></a>`);
      if (p.demo) links.push(`<a class="btn btn--ghost btn--sm" href="${esc(p.demo)}" target="_blank" rel="noopener">${esc(t('proj.live'))}</a>`);
      const note = p.supervisor ? `<span class="pcard__note mono">${esc(p.supervisor)}</span>` : '';
      return `
      <article class="pcard${p.featured ? ' pcard--featured' : ''}" data-reveal data-tilt>
        <span class="pcard__glow" aria-hidden="true"></span>
        <div class="pcard__top">
          <span class="pcard__kind">${esc(L(p.kind))}</span>
          <span class="pcard__period">${esc(L(p.period))}</span>
        </div>
        <h3 class="pcard__title">${esc(p.title)}</h3>
        <p class="pcard__sub">${esc(L(p.subtitle))}</p>
        <p class="pcard__desc">${esc(L(p.desc))}</p>
        <div class="pcard__tags">${p.tags.map((tg) => `<span class="chip">${esc(tg)}</span>`).join('')}</div>
        <div class="pcard__foot">${links.join('')}${note}</div>
      </article>`;
    }).join('');
  }

  function renderRail() {
    $('#rail-track').innerHTML = SITE.skills.map((s) => `
      <article class="stage-card" data-reveal>
        <p class="stage-card__n mono">${esc(s.stage)}</p>
        <h3 class="stage-card__name">${esc(L(s.name))}</h3>
        <p class="stage-card__note">${esc(L(s.note))}</p>
        <div class="stage-card__items">${s.items.map((i) => `<span class="chip">${esc(i)}</span>`).join('')}</div>
      </article>`).join('');
  }

  function renderImpact() {
    $('#impact-stats').innerHTML = SITE.stats.map((s) => `
      <li data-reveal>
        <span class="impact__v" data-count="${s.value}" data-suffix="${esc(s.suffix)}">0</span>
        <span class="impact__l">${esc(L(s.label))}</span>
      </li>`).join('');
  }

  function renderTeaching() {
    $('#platforms').innerHTML = SITE.teaching.platforms.map((p) => `
      <article class="plat panel panel--beam" data-reveal>
        <span class="plat__icon plat__icon--${p.icon}">${ICON[p.icon] || ''}</span>
        <div>
          <h3 class="plat__name">${esc(L(p.name))}</h3>
          <p class="plat__desc">${esc(L(p.desc))}</p>
          <p class="plat__stat">${esc(p.stat)}</p>
          <p class="plat__stat-l">${esc(L(p.statLabel))}</p>
          <a class="btn btn--ghost btn--sm" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(L(p.cta))}</a>
        </div>
      </article>`).join('');

    $('#courses').innerHTML = SITE.teaching.courses.map((c) => `
      <article class="course panel" data-reveal>
        <img class="course__img" src="${esc(c.image)}" alt="${esc(L(c.title))}" loading="lazy" />
        <div class="course__body">
          <h4 class="course__title">${esc(L(c.title))}</h4>
          <div class="course__links">
            <a class="btn btn--ghost btn--sm" href="${esc(c.udemy)}" target="_blank" rel="noopener">Udemy</a>
            <a class="btn btn--ghost btn--sm" href="${esc(c.youtube)}" target="_blank" rel="noopener">YouTube</a>
          </div>
        </div>
      </article>`).join('');
  }

  function renderAwards() {
    $('#awards-grid').innerHTML = SITE.achievements.map((a) => `
      <article class="award panel panel--beam" data-reveal>
        <span class="award__icon" aria-hidden="true">${a.icon}</span>
        <div>
          <h3 class="award__title">${esc(L(a.title))}</h3>
          <p class="award__meta">${esc(L(a.meta))}</p>
          <p class="award__desc">${esc(L(a.desc))}</p>
          ${a.links.length ? `<div class="award__links">${a.links.map((l) =>
            `<a class="btn btn--ghost btn--sm" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(L(l.label))}</a>`).join('')}</div>` : ''}
        </div>
      </article>`).join('');
  }

  function renderRecs() {
    $('#recs-grid').innerHTML = SITE.recommendations.map((r) => `
      <blockquote class="rec panel" data-reveal>
        <p class="rec__mark" aria-hidden="true">&ldquo;</p>
        <p class="rec__text">${esc(L(r.text))}</p>
        <footer class="rec__who">
          <img class="rec__avatar" src="${esc(r.avatar)}" alt="${esc(r.name)}" loading="lazy" width="44" height="44" />
          <span>
            <span class="rec__name">${esc(r.name)}</span><br />
            <span class="rec__role">${esc(L(r.role))}</span>
          </span>
        </footer>
      </blockquote>`).join('');
  }

  function renderCerts() {
    $('#certs-grid').innerHTML = SITE.certificates.map((c) => {
      const name = L(c.name);
      const meta = c.issuer + (c.year ? ' · ' + c.year : '');
      return `
      <button class="cert" type="button" data-reveal
              data-src="Certificates/${esc(c.file)}" data-name="${esc(name)}">
        <span class="cert__thumb-box">
          <img class="cert__thumb" src="Certificates/${esc(c.file)}" alt="${esc(name)}" loading="lazy" />
        </span>
        <span class="cert__body">
          <span class="cert__name">${esc(name)}</span>
          <span class="cert__meta">${esc(meta)}</span>
        </span>
      </button>`;
    }).join('');
  }

  function renderSocial() {
    const l = SITE.links;
    const items = [
      ['GitHub', l.github, 'github'], ['LinkedIn', l.linkedin, 'linkedin'],
      ['YouTube', l.youtube, 'youtube'], ['Hugging Face', l.huggingface, 'hf'],
      ['Kaggle', l.kaggle, 'kaggle'], ['Udemy', l.udemy, 'udemy'],
      ['Medium', l.medium, 'medium'], ['X', l.x, 'x'], ['WhatsApp', l.whatsapp, 'whatsapp']
    ];
    $('#social-grid').innerHTML = items.map(([label, url, icon]) =>
      `<a class="soc" href="${esc(url)}" target="_blank" rel="noopener">${ICON[icon]}<span>${esc(label)}</span></a>`).join('');

    $('#foot-links').innerHTML = items.slice(0, 6).map(([label, url, icon]) =>
      `<a class="foot__link" href="${esc(url)}" target="_blank" rel="noopener" aria-label="${esc(label)}">${ICON[icon]}</a>`).join('');
  }

  function renderDots() {
    const sections = $$('[data-section]');
    $('.dots').innerHTML = sections.map((s) => {
      const id = s.id;
      const key = { hero: 'nav.about', about: 'nav.about', work: 'nav.work', projects: 'nav.projects',
        skills: 'nav.skills', impact: 'impact.eyebrow', teaching: 'nav.teaching', awards: 'nav.awards',
        recs: 'recs.eyebrow', certs: 'nav.certs', contact: 'nav.contact', fatfooter: 'nav.contact' }[id];
      const label = id === 'hero' ? 'Top' : t(key) || id;
      return `<a class="dots__item" href="#${id}" aria-label="${esc(label)}"><span class="dots__label">${esc(label)}</span></a>`;
    }).join('');
  }

  function renderAll() {
    renderHeroStats(); renderAbout(); renderTimeline(); renderProjects();
    renderRail(); renderImpact(); renderTeaching(); renderAwards();
    renderRecs(); renderCerts(); renderSocial(); renderDots();
    document.dispatchEvent(new CustomEvent('site:rendered'));
  }

  /* ══════════════════════════════════════════════════════════
     I18N
     ══════════════════════════════════════════════════════════ */
  function applyI18n() {
    $$('[data-i18n]').forEach((el) => {
      const v = t(el.dataset.i18n);
      if (!v) return;
      // The only strings carrying markup are our own <strong> emphasis.
      if (v.includes('<strong>')) el.innerHTML = v;
      else el.textContent = v;
    });
    $$('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(',').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        const v = t(key);
        if (attr && v) el.setAttribute(attr, v);
      });
    });
  }

  function setLang(next, { persist = true } = {}) {
    lang = next === 'ar' ? 'ar' : 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (persist) { try { localStorage.setItem('ma-lang', lang); } catch (_) { /* private mode */ } }
    applyI18n();
    renderAll();
    startRoleRotator();
    document.dispatchEvent(new CustomEvent('site:lang', { detail: { lang } }));
  }

  function initLang() {
    const url = new URLSearchParams(location.search).get('lang');
    let saved = null;
    try { saved = localStorage.getItem('ma-lang'); } catch (_) { /* ignore */ }
    setLang(url || saved || 'en', { persist: !!url });

    $('#lang-toggle').addEventListener('click', () => setLang(lang === 'en' ? 'ar' : 'en'));
  }

  /* ══════════════════════════════════════════════════════════
     ROLE ROTATOR
     ══════════════════════════════════════════════════════════ */
  let rotatorTimer = null;
  function startRoleRotator() {
    clearTimeout(rotatorTimer);
    const out = $('#role-rotator');
    if (!out) return;
    const roles = L(SITE.person.roles);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      out.textContent = roles[0];
      return;
    }
    let i = 0, c = 0, deleting = false;
    const tick = () => {
      const word = roles[i];
      c += deleting ? -1 : 1;
      out.textContent = word.slice(0, c);
      let delay = deleting ? 34 : 62;
      if (!deleting && c === word.length) { delay = 1900; deleting = true; }
      else if (deleting && c === 0) { deleting = false; i = (i + 1) % roles.length; delay = 320; }
      rotatorTimer = setTimeout(tick, delay);
    };
    tick();
  }

  /* ══════════════════════════════════════════════════════════
     NAV
     ══════════════════════════════════════════════════════════ */
  function initNav() {
    const nav = $('#nav');
    const links = $('#nav-links');
    const burger = $('#nav-burger');

    const onScroll = () => {
      nav.classList.toggle('is-stuck', window.scrollY > 40);
      $('#to-top').classList.toggle('is-on', window.scrollY > 700);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    burger.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        links.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    $('#to-top').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Scroll spy for nav links + dots
    const sections = $$('[data-section]');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        $$('.nav__links a').forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
        $$('.dots__item').forEach((d) => d.classList.toggle('is-active', d.getAttribute('href') === '#' + id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ══════════════════════════════════════════════════════════
     COUNTERS
     ══════════════════════════════════════════════════════════ */
  function initCounters() {
    const seen = new WeakSet();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting || seen.has(en.target)) return;
        seen.add(en.target);
        const target = Number(en.target.dataset.count) || 0;
        const suffix = en.target.dataset.suffix || '';
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          en.target.textContent = target.toLocaleString() + suffix;
          return;
        }
        const dur = 1500;
        const t0 = performance.now();
        const step = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          en.target.textContent = Math.round(target * eased).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });

    document.addEventListener('site:rendered', () => {
      $$('[data-count]').forEach((el) => io.observe(el));
    });
  }

  /* ══════════════════════════════════════════════════════════
     LIGHTBOX
     ══════════════════════════════════════════════════════════ */
  function initLightbox() {
    const box = $('#lightbox');
    const img = $('#lightbox-img');
    const cap = $('#lightbox-cap');
    let lastFocus = null;

    const open = (src, name) => {
      lastFocus = document.activeElement;
      img.src = src; img.alt = name; cap.textContent = name;
      box.hidden = false;
      requestAnimationFrame(() => box.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
      $('#lightbox-close').focus();
    };
    const close = () => {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => { box.hidden = true; img.src = ''; }, 300);
      if (lastFocus) lastFocus.focus();
    };

    document.addEventListener('click', (e) => {
      const cert = e.target.closest('.cert');
      if (cert) open(cert.dataset.src, cert.dataset.name);
    });
    $('#lightbox-close').addEventListener('click', close);
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !box.hidden) close();
    });
  }

  /* ══════════════════════════════════════════════════════════
     ENQUIRY FORM
     ══════════════════════════════════════════════════════════ */
  function initForm() {
    const form = $('#enquiry-form');
    const status = $('#form-status');
    const submit = $('#enquiry-submit');
    const submitLabel = submit.querySelector('span');

    const setErr = (id, msgKey) => {
      const field = $('#' + id).closest('.field');
      field.classList.add('is-bad');
      if (!field.querySelector('.field__err')) {
        const p = document.createElement('p');
        p.className = 'field__err';
        field.appendChild(p);
      }
      field.querySelector('.field__err').textContent = t(msgKey);
    };
    const clearErrs = () => $$('.field.is-bad', form).forEach((f) => {
      f.classList.remove('is-bad');
      const e = f.querySelector('.field__err');
      if (e) e.remove();
    });

    const say = (msg, kind) => {
      status.textContent = msg;
      status.className = 'form-status' + (kind ? ' is-' + kind : '');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrs();
      say('', '');

      // Honeypot — a bot filled the hidden field. Pretend success, send nothing.
      if ($('#company').value.trim() !== '') { say(t('contact.ok'), 'ok'); form.reset(); return; }

      const name = $('#f-name').value.trim();
      const email = $('#f-email').value.trim();
      const topic = $('#f-topic').value;
      const message = $('#f-message').value.trim();

      let bad = false;
      if (!name)                        { setErr('f-name', 'contact.errName');  bad = true; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setErr('f-email', 'contact.errEmail'); bad = true; }
      if (message.length < 10)          { setErr('f-message', 'contact.errMsg'); bad = true; }
      if (bad) { $('.field.is-bad input, .field.is-bad textarea', form)?.focus(); return; }

      const topicLabel = $('#f-topic').selectedOptions[0].textContent.trim();
      const subject = `Portfolio enquiry — ${topicLabel} — ${name}`;

      // No access key configured → pre-filled mailto so the form still works.
      if (!WEB3FORMS_KEY) {
        const body = `${message}\n\n—\nFrom: ${name} <${email}>\nTopic: ${topicLabel}`;
        window.location.href =
          `mailto:${SITE.person.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        say(t('contact.ok'), 'ok');
        return;
      }

      submit.disabled = true;
      submitLabel.textContent = t('contact.sending');
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject, name, email, topic: topicLabel, message,
            from_name: 'mahmoudalyosify.github.io'
          })
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error('send failed');
        say(t('contact.ok'), 'ok');
        form.reset();
      } catch (_) {
        say(t('contact.err'), 'err');
      } finally {
        submit.disabled = false;
        submitLabel.textContent = t('contact.send');
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     CHATBOT LOADER — nothing loads until the user asks for it
     ══════════════════════════════════════════════════════════ */
  function initBotLoader() {
    const fab = $('#bot-fab');
    let loading = false;

    const load = async () => {
      if (loading) return;
      loading = true;
      fab.classList.add('is-loading');

      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'css/chatbot.css';
      document.head.appendChild(css);

      const load1 = (src) => new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = src; s.onload = res; s.onerror = rej;
        document.body.appendChild(s);
      });

      try {
        await load1('js/security.js');
        await load1('js/providers.js');
        await load1('js/retriever.js');
        await load1('js/chatbot.js');
        window.MahmoudAI.mount({ lang, t });
        window.MahmoudAI.open();
        fab.removeEventListener('click', load);
        fab.addEventListener('click', () => window.MahmoudAI.toggle());
      } catch (_) {
        loading = false;
        fab.classList.remove('is-loading');
      } finally {
        fab.classList.remove('is-loading');
      }
    };

    fab.addEventListener('click', load);
    document.addEventListener('site:lang', (e) => {
      if (window.MahmoudAI) window.MahmoudAI.setLang(e.detail.lang, t);
    });
  }

  /* ══════════════════════════════════════════════════════════
     BOOT
     ══════════════════════════════════════════════════════════ */
  function boot() {
    $('#year').textContent = new Date().getFullYear();
    // Listeners first — initLang() renders and fires site:rendered.
    initNav();
    initCounters();
    initLightbox();
    initForm();
    initBotLoader();
    initLang();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.MASite = { get lang() { return lang; }, t, L };
})();
