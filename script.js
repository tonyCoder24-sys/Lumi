'use strict';

function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    setTimeout(triggerHeroAnimations, 150);
  };

  document.body.style.overflow = 'hidden';
  setTimeout(hideLoader, 2200);
}

function triggerHeroAnimations() {
  const heroReveal = document.querySelectorAll('#hero .reveal-up');
  heroReveal.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 120);
  });
}

function initCursor() {
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursor-trail');
  if (!cursor || !cursorTrail) return;

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  const animateTrail = () => {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    rafId = requestAnimationFrame(animateTrail);
  };
  animateTrail();

  const hoverables = 'a, button, .portfolio-card, .service-card, .filter-btn, .skill-tag';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverables)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverables)) document.body.classList.remove('cursor-hover');
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorTrail.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorTrail.style.opacity = '0.35';
  });
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = pct + '%';
  };

  window.addEventListener('scroll', update, { passive: true });
}

function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const links     = document.querySelectorAll('.nav-link');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const sections = Array.from(document.querySelectorAll('section[id], footer[id]'));

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    let active = '';

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) active = sec.id;
    });

    links.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === active);
    });
  }
}

function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const MOBILE = window.innerWidth < 768;
  const COUNT  = MOBILE ? 24 : 55;
  let W, H, particles = [], rafId;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const createParticle = () => ({
    x:    Math.random() * W,
    y:    Math.random() * H,
    r:    Math.random() * 1.4 + 0.3,
    vx:   (Math.random() - 0.5) * 0.18,
    vy:   -(Math.random() * 0.25 + 0.05),
    life: Math.random(),
    speed:Math.random() * 0.003 + 0.001
  });

  for (let i = 0; i < COUNT; i++) particles.push(createParticle());

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.life = (p.life + p.speed) % 1;
      const alpha = Math.sin(p.life * Math.PI) * 0.55;
      const x = p.x + Math.sin(p.life * Math.PI * 2) * 20;
      const y = p.y - p.life * H * 0.1;

      ctx.beginPath();
      ctx.arc(x < 0 ? x + W : x > W ? x - W : x,
              y < 0 ? y + H : y > H ? y - H : y,
              p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 145, 58, ${alpha})`;
      ctx.fill();
    });

    rafId = requestAnimationFrame(draw);
  };

  draw();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else draw();
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.reveal-up:not(#hero .reveal-up), .reveal-left, .reveal-right'
  );

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

function initPortfolio() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.transition = 'opacity 0.35s, transform 0.35s';
        if (match) {
          card.classList.remove('hidden');
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => card.classList.add('hidden'), 350);
        }
      });
    });
  });

  const modal    = document.getElementById('project-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  const mThumb   = document.getElementById('modal-thumb');
  const mTitle   = document.getElementById('modal-title');
  const mTags    = document.getElementById('modal-tags');
  const mDesc    = document.getElementById('modal-desc');
  const mLink    = document.getElementById('modal-link');

  const openModal = (card) => {
    mTitle.textContent = card.dataset.title    || 'Project';
    mTags.textContent  = card.dataset.tags     || '';
    mDesc.textContent  = card.dataset.description || '';
    mLink.href         = card.dataset.link     || '#';

    const thumbSrc = card.querySelector('.card-thumb');
    if (thumbSrc) {
      mThumb.style.cssText = thumbSrc.style.cssText;
      mThumb.innerHTML = '';
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  cards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
  });

  if (closeBtn)  closeBtn.addEventListener('click', closeModal);
  if (backdrop)  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function initTestimonialCarousel() {
  const track    = document.getElementById('testimonial-track');
  const dotsWrap = document.getElementById('carousel-dots');
  const prevBtn  = document.getElementById('carousel-prev');
  const nextBtn  = document.getElementById('carousel-next');

  if (!track) return;

  const cards     = Array.from(track.querySelectorAll('.testimonial-card'));
  const total     = cards.length;
  let current     = 0;
  let autoInterval;

  const dots = cards.map((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.addEventListener('click', () => goTo(i));
    dotsWrap && dotsWrap.appendChild(btn);
    return btn;
  });

  const goTo = (index) => {
    current = (index + total) % total;
    const cardWidth = track.parentElement.offsetWidth;
    track.style.transform = `translateX(-${current * (cardWidth + 24)}px)`;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  };

  if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(autoInterval); goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(autoInterval); goTo(current + 1); startAuto(); });

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      clearInterval(autoInterval);
      goTo(delta > 0 ? current + 1 : current - 1);
      startAuto();
    }
  }, { passive: true });

  const startAuto = () => {
    clearInterval(autoInterval);
    autoInterval = setInterval(() => goTo(current + 1), 5000);
  };
  startAuto();

  track.addEventListener('mouseenter', () => clearInterval(autoInterval));
  track.addEventListener('mouseleave', startAuto);

  window.addEventListener('resize', () => goTo(current), { passive: true });
}

function initContactForm() {
  const submitBtn = document.getElementById('form-submit');
  const status    = document.getElementById('form-status');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');

    let valid = true;
    [name, email, message].forEach(field => {
      if (!field) return;
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(200,80,80,0.5)';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) {
      if (status) {
        status.style.color = '#e07070';
        status.textContent = 'Please fill in all required fields.';
      }
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    setTimeout(() => {
      if (status) {
        status.style.color = 'var(--gold)';
        status.textContent = '✓ Message sent! I\'ll reply within 48 hours.';
      }
      submitBtn.textContent = 'Message Sent ✓';
    }, 1200);
  });
}

function initMouseGlow() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'mouse-glow';
  document.body.appendChild(glow);

  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let glowX = cx, glowY = cy;
  let rafId;

  document.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
  }, { passive: true });

  const animate = () => {
    glowX += (cx - glowX) * 0.06;
    glowY += (cy - glowY) * 0.06;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    rafId = requestAnimationFrame(animate);
  };
  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else animate();
  });
}

function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

function initHeroParallax() {
  const heroContent = document.querySelector('.hero-content');
  const orbs = document.querySelectorAll('.hero-orb');
  if (!heroContent) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    targetX = (e.clientX - cx) / cx;
    targetY = (e.clientY - cy) / cy;
  }, { passive: true });

  const animate = () => {
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;

    heroContent.style.transform = `
      perspective(1000px)
      rotateY(${currentX * 2}deg)
      rotateX(${-currentY * 1.5}deg)
      translateZ(0)
    `;

    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 0.4;
      orb.style.transform = `translate(${-currentX * 20 * depth}px, ${-currentY * 15 * depth}px)`;
    });

    rafId = requestAnimationFrame(animate);
  };
  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else animate();
  });
}

const modal = document.getElementById('project-modal');
const modalVideo = document.getElementById('modal-video');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');
const modalLink = document.getElementById('modal-link');

document.querySelectorAll('.portfolio-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-description');
    const tags = card.getAttribute('data-tags');
    const link = card.getAttribute('data-link');
    
    const youtubeUrl = card.querySelector('iframe').src;

    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalTags.textContent = tags;
    modalLink.href = link;
    modalVideo.src = youtubeUrl;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('active');
  modalVideo.src = "";
  document.body.style.overflow = '';
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-backdrop').addEventListener('click', closeModal);

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initScrollProgress();
  initNavbar();
  initParticleCanvas();
  initScrollReveal();
  initPortfolio();
  initStatsCounter();
  initTestimonialCarousel();
  initContactForm();
  initMouseGlow();
  initFooterYear();
  initHeroParallax();
});