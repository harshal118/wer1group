import { Button, SectionHeader, ProjectGrid, PhilosophyGrid, escapeHtml } from './components.mjs';
import { projects, philosophy, principles } from './data.mjs';

export function Hero() {
  return `<section class="hero" aria-labelledby="hero-title">
    <img class="section-image hero-image" src="assets/images/hero.jpg" srcset="assets/images/hero-small.jpg 512w, assets/images/hero.jpg 1376w" sizes="100vw" alt="" width="1376" height="768" fetchpriority="high" decoding="async">
    <div class="container hero-content"><p class="eyebrow">WeR1 Infra</p><h1 id="hero-title">Constructing<br><em>Happiness.</em></h1>
      <p class="hero-description">Residential and commercial construction and real estate, built on quality, trust and collaboration since 2022.</p>
      <div class="actions">${Button({ label: 'Explore projects', href: '#projects' })}${Button({ label: 'About WER1', href: '#about', secondary: true })}</div>
      <div class="hero-caption"><span>Architecture &amp; development</span><span>Illustrative architectural imagery</span></div>
    </div></section>`;
}

export function Introduction() {
  return `<section id="about" class="section section-light introduction" aria-labelledby="about-title"><div class="container introduction-grid">
    <div>${SectionHeader({ eyebrow: 'Who we are', title: 'Building together.<br>Creating lasting value.', id: 'about-title' })}<div class="accent-rule" aria-hidden="true"></div></div>
    <div class="introduction-copy"><p>Founded in 2022, WeR1 Infra delivers residential and commercial projects. Our portfolio includes three completed projects, two ongoing projects and two upcoming developments.</p><p>Our approach combines disciplined project execution with collaboration, centered on quality, trust, transparency and timely delivery. Our mission is to build with quality, safety, integrity and innovation to create lasting value for society.</p><a class="text-link" href="#approach">Discover our story <span class="arrow" aria-hidden="true">→</span></a></div>
  </div></section>`;
}

export function SelectedProjects() {
  return `<section id="projects" class="section selected-projects" aria-labelledby="projects-title"><div class="container">
    <div class="projects-heading">${SectionHeader({ eyebrow: 'Our projects', title: 'Spaces shaped<br>with purpose.', id: 'projects-title' })}<p class="section-note">Completed · Ongoing · Upcoming</p></div>
    ${ProjectGrid(projects)}<p class="project-disclaimer">Project details and images are from our company profile. Ongoing and upcoming projects are identified by location; official names have not been provided. Launch and expected completion dates reflect the profile.</p>
  </div></section>`;
}

export function Philosophy() {
  return `<section id="approach" class="section section-light philosophy" aria-labelledby="approach-title"><div class="container">${SectionHeader({ eyebrow: 'What we do', title: 'Built around what<br>matters.', id: 'approach-title' })}${PhilosophyGrid(philosophy)}</div></section>`;
}

export function CredibilitySection() {
  return `<section class="credibility" aria-label="Our guiding principles"><div class="container principles-grid">${principles.map(({ title, description }) => `<div class="principle"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p></div>`).join('')}</div></section>`;
}

export function CTASection() {
  return `<section id="contact" class="contact-section" aria-labelledby="contact-title"><img class="section-image contact-image" src="assets/images/cta.jpg" srcset="assets/images/cta-small.jpg 512w, assets/images/cta.jpg 1376w" sizes="100vw" alt="" width="1376" height="768" loading="lazy" decoding="async"><div class="container contact-content"><p class="eyebrow">Commence a conversation</p><h2 id="contact-title">Together, we build<br><em>the future.</em></h2><p class="contact-description">We look forward to partnering with you to turn our vision into reality.</p><div class="actions">${Button({ label: 'Get in touch', href: 'mailto:wer1infra@gmail.com' })}${Button({ label: 'View projects', href: '#projects', secondary: true, withArrow: false })}</div></div></section>`;
}
