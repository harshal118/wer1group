import { useState } from 'react';
import type { Service } from '../../data/services';

const iconPaths: Record<Service['id'], string> = {
  residential: 'M6 42h36M12 42V15l12-7 12 7v27M19 42V31h10v11M19 19h2m6 0h2M19 25h2m6 0h2',
  commercial: 'M5 42h38M10 42V8h28v34M17 15h3m8 0h3M17 22h3m8 0h3M17 29h3m8 0h3M21 42v-6h6v6',
  'real-estate': 'M5 17l13-5 12 5 13-5v25l-13 5-12-5-13 5V17M18 12v25M30 17v25M24 5a5 5 0 0 1 5 5c0 4-5 9-5 9s-5-5-5-9a5 5 0 0 1 5-5Z',
  'end-to-end': 'M11 9h27v32H11a5 5 0 0 1 0-10h27M11 9a5 5 0 0 0-5 5v22M17 15h14v10H17ZM17 20h6v5M23 15v5M18 36h2m4 0h2m4 0h2',
};

export function ServiceCard({ service, number }: { service: Service; number: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  return <div className="company-item service-card">
    <div className="service-media" aria-hidden="true">
      {service.image && !imageFailed && <img src={service.image} alt="" loading="lazy" decoding="async"
        style={{ objectPosition: service.imagePosition }} onError={() => setImageFailed(true)}/>}
    </div>
    <div className="service-shade" aria-hidden="true"/>
    <span className="service-number" aria-hidden="true">{String(number).padStart(2, '0')}</span>
    <div className="service-content">
      <svg className="service-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={iconPaths[service.id]}/>
      </svg>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
    </div>
  </div>;
}
