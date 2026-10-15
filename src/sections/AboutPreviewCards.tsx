import { projects } from '../data/projects';
import { useLayoutEffect, useRef } from 'react';
import '../styles/about-preview-cards.css';

const cards = [
  { id: 'philosophy', title: 'Our Philosophy', icon: 'M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5', description: "We believe development goes beyond constructing buildings. By understanding people's aspirations, we create thoughtfully planned spaces that improve everyday living, unlock potential and deliver lasting value." },
  { id: 'values', title: 'Our Values', icon: 'M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7l-9-4ZM8 12l3 3 5-6', description: 'Quality, integrity, transparency, safety and innovation guide our work. We prioritize responsible decisions, trusted relationships, professional standards and long-term value in every development.' },
  { id: 'expertise', title: 'Our Expertise', icon: 'M3 21V8h8v13M11 21V3h10v18M6 11h2m-2 4h2m7-8h2m-2 4h2m-2 4h2M1 21h22', description: 'From real estate development and redevelopment to joint ventures, land development, plotting, and residential and commercial construction, we combine thoughtful planning, collaboration and quality-focused execution.' },
];

export function AboutPreviewCards() {
  const section = useRef<HTMLElement>(null);
  const image = useRef<HTMLImageElement>(null);
  useLayoutEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let range = 0;
    const update = () => {
      frame = 0;
      if (!section.current || !image.current) return;
      if (motion.matches || range === 0) {
        image.current.style.transform = 'none';
        return;
      }
      const bounds = section.current.getBoundingClientRect();
      // Viewport bounds avoid off-screen writes; the small buffer covers entry/exit.
      if (bounds.top > innerHeight + 100 || bounds.bottom < -100) return;
      const distanceFromCenter = (innerHeight - bounds.height) / 2 - bounds.top;
      // 0.45px per scroll pixel at the center, easing smoothly toward bounded ends.
      // Unlike a hard clamp, this keeps entry/exit and direction reversals continuous.
      const displacement = range * Math.tanh(distanceFromCenter * 0.45 / range);
      image.current.style.transform = `translate3d(0, ${displacement}px, 0)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const configure = () => {
      cancelAnimationFrame(frame);
      range = section.current ? Math.min(
        parseFloat(getComputedStyle(section.current).getPropertyValue('--preview-parallax-range')) || 0,
        section.current.getBoundingClientRect().height * 0.25,
      ) : 0;
      // Match overscan to maximum travel, with a small rasterization safety margin.
      image.current?.style.setProperty('--preview-parallax-overscan', `${range + 8}px`);
      window.removeEventListener('scroll', schedule);
      if (!motion.matches && range > 0) window.addEventListener('scroll', schedule, { passive: true });
      update();
    };
    configure();
    window.addEventListener('resize', configure);
    motion.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', configure);
      motion.removeEventListener('change', configure);
    };
  }, []);
  const background = projects.find(project => project.id === 'sinclair-place')?.images[0];
  return <section ref={section} id="about-preview" className="about-preview" aria-label="Discover WER1 Group">
    {background && <img ref={image} className="about-preview-background" src={background} alt="" loading="lazy" decoding="async" />}
    <div className="container about-preview-grid">
      {cards.map(card => <a key={card.id} className="about-preview-card" href={`/about#${card.id}`} aria-labelledby={`preview-${card.id}`}>
        <svg className="about-preview-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d={card.icon} /></svg>
        <h2 id={`preview-${card.id}`}>{card.title}</h2>
        <p>{card.description}</p>
        <span className="about-preview-link" aria-hidden="true">Discover more <span>↗</span></span>
      </a>)}
    </div>
  </section>;
}
