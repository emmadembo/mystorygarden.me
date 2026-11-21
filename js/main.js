// Small UI behavior for The Story Garden.
// Loaded with `defer`, so it runs after the page's HTML has been read.

// ---- Footer year ----
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Choosing "Wholesale / partnership" opens the business fields ----
const biz = document.getElementById('biz');
document.querySelectorAll('input[name="inquiry_type"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    if (biz && radio.value === 'wholesale' && radio.checked) biz.open = true;
  });
});

// ---- Respect "reduce motion": stop the looping videos (their poster image shows instead) ----
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function applyMotionPreference() {
  document.querySelectorAll('video[autoplay]').forEach((video) => {
    if (reduceMotion.matches) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  });
}
applyMotionPreference();
reduceMotion.addEventListener?.('change', applyMotionPreference);
