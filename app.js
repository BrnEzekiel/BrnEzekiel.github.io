// Portfolio interactions: nav, skill bars, filters, modal, contact form.
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  // Scroll progress + nav state
  var progress = document.getElementById('progress');
  var nav = document.querySelector('.nav');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      nav.classList.toggle('scrolled', window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll-reveal: auto-tag list items, stagger groups
  document.querySelectorAll('.timeline, .bars, .services, .edu, .chips, .contact-rows').forEach(function (list) {
    list.classList.add('rv-group');
    Array.prototype.forEach.call(list.children, function (li) { li.classList.add('rv'); });
  });
  document.querySelectorAll('.rv-group').forEach(function (group) {
    Array.prototype.forEach.call(group.querySelectorAll(':scope > .rv'), function (el, i) {
      el.style.transitionDelay = Math.min(i, 8) * 80 + 'ms';
    });
  });
  var reveal = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var rvObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); rvObs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveal.forEach(function (el) { rvObs.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add('in'); });
  }

  // Mobile menu
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  menuBtn.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Active nav link on scroll
  var links = Array.prototype.slice.call(navLinks.querySelectorAll('a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  // Animate skill bars when visible
  var bars = document.querySelectorAll('.bar');
  function fillBar(bar) {
    var level = Math.max(0, Math.min(100, Number(bar.dataset.level) || 0));
    bar.querySelector('span').style.width = level + '%';
    bar.style.setProperty('--knob', level + '%');
  }
  if ('IntersectionObserver' in window) {
    var barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { fillBar(en.target); barObs.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { barObs.observe(b); });
  } else {
    bars.forEach(fillBar);
  }

  // Portfolio: category + tech + search + sort combined
  var cardsWrap = document.getElementById('cards');
  var cards = Array.prototype.slice.call(cardsWrap.querySelectorAll('.card'));
  var projState = { cat: 'all', tech: 'all', q: '', sort: 'featured' };
  function applyProj() {
    var visible = cards.filter(function (c) {
      var okCat = projState.cat === 'all' || c.dataset.tags === projState.cat;
      var okTech = projState.tech === 'all' || (c.dataset.tech || '').split(' ').indexOf(projState.tech) > -1;
      var okQ = !projState.q || (c.dataset.title + ' ' + c.dataset.body).toLowerCase().indexOf(projState.q) > -1;
      return okCat && okTech && okQ;
    });
    visible.sort(function (a, b) {
      return projState.sort === 'az' ? a.dataset.title.localeCompare(b.dataset.title) : Number(a.dataset.featured) - Number(b.dataset.featured);
    });
    visible.forEach(function (c) { cardsWrap.appendChild(c); });
    cards.forEach(function (c) {
      var show = visible.indexOf(c) > -1;
      c.classList.toggle('hidden', !show);
      c.classList.remove('pop');
      if (show) { void c.offsetWidth; c.classList.add('pop'); }
    });
  }
  document.querySelectorAll('#portfolio .filters .chip-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('#portfolio .filters .chip-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      projState.cat = btn.dataset.filter;
      applyProj();
    });
  });
  function setTech(t) {
    projState.tech = t;
    document.querySelectorAll('.tech-row .chip-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.tech === t); });
    applyProj();
  }
  document.querySelectorAll('.tech-row .chip-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { setTech(btn.dataset.tech); });
  });
  cardsWrap.addEventListener('click', function (e) {
    var t = e.target.closest('.techs button');
    if (t) setTech(t.dataset.tech);
  });
  document.getElementById('projSearch').addEventListener('input', function (e) {
    projState.q = e.target.value.trim().toLowerCase();
    applyProj();
  });
  document.getElementById('projSort').addEventListener('change', function (e) {
    projState.sort = e.target.value;
    applyProj();
  });

  // Portfolio modal
  var modal = document.getElementById('modal');
  var modalTitle = document.getElementById('modalTitle');
  var modalBody = document.getElementById('modalBody');
  var modalLink = document.getElementById('modalLink');
  var modalClose = document.getElementById('modalClose');
  var lastFocus = null;
  function openModal(card) {
    modalTitle.textContent = card.dataset.title || '';
    modalBody.textContent = card.dataset.body || '';
    if (card.dataset.link) {
      modalLink.href = card.dataset.link;
      modalLink.textContent = card.dataset.linkLabel || 'Open';
      modalLink.classList.add('show');
      if (/^https?:/.test(card.dataset.link)) {
        modalLink.target = '_blank';
        modalLink.rel = 'noopener';
      } else {
        modalLink.removeAttribute('target');
        modalLink.removeAttribute('rel');
      }
    } else {
      modalLink.classList.remove('show');
    }
    var repoLink = document.getElementById('modalRepo');
    if (card.dataset.repoLink) {
      repoLink.href = card.dataset.repoLink;
      repoLink.classList.add('show');
    } else {
      repoLink.classList.remove('show');
    }
    document.getElementById('mProblem').textContent = card.dataset.problem || '—';
    document.getElementById('mProcess').textContent = card.dataset.process || '—';
    document.getElementById('mResult').textContent = card.dataset.result || '—';
    var shots = document.getElementById('mShots');
    shots.innerHTML = '';
    (card.dataset.shots || '').split(',').filter(Boolean).forEach(function (s) {
      var img = document.createElement('img');
      img.src = s;
      img.alt = (card.dataset.title || 'Project') + ' screenshot';
      img.loading = 'lazy';
      shots.appendChild(img);
    });
    var mv = document.getElementById('mVideo');
    mv.innerHTML = '';
    if (card.dataset.video) {
      var fr = document.createElement('iframe');
      fr.src = card.dataset.video;
      fr.title = 'Project walkthrough video';
      fr.allowFullscreen = true;
      mv.appendChild(fr);
    }
    try {
      var views = JSON.parse(localStorage.getItem('projViews') || '{}');
      views[card.dataset.title] = (views[card.dataset.title] || 0) + 1;
      localStorage.setItem('projViews', JSON.stringify(views));
      var top = Object.keys(views).sort(function (a, b) { return views[b] - views[a]; })[0];
      document.getElementById('viewedLine').textContent = top ? 'Your most viewed: ' + top + ' (' + views[top] + '×)' : '';
    } catch (err) { /* storage unavailable */ }
    document.getElementById('mShare').onclick = function () {
      var data = { title: card.dataset.title, text: card.dataset.body, url: location.href.split('#')[0] + '#portfolio' };
      if (navigator.share) { navigator.share(data).catch(function () {}); }
      else if (navigator.clipboard) { navigator.clipboard.writeText(data.title + ' — ' + data.url); }
    };
    document.getElementById('mCopy').onclick = function () {
      if (navigator.clipboard) navigator.clipboard.writeText(location.href.split('#')[0] + '#portfolio');
    };
    lastFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    modalClose.focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.getElementById('cards').addEventListener('click', function (e) {
    var card = e.target.closest('.card');
    if (card && (e.target.classList.contains('text-btn') || e.target.closest('.thumb'))) openModal(card);
  });
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
  document.getElementById('modalHire').addEventListener('click', closeModal);

  // Services accordion
  document.querySelectorAll('.svc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var svc = btn.parentElement;
      var open = svc.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Contact form -> delivered by email via FormSubmit (static hosting has no backend)
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  var sendBtn = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();
    if (!name || !email || !message) {
      note.textContent = 'Please fill in your name, email, and message.';
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      note.textContent = 'That email address does not look valid.';
      return;
    }
    var topic = form.topic ? form.topic.value : 'General';
    sendBtn.disabled = true;
    note.textContent = 'Sending…';
    fetch('https://formsubmit.co/ajax/brianonyango229@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: name, email: email, topic: topic, message: message, _subject: 'Portfolio enquiry (' + topic + ') from ' + name, _autoresponse: 'Thanks for reaching out — I reply within a day. — Brian' })
    }).then(function (res) {
      if (!res.ok) throw new Error('send failed');
      return res.json();
    }).then(function () {
      note.textContent = 'Message sent — I reply within a day.';
      form.reset();
      if (window.plausible) { try { window.plausible('enquiry'); } catch (e2) {} }
      if (window.fireConfetti) window.fireConfetti();
    }).catch(function () {
      // Fallback: visitor's own email app
      var subject = encodeURIComponent('Portfolio enquiry from ' + name);
      var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      note.textContent = 'Direct send failed — opening your email app instead…';
      window.location.href = 'mailto:brianonyango229@gmail.com?subject=' + subject + '&body=' + body;
    }).finally(function () {
      sendBtn.disabled = false;
    });
  });

  // Footer bits
  document.getElementById('year').textContent = String(new Date().getFullYear());
  document.getElementById('toTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// Upgrade batch: hero fx, widgets, proof, search, settings, delight.
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  function store(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      localStorage.setItem(k, v);
    } catch (e) { return null; }
  }
  var toastEl = $('#toast'), toastT = null;
  function toast(html, ms) {
    if (!toastEl) return;
    toastEl.innerHTML = html;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('show'); }, ms || 3500);
  }

  // Intro + returning visitor
  var visits = Number(store('visits') || 0) + 1;
  store('visits', String(visits));
  if (visits > 1) {
    var bn = $('#backName');
    if (bn) bn.textContent = '· Welcome back!';
  }
  function byeIntro() { var i = $('#intro'); if (i) i.classList.add('gone'); }
  if (/[?&]shot=1/.test(location.search)) { var i0 = $('#intro'); if (i0) i0.remove(); }
  else {
    window.addEventListener('load', function () { setTimeout(byeIntro, 450); });
    setTimeout(byeIntro, 2600);
  }

  // Theme / accent / font-size (persisted)
  var root = document.documentElement;
  function applyTheme(t) {
    if (t === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    store('theme', t);
  }
  applyTheme(store('theme') || 'dark');
  var themeBtn = $('#themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });
  function applyAcc(a) {
    root.style.setProperty('--accent', a);
    store('acc', a);
    $all('.acc-pick button').forEach(function (b) { b.classList.toggle('on', b.dataset.acc === a); });
  }
  var acc0 = store('acc');
  if (acc0) applyAcc(acc0);
  else { var d = $('.acc-pick button'); if (d) d.classList.add('on'); }
  $all('.acc-pick button').forEach(function (b) {
    b.addEventListener('click', function () { applyAcc(b.dataset.acc); });
  });
  var FS = [90, 100, 112, 125], fsi = 1;
  try { fsi = Math.max(0, FS.indexOf(Number(store('fs')) || 100)); } catch (e) {}
  function applyFs() { root.style.fontSize = FS[fsi] + '%'; store('fs', String(FS[fsi])); }
  applyFs();
  var fU = $('#fontUp'), fD = $('#fontDown');
  if (fU) fU.addEventListener('click', function () { if (fsi < FS.length - 1) { fsi++; applyFs(); } });
  if (fD) fD.addEventListener('click', function () { if (fsi > 0) { fsi--; applyFs(); } });

  // EN/SW UI switcher (chrome + headings; long copy stays English)
  var I18N = [
    ['#navLinks a[href="#home"]', 'Nyumbani'], ['#navLinks a[href="#about"]', 'Kuhusu'],
    ['#navLinks a[href="#resume"]', 'Wasifu'], ['#navLinks a[href="#portfolio"]', 'Kazi'],
    ['#navLinks a[href="#proof"]', 'Ushahidi'], ['#navLinks a[href="blog.html"]', 'Blogu'],
    ['#navLinks a[href="#contact"]', 'Wasiliana'],
    ['#about h2', 'KUHUSU'], ['#resume h2', 'WASIFU'], ['#portfolio h2', 'KAZI'],
    ['#proof h2', 'USHAHIDI'], ['#blog h2', 'BLOGU'], ['#contact h2', 'WASILIANA'],
    ['#changelog h2', 'MABADILIKO'],
    ['.hero-cta .ghost', 'Kazi'], ['#contactForm button[type="submit"]', 'Tuma ujumbe'],
    ['#newsForm button[type="submit"]', 'Jiandikishe']
  ];
  I18N.forEach(function (p) { var el = $(p[0]); if (el && !el.dataset.en) el.dataset.en = el.textContent; });
  function applyLang(l) {
    I18N.forEach(function (p) {
      var el = $(p[0]);
      if (el) el.textContent = l === 'sw' ? p[1] : el.dataset.en;
    });
    var lb = $('#langBtn');
    if (lb) lb.textContent = l === 'sw' ? 'EN' : 'SW';
    store('lang', l);
  }
  applyLang(store('lang') || 'en');
  var langBtn = $('#langBtn');
  if (langBtn) langBtn.addEventListener('click', function () {
    applyLang((store('lang') || 'en') === 'en' ? 'sw' : 'en');
  });

  // Greeting + Nairobi clock
  try {
    var h = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Africa/Nairobi' }).format(new Date()));
    var g = $('#greet');
    if (g) g.textContent = h < 12 ? 'Good morning' : (h < 18 ? 'Good afternoon' : 'Good evening');
    var clk = $('#nTime');
    if (clk) {
      var fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' });
      (function tick() { clk.textContent = fmt.format(new Date()) + ' EAT'; setTimeout(tick, 20000); })();
    }
  } catch (e) {}

  // Rotating roles (typewriter)
  var typer = $('#roleTyper');
  var ROLES = ['AI Evaluation & Red Teaming Specialist', 'LLM Safety Evaluator', 'AI Data Annotator', 'Prompt-Injection Specialist'];
  if (typer && !RM) {
    var ri = 0, ci = ROLES[0].length, del = true;
    (function type() {
      var word = ROLES[ri];
      if (del) { ci--; if (ci <= 0) { del = false; ri = (ri + 1) % ROLES.length; word = ROLES[ri]; } }
      else { ci++; if (ci >= word.length) { del = true; typer.textContent = word; return void setTimeout(type, 2200); } }
      typer.textContent = (del ? ROLES[(ri + ROLES.length - 1) % ROLES.length] : word).slice(0, Math.max(0, ci));
      if (!del && ci === 0) { ci = 0; }
      setTimeout(type, del ? 28 : 55);
    })();
  }


  // Hero backdrop lives in hero3d.js (3D network canvas); nothing to drive here.

  // Experience counter + CV size + A/B headline
  var exp = $('#expYears');
  if (exp) exp.textContent = Math.max(1, new Date().getFullYear() - 2022) + '+';
  var cvs = $('#cvSize');
  if (cvs) {
    fetch('Brian-Onyango-Ezekiel-CV.pdf', { method: 'HEAD' }).then(function (r) {
      var n = Number(r.headers.get('Content-Length') || 0);
      if (n) cvs.textContent = '· ' + Math.round(n / 1024) + ' KB';
    }).catch(function () {});
  }
  var heroSub = $('#heroSub');
  if (heroSub) {
    var VARIANTS = [
      'I design adversarial safety evaluations for frontier AI agents and keep annotation pipelines honest.',
      'Red teamer for frontier AI: I find the flaw before your users do.'
    ];
    var vi = store('ab');
    if (vi === null) { vi = Math.random() < 0.5 ? '0' : '1'; store('ab', vi); }
    heroSub.textContent = VARIANTS[Number(vi)] || VARIANTS[0];
  }

  // Bio read-more + language dots + before/after slider
  var moreBtn = $('#bioMoreBtn');
  if (moreBtn) moreBtn.addEventListener('click', function () {
    var m = $('#bioMore'), open = m.classList.toggle('show');
    moreBtn.textContent = open ? 'Show less' : 'Read more';
    moreBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $all('.dots').forEach(function (d) {
    var n = Number(d.dataset.n) || 0;
    for (var k = 0; k < 5; k++) {
      var dot = document.createElement('i');
      if (k < n) dot.className = 'on';
      d.appendChild(dot);
    }
  });

  // Animated stat counters
  var counters = $all('[data-count]');
  function countUp(el) {
    var target = Number(el.dataset.count), suf = el.dataset.suffix || '', t0 = null;
    el.textContent = '0' + suf;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / 1200);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    if (RM) { el.textContent = target + suf; return; }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cObs.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cObs.observe(c); });
  } else { counters.forEach(countUp); }

  // Skill endorsements (per-browser)
  $all('.endorse').forEach(function (b) {
    var k = 'endorse-' + b.dataset.skill, mine = store(k + '-me') === '1';
    function paint() {
      b.querySelector('b').textContent = String(Number(store(k) || 0));
      b.classList.toggle('done', mine);
    }
    paint();
    b.addEventListener('click', function () {
      mine = !mine;
      store(k, String(Math.max(0, Number(store(k) || 0) + (mine ? 1 : -1))));
      store(k + '-me', mine ? '1' : '0');
      paint();
    });
  });

  // Radar chart
  var radar = $('#radar');
  if (radar) {
    var ctx = radar.getContext('2d'), N = 6, R = 95, CX = 150, CY = 135;
    var vals = $all('.bar').slice(0, 6).map(function (b) { return Number(b.dataset.level) / 100; });
    var labels = $all('.bar-label').slice(0, 6).map(function (l) { return (l.firstChild.textContent || '').trim().split(' ')[0]; });
    function pt(i, v) {
      var a = -Math.PI / 2 + i * Math.PI * 2 / N;
      return [CX + Math.cos(a) * R * v, CY + Math.sin(a) * R * v];
    }
    ctx.strokeStyle = 'rgba(140,150,170,.35)';
    [1, 0.66, 0.33].forEach(function (v) {
      ctx.beginPath();
      for (var i = 0; i <= N; i++) { var p = pt(i % N, v); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
      ctx.stroke();
    });
    var acc = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#35a7ff';
    ctx.beginPath();
    vals.forEach(function (v, i) { var p = pt(i, v); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
    ctx.closePath();
    ctx.fillStyle = 'rgba(53,167,255,.22)'; ctx.fill();
    ctx.strokeStyle = acc; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#8b94a7'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    labels.forEach(function (l, i) { var p = pt(i, 1.18); ctx.fillText(l, p[0], p[1]); });
  }

  // References carousel
  var refs = $all('#refCar .ref'), rfi = 0;
  function showRef(n) {
    if (!refs.length) return;
    rfi = (n + refs.length) % refs.length;
    refs.forEach(function (r, i) { r.classList.toggle('on', i === rfi); });
  }
  var rP = $('#refPrev'), rN = $('#refNext');
  if (rP) rP.addEventListener('click', function () { showRef(rfi - 1); });
  if (rN) rN.addEventListener('click', function () { showRef(rfi + 1); });

  // GitHub profile card + star counts (graceful when offline/rate-limited)
  var ghc = $('#ghCard');
  if (ghc) {
    fetch('https://api.github.com/users/BrnEzekiel').then(function (r) {
      if (!r.ok) throw 0;
      return r.json();
    }).then(function (u) {
      ghc.innerHTML = '';
      var img = document.createElement('img');
      img.src = u.avatar_url; img.alt = 'GitHub avatar';
      var tx = document.createElement('span');
      var a = document.createElement('a');
      a.href = u.html_url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = '@' + u.login;
      tx.appendChild(a);
      tx.insertAdjacentText('beforeend', ' · ' + u.followers + ' followers · ' + u.public_repos + ' repos');
      ghc.appendChild(img); ghc.appendChild(tx);
    }).catch(function () { /* keep the static fallback card above */ });
  }
  $all('[data-gh]').forEach(function (el) {
    fetch('https://api.github.com/repos/' + el.dataset.gh).then(function (r) {
      if (!r.ok) throw 0;
      return r.json();
    }).then(function (j) {
      var s = el.querySelector('.gh-stars');
      if (s) s.textContent = '★ ' + j.stargazers_count + ' · ⑂ ' + j.forks_count;
    }).catch(function () {
      var s2 = el.querySelector('.gh-stars');
      if (s2) { var nx = s2.nextSibling; if (nx && nx.nodeType === 3) nx.remove(); s2.remove(); }
      if (!el.querySelector('img')) el.remove();
    });
  });

  // Site search overlay
  var sOv = $('#searchOv'), sIn = $('#searchInput'), sRes = $('#searchRes');
  var IDX = [];
  $all('#navLinks a[href^="#"]').forEach(function (a) {
    IDX.push({ t: a.textContent.trim(), s: 'Section', u: a.getAttribute('href') });
  });
  $all('#cards .card').forEach(function (c) {
    IDX.push({ t: c.dataset.title, s: 'Project', u: '#portfolio' });
  });
  [['How I red-team an AI agent', 'post-redteam.html'], ['From annotation to adversarial evals', 'post-annotation.html'], ['A CV verified by code, not eyeballs', 'post-cv.html']].forEach(function (p) {
    IDX.push({ t: p[0], s: 'Post', u: p[1] });
  });
  function closeSearch() { if (sOv) { sOv.classList.remove('open'); sOv.setAttribute('aria-hidden', 'true'); } }
  function openSearch() {
    if (!sOv) return;
    sOv.classList.add('open');
    sOv.setAttribute('aria-hidden', 'false');
    sIn.value = '';
    renderSearch('');
    setTimeout(function () { sIn.focus(); }, 30);
  }
  function renderSearch(q) {
    sRes.innerHTML = '';
    IDX.filter(function (e) { return !q || e.t.toLowerCase().indexOf(q) > -1; }).slice(0, 8).forEach(function (e) {
      var li = document.createElement('li'), a = document.createElement('a');
      a.href = e.u; a.textContent = e.t;
      var sp = document.createElement('span'); sp.textContent = e.s;
      a.appendChild(sp);
      a.addEventListener('click', closeSearch);
      li.appendChild(a); sRes.appendChild(li);
    });
  }
  var sBtn = $('#searchBtn'), sX = $('#searchClose');
  if (sBtn) sBtn.addEventListener('click', openSearch);
  if (sX) sX.addEventListener('click', closeSearch);
  if (sOv) sOv.addEventListener('click', function (e) { if (e.target === sOv) closeSearch(); });
  if (sIn) sIn.addEventListener('input', function () { renderSearch(sIn.value.trim().toLowerCase()); });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) {
      e.preventDefault(); openSearch();
    }
    if (e.key === 'Escape') closeSearch();
  });

  // Copy buttons
  $all('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      function done() { toast('Copied: ' + b.dataset.copy); }
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, done);
      else done();
    });
  });

  // Newsletter via inbox delivery
  var nf = $('#newsForm');
  if (nf) nf.addEventListener('submit', function (e) {
    e.preventDefault();
    var em = nf.email.value.trim(), nn = $('#newsNote');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { nn.textContent = 'Enter a valid email to subscribe.'; return; }
    nn.textContent = 'Subscribing…';
    fetch('https://formsubmit.co/ajax/brianonyango229@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: em, _subject: 'Newsletter signup: ' + em })
    }).then(function (r) {
      if (!r.ok) throw 0;
      nn.textContent = 'Subscribed — welcome aboard.';
      nf.reset();
    }).catch(function () { nn.textContent = 'Subscribe failed — email me directly instead.'; });
  });

  // Exit-intent nudge (once per session)
  var exited = false;
  try { exited = sessionStorage.getItem('exitNudge') === '1'; } catch (e) {}
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget && e.clientY <= 0 && !exited) {
      exited = true;
      try { sessionStorage.setItem('exitNudge', '1'); } catch (e2) {}
      toast('Leaving already? <a href="#contact">Say hi first</a>', 5000);
    }
  });

  // Confetti engine
  var fx = $('#fx');
  function burst(n, spread) {
    if (!fx || RM) return;
    var c = fx.getContext('2d');
    fx.width = innerWidth; fx.height = innerHeight;
    var cols = ['#35a7ff', '#4cc38a', '#d9a441', '#ff5a5a', '#ffffff'], ps = [];
    for (var i = 0; i < (n || 90); i++) ps.push({ x: innerWidth / 2, y: innerHeight * 0.7, vx: (Math.random() - 0.5) * (spread || 12), vy: -Math.random() * 11 - 3, g: 0.35, s: Math.random() * 6 + 3, c: cols[i % cols.length], r: Math.random() * 6 });
    var frames = 0;
    (function anim() {
      c.clearRect(0, 0, fx.width, fx.height);
      ps.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.vy += p.g; p.r += 0.1;
        c.save(); c.translate(p.x, p.y); c.rotate(p.r);
        c.fillStyle = p.c; c.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        c.restore();
      });
      if (++frames < 130) requestAnimationFrame(anim);
      else c.clearRect(0, 0, fx.width, fx.height);
    })();
  }
  window.fireConfetti = function () { burst(90, 12); };

  // Konami easter egg
  var seq = [], CODE = '38,38,40,40,37,39,37,39,66,65';
  document.addEventListener('keydown', function (e) {
    seq.push(e.keyCode);
    if (seq.length > 10) seq.shift();
    if (seq.join(',') === CODE) {
      toast('Konami! You debug like a red teamer. 🎉');
      burst(160, 16);
      seq = [];
    }
  });

  // Magnetic buttons (fine pointers only)
  if (FINE && !RM) {
    $all('.magnet').forEach(function (m) {
      m.addEventListener('mousemove', function (e) {
        var r = m.getBoundingClientRect();
        m.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * 0.15 + 'px,' + (e.clientY - r.top - r.height / 2) * 0.2 + 'px)';
      });
      m.addEventListener('mouseleave', function () { m.style.transform = ''; });
    });
  }

  // December snow
  var snow = $('#snow');
  if (snow && !RM && new Date().getMonth() === 11) {
    snow.style.display = 'block';
    var sctx = snow.getContext('2d'), flakes = [];
    snow.width = innerWidth; snow.height = innerHeight;
    for (var f = 0; f < 80; f++) flakes.push({ x: Math.random() * snow.width, y: Math.random() * snow.height, r: Math.random() * 2.5 + 0.8, v: Math.random() * 0.9 + 0.3 });
    (function fall() {
      sctx.clearRect(0, 0, snow.width, snow.height);
      sctx.fillStyle = 'rgba(255,255,255,.8)';
      flakes.forEach(function (p) {
        p.y += p.v;
        if (p.y > snow.height) { p.y = -4; p.x = Math.random() * snow.width; }
        sctx.beginPath(); sctx.arc(p.x, p.y, p.r, 0, 7); sctx.fill();
      });
      requestAnimationFrame(fall);
    })();
  }

  // Service worker (http only)
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
