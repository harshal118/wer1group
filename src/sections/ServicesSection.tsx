import { company } from '../data/company';
import { homepage } from '../data/homepage';
import { Arrow } from '../components/Arrow';

export function ServicesSection({ full = false }: { full?: boolean }) {
  return <section id="services" className="homepage-section services-section" aria-labelledby="services-title"><div className="container">
    <div className="section-heading"><div><p className="eyebrow">Our expertise</p><h2 id="services-title">Expertise Across Every Stage of Development.</h2></div>
    </div>
    <div className="service-grid">{company.services.map((service, index) => <article className="service-card" key={service.id}>
      <span className="service-index" aria-hidden="true">0{index + 1}</span><h3>{service.title}</h3>
      <p>{full ? service.description : homepage.services[service.id]}</p>
    </article>)}</div>
    {!full && <a className="text-button" href="/about#services">Discover our expertise<Arrow /></a>}
  </div></section>;
}
