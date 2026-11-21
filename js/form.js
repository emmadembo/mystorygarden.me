// Contact form: sends the inquiry to Formspree as JSON, then shows an inline thank-you.
// If sending fails, it opens the visitor's email app with the message pre-filled.
const SEND_ENDPOINT = 'https://formspree.io/f/mqagvyaq';

function feedbackMessage(text, color = '') {
  const el = document.getElementById('inquiry-feedback');
  if (!el) return;
  el.style.color = color;
  el.textContent = text;
}

document.getElementById('inquiry-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const btn = form.querySelector('button[type="submit"]');

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sending…';
  }
  feedbackMessage('', '');

  try {
    // Use AbortController for a simple timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    // Ask for JSON response and use CORS mode
    const res = await fetch(SEND_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
      signal: controller.signal,
      mode: 'cors'
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let details = '';
      try { details = await res.text(); } catch (_) {}
      throw new Error('Server responded with ' + res.status + (details ? ': ' + details : ''));
    }

    // show inline thank-you message replacing the form
    const formEl = document.getElementById('inquiry-form');
    const container = formEl.parentNode;
    const section = document.getElementById('Contact') || formEl.closest('.booking') || formEl.closest('section');
    const refText = section ? section.querySelector('p') : document.querySelector('p') || document.querySelector('h2');
    const refStyle = refText ? window.getComputedStyle(refText) : null;

    const rect = formEl.getBoundingClientRect();
    const thank = document.createElement('div');
    thank.setAttribute('role', 'status');
    thank.setAttribute('aria-live', 'polite');

    // preserve frame shape/size
    thank.style.minWidth = '100%';
    thank.style.width = '100%';
    thank.style.maxWidth = '100%';
    thank.style.boxSizing = 'border-box';
    thank.style.whiteSpace = 'normal';
    thank.style.wordBreak = 'break-word';
    thank.style.wordWrap = 'break-word';
    thank.style.minHeight = rect.height + 'px';

    // center message
    thank.style.display = 'flex';
    thank.style.alignItems = 'center';
    thank.style.justifyContent = 'center';
    thank.style.textAlign = 'center';

    const msg = document.createElement('h2');
    msg.textContent = "Thanks — we'll be in touch soon!";
    msg.style.margin = '0';
    thank.appendChild(msg);

    // copy visual styles from form
    const formStyle = window.getComputedStyle(formEl);
    if (formStyle.backgroundColor) thank.style.background = formStyle.backgroundColor;
    if (formStyle.border) thank.style.border = formStyle.border;
    if (formStyle.borderRadius) thank.style.borderRadius = formStyle.borderRadius;
    if (formStyle.boxShadow) thank.style.boxShadow = formStyle.boxShadow;
    thank.style.paddingTop = formStyle.paddingTop;
    thank.style.paddingRight = formStyle.paddingRight;
    thank.style.paddingBottom = formStyle.paddingBottom;
    thank.style.paddingLeft = formStyle.paddingLeft;
    thank.style.boxSizing = 'border-box';
    thank.style.display = formStyle.display || 'block';
    thank.style.width = formStyle.width && formStyle.width !== 'auto' ? formStyle.width : '100%';

    if (refStyle) {
      thank.style.fontFamily = refStyle.fontFamily;
      thank.style.fontSize = refStyle.fontSize;
      thank.style.lineHeight = refStyle.lineHeight;
      thank.style.fontWeight = refStyle.fontWeight;
      thank.style.margin = refStyle.margin;
      thank.style.textAlign = refStyle.textAlign;
    }

    container.replaceChild(thank, formEl);
    formEl.reset();

  } catch (err) {
    console.error('Send error:', err);

    // Mailto fallback: open user's email client with a prefilled message
    try {
      const subject = `Inquiry from ${data.name || 'website'}`;
      const bodyLines = [
        `Name: ${data.name || ''}`,
        `Email: ${data.email || ''}`,
        `Company: ${data.company || ''}`,
        `Inquiry type: ${data.inquiry_type || ''}`,
        `Product: ${data.product || ''}`,
        `Preferred date: ${data.date || ''}`,
        `Quantity: ${data.quantity || ''}`,
        '',
        data.message || ''
      ];

      feedbackMessage('Could not send via server — opening your email client as a fallback.', 'crimson');

      const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
      window.location.href = mailto;
    } catch (mailtoErr) {
      console.error('Fallback mailto error:', mailtoErr);
      feedbackMessage('There was an error sending your message. Please try again later.', 'crimson');
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Send inquiry';
    }
  }
});
