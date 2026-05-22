/* ============================================================
   script.js — Dranoj James A. Sorongon Portfolio
   Location: /portfolio/js/script.js
   ============================================================ */

/* ============================================================
   1. NAVBAR — Scroll effect + active link
   ============================================================ */
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Add 'scrolled' class once user scrolls past 40px
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Highlight the active nav link based on current page filename
  const links = document.querySelectorAll('.nav-links a');
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
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
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
          // Stop observing once visible (one-shot animation)
          observer.unobserve(entry.target);
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
    // Ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target; // Ensure exact final value
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
          const target = parseInt(entry.target.getAttribute('data-count'), 10);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. CONTACT FORM — Validation + EmailJS integration
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');

  // Simple input sanitizer to prevent XSS
  function sanitize(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // Show status message
  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `form-status ${type}`;
    setTimeout(() => { statusEl.className = 'form-status'; }, 5000);
  }

  // Validate email format
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = sanitize(form.querySelector('#name').value.trim());
    const email   = sanitize(form.querySelector('#email').value.trim());
    const message = sanitize(form.querySelector('#message').value.trim());

    // --- Client-side validation ---
    if (!name || name.length < 2) {
      return showStatus('Please enter your full name (at least 2 characters).', 'error');
    }
    if (!isValidEmail(email)) {
      return showStatus('Please enter a valid email address.', 'error');
    }
    if (!message || message.length < 10) {
      return showStatus('Message is too short. Please write at least 10 characters.', 'error');
    }

    // --- Spam honeypot check ---
    const honeypot = form.querySelector('#website');
    if (honeypot && honeypot.value) {
      // Bot filled the hidden field — silently ignore
      showStatus("Thank you! Your message has been sent.", 'success');
      form.reset();
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      /* -------------------------------------------------------
         EMAILJS INTEGRATION
         -------------------------------------------------------
         Replace the three placeholder values below:
         - YOUR_SERVICE_ID   → from EmailJS dashboard → Email Services
         - YOUR_TEMPLATE_ID  → from EmailJS dashboard → Email Templates
         - YOUR_PUBLIC_KEY   → from EmailJS dashboard → Account → General
         
         Step-by-step setup: see README.txt
         ------------------------------------------------------- */
      const serviceID  = 'YOUR_SERVICE_ID';   // ← Replace this
      const templateID = 'YOUR_TEMPLATE_ID';  // ← Replace this
      const publicKey  = 'YOUR_PUBLIC_KEY';   // ← Replace this

      if (serviceID === 'YOUR_SERVICE_ID') {
        // Demo mode: EmailJS not yet configured
        await new Promise(r => setTimeout(r, 1200)); // Simulate delay
        showStatus('Demo mode: Configure EmailJS in script.js to enable sending.', 'success');
      } else {
        // Real EmailJS send
        await emailjs.send(
          serviceID,
          templateID,
          { from_name: name, reply_to: email, message: message },
          publicKey
        );
        showStatus('Message sent! I will get back to you soon.', 'success');
      }

      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      showStatus('Something went wrong. Please email me directly at dramessorongon@gmail.com', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
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
