import { CompanySection } from './CompanySection';
import { ServiceCard } from './ServiceCard';
import { services } from '../../data/services';
import '../../styles/services.css';

export function WhatWeDoSection() {
  return <CompanySection id="what-we-do" title="WHAT WE DO" intro="Our core areas of business">
    <div className="company-grid company-grid--services">
      {services.map((service, index) => <ServiceCard key={service.id} service={service} number={index + 1}/>)}
    </div>
  </CompanySection>;
}
