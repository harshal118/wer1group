export function AboutSection() {
  return <section className="about-section editorial-section" id="about" aria-labelledby="about-title">
    <p className="section-eyebrow">ABOUT WER1GROUP</p>
    <div className="about-layout">
      <h1 id="about-title"><span className="about-headline-constructing">Constructing</span>{' '}<span className="about-headline-happiness">Happiness.</span></h1>
      <div className="about-copy">
        <p>Founded in 2022, WeR1 Infra is a construction and real estate company delivering residential and commercial developments. Its portfolio spans completed, ongoing and upcoming projects.</p>
        <p>Disciplined execution and collaboration guide our approach, with a focus on quality, trust, transparency and timely delivery.</p>
      </div>
    </div>
    <dl className="company-metrics">
      <div><dt>Year founded</dt><dd>2022</dd></div>
      <div><dt>Completed projects</dt><dd>3</dd></div>
      <div><dt>Ongoing projects</dt><dd>2</dd></div>
      <div><dt>Upcoming projects</dt><dd>2</dd></div>
    </dl>
  </section>;
}
