
 // Custom cursor
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animateCursor() {
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  })();

  // Navbar scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Sticky buy button
  const stickyBuy = document.getElementById('sticky-buy');
  window.addEventListener('scroll', () => {
    stickyBuy.classList.toggle('visible', window.scrollY > window.innerHeight * 0.7);
  }, { passive: true });

  // Hero parallax
  const heroBg = document.getElementById('heroBg');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `scale(1) translateY(${window.scrollY * 0.2}px)`;
    }
  }, { passive: true });
  setTimeout(() => heroBg.classList.add('loaded'), 100);

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Contact form (Formspree AJAX)
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok) {
        form.reset();
        successMsg.style.display = 'block';
        btn.querySelector('span').textContent = 'Sent ✦';
      } else {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Try again →';
      }
    } catch {
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Try again →';
    }
  });

  // Number counter animation
  function animateNumber(el, target, suffix) {
    let start = 0;
    const duration = 1800;
    const step = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = ease * target;
      el.textContent = (target % 1 !== 0 ? current.toFixed(1) : Math.round(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const nums = [
          { el: e.target.querySelector('.stat-number:nth-child(1)'), val: 4.9, suf: '' },
        ];
        document.querySelectorAll('.stat-number').forEach(el => {
          const text = el.textContent.trim();
          const hasK = text.includes('K');
          const num = parseFloat(text.replace('K', ''));
          const suffix = hasK ? 'K' : (text.includes('.') ? '' : '');
          animateNumber(el, num, suffix);
        });
        statObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  const statsSection = document.querySelector('.lifestyle-stats');
  if (statsSection) statObserver.observe(statsSection);
