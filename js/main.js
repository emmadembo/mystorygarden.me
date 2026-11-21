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

// ---- Click a system video to watch it full screen ----
function isFullscreen() {
  return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
}

document.querySelectorAll('button.video-frame').forEach((frame) => {
  const video = frame.querySelector('video');
  if (!video) return;

  frame.addEventListener('click', () => {
    if (isFullscreen()) return; // clicks on the player's own controls

    video.currentTime = 0;      // start from the beginning
    video.controls = true;      // show play/pause and the timeline
    video.play().catch(() => {});

    if (video.requestFullscreen) {
      video.requestFullscreen().catch(() => { video.controls = false; });
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();          // older Safari on Mac
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();            // iPhone
    }
  });

  // Back in the card: hide the controls and return to the quiet loop
  const onExit = () => {
    if (isFullscreen()) return;
    video.controls = false;
    if (reduceMotion.matches) video.pause();
    else video.play().catch(() => {});
  };
  video.addEventListener('fullscreenchange', onExit);
  video.addEventListener('webkitfullscreenchange', onExit);
  video.addEventListener('webkitendfullscreen', onExit); // iPhone
});
