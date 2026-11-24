(function() {
  document.documentElement.setAttribute('dir', 'rtl');
  document.documentElement.setAttribute('lang', 'ar');
  var NAV = [
    ['home', 'الرئيسية'],
    ['news', 'الأخبار'],
    ['heritage', 'العائلة والتراث'],
    ['community', 'المجتمع'],
    ['membership', 'العضوية والتحقق']
  ];
  var FEAT = [
    ['history', 'landmark', 'تاريخ العائلة', 'الذاكرة والإرث'],
    ['tree', 'users', 'الأنساب', 'سجل القرابات'],
    ['archive', 'file', 'الأرشيف', 'وثائق العائلة'],
    ['events', 'heart', 'المناسبات', 'الأخبار الاجتماعية'],
    ['initiatives', 'heart', 'المبادرات', 'التكافل والتعاون'],
    ['membership', 'shield', 'العضوية', 'الانضمام والتحقق']
  ];
  var SERV = [
    ['الهوية والملف', 'البطاقة الرقمية والشهادة والملف الشخصي.'],
    ['العائلة والكفاءات', 'سجل القرابات ودليل المهن الاختياري.'],
    ['الإشعارات والمحتوى', 'الرسائل الخاصة والأرشيف والمناسبات المنشورة.'],
    ['الطلبات والتكافل', 'المبادرات والمقترحات وطلبات التكافل الخاصة.']
  ];
  var $ = function(s, r) {
    return (r || document).querySelector(s)
  };
  var nav = $('#nav');
  var skip = $('.skip-link');
  if (skip) skip.addEventListener('click', e => {
    e.preventDefault();
    var main = $('#main-content');
    if (main) {
      main.focus();
      main.scrollIntoView({
        block: 'start'
      });
    }
  });
  nav.innerHTML = NAV.map(function(n) {
    return '<a href="#' + n[0] + '" data-r="' + n[0] + '">' + n[1] + '</a>'
  }).join('');

  $('#features').innerHTML = FEAT.map(function(f) {
    return '<a class="card" href="#' + f[0] + '"><div class="ic"><svg width="26" height="26"><use href="#i-' + f[
      1] + '"/></svg></div><h3>' + f[2] + '</h3><p>' + f[3] + '</p><span class="more">استكشف القسم ←</span></a>'
  }).join('');
  if ($('#services')) $('#services').innerHTML = SERV.map(function(s, i) {
    return '<div class="card"><span class="chip c-ok">للأعضاء المعتمدين</span><h3>' + s[0] + '</h3><p>' + s[1] +
      '</p></div>'
  }).join('');

  var h = new Date().getHours(),
    g = document.getElementById('greet');
  g.textContent = (h >= 5 && h < 12 ? 'صباح الخير' : h >= 12 && h < 17 ? 'نهارك سعيد' : h >= 17 && h < 21 ?
    'مساء الخير' : 'ليلتك سعيدة') + '، أهلًا بك في بيتنا';
  var views = [].slice.call(document.querySelectorAll('.view'));
  var hdr = $('#hdr'),
    btn = $('#menuBtn');

  function route() {
    var r = (location.hash || '#home').slice(1) || 'home';
    if (r.startsWith('verify/')) r = 'verify';
    if (r.startsWith('news/')) r = 'news';
    var el = document.getElementById('v-' + r) || document.getElementById('v-notfound');
    views.forEach(function(v) {
      v.hidden = v !== el
    });
    document.title = (el.dataset.title && r !== 'home' ? el.dataset.title + ' | ' : '') + 'آل برهم';
    [].forEach.call(nav.children, function(a) {
      if (a.dataset.r === r || (a.dataset.r === 'heritage' && ['history', 'archive', 'tree', 'stories'].includes(
          r)) || (a.dataset.r === 'community' && ['events', 'initiatives', 'contact'].includes(r)) || (a.dataset
          .r === 'membership' && ['verify', 'certificate', 'card', 'verify-demo'].includes(r))) a.setAttribute(
        'aria-current', 'page');
      else a.removeAttribute('aria-current')
    });
    hdr.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }
  // Explicit entry via query string works even in browsers that strip URL fragments.
  var requestedPage = new URLSearchParams(location.search).get('page');
  if (['register', 'certificate', 'login', 'account', 'admin', 'member-hub', 'member-services-admin', 'reset',
      'news-admin', 'mfa', 'security'
    ].includes(requestedPage) && !/access_token=|error=|code=/.test(location.hash)) {
    var entry = new URL(location.href);
    entry.searchParams.delete('page');
    entry.hash = requestedPage;
    history.replaceState(null, '', entry.toString());
  }
  window.addEventListener('hashchange', route);
  route();
  btn.addEventListener('click', function() {
    var o = hdr.classList.toggle('open');
    btn.setAttribute('aria-expanded', o)
  });

  var same = $('#r-same');

  function syncWa() {
    $('#r-wa').disabled = same.checked;
    $('#r-wcc').disabled = same.checked;
  }
  same.addEventListener('change', syncWa);
  syncWa();

  function show(id, t, err) {
    var m = $(id);
    m.hidden = false;
    m.className = 'msg' + (err ? ' err' : '');
    m.textContent = t;
  }
  var authClient;

  function client() {
    if (!window.supabase) throw Error('تعذر تحميل مكتبة الاتصال؛ افتح الموقع في متصفح Chrome');
    return authClient || (authClient = window.supabase.createClient('https://vfxxghfmkmgdqrczeowx.supabase.co',
      'sb_publishable_-LW-iVjvk4hmvdzcR9jgYw_my4buOkw', {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }));
  }

  function phone(cc, v) {
    v = v.trim().replace(/[٠-٩]/g, x => String('٠١٢٣٤٥٦٧٨٩'.indexOf(x))).replace(/[\s()-]/g, '');
    if (v.startsWith('00')) v = '+' + v.slice(2);
    return v.startsWith('+') ? v : cc + v.replace(/^0+/, '');
  }
  var statusLabels = {
    pending_email: 'بانتظار تأكيد البريد',
    under_review: 'قيد المراجعة',
    more_info: 'مطلوب استكمال معلومات',
    approved: 'معتمدة',
    rejected: 'مرفوضة',
    suspended: 'موقوفة',
    revoked: 'ملغاة'
  };
  var panel = document.createElement('section');
  panel.className = 'view';
  panel.id = 'v-account';
  panel.hidden = true;
  panel.dataset.title = 'حسابي';
  panel.innerHTML =
    '<div class="wrap sec"><h1>حسابي</h1><p id="account-status" role="status"></p><form id="completeForm" hidden><h2>استكمال طلب العضوية</h2><label class="f">الاسم الكامل<input id="c-name" required maxlength="200"></label><label class="f">الهاتف مع رمز الدولة<input id="c-phone" placeholder="+970..." required></label><label class="f">واتساب مع رمز الدولة<input id="c-wa" placeholder="+970..." required></label><label><input type="checkbox" id="c-ok" required> أوافق على حفظ بيانات طلبي وفق سياسة الخصوصية.</label><button class="btn" type="submit">إرسال طلب العضوية</button></form><p id="account-note"></p><button class="btn" id="logout" type="button">تسجيل الخروج</button></div>';
  document.querySelector('main').appendChild(panel);
  views.push(panel);
  async function account() {
    var session = await client().auth.getSession();
    if (session.error) {
      $('#account-status').textContent = 'تعذر استعادة الجلسة. تحقق من الاتصال ثم أعد المحاولة.';
      return;
    }
    if (!session.data.session) {
      location.hash = 'login';
      return;
    }
    var s = await client().auth.getUser();
    if (s.error || !s.data.user) {
      $('#account-status').textContent = 'تعذر التحقق من الحساب الآن. أعد المحاولة عند استقرار الاتصال.';
      return;
    }
    var u = s.data.user;
    $('#member-welcome').textContent = 'أهلًا بك، ' + (u.user_metadata?.full_name || u.email);
    $('#member-email').textContent = u.email;
    var adm = await client().rpc('family_is_admin');
    adminShortcut.hidden = adm.error || adm.data !== true;
    var q = await client().from('member_applications').select('full_name,status,membership_number,submitted_at').eq(
      'auth_user_id', u.id).maybeSingle();
    if (q.error) {
      $('#account-status').textContent = 'تعذر قراءة حالة الطلب.';
      return;
    }
    $('#account-status').textContent = q.data ? 'حالة العضوية: ' + (statusLabels[q.data.status] || 'قيد المراجعة') +
      (q.data.membership_number ? ' | رقم العضوية: ' + q.data.membership_number : '') :
      'أكمل طلب عضويتك بعد تأكيد البريد.';
    $('#completeForm').hidden = !!q.data;
    $('#member-number').textContent = q.data?.membership_number || 'لم يصدر بعد';
    $('#member-certificate').hidden = q.data?.status !== 'approved';
    hubLink.hidden = q.data?.status !== 'approved';
    if (q.data?.status === 'approved') {
      var notice = await client().from('family_member_notices').select('id', {
        count: 'exact',
        head: true
      }).eq('user_id', u.id).is('read_at', null);
      hubLink.textContent = 'مجلس العضو الرقمي' + (!notice.error && notice.count ? ' (' + notice.count + ' جديد)' :
        '');
    }
    var m = u.user_metadata || {};
    $('#c-name').value = m.full_name || '';
    $('#c-phone').value = m.phone || '';
    $('#c-wa').value = m.whatsapp || '';
  }
  async function submitApplication(name, p, w) {
    var z = await client().rpc('submit_family_application', {
      p_name: name,
      p_phone: p,
      p_whatsapp: w,
      p_consent: true
    });
    if (z.error) throw Error('تعذر تقديم الطلب. تحقق من تأكيد البريد وصحة الأرقام.');
  }

  function validNewPassword(value) {
    const length = Array.from(value).length;
    return length >= 15 && length <= 128;
  }

  function authError(err) {
    var code = err.code || err.error_code || '';
    var messages = {
      email_address_not_authorized: 'خدمة البريد الحالية لا تسمح بهذا العنوان. يجب تفعيل SMTP في Supabase.',
      over_email_send_rate_limit: 'تم تجاوز حد إرسال رسائل التأكيد. حاول لاحقًا.',
      signup_disabled: 'إنشاء الحسابات معطل في إعدادات Supabase.',
      email_provider_disabled: 'مزود البريد غير مفعّل.',
      weak_password: 'كلمة المرور لا تحقق شروط الأمان.',
      email_exists: 'استلمت خدمة التسجيل الطلب. تحقق من صندوق البريد والرسائل غير المرغوب فيها، ثم سجل الدخول.',
      user_already_exists: 'استلمت خدمة التسجيل الطلب. تحقق من صندوق البريد والرسائل غير المرغوب فيها، ثم سجل الدخول.',
      captcha_failed: 'يلزم التحقق الأمني قبل التسجيل.',
      validation_failed: 'تحقق من صحة البريد والبيانات.'
    };
    return Object.prototype.hasOwnProperty.call(messages, code) ? messages[code] :
      'تعذر التسجيل. تحقق من الاتصال بالإنترنت وخدمة المصادقة.';
  }
  $('#regForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    var b = this.querySelector('button[type=submit]');
    if (b.disabled) return;
    var name = $('#r-name').value.trim(),
      email = $('#r-mail').value.trim(),
      pw = $('#r-pw').value,
      p = phone($('#r-cc').value, $('#r-phone').value),
      w = same.checked ? p : phone($('#r-wcc').value, $('#r-wa').value);
    if (name.length < 4 || name.length > 200) return show('#r-msg', 'أدخل الاسم الكامل.', 1);
    if (!/^\+[0-9]{7,15}$/.test(p)) return show('#r-msg', 'أدخل رقم الهاتف الصحيح واختر مفتاح الدولة.', 1);
    if (!/^\+[0-9]{7,15}$/.test(w)) return show('#r-msg', 'تحقق من رقم واتساب.', 1);
    if (!/^\S+@\S+\.\S+$/.test(email)) return show('#r-msg', 'أدخل بريدًا إلكترونيًا صحيحًا.', 1);
    if (!validNewPassword(pw)) return show('#r-msg', 'اختر كلمة مرور من ١٥ إلى ١٢٨ حرفًا.', 1);
    if (pw !== $('#r-pw2').value) return show('#r-msg', 'كلمتا المرور غير متطابقتين.', 1);
    if (!$('#r-ok').checked) return show('#r-msg', 'وافق على سياسة الخصوصية أولًا.', 1);
    b.disabled = true;
    show('#r-msg', 'جارٍ الاتصال بخدمة التسجيل...', 0);
    try {
      if (window.familyCaptcha.enabled) {
        const captchaToken = await window.familyCaptcha.token(this);
        const signup = await client().auth.signUp({email, password: pw, options: {emailRedirectTo: location.origin + location.pathname, data: {full_name: name, phone: p, whatsapp: w}, captchaToken}});
        if (signup.error) return show('#r-msg', authError(signup.error), 1);
        if (signup.data.session) { location.hash = 'account'; await account(); return; }
        show('#r-msg', 'استلمت خدمة التسجيل الطلب. تحقق من صندوق البريد والرسائل غير المرغوب فيها، ثم سجل الدخول.', 0);
        this.reset(); syncWa(); return;
      }
      var endpoint = 'https://vfxxghfmkmgdqrczeowx.supabase.co/auth/v1/signup?redirect_to=' +
        encodeURIComponent(location.origin + location.pathname);
      var response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_-LW-iVjvk4hmvdzcR9jgYw_my4buOkw'
        },
        body: JSON.stringify({
          email: email,
          password: pw,
          data: {
            full_name: name,
            phone: p,
            whatsapp: w
          }
        })
      });
      var data = await response.json();
      if (!response.ok) {
        const duplicate = ['email_exists', 'user_already_exists'].includes(data.code || data.error_code);
        return show('#r-msg', authError(data), duplicate ? 0 : 1);
      }
      if (data.access_token && data.refresh_token && window.supabase) {
        var sess = await client().auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token
        });
        if (!sess.error) {
          location.hash = 'account';
          await account();
          return;
        }
      }
      show('#r-msg',
        'استلمت خدمة التسجيل الطلب. تحقق من صندوق البريد والرسائل غير المرغوب فيها، ثم سجل الدخول.', 0);
      this.reset();
      syncWa();
    } catch (err) {
      show('#r-msg', 'تعذر الوصول إلى خادم التسجيل. تحقق من الإنترنت ثم أعد المحاولة.', 1);
    } finally {
      window.familyCaptcha.reset(this);
      b.disabled = false;
    }
  });
  $('#logForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    var b = this.querySelector('button[type=submit]');
    if (b.disabled) return;
    b.disabled = true;
    try {
      var z = await client().auth.signInWithPassword({
        email: $('#l-mail').value.trim(),
        password: $('#l-pw').value,
        options: {captchaToken: await window.familyCaptcha.token(this)}
      });
      if (z.error) throw Error('تعذر الدخول. تأكد من البريد وكلمة المرور وتأكيد البريد الإلكتروني.');
      var next = sessionStorage.getItem('family_after_login');
      sessionStorage.removeItem('family_after_login');
      location.hash = ['certificate', 'admin', 'member-hub', 'member-services-admin', 'news-admin', 'mfa',
        'security'
      ].includes(next) ? next : 'account';
    } catch (err) {
      show('#l-msg', 'تعذر الدخول. تحقق من البيانات والاتصال وتأكيد البريد الإلكتروني.', 1);
    } finally {
      $('#l-pw').value = '';
      window.familyCaptcha.reset(this);
      b.disabled = false;
    }
  });
  $('#completeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    var b = this.querySelector('button');
    b.disabled = true;
    try {
      await submitApplication($('#c-name').value.trim(), $('#c-phone').value.trim(), $('#c-wa').value.trim());
      $('#account-note').textContent = 'تم إرسال طلب العضوية للمراجعة.';
      await account();
    } catch (err) {
      $('#account-note').textContent = err.message;
    } finally {
      b.disabled = false;
    }
  });
  $('#logout').addEventListener('click', async function() {
    if (!confirm('هل تريد تسجيل الخروج من هذا الجهاز؟')) return;
    var z = await client().auth.signOut({
      scope: 'local'
    });
    if (z.error) {
      alert('تعذر تسجيل الخروج. حاول مجددًا.');
      return;
    }
    location.hash = 'home';
  });

  function make(tag, parent, t) {
    var e = document.createElement(tag);
    if (t !== undefined) e.textContent = t;
    parent.appendChild(e);
    return e;
  }

  function action(parent, label, fn) {
    var b = make('button', parent, label);
    b.className = 'btn btn-dark sm';
    b.type = 'button';
    b.onclick = fn;
    return b;
  }

  function newView(id, title) {
    var s = document.createElement('section');
    s.className = 'view';
    s.id = 'v-' + id;
    s.dataset.title = title;
    s.hidden = true;
    var c = make('div', s);
    c.className = 'wrap sec';
    make('h1', c, title);
    document.querySelector('main').appendChild(s);
    views.push(s);
    return c;
  }
  var admin = newView('admin', 'لوحة إدارة العضويات'),
    adminMsg = make('p', admin),
    adminRows = make('div', admin);
  action(admin, 'تحديث الطلبات', () => loadAdmin());
  adminRows.className = 'grid';
  async function loadAdmin() {
    adminRows.replaceChildren();
    adminMsg.textContent = 'جارٍ التحقق من الصلاحية';
    try {
      var q = await client().rpc('family_admin_list');
      if (q.error) {
        adminMsg.textContent = 'هذه الصفحة مخصصة للمشرف المعتمد. سجل الدخول بحساب الإدارة.';
        return;
      }
      adminMsg.textContent = 'الطلبات: ' + q.data.length + ' | المعتمدة: ' + q.data.filter(x => x.status ===
        'approved').length + ' | قيد المراجعة: ' + q.data.filter(x => x.status === 'under_review').length;
      const stats = make('div', adminRows); stats.className = 'family-admin-stats';
      for (const [label, n] of [['إجمالي الطلبات', q.data.length], ['معتمدة', q.data.filter(x=>x.status==='approved').length], ['قيد المراجعة', q.data.filter(x=>x.status==='under_review').length], ['تحتاج استكمالًا', q.data.filter(x=>x.status==='more_info').length]]) {
        const stat = make('div', stats); stat.className = 'card'; make('strong', stat, String(n)); make('p', stat, label);
      }
      var filterBar = make('div', adminRows);
      filterBar.className = 'row';
      var search = field(filterBar, 'بحث بالاسم أو رقم العضوية', 'search', 'search', 150),
        filter = selectField(filterBar, 'حالة العضوية', 'status', {
          all: 'الكل',
          ...statusLabels
        });
      var cards = [];

      function applyFilter() {
        cards.forEach(x => x.el.hidden = (filter.value !== 'all' && x.status !== filter.value) || !x.text.includes(
          search.value.trim().toLowerCase()));
      }
      search.oninput = filter.onchange = applyFilter;
      for (var item of q.data) {
        let a = item;
        let c = make('div', adminRows);
        cards.push({
          el: c,
          status: a.status,
          text: [a.full_name, a.email, a.membership_number, a.phone].join(' ').toLowerCase()
        });
        c.className = 'card';
        make('h3', c, a.full_name);
        make('p', c, a.email + ' | ' + (a.phone || ''));
        make('p', c, (statusLabels[a.status] || a.status) + ' ' + (a.membership_number || ''));
        if (a.status === 'approved') {
          action(c, 'إعداد رسالة الشهادة بالبريد', () => {
            var subject = 'شهادة العضوية | آل برهم';
            var body = 'الأخ/الأخت ' + a.full_name +
              '، تم اعتماد عضويتك في البوابة الرقمية لآل برهم. رقم العضوية: ' + (a.membership_number || '') +
              '\nلعرض شهادتك وطباعتها، سجل الدخول عبر الرابط:\n' + location.origin + location.pathname +
              '?page=certificate\nإدارة البوابة الرقمية لآل برهم';
            location.href = 'mailto:' + encodeURIComponent(a.email) + '?subject=' + encodeURIComponent(
              subject) + '&body=' + encodeURIComponent(body);
          });
        }
        let note = make('input', c);
        note.type = 'text';
        note.placeholder = 'ملاحظة المراجعة';
        let choices = make('select', c);
        for (let k of ['approved', 'more_info', 'rejected', 'suspended', 'revoked']) {
          let o = make('option', choices, statusLabels[k]);
          o.value = k;
        }
        choices.value = ['approved', 'more_info', 'rejected', 'suspended', 'revoked'].includes(a.status) ? a
          .status : 'more_info';
        action(c, 'حفظ القرار', async function() {
          if (!confirm('تأكيد تغيير حالة العضوية؟')) return;
          this.disabled = true;
          let z = await client().rpc('family_admin_review', {
            p_id: a.id,
            p_action: choices.value,
            p_note: note.value
          });
          if (z.error) {
            adminMsg.textContent = 'تعذر تنفيذ القرار.';
            this.disabled = false;
          } else {
            if (choices.value === 'approved') adminMsg.textContent = 'تم اعتماد العضوية.';
            await loadAdmin();
          }
        });
      }
    } catch (e) {
      adminMsg.textContent = 'تعذر الاتصال بالخدمة.';
    }
  }
  var cert = newView('certificate', 'شهادة العضوية الرقمية'),
    certBody = make('div', cert);
  certBody.className = 'cert-prev';
  var certControls = make('div', cert);
  certControls.className = 'row';
  var printButton = action(certControls, 'طباعة / حفظ PDF', () => window.print());
  printButton.hidden = true;
  var qrLoad = null;
  async function ensureQR() {
    if (window.QRCode) return true;
    if (!qrLoad) qrLoad = new Promise(resolve => {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
      script.onload = () => resolve(!!window.QRCode);
      script.onerror = () => {
        script.remove();
        qrLoad = null;
        resolve(false);
      };
      document.head.appendChild(script);
    });
    return qrLoad;
  }
  async function loadCertificate() {
    certBody.replaceChildren();
    printButton.hidden = true;
    try {
      var q = await client().rpc('family_my_certificate');
      if (q.error) throw q.error;
      if (!q.data.length) {
        var session = await client().auth.getSession();
        if (!session.data.session) {
          sessionStorage.setItem('family_after_login', 'certificate');
          make('p', certBody, 'سجل الدخول أولًا لعرض شهادتك.');
          var l = make('a', certBody, 'تسجيل الدخول');
          l.href = '#login';
          l.className = 'btn btn-dark';
        } else {
          make('p', certBody, 'لا توجد شهادة عضوية سارية لهذا الحساب. تصدر الشهادة بعد اعتماد الطلب.');
          var l = make('a', certBody, 'متابعة حالة العضوية');
          l.href = '#account';
          l.className = 'btn btn-dark';
        }
        return;
      }
      var d = q.data[0];
      var box = make('div', certBody);
      box.className = 'in';
      make('h3', box, 'آل برهم');
      make('p', box, 'شهادة عضوية العائلة الرقمية');
      make('p', box, 'تشهد إدارة المنصة بأن');
      make('h2', box, d.full_name);
      make('p', box, 'عضو معتمد في البوابة العائلية الرقمية');
      make('p', box, 'رقم العضوية: ' + d.membership_number);
      make('p', box, 'تاريخ الإصدار: ' + new Date(d.issued_at).toLocaleDateString('ar'));
      var url = location.origin + location.pathname + '#verify/' + d.verification_token;
      var qr = make('div', box);
      await ensureQR();
      if (window.QRCode) {
        new QRCode(qr, {
          text: url,
          width: 180,
          height: 180,
          correctLevel: QRCode.CorrectLevel.M
        });
      } else make('p', box, 'تعذر تحميل مولد QR؛ استخدم رابط التحقق.');
      var link = make('a', box, 'رابط التحقق من الشهادة');
      link.href = url;
      make('p', box, 'يُرجى مطابقة رقم العضوية بنتيجة التحقق.');
      printButton.hidden = false;
    } catch (e) {
      make('p', certBody, 'تعذر تحميل الشهادة.');
    }
  }
  var verify = newView('verify', 'التحقق من العضوية'),
    verifyBody = make('div', verify);
  verifyBody.className = 'card';
  var tokenInput = make('input', verify);
  tokenInput.type = 'text';
  tokenInput.placeholder = 'رمز التحقق';
  action(verify, 'تحقق', () => verifyToken(tokenInput.value.trim()));
  async function verifyToken(token) {
    verifyBody.replaceChildren();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
      make('p', verifyBody, 'أدخل رمز التحقق الصحيح.');
      return;
    }
    try {
      let q = await client().rpc('family_verify_certificate', {
        p_token: token
      });
      if (q.error) {
        make('p', verifyBody, 'تعذر التحقق الآن.');
        return;
      }
      if (!q.data.length) {
        make('h2', verifyBody, 'لم تُعثر على شهادة بهذا الرمز');
        return;
      }
      let d = q.data[0];
      make('h2', verifyBody, d.valid ? 'عضوية سارية ومعتمدة' : 'عضوية غير سارية');
      make('p', verifyBody, 'رقم العضوية: ' + d.membership_number);
      make('p', verifyBody, 'تاريخ الإصدار: ' + new Date(d.issued_at).toLocaleDateString('ar'));
    } catch (e) {
      make('p', verifyBody, 'تعذر الاتصال.');
    }
  }
  var memberBox = make('div', panel.querySelector('.wrap'));
  memberBox.className = 'card';
  memberBox.innerHTML =
    '<h2 id="member-welcome">حساب العضو</h2><p id="member-email" dir="ltr"></p><p>رقم العضوية: <strong id="member-number">—</strong></p><p>يظل تسجيل دخولك محفوظًا على هذا المتصفح حتى تسجيل الخروج أو انتهاء صلاحية الجلسة.</p>';
  panel.querySelector('.wrap').insertBefore(memberBox, $('#account-status'));
  var accountLinks = make('div', panel.querySelector('.wrap'));
  accountLinks.className = 'row';
  var certShortcut = make('a', accountLinks, 'شهادتي الرقمية');
  certShortcut.id = 'member-certificate';
  certShortcut.href = '#certificate';
  certShortcut.className = 'btn btn-dark';
  certShortcut.hidden = true;
  var adminShortcut = make('a', accountLinks, 'لوحة الإدارة');
  adminShortcut.href = '#admin';
  adminShortcut.className = 'btn btn-dark';
  adminShortcut.hidden = true;
  var pwBox = make('details', panel.querySelector('.wrap'));
  pwBox.className = 'card';
  pwBox.innerHTML =
    '<summary>إعدادات وأمان الحساب</summary><form id="change-password"><label class="f">كلمة مرور جديدة<input type="password" minlength="15" maxlength="128" autocomplete="new-password" required></label><button class="btn btn-dark" type="submit">تغيير كلمة المرور</button><p role="status"></p></form>';
  pwBox.appendChild($('#logout'));
  $('#change-password').onsubmit = async function(e) {
    e.preventDefault();
    var f = this,
      b = f.querySelector('button'),
      p = f.querySelector('input'),
      msg = f.querySelector('p');
    if (b.disabled) return;
    if (!validNewPassword(p.value)) {
      msg.textContent = 'اختر كلمة مرور من ١٥ إلى ١٢٨ حرفًا.';
      return;
    }
    b.disabled = true;
    try {
      var z = await client().auth.updateUser({
        password: p.value
      });
      msg.textContent = z.error ? 'تعذر تغيير كلمة المرور؛ قد يلزم تسجيل الدخول مجددًا.' :
      'تم تغيير كلمة المرور.';
      if (!z.error) f.reset();
    } catch (e) {
      msg.textContent = 'تعذر الاتصال.';
    } finally {
      b.disabled = false;
    }
  };

  var hub = newView('member-hub', 'مجلس العضو الرقمي'),
    hubBody = make('div', hub),
    hubLink = make('a', accountLinks, 'مجلس العضو الرقمي');
  hubLink.href = '#member-hub';
  hubLink.className = 'btn btn-gold';
  hubLink.hidden = true;
  var adminServices = newView('member-services-admin', 'إدارة خدمات الأعضاء'),
    adminServiceBody = make('div', adminServices);
  var adminServiceLink = make('a', admin, 'إدارة خدمات الأعضاء');
  adminServiceLink.href = '#member-services-admin';
  adminServiceLink.className = 'btn btn-dark';
  var kinds = {
    initiative: 'مبادرة',
    suggestion: 'مقترح',
    occasion: 'مناسبة أو تهنئة',
    solidarity: 'طلب تكافل خاص',
    archive: 'مادة أرشيفية'
  };

  function field(form, label, name, type, max) {
    var l = make('label', form, label);
    l.className = 'f';
    var e = make(type === 'textarea' ? 'textarea' : 'input', l);
    e.name = name;
    if (type !== 'textarea') e.type = type || 'text';
    if (max) e.maxLength = max;
    return e;
  }

  function selectField(form, label, name, options) {
    var l = make('label', form, label);
    l.className = 'f';
    var e = make('select', l);
    e.name = name;
    Object.entries(options).forEach(([k, v]) => {
      var o = make('option', e, v);
      o.value = k;
    });
    return e;
  }

  function section(parent, title) {
    var c = make('div', parent);
    c.className = 'card';
    c.style.marginBottom = '16px';
    make('h2', c, title);
    return c;
  }
  var activeHubGroup = 0;

  function decorateHub() {
    var cards = Array.from(hubBody.children).filter(x => x.classList.contains('card'));
    if (!cards.length) return;
    var groups = [
      ['هويتي', [0, 1]],
      ['عائلتي', [2, 3]],
      ['المستجدات', [4, 5, 6]],
      ['طلباتي', [7]]
    ];
    var menu = make('div', hubBody);
    menu.className = 'hub-tabs';
    menu.setAttribute('aria-label', 'أقسام خدمات العضو');
    hubBody.prepend(menu);
    var buttons = [];

    function showGroup(i) {
      activeHubGroup = i;
      cards.forEach((c, n) => c.hidden = !groups[i][1].includes(n));
      buttons.forEach((b, n) => b.setAttribute('aria-pressed', String(i === n)));
    }
    groups.forEach((g, i) => {
      var b = action(menu, g[0], () => showGroup(i));
      buttons.push(b);
    });
    showGroup(activeHubGroup);
  }

  function formAction(f, label, fn) {
    var b = make('button', f, label);
    b.type = 'submit';
    b.className = 'btn btn-dark';
    var msg = make('p', f);
    msg.setAttribute('role', 'status');
    f.onsubmit = async e => {
      e.preventDefault();
      if (b.disabled) return;
      b.disabled = true;
      try {
        await fn();
        msg.textContent = 'تم الحفظ بنجاح.';
      } catch (err) {
        msg.textContent = 'تعذر الحفظ. تحقق من الصلاحية والبيانات.';
      } finally {
        b.disabled = false;
      }
    };
  }

  function ok(q) {
    if (q.error) throw q.error;
    return q.data;
  }
  function normalizeSearch(value) {
    return String(value || '').normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').toLocaleLowerCase().trim();
  }

  function attachSearch(parent, label, records) {
    const search = field(parent, label, 'filter', 'search', 150);
    const count = make('p', parent);
    count.setAttribute('aria-live', 'polite');
    const draw = () => {
      const terms = normalizeSearch(search.value).split(/\s+/).filter(Boolean);
      let visible = 0;
      for (const record of records) {
        record.el.hidden = !terms.every(term => normalizeSearch(record.text).includes(term));
        if (!record.el.hidden) visible++;
      }
      count.textContent = 'النتائج: ' + visible + ' من ' + records.length;
    };
    search.addEventListener('input', draw);
    draw();
  }

  function mountEventCalendar(parent, rows) {
    const dated = rows.filter(x => x.event_at && Number.isFinite(Date.parse(x.event_at)))
      .sort((a,b) => Date.parse(a.event_at) - Date.parse(b.event_at));
    const upcoming = dated.filter(x => Date.parse(x.event_at) >= Date.now());
    const card = make('div', parent); card.className = 'family-calendar';
    make('h3', card, 'تقويم المناسبات القادمة');
    if (!upcoming.length) make('p', card, 'لا توجد مناسبات مستقبلية محددة التاريخ.');
    for (const event of upcoming) {
      const row = make('div', card); row.className = 'family-calendar-row';
      const time = make('time', row, new Intl.DateTimeFormat('ar', {dateStyle:'full', timeStyle:'short', timeZone:'Asia/Gaza'}).format(new Date(event.event_at)));
      time.dateTime = new Date(event.event_at).toISOString();
      make('strong', row, event.title);
    }
    make('p', card, 'تُعرض المواعيد بتوقيت غزة. هذه القائمة للأعضاء المعتمدين فقط.');
  }

  async function loadHub() {
    hubBody.replaceChildren();
    make('p', hubBody, 'جارٍ تحميل خدمات العضوية…');
    try {
      var user = ok(await client().auth.getUser()).user;
      if (!user) throw Error();
      var uid = user.id;
      var app = ok(await client().from('member_applications').select('status,membership_number,full_name').eq(
        'auth_user_id', uid).maybeSingle());
      hubBody.replaceChildren();
      if (!app || app.status !== 'approved') {
        make('p', hubBody, 'هذه الخدمات مخصصة للأعضاء المعتمدين.');
        var l = make('a', hubBody, 'متابعة حسابي');
        l.href = '#account';
        return;
      } {
        var beforeCount = hubBody.children.length;
        try {
          var card = section(hubBody, 'بطاقتي العائلية الرقمية');
          card.style.cssText =
            'background:#123b30;color:#fff;border:2px solid #c4a45b;border-radius:16px;padding:24px;margin-bottom:16px';
          make('p', card, 'آل برهم • أصالة الجذور وعهد الأجيال');
          make('h2', card, app.full_name);
          make('p', card, 'رقم العضوية: ' + app.membership_number);
          make('p', card, 'عضوية معتمدة');
          var cq = ok(await client().rpc('family_my_certificate'));
          if (cq.length) await ensureQR();
          if (cq.length && window.QRCode) {
            var qr = make('div', card);
            new QRCode(qr, {
              text: location.origin + location.pathname + '#verify/' + cq[0].verification_token,
              width: 120,
              height: 120
            });
          }
          if (cq.length && window.QRCode) {
            action(card, 'حفظ البطاقة كصورة', () => {
              var canvas = document.createElement('canvas');
              canvas.width = 1200;
              canvas.height = 720;
              var ctx = canvas.getContext('2d');
              ctx.fillStyle = '#123b30';
              ctx.fillRect(0, 0, 1200, 720);
              ctx.strokeStyle = '#c4a56a';
              ctx.lineWidth = 5;
              ctx.strokeRect(25, 25, 1150, 670);
              ctx.textAlign = 'center';
              ctx.fillStyle = '#e6cc99';
              ctx.font = 'bold 76px Arial';
              ctx.fillText('آل برهم', 600, 130);
              ctx.fillStyle = '#fff';
              ctx.font = 'bold 45px Arial';
              ctx.fillText(app.full_name, 600, 245, 1080);
              ctx.font = '32px Arial';
              ctx.fillText(app.membership_number, 600, 315);
              var qrc = card.querySelector('canvas');
              if (qrc) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(480, 355, 240, 240);
                ctx.drawImage(qrc, 490, 365, 220, 220);
              }
              ctx.fillStyle = '#e6cc99';
              ctx.font = '30px Arial';
              ctx.fillText('بطاقة عضوية رقمية', 600, 655);
              var a = document.createElement('a');
              a.download = 'albarham-membership.png';
              a.href = canvas.toDataURL('image/png');
              a.click();
            });
          }
          var certA = make('a', card, 'عرض الشهادة وطباعتها');
          certA.href = '#certificate';
          certA.className = 'btn btn-gold';
        } catch (e) {
          var existing = Array.from(hubBody.children).slice(beforeCount);
          existing.forEach(x => x.remove());
          var unavailable = section(hubBody, 'البطاقة الرقمية');
          make('p', unavailable, 'تعذر تحميل هذا القسم.');
          action(unavailable, 'إعادة المحاولة', loadHub);
        }
      } {
        var beforeCount = hubBody.children.length;
        try {
          var profile = section(hubBody, 'ملفي الشخصي');
          var p = ok(await client().from('family_profiles').select('*').eq('user_id', uid).maybeSingle()) || {};
          var f = make('form', profile),
            dn = field(f, 'الاسم المعروض', 'name', 'text', 150),
            job = field(f, 'المهنة أو التخصص', 'profession', 'text', 150),
            city = field(f, 'المدينة', 'city', 'text', 100),
            bio = field(f, 'نبذة شخصية', 'bio', 'textarea', 1000);
          dn.required = true;
          dn.value = p.display_name || app.full_name;
          job.value = p.profession || '';
          city.value = p.city || '';
          bio.value = p.bio || '';
          var consent = field(f, 'أوافق على عرض جميع حقول هذا الملف للأعضاء في دليل الكفاءات', 'consent',
            'checkbox');
          consent.checked = !!p.directory_opt_in;
          formAction(f, 'حفظ الملف', async () => {
            ok(await client().from('family_profiles').upsert({
              user_id: uid,
              display_name: dn.value.trim(),
              profession: job.value.trim(),
              city: city.value.trim(),
              bio: bio.value.trim(),
              directory_opt_in: consent.checked,
              updated_at: new Date().toISOString()
            }));
          });
        } catch (e) {
          var existing = Array.from(hubBody.children).slice(beforeCount);
          existing.forEach(x => x.remove());
          var unavailable = section(hubBody, 'الملف الشخصي');
          make('p', unavailable, 'تعذر تحميل هذا القسم.');
          action(unavailable, 'إعادة المحاولة', loadHub);
        }
      } {
        var beforeCount = hubBody.children.length;
        try {
          var tree = section(hubBody, 'شجرة نسبي الشخصية');
          make('p', tree, 'سجل خاص بك؛ المعلومات مدخلة ذاتيًا وليست إثباتًا للنسب.');
          var rels = {
            father: 'الأب',
            mother: 'الأم',
            grandfather: 'الجد',
            grandmother: 'الجدة',
            other: 'صلة أخرى'
          };
          var entries = ok(await client().from('family_lineage').select('*').eq('user_id', uid).order(
          'created_at'));
          var diagram = make('div', tree);
          diagram.className = 'card';
          make('h3', diagram, app.full_name);
          var branches = make('div', diagram);
          branches.className = 'grid';
          Object.keys(rels).forEach(k => {
            var matches = entries.filter(x => x.relationship === k);
            if (matches.length) {
              var branch = make('div', branches);
              branch.className = 'card';
              make('h3', branch, rels[k]);
              matches.forEach(x => make('p', branch, x.relative_name));
            }
          });
          entries.forEach(x => {
            var line = make('div', tree);
            make('p', line, rels[x.relationship] + ' — ' + x.relative_name + ' | ' + x.source_note);
            action(line, 'حذف', async () => {
              if (confirm('حذف هذا السجل؟')) {
                try {
                  ok(await client().from('family_lineage').delete().eq('id', x.id));
                  loadHub();
                } catch (e) {
                  alert('تعذر الحذف');
                }
              }
            });
          });
          var tf = make('form', tree),
            rn = field(tf, 'اسم القريب', 'name', 'text', 150),
            rr = selectField(tf, 'صلة القرابة', 'relationship', rels),
            rs = field(tf, 'المصدر أو الملاحظة', 'source', 'text', 500);
          rn.required = true;
          formAction(tf, 'إضافة قريب', async () => {
            ok(await client().from('family_lineage').insert({
              user_id: uid,
              relative_name: rn.value.trim(),
              relationship: rr.value,
              source_note: rs.value.trim()
            }));
            loadHub();
          });
        } catch (e) {
          var existing = Array.from(hubBody.children).slice(beforeCount);
          existing.forEach(x => x.remove());
          var unavailable = section(hubBody, 'سجل القرابة');
          make('p', unavailable, 'تعذر تحميل هذا القسم.');
          action(unavailable, 'إعادة المحاولة', loadHub);
        }
      } {
        var beforeCount = hubBody.children.length;
        try {
          var dir = section(hubBody, 'دليل المهن والكفاءات');
          make('p', dir, 'يضم فقط الملفات التي وافق أصحابها على المشاركة.');
          var ds = ok(await client().from('family_profiles').select('display_name,profession,city,bio').eq(
            'directory_opt_in', true).order('display_name').limit(100));
          if (!ds.length) make('p', dir, 'لا توجد ملفات مشاركة بعد.');
          var search = field(dir, 'بحث في الدليل', 'search', 'search', 150),
            list = make('div', dir);

          function drawDir() {
            list.replaceChildren();
            ds.filter(x => Object.values(x).join(' ').includes(search.value)).forEach(x => {
              var c = section(list, x.display_name);
              make('p', c, [x.profession, x.city, x.bio].filter(Boolean).join(' • '));
            });
          }
          search.oninput = drawDir;
          drawDir();
        } catch (e) {
          var existing = Array.from(hubBody.children).slice(beforeCount);
          existing.forEach(x => x.remove());
          var unavailable = section(hubBody, 'دليل الكفاءات');
          make('p', unavailable, 'تعذر تحميل هذا القسم.');
          action(unavailable, 'إعادة المحاولة', loadHub);
        }
      } {
        var beforeCount = hubBody.children.length;
        try {
          var inbox = section(hubBody, 'صندوق الإشعارات الخاص');
          var ns = ok(await client().from('family_member_notices').select('*').eq('user_id', uid).order(
            'created_at', {
              ascending: false
            }).limit(100));
          var unread = ns.filter(x => !x.read_at).length;
          make('p', inbox, 'غير مقروءة: ' + unread);
          if (!ns.length) make('p', inbox, 'لا إشعارات حتى الآن.');
          ns.forEach(x => {
            var c = section(inbox, x.title);
            make('p', c, x.body);
            make('p', c, x.read_at ? 'مقروء' : 'جديد');
            if (!x.read_at) action(c, 'تحديد كمقروء', async () => {
              try {
                ok(await client().from('family_member_notices').update({
                  read_at: new Date().toISOString()
                }).eq('id', x.id));
                loadHub();
              } catch (e) {
                alert('تعذر الحفظ');
              }
            });
          });
        } catch (e) {
          var existing = Array.from(hubBody.children).slice(beforeCount);
          existing.forEach(x => x.remove());
          var unavailable = section(hubBody, 'الإشعارات');
          make('p', unavailable, 'تعذر تحميل هذا القسم.');
          action(unavailable, 'إعادة المحاولة', loadHub);
        }
      } {
        var beforeCount = hubBody.children.length;
        try {
          var content = ok(await client().from('family_member_content').select('*').eq('published', true).order(
            'created_at', {
              ascending: false
            }).limit(100));
          for (var k of ['archive', 'occasion']) {
            var c = section(hubBody, k === 'archive' ? 'الأرشيف الحصري' : 'المناسبات والتهاني');
            var rows = content.filter(x => x.kind === k);
            if (k === 'occasion') mountEventCalendar(c, rows);
            if (!rows.length) make('p', c, 'لم تنشر الإدارة مواد بعد.');
            const records = [];
            const list = make('div', c);
            rows.forEach(x => {
              const item = make('article', list);
              item.className = 'family-content-record';
              make('h3', item, x.title);
              make('p', item, x.body);
              if (x.source_note) make('p', item, 'المصدر: ' + x.source_note).className = 'family-source';
              if (x.event_at) make('p', item, 'موعد المناسبة: ' + new Date(x.event_at).toLocaleString('ar', {timeZone:'Asia/Gaza'}));
              records.push({el:item, text:[x.title,x.body,x.source_note].filter(Boolean).join(' ')});
              if (x.attachment_path) action(item, 'تنزيل المرفق', async function() {
                this.disabled = true;
                try {
                  var file = ok(await client().storage.from('family-archive').download(x
                  .attachment_path));
                  var url = URL.createObjectURL(file);
                  var a = document.createElement('a');
                  a.href = url;
                  a.download = x.title.replace(/[\\/]/g, '-') + (file.type === 'application/pdf' ?
                    '.pdf' : file.type === 'image/png' ? '.png' : file.type === 'image/webp' ? '.webp' :
                    '.jpg');
                  a.click();
                  setTimeout(() => URL.revokeObjectURL(url), 30000);
                } catch (e) {
                  alert('تعذر تنزيل المرفق.');
                } finally {
                  this.disabled = false;
                }
              });
            });
            attachSearch(c, k === 'archive' ? 'بحث في الأرشيف والمصادر' : 'بحث في المناسبات', records);
          }
        } catch (e) {
          var existing = Array.from(hubBody.children).slice(beforeCount);
          existing.forEach(x => x.remove());
          for (const name of ['الأرشيف', 'المناسبات']) {
            var unavailable = section(hubBody, name);
            make('p', unavailable, 'تعذر تحميل هذا القسم.');
            action(unavailable, 'إعادة المحاولة', loadHub);
          }
        }
      } {
        var beforeCount = hubBody.children.length;
        try {
          var req = section(hubBody, 'المبادرات والمقترحات والتكافل');
          make('p', req, 'طلباتك خاصة بك وبالإدارة. لا ترفق بيانات طبية أو مالية حساسة.');
          var rf = make('form', req),
            rk = selectField(rf, 'نوع الطلب', 'kind', kinds),
            rt = field(rf, 'العنوان', 'title', 'text', 150),
            rb = field(rf, 'التفاصيل', 'body', 'textarea', 3000);
          rt.required = rb.required = true;
          formAction(rf, 'إرسال الطلب', async () => {
            ok(await client().from('family_member_requests').insert({
              user_id: uid,
              kind: rk.value,
              title: rt.value.trim(),
              body: rb.value.trim()
            }));
            loadHub();
          });
          var mine = ok(await client().from('family_member_requests').select('*').eq('user_id', uid).order(
            'created_at', {
              ascending: false
            }).limit(100));
          var states = {
            pending: 'قيد المراجعة',
            accepted: 'مقبول',
            declined: 'مرفوض',
            completed: 'مكتمل'
          };
          mine.forEach(x => {
            var c = section(req, kinds[x.kind] + ' — ' + x.title);
            make('p', c, states[x.status]);
            make('p', c, x.reply || 'لا رد بعد');
          });
        } catch (e) {
          var existing = Array.from(hubBody.children).slice(beforeCount);
          existing.forEach(x => x.remove());
          var unavailable = section(hubBody, 'الطلبات');
          make('p', unavailable, 'تعذر تحميل هذا القسم.');
          action(unavailable, 'إعادة المحاولة', loadHub);
        }
      }
      var searchAll = field(hubBody, 'بحث داخل خدمات العضو', 'hub-search', 'search', 150);
      hubBody.prepend(searchAll.parentNode);
      searchAll.oninput = () => {
        var term = searchAll.value.trim();
        Array.from(hubBody.children).filter(c => c.classList.contains('card')).forEach(c => {
          c.hidden = term ? !c.textContent.includes(term) : false;
        });
      };
      decorateHub();
    } catch (e) {
      hubBody.replaceChildren();
      make('p', hubBody, 'تعذر تحميل الخدمات؛ سجل الدخول بحساب معتمد ثم حاول مجددًا.');
      var l = make('a', hubBody, 'حسابي');
      l.href = '#account';
    }
  }
  async function loadServicesAdmin() {
    adminServiceBody.replaceChildren();
    try {
      if (ok(await client().rpc('family_is_admin')) !== true) {
        make('p', adminServiceBody, 'هذه الصفحة للإدارة فقط.');
        return;
      }
      var states = {
        pending: 'قيد المراجعة',
        accepted: 'مقبول',
        declined: 'مرفوض',
        completed: 'مكتمل'
      };
      var req = section(adminServiceBody, 'طلبات الأعضاء الخاصة');
      var rows = ok(await client().from('family_member_requests').select('*').order('created_at', {
        ascending: false
      }).limit(200));
      if (!rows.length) make('p', req, 'لا طلبات جديدة.');
      rows.forEach(x => {
        var c = section(req, kinds[x.kind] + ' — ' + x.title);
        make('p', c, x.body);
        var f = make('form', c),
          st = selectField(f, 'القرار', 'status', states),
          rp = field(f, 'رد الإدارة', 'reply', 'textarea', 2000);
        st.value = x.status;
        rp.value = x.reply;
        formAction(f, 'حفظ القرار', async () => {
          ok(await client().from('family_member_requests').update({
            status: st.value,
            reply: rp.value
          }).eq('id', x.id));
        });
        var nf = make('form', c),
          nt = field(nf, 'عنوان الإشعار', 'title', 'text', 150),
          nb = field(nf, 'رسالة خاصة للعضو', 'body', 'textarea', 3000);
        nt.required = nb.required = true;
        formAction(nf, 'إرسال إشعار خاص', async () => {
          ok(await client().from('family_member_notices').insert({
            user_id: x.user_id,
            title: nt.value,
            body: nb.value
          }));
          nf.reset();
        });
      });
      var pub = section(adminServiceBody, 'نشر الأرشيف والمناسبات'),
        f = make('form', pub),
        k = selectField(f, 'القسم', 'kind', {
          archive: 'الأرشيف',
          occasion: 'المناسبات'
        }),
        t = field(f, 'العنوان', 'title', 'text', 150),
        b = field(f, 'المحتوى', 'body', 'textarea', 10000);
      t.required = b.required = true;
      const sourceNote = field(f, 'مصدر الوثيقة أو مرجعها (اختياري)', 'source_note', 'text', 500);
      const eventDate = field(f, 'موعد المناسبة (بتوقيت جهازك؛ تأكد من المنطقة الزمنية)', 'event_at', 'datetime-local');
      eventDate.parentNode.hidden = k.value !== 'occasion';
      var file = field(f, 'مرفق اختياري للأرشيف (صورة أو PDF، حتى 10 MB)', 'attachment', 'file');
      file.accept = 'image/jpeg,image/png,image/webp,application/pdf';
      file.hidden = k.value !== 'archive';
      file.parentNode.hidden = file.hidden;
      k.onchange = () => {
        file.hidden = file.parentNode.hidden = k.value !== 'archive';
        eventDate.parentNode.hidden = k.value !== 'occasion';
        if (eventDate.parentNode.hidden) eventDate.value = '';
        if (file.hidden) file.value = '';
      };
      formAction(f, 'نشر للأعضاء', async () => {
        var path = null;
        var selected = file.files[0];
        if (selected && k.value === 'archive') {
          selected = await checkArchiveFile(selected);
          path = crypto.randomUUID() + '.' + ({
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
            'application/pdf': 'pdf'
          } [selected.type]);
          ok(await client().storage.from('family-archive').upload(path, selected, {
            contentType: selected.type,
            upsert: false
          }));
        }
        try {
          ok(await client().from('family_member_content').insert({
            kind: k.value,
            title: t.value,
            body: b.value,
            published: true,
            source_note: sourceNote.value.trim() || null,
            event_at: k.value === 'occasion' && eventDate.value ? new Date(eventDate.value).toISOString() : null,
            attachment_path: path
          }));
        } catch (e) {
          if (path) await client().storage.from('family-archive').remove([path]);
          throw e;
        }
        loadServicesAdmin();
      });
      var items = ok(await client().from('family_member_content').select('*').order('created_at', {
        ascending: false
      }).limit(100));
      items.forEach(x => {
        var c = section(pub, x.title);
        make('p', c, x.published ? 'منشور' : 'غير منشور');
        if (x.event_at) make('p', c, 'الموعد: ' + new Date(x.event_at).toLocaleString('ar', {timeZone:'Asia/Gaza'}));
        if (x.source_note) make('p', c, 'المصدر: ' + x.source_note);
        action(c, x.published ? 'إخفاء' : 'إعادة نشر', async () => {
          try {
            ok(await client().from('family_member_content').update({
              published: !x.published
            }).eq('id', x.id));
            loadServicesAdmin();
          } catch (e) {
            alert('تعذر الحفظ');
          }
        });
      });
    } catch (e) {
      make('p', adminServiceBody, 'تعذر تحميل خدمات الإدارة.');
    }
  }

  var heritage = newView('heritage', 'العائلة والتراث'),
    community = newView('community', 'الأخبار والمجتمع');

  function collection(parent, items) {
    var g = make('div', parent);
    g.className = 'grid';
    items.forEach(function(x) {
      var l = make('a', g);
      l.className = 'card';
      l.href = '#' + x[0];
      var ic = make('div', l);
      ic.className = 'ic';
      ic.innerHTML = '<svg width="26" height="26" aria-hidden="true"><use href="#i-' + x[2] + '"/></svg>';
      make('h3', l, x[1]);
      make('p', l, x[3]);
    });
  }
  collection(heritage, [
    ['history', 'تاريخ العائلة', 'landmark', 'الجذور والذاكرة'],
    ['tree', 'شجرة العائلة', 'network', 'صلة الأجيال'],
    ['archive', 'الأرشيف والحكايات', 'archive', 'الوثائق والصور والروايات']
  ]);
  collection(community, [
    ['news', 'الأخبار والمناسبات', 'cal', 'التهاني والإعلانات'],
    ['initiatives', 'المبادرات', 'heart', 'العطاء والتعاون'],
    ['contact', 'التواصل', 'users', 'الاستفسارات والمقترحات']
  ]);

  var newsEditor = newView('news-admin', 'إدارة الأخبار'),
    newsEditorBody = make('div', newsEditor);
  var newsLink = make('a', admin, 'إدارة الأخبار والمناسبات');
  newsLink.href = '#news-admin';
  newsLink.className = 'btn btn-gold';
  var newsLabels = {
    news: 'خبر عائلي',
    occasion: 'مناسبة',
    announcement: 'إعلان عائلي'
  };
  var newsEpoch = 0;

  function newsPhotos(row) {
    return [...new Set([...(row.image_paths || []), ...(row.image_path ? [row.image_path] : [])])];
  }

  function newsCover(row) {
    return (row.cover_paths || []).filter(p => newsPhotos(row).includes(p)).slice(0, 3);
  }

  var photoCache = new Map();
  async function photoURLs(paths) {
    var now = Date.now(),
      missing = [...new Set(paths)].filter(p => !photoCache.has(p) || photoCache.get(p).until < now);
    if (missing.length) {
      var z = await client().storage.from('family-news').createSignedUrls(missing, 900);
      if (z.error) throw z.error;
      for (const item of z.data || []) {
        if (item.signedUrl) photoCache.set(item.path, {
          url: item.signedUrl,
          until: now + 780000
        });
      }
    }
    return paths.map(p => photoCache.get(p)?.url || null);
  }

  function showPhotoGallery(urls, title, index) {
    var d = make('dialog', document.body);
    d.className = 'photo-dialog';
    d.setAttribute('aria-label', 'معرض الصور');
    var close = make('button', d, 'إغلاق ×');
    close.className = 'btn btn-ghost';
    close.onclick = () => d.close();
    var img = make('img', d);
    img.alt = title;
    var controls = make('div', d);
    controls.className = 'photo-controls';
    var prev = make('button', controls, 'السابق'),
      count = make('span', controls),
      next = make('button', controls, 'التالي');
    prev.className = next.className = 'btn btn-ghost';

    function draw() {
      img.src = urls[index];
      count.textContent = (index + 1) + ' / ' + urls.length;
      prev.disabled = index === 0;
      next.disabled = index === urls.length - 1;
    }
    prev.onclick = () => {
      if (index > 0) {
        index--;
        draw();
      }
    };
    next.onclick = () => {
      if (index < urls.length - 1) {
        index++;
        draw();
      }
    };
    var x = 0;
    img.addEventListener('touchstart', e => {
      x = e.changedTouches[0].clientX;
    }, {
      passive: true
    });
    img.addEventListener('touchend', e => {
      var delta = e.changedTouches[0].clientX - x;
      if (Math.abs(delta) > 45) {
        index = Math.max(0, Math.min(urls.length - 1, index + (delta > 0 ? 1 : -1)));
        draw();
      }
    }, {
      passive: true
    });
    d.addEventListener('close', () => d.remove());
    draw();
    d.showModal();
  }

  function newsGallery(parent, paths, title, cover) {
    if (!paths.length) return;
    var g = make('div', parent);
    g.className = 'news-gallery' + (cover ? ' news-cover' : '');
    g.dataset.count = String(paths.length);
    var urls = [];
    var items = paths.map((path, i) => {
      var a = make('button', g);
      a.type = 'button';
      a.className = 'news-gallery-item';
      a.setAttribute('aria-label', 'عرض الصورة ' + (i + 1));
      var im = make('img', a);
      im.alt = title + ' — صورة ' + (i + 1);
      im.loading = 'lazy';
      im.decoding = 'async';
      a.disabled = true;
      a.onclick = () => {
        var valid = urls.filter(Boolean);
        showPhotoGallery(valid, title, valid.indexOf(urls[i]));
      };
      return {
        a,
        im
      };
    });
    if (cover && paths.length > 1) make('p', parent, 'اسحب لمشاهدة الصور • ' + paths.length + ' صور').className =
      'gallery-hint';
    photoURLs(paths).then(result => {
      urls = result;
      items.forEach(({
        a,
        im
      }, i) => {
        if (urls[i] && im.isConnected) {
          im.src = urls[i];
          a.disabled = false;
        } else a.remove();
      });
    }).catch(() => {
      g.replaceChildren();
      make('p', g, 'تعذر تحميل الصور.');
    });
  }

  async function loadPublicNews() {
    var epoch = ++newsEpoch,
      feed = $('#public-news-list'),
      home = $('#home-latest-news'),
      hash = location.hash || '#home',
      isHome = hash === '#home';
    if (!isHome && hash !== '#news' && !hash.startsWith('#news/')) return;
    var target = isHome ? home : feed;
    try {
      var selected = hash.startsWith('#news/') ? hash.slice(6) : '';
      if (selected && !/^[0-9a-f-]{36}$/i.test(selected)) {
        target.replaceChildren();
        make('p', target, 'رابط الخبر غير صالح.');
        return;
      }
      var query = client().from('family_news').select(
        'id,title,body,category,image_path,image_paths,cover_paths,created_at').eq('published', true);
      var rows = ok(await (selected ? query.eq('id', selected) : query.order('created_at', {
        ascending: false
      }).limit(isHome ? 1 : 50)));
      if (epoch !== newsEpoch || (location.hash || '#home') !== hash) return;
      target.replaceChildren();
      if (!rows.length) {
        make('p', target, selected ? 'الخبر غير متاح.' : 'لا أخبار منشورة حاليًا.');
        if (selected) {
          var a = make('a', target, 'جميع الأخبار');
          a.href = '#news';
        }
        return;
      }
      if (isHome) {
        var latest = rows[0],
          teaser = make('article', home);
        teaser.className = 'home-news-card';
        make('span', teaser, newsLabels[latest.category] || 'آخر الأخبار').className = 'home-news-label';
        make('h3', teaser, latest.title);
        make('time', teaser, new Date(latest.created_at).toLocaleDateString('ar')).className = 'news-date';
        newsGallery(teaser, newsCover(latest), latest.title, true);
        var excerpt = latest.body.split('\n').filter(x => x.trim() && !x.startsWith('بسم') && !x.startsWith('﴿'))[
          0] || latest.body;
        make('p', teaser, excerpt.slice(0, 260));
        var read = make('a', teaser, 'قراءة الخبر');
        read.href = '#news/' + latest.id;
        read.className = 'btn btn-gold';
        return;
      }
      var visible = rows;
      const newsRecords = [];
      if (selected) {
        var back = make('a', feed, 'جميع الأخبار');
        back.href = '#news';
        back.className = 'btn btn-ghost';
      }
      if (!visible.length) make('p', feed, 'الخبر غير متاح.');
      for (const x of visible) {
        var c = make('article', feed);
        c.className = 'card lux-news-card';
        newsRecords.push({el:c, text:[x.title,x.body,newsLabels[x.category]].filter(Boolean).join(' ')});
        make('span', c, newsLabels[x.category] || 'خبر').className = 'lux-badge';
        make('h2', c, x.title).className = 'lux-title';
        make('time', c, new Date(x.created_at).toLocaleDateString('ar')).className = 'news-date';
        if (!selected) {
          newsGallery(c, newsCover(x), x.title, true);
          var excerpt = make('p', c, x.body.split(/\n\s*\n/).filter(v => !v.startsWith('بسم'))[0]?.slice(0, 250) ||
            x.body.slice(0, 250));
          var open = make('a', c, 'قراءة الإعلان الكامل' + (newsPhotos(x).length ? ' • ' + newsPhotos(x).length +
            ' صور' : ''));
          open.className = 'btn btn-gold';
          open.href = '#news/' + x.id;
          continue;
        }
        newsGallery(c, newsCover(x), x.title, true);
        var blocks = x.body.split(/\n\s*\n/);
        for (const block of blocks) {
          if (block.startsWith('بسم الله الرحمن الرحيم') && block.includes('﴿')) {
            var verse = make('div', c);
            verse.className = 'lux-verse-box';
            make('p', verse, 'بسم الله الرحمن الرحيم').className = 'lux-bismillah';
            make('blockquote', verse, block.split('\n').slice(1).join('\n')).className = 'lux-verse';
          } else if (block.startsWith('أعضاء المجلس\n')) {
            make('h3', c, 'أعضاء المجلس').className = 'lux-section-title';
            var ol = make('ol', c);
            ol.className = 'lux-members';
            block.split('\n').slice(1).filter(Boolean).forEach(n => make('li', ol, n));
          } else {
            var para = make('p', c, block);
            para.style.whiteSpace = 'pre-line';
          }
        }
        var rest = newsPhotos(x).filter(path => !newsCover(x).includes(path));
        if (rest.length) {
          make('h3', c, 'صور من الإعلان').className = 'lux-section-title';
          newsGallery(c, rest, x.title, false);
        }
        var share = make('a', c, 'مشاركة عبر واتساب');
        share.className = 'btn btn-gold';
        share.target = '_blank';
        share.rel = 'noopener noreferrer';
        share.href = 'https://wa.me/?text=' + encodeURIComponent(x.title + '\n' + location.origin + location
          .pathname + '#news/' + x.id);
      }
      if (!selected) { const searchBox = make('div', feed); feed.prepend(searchBox); attachSearch(searchBox, 'بحث في الأخبار المنشورة (آخر ٥٠ خبرًا)', newsRecords); }
    } catch (e) {
      if (epoch !== newsEpoch || (location.hash || '#home') !== hash) return;
      target.replaceChildren();
      make('p', target, 'تعذر تحميل الأخبار. تحقق من الاتصال.');
      action(target, 'إعادة المحاولة', loadPublicNews);
    }
  }

  async function loadNewsEditor() {
    newsEditorBody.replaceChildren();
    try {
      if (ok(await client().rpc('family_is_admin')) !== true) {
        make('p', newsEditorBody, 'هذه الصفحة للإدارة فقط.');
        return;
      }
      var list = ok(await client().from('family_news').select('*').order('created_at', {
        ascending: false
      }).limit(100));

      function editor(parent, item) {
        var d = make('details', parent);
        d.className = 'card';
        d.open = !item;
        make('summary', d, item ? (item.published ? 'منشور: ' : 'مسودة: ') + item.title : 'نشر خبر جديد');
        var f = make('form', d),
          t = field(f, 'العنوان', 'title', 'text', 180),
          b = field(f, 'النص', 'body', 'textarea', 12000),
          k = selectField(f, 'التصنيف', 'kind', newsLabels),
          im = field(f, 'اختيار الصور', 'image', 'file'),
          p = field(f, 'إظهار الخبر للعامة', 'published', 'checkbox');
        im.accept = 'image/*';
        im.multiple = true;
        im.parentNode.hidden = true;
        t.required = b.required = true;
        t.value = item?.title || '';
        b.value = item?.body || '';
        k.value = item?.category || 'announcement';
        p.checked = item ? item.published : true;
        var original = item ? newsPhotos(item) : [],
          entries = original.map(path => ({
            path,
            cover: newsCover(item).includes(path)
          }));
        var panel = make('div', f);
        make('p', panel, 'حدد حتى ثلاث صور للواجهة. باقي الصور تظهر داخل الخبر.').className = 'note';
        var controls = make('div', panel);
        controls.className = 'row';
        var coverBtn = make('button', controls, 'إضافة صور للواجهة');
        coverBtn.type = 'button';
        coverBtn.className = 'btn btn-gold';
        var insideBtn = make('button', controls, 'إضافة صور داخل الإعلان');
        insideBtn.type = 'button';
        insideBtn.className = 'btn btn-dark';
        var mode = 'cover';
        coverBtn.onclick = () => {
          mode = 'cover';
          im.click();
        };
        insideBtn.onclick = () => {
          mode = 'inside';
          im.click();
        };
        make('p', panel, 'يمكنك الضغط على زر الإضافة مرة أخرى لاختيار صورة جديدة دون فقد الصور السابقة.')
          .className = 'note';
        var status = make('p', panel),
          grid = make('div', panel);
        grid.className = 'news-edit-grid';
        var saving = false;

        function draw() {
          grid.replaceChildren();
          status.textContent = 'الصور: ' + entries.length + ' / 20 — الواجهة: ' + entries.filter(e => e.cover)
            .length + ' / 3';
          entries.forEach((entry, i) => {
            var c = make('div', grid);
            c.className = 'news-edit-photo';
            var img = make('img', c);
            img.alt = 'صورة ' + (i + 1);
            img.loading = 'lazy';
            if (entry.file) img.src = entry.preview;
            else client().storage.from('family-news').createSignedUrl(entry.path, 900).then(z => {
              if (!z.error && img.isConnected) img.src = z.data.signedUrl;
            }).catch(() => {});
            var l = make('label', c),
              check = make('input', l);
            check.type = 'checkbox';
            check.checked = entry.cover;
            make('span', l, ' عرض في الواجهة');
            check.onchange = () => {
              if (saving) {
                check.checked = entry.cover;
                return;
              }
              if (check.checked && entries.filter(e => e.cover).length >= 3) {
                check.checked = false;
                alert('يمكن اختيار ثلاث صور للواجهة كحد أقصى.');
                return;
              }
              entry.cover = check.checked;
              status.textContent = 'الصور: ' + entries.length + ' / 20 — الواجهة: ' + entries.filter(e => e
                .cover).length + ' / 3';
            };
            var del = make('button', c, 'إزالة');
            del.type = 'button';
            del.className = 'btn btn-ghost';
            del.onclick = () => {
              if (saving) return;
              if (entry.preview) URL.revokeObjectURL(entry.preview);
              entries = entries.filter(e => e !== entry);
              draw();
            };
          });
        }
        im.onchange = async () => {
          var files = Array.from(im.files),
            target = mode;
          im.value = '';
          if (saving || !files.length) return;
          coverBtn.disabled = insideBtn.disabled = true;
          try {
            for (const file of files) {
              if (entries.length >= 20) {
                alert('وصلت إلى الحد الأقصى: 20 صورة.');
                break;
              }
              if (target === 'cover' && entries.filter(e => e.cover).length >= 3) {
                alert('اكتملت صور الواجهة؛ استخدم زر إضافة صور داخل الإعلان.');
                break;
              }
              var prepared;
              try {
                prepared = await cleanImage(file, 5242880);
              } catch (e) {
                alert('تعذر قراءة الصورة: ' + file.name);
                continue;
              }
              entries.push({
                file: prepared,
                preview: URL.createObjectURL(prepared),
                cover: target === 'cover'
              });
              draw();
            }
          } finally {
            coverBtn.disabled = insideBtn.disabled = false;
          }
        };
        draw();
        formAction(f, 'حفظ الخبر', async () => {
          if (saving || coverBtn.disabled) throw Error('انتظر تجهيز الصور');
          saving = true;
          im.disabled = coverBtn.disabled = insideBtn.disabled = true;
          var uploaded = [];
          try {
            var paths = [],
              covers = [],
              total = entries.filter(e => e.file).length;
            status.textContent = 'جارٍ رفع ' + total + ' صور…';
            for (const entry of entries) {
              var path = entry.path;
              if (entry.file) {
                path = crypto.randomUUID() + '.' + ({
                  'image/jpeg': 'jpg',
                  'image/png': 'png',
                  'image/webp': 'webp'
                } [entry.file.type]);
                ok(await client().storage.from('family-news').upload(path, entry.file, {
                  contentType: entry.file.type,
                  upsert: false
                }));
                uploaded.push(path);
                status.textContent = 'تم رفع ' + uploaded.length + ' من ' + total + ' صور';
              }
              paths.push(path);
              if (entry.cover) covers.push(path);
            }
            var data = {
              title: t.value.trim(),
              body: b.value.trim(),
              category: k.value,
              image_path: paths[0] || null,
              image_paths: paths,
              cover_paths: covers,
              published: p.checked
            };
            if (item) ok(await client().from('family_news').update({
              ...data,
              updated_at: new Date().toISOString()
            }).eq('id', item.id));
            else ok(await client().from('family_news').insert(data));
          } catch (e) {
            if (uploaded.length) await client().storage.from('family-news').remove(uploaded);
            throw e;
          } finally {
            saving = false;
            im.disabled = coverBtn.disabled = insideBtn.disabled = false;
          }
          entries.forEach(e => {
            if (e.preview) URL.revokeObjectURL(e.preview);
          });
          await loadNewsEditor();
          loadPublicNews();
        });
      }
      editor(newsEditorBody, null);
      list.forEach(x => editor(newsEditorBody, x));
    } catch (e) {
      make('p', newsEditorBody, 'تعذر تحميل إدارة الأخبار. تحقق من الاتصال والصلاحية.');
    }
  }

  function extraRoute() {
    var nh = location.hash;
    if (['#account', '#admin', '#member-hub', '#member-services-admin', '#news-admin', '#certificate', '#mfa',
        '#security'
      ].includes(nh) && !authReady) return;
    if (nh === '#mfa') {
      loadMfa();
      return;
    }
    if (nh === '#security') {
      guardPrivate(loadSecurity);
      return;
    }
    if (nh === '' || nh === '#home' || nh === '#news' || nh.startsWith('#news/')) loadPublicNews();
    if (nh === '#news-admin') guardPrivate(loadNewsEditor);
    if (location.hash === '#reset') showReset();
    var hash = location.hash.slice(1);
    if (hash === 'admin') guardPrivate(loadAdmin);
    if (hash === 'member-hub') guardPrivate(loadHub);
    if (hash === 'member-services-admin') guardPrivate(loadServicesAdmin);
    if (hash === 'certificate') guardPrivate(loadCertificate);
    if (hash === 'verify' || hash.startsWith('verify/')) {
      if (hash.startsWith('verify/')) {
        tokenInput.value = hash.slice(7);
        verifyToken(tokenInput.value);
      } else verifyBody.textContent = 'امسح رمز QR أو أدخل رمز التحقق.';
    }
  }
  window.addEventListener('hashchange', extraRoute);
  var contactLink = make('a', document.querySelector('#v-contact .sec .wrap'), 'مراسلة إدارة العائلة');
  contactLink.href = 'mailto:albarham.inc@gmail.com';
  contactLink.className = 'btn btn-gold';
  var reset = newView('reset', 'استعادة كلمة المرور'),
    resetBox = make('div', reset);
  resetBox.className = 'card';
  var resetMsg = make('p', resetBox);
  var resetForm = make('form', resetBox),
    resetInput = field(resetForm, 'البريد الإلكتروني', 'email', 'email', 254);
  resetInput.required = true;
  formAction(resetForm, 'إرسال رابط الاستعادة', async () => {
    try {
      var z = await client().auth.resetPasswordForEmail(resetInput.value.trim(), {
        redirectTo: location.origin + location.pathname + '?page=reset',
        captchaToken: await window.familyCaptcha.token(resetForm)
      });
      if (z.error) throw z.error;
      resetMsg.textContent = 'إذا كان الحساب موجودًا فستصلك رسالة الاستعادة.';
    } finally { window.familyCaptcha.reset(resetForm); }
  });
  var changeForm = make('form', resetBox),
    newPass = field(changeForm, 'كلمة المرور الجديدة', 'password', 'password', 128);
  newPass.required = true;
  newPass.minLength = 15;
  changeForm.hidden = true;
  formAction(changeForm, 'حفظ كلمة المرور الجديدة', async () => {
    if (!validNewPassword(newPass.value)) throw Error('كلمة المرور غير صالحة');
    var z = await client().auth.updateUser({
      password: newPass.value
    });
    if (z.error) throw z.error;
    changeForm.reset();
    location.hash = 'account';
  });

  function prepareCaptcha() {
    const routes = {'#register': $('#regForm'), '#login': $('#logForm'), '#reset': resetForm};
    const form = routes[location.hash];
    if (form && !form.hidden) window.familyCaptcha.prepare(form).catch(() => {});
  }
  window.addEventListener('hashchange', prepareCaptcha);
  prepareCaptcha();

  function showReset() {
    resetMsg.textContent = changeForm.hidden ? 'أدخل بريد حسابك لاستعادة كلمة المرور.' : 'اختر كلمة مرور جديدة.';
  }
  var forgot = make('a', $('#logForm'), 'نسيت كلمة المرور؟');
  forgot.href = '#reset';
  forgot.className = 'more';
  try {
    client().auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        resetForm.hidden = true;
        changeForm.hidden = false;
        location.hash = 'reset';
        resetMsg.textContent = 'اختر كلمة مرور جديدة.';
      }
    });
  } catch (e) {}

  var mfaPage = newView('mfa', 'التحقق الثنائي'),
    mfaBody = make('div', mfaPage);
  mfaBody.className = 'card';
  var mfaReturn = '#account',
    mfaBusy = false;
  var mfaLink = make('a', pwBox, 'التحقق الثنائي');
  mfaLink.href = '#mfa';
  mfaLink.className = 'btn btn-dark';
  async function guardPrivate(fn) {
    const requestedHash = location.hash;
    try {
      var session = await client().auth.getSession();
      if (location.hash !== requestedHash) return;
      if (session.error) throw session.error;
      if (!session.data.session) {
        clearPrivate();
        if (location.hash !== '#account') sessionStorage.setItem('family_after_login', location.hash.slice(1));
        location.hash = 'login';
        return;
      }
      const verifiedUser = await client().auth.getUser();
      if (location.hash !== requestedHash) return;
      if (verifiedUser.error || !verifiedUser.data.user || verifiedUser.data.user.id !== session.data.session.user.id) throw Error('Session verification failed');
      var level = ok(await client().auth.mfa.getAuthenticatorAssuranceLevel());
      if (location.hash !== requestedHash) return;
      if (level.nextLevel === 'aal2' && level.currentLevel !== 'aal2') {
        mfaReturn = location.hash;
        location.hash = 'mfa';
        return;
      }
      const view = document.getElementById('v-' + requestedHash.slice(1));
      view?.querySelector('.access-error')?.remove();
      await fn();
      if (!recoveredSession || recoveredSession.user.id !== verifiedUser.data.user.id) clearPrivate();
    } catch (e) {
      if (location.hash !== requestedHash) return;
      clearPrivate();
      var view = document.getElementById('v-' + location.hash.slice(1));
      if (view && !view.querySelector('.access-error')) {
        var msg = make('p', view.querySelector('.wrap') || view,
          'تعذر التحقق من الحساب. أعد فتح الصفحة عند استقرار الاتصال.');
        msg.className = 'access-error';
      }
    }
  }
  async function loadMfa() {
    if (mfaBusy) return;
    mfaBusy = true;
    mfaBody.replaceChildren();
    try {
      var session = await client().auth.getSession();
      if (!session.data.session) {
        location.hash = 'login';
        return;
      }
      var factors = ok(await client().auth.mfa.listFactors()),
        level = ok(await client().auth.mfa.getAuthenticatorAssuranceLevel());
      var verified = factors.totp || [];

      function verifyForm(factorId) {
        var f = make('form', mfaBody),
          code = field(f, 'رمز التطبيق (6 أرقام)', 'code', 'text', 6);
        code.required = true;
        code.inputMode = 'numeric';
        code.autocomplete = 'one-time-code';
        code.pattern = '[0-9]{6}';
        formAction(f, 'تأكيد الرمز', async () => {
          var challenge = ok(await client().auth.mfa.challenge({
            factorId
          }));
          ok(await client().auth.mfa.verify({
            factorId,
            challengeId: challenge.id,
            code: code.value.trim()
          }));
          f.reset();
          mfaBody.replaceChildren();
          location.hash = mfaReturn === '#mfa' ? 'account' : mfaReturn;
        });
      }
      if (verified.length) {
        make('p', mfaBody, level.currentLevel === 'aal2' ? 'التحقق الثنائي مفعّل وهذه الجلسة مؤكدة.' :
          'أدخل الرمز من تطبيق المصادقة للمتابعة.');
        if (level.currentLevel !== 'aal2') verifyForm(verified[0].id);
        return;
      }
      make('p', mfaBody, 'أضف تطبيق مصادقة مثل Google Authenticator. احتفظ بمفتاح الاسترداد الخاص بك في مكان آمن.');
      var enroll = action(mfaBody, 'إعداد التحقق الثنائي', async () => {
        enroll.disabled = true;
        try {
          var pending = (factors.all || []).filter(x => x.factor_type === 'totp' && x.status ===
          'unverified');
          for (const p of pending) ok(await client().auth.mfa.unenroll({
            factorId: p.id
          }));
          var data = ok(await client().auth.mfa.enroll({
            factorType: 'totp',
            friendlyName: 'Al Barham'
          }));
          mfaBody.replaceChildren();
          make('p', mfaBody, 'امسح الرمز بتطبيق المصادقة أو أدخل المفتاح يدويًا. لا تشاركه مع أحد.');
          await ensureQR();
          if (window.QRCode) {
            var qr = make('div', mfaBody);
            new QRCode(qr, {
              text: data.totp.uri,
              width: 180,
              height: 180
            });
          }
          var secret = make('p', mfaBody, data.totp.secret);
          secret.dir = 'ltr';
          secret.style.overflowWrap = 'anywhere';
          verifyForm(data.id);
        } catch (e) {
          make('p', mfaBody, 'تعذر إعداد التحقق الثنائي. تحقق من إعدادات المصادقة.');
          enroll.disabled = false;
        }
      });
    } catch (e) {
      make('p', mfaBody, 'تعذر قراءة إعدادات المصادقة.');
    } finally {
      mfaBusy = false;
    }
  }

  var secPage = newView('security', 'مركز الأمن الرقمي'),
    secBody = make('div', secPage);
  var secLink = make('a', admin, 'مركز الأمن الرقمي');
  secLink.href = '#security';
  secLink.className = 'btn btn-dark';
  async function loadSecurity() {
    secBody.replaceChildren();
    make('p', secBody, 'جارٍ تحميل سجل الحماية…');
    try {
      var d = ok(await client().rpc('family_security_summary'));
      secBody.replaceChildren();
      var overview = section(secBody, 'حالة الحماية');
      make('p', overview, 'التحقق الثنائي: ' + (d.mfa_enabled ? 'مفعّل' : 'يحتاج إلى تفعيل'));
      make('p', overview, 'مستوى التحقق الحالي: ' + (d.current_aal === 'aal2' ? 'AAL2 — تحقق ثنائي مؤكد' : 'غير مؤكد'));
      make('p', overview, 'الجلسات المسجلة: ' + d.sessions);
      make('p', overview, 'مخازن الملفات الخاصة: ' + d.private_buckets);
      make('p', overview, 'عمليات آخر سبعة أيام: ' + d.events_7d);
      var m = make('a', overview, 'إعداد التحقق الثنائي');
      m.href = '#mfa';
      m.className = 'btn btn-gold';
      var sessions = section(secBody, 'إدارة الجلسات');
      make('p', sessions, 'يمكنك إنهاء جلسات أجهزتك الأخرى مع بقاء هذه الجلسة.');
      action(sessions, 'إنهاء الجلسات الأخرى', async function() {
        if (!confirm('إنهاء جميع الجلسات الأخرى؟')) return;
        this.disabled = true;
        try {
          ok(await client().auth.signOut({
            scope: 'others'
          }));
          alert('تم طلب إنهاء الجلسات الأخرى.');
          loadSecurity();
        } catch (e) {
          alert('تعذر إنهاء الجلسات.');
        } finally {
          this.disabled = false;
        }
      });
      action(sessions, 'تسجيل الخروج من كل الأجهزة', async function() {
        if (!confirm('سيُسجّل خروجك من جميع الأجهزة بما فيها هذا الجهاز. هل تريد المتابعة؟')) return;
        this.disabled = true;
        try {
          ok(await client().auth.signOut({
            scope: 'global'
          }));
          location.hash = 'home';
        } catch (e) {
          alert('تعذر تسجيل الخروج.');
          this.disabled = false;
        }
      });
      var log = section(secBody, 'سجل العمليات الحساسة');
      var names = {
          family_news: 'الأخبار',
          family_member_content: 'المحتوى',
          family_member_requests: 'الطلبات',
          family_member_notices: 'الإشعارات'
        },
        ops = {
          INSERT: 'إضافة',
          UPDATE: 'تعديل',
          DELETE: 'حذف'
        };
      if (!d.recent_events.length) make('p', log, 'لا عمليات مسجلة بعد.');
      for (const e of d.recent_events) {
        make('p', log, (names[e.resource] || e.resource) + ' • ' + (ops[e.action] || e.action) + ' • ' + new Date(e
          .occurred_at).toLocaleString('ar'));
      }
      var reviews = section(secBody, 'قرارات العضوية الأخيرة');
      for (const e of d.recent_reviews) make('p', reviews, statusLabels[e.action] || e.action);
      await mountSecurityScanner(secBody);
    } catch (e) {
      secBody.replaceChildren();
      make('p', secBody, 'تعذر الوصول إلى مركز الحماية. هذه الخدمة للإدارة المعتمدة فقط.');
    }
  }

  var scanNames = {
    rls: ['عزل بيانات الجداول (RLS)', 'جداول عامة دون حماية'],
    private_tables: ['حماية السجلات الداخلية', 'صلاحيات زائدة مكتشفة'],
    admin_rpc: ['حماية دوال الإدارة', 'دوال متاحة للزوار'],
    mfa: ['التحقق الثنائي', 'عوامل مصادقة مؤكدة'],
    session: ['سلامة جلسة الإدارة', 'جلسة الإدارة الحالية'],
    storage: ['خصوصية مخازن الملفات', 'مخازن خاصة من أصل 2'],
    upload_limits: ['قيود رفع الملفات', 'مخازن مطابقة من أصل 2'],
    files: ['سلامة مراجع الملفات', 'ملفات غير موجودة'],
    audit: ['التدقيق الأمني', 'آليات تدقيق مفعّلة من أصل 4'],
    rate: ['تقييد طلبات الأعضاء', 'آلية تقييد مفعّلة'],
    certificates: ['اتساق حالات الشهادات', 'شهادات بحالة غير متسقة']
  };

  function renderScan(target, report) {
    target.replaceChildren();
    var checks = Array.isArray(report.checks) ? report.checks : [],
      passed = checks.filter(x => x.state === 'pass').length,
      warnings = checks.filter(x => x.state === 'warn').length,
      failed = checks.filter(x => x.state === 'fail').length;
    var sum = make('div', target);
    sum.className = 'scan-summary';
    for (const x of [
        [passed, 'اجتاز', 'pass'],
        [warnings, 'تنبيه', 'warn'],
        [failed, 'خلل', 'fail']
      ]) {
      var c = make('div', sum);
      c.className = 'scan-stat ' + x[2];
      make('strong', c, String(x[0]));
      make('span', c, x[1]);
    }
    make('p', target, 'وقت الفحص: ' + new Date(report.scanned_at).toLocaleString('ar')).className = 'scan-time';
    if (report.cached) make('p', target, 'عرض آخر نتيجة حديثة لتجنب تكرار الطلبات.');
    for (const x of checks) {
      var row = make('div', target);
      row.className = 'scan-result';
      var label = make('div', row),
        name = scanNames[x.id] || [x.id, 'النتيجة'];
      make('strong', label, name[0]);
      make('small', label, name[1] + ': ' + x.value);
      var state = make('span', row, x.state === 'pass' ? '✓ اجتاز' : x.state === 'warn' ? '! تنبيه' : '× خلل');
      state.className = 'scan-state ' + x.state;
      if (x.id === 'mfa' && x.state === 'warn') {
        var a = make('a', label, 'تفعيل التحقق الثنائي');
        a.href = '#mfa';
        a.className = 'more';
      }
    }
  }
  function assessSecurityHeaders(headers) {
    const csp = headers.get('content-security-policy') || '';
    const xfo = (headers.get('x-frame-options') || '').trim().toUpperCase();
    const hsts = headers.get('strict-transport-security') || '';
    const maxAge = hsts.match(/(?:^|;)\s*max-age\s*=\s*(\d+)/i);
    const pp = headers.get('permissions-policy') || '';
    const ref = (headers.get('referrer-policy') || '').trim().toLowerCase();
    return [
      ['CSP عبر ترويسة HTTP', Boolean(csp.trim())],
      ['منع التأطير Clickjacking', /(?:^|;)\s*frame-ancestors\s+'none'\s*(?:;|$)/i.test(csp) || xfo === 'DENY'],
      ['HSTS لمدة سنة على الأقل', Boolean(maxAge && Number(maxAge[1]) >= 31536000)],
      ['منع تخمين MIME', (headers.get('x-content-type-options') || '').trim().toLowerCase() === 'nosniff'],
      ['سياسة عدم إرسال المرجع', ref === 'no-referrer'],
      ['تقييد الكاميرا والميكروفون والموقع', ['camera','microphone','geolocation'].every(k => new RegExp('(?:^|,)\\s*' + k + '\\s*=\\s*\\(\\s*\\)').test(pp))]
    ];
  }

  function mountInfrastructureStatus(parent) {
    const panel = section(parent, 'طبقات الحماية — ما يعمل وما ينقص');
    make('p', panel, 'حالة الخدمات الخارجية لا تُعدّ مفعّلة لمجرد وجود ملف إعداد. افحصها بعد الربط والنشر.');
    const items = [
      ['MFA / Zero Trust', 'تفرض قاعدة البيانات AAL2 على الإدارة؛ راجع نتيجة فحص قاعدة البيانات.', 'pass'],
      ['RLS / RBAC / تخزين خاص', 'يمكن التحقق منها في الفحص المباشر.', 'warn'],
      ['DevSecOps / CodeQL', 'راجع نتيجة فحص الفرع المنشور أدناه.', 'warn'],
      ['WAF / WAAP / DDoS / Bot Management', 'ربط مزود حماية وتطبيق قواعده مطلوب.', 'warn'],
      ['CAPTCHA (hCaptcha / Turnstile)', window.familyCaptcha.enabled ? 'مفتاح عام موجود؛ تحقق من فرض CAPTCHA في Auth.' : 'التكامل جاهز؛ يلزم مفتاح موقع وإعداد Auth.', 'warn'],
      ['Passkeys / FIDO2', 'يلزم ترقية SDK وإعداد المصادقة واختبارها.', 'warn'],
      ['PQC / RASP', 'يلزم دعم مزود TLS أو بيئة تشغيل خلفية مناسبة.', 'warn'],
      ['SIEM / XDR', 'سجل تدقيق داخلي موجود؛ يلزم تصدير آمن لمنصة مراقبة وتنبيه.', 'warn'],
      ['Immutable Backups', 'يلزم نسخ مستقلة محمية واختبار استعادة للبيانات والملفات.', 'warn'],
      ['كلمات المرور المسربة', 'تحقق من تفعيل الفحص في إعدادات Supabase Auth.', 'warn']
    ];
    for (const [name, detail, status] of items) {
      const row = make('div', panel); row.className = 'scan-result';
      const label = make('div', row); make('strong', label, name); make('small', label, detail);
      const mark = make('span', row, status === 'pass' ? 'مفعّل' : 'تحقق / إعداد'); mark.className = 'scan-state ' + status;
    }
    const links = section(parent, 'استكمال إعدادات الحماية');
    for (const [name, url] of [
      ['Vercel — إعداد الحماية والاستضافة', 'https://vercel.com/dashboard'],
      ['hCaptcha — حماية المصادقة', 'https://dashboard.hcaptcha.com/'],
      ['Supabase — إعداد المصادقة', 'https://supabase.com/dashboard/project/vfxxghfmkmgdqrczeowx/auth/providers'],
      ['Supabase — مستشار الأمان', 'https://supabase.com/dashboard/project/vfxxghfmkmgdqrczeowx/advisors/security'],
      ['GitHub — إعدادات المستودع', 'https://github.com/m0hadb0rh0m-ui/albarham/settings']
    ]) {
      const a = make('a', links, name); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.className = 'btn btn-ghost';
    }
  }

  async function mountSecurityScanner(parent) {
    var scanner = section(parent, 'فحص الحماية المباشر');
    parent.prepend(scanner);
    scanner.classList.add('security-scan');
    make('p', scanner,
      'افحص إعدادات الحماية الحقيقية في قاعدة البيانات دون مغادرة الموقع. لا يغيّر الفحص بيانات الأعضاء.');
    var run = action(scanner, 'فحص الحماية الآن', async () => {
      run.disabled = true;
      run.textContent = 'جارٍ الفحص…';
      msg.textContent = 'جارٍ التحقق من الصلاحيات والملفات…';
      try {
        var result = ok(await client().rpc('family_run_security_scan'));
        renderScan(results, result);
        msg.textContent = 'اكتمل فحص قاعدة البيانات.';
        await refreshHistory();
      } catch (e) {
        msg.textContent = 'تعذر إجراء الفحص. تحقق من الاتصال وصلاحية الإدارة.';
      } finally {
        run.disabled = false;
        run.textContent = 'إعادة فحص الحماية';
      }
    });
    run.className = 'btn btn-gold scan-run';
    var msg = make('p', scanner);
    msg.setAttribute('role', 'status');
    var results = make('div', scanner);
    var local = section(parent, 'فحص اتصال الموقع');
    var secure = location.protocol === 'https:' && window.isSecureContext;
    make('p', local, 'الاتصال الآمن HTTPS: ' + (secure ? 'متاح' : 'غير مؤكد'));
    var policy = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    make('p', local, 'سياسة CSP في الصفحة: ' + (policy && policy.content.includes("object-src 'none'") ? 'موجودة' :
      'غير مكتشفة'));
    make('p', local, 'هذه مؤشرات للمتصفح، وليست اختبار اختراق.');
    make('p', local, 'CAPTCHA: ' + (window.familyCaptcha.enabled ? 'مهيأ في الواجهة؛ يلزم التحقق من فرضه في Supabase.' : 'بانتظار مفتاح hCaptcha أو Turnstile.'));
    const headerResults = make('div', local);
    headerResults.setAttribute('aria-live', 'polite');
    const headerBtn = action(local, 'فحص ترويسات الخادم الآن', async () => {
      if (headerBtn.disabled) return;
      headerBtn.disabled = true;
      headerResults.textContent = 'جارٍ التحقق من استجابة الخادم…';
      try {
        const url = new URL(location.pathname, location.origin);
        const response = await fetch(url, {credentials: 'omit', cache: 'no-store', redirect: 'error'});
        if (!response.ok) throw Error('Response unavailable');
        headerResults.replaceChildren();
        make('p', headerResults, 'نتيجة استجابة الموقع الحالية (ليست فحصًا لمزود WAF أو TLS).');
        for (const [name, present] of assessSecurityHeaders(response.headers)) {
          const row = make('div', headerResults); row.className = 'scan-result';
          make('strong', row, name);
          const mark = make('span', row, present ? 'مكتشف' : 'غير مكتشف');
          mark.className = 'scan-state ' + (present ? 'pass' : 'warn');
        }
      } catch (e) {
        headerResults.textContent = 'تعذر التحقق من الترويسات. لا يمكن تأكيد حالة الخادم.';
      } finally { headerBtn.disabled = false; }
    });
    headerBtn.className = 'btn btn-dark';
    mountInfrastructureStatus(parent);
    var gh = section(parent, 'نتائج فحص الكود في GitHub');
    var ghMsg = make('p', gh, 'يمكنك قراءة آخر نتيجة متاحة للفرع الرئيسي من سجل GitHub Actions.');
    ghMsg.setAttribute('role', 'status');
    var ghBtn = action(gh, 'قراءة نتيجة فحص الكود', async () => {
      ghBtn.disabled = true;
      ghMsg.textContent = 'جارٍ قراءة نتيجة الفحص…';
      try {
        var response = await fetch(
          'https://api.github.com/repos/m0hadb0rh0m-ui/albarham/actions/workflows/security.yml/runs?branch=main&event=push&per_page=1', {
            credentials: 'omit',
            cache: 'no-store',
            headers: {
              Accept: 'application/vnd.github+json'
            }
          });
        if (!response.ok) throw Error('HTTP ' + response.status);
        var data = await response.json(),
          item = data.workflow_runs?.[0];
        if (!item) {
          ghMsg.textContent = 'لا يوجد تشغيل ظاهر للفحص حتى الآن.';
          return;
        }
        var labels = {
          success: 'نجح',
          failure: 'فشل',
          cancelled: 'أُلغي',
          timed_out: 'انتهت المهلة',
          skipped: 'تم تخطيه',
          action_required: 'يتطلب إجراءً',
          neutral: 'محايد'
        };
        ghMsg.textContent = 'آخر تشغيل: ' + (item.status === 'completed' ? (labels[item.conclusion] ||
            'نتيجة غير معروفة') : 'لم يكتمل بعد') + ' • ' + new Date(item.updated_at || item.created_at)
          .toLocaleString('ar');
        var old = gh.querySelector('.ci-details');
        if (old) old.remove();
        var detail = make('div', gh);
        detail.className = 'ci-details';
        var jobsResponse = await fetch('https://api.github.com/repos/m0hadb0rh0m-ui/albarham/actions/runs/' +
          Number(item.id) + '/jobs?per_page=30', {
            credentials: 'omit',
            cache: 'no-store',
            headers: {
              Accept: 'application/vnd.github+json'
            }
          });
        if (jobsResponse.ok) {
          var jobs = await jobsResponse.json();
          for (const job of jobs.jobs || []) {
            make('p', detail, job.name + ' — ' + (labels[job.conclusion] || job.status));
            for (const step of job.steps || []) {
              if (step.conclusion === 'failure') make('p', detail, 'الخطوة المتعثرة: ' + step.name);
            }
          }
        } else make('p', detail, 'تعذر جلب تفاصيل المهام.');
        var link = make('a', detail, 'فتح سجل التشغيل التفصيلي');
        link.href = 'https://github.com/m0hadb0rh0m-ui/albarham/actions/runs/' + Number(item.id);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'more';
      } catch (e) {
        ghMsg.textContent = 'تعذر إكمال قراءة تفاصيل GitHub من المتصفح. لا يمكن تأكيد نجاح الفحص.';
      } finally {
        ghBtn.disabled = false;
      }
    });
    ghBtn.className = 'btn btn-dark';
    make('p', gh, 'قراءة النتيجة لا تعيد تشغيل CodeQL. تشغيل الفحص يتم عند تحديث الكود أو حسب الجدولة.');
    var history = section(parent, 'سجل فحوص الحماية');
    var historyList = make('div', history);
    async function refreshHistory() {
      historyList.replaceChildren();
      try {
        var reports = ok(await client().rpc('family_security_scan_history'));
        if (!reports.length) {
          make('p', historyList, 'لم تُسجّل فحوص بعد.');
          return;
        }
        for (const report of reports) {
          var d = make('details', historyList);
          d.className = 'scan-history';
          var count = report.checks.filter(x => x.state === 'pass').length;
          make('summary', d, new Date(report.scanned_at).toLocaleString('ar') + ' • ' + count + ' من ' + report
            .checks.length + ' اجتاز');
          var body = make('div', d);
          renderScan(body, report);
        }
      } catch (e) {
        make('p', historyList, 'تعذر قراءة سجل الفحوص.');
      }
    }
    await refreshHistory();
    make('p', scanner,
      'نطاق الفحص: إعدادات قاعدة البيانات ومؤشرات الواجهة. لا يشمل فحص البرمجيات الخبيثة أو اختبار اختراق شامل.');
  }
  async function cleanImage(file, max) {
    if (!file || file.size > 25 * 1024 * 1024 || !file.type.startsWith('image/') || file.type === 'image/svg+xml')
      throw Error('صورة غير مسموحة');
    var url = URL.createObjectURL(file);
    try {
      var im = new Image();
      im.src = url;
      await im.decode();
      if (!im.width || !im.height || im.width * im.height > 60000000) throw Error('أبعاد الصورة كبيرة');
      var ratio = Math.min(1, 2000 / Math.max(im.width, im.height)),
        c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(im.width * ratio));
      c.height = Math.max(1, Math.round(im.height * ratio));
      var ctx = c.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(im, 0, 0, c.width, c.height);
      var blob = await new Promise(resolve => c.toBlob(resolve, 'image/jpeg', 0.86));
      if (!blob || blob.size > max) throw Error('الصورة كبيرة');
      return blob;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  async function checkArchiveFile(file) {
    if (file.type === 'application/pdf') {
      if (file.size > 10485760) throw Error('ملف كبير');
      var head = new TextDecoder().decode(await file.slice(0, 5).arrayBuffer());
      if (head !== '%PDF-') throw Error('ملف PDF غير صالح');
      return file;
    }
    return cleanImage(file, 10485760);
  }

  var dock = document.createElement('nav');
  dock.className = 'mobile-dock';
  dock.setAttribute('aria-label', 'التنقل السريع');
  [
    ['home', 'الرئيسية', 'landmark'],
    ['news', 'الأخبار', 'file'],
    ['heritage', 'العائلة', 'users'],
    ['account', 'حسابي', 'shield']
  ].forEach(x => {
    var l = make('a', dock);
    l.href = '#' + x[0];
    l.innerHTML = '<svg width="22" height="22" aria-hidden="true"><use href="#i-' + x[2] + '"/></svg>';
    make('span', l, x[1]);
  });
  document.body.appendChild(dock);

  function markDock() {
    var r = (location.hash || '#home').slice(1).split('/')[0];
    if (['login', 'register', 'reset', 'member-hub', 'member-services-admin', 'news-admin', 'admin', 'certificate',
        'verify', 'membership', 'security', 'mfa'
      ].includes(r)) r = 'account';
    if (['history', 'tree', 'archive', 'stories'].includes(r)) r = 'heritage';
    if (r === 'events') r = 'news';
    Array.from(dock.querySelectorAll('a')).forEach(a => {
      if (a.getAttribute('href') === '#' + r) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('hashchange', markDock);
  markDock();
  var headerActs = document.querySelector('header.site .acts'),
    guestLogin = headerActs.querySelector('a[href="#login"]'),
    guestRegister = headerActs.querySelector('a[href="#register"]');
  var signedAccount = make('a', headerActs, 'حسابي');
  signedAccount.href = '#account';
  signedAccount.className = 'btn btn-gold sm';
  signedAccount.hidden = true;

  function updateHeader(session) {
    guestLogin.hidden = !!session;
    guestRegister.hidden = true;
    signedAccount.hidden = !session;
    document.querySelectorAll('[data-guest-entry]').forEach(a => {
      a.href = session ? '#account' : '#login';
      a.textContent = session ? 'حسابي' : 'دخول / إنشاء حساب';
    });
  }
  var authReady = false,
    recoveredSession = null;

  function clearPrivate() {
    hubBody.replaceChildren();
    adminRows.replaceChildren();
    adminServiceBody.replaceChildren();
    newsEditorBody.replaceChildren();
    certBody.replaceChildren();
    mfaBody.replaceChildren();
    secBody.replaceChildren();
    $('#member-welcome').textContent = 'حساب العضو';
    $('#member-email').textContent = '';
    $('#member-number').textContent = '—';
    $('#account-status').textContent = '';
    $('#completeForm').reset();
    $('#completeForm').hidden = true;
    hubLink.hidden = true;
    adminShortcut.hidden = true;
    certShortcut.hidden = true;
    printButton.hidden = true;
    $('#change-password').reset();
  }
  guestLogin.hidden = true;
  signedAccount.hidden = true;

  function reconcileSession(session) {
    recoveredSession = session;
    updateHeader(session);
    if (session && ['#login', '#account'].includes(location.hash)) {
      if (location.hash !== '#account') location.hash = 'account';
      else guardPrivate(account);
    }
  }
  window.addEventListener('hashchange', function() {
    if (!authReady) return;
    if (location.hash === '#login' && recoveredSession) {
      location.hash = 'account';
      return;
    }
    if (location.hash === '#account') guardPrivate(account);
  });
  route();
  try {
    client().auth.onAuthStateChange((event, session) => {
      if (!authReady) return;
      recoveredSession = session;
      updateHeader(session);
      if (event === 'SIGNED_OUT') {
        clearPrivate();
        if (['#account', '#admin', '#member-hub', '#member-services-admin', '#news-admin', '#certificate',
            '#security', '#mfa'
          ].includes(location.hash)) location.hash = 'home';
      }
      if (event === 'SIGNED_IN' && location.hash === '#login') setTimeout(() => {
        if (location.hash === '#login') location.hash = 'account';
      }, 0);
    });
    client().auth.getSession().then(z => {
      authReady = true;
      if (z.error) {
        updateHeader(null);
        return;
      }
      reconcileSession(z.data.session);
      route();
      extraRoute();
      if (location.hash === '#account' && !z.data.session) location.hash = 'login';
    }).catch(() => {
      authReady = true;
      updateHeader(null);
    });
  } catch (e) {
    authReady = true;
    updateHeader(null);
  }
})();

;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js?v=30').catch(() => {});
}
let installPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  installPrompt = e;
  const b = document.getElementById('install-app');
  if (b) b.hidden = false;
});
document.addEventListener('DOMContentLoaded', () => {
  const b = document.createElement('button');
  b.id = 'install-app';
  b.className = 'btn btn-gold sm';
  b.textContent = 'تثبيت تطبيق العائلة';
  b.hidden = !installPrompt;
  b.onclick = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      installPrompt = null;
      b.hidden = true;
    }
  };
  document.querySelector('footer.site .copy').appendChild(b);
});
