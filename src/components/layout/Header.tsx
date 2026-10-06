import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { scrollToSection } from '../../lib/projectNavigation';

export function Header() {
  const mobile = useMediaQuery('(max-width: 767px)');
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!mobile || !open) return;
    const element = dialog.current;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = overflow; };
  }, [mobile, open]);
  useEffect(() => { if (!mobile) setOpen(false); }, [mobile]);
  const close = () => { setOpen(false); toggle.current?.focus(); };
  const navigate = (id: string) => {
    dialog.current?.close();
    document.body.style.overflow = '';
    setOpen(false);
    scrollToSection(id);
  };
  return <header className="prototype-header">
    <div className="project-title">WER1GROUP</div>
    {!mobile ? <nav aria-label="Prototype navigation">
      <a href="#home" aria-current="page" onClick={event => { event.preventDefault(); scrollToSection('home'); }}>Home</a>
      <a href="#projects" onClick={event => { event.preventDefault(); scrollToSection('projects'); }}>Projects</a>
      <a href="#contact" className="enquire-link" onClick={event => { event.preventDefault(); scrollToSection('contact'); }}>Enquire</a>
    </nav> : <>
      <button className="menu-toggle" ref={toggle} aria-haspopup="dialog" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}>Menu</button>
      <dialog className="mobile-menu" id="mobile-navigation" ref={dialog} aria-label="Navigation" onCancel={event => { event.preventDefault(); close(); }}>
        <div className="mobile-menu-top"><span className="project-title">WER1GROUP</span><button className="menu-toggle" onClick={close}>Close</button></div>
        <nav aria-label="Mobile navigation">
          <a href="#home" onClick={event => { event.preventDefault(); navigate('home'); }}>Home</a>
          <a href="#projects" onClick={event => { event.preventDefault(); navigate('projects'); }}>Projects</a>
          <a href="#contact" className="enquire-link" onClick={event => { event.preventDefault(); navigate('contact'); }}>Enquire</a>
        </nav>
      </dialog>
    </>}
  </header>;
}
