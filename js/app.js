/* ============================================================
   Mahmoud Alyosify — Portfolio App JS
   Vanilla JS · No jQuery · No external dependencies
   ============================================================ */

'use strict';

/* ── Navigation ──────────────────────────────────────────── */
const nav = document.getElementById('main-nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav__links');
const langToggle = document.getElementById('lang-toggle');
let currentLanguage = 'en';

function setLanguage(lang) {
  currentLanguage = lang;
  const isArabic = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  document.body.dir = isArabic ? 'rtl' : 'ltr';

  const translations = {
    nav: {
      about: isArabic ? 'من أنا' : 'About',
      experience: isArabic ? 'الخبرة' : 'Experience',
      projects: isArabic ? 'المشاريع' : 'Projects',
      skills: isArabic ? 'المهارات' : 'Skills',
      teaching: isArabic ? 'التدريس' : 'Teaching',
      achievements: isArabic ? 'الإنجازات' : 'Achievements',
      certifications: isArabic ? 'الشهادات' : 'Certifications',
      contact: isArabic ? 'التواصل' : 'Contact',
      cta: isArabic ? 'تواصل معي' : 'Contact Me',
      toggle: isArabic ? 'English' : 'العربية'
    },
    hero: {
      badge: isArabic ? 'متاح لفرص البحث والتطوير في الذكاء الاصطناعي والهندسة' : 'Available for AI R&D and engineering opportunities',
      name: 'Mahmoud Alyosify',
      summary: isArabic ? 'ماجستير الذكاء الاصطناعي في <strong>جامعة كوينز، كندا</strong> — وحصلت على <strong>منحة الرئاسة</strong>. أعمل على بناء أنظمة جاهزة للإنتاج بالاعتماد على <strong>نماذج اللغات الكبيرة</strong>، وسلاسل <strong>التعلّم غير الخاضع للإشراف</strong>، ومحسّنات <strong>التعلّم المعزز</strong>، ومنتجات <strong>الذكاء الاصطناعي التوليدي</strong> قابلة للتوسّع. وقد علّمت <strong>أكثر من 10,000</strong> متعلّم عبر مصر.' : 'MSc AI at <strong>Queen\'s University, Canada</strong> — supported by the <strong>Presidential Scholarship</strong>. I build production-ready systems around <strong>large language models</strong>, <strong>self-supervised learning</strong>, <strong>reinforcement learning</strong>, and scalable <strong>generative AI</strong> products. I have taught <strong>10,000+</strong> learners across Egypt.',
      actions: {
        projects: isArabic ? 'عرض المشاريع' : 'View Projects',
        cv: isArabic ? 'تنزيل السيرة الذاتية' : 'Download CV'
      },
      stats: {
        students: isArabic ? 'طلاب تم تعليمهم' : 'students taught',
        views: isArabic ? 'مشاهدات يوتيوب' : 'YouTube views',
        projects: isArabic ? 'مشاريع في الذكاء الاصطناعي' : 'AI projects',
        certs: isArabic ? 'شهادات AWS' : 'AWS certifications'
      }
    },
    about: {
      label: isArabic ? 'من أنا' : 'About Me',
      title: isArabic ? 'نبذة عن <span>ي</span>' : 'About <span>Me</span>',
      p1: isArabic ? 'أنا <strong>مهندس ذكاء اصطناعي وعلوم بيانات</strong> حاصل على بكالوريوس الحاسبات والمعلومات (البيوانفورماتكس) من جامعة أسيوط، وأُتابع حاليًا <strong>ماجستير الذكاء الاصطناعي في جامعة كوينز، كندا</strong> من خلال <strong>منحة الرئاسة</strong> — وهي منحة وطنية تنافسية للدراسات العليا في الذكاء الاصطناعي.' : 'I am an <strong>AI & Data Science Engineer</strong> with a B.Sc. in Computer and Information Science (Bioinformatics) from Assiut University, and I am currently pursuing an <strong>MSc in Artificial Intelligence at Queen\'s University, Canada</strong> through the <strong>Presidential Scholarship</strong> — a competitive national fellowship for AI graduate studies.',
      p2: isArabic ? 'يمتد عملي البحثي والهندسي على <strong>ضبط نماذج اللغات الكبيرة (LoRA/QLoRA)</strong>، و<strong>التعلّم المقارن غير الخاضع للإشراف</strong>، و<strong>التعلّم المعزز العميق</strong> لتحسين السحابة، بالإضافة إلى تطبيقات <strong>التعلّم الآلي التنبئي</strong> في مجال السلامة الفضائية. أُشغّل أنظمة ذكاء اصطناعي جاهزة للإنتاج على <strong>AWS</strong> وأدمج <strong>أنظمة RAG</strong> و<strong>سير العمل متعدد الوكلاء</strong> و<strong>ONNX/FAISS</strong> لأداء عملي فعّال.' : 'My research and engineering work spans <strong>fine-tuning large language models (LoRA/QLoRA)</strong>, <strong>self-supervised contrastive learning</strong>, and <strong>deep reinforcement learning</strong> for cloud optimization, along with predictive <strong>machine learning</strong> applications in space safety. I deploy production-ready AI systems on <strong>AWS</strong> and integrate <strong>RAG systems</strong>, <strong>multi-agent workflows</strong>, and <strong>ONNX/FAISS</strong> for performant delivery.',
      p3: isArabic ? 'إلى جانب الهندسة، علّمت <strong>أكثر من 10,000 متعلّم</strong> من خلال دورات على Udemy وقناتي العربية على يوتيوب (Einstein Misr) التي تجاوزت <strong>700 ألف مشاهدة</strong>، وقد قدمت مؤخرًا عرضًا في <a href="https://www.queensu.ca/ctl/programs-and-events/ai-teaching-and-learning-forum-2026" target="_blank" rel="noopener">منتدى AI Teaching and Learning Forum 2026</a> بجامعة كوينز.' : 'Alongside engineering, I have taught <strong>10,000+ learners</strong> through Udemy courses and my Arabic YouTube channel (Einstein Misr), which has surpassed <strong>700K views</strong>. I recently presented at the <a href="https://www.queensu.ca/ctl/programs-and-events/ai-teaching-and-learning-forum-2026" target="_blank" rel="noopener">Queen\'s AI Teaching and Learning Forum 2026</a>.',
      highlight: isArabic ? '<strong>مقدم في منتدى جامعة كوينز للذكاء الاصطناعي 2026</strong> — <em>وكيل متعدد الوسائط الآلي: من PDF إلى عرض تقديمي مصحوب بتعليق صوتي</em> (مع ميرنا إمبابي) · KINE 104, Ideas Fair' : '<strong>Presented at the Queen\'s AI Forum 2026</strong> — <em>Automated Multimodal Agent: PDF to Narrated PowerPoint</em> (with Mirna Emabie) · KINE 104, Ideas Fair',
      facts: {
        study: isArabic ? 'الدراسة الحالية' : 'Current Study',
        scholarship: isArabic ? 'المنحة' : 'Scholarship',
        degree: isArabic ? 'البكالوريوس' : 'Bachelor\'s Degree',
        location: isArabic ? 'الموقع' : 'Location',
        languages: isArabic ? 'اللغات' : 'Languages',
        email: isArabic ? 'البريد الإلكتروني' : 'Email',
        studyValue: isArabic ? 'ماجستير الذكاء الاصطناعي في جامعة كوينز، كندا' : 'MSc AI @ Queen\'s University, Canada',
        scholarshipValue: isArabic ? 'منحة الرئاسة (منحة الذكاء الاصطناعي الوطنية)' : 'The Presidential Scholarship (National AI Fellowship)',
        degreeValue: isArabic ? 'بكالوريوس علوم الحاسبات والمعلومات (البيوانفورماتكس) — المعدل 3.53/4.0' : 'B.Sc. Computer & Information Science (Bioinformatics) — GPA 3.53/4.0',
        locationValue: isArabic ? 'القاهرة الجديدة، مصر · متاح للنقل' : 'New Cairo, Egypt · Open to Relocation',
        languagesValue: isArabic ? 'العربية (الأم) · الإنجليزية (إتقان عملي)' : 'Arabic (Native) · English (Professional Working Proficiency)'
      }
    },
    education: {
      label: isArabic ? 'الخلفية الأكاديمية' : 'Academic Background',
      title: isArabic ? 'تحصيلي <span>الأكاديمي</span>' : 'My <span>Academic</span> Background',
      mscInstitution: isArabic ? 'جامعة كوينز · كندا' : 'Queen\'s University · Canada',
      mscDegree: isArabic ? 'ماجستير في الذكاء الاصطناعي' : 'MSc in Artificial Intelligence',
      mscMeta: isArabic ? 'سبتمبر 2025 – حتى الآن · قيد التقدم' : 'September 2025 – Present · In Progress',
      mscDetails: isArabic ? [
        'حصلت على <strong>منحة الرئاسة</strong> — منحة وطنية تنافسية للدراسات العليا في الذكاء الاصطناعي',
        'CSAI 801 — أساسيات الذكاء الاصطناعي والتعلّم الآلي',
        'CSAI 810 — مواضيع متقدمة في الذكاء الاصطناعي (الذكاء الاصطناعي التوليدي، نماذج اللغات الكبيرة، RAG، وكلاء ذكاء اصطناعي)',
        'CISC 886 — الحوسبة السحابية والبيانات الكبيرة (Spark, Hadoop, Docker, CI/CD, AWS)',
        'CISC 839 — التحليل المتقدم للبيانات (سلاسل ML من البداية للنهاية، GenAI للتحليل)',
        'CISC 867 — التعلم العميق | CISC 856 — التعلم المعزز'
      ] : [
        'Awarded the <strong>Presidential Scholarship</strong> — a competitive national award for graduate AI studies',
        'CSAI 801 — Foundations of AI and Machine Learning',
        'CSAI 810 — Advanced Topics in AI (Generative AI, LLMs, RAG, AI Agents)',
        'CISC 886 — Cloud Computing and Big Data (Spark, Hadoop, Docker, CI/CD, AWS)',
        'CISC 839 — Advanced Data Analytics (end-to-end ML pipelines, GenAI for analytics)',
        'CISC 867 — Deep Learning | CISC 856 — Reinforcement Learning'
      ],
      mscBadge: isArabic ? 'منحة الرئاسة' : 'Presidential Scholarship',
      bscInstitution: isArabic ? 'جامعة أسيوط · مصر' : 'Assiut University · Egypt',
      bscDegree: isArabic ? 'بكالوريوس علوم الحاسبات والمعلومات (البيوانفورماتكس)' : 'B.Sc. Computer & Information Science (Bioinformatics)',
      bscMeta: isArabic ? '2019 – يوليو 2023 · المعدل: 3.53 / 4.00' : '2019 – July 2023 · GPA: 3.53 / 4.00',
      bscDetails: isArabic ? [
        'مشروع التخرج: <a href="https://vitalismsolution.github.io/" target="_blank" rel="noopener"><strong>Vitalism Solution</strong></a> — تقدير العلامات الحيوية بدون تلامس عبر rPPG',
        'الدرجة: <strong>A+ (ممتاز)</strong>',
        'نصف نهائي في <strong>Microsoft Imagine Cup 2023</strong>'
      ] : [
        'Graduation project: <a href="https://vitalismsolution.github.io/" target="_blank" rel="noopener"><strong>Vitalism Solution</strong></a> — contactless vital-sign estimation via rPPG',
        'Grade: <strong>A+ (Excellent)</strong>',
        'Semi-finalist in <strong>Microsoft Imagine Cup 2023</strong>'
      ],
      bscBadge: isArabic ? 'المعدل 3.53/4.00 · ممتاز' : 'GPA 3.53/4.00 · Excellent'
    },
    experience: {
      label: isArabic ? 'سيرتي المهنية' : 'Career Journey',
      title: isArabic ? 'خبرتي <span>المهنية</span>' : 'My <span>Professional</span> Experience',
      items: isArabic ? [
        { date: 'يوليو 2025 – سبتمبر 2025', role: 'مدرب في تعلم الآلة', org: 'المعهد القومي للاتصالات (NTI) — القاهرة، مصر', desc: ['قدّمت برنامجًا عمليًا في تعلم الآلة لمدة <strong>90 ساعة</strong> يغطي التعلم الخاضع للإشراف، PCA، والشبكات العصبية لطلاب الهندسة وعلوم الحاسوب.', 'صمّمت مشاريع وتقييمات عملية لتطبيقات تعلم الآلة في الواقع العملي.'] },
        { date: 'يونيو 2025 – يوليو 2025', role: 'متدرب في الذكاء الاصطناعي للأمن السيبراني', org: 'e&amp; Egypt (Etisalat) — عبر NTI OJT · القاهرة، مصر', desc: ['طبّقت أدوات أمن سيبراني تعتمد على الذكاء الاصطناعي لاستخبارات التهديدات، والتحقيقات الرقمية، وتحليل الأمان المؤسسي.', 'عملت عمليًا مع أدوات SOC، والتحقيقات في الذاكرة (Volatility)، وDLP، وأدوات اختبار الاختراق.'] },
        { date: 'فبراير 2024 – مارس 2025', role: 'مهندس أنظمة (الخدمة العسكرية)', org: 'الشركة الوطنية لبناء وتطوير الطرق — القاهرة، مصر', desc: ['دعّمت الأنظمة الخلفية للبنية التحتية الوطنية لجمع الرسوم التي تخدم <strong>أكثر من 50% من المركبات المصرية</strong> و<strong>أكثر من 70% من الطرق</strong>.', 'ساهمت في تطوير تطبيق سطح مكتب داخلي باستخدام <strong>C#, .NET, Entity Framework, SQL Server</strong> وCrystal Reports.'] },
        { date: '2020 – Present', role: 'مدرب إلكتروني — الذكاء الاصطناعي، الخوارزميات وعلوم البيانات', org: 'Udemy &amp; YouTube (Einstein Misr — أينشتاين مصر)', desc: ['علّمت <strong>أكثر من 10,000 متعلّم</strong> من خلال محتوى تقني بالعربية في الخوارزميات، الرياضيات المتقطعة، الاحتمالات، والتعلّم الآلي.', 'حققت <strong>أكثر من 700 ألف مشاهدة على يوتيوب</strong> من خلال دروس منظمة وحلول لمسائل عملية.'] },
        { date: 'يوليو 2023 – سبتمبر 2023', role: 'متدرب في تعلم الآلة', org: 'ITIDA / Egypt Makes Electronics — 200 ساعة', desc: ['أكملت برنامجًا مكثفًا لمدة 200 ساعة في تعلم الآلة يغطي التعلم الخاضع للإشراف وغير الخاضع للإشراف والشبكات العصبية وتقييم النماذج.'] }
      ] : [
        { date: 'Jul 2025 – Sep 2025', role: 'Machine Learning Instructor', org: 'National Telecommunication Institute (NTI) — Cairo, Egypt', desc: ['Delivered a 90-hour practical ML program covering supervised learning, PCA, and neural networks for engineering and computer science students.', 'Designed hands-on projects and assessments for practical machine learning applications.'] },
        { date: 'Jun 2025 – Jul 2025', role: 'AI in Cybersecurity Trainee', org: 'e&amp; Egypt (Etisalat) — via NTI OJT · Cairo, Egypt', desc: ['Applied AI-driven cybersecurity tools for threat intelligence, digital investigations, and enterprise security analytics.', 'Worked directly with SOC tools, memory forensics (Volatility), DLP, and penetration testing tools.'] },
        { date: 'Feb 2024 – Mar 2025', role: 'Systems Engineer (Military Service)', org: 'National Company for Roads and Bridges — Cairo, Egypt', desc: ['Supported the back-end systems of the national toll infrastructure that serves <strong>more than 50% of Egyptian vehicles</strong> and <strong>more than 70% of roads</strong>.', 'Contributed to an internal desktop application using <strong>C#, .NET, Entity Framework, SQL Server</strong> and Crystal Reports.'] },
        { date: '2020 – Present', role: 'Online Instructor — AI, Algorithms & Data Science', org: 'Udemy &amp; YouTube (Einstein Misr)', desc: ['Taught <strong>10,000+ learners</strong> through Arabic technical content in algorithms, discrete mathematics, probability, and machine learning.', 'Reached <strong>700K+ YouTube views</strong> through structured lessons and practical problem-solving.'] },
        { date: 'Jul 2023 – Sep 2023', role: 'Machine Learning Trainee', org: 'ITIDA / Egypt Makes Electronics — 200 hours', desc: ['Completed an intensive 200-hour ML program covering supervised and unsupervised learning, neural networks, and model evaluation.'] }
      ]
    },
    projects: {
      label: isArabic ? 'البحث والهندسة' : 'Research & Engineering',
      title: isArabic ? 'مشاريع <span>مختارة</span>' : 'Selected <span>Projects</span>',
      subtitle: isArabic ? 'أنظمة ذكاء اصطناعي شاملة تمتد من ضبط نماذج اللغات الكبيرة إلى التعلم غير الخاضع للإشراف والتعلم المعزز والنشر في البيئة الإنتاجية.' : 'End-to-end AI systems spanning LLM fine-tuning, self-supervised learning, reinforcement learning, and production deployment.'
    },
    skills: {
      label: isArabic ? 'الخبرة التقنية' : 'Technical Expertise',
      title: isArabic ? 'مهاراتي <span>التقنية</span>' : 'My <span>Technical</span> Skills',
      subtitle: isArabic ? 'تركّز على كامل سلاسل هندسة الذكاء الاصطناعي والتعلّم الآلي — من البحث إلى النشر الإنتاجي.' : 'Focused on the full AI/ML engineering pipeline — from research to production-grade deployment.'
    },
    teaching: {
      label: isArabic ? 'التعليم والمحتوى' : 'Education & Content',
      title: isArabic ? 'التدريس و<span>إنتاج المحتوى</span>' : 'Teaching & <span>Content Creation</span>',
      subtitle: isArabic ? 'أُهتم بجعل الذكاء الاصطناعي والتعلّم الآلي accessible للمتعلمين العرب منذ العام 2020 عبر Udemy وYouTube.' : 'I have been making AI and ML accessible to Arabic learners since 2020 through Udemy and YouTube.'
    },
    achievements: {
      label: isArabic ? 'الجوائز والتقدير' : 'Awards & Recognition',
      title: isArabic ? 'الإنجازات و<span>الجوائز</span>' : 'Achievements & <span>Awards</span>'
    },
    recommendations: {
      label: isArabic ? 'ما يقوله الناس' : 'What People Say',
      title: isArabic ? 'التوصيات' : 'Recommendations'
    },
    certifications: {
      label: isArabic ? 'المؤهلات' : 'Qualifications',
      title: isArabic ? 'الشهادات' : 'Certifications',
      subtitle: isArabic ? 'اضغط على أي شهادة لعرض الصورة كاملة.' : 'Click any certificate to view the full image.'
    },
    contact: {
      label: isArabic ? 'تواصل معي' : 'Get in Touch',
      title: isArabic ? 'لنبدأ <span>العمل معًا</span>' : 'Let\'s <span>Build Together</span>',
      subtitle: isArabic ? 'سواء كنت تبحث عن مهندس ذكاء اصطناعي للتوظيف، أو تريد التعاون في بحث علمي، أو مناقشة مشروع — سأكون سعيدًا بالاستماع إليك.' : 'Whether you are hiring an AI engineer, looking to collaborate on research, or discussing a project, I would be happy to connect.',
      cta: isArabic ? 'أرسل رسالة' : 'Send a Message'
    },
    footer: {
      copy: isArabic ? '© 2026 محمود عليوسيفي · مهندس الذكاء الاصطناعي وعلوم البيانات · القاهرة، مصر' : '© 2026 Mahmoud Alyosify · AI & Data Science Engineer · Cairo, Egypt'
    }
  };

  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = value;
  };

  setText('.nav__links a[href="#about"]', translations.nav.about);
  setText('.nav__links a[href="#experience"]', translations.nav.experience);
  setText('.nav__links a[href="#projects"]', translations.nav.projects);
  setText('.nav__links a[href="#skills"]', translations.nav.skills);
  setText('.nav__links a[href="#teaching"]', translations.nav.teaching);
  setText('.nav__links a[href="#achievements"]', translations.nav.achievements);
  setText('.nav__links a[href="#certifications"]', translations.nav.certifications);
  setText('.nav__links a[href="#contact"]', translations.nav.contact);
  setText('.nav__cta', `<i class="fas fa-paper-plane" aria-hidden="true"></i> ${translations.nav.cta}`);
  if (langToggle) {
    langToggle.textContent = translations.nav.toggle;
    langToggle.setAttribute('aria-label', isArabic ? 'Switch to English' : 'التبديل إلى العربية');
  }
  setText('.hero__badge', translations.hero.badge);
  setText('.hero__name', translations.hero.name);
  setText('.hero__summary', translations.hero.summary);
  setText('.hero__actions a[href="#projects"]', `<i class="fas fa-rocket" aria-hidden="true"></i> ${translations.hero.actions.projects}`);
  setText('.hero__actions a[href="Files/Mahmoud-Alyosify-ML-CV.pdf"]', `<i class="fas fa-file-pdf" aria-hidden="true"></i> ${translations.hero.actions.cv}`);
  document.querySelector('.hero__stats > div:nth-child(1) .hero__stat-label').innerHTML = translations.hero.stats.students;
  document.querySelector('.hero__stats > div:nth-child(2) .hero__stat-label').innerHTML = translations.hero.stats.views;
  document.querySelector('.hero__stats > div:nth-child(3) .hero__stat-label').innerHTML = translations.hero.stats.projects;
  document.querySelector('.hero__stats > div:nth-child(4) .hero__stat-label').innerHTML = translations.hero.stats.certs;
  setText('#about .section-label', translations.about.label);
  setText('#about .section-title', translations.about.title);
  setText('#about .about__text p:nth-of-type(1)', translations.about.p1);
  setText('#about .about__text p:nth-of-type(2)', translations.about.p2);
  setText('#about .about__text p:nth-of-type(3)', translations.about.p3);
  setText('#about .about__highlight-text', translations.about.highlight);
  document.querySelector('#about .about__fact:nth-child(1) .about__fact-label').innerHTML = translations.about.facts.study;
  document.querySelector('#about .about__fact:nth-child(1) .about__fact-value').innerHTML = translations.about.facts.studyValue;
  document.querySelector('#about .about__fact:nth-child(2) .about__fact-label').innerHTML = translations.about.facts.scholarship;
  document.querySelector('#about .about__fact:nth-child(2) .about__fact-value').innerHTML = translations.about.facts.scholarshipValue;
  document.querySelector('#about .about__fact:nth-child(3) .about__fact-label').innerHTML = translations.about.facts.degree;
  document.querySelector('#about .about__fact:nth-child(3) .about__fact-value').innerHTML = translations.about.facts.degreeValue;
  document.querySelector('#about .about__fact:nth-child(4) .about__fact-label').innerHTML = translations.about.facts.location;
  document.querySelector('#about .about__fact:nth-child(4) .about__fact-value').innerHTML = translations.about.facts.locationValue;
  document.querySelector('#about .about__fact:nth-child(5) .about__fact-label').innerHTML = translations.about.facts.languages;
  document.querySelector('#about .about__fact:nth-child(5) .about__fact-value').innerHTML = translations.about.facts.languagesValue;
  document.querySelector('#about .about__fact:nth-child(6) .about__fact-label').innerHTML = translations.about.facts.email;
  setText('#education .section-label', translations.education.label);
  setText('#education .section-title', translations.education.title);
  document.querySelector('#education .edu-card:nth-child(1) .edu-card__institution').innerHTML = translations.education.mscInstitution;
  document.querySelector('#education .edu-card:nth-child(1) .edu-card__degree').innerHTML = translations.education.mscDegree;
  document.querySelector('#education .edu-card:nth-child(1) .edu-card__meta').innerHTML = translations.education.mscMeta;
  document.querySelector('#education .edu-card:nth-child(1) .edu-card__detail').innerHTML = translations.education.mscDetails.map(item => `<li>${item}</li>`).join('');
  document.querySelector('#education .edu-card:nth-child(1) .edu-card__badge').innerHTML = `<i class="fas fa-award" aria-hidden="true"></i> ${translations.education.mscBadge}`;
  document.querySelector('#education .edu-card:nth-child(2) .edu-card__institution').innerHTML = translations.education.bscInstitution;
  document.querySelector('#education .edu-card:nth-child(2) .edu-card__degree').innerHTML = translations.education.bscDegree;
  document.querySelector('#education .edu-card:nth-child(2) .edu-card__meta').innerHTML = translations.education.bscMeta;
  document.querySelector('#education .edu-card:nth-child(2) .edu-card__detail').innerHTML = translations.education.bscDetails.map(item => `<li>${item}</li>`).join('');
  document.querySelector('#education .edu-card:nth-child(2) .edu-card__badge').innerHTML = `<i class="fas fa-star" aria-hidden="true"></i> ${translations.education.bscBadge}`;
  setText('#experience .section-label', translations.experience.label);
  setText('#experience .section-title', translations.experience.title);
  document.querySelectorAll('.timeline__item').forEach((item, index) => {
    const experienceItem = translations.experience.items[index];
    if (!experienceItem) return;
    item.querySelector('.timeline__date').textContent = experienceItem.date;
    item.querySelector('.timeline__role').textContent = experienceItem.role;
    const org = item.querySelector('.timeline__org');
    if (org) org.innerHTML = experienceItem.org;
    const desc = item.querySelector('.timeline__desc');
    if (desc) desc.innerHTML = experienceItem.desc.map(item => `<li>${item}</li>`).join('');
  });
  setText('#projects .section-label', translations.projects.label);
  setText('#projects .section-title', translations.projects.title);
  setText('#projects .section-subtitle', translations.projects.subtitle);
  setText('#skills .section-label', translations.skills.label);
  setText('#skills .section-title', translations.skills.title);
  setText('#skills .section-subtitle', translations.skills.subtitle);
  setText('#teaching .section-label', translations.teaching.label);
  setText('#teaching .section-title', translations.teaching.title);
  setText('#teaching .section-subtitle', translations.teaching.subtitle);
  setText('#achievements .section-label', translations.achievements.label);
  setText('#achievements .section-title', translations.achievements.title);
  setText('#recommendations .section-label', translations.recommendations.label);
  setText('#recommendations .section-title', translations.recommendations.title);
  setText('#certifications .section-label', translations.certifications.label);
  setText('#certifications .section-title', translations.certifications.title);
  setText('#certifications .section-subtitle', translations.certifications.subtitle);
  setText('#contact .section-label', translations.contact.label);
  setText('#contact .section-title', translations.contact.title);
  setText('#contact .section-subtitle', translations.contact.subtitle);
  setText('.footer__copy', translations.footer.copy);
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.setAttribute('aria-label', isArabic ? 'فتح/إغلاق القائمة' : 'Open/close menu');
  }
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightboxOverlay) {
    lightboxOverlay.setAttribute('aria-label', isArabic ? 'عارض الشهادات' : 'Certificate viewer');
  }
  if (lightboxClose) {
    lightboxClose.setAttribute('aria-label', isArabic ? 'إغلاق' : 'Close');
  }
  if (lightboxImg) {
    lightboxImg.alt = isArabic ? 'شهادة' : 'Certificate';
  }

  const projectCards = document.querySelectorAll('.project-card');
  const projectContent = isArabic ? [
    {
      name: 'Horus-OSINT — مساعد استخبارات تهديدات قائم على السحابة',
      period: 'مارس 2026 – أبريل 2026',
      desc: [
        'تم ضبط نموذج <strong>Meta-Llama-3-8B</strong> على <strong>159,826</strong> سجلًا من GTD/GDELT لمساعد استخبارات تهديدات OSINT.',
        'تم نشره على <strong>AWS</strong> كواجهة تفاعلية للاستعلام عن بيانات الإرهاب والأحداث العالمية.'
      ],
      tags: ['Llama-3-8B', 'ضبط النماذج', 'AWS', 'LLM', 'OSINT']
    },
    {
      name: 'SimCLR-Vision-SSL — تعلم مقارن بصري غير خاضع للإشراف',
      period: 'أبريل 2026 – يونيو 2026',
      desc: [
        'بنيت خط أنابيب بصريًا غير خاضع للإشراف باستخدام <strong>42 تجربة تحسين للزيادة</strong>، وإضافة <strong>SupCon</strong> شبه خاضعة للإشراف، وتكامل جاهز للنشر عبر <strong>ONNX/FAISS</strong>.',
        'حققنا دقة <strong>84.30% في أعلى نتيجة</strong> وتقييمًا للتمثيلات في مهام التصنيف والاسترجاع.'
      ],
      tags: ['PyTorch', 'SimCLR', 'ONNX', 'FAISS', '84.30% دقة']
    },
    {
      name: 'توفير الموارد السحابية بشكل مستقل عبر التعلم المعزز',
      period: 'مايو 2026 – يونيو 2026',
      desc: [
        'صممت بيئة <strong>Gymnasium</strong> مخصصة لقرارات التوسع التلقائي، وتدربت وكلاء <strong>PPO</strong> و<strong>DQN</strong> لتخصيص الموارد السحابية بشكل تكيفي.',
        'حسّنت التوازن بين <strong>تكلفة البنية التحتية</strong> و<strong>الزمن الاستجابة</strong> تحت ظروف الأحمال المتغيرة.'
      ],
      tags: ['PPO', 'DQN', 'Gymnasium', 'التعلّم المعزز']
    },
    {
      name: 'SCRAP — تقييم وتنبؤ خطر اصطدام الأقمار الصناعية',
      period: 'يناير 2026 – مارس 2026',
      desc: [
        'بنيت خط أنابيب تعلم آلي خاضع للإشراف للتنبؤ المبكر بخطر اصطدام الأقمار الصناعية باستخدام بيانات الاقتران المتاحة قبل <strong>48+ ساعة</strong> من أقرب اقتراب.',
        'يتناسب مع نوافذ القرار التشغيلية الحرجة في مجال سلامة الفضاء.'
      ],
      tags: ['Scikit-learn', 'تعلّم آلي تطبيقي', 'سلامة الفضاء']
    },
    {
      name: 'وكيل متعدد الوسائط الآلي — من PDF إلى عرض تقديمي مصحوب بالتعليق الصوتي',
      period: 'يناير 2026 – مارس 2026',
      desc: [
        'صممت سير عمل متعدد الوسائط آليًا لتحويل ملفات PDF إلى عروض تقديمية PowerPoint مع تعليق صوتي.',
        'يربط استخراج المحتوى، وتوليد الشرائح، و<strong>التعليق الصوتي</strong> بشكل كامل عبر الذكاء الاصطناعي الوكيل.',
        '<strong>تم عرضه في منتدى جامعة كوينز للتعليم والتعلّم بالذكاء الاصطناعي 2026.</strong>'
      ],
      tags: ['الذكاء الاصطناعي التوليدي', 'الذكاء الاصطناعي الوكيل', 'متعدد الوسائط', 'مؤتمر']
    },
    {
      name: 'تحليل الجهد في المراجعات: طلبات السحب البشرية مقابل الوكلائية',
      period: 'مارس 2026 – مايو 2026',
      desc: [
        'بنيت خط أنابيب تحليليًا قابلاً للتكرار لمقارنة الجهود في مراجعات طلبات السحب التي أنشأها وكلاء الذكاء الاصطناعي مقابل تلك التي أنشأها أشخاص عبر مستودعات GitHub مفتوحة المصدر واسعة النطاق.',
        'بحث في هندسة البرمجيات التجريبية باستخدام تعدين GitHub والتحليل.'
      ],
      tags: ['تحليلات GitHub', 'تعدين البيانات', 'هندسة برمجيات تجريبية']
    },
    {
      name: 'AudioShield — كشف الصوت المزيف العميق',
      period: '2025',
      desc: [
        'نظام كشف صوت مزيف عميق مبني على <strong>CNN</strong>.',
        'تم نشره باستخدام واجهة ويب <strong>Streamlit</strong> للاستدلال في الوقت الفعلي.'
      ],
      tags: ['CNN', 'ذكاء اصطناعي للصوت', 'Streamlit', 'كشف التزييف الصوتي']
    },
    {
      name: 'Vitalism Solution — تقدير العلامات الحيوية بدون تلامس',
      period: '2023 · مشروع التخرج',
      desc: [
        'تقدير مؤشرات حيوية (معدل ضربات القلب، SpO₂) مباشرة من الفيديو بدون تلامس باستخدام <strong>rPPG</strong> والتصفية الموجية.',
        '<strong>الدرجة: A+</strong> · نصف نهائي في <strong>Microsoft Imagine Cup 2023</strong>.'
      ],
      tags: ['رؤية الحاسوب', 'rPPG', 'OpenCV', 'درجة A+']
    }
  ] : [
    {
      name: 'Horus-OSINT — Cloud-Based Threat Intelligence Assistant',
      period: 'Mar 2026 – Apr 2026',
      desc: [
        'Fine-tuned <strong>Meta-Llama-3-8B</strong> on <strong>159,826</strong> GTD/GDELT records for an OSINT threat intelligence assistant.',
        'Deployed on <strong>AWS</strong> as an interactive application for querying global terrorism and event intelligence data.'
      ],
      tags: ['Llama-3-8B', 'Fine-Tuning', 'AWS', 'LLM', 'OSINT']
    },
    {
      name: 'SimCLR-Vision-SSL — Self-Supervised Contrastive Learning',
      period: 'Apr 2026 – Jun 2026',
      desc: [
        'Built a self-supervised vision pipeline with a <strong>42-experiment augmentation sweep</strong>, a semi-supervised <strong>SupCon</strong> extension, and deployment-ready <strong>ONNX/FAISS</strong> integration.',
        'Achieved <strong>84.30% top-1 accuracy</strong> and evaluated representations for classification and retrieval tasks.'
      ],
      tags: ['PyTorch', 'SimCLR', 'ONNX', 'FAISS', '84.30% acc.']
    },
    {
      name: 'Autonomous Cloud Resource Provisioning via Reinforcement Learning',
      period: 'May 2026 – Jun 2026',
      desc: [
        'Designed a custom <strong>Gymnasium</strong> environment for autoscaling decisions and trained <strong>PPO</strong> and <strong>DQN</strong> agents for adaptive cloud resource allocation.',
        'Optimized the trade-off between <strong>infrastructure cost</strong> and <strong>latency</strong> under changing workload conditions.'
      ],
      tags: ['PPO', 'DQN', 'Gymnasium', 'Reinforcement Learning']
    },
    {
      name: 'SCRAP — Satellite Collision Risk Assessment & Prediction',
      period: 'Jan 2026 – Mar 2026',
      desc: [
        'Built a supervised ML pipeline for early satellite collision risk prediction using conjunction data available <strong>48+ hours</strong> before closest approach.',
        'Matches time-critical operational decision windows for space safety.'
      ],
      tags: ['Scikit-learn', 'Applied ML', 'Space Safety']
    },
    {
      name: 'Automated Multimodal Agent — PDF to Narrated PowerPoint',
      period: 'Jan 2026 – Mar 2026',
      desc: [
        'Engineered an autonomous multimodal workflow converting PDFs into narrated PowerPoint presentations.',
        'Coordinates content extraction, slide generation, and <strong>audio narration</strong> end-to-end via agentic AI.',
        '<strong>Presented at Queen\'s University AI Teaching & Learning Forum 2026.</strong>'
      ],
      tags: ['Generative AI', 'Agentic AI', 'Multimodal', 'Conference']
    },
    {
      name: 'Analyzing Review Effort: Human vs. Agentic Pull Requests',
      period: 'Mar 2026 – May 2026',
      desc: [
        'Built a reproducible analytics pipeline to compare review effort in agent-generated vs. human-authored pull requests across large-scale open-source GitHub repositories.',
        'Empirical software engineering research using GitHub mining and data analysis.'
      ],
      tags: ['GitHub Analytics', 'Data Mining', 'Empirical SE']
    },
    {
      name: 'AudioShield — Deepfake Audio Detection',
      period: '2025',
      desc: [
        '<strong>CNN-based</strong> deepfake audio detection system.',
        'Deployed with a <strong>Streamlit</strong> web interface for real-time inference.'
      ],
      tags: ['CNN', 'Audio AI', 'Streamlit', 'Deepfake Detection']
    },
    {
      name: 'Vitalism Solution — Contactless Vital Signs Estimation',
      period: '2023 · Graduation Project',
      desc: [
        'Real-time contactless vital sign (heart rate, SpO₂) estimation from video using <strong>rPPG</strong> and wavelet filtering.',
        '<strong>Grade: A+</strong> · Semi-Finalist, <strong>Microsoft Imagine Cup 2023</strong>.'
      ],
      tags: ['Computer Vision', 'rPPG', 'OpenCV', 'A+ Grade']
    }
  ];
  projectCards.forEach((card, index) => {
    const content = projectContent[index];
    if (!content) return;
    card.querySelector('.project-card__name').innerHTML = content.name;
    card.querySelector('.project-card__period').textContent = content.period;
    const desc = card.querySelector('.project-card__desc');
    if (desc) desc.innerHTML = content.desc.map(item => `<li>${item}</li>`).join('');
    const tags = card.querySelectorAll('.project-card__tags .tag, .project-card__tags .tag--violet, .project-card__tags .tag--green, .project-card__tags .tag--amber');
    tags.forEach((tag, tagIndex) => {
      tag.textContent = content.tags[tagIndex] || tag.textContent;
    });
  });

  const skillCards = document.querySelectorAll('.skill-card');
  const skillContent = isArabic ? [
    { title: 'الذكاء الاصطناعي / نماذج اللغات', tags: ['LLMs', 'Fine-Tuning (LoRA/QLoRA)', 'RAG', 'Transformers', 'Hugging Face', 'LangChain', 'Prompt Engineering', 'Multi-Agent Systems'] },
    { title: 'التعلّم الآلي / التعلم العميق', tags: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'XGBoost', 'LightGBM', 'CNNs', 'Computer Vision', 'NLP', 'SHAP', 'Optuna'] },
    { title: 'البيانات / MLOps', tags: ['Pandas', 'NumPy', 'PySpark', 'ETL Pipelines', 'Feature Engineering', 'Docker', 'CI/CD', 'AWS'] },
    { title: 'الخلفية / النشر', tags: ['FastAPI', 'Streamlit', 'FAISS', 'ChromaDB', 'ONNX', 'MySQL', 'MongoDB'] },
    { title: 'البرمجة', tags: ['Python', 'C++', 'C', 'Go', 'JavaScript', 'C#', 'MATLAB', 'Linux', 'Git/GitHub'] }
  ] : [
    { title: 'AI / LLMs', tags: ['LLMs', 'Fine-Tuning (LoRA/QLoRA)', 'RAG', 'Transformers', 'Hugging Face', 'LangChain', 'Prompt Engineering', 'Multi-Agent Systems'] },
    { title: 'ML / Deep Learning', tags: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'XGBoost', 'LightGBM', 'CNNs', 'Computer Vision', 'NLP', 'SHAP', 'Optuna'] },
    { title: 'Data / MLOps', tags: ['Pandas', 'NumPy', 'PySpark', 'ETL Pipelines', 'Feature Engineering', 'Docker', 'CI/CD', 'AWS'] },
    { title: 'Backend / Deployment', tags: ['FastAPI', 'Streamlit', 'FAISS', 'ChromaDB', 'ONNX', 'MySQL', 'MongoDB'] },
    { title: 'Programming', tags: ['Python', 'C++', 'C', 'Go', 'JavaScript', 'C#', 'MATLAB', 'Linux', 'Git/GitHub'] }
  ];
  skillCards.forEach((card, index) => {
    const content = skillContent[index];
    if (!content) return;
    const title = card.querySelector('.skill-card__title');
    if (title) title.textContent = content.title;
    const tags = card.querySelectorAll('.skill-card__tags .tag, .skill-card__tags .tag--violet, .skill-card__tags .tag--green, .skill-card__tags .tag--amber');
    tags.forEach((tag, tagIndex) => {
      tag.textContent = content.tags[tagIndex] || tag.textContent;
    });
  });

  const teachingCards = document.querySelectorAll('.teaching-platform');
  const teachingContent = isArabic ? [
    { name: 'Einstein Misr — أينشتاين مصر', desc: 'قناة تعليمية عربية تغطي الخوارزميات، هياكل البيانات، الرياضيات المتقطعة، الاحتمالات والإحصاء، والتعلّم الآلي.', stat: '700K+', label: 'إجمالي المشاهدات' },
    { name: 'مدرس على Udemy', desc: 'نشر دورات بالعربية في مواضيع أساسية في علوم الحاسوب والذكاء الاصطناعي لمساعدة الطلاب العرب على التفوق في المجالات التنافسية.', stat: '10,000+', label: 'إجمالي الطلاب' }
  ] : [
    { name: 'Einstein Misr', desc: 'An Arabic educational channel covering algorithms, data structures, discrete math, probability & statistics, and machine learning.', stat: '700K+', label: 'Total views' },
    { name: 'Udemy Instructor', desc: 'Publishing Arabic courses on core computer science and AI topics to help learners excel in competitive fields.', stat: '10,000+', label: 'Total students' }
  ];
  teachingCards.forEach((card, index) => {
    const content = teachingContent[index];
    if (!content) return;
    const name = card.querySelector('.teaching-platform__name');
    if (name) name.textContent = content.name;
    const desc = card.querySelector('.teaching-platform__desc');
    if (desc) desc.textContent = content.desc;
    const stat = card.querySelector('.teaching-platform__stat');
    if (stat) stat.textContent = content.stat;
    const label = card.querySelector('.teaching-platform__label');
    if (label) label.textContent = content.label;
  });

  const achievements = document.querySelectorAll('.achievement-card');
  const achievementContent = isArabic ? [
    { title: 'المركز الأول — Smart Cities Hackathon 2022', subtitle: 'يناير – مارس 2022 · جامعة بنها', desc: 'فزت بالمركز الأول على المستوى الوطني بين <strong>77 فريقًا</strong> من جامعات مصرية حكومية وخاصة ووطنيّة. وقد نظمت الفعالية بالشراكة مع AWS وElsewedy Digital وOrange Egypt وNBE.' },
    { title: 'نصف نهائي — Microsoft Imagine Cup 2023', subtitle: 'مسابقة عالمية · مشروع Vitalism Solution', desc: 'تأهلت إلى نصف النهائي العالمي مع مشروع Vitalism Solution — وهو نظام ذكاء اصطناعي لتقدير العلامات الحيوية بدون تلامس عبر rPPG. وحصل المشروع على <strong>درجة A+</strong> في جامعة أسيوط.' },
    { title: 'جائزة الطالب المثالي 2022–2023', subtitle: 'كلية الحاسبات والمعلومات، جامعة أسيوط', desc: 'حصلت على هذه الجائزة بسبب التفوق الأكاديمي والمساهمة المتميزة في الحياة الأكاديمية والمجتمع الجامعي.' },
    { title: 'المركز الأول — مسابقة المحتوى العلمي والتقني 2021–2022', subtitle: 'على مستوى الجامعة · فريق White Hackers', desc: 'فزت بالمركز الأول في إنشاء محتوى تعليمي علمي وتقني متميز على مستوى الجامعة.' },
    { title: 'أمين — لجنة العلوم والتكنولوجيا العليا', subtitle: 'اتحاد طلاب جامعة أسيوط · 2021 – 2022', desc: 'قاد لجنة العلوم العليا في اتحاد طلاب جامعة أسيوط لعام 2022.' }
  ] : [
    { title: 'First Place — Smart Cities Hackathon 2022', subtitle: 'Jan – Mar 2022 · Benha University', desc: 'Won first place nationally among <strong>77 teams</strong> from public, private, and governmental Egyptian universities. The event was organized with AWS, Elsewedy Digital, Orange Egypt, and NBE.' },
    { title: 'Semi-Finalist — Microsoft Imagine Cup 2023', subtitle: 'Global competition · Vitalism Solution', desc: 'Qualified for the global semi-finals with Vitalism Solution — an AI system for contactless vital-sign estimation using rPPG. The project earned <strong>A+</strong> at Assiut University.' },
    { title: 'Ideal Student Award 2022–2023', subtitle: 'Faculty of Computers and Information, Assiut University', desc: 'Received this award for academic excellence and outstanding contribution to university life.' },
    { title: 'First Place — Scientific and Technical Content Competition 2021–2022', subtitle: 'University-wide · White Hackers Team', desc: 'Won first place for producing outstanding scientific and technical educational content at the university level.' },
    { title: 'Secretary — Higher Science and Technology Committee', subtitle: 'Assiut University Student Union · 2021 – 2022', desc: 'Led the higher science committee in the Assiut University Student Union in 2022.' }
  ];
  achievements.forEach((card, index) => {
    const content = achievementContent[index];
    if (!content) return;
    const title = card.querySelector('.achievement-card__title');
    if (title) title.innerHTML = content.title;
    const subtitle = card.querySelector('.achievement-card__subtitle');
    if (subtitle) subtitle.textContent = content.subtitle;
    const desc = card.querySelector('.achievement-card__desc');
    if (desc) desc.innerHTML = content.desc;
  });

  const recommendations = document.querySelectorAll('.rec-card');
  const recommendationContent = isArabic ? [
    { text: 'كان لي شرف تدريس محمود في مساق الذكاء الاصطناعي التوليدي، وأنا أوصي به بشدة لأي فرصة في مجال الذكاء الاصطناعي والتقنيات. كان محمود طالبًا نشطًا ومشاركًا للغاية، وأظهر فضولًا ومبادرة مستمرين. وقد تميزت قدرته على ربط الأفكار النظرية بالتنفيذ العملي طوال المساق. لديه شغف واضح بالتعلّم والابتكار، وأنا واثق من أنه سيواصل التفوق في أي بيئة أكاديمية أو مهنية.', name: 'Rahatara Ferdousi, PhD', role: 'دكتور الذكاء الاصطناعي التطبيقي · أستاذ الذكاء الاصطناعي التوليدي لدى محمود' },
    { text: 'أعرف محمود من زوايا عديدة؛ كان من أفضل الطلاب في كلية الحاسبات والمعلومات. كان طالبًا متميزًا، ملتزمًا بحضور المحاضرات في الوقت المحدد، وطرح كثير من الأسئلة المهمة، وتميز بالابتكار في مشاريعه. أظهر قدرة رائعة على استيعاب التقنيات الجديدة بسرعة، وسلوكًا ممتازًا في إدارة الوقت أثناء العمل مع زملائه بشكل سلس.', name: 'Dr. Ibrahim Elsemman', role: 'أستاذ مساعد، نظم المعلومات — جامعة أسيوط' },
    { text: 'أظهر محمود معرفة تقنية رائعة وطريقة منهجية في معالجة المشكلات.', name: 'Dr. Islam Taj-Eddin', role: 'أستاذ مساعد، قسم تقنية المعلومات — جامعة أسيوط' },
    { text: 'أوصي محمود بشدة لأي منصب قيادي أو مسار مهني مستقبلي. أظهر باستمرار صفات قيادية قوية، وتواصلًا فعالًا، وتحديدًا واضحًا للأهداف، وقد شجّع الفريق كله. كانت مهاراته المتميزة في حل المشكلات وقدرته على التفكير النقدي عاملين حاسمين في تجاوز العقبات وتحقيق نجاح المشاريع. وأنا واثق من أنه سيواصل التفوق في أي دور يتولاه.', name: 'Nada Essam', role: 'معيدة تدريس في E-JUST' },
    { text: 'يسعدني أن أوصي بمحمود. خلال أربع سنوات قضيناها في كلية الحاسبات والمعلومات، لاحظت اجتهاده الدؤوب وسعيه المستمر لتطوير المهارات باستخدام أساليب إبداعية لحل المشكلات. بصفته قائدًا، تتألق صفاته الاستثنائية في إدارة الفرق بفعالية وخلق بيئة عمل إيجابية. تمنحه رؤيته الفريدة القدرة على مواجهة التحديات بسرعة وإيجاد حلول فعّالة للمشكلات التقنية المعقدة.', name: 'Mina Nashat', role: 'مهندس البيانات والتحليلات في Ejada | مطور Python' },
    { text: 'محمود شخص متميز في العمل الجماعي. يضيف أفكارًا جديدة وفريدة إلى أي فريق يشارك فيه. شاركنا في مسابقة Smart Cities Hackathon وحققنا المركز الأول — وهذا يُعزى إلى قيادته والفهم الذي يُميز الفريق. أتمنى له التوفيق في المستقبل.', name: 'Nourhan Ahmed', role: 'معيد تدريس في GIU | مطور الواجهة الخلفية' }
  ] : [
    { text: 'I had the pleasure of teaching Mahmoud in my Generative AI course, and I highly recommend him for any opportunity in the AI and technology space. Mahmoud was an exceptionally active and engaged student who consistently demonstrated strong curiosity and initiative. His ability to connect theoretical ideas with practical implementation stood out throughout the course. He has a clear passion for learning and innovation, and I am confident he will continue to excel in any academic or professional setting.', name: 'Rahatara Ferdousi, PhD', role: 'Doctor of Applied AI · Mahmoud\'s Generative AI Professor' },
    { text: 'I know Mahmoud from many points of view; he was one of the ideal students at the College of Computers and Information. He was a distinguished student, committed to attending all lectures on time, asking many important questions, and characterized by innovation in his projects. He exhibited a remarkable ability to quickly grasp new techniques and demonstrated impeccable time management skills while working seamlessly with his team members.', name: 'Dr. Ibrahim Elsemman', role: 'Assistant Professor, Information Systems — Assiut University' },
    { text: 'Mahmoud showed a tremendous technical knowledge and systematic way of approaching problems.', name: 'Dr. Islam Taj-Eddin', role: 'Assistant Professor, IT Department — Assiut University' },
    { text: 'I wholeheartedly recommend Mahmoud for any future leadership positions or professional endeavors. He consistently exhibited strong leadership qualities, effective communication, clear goal-setting, and motivated the entire team. His remarkable problem-solving skills and ability to think critically were instrumental in overcoming obstacles and achieving project success. I am confident he will continue to excel in any position he undertakes.', name: 'Nada Essam', role: 'Teaching Assistant at E-JUST' },
    { text: 'I am pleased to recommend Mahmoud. Throughout our four years at the Faculty of Computers and Information, I observed his unwavering diligence and consistent efforts to develop skills with creative problem-solving methods. As a leader, his exceptional qualities shine in effective team management and fostering a positive work environment. His unique perspective enables him to swiftly address challenges and devise effective solutions to complex technical problems.', name: 'Mina Nashat', role: 'Data & Analytics Engineer @ Ejada | Python Developer' },
    { text: 'Mahmoud is a distinguished person in teamwork. He adds new and unique ideas to any team he participates in. We participated in the Smart Cities Hackathon and got first place — this is due to his leadership and the understanding that characterizes the team. I wish him success in the future.', name: 'Nourhan Ahmed', role: 'Teaching Assistant at GIU | BackEnd Developer' }
  ];
  recommendations.forEach((card, index) => {
    const content = recommendationContent[index];
    if (!content) return;
    const text = card.querySelector('.rec-card__text');
    if (text) text.textContent = content.text;
    const name = card.querySelector('.rec-card__name');
    if (name) name.textContent = content.name;
    const role = card.querySelector('.rec-card__role');
    if (role) role.textContent = content.role;
  });

  document.title = isArabic ? 'محمود عليوسيفي | مهندس الذكاء الاصطناعي وعلوم البيانات | ماجستير ذكاء اصطناعي في جامعة كوينز' : 'Mahmoud Alyosify | AI & Data Science Engineer | MSc AI @ Queen\'s University';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', isArabic ? 'محمود عليوسيفي — مهندس ذكاء اصطناعي وعلوم بيانات، باحث ماجستير في الذكاء الاصطناعي بجامعة كوينز بكندا، ومهندس ذكاء اصطناعي توليدي ومُعلّم.' : 'Mahmoud Alyosify — AI & Data Science Engineer, MSc AI student at Queen\'s University, Canada, generative AI engineer, and educator.');
  renderCerts();
}

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

if (langToggle) {
  langToggle.addEventListener('click', () => {
    setLanguage(currentLanguage === 'en' ? 'ar' : 'en');
    initTypewriter();
  });
}

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
function getCertificates() {
  return currentLanguage === 'ar' ? [
    { file: "IMG_4014.JPG",  name: "AWS Academy — هندسة البيانات", issuer: "Amazon Web Services", year: "2026" },
    { file: "IMG_0340.JPG",  name: "AWS Academy — تعلم الآلة للغة الطبيعية", issuer: "Amazon Web Services", year: "2025" },
    { file: "IMG_4832.JPG",  name: "AWS Academy — أساسيات تعلم الآلة", issuer: "Amazon Web Services", year: "2025" },
    { file: "Annotation 2020-07-04 231855.jpg", name: "تخصص تعلم الآلة", issuer: "Coursera / DeepLearning.AI", year: "2020" },
    { file: "IMG_0600.JPG",  name: "HCIP — الذكاء الاصطناعي (Huawei Certified ICT Professional)", issuer: "Huawei" },
    { file: "IMG_1602.JPG",  name: "Microsoft Certified: Data Analyst Associate", issuer: "Microsoft / Power BI" },
    { file: "IMG_2648.jpg",  name: "الذكاء الاصطناعي التوليدي والهندسة الموجهة بالوعد", issuer: "IBM / Coursera" },
    { file: "IMG_3992.JPG",  name: "الذكاء الاصطناعي التوليدي: تعزيز مسارك في الأمن السيبراني", issuer: "IBM" },
    { file: "AI in Cybersecurity.png", name: "الذكاء الاصطناعي في الأمن السيبراني (420 ساعة)", issuer: "NTI", year: "2025" },
    { file: "IMG_3993.JPG",  name: "تدريب تعلم الآلة (200 ساعة)", issuer: "ITIDA / Egypt Makes Electronics", year: "2023" },
    { file: "IMG_3994.JPG",  name: "تطوير ويب كامل (.NET و Angular)", issuer: "Route Academy" },
    { file: "IMG_6131.JPG",  name: "تحليل البيانات باستخدام R (36 ساعة)", issuer: "Children's Cancer Hospital 57357", year: "2021" },
    { file: "IMG_7887.JPG",  name: "شهادة التميز — Vitalism", issuer: "Air Defense College (ISEIC)", year: "2023" },
    { file: "IMG_9390.JPG",  name: "المركز الأول — مسابقة الطالب المثالي", issuer: "Assiut University", year: "2023" },
    { file: "iti 1.JPG",     name: "مقدمة إلى UI/UX (60 ساعة)", issuer: "ITI", year: "2023" },
    { file: "iti 2.JPG",     name: "مقدمة إلى SQL Server و C# (90 ساعة)", issuer: "ITI", year: "2022" },
    { file: "iti 3.JPG",     name: "مقدمة إلى تطوير Mearn Stack (60 ساعة)", issuer: "ITI", year: "2022" },
    { file: "iti 4.JPG",     name: "تطوير الويب باستخدام .NET (120 ساعة)", issuer: "ITI", year: "2022" },
    { file: "iti 5.JPG",     name: "تطوير تطبيقات Android (30 ساعة)", issuer: "ITI", year: "2022" },
    { file: "Screenshot 2025-02-13 023245.png", name: "Fortinet Certified Associate in Cybersecurity", issuer: "Fortinet", year: "2025" },
  ] : [
    { file: "IMG_4014.JPG",  name: "AWS Academy — Data Engineering", issuer: "Amazon Web Services", year: "2026" },
    { file: "IMG_0340.JPG",  name: "AWS Academy — Machine Learning for NLP", issuer: "Amazon Web Services", year: "2025" },
    { file: "IMG_4832.JPG",  name: "AWS Academy — ML Foundations", issuer: "Amazon Web Services", year: "2025" },
    { file: "Annotation 2020-07-04 231855.jpg", name: "Machine Learning Specialization", issuer: "Coursera / DeepLearning.AI", year: "2020" },
    { file: "IMG_0600.JPG",  name: "HCIP — AI (Huawei Certified ICT Professional)", issuer: "Huawei" },
    { file: "IMG_1602.JPG",  name: "Microsoft Certified: Data Analyst Associate", issuer: "Microsoft / Power BI" },
    { file: "IMG_2648.jpg",  name: "Generative AI & Prompt Engineering", issuer: "IBM / Coursera" },
    { file: "IMG_3992.JPG",  name: "Generative AI: Boost Your Cybersecurity Career", issuer: "IBM" },
    { file: "AI in Cybersecurity.png", name: "AI in Cybersecurity (420 hrs)", issuer: "NTI", year: "2025" },
    { file: "IMG_3993.JPG",  name: "Machine Learning Internship (200 hrs)", issuer: "ITIDA / Egypt Makes Electronics", year: "2023" },
    { file: "IMG_3994.JPG",  name: "Full Stack Development (.NET & Angular)", issuer: "Route Academy" },
    { file: "IMG_6131.JPG",  name: "Data-analysis using R (36 hrs)", issuer: "Children's Cancer Hospital 57357", year: "2021" },
    { file: "IMG_7887.JPG",  name: "Certificate of Excellence - Vitalism", issuer: "Air Defense College (ISEIC)", year: "2023" },
    { file: "IMG_9390.JPG",  name: "First Place - Ideal Student Competition", issuer: "Assiut University", year: "2023" },
    { file: "iti 1.JPG",     name: "Intro to UI/UX (60 hrs)", issuer: "ITI", year: "2023" },
    { file: "iti 2.JPG",     name: "Intro to SQL Server & C# (90 hrs)", issuer: "ITI", year: "2022" },
    { file: "iti 3.JPG",     name: "Intro to Mearn Stack Development (60 hrs)", issuer: "ITI", year: "2022" },
    { file: "iti 4.JPG",     name: ".NET Web Development (120 hrs)", issuer: "ITI", year: "2022" },
    { file: "iti 5.JPG",     name: "Android Mobile Development (30 hrs)", issuer: "ITI", year: "2022" },
    { file: "Screenshot 2025-02-13 023245.png", name: "Fortinet Certified Associate in Cybersecurity", issuer: "Fortinet", year: "2025" },
  ];
}

function renderCerts() {
  const grid = document.getElementById('certs-grid');
  if (!grid) return;
  const certificates = getCertificates();
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
  const words = currentLanguage === 'ar' ? [
    'مهندس الذكاء الاصطناعي وعلوم البيانات',
    'مُنشئ أنظمة LLM',
    'باحث ماجستير في الذكاء الاصطناعي',
    'مهندس ذكاء اصطناعي توليدي',
    'مُعلّم تعلم آلي — أكثر من 10 آلاف طالب',
  ] : [
    'AI & Data Science Engineer',
    'LLM Systems Builder',
    'MSc AI Researcher',
    'Generative AI Engineer',
    'ML Educator — 10K+ Learners',
  ];
  let wordIndex = 0, charIndex = 0, isDeleting = false;
  clearTimeout(window.typewriterTimer);

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
    window.typewriterTimer = setTimeout(type, delay);
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
  setLanguage(currentLanguage);
  initTypewriter();
  updateActiveNav();
});
