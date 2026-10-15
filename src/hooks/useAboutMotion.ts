import { useLayoutEffect, type RefObject } from 'react';

// About-only enhancement: one observer, no scroll-driven React renders.
export function useAboutMotion(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches || !root.current || !('IntersectionObserver' in window)) return;
    const targets = Array.from(root.current.querySelectorAll<HTMLElement>('[data-about-motion], .section-heading'));
    const pending = new Set(targets);
    const nextStart = new Map<string, number>();
    let frame = 0;
    let observer: IntersectionObserver;
    const reveal = (element: HTMLElement) => {
      if (!pending.delete(element)) return;
      const group = element.dataset.motionGroup ?? '';
      const now = performance.now();
      const delay = group ? Math.max(0, (nextStart.get(group) ?? now) - now) : 0;
      if (group) nextStart.set(group, now + delay + Number(element.dataset.motionGap ?? 220));
      element.style.setProperty('--about-motion-delay', `${delay}ms`);
      element.classList.remove('about-motion-pending');
      element.classList.add('about-motion-entered');
      observer.unobserve(element);
    };
    const scan = () => {
      frame = 0;
      for (const element of pending) {
        const rect = element.getBoundingClientRect();
        // Content above a restored scroll position must never remain hidden.
        if (rect.bottom <= 0) {
          pending.delete(element);
          element.classList.remove('about-motion-pending');
          observer.unobserve(element);
          continue;
        }
        const visible = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
        if (visible >= Math.min(rect.height * .2, innerHeight * .2)) reveal(element);
      }
    };
    try {
      observer = new IntersectionObserver(() => scan(), { threshold: [0, .05, .1, .15, .2, .25] });
      targets.forEach(element => observer.observe(element));
    } catch {
      return; // Observer setup failed: keep the default visible content.
    }
    targets.forEach(element => element.classList.add('about-motion-pending'));
    scan();
    const schedule = () => { if (!frame && pending.size) frame = requestAnimationFrame(scan); };
    // Also covers broken/missing observer callbacks and scroll restoration.
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const fallback = window.setTimeout(scan, 1200);
    const showAll = () => {
      if (!motion.matches) return;
      observer.disconnect();
      pending.clear();
      targets.forEach(element => element.classList.remove('about-motion-pending', 'about-motion-entered'));
    };
    motion.addEventListener('change', showAll);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', showAll);
      targets.forEach(element => {
        element.classList.remove('about-motion-pending', 'about-motion-entered');
        element.style.removeProperty('--about-motion-delay');
      });
    };
  }, [root]);
}
