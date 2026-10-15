import '../../styles/mission-vision.css';

export function MissionVision() {
  return <section id="mission-vision" className="wer1-mission-vision" aria-labelledby="mission-vision-title">
    <div className="container">
      <header className="mission-vision-heading" data-about-motion data-motion-group="purpose" data-motion-gap="250">
        <p className="eyebrow">Our Purpose</p>
        <h2 id="mission-vision-title">Mission &amp; Vision</h2>
        <p className="mission-vision-support">What We Stand For.</p>
      </header>
      <div className="mission-vision-grid">
        <article className="mission-vision-card" aria-labelledby="mission-title" data-about-motion data-motion-group="purpose" data-motion-gap="250">
          <svg className="mission-vision-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M12 21v-8M12 16C6 16 3 13 3 7c6 0 9 3 9 9ZM12 13c0-6 3-10 9-10 0 6-3 10-9 10ZM8 21h8" />
          </svg>
          <h3 id="mission-title">Mission</h3>
          <p>Building with quality, safety, integrity, and innovation to create lasting value for society through excellence and sustainable development.</p>
        </article>
        <article className="mission-vision-card" aria-labelledby="vision-title" data-about-motion data-motion-group="purpose" data-motion-gap="250">
          <svg className="mission-vision-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="m3 17 6-6 4 4L21 7M15 7h6v6" />
          </svg>
          <h3 id="vision-title">Vision</h3>
          <p>To grow as a trusted construction company, recognized for excellence, integrity, innovation, and the successful delivery of landmark projects that contribute to a better future.</p>
        </article>
      </div>
    </div>
  </section>;
}
