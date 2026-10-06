import type { ReactNode } from 'react';

export function CompanySection({ id, title, intro, children }: {
  id: string; title: string; intro?: string; children: ReactNode;
}) {
  return <section id={id} className={`editorial-section company-section company-section--${id}`} aria-labelledby={`${id}-title`}>
    <h2 className="section-eyebrow" id={`${id}-title`}>{title}</h2>
    {intro && <p className="company-intro">{intro}</p>}
    {children}
  </section>;
}
