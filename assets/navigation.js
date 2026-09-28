(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const label = toggle.querySelector('.menu-label');
  const desktop = window.matchMedia('(min-width: 960px)');
  toggle.hidden = false;
  document.documentElement.classList.add('navigation-ready');

  function closeMenu({ restoreFocus = false } = {}) {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    label.textContent = 'Menu';
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !opening;
    toggle.setAttribute('aria-expanded', String(opening));
    label.textContent = opening ? 'Close' : 'Menu';
  });
  menu.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    closeMenu();
    const target = document.querySelector(link.hash);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) closeMenu({ restoreFocus: true });
  });
  document.addEventListener('click', (event) => {
    if (!menu.hidden && !event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('focusin', (event) => {
    if (!menu.hidden && !event.target.closest('.site-header')) closeMenu();
  });
  desktop.addEventListener('change', () => {
    const focusWouldHide = menu.contains(document.activeElement) || document.activeElement === toggle;
    closeMenu();
    if (desktop.matches && focusWouldHide) document.querySelector('.wordmark').focus();
  });
})();
