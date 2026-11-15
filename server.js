const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const ENV_FILE = path.join(ROOT, '.env.local');
const MAX_BODY_BYTES = 32 * 1024;
const MAX_MESSAGES = 20;
const rateLimits = new Map();

function loadLocalEnv() {
  if (!fs.existsSync(ENV_FILE)) return;
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  }
}

loadLocalEnv();

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(JSON.stringify(body));
}

function loadCatalog() {
  const sandbox = { window: {} };
  const source = fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8');
  vm.runInNewContext(source, sandbox, { timeout: 1000 });
  const products = sandbox.window.PRODUCTS || [];
  return products.map((product) => ({
    name: product.name,
    type: product.craftTypeName,
    priceEGP: product.price,
    available: product.inStock,
    description: product.description,
    details: product.details
  }));
}

function withinRateLimit(request) {
  const forwarded = request.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : request.socket.remoteAddress;
  const now = Date.now();
  const windowMs = 60_000;
  const previous = rateLimits.get(ip);
  const state = previous && now - previous.startedAt < windowMs
    ? previous
    : { startedAt: now, count: 0 };
  state.count += 1;
  rateLimits.set(ip, state);
  return state.count <= 20;
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error('request_too_large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function handleChat(request, response) {
  if (request.method !== 'POST') return sendJson(response, 405, { error: 'الطريقة غير مدعومة.' });
  if (!process.env.GROQ_API_KEY) return sendJson(response, 503, { error: 'إعداد خدمة المحادثة غير مكتمل.' });
  if (!withinRateLimit(request)) return sendJson(response, 429, { error: 'فيه رسائل كتير بسرعة. جرّب تاني بعد دقيقة.' });

  let body;
  try {
    body = await readJsonBody(request);
  } catch {
    return sendJson(response, 400, { error: 'تعذر قراءة الرسالة.' });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
  const input = messages
    .filter((message) => message && ['user', 'assistant'].includes(message.role) && typeof message.content === 'string')
    .map((message) => ({ role: message.role, content: message.content.trim().slice(0, 1200) }))
    .filter((message) => message.content);

  if (!input.length || input[input.length - 1].role !== 'user') {
    return sendJson(response, 400, { error: 'اكتب سؤالك الأول.' });
  }

  let catalog;
  try {
    catalog = loadCatalog();
  } catch {
    return sendJson(response, 500, { error: 'تعذر تحميل بيانات المنتجات.' });
  }

  const instructions = [
    'أنت مساعد التسوق لمتجر غُرزة للحرف اليدوية المصرية. أجب بالعربية المصرية وبأسلوب ودود ومختصر.',
    'استخدم كتالوج المنتجات أدناه فقط عند ذكر الأسعار أو التوفر أو الخامات. لا تخترع معلومات، وإذا لم تجد المعلومة فقل ذلك بوضوح.',
    'ساعد العميل في اختيار المنتج، وأوضح أن الأسعار بالجنيه المصري. لا تطلب بيانات دفع أو معلومات شخصية داخل المحادثة.',
    `كتالوج المنتجات الحالي: ${JSON.stringify(catalog)}`
  ].join('\n\n');

  const systemMessage = { role: 'system', content: instructions };
  const chatMessages = [systemMessage, ...input];

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
    return sendJson(response, 502, { error: 'مش قادر أوصل لخدمة المحادثة دلوقتي. جرّب بعد شوية.' });
  }

  const result = await upstream.json().catch(() => ({}));
  console.log('[Groq] status:', upstream.status);
  if (!upstream.ok) {
    console.error('[Groq] error body:', JSON.stringify(result).slice(0, 200));
    return sendJson(response, 502, { error: 'حصلت مشكلة في الرد. جرّب تاني بعد شوية.' });
  }

  const reply = result.choices?.[0]?.message?.content?.trim() ?? '';

  if (!reply) return sendJson(response, 502, { error: 'ملقتش رد مناسب دلوقتي. جرّب صياغة السؤال بطريقة تانية.' });
  return sendJson(response, 200, { reply });
}

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

function serveStatic(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405);
    return response.end('Method Not Allowed');
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400);
    return response.end('Bad Request');
  }

  const relativePath = pathname.replace(/^\/+/, '') || 'index.html';
  const filePath = path.resolve(ROOT, relativePath);
  if (!filePath.startsWith(ROOT + path.sep) || path.basename(filePath).startsWith('.')) {
    response.writeHead(404);
    return response.end('Not Found');
  }

  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) {
      response.writeHead(404);
      return response.end('Not Found');
    }
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff'
    });
    if (request.method === 'HEAD') return response.end();
    fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  if (pathname === '/api/chat') return void handleChat(request, response);
  serveStatic(request, response);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`غُرزة تعمل على http://127.0.0.1:${PORT}`);
});
