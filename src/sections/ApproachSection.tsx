import { company } from '../data/company';

export function ApproachSection() {
  return <section id="approach" className="homepage-section approach-section" aria-labelledby="approach-title"><div className="container">
    <div className="section-heading"><div><p className="eyebrow">Our approach</p><h2 id="approach-title">A Thoughtful Approach to Every Development.</h2></div></div>
    <ol className="approach-grid">{company.approachStages.map((stage, index) => <li key={stage.title}>
      <span className="stage-number" aria-hidden="true">0{index + 1}</span><h3>{stage.title}</h3><p>{stage.description}</p>
    </li>)}</ol>
  </div></section>;
}
