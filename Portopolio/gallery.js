/* ============================================
   GALLERY PAGE – gallery.js
   Lightbox with keyboard & swipe navigation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Collect all photo items
  const photoItems = Array.from(document.querySelectorAll('.photo-item'));
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightbox-img');
  const lbCaption  = document.getElementById('lightbox-caption');
  const lbCounter  = document.getElementById('lightbox-counter');
  const closeBtn   = document.getElementById('lightbox-close');
  const prevBtn    = document.getElementById('lightbox-prev');
  const nextBtn    = document.getElementById('lightbox-next');

  let currentIdx = 0;

  // Build photo list from DOM
  const photos = photoItems.map(item => ({
    src: item.querySelector('img')?.src || '',
    alt: item.querySelector('img')?.alt || '',
    caption: item.querySelector('.photo-caption')?.textContent?.trim() || ''
  }));

  function openLightbox(idx) {
    currentIdx = idx;
    showPhoto(idx);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showPhoto(idx) {
    if (idx < 0) idx = photos.length - 1;
    if (idx >= photos.length) idx = 0;
    currentIdx = idx;

    // Animate swap
    lbImg.style.opacity = '0';
    lbImg.style.transform = 'scale(0.97)';

    setTimeout(() => {
      lbImg.src = photos[idx].src;
      lbImg.alt = photos[idx].alt;
      lbCaption.textContent = photos[idx].caption;
      lbCounter.textContent = `${idx + 1} / ${photos.length}`;

      lbImg.style.transition = 'opacity 0.2s ease, transform 0.25s ease';
      lbImg.style.opacity = '1';
      lbImg.style.transform = 'scale(1)';
    }, 120);
  }

  // Attach click to each photo item
  photoItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  // Controls
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => showPhoto(currentIdx - 1));
  nextBtn.addEventListener('click', () => showPhoto(currentIdx + 1));

  // Click backdrop to close
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPhoto(currentIdx - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIdx + 1);
  });

  // Touch/swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) showPhoto(dx < 0 ? currentIdx + 1 : currentIdx - 1);
  });

  // ── Scroll reveal for photo items
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  photoItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(16px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(item);
  });

  // ── Section reveal
  document.querySelectorAll('.gallery-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    obs.observe(section);
  });

});
