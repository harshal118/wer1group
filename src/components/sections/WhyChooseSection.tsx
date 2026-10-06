import { CompanySection } from './CompanySection';

const reasons = [
  ['EXPERIENCED TEAM', 'Specialized management and civil engineers with 5+ years of field experience.'],
  ['PROVEN TRACK RECORD', 'Multiple completed residential and commercial projects since 2022.'],
  ['TRUSTED PARTNERSHIPS', 'Strong collaboration with landowners and transparent engagement with clients.'],
  ['GROWING PORTFOLIO', 'Active roadmap of ongoing and upcoming residential and commercial projects.'],
];

export function WhyChooseSection() {
  return <CompanySection id="why-choose" title="WHY CHOOSE WER1 INFRA">
    <div className="company-grid company-grid--reasons">
      {reasons.map(([title, copy]) => <div className="company-item" key={title}><h3>{title}</h3><p>{copy}</p></div>)}
    </div>
  </CompanySection>;
}
