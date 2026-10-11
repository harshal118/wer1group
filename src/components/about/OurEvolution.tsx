import { useEffect, useRef } from 'react';
import { Logo } from '../Logo';
import '../../styles/our-evolution.css';

export function OurEvolution() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('evolution-entered');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });
    section.current?.querySelectorAll('[data-evolution-reveal]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <section id="our-evolution" className="our-evolution" ref={section} aria-labelledby="evolution-title">
    <div className="container">
      <header className="evolution-heading" data-evolution-reveal>
        <p className="eyebrow">Our Evolution</p>
        <h2 id="evolution-title">Two Foundations. One Shared Vision.</h2>
        <p>Our journey began with Shreenath Associates in 2021, followed by Bhavana Developers in 2023. In 2025, both ventures came together under a unified brand identity — WER1 Group.</p>
      </header>
      <div className="evolution-diagram">
        <div className="evolution-ventures">
          <article className="evolution-venture" data-evolution-reveal>
            <p className="evolution-year">2021</p><h3>Shreenath Associates</h3>
            <div className="evolution-logo-panel"><img src="/media/brand/Shreenath_Logo.jpeg" alt="Shreenath Associates" width={343} height={136} loading="lazy" decoding="async" /></div>
          </article>
          <article className="evolution-venture" data-evolution-reveal>
            <p className="evolution-year">2023</p><h3>Bhavana Developers</h3>
            <div className="evolution-logo-panel"><img src="/media/brand/Bhavana_Logo.jpeg" alt="Bhavana Developers" width={371} height={92} loading="lazy" decoding="async" /></div>
          </article>
        </div>
        <div className="evolution-connector" data-evolution-reveal aria-hidden="true"><span /></div>
        <div className="evolution-brand" data-evolution-reveal>
          <p className="evolution-year">2025</p><h3>WER1 GROUP</h3>
          <Logo className="evolution-wer1-logo" />
          <p className="evolution-signature">Together, Moving Forward as One.</p>
        </div>
      </div>
      <div className="evolution-summary" data-evolution-reveal>
        <p>Today, Shreenath Associates and Bhavana Developers work under the WER1 Group brand, bringing together their experience, shared values and commitment to quality development.</p>
        <p className="evolution-context">This timeline describes the WER1 Group brand history. The company profile separately records WeR1 Infra as founded in 2022.</p>
      </div>
    </div>
  </section>;
}
