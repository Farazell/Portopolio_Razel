/* ============================================
   RAZEL PORTFOLIO – script.js
   Minimalist edition – no modal, no particles
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ====== NAVBAR ======
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    const btt = document.getElementById('back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active nav link on scroll
  const sections  = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinkEls.forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === '#' + e.target.id) l.classList.add('active');
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe === undefined
    ? null
    : sections.forEach(s => {
        new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting)
              navLinkEls.forEach(l => {
                l.classList.remove('active');
                if (l.getAttribute('href') === '#' + e.target.id) l.classList.add('active');
              });
          });
        }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
      });

  // Simpler active section tracker
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinkEls.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => sectionObs.observe(s));


  // ====== SCROLL REVEAL ======
  const revealEls = document.querySelectorAll(
    '.section-header, .about-text, .timeline, .skill-card, .project-card, .creative-card, .graphic-card, .leader-card, .contact-link-card, .contact-form'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
      }
    });
  }, { threshold: 0.1 }).observe === undefined
    ? null
    : (() => {
        const ro = new IntersectionObserver((entries) => {
          entries.forEach((e, i) => {
            if (e.isIntersecting) {
              setTimeout(() => e.target.classList.add('visible'), i * 50);
            }
          });
        }, { threshold: 0.1 });
        revealEls.forEach(el => ro.observe(el));
      })();

  // Cleaner reveal
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 55);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObs.observe(el));


  // ====== SKILL BAR ANIMATION ======
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('animated'), 200);
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  skillFills.forEach(f => skillObs.observe(f));


  // ====== PROJECT FILTERS ======
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach((card, i) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
        if (show) card.style.animationDelay = `${i * 0.07}s`;
      });
    });
  });


  // ====== CREATIVE TABS ======
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetId = 'tab-' + btn.dataset.tab;
      tabContents.forEach(tc => tc.classList.toggle('active', tc.id === targetId));
    });
  });


  // ====== LEADERSHIP SLIDER ======
  const track = document.getElementById('slider-track');
  const dotsContainer = document.getElementById('slider-dots');
  const leaderCards = document.querySelectorAll('.leader-card');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  let current = 0;

  function getSliderConfig() {
    const len = leaderCards.length;
    if (len === 0) return { len: 0, visibleCards: 1, maxIdx: 0, cardW: 0 };
    
    const firstCard = leaderCards[0];
    const cardWidth = firstCard.getBoundingClientRect().width;
    
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap) || 0;
    const cardW = cardWidth + gap;
    
    const parentWidth = track.parentElement.offsetWidth;
    const visibleCards = Math.max(1, Math.round(parentWidth / cardWidth));
    const maxIdx = Math.max(0, len - visibleCards);
    
    return { len, visibleCards, maxIdx, cardW };
  }

  function initDots() {
    const { maxIdx } = getSliderConfig();
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.dataset.idx = i;
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(idx) {
    const { len, maxIdx, cardW } = getSliderConfig();
    if (len === 0) return;
    
    if (idx < 0) idx = maxIdx;
    if (idx > maxIdx) idx = 0;
    
    current = idx;
    
    let offset = current * cardW;
    const maxOffset = track.scrollWidth - track.parentElement.offsetWidth;
    offset = Math.min(offset, Math.max(0, maxOffset));
    
    track.style.transform = `translateX(-${offset}px)`;
    
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => goToSlide(current - 1));
    nextBtn.addEventListener('click', () => goToSlide(current + 1));
  }

  dotsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dot')) {
      goToSlide(+e.target.dataset.idx);
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initDots();
      goToSlide(current);
    }, 100);
  });

  initDots();
  goToSlide(0);

  let autoSlide = setInterval(() => {
    const { maxIdx } = getSliderConfig();
    goToSlide(current >= maxIdx ? 0 : current + 1);
  }, 4000);

  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.parentElement.addEventListener('mouseleave', () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => {
      const { maxIdx } = getSliderConfig();
      goToSlide(current >= maxIdx ? 0 : current + 1);
    }, 4000);
  });

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      goToSlide(dx < 0 ? current + 1 : current - 1);
    }
  });


  // ====== CONTACT FORM ======
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn  = document.getElementById('contact-submit');
    const submitText = document.getElementById('submit-text');
    const successMsg = document.getElementById('form-success');

    submitBtn.disabled = true;
    submitText.textContent = 'Mengirim...';
    setTimeout(() => {
      successMsg.style.display = 'block';
      submitText.textContent = 'Terkirim! ✓';
      form.reset();
      setTimeout(() => {
        submitBtn.disabled = false;
        submitText.textContent = 'Kirim Pesan';
        successMsg.style.display = 'none';
      }, 4000);
    }, 1200);
  });


  // ====== BACK TO TOP ======
  const bttBtn = document.getElementById('back-to-top');
  if (bttBtn) bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  // ====== TYPING EFFECT ======
  const roles = [
    'UI/UX Designer · Front-End Developer · Sinematografer',
    'Kreator Visual · Pemimpin Kreatif · Mahasiswa IT',
    'Menyatukan Estetika & Fungsi Bermakna'
  ];
  const descEl = document.getElementById('hero-desc');
  let rIdx = 0, charIdx = 0, typing = true;

  function typeLoop() {
    if (typing) {
      if (charIdx <= roles[rIdx].length) {
        descEl.innerHTML = `Menyatukan <span class="neon-text">estetika visual</span> dan <span class="neon-text">fungsi bermakna</span> —<br />${roles[rIdx].slice(0, charIdx)}<span class="cursor-blink">|</span>`;
        charIdx++;
        setTimeout(typeLoop, 45);
      } else {
        typing = false;
        setTimeout(typeLoop, 2800);
      }
    } else {
      if (charIdx > 0) {
        descEl.innerHTML = `Menyatukan <span class="neon-text">estetika visual</span> dan <span class="neon-text">fungsi bermakna</span> —<br />${roles[rIdx].slice(0, charIdx - 1)}<span class="cursor-blink">|</span>`;
        charIdx--;
        setTimeout(typeLoop, 20);
      } else {
        rIdx = (rIdx + 1) % roles.length;
        typing = true;
        setTimeout(typeLoop, 400);
      }
    }
  }
  setTimeout(typeLoop, 1500);

  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `.cursor-blink { color: var(--accent); animation: blink 1s step-end infinite; } @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`;
  document.head.appendChild(cursorStyle);

  // ====== TIMELINE → navigation to gallery pages handled via <a> href ======
  // No JS needed — links navigate naturally to gallery-sman.html / gallery-telkom.html

  // ====== PROJECT LIGHTBOX ======
  const projVisuals    = document.querySelectorAll('.project-visual');
  const projLightbox   = document.getElementById('project-lightbox');
  const projLbImg      = document.getElementById('project-lightbox-img');
  const projLbCaption  = document.getElementById('project-lightbox-caption');
  const projLbClose    = document.getElementById('project-lightbox-close');

  projVisuals.forEach(visual => {
    visual.addEventListener('click', () => {
      const img = visual.querySelector('.project-showcase-img');
      const card = visual.closest('.project-card');
      const title = card ? card.querySelector('.project-title')?.textContent : '';

      if (img && projLightbox && projLbImg) {
        projLbImg.src = img.src;
        projLbImg.alt = img.alt || title;
        if (projLbCaption) projLbCaption.textContent = title;
        
        projLightbox.classList.add('open');
        projLightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (projLbClose) {
    projLbClose.addEventListener('click', closeProjLightbox);
  }

  if (projLightbox) {
    projLightbox.addEventListener('click', e => {
      if (e.target === projLightbox) closeProjLightbox();
    });
  }

  function closeProjLightbox() {
    if (projLightbox) {
      projLightbox.classList.remove('open');
      projLightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  document.addEventListener('keydown', e => {
    if (projLightbox && projLightbox.classList.contains('open') && e.key === 'Escape') {
      closeProjLightbox();
    }
  });

});
