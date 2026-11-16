// proxy-local.mjs: chạy worker.js ngay trên Node (không cần wrangler/đăng nhập Cloudflare).
//   GEMINI_API_KEY=... node tests/proxy-local.mjs            kiểm tra logic (+ 1 lời gọi Gemini thật nếu có key)
//   GEMINI_API_KEY=... node tests/proxy-local.mjs --serve    mở proxy ở http://localhost:8787 để thử với trang thật
// Key chỉ đọc từ biến môi trường, không bao giờ in ra.
import http from 'node:http';
import worker from '../worker.js';

const KEY = process.env.GEMINI_API_KEY || '';
const ORIGIN = 'http://localhost:8216';
const env = { GEMINI_API_KEY: KEY, ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'https://xclipsex.github.io,' + ORIGIN, RATE_LIMIT: '1000' };
const PORT = Number(process.env.PORT || 8787);

if (process.argv.includes('--serve')) {
  http.createServer(async (req, res) => {
    const chunks = []; for await (const c of req) chunks.push(c);
    const headers = new Headers(); for (const [k, v] of Object.entries(req.headers)) headers.set(k, Array.isArray(v) ? v.join(',') : v);
    headers.set('CF-Connecting-IP', req.socket.remoteAddress || 'local');
    const r = await worker.fetch(new Request('http://localhost:' + PORT + req.url, { method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) }), env);
    res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer()));
  }).listen(PORT, () => console.log('proxy cục bộ: http://localhost:' + PORT));
} else {
  let failed = 0;
  const ok = (n, c, x) => { if (c) console.log('  ok  ', n); else { failed++; console.log('  FAIL', n, x === undefined ? '' : JSON.stringify(x)); } };
  const call = (path, init = {}, e = env) => worker.fetch(new Request('https://proxy.test' + path, init), e);
  const post = (path, body, origin = ORIGIN, extra = {}) => call(path, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json', Origin: origin }, extra), body: typeof body === 'string' ? body : JSON.stringify(body) });
  const gem = { contents: [{ parts: [{ text: 'Trả lời đúng một từ: xin chào' }] }], generationConfig: { temperature: 0 } };

  let r = await call('/health'); ok('health', r.status === 200 && (await r.json()).ok === true);
  r = await call('/gemini/gemini-3.6-flash', { method: 'OPTIONS', headers: { Origin: ORIGIN } });
  ok('preflight origin hợp lệ', r.status === 204 && r.headers.get('access-control-allow-origin') === ORIGIN);
  r = await call('/gemini/gemini-3.6-flash', { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } });
  ok('preflight origin lạ bị 403', r.status === 403 && !r.headers.get('access-control-allow-origin'));
  r = await post('/gemini/gemini-3.6-flash', gem, 'https://evil.example'); ok('POST origin lạ bị 403', r.status === 403);
  r = await call('/gemini/gemini-3.6-flash', { method: 'POST', body: '{}' }); ok('POST không Origin bị 403', r.status === 403);
  r = await post('/gemini/gemini-1.0-pro', gem); ok('model ngoài danh sách bị 400', r.status === 400);
  r = await post('/gemini/gemini-3.6-flash', 'x'.repeat(40000)); ok('body quá lớn bị 413', r.status === 413);
  r = await post('/gemini/gemini-3.6-flash', 'không phải json'); ok('body sai JSON bị 400', r.status === 400);
  r = await call('/gemini/gemini-3.6-flash', { method: 'GET', headers: { Origin: ORIGIN } }); ok('GET bị 405', r.status === 405);
  r = await post('/gemini/gemini-3.6-flash', gem, ORIGIN, {}); // token
  const tokEnv = Object.assign({}, env, { APP_TOKEN: 'abc' });
  r = await call('/gemini/gemini-3.6-flash', { method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'application/json' }, body: JSON.stringify(gem) }, tokEnv); ok('thiếu X-App-Token bị 401', r.status === 401);
  const lim = Object.assign({}, env, { RATE_LIMIT: '2', GEMINI_API_KEY: '' });
  const codes = []; for (let i = 0; i < 4; i++) codes.push((await call('/gemini/gemini-3.6-flash', { method: 'POST', headers: { Origin: ORIGIN, 'CF-Connecting-IP': '9.9.9.9' }, body: '{}' }, lim)).status);
  ok('rate limit: request thứ 3 trở đi bị 429', codes[2] === 429 && codes[3] === 429, codes);

  if (KEY) {
    r = await post('/gemini/gemini-3.6-flash', gem);
    const txt = await r.text();
    let answer = ''; try { answer = JSON.parse(txt).candidates[0].content.parts.map((p) => p.text || '').join('').trim(); } catch (e) { /* in bên dưới */ }
    ok('Gemini thật qua proxy trả lời (status ' + r.status + ')', r.status === 200 && answer.length > 0, r.status === 200 ? undefined : txt.slice(0, 200).split(KEY).join('***'));
    if (answer) console.log('       trả lời:', JSON.stringify(answer.slice(0, 80)));
    ok('phản hồi không chứa key', !txt.includes(KEY) && ![...r.headers.values()].some((v) => v.includes(KEY)));
  } else console.log('  (bỏ qua lời gọi thật: chưa đặt GEMINI_API_KEY)');
  console.log(failed ? '\n' + failed + ' THẤT BẠI' : '\nTẤT CẢ ĐẠT'); process.exit(failed ? 1 : 0);
}
