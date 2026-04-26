

document.addEventListener('DOMContentLoaded', () => {

  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    setTimeout(() => pageLoader.classList.add('hidden'), 1200);
  }

  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }, { passive: true });
  }

  const cursorDot = document.getElementById('cursorDot');
  if (cursorDot && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.opacity = '1';
    });

    (function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(animateCursor);
    })();

    const HOVER_TARGETS = 'a, button, [onclick], .project-pill, .member-name, .filter-btn, .btn-join, .skill-tag, .honor-card, .project-entry';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(HOVER_TARGETS)) cursorDot.classList.add('hovering');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(HOVER_TARGETS)) cursorDot.classList.remove('hovering');
    });
  } else if (cursorDot) {
    cursorDot.style.display = 'none';
  }

  const navbar   = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu  = document.getElementById('navMenu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

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

  const sectionInners = document.querySelectorAll('.section-inner');
  const navLabel      = document.getElementById('navSectionLabel');

  const SECTION_NAMES = ['KRL', 'Our Vision', 'About', 'Projects', 'Members'];
  const triggeredSections = new Set();

  if (sectionInners[0]) {
    sectionInners[0].classList.add('active');
    triggeredSections.add(0);
  }
  if (navLabel) navLabel.textContent = SECTION_NAMES[0];

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      const index = Array.from(sectionInners).indexOf(section);

      if (entry.isIntersecting) {
        section.classList.add('active');

        if (navLabel && index !== -1) {
          navLabel.style.opacity = '0';
          setTimeout(() => {
            navLabel.textContent = SECTION_NAMES[index] || 'KRL';
            navLabel.style.opacity = '1';
          }, 150);
        }

        if (index !== -1 && !triggeredSections.has(index)) {
          triggeredSections.add(index);
          triggerSectionEntry(section, index);
        }
      }
    });
  }, { threshold: 0.2 });

  sectionInners.forEach(section => sectionObserver.observe(section));

  function triggerSectionEntry(inner, index) {
    switch (index) {
      case 4: 
        triggerMembersExplosion();
        break;

    }
  }

  const heroBgText = document.getElementById('heroBgText');
  const heroSpline = document.getElementById('heroSpline');
  const heroInner  = document.getElementById('heroInner');

  if (heroInner && heroSpline) {
    heroInner.addEventListener('mousemove', e => {
      const rect = heroInner.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      heroSpline.style.transform = `perspective(1200px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    heroInner.addEventListener('mouseleave', () => {
      heroSpline.style.transition = 'transform 0.6s ease';
      heroSpline.style.transform  = 'perspective(1200px) rotateY(0) rotateX(0)';
      setTimeout(() => { heroSpline.style.transition = ''; }, 600);
    });
  }

  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const rotX = ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * -10;
      const rotY = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) *  10;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s ease';
      card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0)';
    });
  });

  const aboutBody = document.getElementById('aboutBody');
  const aboutText = document.getElementById('aboutText');

  if (aboutBody && aboutText) {
    aboutBody.innerHTML = aboutBody.innerHTML.trim()
      .split(/(<[^>]*>|\s+)/)
      .filter(w => w !== undefined && w !== '')
      .map(w => {
        if (w.startsWith('<') && w.endsWith('>')) return w;
        if (/^\s+$/.test(w)) return w;
        return `<span class="word">${w}</span>`;
      })
      .join('');

    const words = aboutBody.querySelectorAll('.word');

    aboutText.addEventListener('mousemove', e => {
      words.forEach(span => {
        const r    = span.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        span.style.color = dist < 160 ? '#1a1a1a' : '#aaaaaa';
      });
    });
    aboutText.addEventListener('mouseleave', () => {
      words.forEach(span => { span.style.color = '#1a1a1a'; });
    });
  }

  const projectsScatter = document.getElementById('projectsScatter');
  if (projectsScatter) {
    const pills = projectsScatter.querySelectorAll('.project-pill');

    projectsScatter.addEventListener('mousemove', e => {
      pills.forEach(pill => {
        const r    = pill.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        pill.style.transform  = dist < 200 ? 'scale(1.05)' : '';
        pill.style.boxShadow  = dist < 200 ? '0 6px 30px rgba(201,168,76,0.18)' : '';
      });
    });
    projectsScatter.addEventListener('mouseleave', () => {
      pills.forEach(p => { p.style.transform = ''; p.style.boxShadow = ''; });
    });
  }

  const membersScatter = document.getElementById('membersScatter');
  let membersExploded  = false;

  function scatterMembers() {
    const scatter  = document.getElementById('membersScatter');
    if (!scatter) return;

    const names    = scatter.querySelectorAll('.member-name');
    const placed   = [];
    const isMobile = window.innerWidth < 768;
    if (isMobile) return; 

    names.forEach((name, i) => {
      const isSenior = name.classList.contains('member-senior');
      let top, left, attempts = 0;

      const vBuffer = isMobile ? (isSenior ? 8 : 6) : (isSenior ? 9 : 7);
      const hBuffer = isMobile ? (isSenior ? 32 : 25) : (isSenior ? 14 : 10);

      do {
        if (isSenior) {
          top  = 25 + Math.random() * 55;  
          left = 8  + Math.random() * 80;  
        } else {
          top  = 22 + Math.random() * 62;  
          left = 5  + Math.random() * 87;  
        }
        attempts++;
      } while (
        attempts < 100 &&
        placed.some(p =>
          Math.abs(p.top - top) < vBuffer &&
          Math.abs(p.left - left) < hBuffer
        )
      );

      placed.push({ top, left });

      name.dataset.finalLeft = left + '%';
      name.dataset.finalTop  = top  + '%';
      name.style.left        = '50%';
      name.style.top         = '50%';
      name.style.opacity     = '0';

      name.style.transform   = 'translate(-50%, -50%) scale(0)';

      name.style.animationDelay = (i * 0.15) + 's';
      name.style.animationDuration = (4 + Math.random() * 4) + 's';
    });
  }

  window.addEventListener('load', scatterMembers);

  function triggerMembersExplosion() {
    if (membersExploded || !membersScatter || window.innerWidth < 768) return;
    membersExploded = true;

    const names  = Array.from(membersScatter.querySelectorAll('.member-name'));
    const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

    names.forEach((el, i) => {
      const isSenior = el.classList.contains('member-senior');

      const delay = isSenior
        ? i * 0.05
        : 0.3 + (i - 8) * 0.022;

      setTimeout(() => {

        el.style.transition = [
          `left 0.8s ${EASING}`,
          `top  0.8s ${EASING}`,
          `transform 0.8s ${EASING}`,
          `opacity 0.5s ease`
        ].join(', ');

        el.style.left      = el.dataset.finalLeft;
        el.style.top       = el.dataset.finalTop;
        el.style.transform = 'translate(-50%, -50%) scale(1)';
        el.style.opacity   = '1';

        setTimeout(() => {
          el.style.transition = '';
          const floatNum = Math.floor(Math.random() * 6) + 1;
          const dur      = (4 + Math.random() * 5).toFixed(1);
          const dly      = (Math.random() * 2).toFixed(1);
          el.classList.add(`float-${floatNum}`);
          el.style.animationDuration = dur + 's';
          el.style.animationDelay   = dly + 's';
        }, 1000);

      }, delay * 1000);
    });
  }

  const membersGrid = document.getElementById('membersGrid');
  if (membersGrid) {
    const cards = membersGrid.querySelectorAll('.member-card');
    const cardObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cards.forEach((card, i) => {
      card.style.transitionDelay = (i * 0.08) + 's';
      cardObserver.observe(card);
    });
  }

  const projectsFilter = document.getElementById('projectsFilter');
  const projectsGrid   = document.getElementById('projectsGrid');

  if (projectsFilter && projectsGrid) {
    const filterBtns  = projectsFilter.querySelectorAll('.filter-btn');
    const projectCards = projectsGrid.querySelectorAll('.project-card-full');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const domain = btn.dataset.filter;
        projectCards.forEach((card, i) => {
          if (domain === 'all' || card.dataset.domain === domain) {
            card.classList.remove('card-hidden');
            card.style.animationDelay = (i * 0.05) + 's';
            card.style.animation = 'none';
            card.offsetHeight;  
            card.style.animation = '';
          } else {
            card.classList.add('card-hidden');
          }
        });
      });
    });
  }

});

(function() {

  const revealSections = document.querySelectorAll('.section-inner');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15  
  });

  revealSections.forEach(sec => {

    if (sec.id !== 'heroInner') {
      revealObserver.observe(sec);
    }
  });

  const overlay    = document.getElementById('krl-transition-overlay');
  const circle     = document.getElementById('krl-overlay-circle');

  const sectionColors = {
    'heroInner':     '#1a1a1a',
    'visionInner':   '#1a2f1a',
    'aboutInner':    '#1a1a2f',
    'projectsInner': '#2f1a0a',
    'membersInner':  '#1a1a1a'
  };

  function runOverlay(targetEl, color) {
    if (!overlay || !circle) return;

    circle.style.background = color || '#1a1a1a';
    overlay.classList.add('active');
    circle.classList.remove('shrink');
    circle.classList.add('expand');

    setTimeout(() => {

      targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });

      setTimeout(() => {
        circle.classList.remove('expand');
        circle.classList.add('shrink');

        setTimeout(() => {
          overlay.classList.remove('active');
          circle.classList.remove('shrink');
        }, 600);

      }, 80);
    }, 500);
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId  = this.getAttribute('href').replace('#', '');
      const targetEl  = document.getElementById(targetId);
      if (!targetEl) return;
      e.preventDefault();
      const color = sectionColors[targetId] || '#1a1a1a';
      runOverlay(targetEl, color);
    });
  });

})();

(function () {

  const hero       = document.getElementById('heroInner');
  const butterfly  = document.getElementById('butterfly-cursor');
  const cursorDot  = document.getElementById('cursorDot');
  if (!hero || !butterfly) return;

  let mouseX = -200, mouseY = -200;   
  let bfX    = -200, bfY    = -200;   
  let prevX  = -200, prevY  = -200;   
  let rafId  = null;
  let insideHero = false;

  const LERP = 0.14;   

  function lerpStep() {
    bfX += (mouseX - bfX) * LERP;
    bfY += (mouseY - bfY) * LERP;

    butterfly.style.transform = `translate(${bfX}px, ${bfY}px)`;

    const speed = Math.sqrt(
      Math.pow(mouseX - prevX, 2) +
      Math.pow(mouseY - prevY, 2)
    );
    prevX = mouseX;
    prevY = mouseY;

    if (speed > 18) {
      butterfly.classList.add('flap-fast');
    } else {
      butterfly.classList.remove('flap-fast');
    }

    rafId = requestAnimationFrame(lerpStep);
  }

  hero.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    spawnSparkle(e.clientX, e.clientY);
  });

  hero.addEventListener('mouseenter', function () {
    insideHero = true;
    butterfly.classList.add('visible');

    if (cursorDot) cursorDot.style.opacity = '0';

    if (!rafId) rafId = requestAnimationFrame(lerpStep);
  });

  hero.addEventListener('mouseleave', function () {
    insideHero = false;
    butterfly.classList.remove('visible');
    butterfly.classList.remove('flap-fast');

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

    const ox = (Math.random() - 0.5) * 20;
    const oy = (Math.random() - 0.5) * 20;
    s.style.left = (x + ox - 2.5) + 'px';
    s.style.top  = (y + oy - 2.5) + 'px';

    const colors = ['#c9a84c', '#e8d5a0', '#ffffff', '#b8942e'];
    s.style.background = colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(s);

    setTimeout(() => s.remove(), 650);
  }

})();
