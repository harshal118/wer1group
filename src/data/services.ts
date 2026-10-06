export interface Service {
  id: 'residential' | 'commercial' | 'real-estate' | 'end-to-end';
  title: string;
  description: string;
  image?: string;
  imagePosition?: string;
}

// Decorative imagery only. Replace these paths when dedicated service assets are supplied.
export const services: readonly Service[] = [
  { id: 'residential', title: 'RESIDENTIAL CONSTRUCTION', description: 'Designing and building residential developments with quality construction, thoughtful planning, and lasting value.', image: '/images/projects/aikyam.webp', imagePosition: 'center 35%' },
  { id: 'commercial', title: 'COMMERCIAL CONSTRUCTION', description: 'Delivering commercial spaces from concept to completion, backed by reliable timelines and lasting construction standards.', image: '/images/projects/punawale-phase-1.webp', imagePosition: 'left center' },
  { id: 'real-estate', title: 'REAL ESTATE', description: 'Partnering with landowners and guiding projects from land acquisition through development to strong outcomes.', image: '/images/projects/punawale-phase-2.webp' },
  { id: 'end-to-end', title: 'END-TO-END CONSTRUCTION SOLUTIONS', description: 'From concept to completion, we deliver seamless construction solutions with quality, precision, and reliability.' },
];
