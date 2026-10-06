export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  document.querySelector('[data-project-focus]')?.removeAttribute('data-project-focus');
  if (id.startsWith('project-')) target.setAttribute('data-project-focus', 'true');
  target.focus({ preventScroll: true });
  history.replaceState(null, '', `#${id}`);
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
}
