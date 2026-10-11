import { useEffect, type RefObject } from 'react';

// Content stays visible by default. Animation is an enhancement on entry, never a gate.
export function useScrollReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    root.current?.querySelectorAll('.section-heading, .story-image, .intro-heading').forEach(element => observer.observe(element));
    const stop = () => { if (motion.matches) observer.disconnect(); };
    motion.addEventListener('change', stop);
    return () => { observer.disconnect(); motion.removeEventListener('change', stop); };
  }, [root]);
}
