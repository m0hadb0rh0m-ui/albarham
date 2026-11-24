(function () {
  'use strict';
  const config = window.FAMILY_SECURITY_CONFIG || {};
  const provider = config.hcaptchaSiteKey ? 'hcaptcha' : 'turnstile';
  const key = config.hcaptchaSiteKey || config.turnstileSiteKey || '';
  const getApi = () => window[provider];
  const states = new WeakMap();
  let loading;
  function load() {
    if (getApi()) return Promise.resolve(getApi());
    if (!loading) loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = provider === 'hcaptcha' ? 'https://js.hcaptcha.com/1/api.js?render=explicit&hl=ar' : 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      const timer = setTimeout(() => { script.remove(); loading = null; reject(Error('CAPTCHA unavailable')); }, 15000);
      script.onload = () => { clearTimeout(timer); if (getApi()) resolve(getApi()); else { loading = null; reject(Error('CAPTCHA unavailable')); } };
      script.onerror = () => { clearTimeout(timer); script.remove(); loading = null; reject(Error('CAPTCHA unavailable')); };
      document.head.appendChild(script);
    });
    return loading;
  }
  async function prepare(form) {
    if (!key || !form || states.has(form)) return;
    const state = { id: null, token: '', ready: null };
    states.set(form, state);
    const container = document.createElement('div');
    container.setAttribute('aria-label', 'التحقق الأمني');
    form.insertBefore(container, form.querySelector('button[type="submit"]'));
    state.ready = load().then(api => {
      state.id = api.render(container, {
        sitekey: key, theme: provider === 'hcaptcha' ? 'light' : 'auto', ...(provider === 'turnstile' ? {language:'ar'} : {}),
        callback: token => { state.token = token; },
        'expired-callback': () => { state.token = ''; },
        'error-callback': () => { state.token = ''; }
      });
    });
    try { await state.ready; } catch (e) { container.remove(); states.delete(form); throw e; }
  }
  async function token(form) {
    if (!key) return undefined;
    await prepare(form);
    const state = states.get(form);
    await state.ready;
    if (!state.token) throw Error('أكمل التحقق الأمني أولًا ثم أعد المحاولة.');
    const value = state.token;
    state.token = '';
    return value;
  }
  function reset(form) {
    const state = states.get(form);
    if (state && state.id !== null) {
      state.token = '';
      try { getApi().reset(state.id); } catch (_) {}
    }
  }
  window.familyCaptcha = Object.freeze({ enabled: Boolean(key), provider, prepare, token, reset });
})();
