import { Logo } from '../Logo';
import '../../styles/our-evolution.css';

export function OurEvolution() {
  return <section id="our-evolution" className="our-evolution" aria-labelledby="evolution-title">
    <div className="container">
      <header className="evolution-heading">
        <p className="eyebrow" data-about-motion data-motion-group="evolution" data-motion-gap="160">Our Evolution</p>
        <h2 id="evolution-title" data-about-motion data-motion-group="evolution" data-motion-gap="220">Two Foundations. One Shared Vision.</h2>
        <p data-about-motion data-motion-group="evolution" data-motion-gap="250">Our journey began with Shreenath Associates in 2021, followed by Bhavana Developers in 2023. In 2025, both ventures came together under a unified brand identity - WER1 Group.</p>
      </header>
      <div className="evolution-diagram">
        <div className="evolution-ventures">
          <article className="evolution-venture" data-about-motion data-motion-group="evolution" data-motion-gap="250">
            <p className="evolution-year">2021</p><h3>Shreenath Associates</h3>
            <div className="evolution-logo-panel"><img src="/media/brand/Shreenath_Logo.jpeg" alt="Shreenath Associates" width={343} height={136} loading="lazy" decoding="async" /></div>
          </article>
          <article className="evolution-venture" data-about-motion data-motion-group="evolution" data-motion-gap="650">
            <p className="evolution-year">2023</p><h3>Bhavana Developers</h3>
            <div className="evolution-logo-panel"><img src="/media/brand/Bhavana_Logo.jpeg" alt="Bhavana Developers" width={371} height={92} loading="lazy" decoding="async" /></div>
          </article>
        </div>
        <div className="evolution-connector" data-about-motion data-motion-group="evolution" data-motion-gap="700" aria-hidden="true">
          <svg viewBox="0 0 100 64" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1">
            <path className="evolution-branch" d="M0 0V32H50M100 0V32H50" pathLength="1" vectorEffect="non-scaling-stroke" />
            <path className="evolution-stem" d="M50 32V64" pathLength="1" vectorEffect="non-scaling-stroke" />
            <path className="evolution-mobile-stem" d="M50 0V64" pathLength="1" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="evolution-brand" data-about-motion data-motion-group="evolution" data-motion-gap="700">
          <p className="evolution-year">2025</p><h3>WER1 GROUP</h3>
          <Logo className="evolution-wer1-logo" />
          <p className="evolution-signature">Together, Moving Forward as One.</p>
        </div>
      </div>
      <div className="evolution-summary" data-about-motion data-motion-group="evolution">
        <p>Today, Shreenath Associates and Bhavana Developers work under the WER1 Group brand, bringing together their experience, shared values and commitment to quality development.</p>
        <p className="evolution-context">This timeline describes the WER1 Group brand history.</p>
      </div>
    </div>
  </section>;
}
