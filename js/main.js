// Small UI behavior for The Story Garden.
// Loaded with `defer`, so it runs after the page's HTML has been read.

// ---- Mobile navigation menu ----
function closeNav() {
  document.querySelector('.nav')?.classList.remove('nav-open');
  document.querySelector('.nav-toggle')?.setAttribute('aria-expanded', 'false');
}

(function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) closeNav();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });

  // Menu links scroll smoothly to their section and close the menu
  nav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      closeNav();
    });
  });
})();

// ---- Footer year ----
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Video carousel (Eden / Arjuna) ----
(function initEdenCarousel() {
  const carousel = document.getElementById('eden-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.eden-carousel-track');
  const slides = carousel.querySelectorAll('.eden-carousel-slide');
  const dots = carousel.querySelectorAll('.eden-dot');
  const prevBtn = carousel.querySelector('.eden-carousel-prev');
  const nextBtn = carousel.querySelector('.eden-carousel-next');

  let index = 0;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));

    carousel.querySelectorAll('video').forEach((v, vi) => {
      if (vi === index) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  goTo(0);
})();
