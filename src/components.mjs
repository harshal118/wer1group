import { navigation } from './data.mjs';

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const arrow = '<span class="arrow" aria-hidden="true">→</span>';

export function Button({ label, href, secondary = false, withArrow = true }) {
  return `<a class="button ${secondary ? 'button-secondary' : 'button-primary'}" href="${escapeHtml(href)}">${escapeHtml(label)}${withArrow ? arrow : ''}</a>`;
}

export function Navigation({ mobile = false } = {}) {
  return `<nav aria-label="${mobile ? 'Mobile' : 'Primary'} navigation" class="${mobile ? 'mobile-navigation' : 'desktop-navigation'}">${navigation.map(({ label, href }) => `<a href="${href}"${label === 'Home' ? ' class="nav-home"' : ''}>${label}</a>`).join('')}</nav>`;
}

export function Header() {
  return `<header class="site-header"><div class="container header-inner">
    <a class="wordmark" href="#home" aria-label="WeR1 Infra home">WeR1 Infra</a>
    ${Navigation()}
    <div class="header-actions">${Button({ label: 'Enquire', href: '#contact', withArrow: false })}
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" hidden><span class="menu-label">Menu</span><span class="menu-icon" aria-hidden="true"><i></i><i></i></span></button>
    </div>
  </div><div id="mobile-menu" class="mobile-menu" hidden>${Navigation({ mobile: true })}</div></header>`;
}

export function SectionHeader({ eyebrow, title, id }) {
  return `<div class="section-heading"><p class="eyebrow">${escapeHtml(eyebrow)}</p><h2${id ? ` id="${id}"` : ''}>${title}</h2></div>`;
}

export function ProjectCard(project) {
  const label = project.name || project.temporaryLabel;
  const content = `<div class="project-image"><img src="public/images/projects/${escapeHtml(project.image)}" alt="${escapeHtml(label)} — image from the WeR1 Infra company profile" loading="lazy" decoding="async"></div>
    <div class="project-info"><p class="project-location">${escapeHtml(project.location)}</p><h3>${escapeHtml(label)}</h3><p class="project-meta">${project.type ? `${escapeHtml(project.type)} <span aria-hidden="true">·</span> ` : ''}${escapeHtml(project.status)}</p></div>
    <div class="project-bottom"><span>${escapeHtml(project.timing)}</span>${project.href ? arrow : ''}</div>`;
  return `<article class="project-card">${project.href ? `<a class="project-link" href="${escapeHtml(project.href)}">${content}</a>` : content}</article>`;
}

export function ProjectGrid(projects) {
  return `<div class="project-grid">${projects.map(ProjectCard).join('')}</div>`;
}

export function PhilosophyGrid(items) {
  return `<div class="philosophy-grid">${items.map((item, index) => `<div class="philosophy-item"><span class="item-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><span class="small-rule" aria-hidden="true"></span></div>`).join('')}</div>`;
}

export function Footer() {
  return `<footer class="site-footer"><div class="container"><div class="footer-grid">
    <div class="footer-brand"><a class="wordmark" href="#home">WeR1 Infra</a><p>Real-estate development &amp; construction.</p></div>
    <nav aria-label="Footer navigation"><h2 class="footer-label">Index</h2><a href="#about">About</a><a href="#projects">Projects</a><a href="#contact">Contact</a></nav>
    <div class="footer-contact"><h2 class="footer-label">Communications</h2><a class="email-link" href="mailto:wer1infra@gmail.com">wer1infra@gmail.com</a><p><a href="tel:+919011881133">+91 9011881133</a></p><p><a href="tel:+917887700722">+91 7887700722</a></p></div>
  </div><div class="footer-bottom"><p>© ${new Date().getFullYear()} WeR1 Infra. All rights reserved.</p></div></div></footer>`;
}
