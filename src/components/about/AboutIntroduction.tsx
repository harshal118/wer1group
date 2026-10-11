import { useEffect, useRef } from 'react';

export function AboutIntroduction() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('wer1-about-entered');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    section.current?.querySelectorAll('[data-about-reveal]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return <section ref={section} className="wer1-about-introduction container" aria-labelledby="company-title">
    <div className="wer1-about-introduction-copy">
      <div data-about-reveal><p className="eyebrow">About WER1 Group</p><h2 id="company-title">Building Excellence.<br />Creating Happiness.</h2></div>
      <div className="wer1-about-introduction-body" data-about-reveal>
        <p>Founded in 2022, WeR1 Infra is a construction and real estate company delivering residential and commercial developments. With a growing portfolio of completed, ongoing and upcoming projects, the company combines disciplined execution, collaborative partnerships and a commitment to quality, transparency and timely delivery.</p>
        <p>At WeR1 Group, we believe meaningful development begins with understanding people, their aspirations and the spaces they need. Through thoughtful planning, engineering coordination and quality-focused execution, we work to create developments that deliver practical functionality and lasting value.</p>
      </div>
    </div>
    <figure className="wer1-about-construction" data-about-reveal>
      <img src="/media/about/construct.jpg" width={2400} height={1600} alt="Construction worker silhouetted on scaffolding against a golden sky" loading="lazy" decoding="async" />
    </figure>
  </section>;
}
