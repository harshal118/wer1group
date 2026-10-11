import { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';

export function Header({ currentPage = 'home' }: { onMedia: () => void; currentPage?: 'home' | 'about' | 'contact' }) {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState(() => window.location.hash);
  const expertiseActive = currentPage === 'about' && hash === '#expertise';
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); }
    }
    function outside(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    }
    const desktop = window.matchMedia('(min-width: 769px)');
    const close = () => setOpen(false);
    window.addEventListener('keydown', escape);
    window.addEventListener('pointerdown', outside);
    desktop.addEventListener('change', close);
    return () => { window.removeEventListener('keydown', escape); window.removeEventListener('pointerdown', outside); desktop.removeEventListener('change', close); };
  }, [open]);
  return <header className="site-header" ref={header} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <div className="container header-inner">
      <a href="/#home" className="brand" aria-label="WER1 Group home" onClick={() => setOpen(false)}><Logo /></a>
      <button className="menu-toggle" ref={toggle} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><span className={open ? 'menu-lines is-open' : 'menu-lines'} /><span>{open ? 'Close' : 'Menu'}</span></button>
      <nav id="main-navigation" className={open ? 'navigation is-open' : 'navigation'} aria-label="Main navigation" onClick={() => setOpen(false)}>
        <a href="/#home" aria-current={currentPage === 'home' ? 'page' : undefined}>Home</a><a href="/about" aria-current={currentPage === 'about' && !expertiseActive ? 'page' : undefined}>About us</a>
        <a href="/#projects">Projects <span className="chevron" aria-hidden="true" /></a>
        <a href="/about#expertise" aria-current={expertiseActive ? 'location' : undefined}>Our Expertise</a><a href="/contact" aria-current={currentPage === 'contact' ? 'page' : undefined}>Contact us</a>
      </nav>
    </div>
  </header>;
}
