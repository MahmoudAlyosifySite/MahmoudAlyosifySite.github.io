/* ============================================================
   Mahmoud AI — provider abstraction

   Every provider here is called DIRECTLY from the visitor's
   browser to the provider's own endpoint. Their key goes into a
   request header and nowhere else: not a query string, not a
   backend of ours (there is none), not storage, not logs.

   Adding a provider = adding one object to PROVIDERS.
   ============================================================ */

window.MAProviders = (() => {
  'use strict';

  const MAX_TOKENS = 900;

  /* ── Shared SSE plumbing ────────────────────────────────── */

  /** Read a fetch Response body as a stream of SSE `data:` payloads. */
  async function* sseLines(res, signal) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    try {
      while (true) {
        if (signal?.aborted) break;
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n');
        buffer = parts.pop();
        for (const line of parts) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payload = trimmed.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;
          yield payload;
        }
      }
    } finally {
      try { reader.cancel(); } catch (_) { /* already closed */ }
    }
  }

  /** Extract a useful error out of a non-2xx response without leaking secrets. */
  async function toError(res) {
    let detail = '';
    try {
      const text = await res.text();
      try {
        const j = JSON.parse(text);
        detail = j?.error?.message || j?.error?.[0]?.message || j?.message || j?.error?.type || '';
      } catch (_) {
        detail = text.slice(0, 300);
      }
    } catch (_) { /* body already consumed or unreadable */ }
    const err = new Error('provider error');
    err.status = res.status;
    err.detail = window.MASecurity.redact(detail);
    return err;
  }

  /** Distinguish a CORS/blocked request from a plain connectivity failure. */
  function toNetworkError(e) {
    if (e && e.name === 'AbortError') return e;
    const err = new Error('network');
    // Browsers report both as an opaque TypeError; CORS is by far the likelier
    // cause when the page itself is loading fine.
    err.kind = navigator.onLine === false ? 'network' : 'cors';
    return err;
  }

  /* ── OpenAI-compatible family (OpenAI · Groq · OpenRouter) ── */
  function openAICompatible({ id, label, endpoint, models, defaultModel, keyHint, keyUrl, note, extraHeaders }) {
    return {
      id, label, models, defaultModel, keyHint, keyUrl, note,
      browserSafe: true,

      async stream({ key, model, system, messages, signal, onDelta }) {
        let res;
        try {
          res = await fetch(endpoint, {
            method: 'POST',
            signal,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${key}`,
              ...(extraHeaders ? extraHeaders() : {})
            },
            body: JSON.stringify({
              model,
              max_tokens: MAX_TOKENS,
              stream: true,
              messages: [{ role: 'system', content: system }, ...messages]
            })
          });
        } catch (e) { throw toNetworkError(e); }

        if (!res.ok) throw await toError(res);

        let any = false;
        for await (const payload of sseLines(res, signal)) {
          let json;
          try { json = JSON.parse(payload); } catch (_) { continue; }
          const delta = json?.choices?.[0]?.delta?.content;
          if (delta) { any = true; onDelta(delta); }
        }
        if (!any) { const e = new Error('empty'); e.kind = 'empty'; throw e; }
      }
    };
  }

  /* ── Providers ──────────────────────────────────────────── */
  const PROVIDERS = {

    groq: openAICompatible({
      id: 'groq',
      label: 'Groq',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'openai/gpt-oss-120b'],
      defaultModel: 'llama-3.3-70b-versatile',
      keyHint: 'gsk_…',
      keyUrl: 'https://console.groq.com/keys',
      note: { en: 'Fastest responses, generous free tier.', ar: 'أسرع الردود، وحصة مجانية سخية.' }
    }),

    openai: openAICompatible({
      id: 'openai',
      label: 'OpenAI',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      models: ['gpt-4.1-mini', 'gpt-4.1', 'gpt-4o-mini'],
      defaultModel: 'gpt-4.1-mini',
      keyHint: 'sk-…',
      keyUrl: 'https://platform.openai.com/api-keys',
      note: { en: 'Paid per token.', ar: 'مدفوع حسب الاستهلاك.' }
    }),

    openrouter: openAICompatible({
      id: 'openrouter',
      label: 'OpenRouter',
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      models: ['meta-llama/llama-3.3-70b-instruct', 'google/gemini-2.0-flash-001', 'anthropic/claude-sonnet-4.5'],
      defaultModel: 'meta-llama/llama-3.3-70b-instruct',
      keyHint: 'sk-or-v1-…',
      keyUrl: 'https://openrouter.ai/keys',
      note: { en: 'One key, many models — including free ones.', ar: 'مفتاح واحد لموديلات كثيرة — بعضها مجاني.' },
      extraHeaders: () => ({
        'HTTP-Referer': location.origin,
        'X-Title': 'Mahmoud Alyosify Portfolio'
      })
    }),

    gemini: {
      id: 'gemini',
      label: 'Google Gemini',
      models: ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro'],
      defaultModel: 'gemini-2.5-flash',
      keyHint: 'AIza…',
      keyUrl: 'https://aistudio.google.com/apikey',
      note: { en: 'Large free daily quota.', ar: 'حصة يومية مجانية كبيرة.' },
      browserSafe: true,

      async stream({ key, model, system, messages, signal, onDelta }) {
        // The key travels in the x-goog-api-key header, never the URL.
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;
        let res;
        try {
          res = await fetch(url, {
            method: 'POST',
            signal,
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: system }] },
              contents: messages.map((m) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
              })),
              generationConfig: { maxOutputTokens: MAX_TOKENS, temperature: 0.3 }
            })
          });
        } catch (e) { throw toNetworkError(e); }

        if (!res.ok) throw await toError(res);

        let any = false;
        for await (const payload of sseLines(res, signal)) {
          let json;
          try { json = JSON.parse(payload); } catch (_) { continue; }
          const parts = json?.candidates?.[0]?.content?.parts;
          if (!Array.isArray(parts)) continue;
          for (const p of parts) {
            if (p?.text) { any = true; onDelta(p.text); }
          }
        }
        if (!any) { const e = new Error('empty'); e.kind = 'empty'; throw e; }
      }
    },

    anthropic: {
      id: 'anthropic',
      label: 'Anthropic (Claude)',
      models: ['claude-sonnet-5', 'claude-haiku-4-5', 'claude-opus-5'],
      defaultModel: 'claude-sonnet-5',
      keyHint: 'sk-ant-…',
      keyUrl: 'https://console.anthropic.com/settings/keys',
      note: {
        en: 'Requires Anthropic\'s direct-browser-access header, which this page sends.',
        ar: 'يتطلب هيدر الوصول المباشر من المتصفح، وهذه الصفحة ترسله.'
      },
      browserSafe: true,

      async stream({ key, model, system, messages, signal, onDelta }) {
        let res;
        try {
          res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            signal,
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': key,
              'anthropic-version': '2023-06-01',
              // Anthropic blocks browser origins unless this opt-in is present.
              'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
              model,
              max_tokens: MAX_TOKENS,
              stream: true,
              system,
              messages
            })
          });
        } catch (e) { throw toNetworkError(e); }

        if (!res.ok) throw await toError(res);

        let any = false;
        for await (const payload of sseLines(res, signal)) {
          let json;
          try { json = JSON.parse(payload); } catch (_) { continue; }
          if (json.type === 'content_block_delta' && json.delta?.type === 'text_delta' && json.delta.text) {
            any = true;
            onDelta(json.delta.text);
          }
          if (json.type === 'error') {
            const e = new Error('provider error');
            e.status = 400;
            e.detail = window.MASecurity.redact(json.error?.message || '');
            throw e;
          }
        }
        if (!any) { const e = new Error('empty'); e.kind = 'empty'; throw e; }
      }
    }
  };

  const order = ['groq', 'gemini', 'openai', 'anthropic', 'openrouter'];

  function get(id) {
    const p = PROVIDERS[id];
    if (!p) { const e = new Error('unsupported'); e.kind = 'unsupported'; throw e; }
    return p;
  }

  return { PROVIDERS, order, get, MAX_TOKENS };
})();
