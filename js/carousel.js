// Product page carousel: swipe on phones, arrows and thumbnails on computers,
// left/right arrow keys when focused. The video plays only while it is the visible
// slide (and never automatically for visitors who prefer reduced motion).

document.querySelectorAll('[data-carousel]').forEach((root) => {
  const carousel = root.querySelector('.carousel');
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(track.querySelectorAll('.slide'));
  const thumbs = Array.from(root.querySelectorAll('.thumb'));
  const prev = root.querySelector('.carousel-btn.prev');
  const next = root.querySelector('.carousel-btn.next');
  const count = root.querySelector('.carousel-count');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;

  function goTo(i, instant) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: index * track.clientWidth, behavior: instant || reduceMotion.matches ? 'auto' : 'smooth' });
    update();
  }

  function update() {
    thumbs.forEach((t, ti) => {
      t.classList.toggle('is-active', ti === index);
      if (ti === index) t.setAttribute('aria-current', 'true');
      else t.removeAttribute('aria-current');
    });
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === slides.length - 1;
    if (count) count.textContent = `${index + 1} / ${slides.length}`;

    const activeIsVideo = slides[index].classList.contains('slide-video');
    carousel.classList.toggle('on-video', activeIsVideo);
    slides.forEach((s, si) => {
      const v = s.querySelector('video');
      if (!v) return;
      if (si === index && !reduceMotion.matches) v.play().catch(() => {});
      else if (si !== index) v.pause();
    });
  }

  // Follow swipes / trackpad scrolling
  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== index) { index = i; update(); }
    });
  });

  prev?.addEventListener('click', () => goTo(index - 1));
  next?.addEventListener('click', () => goTo(index + 1));
  thumbs.forEach((t, ti) => t.addEventListener('click', () => goTo(ti)));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
  });
  // Stay on the same slide when the window is resized or a phone is rotated
  window.addEventListener('resize', () => goTo(index, true));

  update();
});
