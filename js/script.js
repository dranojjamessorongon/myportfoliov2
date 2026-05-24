/* ============================================================
   script.js — Dranoj James A. Sorongon Portfolio
   Location: /portfolio/js/script.js

   ════════════════════════════════════════════════════════════
   FULL ISSUE AUDIT & FIX SUMMARY
   ════════════════════════════════════════════════════════════

   ISSUE 1 — EmailJS SDK never loaded (ReferenceError crash)
   ──────────────────────────────────────────────────────────
   The EmailJS CDN <script> tag was commented out in the HTML.
   Calling emailjs.send() at runtime threw:
     ReferenceError: emailjs is not defined
   This crashed the entire submit handler, so the form was
   completely non-functional regardless of placeholder IDs.
   FIX: Replaced with Formspree — zero SDK, zero accounts
        needed beyond a one-time free registration.

   ISSUE 2 — Form had no action or method attributes
   ──────────────────────────────────────────────────────────
   <form id="contactForm" class="contact-form" novalidate>
   No action="" and no method="POST". If JS somehow succeeded,
   the form had no endpoint to send data to.
   FIX: action="https://formspree.io/f/YOUR_FORM_ID" + method="POST"

   ISSUE 3 — Invalid HTML: <a> wrapping block-level elements
   ──────────────────────────────────────────────────────────
   The entire .contact-items div was wrapped in <a href="mailto:">
   making all 4 contact items (email/phone/location/timezone) one
   giant link — invalid HTML, broke keyboard navigation, WCAG fail.
   FIX: <a> moved to wrap only the email .contact-item specifically.

   ISSUE 4 — Google GSI script loaded for no reason
   ──────────────────────────────────────────────────────────
   <script src="https://accounts.google.com/gsi/client"> was in
   <head> but never used anywhere. Wasted a network request,
   triggered unneeded CSP warnings.
   FIX: Removed entirely.

   ISSUE 5 — Honeypot only checked client-side
   ──────────────────────────────────────────────────────────
   Original honeypot: name="website" — not a name Formspree or
   any email service recognises server-side. Bots bypassing JS
   still got through to the server.
   FIX: Renamed to "_gotcha" — Formspree's official honeypot
        field name. Server silently drops submissions where
        _gotcha has a value. Our JS still also checks it (Layer 2).

   ISSUE 6 — Single status div for all feedback (UX + a11y)
   ──────────────────────────────────────────────────────────
   One <div id="formStatus"> handled validation errors, network
   errors, and success — they competed and overwrote each other.
   Screen readers couldn't announce which field was wrong.
   FIX: Per-field <span class="field-error" aria-live="polite">
        for validation. #formStatus now only shows server errors.
        Success uses a full animated card (not a status message).

   ISSUE 7 — Button was never actually disabled during submit
   ──────────────────────────────────────────────────────────
   submitBtn.textContent = 'Sending…' changed the label but
   disabled=true was never set, allowing double-submission.
   FIX: setLoading() disables the button + applies .loading CSS
        class which shows a CSS spinner. Always restored in finally{}.

   ISSUE 8 — No post-submission success state
   ──────────────────────────────────────────────────────────
   After a successful send, only a 5-second status text appeared.
   No visual weight, no personalisation, no staying power.
   FIX: Animated success card with SVG checkmark animation,
        personalised name/email, "Send Another" reset flow.

   ISSUE 9 — Validation only triggered on submit
   ──────────────────────────────────────────────────────────
   No live feedback until the user hit "Send Message". Jarring UX.
   FIX: blur listeners on each field + input listeners clear errors
        while the user corrects them.

   ISSUE 10 — Missing ARIA attributes on form inputs
   ──────────────────────────────────────────────────────────
   No aria-required, aria-invalid, or aria-describedby on inputs.
   Screen readers had no context for required fields or errors.
   FIX: All three attributes added, pointing to field-error spans.

   ════════════════════════════════════════════════════════════
   FORMSPREE SETUP (one-time)
   ════════════════════════════════════════════════════════════
   1. Sign up free: https://formspree.io
   2. Create a new form → target email: dramessorongon@gmail.com
   3. Copy your Form ID (8-character string, e.g. "xpwzgkqr")
   4. Replace 'YOUR_FORM_ID' in the constant below
   5. Deploy your site (or use Live Server locally)
   6. Submit once → confirm the activation email in Gmail
   ════════════════════════════════════════════════════════════
*/

/* ──────────────────────────────────────────────────────────
   FORMSPREE CONFIG — Replace with your actual Form ID
   ────────────────────────────────────────────────────────── */
const FORMSPREE_ID = 'mredlrdg';  // ← Paste your 8-char ID here

/* ============================================================
   1. NAVBAR — Scroll effect + active link highlight
============================================================ */
(function initNavbar() {  
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const links   = document.querySelectorAll('.nav-links a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ============================================================
   2. MOBILE MENU — Hamburger toggle
============================================================ */
(function initMobileMenu() {
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ============================================================
   3. SCROLL ANIMATIONS — Fade up on scroll
============================================================ */
(function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-up');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // one-shot
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(el => observer.observe(el));
})();

/* ============================================================
   4. ANIMATED COUNTERS — For hero stats
============================================================ */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target, parseInt(entry.target.getAttribute('data-count'), 10));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. CONTACT FORM — Formspree AJAX Integration
   ────────────────────────────────────────────────────────────

   WHY FORMSPREE:
   ┌──────────────────┬──────────────────────────────────────┐
   │ FormSubmit AJAX  │ Uses /ajax/ endpoint — has CORS      │
   │ (previous)       │ preflight issues with FormData from  │
   │                  │ file:// and some server origins →    │
   │                  │ fetch() throws network error         │
   ├──────────────────┼──────────────────────────────────────┤
   │ Formspree ✅     │ Endpoint built for CORS with         │
   │                  │ FormData. Works from localhost,       │
   │                  │ file://, and any deployed host.      │
   │                  │ Official docs use this exact pattern.│
   └──────────────────┴──────────────────────────────────────┘

   HOW IT WORKS:
   1. User fills form → JS validates each field on blur + submit
   2. Honeypot check (_gotcha) — bot trap, two layers
   3. fetch() POSTs FormData to https://formspree.io/f/{ID}
      with Accept: application/json header
   4. Formspree emails dramessorongon@gmail.com, returns JSON
   5. response.ok → form fades out, success card animates in
   6. Formspree also returns errors[] array for server-side
      validation failures (e.g. invalid email format)
   7. "Send Another Message" resets and restores the form

============================================================ */
(function initContactForm() {
  const form        = document.getElementById('contactForm');
  if (!form) return;

  const statusEl    = document.getElementById('formStatus');
  const successCard = document.getElementById('successCard');
  const submitBtn   = form.querySelector('.submit-btn');
  const sendAgain   = document.getElementById('sendAnotherBtn');

  /* ── Helpers ─────────────────────────────────────────────── */

  /**
   * Sanitize: strip HTML to prevent XSS when echoing user values
   * into the DOM (success card name/email fields).
   */
  function sanitize(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /** RFC 5322-lite email regex — sufficient for client-side UX */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Mark a field invalid with an accessible per-field error.
   * Sets aria-invalid="true" so screen readers announce the error.
   */
  function setFieldError(fieldId, errorId, msg) {
    const field = document.getElementById(fieldId);
    const err   = document.getElementById(errorId);
    if (!field || !err) return;
    field.classList.add('invalid');
    field.classList.remove('valid');
    field.setAttribute('aria-invalid', 'true');
    err.textContent = msg;
  }

  /** Clear a field's error state and mark it valid. */
  function clearFieldError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const err   = document.getElementById(errorId);
    if (!field || !err) return;
    field.classList.remove('invalid');
    field.classList.add('valid');
    field.setAttribute('aria-invalid', 'false');
    err.textContent = '';
  }

  /** Reset all field valid/invalid visual states (used on form reset). */
  function clearAllFieldStates() {
    ['name', 'email', 'message'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('invalid', 'valid');
      el.removeAttribute('aria-invalid');
    });
    ['name-error', 'email-error', 'message-error'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }

  /**
   * Show the general status bar for server/network errors.
   * Auto-clears after 8 seconds.
   */
  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className   = `form-status ${type}`;
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className   = 'form-status';
    }, 8000);
  }

  function clearStatus() {
    statusEl.textContent = '';
    statusEl.className   = 'form-status';
  }

  /**
   * Toggle the submit button's loading state.
   * disabled + .loading class → shows CSS spinner, dims label.
   * Always call setLoading(false) in finally{} to restore it.
   */
  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle('loading', isLoading);
  }

  /* ── Success card ─────────────────────────────────────────── */

  /** Fade form out, animate success card in with personalised text. */
  function showSuccessCard(name, email) {
    document.getElementById('successName').textContent  = name;
    document.getElementById('successEmail').textContent = email;
    form.classList.add('hidden');
    successCard.removeAttribute('aria-hidden');
    successCard.classList.add('visible');
    // Scroll card into view — important on mobile where it may be off-screen
    successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /** Restore the form, hide the success card. */
  function hideSuccessCard() {
    successCard.classList.remove('visible');
    successCard.setAttribute('aria-hidden', 'true');
    form.classList.remove('hidden');
  }

  /* "Send Another Message" button resets everything */
  if (sendAgain) {
    sendAgain.addEventListener('click', () => {
      form.reset();
      clearAllFieldStates();
      clearStatus();
      hideSuccessCard();
    });
  }

  /* ── Live blur validation ─────────────────────────────────── */
  /*
    Validates each field as soon as it loses focus — far better
    UX than waiting for the submit button. Errors clear as the
    user types (input event listener below).
  */

  document.getElementById('name').addEventListener('blur', function () {
    const val = this.value.trim();
    if (!val || val.length < 2) {
      setFieldError('name', 'name-error', 'Please enter your full name (at least 2 characters).');
    } else {
      clearFieldError('name', 'name-error');
    }
  });

  document.getElementById('email').addEventListener('blur', function () {
    const val = this.value.trim();
    if (!val || !isValidEmail(val)) {
      setFieldError('email', 'email-error', 'Please enter a valid email address.');
    } else {
      clearFieldError('email', 'email-error');
    }
  });

  document.getElementById('message').addEventListener('blur', function () {
    const val = this.value.trim();
    if (!val || val.length < 10) {
      setFieldError('message', 'message-error', 'Message must be at least 10 characters.');
    } else {
      clearFieldError('message', 'message-error');
    }
  });

  /* Clear per-field error as the user corrects the input */
  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () {
      if (this.classList.contains('invalid')) {
        this.classList.remove('invalid');
        const errEl = document.getElementById(`${id}-error`);
        if (errEl) errEl.textContent = '';
      }
    });
  });

  /* ── Main submit handler ──────────────────────────────────── */

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearStatus();

    /* ── Step 1: Read + sanitize values ─────────────────── */
    const name    = sanitize(document.getElementById('name').value.trim());
    const email   = sanitize(document.getElementById('email').value.trim());
    const message = sanitize(document.getElementById('message').value.trim());

    /* ── Step 2: Client-side validation ──────────────────── */
    let hasError = false;

    if (!name || name.length < 2) {
      setFieldError('name', 'name-error', 'Please enter your full name (at least 2 characters).');
      hasError = true;
    } else {
      clearFieldError('name', 'name-error');
    }

    if (!isValidEmail(email)) {
      setFieldError('email', 'email-error', 'Please enter a valid email address.');
      hasError = true;
    } else {
      clearFieldError('email', 'email-error');
    }

    if (!message || message.length < 10) {
      setFieldError('message', 'message-error', 'Message must be at least 10 characters.');
      hasError = true;
    } else {
      clearFieldError('message', 'message-error');
    }

    if (hasError) {
      // Focus the first invalid field for keyboard/screen reader users
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return; // abort — don't touch the network
    }

    /* ── Step 3: Honeypot check (JS layer = Layer 2) ─────────
      _gotcha is Formspree's official honeypot field name.
      If it has any value, a bot filled it.

      Layer 1: Formspree server silently drops the submission
      Layer 2: We fake success client-side so the bot gets no
               signal that it was caught. No real email is sent.
    ─────────────────────────────────────────────────────────── */
    const gotcha = document.getElementById('_gotcha');
    if (gotcha && gotcha.value.trim() !== '') {
      // Silently fake success — don't reveal detection to the bot
      form.reset();
      showSuccessCard(name, email);
      return;
    }

    /* ── Step 4: Guard — check Form ID is configured ─────────
      Prevents confusing network errors during development when
      the placeholder ID hasn't been replaced yet.
    ─────────────────────────────────────────────────────────── */
    if (FORMSPREE_ID === 'YOUR_FORM_ID') {
      showStatus(
        '⚙️ Demo mode: Replace YOUR_FORM_ID in script.js with your Formspree form ID to enable sending.',
        'error'
      );
      return;
    }

    /* ── Step 5: Submit via Formspree AJAX ───────────────────
      Formspree accepts FormData with Accept: application/json.
      This is the pattern from Formspree's own official docs:
      https://help.formspree.io/hc/en-us/articles/360013470814

      WHY FormData here (not JSON.stringify):
      Formspree's endpoint is built for multipart/form-data —
      it reads the _gotcha honeypot from the form fields.
      Formspree explicitly supports this pattern and handles
      CORS correctly, unlike FormSubmit which had preflight issues.
    ─────────────────────────────────────────────────────────── */
    setLoading(true);

    try {
      const formData = new FormData(form);

      const response = await fetch(
        `https://formspree.io/f/${FORMSPREE_ID}`,
        {
          method:  'POST',
          body:    formData,
          headers: {
            /*
              Accept: application/json tells Formspree to return
              a JSON response instead of an HTML redirect page.
              Do NOT set Content-Type manually with FormData —
              the browser sets it automatically with the correct
              multipart boundary. Setting it manually breaks parsing.
            */
            'Accept': 'application/json',
          },
        }
      );

      /* ── Step 6: Handle response ──────────────────────────── */

      let result;
      try {
        result = await response.json();
      } catch (_) {
        // Formspree returned non-JSON (shouldn't happen, but be safe)
        throw new Error(`Unexpected server response (HTTP ${response.status})`);
      }

      if (response.ok) {
        /* ✅ Success — email is on its way to Gmail */
        form.reset();
        clearAllFieldStates();
        showSuccessCard(name, email);

      } else {
        /*
          Formspree returns an errors[] array with specific messages.
          Common causes:
          - Form ID not activated (check Gmail for confirmation email)
          - Rate limited (too many submissions)
          - Server-side validation failure

          We surface Formspree's error messages directly for accuracy.
        */
        if (result && Array.isArray(result.errors) && result.errors.length > 0) {
          const msg = result.errors.map(err => err.message).join(' · ');
          showStatus(`Submission error: ${msg}`, 'error');
        } else {
          showStatus(
            '⚠️ Submission failed. If this is your first time, check Gmail for a Formspree confirmation email and click the activation link.',
            'error'
          );
        }
      }

    } catch (err) {
      /*
        Network error (no internet, DNS failure, etc.).
        Provide a direct contact fallback so the user isn't stuck.
      */
      console.error('Formspree fetch error:', err);
      showStatus(
        '⚠️ Could not send your message. Please check your connection or email me directly: dramessorongon@gmail.com',
        'error'
      );
    } finally {
      /* Always restore the button — even if an error occurred */
      setLoading(false);
    }
  });

})();

/* ============================================================
   6. SMOOTH SCROLL — For anchor links on same page
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});