import { company } from '../data/company';
import { homepage } from '../data/homepage';

export function WhyChooseSection() {
  return <section id="why-wer1" className="homepage-section why-section" aria-labelledby="why-title"><div className="container">
    <div className="section-heading"><div><p className="eyebrow">Why choose WER1 Group</p><h2 id="why-title">A Vision for Better Living.</h2></div>
    </div>
    <div className="credibility-grid">{company.credibilityPillars.map((pillar, index) => <article className="credibility-pillar" key={pillar.title}>
      <h3>{pillar.title}</h3><p>{pillar.description ?? homepage.differentiators[index]}</p>
    </article>)}</div>
  </div></section>;
}
