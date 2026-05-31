/* ═══════════════════════════════════════════════════════════
   PROJETCH INOVAÇÕES — main.js  v2.0
   Stack: Vanilla ES2022 — módulos via IIFE
   ═══════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  /* ── UTILS ──────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const isMobile = () => window.innerWidth <= 768;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ── LOADING SCREEN ─────────────────────────────────────── */
  const loader = $('#loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 900);
    });
  }

  /* ── SCROLL PROGRESS ────────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);

  /* ── CURSOR PERSONALIZADO ───────────────────────────────── */
  let cursor = null, ring = null;
  let mx = 0, my = 0, rx = 0, ry = 0;

  if (!isMobile()) {
    cursor = document.createElement('div'); cursor.className = 'cursor';
    ring   = document.createElement('div'); ring.className   = 'cursor-ring';
    document.body.append(cursor, ring);

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.cssText += `left:${mx}px;top:${my}px;`;
    });

    const animRing = () => {
      rx = lerp(rx, mx, 0.12);
      ry = lerp(ry, my, 0.12);
      ring.style.cssText += `left:${rx}px;top:${ry}px;`;
      requestAnimationFrame(animRing);
    };
    animRing();

    const hoverSel = 'a, button, .tech-pill, .service-card, .diff-card, .project-card, .stat-box, .hamburger, input, select, textarea, .process-card';
    $$(hoverSel).forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }

  /* ── CANVAS PARTICLES (hero) ────────────────────────────── */
  const canvas = $('#hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, pts;

    const resize = () => {
      w = canvas.width  = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const NUM = isMobile() ? 40 : 80;
    const buildPoints = () => Array.from({ length: NUM }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5
    }));
    pts = buildPoints();
    window.addEventListener('resize', () => { pts = buildPoints(); });

    const LINK_DIST = 140;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96,165,250,0.5)';
        ctx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.18 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ── TYPEWRITER (hero) ──────────────────────────────────── */
  const typedWrap = $('.hero-typed-wrap');
  if (typedWrap) {
    const phrases = [
      'Criamos sites e aplicativos modernos com IA integrada.',
      'Do conceito ao deploy com GitHub, segurança e performance.',
      'Banco de dados, APIs e automação para o seu negócio.',
      'Inovação digital com foco em resultado e experiência.'
    ];
    let pi = 0, ci = 0, deleting = false;
    const typed = document.createElement('span');
    const cursor2 = document.createElement('span'); cursor2.className = 'typed-cursor';
    typedWrap.append(typed, cursor2);

    const tick = () => {
      const phrase = phrases[pi];
      if (!deleting) {
        typed.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) { deleting = true; return setTimeout(tick, 2200); }
      } else {
        typed.textContent = phrase.slice(0, --ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; return setTimeout(tick, 400); }
      }
      setTimeout(tick, deleting ? 36 : 58);
    };
    setTimeout(tick, 1000);
  }

  /* ── TECH STRIP MARQUEE ─────────────────────────────────── */
  const track = $('.tech-track');
  if (track && !track.dataset.cloned) {
    track.dataset.cloned = '1';
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.parentElement.appendChild(clone);
  }

  /* ── 3D CARD TILT ───────────────────────────────────────── */
  if (!isMobile()) {
    $$('.service-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) scale(1.02)`;
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── COUNTER ANIMATION ──────────────────────────────────── */
  const animateCounter = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/([\+\d\/]+)(%|h?)/);
    if (!match) return;
    const prefix = raw.startsWith('+') ? '+' : '';
    const suffix = match[2] || '';
    const numStr = match[1].replace('+', '');

    if (numStr.includes('/')) { return; } // "24/7" — skip animation

    const target = parseFloat(numStr);
    if (isNaN(target)) return;

    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(target * eased);
      el.textContent = `${prefix}${val}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ── SCROLL REVEAL + COUNTER TRIGGER ───────────────────── */
  const revealEls = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  $$('.stat-num').forEach(el => counterObs.observe(el));

  /* ── SCROLL: PROGRESS + NAV ─────────────────────────────── */
  const nav = $('nav');
  const onScroll = () => {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    progressBar.style.width = (scrollY / maxScroll * 100) + '%';
    nav?.classList.toggle('scrolled', scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE MENU ────────────────────────────────────────── */
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobile-menu');

  window.toggleMobile = () => {
    const open = mobileMenu?.classList.toggle('open');
    hamburger?.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', e => {
    if (
      mobileMenu?.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger?.contains(e.target)
    ) {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── ACTIVE NAV LINK ────────────────────────────────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active-link');
  });

  /* ── TOAST ──────────────────────────────────────────────── */
  let toastTimer = null;
  window.showToast = (msg, success = true) => {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.toggle('error', !success);
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
  };

  /* ── CONTACT FORM ───────────────────────────────────────── */
  window.submitForm = () => {
    const get = id => document.getElementById(id);
    const nome    = get('f-nome')?.value.trim();
    const empresa = get('f-empresa')?.value.trim();
    const email   = get('f-email')?.value.trim();
    const tel     = get('f-tel')?.value.trim();
    const tipo    = get('f-tipo')?.value;
    const prazo   = get('f-prazo')?.value;
    const desc    = get('f-desc')?.value.trim();
    const refs    = get('f-refs')?.value.trim();
    const lgpd    = get('f-lgpd')?.checked;
    const btn     = get('btn-submit');

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nome)                 return showToast('Informe seu nome.', false);
    if (!emailRe.test(email))  return showToast('Informe um e-mail válido.', false);
    if (!tipo)                 return showToast('Selecione o tipo de projeto.', false);
    if (!desc)                 return showToast('Descreva seu projeto.', false);
    if (!lgpd)                 return showToast('Aceite os termos da LGPD.', false);

    btn.disabled = true;
    const span = btn.querySelector('span') || btn;
    span.textContent = 'Enviando...';

    fetch('https://formsubmit.co/ajax/projetechinovacoes@gmail.com', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify({
        nome, empresa: empresa || 'Não informada', email,
        telefone: tel || 'Não informado', tipo_projeto: tipo,
        prazo: prazo || 'Não informado', descricao: desc,
        referencias: refs || 'Nenhuma',
        _subject:  `[Projetch] Novo projeto — ${tipo}`,
        _replyto:  email, _template: 'table', _captcha: 'false'
      })
    })
    .then(r => r.json())
    .then(data => {
      if (data.success === 'true' || data.success === true) {
        get('form-area').style.display    = 'none';
        get('form-success').style.display = 'block';
        showToast('Solicitação enviada com sucesso!', true);
      } else {
        throw new Error('server error');
      }
    })
    .catch(() => {
      btn.disabled = false;
      span.textContent = '⟶ ENVIAR SOLICITAÇÃO';
      showToast('Erro ao enviar. Tente pelo e-mail diretamente.', false);
    });
  };

  window.resetForm = () => {
    const get = id => document.getElementById(id);
    const btn = get('btn-submit');
    if (btn) { btn.disabled = false; (btn.querySelector('span') || btn).textContent = '⟶ ENVIAR SOLICITAÇÃO'; }
    ['f-nome','f-empresa','f-email','f-tel','f-tipo','f-prazo','f-desc','f-refs'].forEach(id => {
      const el = get(id); if (el) el.value = '';
    });
    const lgpd = get('f-lgpd'); if (lgpd) lgpd.checked = false;
    get('form-area').style.display    = 'block';
    get('form-success').style.display = 'none';
  };

  /* ── RESIZE: REFRESH CURSOR ─────────────────────────────── */
  window.addEventListener('resize', () => {
    if (!isMobile() && !cursor) location.reload();
  });

})();
