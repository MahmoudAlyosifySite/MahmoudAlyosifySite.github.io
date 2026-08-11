/* ============================================================
   Mahmoud AI — local retrieval
   BM25-lite over data/mahmoud-profile.json, entirely client-side.
   No network calls, no embeddings service, no cost.
   ============================================================ */

window.MARetriever = (() => {
  'use strict';

  const K1 = 1.4;   // term-frequency saturation
  const B  = 0.72;  // length normalisation

  /* Query terms that mean the same thing as something in the corpus. */
  const SYNONYMS = {
    llm: ['large language model', 'language model', 'gpt', 'transformer'],
    'language model': ['llm'],
    rag: ['retrieval augmented generation', 'retrieval'],
    rl: ['reinforcement learning', 'ppo', 'dqn'],
    ssl: ['self supervised', 'contrastive', 'simclr'],
    nlp: ['natural language processing'],
    cv: ['computer vision', 'resume', 'curriculum vitae'],
    resume: ['cv', 'curriculum vitae'],
    job: ['role', 'hiring', 'position', 'opportunity', 'available'],
    hire: ['hiring', 'job', 'role', 'available', 'recruit'],
    study: ['education', 'degree', 'university', 'masters'],
    school: ['education', 'university'],
    uni: ['university'],
    masters: ['msc', 'master', 'graduate'],
    phd: ['doctorate', 'msc', 'research'],
    email: ['contact', 'reach'],
    contact: ['email', 'reach', 'linkedin'],
    'minimal-lm': ['verbosity aware decoding', 'minimal lm'],
    minimallm: ['verbosity aware decoding', 'minimal lm'],
    horus: ['sentinel', 'osint', 'threat intelligence'],
    scrap: ['satellite collision'],
    experience: ['work', 'job', 'career', 'employment'],
    skill: ['skills', 'expertise', 'technology', 'stack'],
    project: ['projects', 'built', 'work'],
    award: ['awards', 'achievement', 'prize', 'competition'],
    cert: ['certification', 'certificate', 'credential'],
    teach: ['teaching', 'instructor', 'course', 'students'],
    who: ['summary', 'about', 'background']
  };

  /* Queries that want the whole picture rather than one chunk. */
  const BROAD = /\b(who is|about (him|mahmoud)|tell me about (him|mahmoud|yourself)|introduce|summary|overview|background|من هو|عن محمود|نبذة|عرّفني|من أنت)\b/i;

  const STOP = new Set(('a an the and or of to in on for with is are was were be been do does did ' +
    'what which who whom how why when where can could would should i you he she it they me his her ' +
    'this that these those there here about tell give show please your my more most any all some ' +
    'من عن في على الى إلى ما ماذا هل كيف متى اين أين هو هي هذا هذه ذلك التي الذي و ثم كان يكون له لها').split(/\s+/));

  const norm = (s) => String(s)
    .toLowerCase()
    .replace(/[ً-ٰٟ]/g, '')          // Arabic diacritics
    .replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s+#.-]/gu, ' ');

  const tokenize = (s) => norm(s).split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));

  let index = null;   // { docs, df, avgLen, raw }
  let loading = null;

  function build(json) {
    const docs = json.chunks.map((c) => {
      const body = `${c.title} ${c.tags.join(' ')} ${c.text}`;
      const terms = tokenize(body);
      const tf = new Map();
      terms.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
      return { ...c, tf, len: terms.length };
    });

    const df = new Map();
    docs.forEach((d) => { for (const t of d.tf.keys()) df.set(t, (df.get(t) || 0) + 1); });
    const avgLen = docs.reduce((s, d) => s + d.len, 0) / (docs.length || 1);

    return { docs, df, avgLen, raw: json };
  }

  async function load() {
    if (index) return index;
    if (loading) return loading;
    loading = fetch('data/mahmoud-profile.json', { cache: 'force-cache' })
      .then((r) => {
        if (!r.ok) throw new Error('profile unavailable');
        return r.json();
      })
      .then((json) => { index = build(json); return index; })
      .finally(() => { loading = null; });
    return loading;
  }

  function expand(terms) {
    const out = new Set(terms);
    terms.forEach((t) => {
      (SYNONYMS[t] || []).forEach((syn) => tokenize(syn).forEach((w) => out.add(w)));
    });
    return [...out];
  }

  function score(query, { k = 6, budget = 5200 } = {}) {
    if (!index) return [];
    const { docs, df, avgLen } = index;
    const N = docs.length;
    const terms = expand(tokenize(query));

    // A broad "who is he" question deserves the identity chunks whole.
    if (BROAD.test(query) || terms.length === 0) {
      const wanted = ['summary-core', 'edu-msc', 'ai-expertise', 'exp-nti', 'availability'];
      return docs.filter((d) => wanted.includes(d.id));
    }

    const ranked = docs.map((d) => {
      let s = 0;
      terms.forEach((t) => {
        const f = d.tf.get(t);
        if (!f) return;
        const idf = Math.log(1 + (N - (df.get(t) || 0) + 0.5) / ((df.get(t) || 0) + 0.5));
        s += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + B * (d.len / avgLen))));
      });
      // Title and tag hits are stronger signals than body hits.
      const head = norm(d.title + ' ' + d.tags.join(' '));
      terms.forEach((t) => { if (head.includes(t)) s += 1.6; });
      return { d, s };
    })
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s);

    // Nothing matched — better to hand over the summary than nothing at all,
    // so the model can say "not in the portfolio" with context.
    if (!ranked.length) return docs.filter((d) => ['summary-core', 'availability'].includes(d.id));

    const out = [];
    let chars = 0;
    for (const { d } of ranked.slice(0, k * 2)) {
      if (out.length >= k) break;
      if (chars + d.text.length > budget && out.length) break;
      out.push(d);
      chars += d.text.length;
    }
    return out;
  }

  /* Contact facts are cheap and asked about constantly — always attach. */
  function contactBlock() {
    if (!index) return '';
    const c = index.raw.contact;
    return `CONTACT: email ${c.email} (academic: ${c.academic_email}) · LinkedIn ${c.linkedin} · GitHub ${c.github} · portfolio ${c.portfolio} · CV ${c.cv_pdf}. ${c.best_way_to_reach}`;
  }

  function identityBlock() {
    if (!index) return '';
    const i = index.raw.identity;
    return `IDENTITY: ${i.name} (also written ${i.also_known_as.join(', ')}) — ${i.title}. Based in ${i.location}. Languages: ${i.languages}.`;
  }

  /**
   * Build the reference block handed to the model for one question.
   * Returns plain text; the caller wraps it in delimiters.
   */
  async function contextFor(query) {
    await load();
    const hits = score(query);
    const body = hits.map((h) => `### ${h.title} [${h.section}]\n${h.text}`).join('\n\n');
    return [identityBlock(), contactBlock(), body].filter(Boolean).join('\n\n');
  }

  return { load, contextFor, score, tokenize, get ready() { return !!index; } };
})();
