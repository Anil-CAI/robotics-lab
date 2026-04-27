

const IS_MOBILE = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 769;

/* ── 1. DOMContentLoaded block ── */
document.addEventListener('DOMContentLoaded', () => {

  /* Page loader */
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    setTimeout(() => pageLoader.classList.add('hidden'), IS_MOBILE ? 400 : 1200);
  }

  /* Scroll progress bar */
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      scrollProgress.style.width = pct + '%';
    }, { passive: true });
  }

  /* Custom cursor — desktop only */
  const cursorDot = document.getElementById('cursorDot');
  if (cursorDot && !IS_MOBILE) {
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.opacity = '1';
    });
    (function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursorDot.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px)';
      requestAnimationFrame(animateCursor);
    })();
    const HOVER_TARGETS = 'a,button,[onclick],.project-pill,.member-name,.filter-btn,.btn-join,.skill-tag,.honor-card,.project-entry';
    document.addEventListener('mouseover', e => { if (e.target.closest(HOVER_TARGETS)) cursorDot.classList.add('hovering'); });
    document.addEventListener('mouseout',  e => { if (e.target.closest(HOVER_TARGETS)) cursorDot.classList.remove('hovering'); });
  } else if (cursorDot) {
    cursorDot.style.display = 'none';
  }

  /* Navbar scroll state */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* Mobile nav toggle */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  /* Section observer — updates nav label & triggers section entry */
  const sectionInners = document.querySelectorAll('.section-inner');
  const navLabel      = document.getElementById('navSectionLabel');
  const SECTION_NAMES = ['KRL', 'Our Vision', 'About', 'Projects', 'Members'];
  const triggered     = new Set();

  if (sectionInners[0]) { sectionInners[0].classList.add('active'); triggered.add(0); }
  if (navLabel) navLabel.textContent = SECTION_NAMES[0];

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const section = entry.target;
      const idx = Array.from(sectionInners).indexOf(section);
      section.classList.add('active');
      if (navLabel && idx !== -1) {
        navLabel.style.opacity = '0';
        setTimeout(() => { navLabel.textContent = SECTION_NAMES[idx] || 'KRL'; navLabel.style.opacity = '1'; }, 150);
      }
      if (idx !== -1 && !triggered.has(idx)) {
        triggered.add(idx);
        if (idx === 4 && !IS_MOBILE) triggerMembersExplosion();
      }
    });
  }, { threshold: 0.05 });
  sectionInners.forEach(s => sectionObserver.observe(s));

  /* Hero spline tilt — desktop only */
  const heroSpline = document.getElementById('heroSpline');
  const heroInner  = document.getElementById('heroInner');
  if (heroInner && heroSpline && !IS_MOBILE) {
    heroInner.addEventListener('mousemove', e => {
      const r = heroInner.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      heroSpline.style.transform = 'perspective(1200px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg)';
    });
    heroInner.addEventListener('mouseleave', () => {
      heroSpline.style.transition = 'transform 0.6s ease';
      heroSpline.style.transform  = 'perspective(1200px) rotateY(0) rotateX(0)';
      setTimeout(() => { heroSpline.style.transition = ''; }, 600);
    });
  }

  /* Vision card tilt — desktop only */
  if (!IS_MOBILE) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rotX = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -10;
        const rotY = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  10;
        card.style.transform = 'perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
      });
      card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.4s ease';
        card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0)';
      });
    });
  }

  /* About-body word hover — desktop only */
  const aboutBody = document.getElementById('aboutBody');
  const aboutText = document.getElementById('aboutText');
  if (aboutBody && aboutText && !IS_MOBILE) {
    aboutBody.innerHTML = aboutBody.innerHTML.trim()
      .split(/(<[^>]*>|\s+)/)
      .filter(function(w) { return w !== undefined && w !== ''; })
      .map(function(w) {
        if (w.startsWith('<') && w.endsWith('>')) return w;
        if (/^\s+$/.test(w)) return w;
        return '<span class="word">' + w + '</span>';
      })
      .join('');
    const words = aboutBody.querySelectorAll('.word');
    aboutText.addEventListener('mousemove', e => {
      words.forEach(span => {
        const r = span.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        span.style.color = d < 160 ? '#1a1a1a' : '#aaaaaa';
      });
    });
    aboutText.addEventListener('mouseleave', () => { words.forEach(s => { s.style.color = '#1a1a1a'; }); });
  }

  /* Projects scatter hover — desktop only */
  const projectsScatter = document.getElementById('projectsScatter');
  if (projectsScatter && !IS_MOBILE) {
    const pills = projectsScatter.querySelectorAll('.project-pill');
    projectsScatter.addEventListener('mousemove', e => {
      pills.forEach(pill => {
        const r = pill.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        pill.style.transform = d < 200 ? 'scale(1.05)' : '';
        pill.style.boxShadow = d < 200 ? '0 6px 30px rgba(201,168,76,0.18)' : '';
      });
    });
    projectsScatter.addEventListener('mouseleave', () => {
      pills.forEach(p => { p.style.transform = ''; p.style.boxShadow = ''; });
    });
  }

  /* Members scatter — desktop only */
  const membersScatter = document.getElementById('membersScatter');

  function scatterMembers() {
    if (!membersScatter || IS_MOBILE) return;
    const names  = membersScatter.querySelectorAll('.member-name');
    const placed = [];
    names.forEach(function(name) {
      const isSenior = name.classList.contains('member-senior');
      const vBuf = isSenior ? 9 : 7;
      const hBuf = isSenior ? 14 : 10;
      let top, left, attempts = 0;
      do {
        top  = (isSenior ? 25 : 22) + Math.random() * (isSenior ? 55 : 62);
        left = (isSenior ? 8  : 5)  + Math.random() * (isSenior ? 80 : 87);
        attempts++;
      } while (attempts < 100 && placed.some(function(p) { return Math.abs(p.top - top) < vBuf && Math.abs(p.left - left) < hBuf; }));
      placed.push({ top: top, left: left });
      name.dataset.finalLeft = left + '%';
      name.dataset.finalTop  = top  + '%';
      name.style.left        = '50%';
      name.style.top         = '50%';
      name.style.opacity     = '0';
      name.style.transform   = 'translate(-50%, -50%) scale(0)';
    });
  }
  window.addEventListener('load', scatterMembers);

  function triggerMembersExplosion() {
    if (!membersScatter || IS_MOBILE) return;
    const names  = Array.from(membersScatter.querySelectorAll('.member-name'));
    const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
    names.forEach(function(el, i) {
      const isSenior = el.classList.contains('member-senior');
      const delay    = isSenior ? i * 0.05 : 0.3 + (i - 8) * 0.022;
      setTimeout(function() {
        el.style.transition = 'left 0.8s ' + EASING + ', top 0.8s ' + EASING + ', transform 0.8s ' + EASING + ', opacity 0.5s ease';
        el.style.left       = el.dataset.finalLeft;
        el.style.top        = el.dataset.finalTop;
        el.style.transform  = 'translate(-50%, -50%) scale(1)';
        el.style.opacity    = '1';
        setTimeout(function() {
          el.style.transition = '';
          const floatNum = (i % 6) + 1;
          el.classList.add('float-' + floatNum);
          el.style.animationDuration = (4 + (i % 5)) + 's';
          el.style.animationDelay   = ((i % 3) * 0.5) + 's';
        }, 900);
      }, delay * 1000);
    });
  }

  /* Members grid observer (members.html) */
  const membersGrid = document.getElementById('membersGrid');
  if (membersGrid) {
    const cards = membersGrid.querySelectorAll('.member-card');
    const cardObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          cardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach(function(card, i) {
      if (!IS_MOBILE) card.style.transitionDelay = (i * 0.06) + 's';
      cardObs.observe(card);
    });
  }

  /* Projects filter */
  const projectsFilter = document.getElementById('projectsFilter');
  const projectsGrid   = document.getElementById('projectsGrid');
  if (projectsFilter && projectsGrid) {
    const filterBtns   = projectsFilter.querySelectorAll('.filter-btn');
    const projectCards = projectsGrid.querySelectorAll('.project-card-full');
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const domain = btn.dataset.filter;
        projectCards.forEach(function(card) {
          card.classList.toggle('card-hidden', domain !== 'all' && card.dataset.domain !== domain);
        });
      });
    });
  }
});

/* ── 2. Reveal IIFE ── */
(function () {
  const revealSections = document.querySelectorAll('.section-inner');

  /* Mobile: instantly mark all visible — no observer latency, no blank flash */
  if (IS_MOBILE) {
    revealSections.forEach(function(sec) { sec.classList.add('section-visible', 'active'); });
    return;
  }

  /* Desktop: observe and reveal on scroll */
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealSections.forEach(function(sec) {
    if (sec.id !== 'heroInner') revealObserver.observe(sec);
  });

  /* Page-transition overlay */
  const overlay = document.getElementById('krl-transition-overlay');
  const circle  = document.getElementById('krl-overlay-circle');
  const sectionColors = {
    heroInner: '#1a1a1a', visionInner: '#1a2f1a',
    aboutInner: '#1a1a2f', projectsInner: '#2f1a0a', membersInner: '#1a1a1a'
  };

  function runOverlay(targetEl, color) {
    if (!overlay || !circle) return;
    circle.style.background = color || '#1a1a1a';
    overlay.classList.add('active');
    circle.classList.remove('shrink');
    circle.classList.add('expand');
    setTimeout(function() {
      targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
      setTimeout(function() {
        circle.classList.remove('expand');
        circle.classList.add('shrink');
        setTimeout(function() { overlay.classList.remove('active'); circle.classList.remove('shrink'); }, 600);
      }, 80);
    }, 500);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      e.preventDefault();
      runOverlay(targetEl, sectionColors[targetId] || '#1a1a1a');
    });
  });
})();

/* ── 3. Butterfly cursor IIFE — desktop hero only ── */
(function () {
  if (IS_MOBILE) return;
  const hero      = document.getElementById('heroInner');
  const butterfly = document.getElementById('butterfly-cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (!hero || !butterfly) return;

  let mouseX = -200, mouseY = -200, bfX = -200, bfY = -200;
  let prevX  = -200, prevY  = -200, rafId = null;
  const LERP = 0.14;

  function lerpStep() {
    bfX += (mouseX - bfX) * LERP;
    bfY += (mouseY - bfY) * LERP;
    butterfly.style.transform = 'translate(' + bfX + 'px, ' + bfY + 'px)';
    const speed = Math.hypot(mouseX - prevX, mouseY - prevY);
    prevX = mouseX; prevY = mouseY;
    butterfly.classList.toggle('flap-fast', speed > 18);
    rafId = requestAnimationFrame(lerpStep);
  }

  hero.addEventListener('mousemove', function(e) { mouseX = e.clientX; mouseY = e.clientY; spawnSparkle(e.clientX, e.clientY); });
  hero.addEventListener('mouseenter', function() {
    butterfly.classList.add('visible');
    if (cursorDot) cursorDot.style.opacity = '0';
    if (!rafId) rafId = requestAnimationFrame(lerpStep);
  });
  hero.addEventListener('mouseleave', function() {
    butterfly.classList.remove('visible', 'flap-fast');
    if (cursorDot) cursorDot.style.opacity = '';
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  });

  let lastSparkle = 0;
  function spawnSparkle(x, y) {
    const now = Date.now();
    if (now - lastSparkle < 80) return;
    lastSparkle = now;
    const s = document.createElement('div');
    s.className = 'butterfly-sparkle';
    s.style.left       = (x + (Math.random() - 0.5) * 20 - 2.5) + 'px';
    s.style.top        = (y + (Math.random() - 0.5) * 20 - 2.5) + 'px';
    const colors = ['#c9a84c','#e8d5a0','#ffffff','#b8942e'];
    s.style.background = colors[Math.floor(Math.random() * 4)];
    document.body.appendChild(s);
    setTimeout(function() { s.remove(); }, 650);
  }
})();
