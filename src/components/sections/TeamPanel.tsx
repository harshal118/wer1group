import { useState } from 'react';
import type { TeamArea } from '../../data/team';

const icons: Record<TeamArea['id'], string> = {
  management: 'M24 5v5M24 38v5M5 24h5M38 24h5M24 10a14 14 0 1 0 0 28 14 14 0 0 0 0-28ZM30 17l-4 11-9 3 4-11 9-3ZM21 20l5 8',
  engineering: 'M5 39h38M9 39V18h30v21M9 18l15-9 15 9M9 18l10 21 10-21 10 21M9 18h30M9 28h30M24 9V5M5 43h38',
};
const plans: Record<TeamArea['id'], string> = {
  management: 'M80 40h300v210H80ZM80 130h120V40M200 130h100v120M300 130v-35h80M120 250v-70h80M58 40v210M50 40h16M50 250h16M80 274h300M80 266v16M380 266v16',
  engineering: 'M45 245h360M65 245V65h320v180M65 65l80 180 80-180 80 180 80-180M65 155h320M45 40h360M65 30v20M385 30v20M420 65v180M412 65h16M412 245h16',
};

export function TeamPanel({ area, number }: { area: TeamArea; number: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  return <div className="company-item team-panel">
    <div className="team-panel-media" aria-hidden="true">
      {area.image && !imageFailed && <img src={area.image} alt="" loading="lazy" decoding="async"
        style={{ objectPosition: area.imagePosition }} onError={() => setImageFailed(true)}/>}
      <svg className="team-panel-plan" viewBox="0 0 460 300" fill="none" stroke="currentColor" strokeWidth="1"><path d={plans[area.id]}/></svg>
    </div>
    <div className="team-panel-shade" aria-hidden="true"/>
    <span className="team-panel-marker" aria-hidden="true">{String(number).padStart(2, '0')}</span>
    <div className="team-panel-content">
      <div className="team-panel-heading">
        <svg className="team-panel-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icons[area.id]}/></svg>
        <h3>{area.title}</h3>
      </div>
      <p>{area.description}</p>
    </div>
  </div>;
}
