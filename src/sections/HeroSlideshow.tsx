import { useCallback, useEffect, useRef, useState } from 'react';
import { Arrow } from '../components/Arrow';
import { completionLabel, heroProjects } from '../data/projects';
import { ProjectMedia } from '../components/ProjectMedia';

export function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof window.setInterval> | undefined>(undefined);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const restartAutoplay = useCallback(() => {
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setActive(current => (current + 1) % heroProjects.length);
    }, 5000);
  }, []);

  useEffect(() => {
    restartAutoplay();
    // StrictMode's setup/cleanup/setup cycle leaves exactly one active timer.
    return () => window.clearInterval(timer.current);
  }, [restartAutoplay]);

  const change = (destination: number | ((current: number) => number)) => {
    setActive(current => {
      const index = typeof destination === 'function' ? destination(current) : destination;
      return (index + heroProjects.length) % heroProjects.length;
    });
    restartAutoplay();
  };
  const project = heroProjects[active];
  if (!project) return null;
  return <section id="home-showcase" className="hero" aria-label="WER1 project showcase" aria-roledescription="carousel"
    onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); change(current => current + (event.key === 'ArrowRight' ? 1 : -1)); } }}>
    <div className="hero-images" onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchCancel={() => { touch.current = null; }} onTouchEnd={event => {
      if (!touch.current) return;
      const dx = event.changedTouches[0].clientX - touch.current.x; const dy = event.changedTouches[0].clientY - touch.current.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) change(current => current + (dx < 0 ? 1 : -1));
      touch.current = null;
    }}>
      {heroProjects.map((slide, index) => <div key={slide.id} className={`hero-slide ${active === index ? 'is-active' : ''}`} aria-hidden={active !== index}>
        <ProjectMedia project={slide} priority={index === 0} />
      </div>)}
      <div className="hero-shade" />
      <div className="container hero-caption"><p className="eyebrow">{project.status}</p><p className="hero-title">{project.name}</p><p className="hero-meta">{project.location} · {completionLabel(project)} {project.completionYear}</p></div>
    </div>
    <div className="hero-toolbar container">
      <div className="project-caption" aria-live="off" aria-atomic="true"><span>{project.name}</span><small>{project.location} · {project.completionYear}</small></div>
      <div className="slide-controls">
        <button className="icon-button" aria-label="Previous project" onClick={() => change(current => current - 1)}><Arrow direction="left" /></button>
        <div className="slide-dots" aria-label="Choose project">{heroProjects.map((slide, index) => <button key={slide.name} aria-label={`Show ${slide.name}`} aria-current={index === active ? 'true' : undefined} onClick={() => change(index)}><span /></button>)}</div>
        <button className="icon-button" aria-label="Next project" onClick={() => change(current => current + 1)}><Arrow /></button>
      </div>
    </div>
  </section>;
}
