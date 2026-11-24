self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const request = e.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || request.mode !== 'navigate' ||
      url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  e.respondWith(fetch(request, { cache: 'no-store' }).catch(() => new Response(
    '<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>آل برهم</title><h1>آل برهم</h1><p>يرجى الاتصال بالإنترنت للوصول إلى حسابك.</p></html>', {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Content-Security-Policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff'
      }
    })));
});
