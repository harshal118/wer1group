import { HomePage } from './pages/HomePage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Resolve incoming section links after React mounts and fonts settle.
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) document.getElementById(hash)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    return () => { cancelled = true; };
  }, []);
  const path = window.location.pathname.replace(/\/$/, '');
  return path === '/about' ? <AboutPage /> : path === '/contact' ? <ContactPage /> : <HomePage />;
}
