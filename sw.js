self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => new Response(
      '<html lang="ar" dir="rtl"><meta charset="utf-8"><body style="font-family:sans-serif;text-align:center;padding:3rem"><h1>آل برهم</h1><p>يرجى الاتصال بالإنترنت للوصول إلى حسابك.</p></body></html>', {
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      })));
  }
});
