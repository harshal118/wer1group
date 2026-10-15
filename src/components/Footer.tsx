import { company } from '../data/company';
import { InstagramLink } from './InstagramLink';
import '../styles/footer.css';
export function Footer({ includeClosing = false }: { includeClosing?: boolean }) {
  return <>
    {includeClosing && <section id="closing" className="champagne-closing" aria-labelledby="footer-statement-title"><div className="container footer-heading">
      <h2 id="footer-statement-title">We Don't Just Develop Land. We Create Better Ways to Live.</h2>
      <p>Land holds potential. People give it purpose. Together, we create spaces for a better tomorrow.</p>
    </div></section>}
    <footer className="site-footer unified-footer" id={includeClosing ? 'contact' : undefined}>
    <div className="container footer-grid">
    <div className="footer-brand"><a href="/#home" aria-label="WER1 Group home"><img className="footer-white-logo" src="/media/brand/WER1_Logo_white_text.jpg" width={2084} height={2085} alt="WER1 Group" loading="lazy" decoding="async" /></a><p>{company.tagline}.</p></div>
    <nav className="footer-navigation" aria-label="Footer navigation"><p className="eyebrow">Explore</p><a href="/#home">Home</a><a href="/about">About Us</a><a href="/#projects">Projects</a><a href="/about#expertise">Our Expertise</a><a href="/contact">Contact Us</a></nav>
    <div className="footer-visit"><p className="eyebrow">Visit us</p>
      <address>{company.contact.address.map(line => <span key={line}>{line}</span>)}</address>
      <iframe title="WER1 Group office location — VTP Altitude, Wakad, Pune" src="https://www.google.com/maps?q=VTP%20Altitude%2C%20Aundh%20Ravet%20BRTS%20Road%2C%20Wakad%2C%20Pune&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
    </div>
    <div className="footer-contacts"><p className="eyebrow">Connect with us</p><a href={`mailto:${company.contact.email}`}>{company.contact.email}</a>{company.contact.phones.map(phone => <a key={phone.href} href={phone.href}>{phone.display}</a>)}<InstagramLink multicolor /></div>
  </div>
    <div className="container footer-bottom"><p>© {new Date().getFullYear()} {company.brand}</p></div></footer></>;
}
