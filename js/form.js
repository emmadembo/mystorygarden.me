// Contact form: sends the inquiry to Formspree without leaving the page,
// then shows a thank-you message under the button.
// The Formspree address comes from the form's `action` in index.html (form ID mqagvyaq).

const form = document.getElementById('inquiry-form');

if (form) {
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const biz = document.getElementById('biz');

  function showStatus(text, isError = false) {
    status.textContent = text;
    status.classList.toggle('is-error', isError);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Let the browser point out missing name/email before sending
    if (!form.reportValidity()) return;

    button.disabled = true;
    showStatus('Sending…');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.reset();
        if (biz) biz.open = false;
        showStatus("Thank you — we'll be in touch soon.");
      } else {
        showStatus('Something went wrong. Please try again in a moment.', true);
      }
    } catch (err) {
      showStatus('Something went wrong. Please check your connection and try again.', true);
    } finally {
      button.disabled = false;
    }
  });
}
