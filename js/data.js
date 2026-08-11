/* ============================================================
   Mahmoud Alyosify — Content source of truth
   Every text field is { en, ar }. Sections render from here.
   ============================================================ */

const SITE = {

  /* ── Identity ───────────────────────────────────────────── */
  person: {
    name: 'Mahmoud Alyosify',
    nameAr: 'محمود اليوسفي',
    aliasAr: 'محمود سيد يوسف',
    role: {
      en: 'AI & Machine Learning Engineer',
      ar: 'مهندس ذكاء اصطناعي وتعلّم آلي'
    },
    roles: {
      en: ['LLM Systems Engineer', 'Multi-Agent Architect', 'MSc AI · Queen\'s University', 'Instructor to 10,000+'],
      ar: ['مهندس أنظمة نماذج لغوية', 'مهندس أنظمة متعددة الوكلاء', 'ماجستير ذكاء اصطناعي · جامعة كوينز', 'مُعلّم لأكثر من 10,000 متعلّم']
    },
    location: { en: 'New Cairo, Egypt · Open to relocation', ar: 'القاهرة الجديدة، مصر · منفتح على الانتقال' },
    photo: 'img/img-mahmoud- april 2026.PNG',
    hero: 'img/FatFooter-En.png',
    email: 'mahmoud.alyosify@gmail.com',
    emailAcademic: 'mahmoud.alyosify@queensu.ca',
    phone: '+20 114 555 7959'
  },

  links: {
    linkedin:    'https://linkedin.com/in/mahmoudalyosify',
    github:      'https://github.com/MahmoudAlyosify',
    huggingface: 'https://huggingface.co/mahmoudalyosify',
    kaggle:      'https://kaggle.com/mahmoudalyosify',
    youtube:     'https://www.youtube.com/@EinshtenMisr',
    udemy:       'https://www.udemy.com/user/mahmoud-sayed-youssef-kotb-2/',
    medium:      'https://medium.com/@mahmoudalyosify',
    x:           'https://x.com/MahmoudAlyosify',
    whatsapp:    'https://wa.me/+201145557959',
    cv:          'Files/Mahmoud-Alyosify-ML-CV.pdf',
    site:        'https://mahmoudalyosifysite.github.io/'
  },

  /* ── Hero stats ─────────────────────────────────────────── */
  stats: [
    { value: 10000, suffix: '+', label: { en: 'Learners taught',    ar: 'متعلّم' } },
    { value: 700,   suffix: 'K+', label: { en: 'YouTube views',     ar: 'مشاهدة على يوتيوب' } },
    { value: 12,    suffix: '+',  label: { en: 'AI systems shipped', ar: 'نظام ذكاء اصطناعي' } },
    { value: 20,    suffix: '+',  label: { en: 'Certifications',     ar: 'شهادة معتمدة' } }
  ],

  /* ── About ──────────────────────────────────────────────── */
  about: {
    lead: {
      en: 'I build end-to-end intelligent systems — from LLM fine-tuning and decoding-time inference optimisation to multi-agent OSINT platforms and deep reinforcement learning for cloud autoscaling.',
      ar: 'أبني أنظمة ذكية متكاملة — من ضبط النماذج اللغوية وتحسين الاستدلال وقت فك التشفير، إلى منصات استخبارات مفتوحة المصدر متعددة الوكلاء، والتعلّم المعزز العميق للتوسّع السحابي.'
    },
    body: {
      en: 'I am completing an MSc in Artificial Intelligence at Queen\'s University, Canada on a Digilians Presidential Scholarship, with a master\'s research project on training-free, decoding-time efficiency for large language models. Along the way I have delivered production-oriented systems on AWS spanning autonomous threat intelligence, retrieval-ready vision pipelines, deep-RL cloud autoscaling, and satellite collision risk prediction — and taught more than 10,000 learners in Arabic across 700K+ views.',
      ar: 'أُكمل حاليًا ماجستير الذكاء الاصطناعي في جامعة كوينز بكندا بمنحة Digilians الرئاسية، ومشروعي البحثي عن كفاءة النماذج اللغوية وقت فك التشفير دون إعادة تدريب. وعلى الطريق سلّمت أنظمة جاهزة للإنتاج على AWS تشمل استخبارات التهديدات الذاتية، وسلاسل رؤية حاسوبية جاهزة للاسترجاع، وتوسّعًا سحابيًا بالتعلّم المعزز، والتنبؤ بمخاطر تصادم الأقمار الصناعية — ودرّست أكثر من 10,000 متعلّم بالعربية بأكثر من 700 ألف مشاهدة.'
    },
    facts: [
      { icon: '🎓', k: { en: 'MSc Artificial Intelligence', ar: 'ماجستير الذكاء الاصطناعي' },   v: { en: 'Queen\'s University, Canada — Presidential Scholarship', ar: 'جامعة كوينز، كندا — منحة رئاسية' } },
      { icon: '🧬', k: { en: 'BSc Computer & Information Science', ar: 'بكالوريوس علوم الحاسب والمعلومات' }, v: { en: 'Bioinformatics, Assiut University — GPA 3.53 / 4.00', ar: 'المعلوماتية الحيوية، جامعة أسيوط — معدل 3.53 / 4.00' } },
      { icon: '🔬', k: { en: 'Research focus', ar: 'محور البحث' },                              v: { en: 'Token-efficient LLM inference · Verbosity-aware decoding', ar: 'استدلال موفّر للتوكنات · فك تشفير واعٍ بالإسهاب' } },
      { icon: '🌍', k: { en: 'Languages', ar: 'اللغات' },                                        v: { en: 'Arabic (native) · English (professional working)', ar: 'العربية (اللغة الأم) · الإنجليزية (احترافية)' } }
    ]
  },

  /* ── Experience timeline ────────────────────────────────── */
  experience: [
    {
      date: { en: 'Jul 2025 — Sep 2025', ar: 'يوليو 2025 — سبتمبر 2025' },
      role: { en: 'Machine Learning Instructor', ar: 'مدرّب تعلّم الآلة' },
      org:  { en: 'National Telecommunication Institute (NTI) · Cairo', ar: 'المعهد القومي للاتصالات (NTI) · القاهرة' },
      url: 'https://www.nti.sci.eg/',
      points: {
        en: [
          'Delivered a 90-hour hands-on ML programme covering supervised learning, PCA and neural networks for engineering and CS students.',
          'Designed practical projects and assessments grounded in real-world ML deployment.'
        ],
        ar: [
          'قدّمت برنامجًا عمليًا مدته 90 ساعة يغطي التعلّم الخاضع للإشراف وPCA والشبكات العصبية لطلاب الهندسة وعلوم الحاسب.',
          'صمّمت مشاريع وتقييمات عملية مبنية على تطبيقات تعلّم الآلة في الإنتاج.'
        ]
      }
    },
    {
      date: { en: 'Jun 2025 — Jul 2025', ar: 'يونيو 2025 — يوليو 2025' },
      role: { en: 'AI in Cybersecurity Intern', ar: 'متدرّب الذكاء الاصطناعي في الأمن السيبراني' },
      org:  { en: 'e& Egypt (Etisalat) · via NTI On-the-Job Training', ar: 'e& مصر (اتصالات) · عبر تدريب NTI الميداني' },
      url: 'https://www.eand.com.eg/',
      points: {
        en: [
          'Applied AI-driven security tooling across threat intelligence, digital forensics and enterprise security analysis.',
          'Worked hands-on with SOC tooling, memory forensics (Volatility), DLP and penetration-testing suites.'
        ],
        ar: [
          'طبّقت أدوات أمنية مدعومة بالذكاء الاصطناعي في استخبارات التهديدات والتحليل الجنائي الرقمي وتحليل أمن المؤسسات.',
          'عملت عمليًا مع أدوات SOC والتحليل الجنائي للذاكرة (Volatility) وDLP وأدوات اختبار الاختراق.'
        ]
      }
    },
    {
      date: { en: 'Feb 2024 — Mar 2025', ar: 'فبراير 2024 — مارس 2025' },
      role: { en: 'Systems Engineer (Military Service)', ar: 'مهندس أنظمة (الخدمة العسكرية)' },
      org:  { en: 'National Company for Roads Building & Development · Cairo', ar: 'الشركة الوطنية لبناء وتطوير الطرق · القاهرة' },
      url: null,
      points: {
        en: [
          'Supported backend systems for national toll infrastructure serving 50%+ of Egyptian vehicles across 70%+ of national roads.',
          'Co-developed an internal data-management and reporting desktop application in C#, .NET, Entity Framework, SQL Server and Crystal Reports.'
        ],
        ar: [
          'دعّمت الأنظمة الخلفية للبنية التحتية الوطنية لجمع الرسوم التي تخدم أكثر من 50% من المركبات المصرية عبر أكثر من 70% من الطرق.',
          'شاركت في تطوير تطبيق سطح مكتب لإدارة البيانات والتقارير باستخدام C# و.NET وEntity Framework وSQL Server وCrystal Reports.'
        ]
      }
    },
    {
      date: { en: '2020 — Present', ar: '2020 — حتى الآن' },
      role: { en: 'Online Instructor — AI, Algorithms & Data Science', ar: 'مدرّب أونلاين — الذكاء الاصطناعي والخوارزميات وعلوم البيانات' },
      org:  { en: 'Udemy & YouTube (Einstein Misr)', ar: 'Udemy ويوتيوب (أينشتاين مصر)' },
      url: 'https://www.youtube.com/@EinshtenMisr',
      points: {
        en: [
          'Built and taught Arabic-language technical curricula reaching 10,000+ learners.',
          'Accumulated 700K+ YouTube views through structured lessons and worked problem sets.'
        ],
        ar: [
          'بنيت ودرّست مناهج تقنية بالعربية وصلت لأكثر من 10,000 متعلّم.',
          'حققت أكثر من 700 ألف مشاهدة على يوتيوب عبر دروس منظمة وحلول لمسائل عملية.'
        ]
      }
    },
    {
      date: { en: 'Jul 2023 — Sep 2023', ar: 'يوليو 2023 — سبتمبر 2023' },
      role: { en: 'Machine Learning Intern', ar: 'متدرّب تعلّم الآلة' },
      org:  { en: 'ITIDA / Egypt Makes Electronics — 200 hrs', ar: 'ITIDA / مصر تصنع الإلكترونيات — 200 ساعة' },
      url: 'https://itida.gov.eg/',
      points: {
        en: ['Completed an intensive 200-hour ML programme covering supervised and unsupervised learning, neural networks and model evaluation.'],
        ar: ['أكملت برنامجًا مكثفًا مدته 200 ساعة يغطي التعلّم الخاضع وغير الخاضع للإشراف والشبكات العصبية وتقييم النماذج.']
      }
    }
  ],

  /* ── Projects ───────────────────────────────────────────── */
  projects: [
    {
      featured: true,
      period: { en: 'Jul 2026 — Present', ar: 'يوليو 2026 — حتى الآن' },
      kind: { en: 'MSc Research · CISC 898', ar: 'بحث الماجستير · CISC 898' },
      title: 'Verbosity-Aware Decoding',
      subtitle: { en: 'Token-Efficient Language Model Inference', ar: 'استدلال موفّر للتوكنات في النماذج اللغوية' },
      desc: {
        en: 'A training-free LogitsProcessor that cuts generated tokens at decoding time by combining stop-token, n-gram-repetition and semantic-redundancy signals under an entropy-driven gate — no retraining, no architecture change, no KV-cache or attention overhead. Validated across Mistral-7B, Llama-3.1-8B and Qwen2.5-3B on MT-Bench, YapBench, XSum and SQuAD-v2, with a pre-registered non-inferiority protocol measuring BERTScore, ROUGE, exact-match/F1, TTFT, inter-token latency and GPU energy via NVML.',
        ar: 'مُعالِج Logits بدون تدريب يقلّص التوكنات المولّدة وقت فك التشفير بدمج إشارات رمز التوقف وتكرار الـ n-gram والتكرار الدلالي تحت بوابة قائمة على الإنتروبيا — بلا إعادة تدريب ولا تغيير معماري ولا عبء على ذاكرة KV أو الانتباه. جرى التحقق عبر Mistral-7B وLlama-3.1-8B وQwen2.5-3B على MT-Bench وYapBench وXSum وSQuAD-v2 ببروتوكول عدم دونية مُسجّل مسبقًا يقيس BERTScore وROUGE والمطابقة التامة وزمن أول توكن وطاقة GPU عبر NVML.'
      },
      tags: ['LLM Inference', 'PyTorch', 'Hugging Face', 'Benchmarking', 'AWS GPU'],
      repo: 'https://github.com/MahmoudAlyosify/minimal-lm',
      image: 'img/portfolio 1.png',
      supervisor: 'Dr. Rahatara Ferdousi'
    },
    {
      featured: true,
      period: { en: 'May 2026 — Jul 2026', ar: 'مايو 2026 — يوليو 2026' },
      kind: { en: 'Multi-Agent System', ar: 'نظام متعدد الوكلاء' },
      title: 'HORUS Sentinel',
      subtitle: { en: 'Autonomous OSINT & Threat-Intelligence Platform', ar: 'منصة استخبارات مفتوحة المصدر ذاتية التشغيل' },
      desc: {
        en: 'An autonomous intelligence analyst: a swarm of specialised passive agents continuously collects open-source intelligence and correlates every finding into a living Intelligence Knowledge Graph. A self-hosted, fine-tuned language model reasons over the graph to deliver prioritised, evidence-backed reports — compressing hours of manual analyst work into minutes.',
        ar: 'محلل استخبارات ذاتي: سرب من الوكلاء السلبيين المتخصصين يجمع الاستخبارات مفتوحة المصدر باستمرار ويربط كل نتيجة في رسم بياني معرفي حي. ونموذج لغوي مُضبَّط ذاتي الاستضافة يستدل فوق الرسم ليقدّم تقارير مرتبة الأولوية ومدعومة بالأدلة — يضغط ساعات من عمل المحلل اليدوي إلى دقائق.'
      },
      tags: ['Multi-Agent', 'Knowledge Graphs', 'Fine-Tuned LLM', 'Self-Hosted Inference', 'Python'],
      repo: 'https://github.com/MahmoudAlyosify/horus-sentinel',
      image: 'img/portfolio 2.png'
    },
    {
      period: { en: 'May 2026 — Jun 2026', ar: 'مايو 2026 — يونيو 2026' },
      kind: { en: 'Deep Reinforcement Learning', ar: 'تعلّم معزز عميق' },
      title: 'RL-Cloud-Autoscaler',
      subtitle: { en: 'Autonomous Cloud Resource Provisioning', ar: 'توفير موارد سحابية ذاتي' },
      desc: {
        en: 'A custom Gymnasium environment simulating cloud workload dynamics, with PPO and DQN agents trained to make real-time provisioning decisions. Optimises the cost–latency trade-off under fluctuating demand and benchmarks both algorithms against static and reactive threshold-based autoscaling baselines.',
        ar: 'بيئة Gymnasium مخصصة تحاكي ديناميكيات أحمال العمل السحابية، مع وكلاء PPO وDQN مُدرَّبين لاتخاذ قرارات التوفير في الزمن الحقيقي. تُحسّن المفاضلة بين التكلفة وزمن الاستجابة تحت طلب متذبذب وتقارن الخوارزميتين بخطوط أساس ثابتة وتفاعلية.'
      },
      tags: ['PPO', 'DQN', 'Gymnasium', 'Cost Optimisation', 'Python'],
      repo: 'https://github.com/MahmoudAlyosify/RL-Cloud-Autoscaler',
      image: 'img/portfolio 3.png'
    },
    {
      period: { en: 'Apr 2026 — Jun 2026', ar: 'أبريل 2026 — يونيو 2026' },
      kind: { en: 'Self-Supervised Learning', ar: 'تعلّم ذاتي الإشراف' },
      title: 'SimCLR-Vision-SSL',
      subtitle: { en: 'Contrastive Representation Learning', ar: 'تعلّم التمثيلات التبايني' },
      desc: {
        en: 'A self-supervised vision pipeline with a 42-experiment augmentation sweep, a semi-supervised SupCon extension and deployment-ready ONNX/FAISS retrieval — reaching 84.30% top-1 accuracy on classification and image-retrieval evaluation.',
        ar: 'سلسلة رؤية ذاتية الإشراف بمسح تعزيزات من 42 تجربة، وامتداد SupCon شبه خاضع للإشراف، واسترجاع جاهز للنشر بـ ONNX/FAISS — بدقة 84.30% في التصنيف واسترجاع الصور.'
      },
      tags: ['PyTorch', 'SimCLR', 'SupCon', 'ONNX', 'FAISS', '84.30% top-1'],
      repo: 'https://github.com/MahmoudAlyosify/SimCLR-Vision-SSL',
      image: 'img/portfolio 4.png'
    },
    {
      period: { en: 'Mar 2026 — Apr 2026', ar: 'مارس 2026 — أبريل 2026' },
      kind: { en: 'LLM Fine-Tuning · Cloud', ar: 'ضبط النماذج اللغوية · سحابة' },
      title: 'Horus-OSINT',
      subtitle: { en: 'Cloud-Based Threat-Intelligence Assistant', ar: 'مساعد استخبارات تهديدات سحابي' },
      desc: {
        en: 'Fine-tuned Meta-Llama-3-8B on 159,826 GTD/GDELT records and deployed it on AWS as an interactive assistant for querying global event and terrorism intelligence.',
        ar: 'ضبطت Meta-Llama-3-8B على 159,826 سجلًا من GTD/GDELT ونشرته على AWS كمساعد تفاعلي للاستعلام عن الأحداث العالمية واستخبارات الإرهاب.'
      },
      tags: ['Meta-Llama-3-8B', 'LoRA', 'AWS', 'OSINT', 'Python'],
      repo: 'https://github.com/MahmoudAlyosify/Horus-OSINT',
      image: 'img/portfolio 5.png'
    },
    {
      period: { en: '2026', ar: '2026' },
      kind: { en: 'Agentic Workflow', ar: 'سير عمل وكيلي' },
      title: 'Automated Multimodal Agent',
      subtitle: { en: 'PDF → Narrated PowerPoint', ar: 'من PDF إلى عرض تقديمي مسرود' },
      desc: {
        en: 'An autonomous agentic workflow that converts PDFs into narrated PowerPoint decks by coordinating content extraction, slide generation and audio narration end to end.',
        ar: 'سير عمل وكيلي ذاتي يحوّل ملفات PDF إلى عروض تقديمية مسرودة عبر تنسيق استخراج المحتوى وتوليد الشرائح والسرد الصوتي من البداية للنهاية.'
      },
      tags: ['Generative AI', 'Agentic AI', 'Multimodal', 'Python'],
      repo: 'https://github.com/MahmoudAlyosify/Automated-Multimodal-Agent-PDF-to-Narrated-PowerPoint',
      image: 'img/portfolio 6.png'
    },
    {
      period: { en: '2025', ar: '2025' },
      kind: { en: 'Applied ML · Space Safety', ar: 'تعلّم آلي تطبيقي · سلامة الفضاء' },
      title: 'SCRAP',
      subtitle: { en: 'Satellite Collision Risk Assessment & Prediction', ar: 'تقييم والتنبؤ بمخاطر تصادم الأقمار الصناعية' },
      desc: {
        en: 'A supervised ML pipeline predicting satellite collision risk from conjunction data available 48+ hours before closest approach.',
        ar: 'سلسلة تعلّم آلي خاضعة للإشراف تتنبأ بمخاطر تصادم الأقمار الصناعية من بيانات الاقتران المتاحة قبل أكثر من 48 ساعة من أقرب اقتراب.'
      },
      tags: ['Scikit-learn', 'XGBoost', 'Applied ML', 'Space Safety'],
      repo: 'https://github.com/MahmoudAlyosify/SCRAP-Satellite-Collision-Risk-Assessment-and-Prediction',
      demo: 'Projects/SCRAP_3D_Earth.html',
      image: 'img/Analysis 1.png'
    },
    {
      period: { en: '2025', ar: '2025' },
      kind: { en: 'Empirical Software Engineering', ar: 'هندسة برمجيات تجريبية' },
      title: 'Human vs. Agentic Pull Requests',
      subtitle: { en: 'Analysing Review Effort', ar: 'تحليل جهد المراجعة' },
      desc: {
        en: 'A reproducible GitHub-mining pipeline comparing code-review effort on agent-generated versus human-authored pull requests.',
        ar: 'سلسلة تعدين بيانات GitHub قابلة لإعادة الإنتاج تقارن جهد مراجعة الكود بين طلبات السحب المولّدة بالوكلاء وتلك المكتوبة بشريًا.'
      },
      tags: ['GitHub Analytics', 'Data Mining', 'Empirical SE'],
      repo: 'https://github.com/MahmoudAlyosify/Analyzing-Review-Effort-in-Human-vs.-Agentic-Pull-Requests',
      image: 'img/Analysis 2.jpg'
    },
    {
      period: { en: '2024', ar: '2024' },
      kind: { en: 'Audio Deep Learning', ar: 'تعلّم عميق صوتي' },
      title: 'AudioShield',
      subtitle: { en: 'Deepfake Audio Detection', ar: 'كشف التزييف الصوتي العميق' },
      desc: {
        en: 'A CNN-based deepfake audio detector served through a Streamlit application.',
        ar: 'كاشف تزييف صوتي عميق قائم على الشبكات الالتفافية يُقدَّم عبر تطبيق Streamlit.'
      },
      tags: ['CNN', 'Audio AI', 'Streamlit', 'Deepfake Detection'],
      repo: 'https://github.com/MahmoudAlyosify/AudioShield',
      image: 'img/Dev1.png'
    },
    {
      period: { en: '2023', ar: '2023' },
      kind: { en: 'Graduation Project · Grade A+', ar: 'مشروع التخرج · تقدير A+' },
      title: 'Vitalism Solution',
      subtitle: { en: 'Contactless Vital-Sign Estimation via rPPG', ar: 'تقدير العلامات الحيوية بدون تلامس عبر rPPG' },
      desc: {
        en: 'Contactless vital-sign estimation from video using remote photoplethysmography. Graded A+ at Assiut University and a semi-finalist at Microsoft Imagine Cup 2023.',
        ar: 'تقدير العلامات الحيوية بدون تلامس من الفيديو باستخدام تصوير النبض الضوئي عن بُعد. حصل على تقدير A+ في جامعة أسيوط وبلغ نصف نهائي Microsoft Imagine Cup 2023.'
      },
      tags: ['Computer Vision', 'rPPG', 'OpenCV', 'Grade A+'],
      demo: 'https://vitalismsolution.github.io/',
      image: 'img/vitalism_logo.png'
    }
  ],

  /* ── Skills pipeline (horizontal rail) ──────────────────── */
  skills: [
    {
      stage: '01',
      name: { en: 'LLM & Agent Systems', ar: 'أنظمة النماذج اللغوية والوكلاء' },
      note: { en: 'Where most of my research and production work lives.', ar: 'حيث يتركز معظم بحثي وعملي الإنتاجي.' },
      items: ['Large Language Models', 'Fine-Tuning (LoRA · QLoRA · PEFT)', 'RAG', 'Transformers', 'Hugging Face', 'LangChain', 'Multi-Agent Systems', 'Agentic Workflows', 'Prompt Engineering', 'Custom Decoding', 'Knowledge Graphs']
    },
    {
      stage: '02',
      name: { en: 'ML & Deep Learning', ar: 'تعلّم الآلة والتعلّم العميق' },
      note: { en: 'From classical baselines to self-supervised and RL.', ar: 'من الخطوط الأساسية الكلاسيكية إلى التعلّم الذاتي والمعزز.' },
      items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'XGBoost', 'LightGBM', 'CNNs', 'Computer Vision', 'NLP', 'Self-Supervised & Contrastive Learning', 'Reinforcement Learning (PPO · DQN)', 'Optuna', 'SHAP']
    },
    {
      stage: '03',
      name: { en: 'Data & MLOps', ar: 'البيانات وعمليات تعلّم الآلة' },
      note: { en: 'Getting models out of notebooks and into production.', ar: 'إخراج النماذج من الدفاتر إلى الإنتاج.' },
      items: ['Pandas', 'NumPy', 'PySpark', 'ETL Pipelines', 'Feature Engineering', 'AWS', 'Docker', 'CI/CD', 'ONNX', 'FastAPI', 'Streamlit', 'FAISS', 'ChromaDB', 'MySQL', 'MongoDB', 'Git/GitHub', 'Linux']
    },
    {
      stage: '04',
      name: { en: 'Evaluation & Research', ar: 'التقييم والبحث' },
      note: { en: 'Claims are worth what their evaluation protocol is worth.', ar: 'قيمة أي ادعاء من قيمة بروتوكول تقييمه.' },
      items: ['MT-Bench', 'XSum', 'SQuAD-v2', 'BERTScore', 'ROUGE', 'LLM-as-Judge', 'Statistical Testing', 'Ablation Studies', 'Reproducible Experiment Design']
    },
    {
      stage: '05',
      name: { en: 'Programming', ar: 'لغات البرمجة' },
      note: { en: 'Systems background from the bioinformatics degree onward.', ar: 'خلفية أنظمة منذ دراسة المعلوماتية الحيوية.' },
      items: ['Python', 'C++', 'C', 'C#', 'Go', 'JavaScript', 'SQL', 'MATLAB', 'Bash']
    }
  ],

  /* ── Teaching ───────────────────────────────────────────── */
  teaching: {
    platforms: [
      {
        name: { en: 'Einstein Misr — أينشتاين مصر', ar: 'أينشتاين مصر — Einstein Misr' },
        desc: {
          en: 'An Arabic technical channel covering algorithms, data structures, discrete mathematics, probability and statistics, and machine learning.',
          ar: 'قناة تقنية بالعربية تغطي الخوارزميات وهياكل البيانات والرياضيات المتقطعة والاحتمالات والإحصاء وتعلّم الآلة.'
        },
        stat: '700K+',
        statLabel: { en: 'Total views', ar: 'إجمالي المشاهدات' },
        url: 'https://www.youtube.com/@EinshtenMisr',
        cta: { en: 'Visit the channel', ar: 'زيارة القناة' },
        icon: 'youtube'
      },
      {
        name: { en: 'Udemy Instructor', ar: 'مدرّب على Udemy' },
        desc: {
          en: 'Arabic courses on core computer-science and AI topics, built to help Arabic-speaking students compete in a global field.',
          ar: 'دورات عربية في أساسيات علوم الحاسب والذكاء الاصطناعي، مبنية لمساعدة الطلاب العرب على المنافسة عالميًا.'
        },
        stat: '10,000+',
        statLabel: { en: 'Total learners', ar: 'إجمالي المتعلمين' },
        url: 'https://www.udemy.com/user/mahmoud-sayed-youssef-kotb-2/',
        cta: { en: 'Browse the courses', ar: 'تصفّح الدورات' },
        icon: 'udemy'
      }
    ],
    courses: [
      {
        title: { en: 'Grokking Algorithms & Data Structures — in Arabic', ar: 'Grokking Algorithms وهياكل البيانات — بالعربية' },
        image: 'img/Grokking Algorithms.png',
        udemy: 'https://www.udemy.com/share/10cybn3@99MXW9FVSQWtoPtROfmphkpK79p43lDur_zSEG3Po5_zOR_BSSePpmqzD027ExXfSg==/',
        youtube: 'https://www.youtube.com/playlist?list=PLtqeb2-_b-2ADG_DEXKec9rFPlJHPqc4i'
      },
      {
        title: { en: 'Discrete Mathematics for CS — in Arabic', ar: 'الرياضيات المتقطعة لعلوم الحاسب — بالعربية' },
        image: 'img/Discrete Mathematics.png',
        udemy: 'https://www.udemy.com/course/discrete-mathematics-for-computer-science-in-arabic/',
        youtube: 'https://www.youtube.com/playlist?list=PLtqeb2-_b-2BkG8-inm5ho_W7fZTZHrVt'
      },
      {
        title: { en: 'Probability and Statistics — in Arabic', ar: 'الاحتمالات والإحصاء — بالعربية' },
        image: 'img/Probability and Statistics.png',
        udemy: 'https://www.udemy.com/course/mahmoud-alyosify-probability-and-statistics-in-arabic/',
        youtube: 'https://www.youtube.com/playlist?list=PLtqeb2-_b-2DedcRYs7BCKOsokCLdJo65'
      }
    ]
  },

  /* ── Achievements ───────────────────────────────────────── */
  achievements: [
    {
      icon: '🥇',
      title: { en: '1st Place — Smart Cities Hackathon 2022', ar: 'المركز الأول — Smart Cities Hackathon 2022' },
      meta:  { en: 'Jan – Mar 2022 · Benha University', ar: 'يناير – مارس 2022 · جامعة بنها' },
      desc: {
        en: 'First place nationally among 77 teams from Egyptian public, private and national universities. Organised in partnership with AWS, Elsewedy Digital, Orange Egypt and NBE.',
        ar: 'المركز الأول وطنيًا بين 77 فريقًا من جامعات مصرية حكومية وخاصة وأهلية، بالشراكة مع AWS وElsewedy Digital وOrange Egypt والبنك الأهلي.'
      },
      links: [
        { label: { en: 'Official page', ar: 'الصفحة الرسمية' }, url: 'https://bu.edu.eg/en/competitions/hackathon.php' },
        { label: { en: 'The winning moment', ar: 'لحظة الفوز' }, url: 'https://www.youtube.com/embed/9k4APPPgDyQ' }
      ]
    },
    {
      icon: '🌟',
      title: { en: 'Semi-Finalist — Microsoft Imagine Cup 2023', ar: 'نصف نهائي — Microsoft Imagine Cup 2023' },
      meta:  { en: 'Global competition · Vitalism Solution', ar: 'مسابقة عالمية · مشروع Vitalism Solution' },
      desc: {
        en: 'Reached the global semi-finals with Vitalism Solution — an AI system for contactless vital-sign estimation via rPPG. Graded A+ at Assiut University.',
        ar: 'بلغت نصف النهائي العالمي بمشروع Vitalism Solution — نظام ذكاء اصطناعي لتقدير العلامات الحيوية بدون تلامس عبر rPPG. بتقدير A+ في جامعة أسيوط.'
      },
      links: [{ label: { en: 'Project site', ar: 'موقع المشروع' }, url: 'https://vitalismsolution.github.io/' }]
    },
    {
      icon: '📜',
      title: { en: 'Ideal Student Award 2022–2023', ar: 'جائزة الطالب المثالي 2022–2023' },
      meta:  { en: 'Faculty of Computers & Information, Assiut University', ar: 'كلية الحاسبات والمعلومات، جامعة أسيوط' },
      desc: {
        en: 'Awarded for academic excellence and distinguished contribution to academic life and the university community.',
        ar: 'مُنحت تقديرًا للتفوق الأكاديمي والمساهمة المتميزة في الحياة الأكاديمية والمجتمع الجامعي.'
      },
      links: []
    },
    {
      icon: '🎬',
      title: { en: '1st Place — Science & Technology Content Competition', ar: 'المركز الأول — مسابقة المحتوى العلمي والتقني' },
      meta:  { en: '2021–2022 · University level · White Hackers team', ar: '2021–2022 · على مستوى الجامعة · فريق White Hackers' },
      desc: {
        en: 'First place for producing distinguished scientific and technical educational content at university level.',
        ar: 'المركز الأول في إنتاج محتوى تعليمي علمي وتقني متميز على مستوى الجامعة.'
      },
      links: []
    },
    {
      icon: '🏛️',
      title: { en: 'Secretary — Higher Scientific & Technological Committee', ar: 'أمين — اللجنة العلمية والتكنولوجية العليا' },
      meta:  { en: 'Assiut University Student Union · 2021–2022', ar: 'اتحاد طلاب جامعة أسيوط · 2021–2022' },
      desc: {
        en: 'Led the higher scientific committee of the Assiut University Student Union for 2022.',
        ar: 'قدت اللجنة العلمية العليا في اتحاد طلاب جامعة أسيوط لعام 2022.'
      },
      links: [{ label: { en: 'University page', ar: 'صفحة الجامعة' }, url: 'https://www.aun.edu.eg/fci/ar/thnyt-lltalb-mhmwd-syd-ywsf' }]
    }
  ],

  /* ── Recommendations ────────────────────────────────────── */
  recommendations: [
    {
      name: 'Rahatara Ferdousi, PhD',
      avatar: 'img/Rahatara.png',
      role: { en: 'Applied AI · Mahmoud\'s Generative AI professor', ar: 'دكتوراه ذكاء اصطناعي تطبيقي · أستاذ الذكاء الاصطناعي التوليدي لمحمود' },
      text: {
        en: 'I had the pleasure of teaching Mahmoud in Generative AI, and I highly recommend him for any opportunity in AI and technology. He was an active and highly engaged student who showed constant curiosity and initiative. His ability to connect theoretical ideas to practical implementation stood out throughout the course. He has a clear passion for learning and innovation, and I am confident he will continue to excel in any academic or professional setting.',
        ar: 'كان لي شرف تدريس محمود في مساق الذكاء الاصطناعي التوليدي، وأوصي به بشدة لأي فرصة في مجال الذكاء الاصطناعي والتقنية. كان طالبًا نشطًا ومشاركًا للغاية، وأظهر فضولًا ومبادرة مستمرين. وتميزت قدرته على ربط الأفكار النظرية بالتنفيذ العملي طوال المساق. لديه شغف واضح بالتعلّم والابتكار، وأنا واثقة أنه سيواصل التفوق في أي بيئة أكاديمية أو مهنية.'
      }
    },
    {
      name: 'Dr. Ibrahim Elsemman',
      avatar: 'img/Dr_Ibrahim.jpg',
      role: { en: 'Associate Professor, Information Systems — Assiut University', ar: 'أستاذ مساعد، نظم المعلومات — جامعة أسيوط' },
      text: {
        en: 'I know Mahmoud from many angles; he was among the best students in the Faculty of Computers and Information. He was outstanding — punctual to lectures, asked many important questions, and was innovative in his projects. He showed a remarkable ability to absorb new technologies quickly, and excellent time management while working smoothly with his peers.',
        ar: 'أعرف محمود من زوايا عديدة؛ كان من أفضل الطلاب في كلية الحاسبات والمعلومات. كان طالبًا متميزًا، ملتزمًا بحضور المحاضرات في وقتها، وطرح كثيرًا من الأسئلة المهمة، وتميّز بالابتكار في مشاريعه. أظهر قدرة رائعة على استيعاب التقنيات الجديدة بسرعة، وإدارة ممتازة للوقت أثناء العمل بسلاسة مع زملائه.'
      }
    },
    {
      name: 'Dr. Islam Taj-Eddin',
      avatar: 'img/Dr_Islam.jpg',
      role: { en: 'Associate Professor, Information Technology — Assiut University', ar: 'أستاذ مساعد، تقنية المعلومات — جامعة أسيوط' },
      text: {
        en: 'Mahmoud demonstrated remarkable technical knowledge and a systematic approach to problem solving.',
        ar: 'أظهر محمود معرفة تقنية رائعة وطريقة منهجية في معالجة المشكلات.'
      }
    },
    {
      name: 'Nada Essam',
      avatar: 'img/Nada.png',
      role: { en: 'Teaching Assistant at E-JUST', ar: 'معيدة تدريس في E-JUST' },
      text: {
        en: 'I highly recommend Mahmoud for any leadership position or future career path. He consistently showed strong leadership qualities, effective communication and clear goal-setting, and he motivated the whole team. His distinguished problem-solving skills and critical thinking were decisive in overcoming obstacles and delivering project success.',
        ar: 'أوصي بمحمود بشدة لأي منصب قيادي أو مسار مهني مستقبلي. أظهر باستمرار صفات قيادية قوية وتواصلًا فعالًا وتحديدًا واضحًا للأهداف، وشجّع الفريق كله. وكانت مهاراته المتميزة في حل المشكلات وتفكيره النقدي عاملين حاسمين في تجاوز العقبات وتحقيق نجاح المشاريع.'
      }
    },
    {
      name: 'Mina Nashat',
      avatar: 'img/Mina.jpg',
      role: { en: 'Data & Analytics Engineer at Ejada | Python Developer', ar: 'مهندس بيانات وتحليلات في Ejada | مطوّر Python' },
      text: {
        en: 'I am glad to recommend Mahmoud. Over four years together in the Faculty of Computers and Information, I saw his relentless diligence and constant drive to develop skills using creative problem-solving methods. As a leader, his exceptional qualities shine in managing teams effectively and creating a positive working environment.',
        ar: 'يسعدني أن أوصي بمحمود. خلال أربع سنوات قضيناها في كلية الحاسبات والمعلومات، لاحظت اجتهاده الدؤوب وسعيه المستمر لتطوير المهارات بأساليب إبداعية لحل المشكلات. وبصفته قائدًا، تتألق صفاته الاستثنائية في إدارة الفرق بفعالية وخلق بيئة عمل إيجابية.'
      }
    },
    {
      name: 'Nourhan Ahmed',
      avatar: 'img/Nourhan Ahmed.jpg',
      role: { en: 'Teaching Assistant at GIU | Backend Developer', ar: 'معيدة تدريس في GIU | مطوّرة الواجهة الخلفية' },
      text: {
        en: 'Mahmoud is outstanding in teamwork. He adds fresh, unique ideas to any team he joins. We took part in the Smart Cities Hackathon together and came first — down to his leadership and the understanding that sets the team apart.',
        ar: 'محمود شخص متميز في العمل الجماعي. يضيف أفكارًا جديدة وفريدة لأي فريق يشارك فيه. شاركنا معًا في Smart Cities Hackathon وحققنا المركز الأول — وهذا يعود لقيادته وللفهم الذي يميّز الفريق.'
      }
    }
  ],

  /* ── Certificates (Certificates/ folder) ────────────────── */
  certificates: [
    { file: 'IMG_4014.JPG', issuer: 'Amazon Web Services', year: '2026', name: { en: 'AWS Academy — Data Engineering', ar: 'AWS Academy — هندسة البيانات' } },
    { file: 'IMG_0340.JPG', issuer: 'Amazon Web Services', year: '2025', name: { en: 'AWS Academy — Machine Learning for NLP', ar: 'AWS Academy — تعلّم الآلة للغة الطبيعية' } },
    { file: 'IMG_4832.JPG', issuer: 'Amazon Web Services', year: '2025', name: { en: 'AWS Academy — ML Foundations', ar: 'AWS Academy — أساسيات تعلّم الآلة' } },
    { file: 'Annotation 2020-07-04 231855.jpg', issuer: 'Coursera / DeepLearning.AI', year: '2020', name: { en: 'Machine Learning Specialization', ar: 'تخصص تعلّم الآلة' } },
    { file: 'IMG_0600.JPG', issuer: 'Huawei', year: '', name: { en: 'HCIP — AI (Huawei Certified ICT Professional)', ar: 'HCIP — الذكاء الاصطناعي (Huawei Certified ICT Professional)' } },
    { file: 'IMG_1602.JPG', issuer: 'Microsoft / Power BI', year: '', name: { en: 'Microsoft Certified: Data Analyst Associate', ar: 'Microsoft Certified: Data Analyst Associate' } },
    { file: 'IMG_2648.jpg', issuer: 'IBM / Coursera', year: '', name: { en: 'Generative AI & Prompt Engineering', ar: 'الذكاء الاصطناعي التوليدي وهندسة التوجيه' } },
    { file: 'IMG_3992.JPG', issuer: 'IBM', year: '', name: { en: 'Generative AI: Boost Your Cybersecurity Career', ar: 'الذكاء الاصطناعي التوليدي: تعزيز مسارك في الأمن السيبراني' } },
    { file: 'AI in Cybersecurity.png', issuer: 'NTI', year: '2025', name: { en: 'AI in Cybersecurity (420 hrs)', ar: 'الذكاء الاصطناعي في الأمن السيبراني (420 ساعة)' } },
    { file: 'IMG_3993.JPG', issuer: 'ITIDA / Egypt Makes Electronics', year: '2023', name: { en: 'Machine Learning Internship (200 hrs)', ar: 'تدريب تعلّم الآلة (200 ساعة)' } },
    { file: 'IMG_3994.JPG', issuer: 'Route Academy', year: '', name: { en: 'Full Stack Development (.NET & Angular)', ar: 'تطوير ويب متكامل (.NET و Angular)' } },
    { file: 'IMG_6131.JPG', issuer: "Children's Cancer Hospital 57357", year: '2021', name: { en: 'Data analysis using R (36 hrs)', ar: 'تحليل البيانات باستخدام R (36 ساعة)' } },
    { file: 'IMG_7887.JPG', issuer: 'Air Defense College (ISEIC)', year: '2023', name: { en: 'Certificate of Excellence — Vitalism', ar: 'شهادة تميّز — Vitalism' } },
    { file: 'IMG_9390.JPG', issuer: 'Assiut University', year: '2023', name: { en: 'First Place — Ideal Student Competition', ar: 'المركز الأول — مسابقة الطالب المثالي' } },
    { file: 'Screenshot 2025-02-13 023245.png', issuer: 'Fortinet', year: '2025', name: { en: 'Fortinet Certified Associate in Cybersecurity', ar: 'Fortinet Certified Associate in Cybersecurity' } },
    { file: 'iti 1.JPG', issuer: 'ITI', year: '2023', name: { en: 'Intro to UI/UX (60 hrs)', ar: 'مقدمة في UI/UX (60 ساعة)' } },
    { file: 'iti 2.JPG', issuer: 'ITI', year: '2022', name: { en: 'Intro to SQL Server & C# (90 hrs)', ar: 'مقدمة في SQL Server و C# (90 ساعة)' } },
    { file: 'iti 3.JPG', issuer: 'ITI', year: '2022', name: { en: 'Intro to MEARN Stack Development (60 hrs)', ar: 'مقدمة في تطوير MEARN Stack (60 ساعة)' } },
    { file: 'iti 4.JPG', issuer: 'ITI', year: '2022', name: { en: '.NET Web Development (120 hrs)', ar: 'تطوير الويب بـ .NET (120 ساعة)' } },
    { file: 'iti 5.JPG', issuer: 'ITI', year: '2022', name: { en: 'Android Mobile Development (30 hrs)', ar: 'تطوير تطبيقات أندرويد (30 ساعة)' } }
  ]
};

window.SITE = SITE;
