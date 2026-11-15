const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const MAX_MESSAGES = 20;
const MAX_BODY_BYTES = 32 * 1024;
const rateLimits = new Map();

function withinRateLimit(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : 'unknown';
  const now = Date.now();
  const windowMs = 60_000;
  const prev = rateLimits.get(ip);
  const state = prev && now - prev.startedAt < windowMs ? prev : { startedAt: now, count: 0 };
  state.count += 1;
  rateLimits.set(ip, state);
  return state.count <= 20;
}

function loadCatalog() {
  const sandbox = { window: {} };
  const source = fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8');
  vm.runInNewContext(source, sandbox, { timeout: 1000 });
  const products = sandbox.window.PRODUCTS || [];
  return products.map((p) => ({
    name: p.name,
    type: p.craftTypeName,
    priceEGP: p.price,
    available: p.inStock,
    description: p.description,
    details: p.details
  }));
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) return reject(new Error('too_large'));
      chunks.push(chunk);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(new Error('invalid_json')); }
    });
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'الطريقة غير مدعومة.' });
  }
  if (!process.env.GROQ_API_KEY) {
    return res.status(503).json({ error: 'إعداد خدمة المحادثة غير مكتمل.' });
  }
  if (!withinRateLimit(req)) {
    return res.status(429).json({ error: 'فيه رسائل كتير بسرعة. جرّب تاني بعد دقيقة.' });
  }

  let body;
  try { body = await readBody(req); }
  catch { return res.status(400).json({ error: 'تعذر قراءة الرسالة.' }); }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
  const input = messages
    .filter((m) => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 1200) }))
    .filter((m) => m.content);

  if (!input.length || input[input.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'اكتب سؤالك الأول.' });
  }

  let catalog;
  try { catalog = loadCatalog(); }
  catch { return res.status(500).json({ error: 'تعذر تحميل بيانات المنتجات.' }); }

  const instructions = [
    'أنت مساعد التسوق لمتجر غُرزة للحرف اليدوية المصرية. أجب بالعربية المصرية وبأسلوب ودود ومختصر.',
    'استخدم كتالوج المنتجات أدناه فقط عند ذكر الأسعار أو التوفر أو الخامات. لا تخترع معلومات، وإذا لم تجد المعلومة فقل ذلك بوضوح.',
    'ساعد العميل في اختيار المنتج، وأوضح أن الأسعار بالجنيه المصري. لا تطلب بيانات دفع أو معلومات شخصية داخل المحادثة.',
    `كتالوج المنتجات الحالي: ${JSON.stringify(catalog)}`
  ].join('\n\n');

  const chatMessages = [{ role: 'system', content: instructions }, ...input];

  let upstream;
  try {
    upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
        messages: chatMessages,
        max_tokens: 500
      }),
      signal: AbortSignal.timeout(30_000)
    });
  } catch (err) {
    console.error('[Groq] fetch error:', err.message);
    return res.status(502).json({ error: 'مش قادر أوصل لخدمة المحادثة دلوقتي. جرّب بعد شوية.' });
  }

  const result = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    console.error('[Groq] error:', JSON.stringify(result).slice(0, 200));
    return res.status(502).json({ error: 'حصلت مشكلة في الرد. جرّب تاني بعد شوية.' });
  }

  const reply = result.choices?.[0]?.message?.content?.trim() ?? '';
  if (!reply) return res.status(502).json({ error: 'ملقتش رد مناسب دلوقتي. جرّب صياغة السؤال بطريقة تانية.' });

  return res.status(200).json({ reply });
};
