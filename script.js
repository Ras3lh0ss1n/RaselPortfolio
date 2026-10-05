document.documentElement.classList.add('js');

try {
  if (localStorage.getItem('rasel-portfolio-theme') === 'dark') {
    document.documentElement.classList.add('dark-theme');
  }
} catch {}

console.log('SCM Portfolio site loaded!');

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');
  const scrollTopButton = document.querySelector('.scroll-top');
  const contactForm = document.querySelector('#contact-form');
  const formStatus = document.querySelector('#form-status');
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const themeLabel = themeToggle.querySelector('.theme-label');

  function updateThemeToggle() {
    const isDark = document.documentElement.classList.contains('dark-theme');
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeIcon.textContent = isDark ? '\u2600' : '\u263e';
    themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
  }

  updateThemeToggle();
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark-theme');
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeIcon.textContent = isDark ? '\u2600' : '\u263e';
    themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
    try {
      localStorage.setItem('rasel-portfolio-theme', isDark ? 'dark' : 'light');
    } catch {}
  });

  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    menu.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });

  const branchSections = document.querySelectorAll('.hero, .about, .concepts, .projects, .contact');
  const reducedMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let branchUpdatePending = false;

  function updateBranchBackgrounds() {
    branchUpdatePending = false;
    if (reducedMotionPreference.matches) {
      branchSections.forEach((section) => section.style.removeProperty('--branch-scroll-offset'));
      return;
    }

    const viewportCenter = window.innerHeight / 2;
    branchSections.forEach((section) => {
      const bounds = section.getBoundingClientRect();
      const travelRange = Math.max(window.innerHeight + bounds.height, 1);
      const progress = (viewportCenter - (bounds.top + bounds.height / 2)) / travelRange;
      const offset = Math.max(-36, Math.min(36, progress * 96));
      section.style.setProperty('--branch-scroll-offset', `${offset.toFixed(1)}px`);
    });
  }

  function scheduleBranchUpdate() {
    if (!branchUpdatePending) {
      branchUpdatePending = true;
      window.requestAnimationFrame(updateBranchBackgrounds);
    }
  }

  window.addEventListener('scroll', scheduleBranchUpdate, { passive: true });
  window.addEventListener('resize', scheduleBranchUpdate);
  reducedMotionPreference.addEventListener('change', scheduleBranchUpdate);
  scheduleBranchUpdate();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  function updateScrollButton() {
    scrollTopButton.classList.toggle('is-visible', window.scrollY > 500);
  }
  window.addEventListener('scroll', updateScrollButton, { passive: true });
  updateScrollButton();
  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const year = document.querySelector('#year');
  year.textContent = new Date().getFullYear();

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const subject = `Portfolio inquiry from ${formData.get('name')}`;
    const body = `${formData.get('message')}\n\nFrom: ${formData.get('name')} (${formData.get('email')})`;
    const mailto = `mailto:raselsarker512@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    formStatus.textContent = 'Opening your email app with the message details...';
    formStatus.classList.remove('is-error');
    window.location.href = mailto;
  });
});
