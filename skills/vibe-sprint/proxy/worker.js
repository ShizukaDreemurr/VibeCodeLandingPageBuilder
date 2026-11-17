/* worker.js - Proxy Gemini cho Cloudflare Workers (gói miễn phí).
   Trình duyệt gọi:  POST https://<worker>/gemini/<model>   (cùng body với Gemini generateContent)
   Worker giữ GEMINI_API_KEY (secret), chỉ chuyển tiếp tới model trong danh sách cho phép, và KHÔNG BAO GIỜ trả key về.
   Biến môi trường:
     GEMINI_API_KEY   (secret, bắt buộc)  wrangler secret put GEMINI_API_KEY
     ALLOWED_ORIGINS  (var)  danh sách origin cho phép, cách nhau dấu phẩy, vd "https://ten.github.io,http://localhost:8211"
     APP_TOKEN        (secret, tuỳ chọn)  nếu đặt, trình duyệt phải gửi header X-App-Token trùng giá trị.
                      CHỈ LÀ LÀM RÀO: token nằm trong JS của trang nên ai xem mã nguồn cũng thấy. Đừng coi là bảo mật thật.
     RATE_LIMIT       (var, tuỳ chọn)  số request/phút/IP, mặc định 30. Bộ đếm nằm trong RAM của từng isolate nên chỉ là best-effort. */

const MODELS = ['gemini-3.6-flash', 'gemini-4-hydrogen', 'gemini-3.8-flash'];
const UPSTREAM = 'https://generativelanguage.googleapis.com/v1beta/models/';
const MAX_BODY = 32 * 1024;
const TIMEOUT_MS = 25000;
const WINDOW_MS = 60000;
const hits = new Map(); // ip -> { n, reset }

function origins(env) { return String(env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim().replace(/\/$/, '').toLowerCase()).filter(Boolean); }

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-App-Token',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

function json(status, obj, extra) {
  return new Response(JSON.stringify(obj), { status, headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, extra || {}) });
}

function limited(ip, env) {
  const max = Number(env.RATE_LIMIT) || 30, now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  let h = hits.get(ip);
  if (!h || h.reset < now) { h = { n: 0, reset: now + WINDOW_MS }; hits.set(ip, h); }
  h.n++;
  return h.n > max;
}

async function handle(request, env) {
  const url = new URL(request.url);
  const rawOrigin = (request.headers.get('Origin') || '').trim().replace(/\/$/, '');
  const origin = rawOrigin.toLowerCase();

  if (url.pathname === '/health' && request.method === 'GET') return json(200, { ok: true });

  const allowed = origins(env);
  if (!origin || allowed.indexOf(origin) < 0) return json(403, { error: 'origin_not_allowed' });
  const cors = corsHeaders(rawOrigin);

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

  const m = /^\/gemini\/([A-Za-z0-9._-]+)$/.exec(url.pathname);
  if (!m) return json(404, { error: 'not_found' }, cors);
  if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' }, cors);
  const model = m[1];
  if (MODELS.indexOf(model) < 0) return json(400, { error: 'model_not_allowed' }, cors);

  if (env.APP_TOKEN && request.headers.get('X-App-Token') !== env.APP_TOKEN) return json(401, { error: 'bad_app_token' }, cors);

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (limited(ip, env)) return json(429, { error: 'rate_limited' }, Object.assign({ 'Retry-After': '30' }, cors));

  const declared = Number(request.headers.get('Content-Length') || 0);
  if (declared > MAX_BODY) return json(413, { error: 'body_too_large' }, cors);
  const text = await request.text();
  if (text.length > MAX_BODY) return json(413, { error: 'body_too_large' }, cors);
  try { JSON.parse(text); } catch (e) { return json(400, { error: 'invalid_json' }, cors); }
  if (!env.GEMINI_API_KEY) return json(500, { error: 'proxy_not_configured' }, cors);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const up = await fetch(UPSTREAM + model + ':generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: text,
      signal: ctrl.signal
    });
    const body = await up.text();
    // Phòng hờ: nếu upstream lỡ phản chiếu key thì che đi trước khi trả về.
    const safe = body.split(env.GEMINI_API_KEY).join('[redacted]');
    return new Response(safe, { status: up.status, headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, cors) });
  } catch (e) {
    return json(e && e.name === 'AbortError' ? 504 : 502, { error: e && e.name === 'AbortError' ? 'upstream_timeout' : 'upstream_unreachable' }, cors);
  } finally { clearTimeout(timer); }
}

export default {
  async fetch(request, env) {
    try { return await handle(request, env); } catch (e) { return json(500, { error: 'internal_error' }); }
  }
};
export { MODELS, handle };
