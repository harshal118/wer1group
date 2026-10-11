import { useLayoutEffect, useRef } from 'react';

export function AboutBanner() {
  const banner = useRef<HTMLElement>(null);
  const image = useRef<HTMLImageElement>(null);
  useLayoutEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const smallScreen = window.matchMedia('(max-width: 768px)');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!banner.current || !image.current) return;
      if (motion.matches || smallScreen.matches) { image.current.style.transform = 'none'; return; }
      const bounds = banner.current.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      const distance = Math.max(-70, Math.min(70, -bounds.top * 0.4));
      image.current.style.transform = `translate3d(0, ${distance}px, 0)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const configure = () => {
      window.removeEventListener('scroll', schedule);
      if (!motion.matches && !smallScreen.matches) window.addEventListener('scroll', schedule, { passive: true });
      update();
    };
    configure();
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', configure);
    smallScreen.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', configure);
      smallScreen.removeEventListener('change', configure);
    };
  }, []);
  return <section ref={banner} className="wer1-about-banner" aria-labelledby="about-banner-title">
    <img ref={image} className="wer1-about-banner-image" src="/media/about/about_us_team.png" width={2172} height={724} alt="" fetchPriority="high" decoding="async" />
    <div className="wer1-about-banner-shade" />
    <div className="wer1-about-banner-content container">
      <h1 id="about-banner-title">About Us</h1>
      <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><span aria-hidden="true">›</span><span aria-current="page">About Us</span></li></ol></nav>
    </div>
  </section>;
}
