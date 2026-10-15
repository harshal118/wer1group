import { CompanyStatistics } from '../components/CompanyStatistics';
import { BrandStoryCTA } from '../components/BrandStoryCTA';
import { company } from '../data/company';
import { Logo } from '../components/Logo';
import { AnimatedBrandHeadline } from '../components/AnimatedBrandHeadline';
import '../styles/brand-introduction.css';
export function AboutSection() {
  return <section id="about" className="about container opening-statement" aria-labelledby="about-title">
    <div className="intro-heading"><div className="brand-statement"><Logo /><p className="supporting-statement">{company.opening.supportingStatement}</p></div><AnimatedBrandHeadline id="about-title" phrases={company.opening.headline} /></div>
    <div className="about-copy"><p>{company.opening.introduction}</p>
      <div className="opening-actions"><BrandStoryCTA /></div>
    </div>
    <CompanyStatistics />
  </section>;
}
