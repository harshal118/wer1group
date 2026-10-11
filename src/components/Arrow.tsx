export function Arrow({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return <svg aria-hidden="true" width="22" height="16" viewBox="0 0 24 16" style={{ transform: direction === 'left' ? 'rotate(180deg)' : undefined }}><path d="M1 8h20M15 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;
}
