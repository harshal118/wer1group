import { ClockwiseBorder } from './ClockwiseBorder';

export function BrandStoryCTA({ href = '/about', label = 'Discover the WER1 Story' }: { href?: string; label?: string }) {
  return <a className="button brand-story-button" href={href}>
    <ClockwiseBorder className="brand-story-border" />
    <span>{label}</span>
    <svg className="brand-story-arrow" aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 19 19 5M5 5h14v14" /></svg>
  </a>;
}
