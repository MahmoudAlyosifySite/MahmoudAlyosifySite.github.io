/* ============================================================
   Mahmoud Alyosify — Portfolio App JS
   Vanilla JS · No jQuery · No external dependencies
   ============================================================ */

'use strict';

/* ── Navigation ──────────────────────────────────────────── */
const nav = document.getElementById('main-nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav__links');

// Scroll: add .scrolled class
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  // Back to top
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    btt.classList.toggle('visible', window.scrollY > 400);
  }
  // Active nav link
  updateActiveNav();
});

// Hamburger toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
}

// Close mobile nav on link click
document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
  });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Active nav link based on scroll position
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav__links a[href="#${id}"]`);
    if (!link) return;
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
}

/* ── Back to Top ──────────────────────────────────────────── */
const bttBtn = document.querySelector('.back-to-top');
if (bttBtn) {
  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Scroll Animations (IntersectionObserver) ────────────── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

/* ── Certificates Grid ────────────────────────────────────── */
const certificates = [
  { file: "IMG_4014.JPG",  name: "AWS Academy — Data Engineering",           issuer: "Amazon Web Services", year: "2026" },
  { file: "IMG_0340.JPG",  name: "AWS Academy — Machine Learning for NLP",   issuer: "Amazon Web Services", year: "2025" },
  { file: "IMG_4832.JPG",  name: "AWS Academy — ML Foundations",             issuer: "Amazon Web Services", year: "2025" },
  { file: "Annotation 2020-07-04 231855.jpg", name: "Machine Learning Specialization", issuer: "Coursera / DeepLearning.AI", year: "2020" },
  { file: "IMG_0600.JPG",  name: "HCIP — AI (Huawei Certified ICT Professional)", issuer: "Huawei" },
  { file: "IMG_1602.JPG",  name: "Microsoft Certified: Data Analyst Associate", issuer: "Microsoft / Power BI" },
  { file: "IMG_2648.jpg",  name: "Generative AI & Prompt Engineering",       issuer: "IBM / Coursera" },
  { file: "IMG_3992.JPG",  name: "Generative AI: Boost Your Cybersecurity Career", issuer: "IBM" },
  { file: "AI in Cybersecurity.png", name: "AI in Cybersecurity (420 hrs)", issuer: "NTI", year: "2025" },
  { file: "IMG_3993.JPG",  name: "Machine Learning Internship (200 hrs)",    issuer: "ITIDA / Egypt Makes Electronics", year: "2023" },
  { file: "IMG_3994.JPG",  name: "Full Stack Development (.NET & Angular)",  issuer: "Route Academy" },
  { file: "IMG_6131.JPG",  name: "Data-analysis using R (36 hrs)",          issuer: "Children's Cancer Hospital 57357", year: "2021" },
  { file: "IMG_7887.JPG",  name: "Certificate of Excellence - Vitalism",    issuer: "Air Defense College (ISEIC)", year: "2023" },
  { file: "IMG_9390.JPG",  name: "First Place - Ideal Student Competition", issuer: "Assiut University", year: "2023" },
  { file: "iti 1.JPG",     name: "Intro to UI/UX (60 hrs)",                  issuer: "ITI", year: "2023" },
  { file: "iti 2.JPG",     name: "Intro to SQL Server & C# (90 hrs)",       issuer: "ITI", year: "2022" },
  { file: "iti 3.JPG",     name: "Intro to Mearn Stack Development (60 hrs)",issuer: "ITI", year: "2022" },
  { file: "iti 4.JPG",     name: ".NET Web Development (120 hrs)",           issuer: "ITI", year: "2022" },
  { file: "iti 5.JPG",     name: "Android Mobile Development (30 hrs)",      issuer: "ITI", year: "2022" },
  { file: "Screenshot 2025-02-13 023245.png", name: "Fortinet Certified Associate in Cybersecurity", issuer: "Fortinet", year: "2025" },
];

function renderCerts() {
  const grid = document.getElementById('certs-grid');
  if (!grid) return;
  grid.innerHTML = certificates.map(cert => `
    <div class="cert-item fade-up" onclick="openLightbox('Certificates/${cert.file}', '${cert.name}')">
      <div style="overflow:hidden;height:160px;">
        <img class="cert-item__thumb" src="Certificates/${cert.file}" alt="${cert.name}" loading="lazy">
      </div>
      <div class="cert-item__body">
        <div class="cert-item__name">${cert.name}</div>
        <div class="cert-item__issuer">${cert.issuer}${cert.year ? ' · ' + cert.year : ''}</div>
      </div>
    </div>
  `).join('');
  // Re-observe new fade-up elements
  grid.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));
}

/* ── Lightbox ─────────────────────────────────────────────── */
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(src, alt) {
  if (!lightboxOverlay || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightboxOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightboxOverlay) return;
  lightboxOverlay.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

if (lightboxOverlay) {
  lightboxOverlay.addEventListener('click', e => {
    if (e.target === lightboxOverlay) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ── Typewriter effect (hero) ─────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = [
    'AI & Data Science Engineer',
    'LLM Systems Builder',
    'MSc AI Researcher',
    'Generative AI Engineer',
    'ML Educator — 10K+ Students',
  ];
  let wordIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    const current = words[wordIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex--);
    } else {
      el.textContent = current.substring(0, charIndex++);
    }
    let delay = isDeleting ? 40 : 80;
    if (!isDeleting && charIndex === current.length + 1) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      charIndex = 0;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 300;
    }
    setTimeout(type, delay);
  }
  type();
}

/* ── Counter animation ────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero__stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderCerts();
  initTypewriter();
  updateActiveNav();
});
