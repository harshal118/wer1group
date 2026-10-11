import { company } from '../data/company';
import { useId } from 'react';

export function InstagramLink({ multicolor = false }: { multicolor?: boolean }) {
  const gradientId = useId();
  return <a className="instagram-link" href={company.contact.instagram.url} target="_blank" rel="noopener noreferrer"
    aria-label={`WER1 Group on Instagram ${company.contact.instagram.handle} (opens in a new tab)`}>
    {multicolor ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs><linearGradient id={gradientId} x1="2" y1="24" x2="21" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEDA75" /><stop offset=".25" stopColor="#FA7E1E" /><stop offset=".5" stopColor="#D62976" /><stop offset=".75" stopColor="#962FBF" /><stop offset="1" stopColor="#4F5BD5" />
      </linearGradient></defs>
      <rect width="24" height="24" rx="6" fill={`url(#${gradientId})`} />
      <rect x="5" y="5" width="14" height="14" rx="4" stroke="white" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.3" stroke="white" strokeWidth="1.7" /><circle cx="16.8" cy="7.3" r="1" fill="white" />
    </svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
    </svg>}<span>{company.contact.instagram.handle}</span>
  </a>;
}
