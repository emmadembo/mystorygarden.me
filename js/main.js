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

// ---- Full-screen video player ----
// Clicking a system video opens it in our own player, which covers the whole screen on
// every device. Where the browser allows true full screen (computers, Android, iPad) we
// also use that, so the browser's toolbars disappear too.
(function initVideoPlayer() {
  const player = document.getElementById('video-player');
  if (!player) return;
  const inner = player.querySelector('.player-inner');
  const playerVideo = player.querySelector('.player-video');
  const title = player.querySelector('.player-title');
  const closeBtn = player.querySelector('.player-close');
  const supportsDialog = typeof player.showModal === 'function';

  let cardVideo = null;     // the looping video in the card that was clicked
  let opener = null;        // the card button, so focus can return to it
  let wasFullscreen = false;

  const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement;

  function enterFullscreen() {
    try {
      const result = inner.requestFullscreen ? inner.requestFullscreen()
        : inner.webkitRequestFullscreen ? inner.webkitRequestFullscreen()
        : null;
      if (result && result.catch) result.catch(() => {}); // not allowed here: the overlay still fills the screen
    } catch (_) { /* same as above */ }
  }

  function open(frame) {
    opener = frame;
    cardVideo = frame.querySelector('video');
    if (cardVideo) cardVideo.pause();

    title.textContent = frame.dataset.title || '';
    playerVideo.poster = cardVideo ? cardVideo.poster : '';
    playerVideo.src = cardVideo ? (cardVideo.currentSrc || cardVideo.src) : '';

    if (supportsDialog) player.showModal();
    else player.setAttribute('open', '');
    document.documentElement.classList.add('player-open');

    playerVideo.play().catch(() => {});  // starts from the beginning
    enterFullscreen();
    closeBtn.focus();
  }

  function cleanUp() {
    playerVideo.pause();
    playerVideo.removeAttribute('src');  // stop downloading
    playerVideo.load();
    document.documentElement.classList.remove('player-open');
    if (cardVideo && !reduceMotion.matches) cardVideo.play().catch(() => {});
    if (opener) opener.focus();
    cardVideo = opener = null;
  }

  function close() {
    if (!player.hasAttribute('open')) return;
    if (fullscreenElement()) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      try { const r = exit && exit.call(document); if (r && r.catch) r.catch(() => {}); } catch (_) {}
    }
    if (supportsDialog) {
      player.close();   // fires 'close', which runs cleanUp
    } else {
      player.removeAttribute('open');
      cleanUp();
    }
  }

  document.querySelectorAll('button.video-frame').forEach((frame) => {
    frame.addEventListener('click', () => open(frame));
  });

  closeBtn.addEventListener('click', close);
  player.addEventListener('close', cleanUp);
  // Esc key (dialog-supporting browsers send 'cancel'; older ones need the keydown)
  player.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !supportsDialog) close();
  });

  // Leaving true full screen (Esc or the browser's own button) closes the player in one step
  const onFullscreenChange = () => {
    if (fullscreenElement()) {
      wasFullscreen = true;
    } else if (wasFullscreen) {
      wasFullscreen = false;
      close();
    }
  };
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);
})();
