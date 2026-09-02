/* =========================================================
   JULIA HAMILTON KNOX — ATTORNEY PORTFOLIO
   Vanilla JavaScript: loader, navigation, reveal animations,
   scroll-to-top, and contact form validation.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. FULL-SCREEN PAGE LOADER
     Locks scrolling until the window has fully loaded, then
     fades the loader out.
  --------------------------------------------------------- */
  const loader = document.getElementById('loader');
  document.body.classList.add('is-loading');

  const hideLoader = () => {
    loader.classList.add('loader-hidden');
    document.body.classList.remove('is-loading');
  };

  if (document.readyState === 'complete') {
    // Small delay so the loader is perceivable even on fast connections
    setTimeout(hideLoader, 500);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 500));
    // Safety net in case the load event is delayed by slow third-party assets
    setTimeout(hideLoader, 3500);
  }

  /* ---------------------------------------------------------
     2. STICKY HEADER SHADOW ON SCROLL
  --------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const updateHeaderShadow = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  updateHeaderShadow();
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });

  /* ---------------------------------------------------------
     3. MOBILE NAVIGATION MENU
  --------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  const closeMenu = () => {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu whenever a nav link is chosen
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ---------------------------------------------------------
     4. SMOOTH SCROLL FOR IN-PAGE LINKS
     (CSS scroll-behavior handles most of this; this adds an
     offset for the sticky header and works in older browsers.)
  --------------------------------------------------------- */
  const headerOffset = () => header.offsetHeight + 8;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', targetId);
    });
  });

  /* ---------------------------------------------------------
     5. ACTIVE NAVIGATION LINK HIGHLIGHTING
     Uses IntersectionObserver to track which section is
     currently in view and highlights the matching nav link.
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => navObserver.observe(section));

  /* ---------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS
     Subtle fade-and-rise applied once per element as it
     enters the viewport.
  --------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------
     7. SCROLL-TO-TOP BUTTON
  --------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     8. CONTACT FORM VALIDATION
     Client-side only — no backend. Validates required fields,
     shows inline errors, and displays a success message.
  --------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  const validators = {
    fullName: (value) => value.trim().length >= 2 || 'Please enter your full name.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || 'Please enter a valid email address.',
    phone: (value) => value.trim() === '' || /^[0-9()+\-.\s]{7,}$/.test(value.trim()) || 'Please enter a valid phone number.',
    subject: (value) => value.trim().length >= 2 || 'Please enter a subject.',
    message: (value) => value.trim().length >= 10 || 'Please enter a message of at least 10 characters.'
  };

  const validateField = (field) => {
    const rule = validators[field.name];
    if (!rule) return true;

    const result = rule(field.value);
    const row = field.closest('.form-row');
    const errorEl = document.getElementById(`${field.id}Error`);

    if (result === true) {
      row.classList.remove('has-error');
      errorEl.textContent = '';
      return true;
    }

    row.classList.add('has-error');
    errorEl.textContent = result;
    return false;
  };

  // Validate a field as the user leaves it
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.form-row').classList.contains('has-error')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = Array.from(form.querySelectorAll('input, textarea'));
    const results = fields.map((field) => validateField(field));
    const isValid = results.every(Boolean);

    if (!isValid) {
      formStatus.textContent = 'Please correct the highlighted fields before submitting.';
      formStatus.className = 'form-status error';
      const firstError = form.querySelector('.form-row.has-error input, .form-row.has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // No backend is connected — this simulates a successful submission.
    formStatus.textContent = 'Thank you. Your message has been received and will be reviewed shortly. Use the whatsApp button if you dont get a reply within 5 minutes';
    formStatus.className = 'form-status success';
    form.reset();
  });

});
