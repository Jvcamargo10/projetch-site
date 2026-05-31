/* ═══════════════════════════════════════════════════════════
   PROJETCH INOVAÇÕES — main.js  v3.0
   Vanilla ES2022 — sem dependências externas
   ═══════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  /* ── UTILS ──────────────────────────────────────────────── */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const isMobile = () => window.innerWidth <= 768;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const map = (v, a, b, c, d) => c + ((v - a) / (b - a)) * (d - c);

  /* ── LOADING SCREEN ─────────────────────────────────────── */
  const loader = $('#loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 1000);
    });
  }

  /* ── SCROLL PROGRESS BAR ────────────────────────────────── */
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);

  /* ── CUSTOM CURSOR ──────────────────────────────────────── */
  let dot = null, ring = null;
  let mx = 0, my = 0, rx = 0, ry = 0;

  if (!isMobile()) {
    dot  = Object.assign(document.createElement('div'), { className: 'cursor' });
    ring = Object.assign(document.createElement('div'), { className: 'cursor-ring' });
    document.body.append(dot, ring);

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    document.addEventListener('mousedown', () => dot.classList.add('clicking'));
    document.addEventListener('mouseup',   () => dot.classList.remove('clicking'));

    const tickRing = () => {
      rx = lerp(rx, mx, 0.11);
      ry = lerp(ry, my, 0.11);
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(tickRing);
    };
    tickRing();

    const hoverSel = 'a, button, .tech-pill, .service-card, .diff-card, .project-card, .stat-box, .stat-item, .hamburger, .testimonial-card, .process-card, input, select, textarea';
    $$(hoverSel).forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }

  /* ── CANVAS PARTICLES ───────────────────────────────────── */
  const canvas = $('#hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, pts;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    new ResizeObserver(resize).observe(canvas.parentElement);

    const N = isMobile() ? 35 : 70;
    const make = () => Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.4,
    }));
    pts = make();
    window.addEventListener('resize', () => { pts = make(); });

    const D = 130;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96,165,250,0.55)';
        ctx.fill();
      }
      for (let i = 0; i < pts.length - 1; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < D) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.2 * (1 - d / D)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ── TYPEWRITER ─────────────────────────────────────────── */
  const typedWrap = $('.hero-typed-wrap');
  if (typedWrap) {
    const lines = [
      'Criamos sites e aplicativos modernos com IA integrada.',
      'Do conceito ao deploy com GitHub, segurança e performance.',
      'Banco de dados, APIs e automação para o seu negócio crescer.',
      'Inovação digital com foco em resultado e experiência real.',
    ];
    let pi = 0, ci = 0, del = false;
    const typed = document.createElement('span');
    const cur = document.createElement('span');
    cur.className = 'typed-cursor';
    typedWrap.append(typed, cur);

    const tick = () => {
      const line = lines[pi];
      if (!del) {
        typed.textContent = line.slice(0, ++ci);
        if (ci === line.length) { del = true; return setTimeout(tick, 2400); }
      } else {
        typed.textContent = line.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % lines.length; return setTimeout(tick, 400); }
      }
      setTimeout(tick, del ? 32 : 56);
    };
    setTimeout(tick, 1200);
  }

  /* ── TECH STRIP: marquee clone ──────────────────────────── */
  const track = $('.tech-track');
  if (track && !track.dataset.cloned) {
    track.dataset.cloned = '1';
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.parentElement.appendChild(clone);
  }

  /* ── 3-D CARD TILT ──────────────────────────────────────── */
  if (!isMobile()) {
    $$('.service-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 7}deg) scale3d(1.025,1.025,1)`;
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
        setTimeout(() => card.style.transition = '', 500);
      });
    });
  }

  /* ── MAGNETIC BUTTONS ───────────────────────────────────── */
  if (!isMobile()) {
    $$('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.3;
        const y = (e.clientY - r.top  - r.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.45s cubic-bezier(0.22,1,0.36,1)';
        setTimeout(() => btn.style.transition = '', 450);
      });
    });
  }

  /* ── HERO PARALLAX (mouse) ──────────────────────────────── */
  const heroVisual = $('.hero-visual');
  if (heroVisual && !isMobile()) {
    document.addEventListener('mousemove', e => {
      const xr = (e.clientX / window.innerWidth  - 0.5) * 18;
      const yr = (e.clientY / window.innerHeight - 0.5) * 12;
      heroVisual.style.transform = `translateY(-50%) rotateY(${xr}deg) rotateX(${-yr}deg)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      heroVisual.style.transform = 'translateY(-50%)';
    });
  }

  /* ── SCROLL PARALLAX on hero orbs ───────────────────────── */
  const heroBg = $('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.3}px)`;
    }, { passive: true });
  }

  /* ── ANIMATED COUNTERS ──────────────────────────────────── */
  const countUp = el => {
    const raw = el.textContent.trim();
    const pre = raw.startsWith('+') ? '+' : '';
    const suf = raw.endsWith('%') ? '%' : (raw.endsWith('/7') ? '/7' : (raw.endsWith('+') ? '+' : ''));
    if (raw.includes('/')) return; // skip "24/7"
    const num = parseFloat(raw.replace(/[^\d.]/g, ''));
    if (isNaN(num)) return;
    const t0 = performance.now();
    const dur = 1600;
    const step = now => {
      const p = clamp((now - t0) / dur, 0, 1);
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + Math.round(num * e) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ── SCROLL REVEAL + OBSERVERS ──────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
  $$('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => revealObs.observe(el));

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      countUp(e.target);
      counterObs.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  $$('.stat-num').forEach(el => counterObs.observe(el));

  /* ── SCROLL: NAV + PROGRESS ─────────────────────────────── */
  const nav = $('nav');
  const onScroll = () => {
    const y = window.scrollY;
    const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    bar.style.width = (y / max * 100) + '%';
    nav?.classList.toggle('scrolled', y > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE MENU ────────────────────────────────────────── */
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobile-menu');

  window.toggleMobile = () => {
    const open = mobileMenu?.classList.toggle('open');
    hamburger?.classList.toggle('open');
    hamburger?.setAttribute('aria-expanded', String(!!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
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
      hamburger?.setAttribute('aria-expanded', 'false');
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
  window.showToast = (msg, ok = true) => {
    const t = $('#toast'); if (!t) return;
    t.textContent = msg;
    t.classList.toggle('error', !ok);
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 4000);
  };

  /* ── CONTACT FORM ───────────────────────────────────────── */
  window.submitForm = () => {
    const g = id => document.getElementById(id);
    const nome  = g('f-nome')?.value.trim();
    const emp   = g('f-empresa')?.value.trim();
    const email = g('f-email')?.value.trim();
    const tel   = g('f-tel')?.value.trim();
    const tipo  = g('f-tipo')?.value;
    const prazo = g('f-prazo')?.value;
    const desc  = g('f-desc')?.value.trim();
    const refs  = g('f-refs')?.value.trim();
    const lgpd  = g('f-lgpd')?.checked;
    const btn   = g('btn-submit');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nome)               return showToast('Informe seu nome.', false);
    if (!emailRe.test(email)) return showToast('Informe um e-mail válido.', false);
    if (!tipo)               return showToast('Selecione o tipo de projeto.', false);
    if (!desc)               return showToast('Descreva seu projeto.', false);
    if (!lgpd)               return showToast('Aceite os termos da LGPD.', false);

    btn.disabled = true;
    const span = btn.querySelector('span') || btn;
    span.textContent = 'Enviando...';

    fetch('https://formsubmit.co/ajax/projetechinovacoes@gmail.com', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        nome, empresa: emp || 'Não informada', email,
        telefone: tel || 'Não informado', tipo_projeto: tipo,
        prazo: prazo || 'Não informado', descricao: desc,
        referencias: refs || 'Nenhuma',
        _subject:  `[Projetch] Novo projeto — ${tipo}`,
        _replyto:  email, _template: 'table', _captcha: 'false',
      }),
    })
    .then(r => r.json())
    .then(d => {
      if (d.success === 'true' || d.success === true) {
        g('form-area').style.display    = 'none';
        g('form-success').style.display = 'block';
        showToast('Solicitação enviada com sucesso!', true);
      } else { throw new Error(); }
    })
    .catch(() => {
      btn.disabled = false;
      span.textContent = '⟶ ENVIAR SOLICITAÇÃO';
      showToast('Erro ao enviar. Tente pelo e-mail diretamente.', false);
    });
  };

  window.resetForm = () => {
    const g = id => document.getElementById(id);
    const btn = g('btn-submit');
    if (btn) { btn.disabled = false; (btn.querySelector('span') || btn).textContent = '⟶ ENVIAR SOLICITAÇÃO'; }
    ['f-nome','f-empresa','f-email','f-tel','f-tipo','f-prazo','f-desc','f-refs']
      .forEach(id => { const el = g(id); if (el) el.value = ''; });
    const lgpd = g('f-lgpd'); if (lgpd) lgpd.checked = false;
    g('form-area').style.display    = 'block';
    g('form-success').style.display = 'none';
  };

  /* ── RESIZE ─────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    if (!isMobile() && !dot) location.reload();
  });

})();
