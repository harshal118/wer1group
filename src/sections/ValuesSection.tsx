import { company } from '../data/company';

export function ValuesSection() {
  return <section id="values" className="homepage-section values-section" aria-labelledby="values-title"><div className="container">
    <div className="section-heading"><div><p className="eyebrow">Our values</p><h2 id="values-title">What Guides Every Project We Undertake.</h2></div></div>
    <div className="values-grid">{company.values.map(value => <article key={value.title}><h3>{value.title}</h3><p>{value.description}</p></article>)}</div>
  </div></section>;
}
