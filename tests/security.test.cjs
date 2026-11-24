const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('portal.js', 'utf8');

test('HTML policy excludes unsafe script execution and mixed content', () => {
  const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/i)[1];
  const scripts = csp.split(';').find(x => x.trim().startsWith('script-src '));
  assert.ok(!/unsafe-inline|unsafe-eval/.test(scripts));
  const wildcards = scripts.trim().split(/\s+/).filter(x => x.includes('*'));
  assert.deepEqual(wildcards, ['https://*.hcaptcha.com']);
  for (const rule of ["object-src 'none'", "base-uri 'self'", "form-action 'self'", "upgrade-insecure-requests"]) assert.ok(csp.includes(rule));
  assert.match(html, /name="referrer" content="no-referrer"/);
  assert.doesNotMatch(html, /\s(onclick|onload|onerror|onsubmit)\s*=/i);
});
test('new password policy and server identity check remain present', () => {
  const source = js.match(/function validNewPassword\(value\) \{[\s\S]*?\n  \}/)[0];
  const check = vm.runInNewContext('(' + source + ')');
  assert.equal(check('x'.repeat(14)), false);
  assert.equal(check('x'.repeat(15)), true);
  assert.equal(check('x'.repeat(129)), false);
  assert.equal(check('🔒'.repeat(15)), true);
  const guard = js.slice(js.indexOf('async function guardPrivate'), js.indexOf('async function loadMfa'));
  assert.ok(guard.indexOf('auth.getUser()') < guard.indexOf('await fn()'));
  assert.match(guard, /verifiedUser\.data\.user\.id !== session\.data\.session\.user\.id/);
});
test('service worker uses no-store, ignores out-of-scope and non-navigation requests', async () => {
  const handlers = {};
  let calls = [];
  vm.runInNewContext(fs.readFileSync('sw.js','utf8'), {
    self: { location: {origin:'https://example.test'}, registration:{scope:'https://example.test/albarham/'}, addEventListener:(name, fn)=>handlers[name]=fn },
    URL, Response, fetch: async (req, opts) => { calls.push(opts); throw Error('offline'); }
  });
  let result;
  const event = (url, method='GET', mode='navigate') => ({request:{url,method,mode},respondWith(p){result=p;}});
  handlers.fetch(event('https://elsewhere.test/albarham/'));
  handlers.fetch(event('https://example.test/other/'));
  handlers.fetch(event('https://example.test/albarham/', 'POST'));
  handlers.fetch(event('https://example.test/albarham/', 'GET', 'cors'));
  assert.equal(calls.length, 0);
  assert.equal(result, undefined);
  handlers.fetch(event('https://example.test/albarham/'));
  const response = await result;
  assert.equal(calls[0].cache, 'no-store');
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
});

test('live header assessment does not treat missing headers as enabled', () => {
  const source = js.slice(js.indexOf('function assessSecurityHeaders('), js.indexOf('function verifiedCheckState('));
  const check = vm.runInNewContext('(' + source.trim() + ')');
  assert.equal(check(new Headers()).filter(x => x[1]).length, 0);
  const response = new Headers({
    'Content-Security-Policy': "default-src 'self'; frame-ancestors 'none'",
    'Strict-Transport-Security': 'max-age=31536000',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  });
  assert.equal(check(response).filter(x => x[1]).length, 6);
  assert.equal(check(new Headers({'Strict-Transport-Security':'max-age=0'}))[2][1], false);
});

test('Arabic search normalizes common orthography and diacritics', () => {
  const src = js.slice(js.indexOf('function normalizeSearch('), js.indexOf('function attachSearch('));
  const normalize = vm.runInNewContext('(' + src.trim() + ')');
  assert.equal(normalize(' أَحْمَد '), 'احمد');
  assert.equal(normalize('مُصطفى'), 'مصطفي');
  assert.equal(normalize(null), '');
});
test('Vercel security headers and hCaptcha opt-in configuration', () => {
  const config = JSON.parse(fs.readFileSync('vercel.json','utf8'));
  const headers = Object.fromEntries(config.headers[0].headers.map(x=>[x.key,x.value]));
  assert.equal(headers['X-Frame-Options'],'DENY');
  assert.match(headers['Content-Security-Policy'], /frame-ancestors 'none'/);
  assert.match(headers['Content-Security-Policy'], /https:\/\/\*\.hcaptcha\.com/);
  const env = {window:{}};
  vm.runInNewContext(fs.readFileSync('security-config.js','utf8'), env);
  vm.runInNewContext(fs.readFileSync('captcha.js','utf8'), env);
  assert.equal(env.window.familyCaptcha.enabled, false);
});

test('pinned external libraries carry SRI and anonymous CORS', () => {
  assert.match(html, /supabase-js@2\.119\.2\/dist\/umd\/supabase\.js" integrity="sha384-[A-Za-z0-9+/]{64}" crossorigin="anonymous"/);
  assert.match(js, /script\.integrity = 'sha384-[A-Za-z0-9+/]{64}'/);
  assert.match(js, /script\.crossOrigin = 'anonymous'/);
});

test('security center distinguishes verified, failed and missing checks', () => {
  const src = js.slice(js.indexOf('function verifiedCheckState('), js.indexOf('function mountInfrastructureStatus('));
  const check = vm.runInNewContext('(' + src.trim() + ')');
  assert.equal(check({checks:[{id:'a',state:'pass'}]},['a']), 'pass');
  assert.equal(check({checks:[{id:'a',state:'pass'}]},['a','b']), 'warn');
  assert.equal(check({checks:[{id:'a',state:'fail'}]},['a','b']), 'fail');
  assert.equal(check(null,['a']), 'warn');
});

test('password exposure screen sends only the padded hash prefix and rejects known leaks', async () => {
  const src = js.slice(js.indexOf('async function passwordLeakState('), js.indexOf('async function requirePasswordScreen('));
  const check = vm.runInNewContext('(' + src.trim() + ')', {AbortController,TextEncoder,Uint8Array,setTimeout,clearTimeout});
  const cryptoApi = require('node:crypto').webcrypto;
  const hash = require('node:crypto').createHash('sha1').update('test-password').digest('hex').toUpperCase();
  const mock = async (url,opts) => {
    assert.equal(url,'https://api.pwnedpasswords.com/range/'+hash.slice(0,5));
    assert.equal(opts.headers['Add-Padding'],'true');
    assert.equal(opts.credentials,'omit');
    return {ok:true,text:async()=>hash.slice(5)+':7'};
  };
  assert.equal(await check('test-password',mock,cryptoApi),'leaked');
  assert.equal(await check('test-password',async()=>({ok:true,text:async()=>hash.slice(5)+':0'}),cryptoApi),'not-found');
  assert.equal(await check('test-password',async()=>{throw Error('offline')},cryptoApi),'unavailable');
  assert.equal(await check('test-password',async()=>({ok:true,text:async()=>'<html>'}),cryptoApi),'unavailable');
});

test('release keeps footer identity and deferred scripts in dependency order', () => {
  assert.match(html, /class="footer-wordmark" lang="ar">آل برهم/);
  assert.match(html, /class="footer-english" lang="en" dir="ltr">Albarham 2026/);
  assert.match(html, /class="footer-signature"/);
  const scripts = Array.from(html.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/g));
  assert.equal(scripts.length,4);
  assert.ok(scripts.every(x => x[0].includes('defer')));
  assert.ok(scripts[0][1].includes('supabase'));
  assert.ok(scripts[3][1].includes('portal.js'));
  const css = fs.readFileSync('portal.css','utf8');
  assert.match(css,/--glass-surface:/);
  assert.match(css,/prefers-reduced-motion/);
  assert.match(js,/new IntersectionObserver/);
  assert.match(js,/im.fetchPriority = priority \? 'high' : 'low'/);
});

test('featured announcement does not inherit the light glass card surface', () => {
  const css = fs.readFileSync('portal.css','utf8');
  const glassRule = css.match(/([^{}]+)\{\s*background-color:var\(--surface\);background-image:var\(--glass-surface\);\s*border-color:var\(--glass-border\)/);
  assert.ok(glassRule);
  assert.ok(!glassRule[1].includes('.home-news-card'));
  const release = css.slice(css.indexOf('/* Release 38:'));
  assert.match(release,/\.home-news-card\{\s*background:#123b30/);
  assert.match(release,/\.home-news-card h3\{color:#fffaf0\}/);
  assert.match(release,/\.home-news-card p\{color:#f2f4ed\}/);
  assert.match(html,/portal\.css\?v=38/);
});
