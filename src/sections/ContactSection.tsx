import { company } from '../data/company';
import { Arrow } from '../components/Arrow';
import { InstagramLink } from '../components/InstagramLink';

export function ContactSection() {
  return <section id="contact" className="homepage-section contact-cta" aria-labelledby="contact-title"><div className="container contact-layout">
    <div><p className="eyebrow">Get in touch</p><h2 id="contact-title">{company.brandStatements.contactHeading}</h2>
      <a className="text-button" href="/contact">Contact us<Arrow /></a>
    </div>
    <div className="contact-options"><p className="eyebrow">{company.brand}</p>
      <a className="contact-email" href={`mailto:${company.contact.email}`}>{company.contact.email}</a>
      <div>{company.contact.phones.map(phone => <a key={phone.href} href={phone.href}>{phone.display}</a>)}</div>
      <address>{company.contact.address.map(line => <span key={line}>{line}</span>)}</address><InstagramLink />
    </div>
  </div></section>;
}
