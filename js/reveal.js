// Scroll animations: sections fade up as they come into view.
// Loaded in <head> without `defer`, so the "js" class is set before anything is drawn.
// (Without JavaScript the class is never added and everything simply shows.)

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el) => io.observe(el));
});
