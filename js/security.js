/* ============================================================
   Mahmoud AI — security layer

   Two jobs:
   1. Render model output safely. Everything here builds DOM nodes
      with createElement/textContent. Model text NEVER reaches
      innerHTML, so there is no HTML-injection surface at all —
      not "escaped HTML", simply no HTML parsing of model output.
   2. Turn provider failures into human sentences without ever
      letting a credential-shaped string through.
   ============================================================ */

window.MASecurity = (() => {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     REDACTION
     Anything that looks like a key is scrubbed before it can be
     shown, logged, or thrown further up.
     ══════════════════════════════════════════════════════════ */
  const KEY_SHAPES = [
    /\bsk-[A-Za-z0-9_-]{12,}/g,          // OpenAI, Anthropic, Groq
    /\bsk-ant-[A-Za-z0-9_-]{12,}/g,      // Anthropic
    /\bgsk_[A-Za-z0-9_-]{12,}/g,         // Groq
    /\bAIza[A-Za-z0-9_-]{20,}/g,         // Google
    /\bsk-or-v1-[A-Za-z0-9_-]{12,}/g,    // OpenRouter
    /\bBearer\s+[A-Za-z0-9._-]{12,}/gi,
    /\b[A-Za-z0-9_-]{40,}\b/g            // long opaque blobs
  ];

  function redact(input) {
    let s = typeof input === 'string' ? input : String(input ?? '');
    KEY_SHAPES.forEach((re) => { s = s.replace(re, '[redacted]'); });
    return s;
  }

  /* ══════════════════════════════════════════════════════════
     MARKDOWN → DOM
     A deliberately small subset: headings, paragraphs, lists,
     fenced code, inline code, bold, italic, links.
     No HTML passthrough. No raw tags. No innerHTML.
     ══════════════════════════════════════════════════════════ */

  const SAFE_PROTOCOL = /^https?:\/\//i;

  /** Inline formatting inside one line of text. */
  function inline(text, parent) {
    // Order matters: code first so its contents are never re-parsed.
    const TOKEN = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(__[^_\n]+__)|(\*[^*\n]+\*)|(_[^_\n]+_)|(\[[^\]\n]+\]\([^)\s]+\))|(https?:\/\/[^\s<>()]+)/g;

    let last = 0;
    let m;
    while ((m = TOKEN.exec(text)) !== null) {
      if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)));
      const raw = m[0];

      if (m[1]) {                                   // `code`
        const c = document.createElement('code');
        c.textContent = raw.slice(1, -1);
        parent.appendChild(c);

      } else if (m[2] || m[3]) {                    // **bold** / __bold__
        const b = document.createElement('strong');
        b.textContent = raw.slice(2, -2);
        parent.appendChild(b);

      } else if (m[4] || m[5]) {                    // *italic* / _italic_
        const i = document.createElement('em');
        i.textContent = raw.slice(1, -1);
        parent.appendChild(i);

      } else if (m[6]) {                            // [label](url)
        const close = raw.indexOf('](');
        const label = raw.slice(1, close);
        const url = raw.slice(close + 2, -1);
        parent.appendChild(link(url, label));

      } else if (m[7]) {                            // bare URL
        parent.appendChild(link(raw, raw));
      }
      last = TOKEN.lastIndex;
    }
    if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
  }

  /** Only http(s) becomes a link. javascript:, data:, anything else stays text. */
  function link(url, label) {
    if (!SAFE_PROTOCOL.test(url)) {
      return document.createTextNode(label);
    }
    const a = document.createElement('a');
    a.href = url;                        // assigning .href, never parsing markup
    a.textContent = label;
    a.target = '_blank';
    a.rel = 'noopener noreferrer nofollow';
    return a;
  }

  /**
   * Render markdown into a fresh DocumentFragment.
   * @param {string} md raw model output
   * @returns {DocumentFragment}
   */
  function renderMarkdown(md) {
    const frag = document.createDocumentFragment();
    const lines = String(md ?? '').replace(/\r\n?/g, '\n').split('\n');

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      /* Fenced code block */
      if (/^\s*```/.test(line)) {
        const lang = line.replace(/^\s*```/, '').trim();
        const buf = [];
        i++;
        while (i < lines.length && !/^\s*```/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++; // closing fence
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        if (lang) code.dataset.lang = lang;
        code.textContent = buf.join('\n');
        pre.appendChild(code);
        frag.appendChild(pre);
        continue;
      }

      /* Heading */
      const h = line.match(/^(#{1,4})\s+(.*)$/);
      if (h) {
        const el = document.createElement('h' + Math.min(h[1].length + 2, 6));
        inline(h[2], el);
        frag.appendChild(el);
        i++;
        continue;
      }

      /* Unordered list */
      if (/^\s*[-*+]\s+/.test(line)) {
        const ul = document.createElement('ul');
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
          const li = document.createElement('li');
          inline(lines[i].replace(/^\s*[-*+]\s+/, ''), li);
          ul.appendChild(li);
          i++;
        }
        frag.appendChild(ul);
        continue;
      }

      /* Ordered list */
      if (/^\s*\d+[.)]\s+/.test(line)) {
        const ol = document.createElement('ol');
        while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
          const li = document.createElement('li');
          inline(lines[i].replace(/^\s*\d+[.)]\s+/, ''), li);
          ol.appendChild(li);
          i++;
        }
        frag.appendChild(ol);
        continue;
      }

      /* Blank */
      if (!line.trim()) { i++; continue; }

      /* Paragraph — consume until a blank line or a block starter */
      const buf = [];
      while (i < lines.length && lines[i].trim() &&
             !/^\s*```/.test(lines[i]) && !/^#{1,4}\s/.test(lines[i]) &&
             !/^\s*[-*+]\s+/.test(lines[i]) && !/^\s*\d+[.)]\s+/.test(lines[i])) {
        buf.push(lines[i]); i++;
      }
      const p = document.createElement('p');
      inline(buf.join(' '), p);
      frag.appendChild(p);
    }

    return frag;
  }

  /**
   * Replace an element's children with rendered markdown.
   * The only sanctioned way to display model output.
   */
  function setMarkdown(el, md) {
    el.replaceChildren(renderMarkdown(md));
  }

  /* ══════════════════════════════════════════════════════════
     ERRORS
     ══════════════════════════════════════════════════════════ */

  const MESSAGES = {
    en: {
      401: 'That API key was rejected. Check you copied the whole key, and that it belongs to the provider you selected.',
      403: 'That key does not have permission for this model. It may be expired, restricted, or on a plan without access.',
      404: 'That model was not found on this provider. Try a different model, or type an exact model ID.',
      429: 'You have hit the provider\'s rate limit or run out of quota. Wait a moment and try again, or check your billing.',
      500: 'The provider had a server error. That one is on their side — try again shortly.',
      cors: 'Your browser blocked the request to this provider. Some providers do not allow direct browser calls. Try Groq, Gemini or OpenRouter, which do.',
      network: 'Could not reach the provider. Check your internet connection and try again.',
      empty: 'The provider returned an empty response. Try rephrasing, or pick a different model.',
      unsupported: 'That provider is not supported.',
      aborted: 'Stopped.',
      profile: 'Could not load the portfolio data this assistant answers from. Reload the page and try again.',
      generic: 'Something went wrong talking to the provider. Try again, or switch provider.'
    },
    ar: {
      401: 'المفتاح مرفوض. تأكد أنك نسخته كاملًا وأنه يخص المزوّد الذي اخترته.',
      403: 'هذا المفتاح لا يملك صلاحية لهذا الموديل. ربما انتهت صلاحيته أو مقيّد أو خطتك لا تشمله.',
      404: 'الموديل غير موجود لدى هذا المزوّد. جرّب موديلًا آخر أو اكتب معرّف الموديل بدقة.',
      429: 'تجاوزت حد الاستخدام أو نفدت حصتك عند المزوّد. انتظر قليلًا وأعد المحاولة أو راجع اشتراكك.',
      500: 'حدث خطأ في خوادم المزوّد. المشكلة عندهم — أعد المحاولة بعد قليل.',
      cors: 'متصفحك منع الطلب لهذا المزوّد. بعض المزودين لا يسمحون بالاستدعاء المباشر من المتصفح. جرّب Groq أو Gemini أو OpenRouter.',
      network: 'تعذّر الوصول إلى المزوّد. تحقق من اتصالك بالإنترنت وأعد المحاولة.',
      empty: 'أعاد المزوّد ردًا فارغًا. جرّب صياغة أخرى أو موديلًا مختلفًا.',
      unsupported: 'هذا المزوّد غير مدعوم.',
      aborted: 'تم الإيقاف.',
      profile: 'تعذّر تحميل بيانات الملف التي يعتمد عليها المساعد. أعد تحميل الصفحة وحاول مجددًا.',
      generic: 'حدث خطأ أثناء التواصل مع المزوّد. أعد المحاولة أو غيّر المزوّد.'
    }
  };

  /**
   * Map any failure to a sentence a visitor can act on.
   * Never returns provider text verbatim — only a redacted tail,
   * and only when it is short enough to be a real message.
   */
  function describeError(err, lang = 'en') {
    const M = MESSAGES[lang] || MESSAGES.en;

    if (err && err.name === 'AbortError') return M.aborted;

    const code = err && err.status;
    if (code === 401) return M[401];
    if (code === 403) return M[403];
    if (code === 404) return M[404];
    if (code === 429) return M[429];
    if (code >= 500) return M[500];

    const kind = err && err.kind;
    if (kind === 'cors') return M.cors;
    if (kind === 'network') return M.network;
    if (kind === 'empty') return M.empty;
    if (kind === 'unsupported') return M.unsupported;
    if (kind === 'profile') return M.profile;

    if (code === 400 && err.detail) {
      const d = redact(err.detail).trim();
      if (d && d.length < 220) return `${M.generic} (${d})`;
    }
    return M.generic;
  }

  return { renderMarkdown, setMarkdown, describeError, redact };
})();
