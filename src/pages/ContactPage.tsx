import { useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MediaDialog } from '../components/MediaDialog';
import { PageMetadata } from '../components/PageMetadata';
import { InstagramLink } from '../components/InstagramLink';
import { company } from '../data/company';
import { BrandStoryCTA } from '../components/BrandStoryCTA';
import '../styles/contact.css';

export function ContactPage() {
  const media = useRef<HTMLDialogElement>(null);
  return <div>
    <PageMetadata title="Contact WER1 Group | Constructing Happiness" description={`Contact WER1 Group at ${company.contact.address.join(' ')} Find our verified phone numbers, email and Instagram account.`} path="/contact" />
    <a className="skip-link" href="#main">Skip to content</a><Header currentPage="contact" onMedia={() => media.current?.showModal()} />
    <main id="main" className="contact-page premium-contact"><section className="container contact-page-intro" aria-labelledby="contact-page-title">
      <header className="contact-introduction">
        <p className="eyebrow">Contact WER1 Group</p>
        <h1 id="contact-page-title">Let's Build Something Meaningful.</h1>
        <p className="contact-support">Whether you're exploring a development opportunity, a partnership, or a new space, we'd love to hear from you.</p>
      </header>
      <div className="contact-page-grid">
        <section className="contact-office" aria-labelledby="office-title">
          <p className="eyebrow"><span>01</span> / Visit Us</p><h2 id="office-title">Our Office</h2>
          <address>{company.contact.address.map(line => <span key={line}>{line}</span>)}</address>
          <a className="contact-map-link" href="https://www.google.com/maps/search/?api=1&query=VTP%20Altitude%2C%20Wakad%2C%20Pune%20411033" target="_blank" rel="noopener noreferrer">View office on Google Maps<span className="sr-only"> (opens in a new tab)</span></a>
        </section>
        <section className="contact-conversation" aria-labelledby="conversation-title">
          <p className="eyebrow"><span>02</span> / Connect With Us</p><h2 id="conversation-title">Start a Conversation</h2>
          <div className="contact-page-links">{company.contact.phones.map(phone => <a key={phone.href} href={phone.href}>{phone.display}</a>)}
            <a href={`mailto:${company.contact.email}`}>{company.contact.email}</a><InstagramLink multicolor />
          </div>
          <BrandStoryCTA href={`mailto:${company.contact.email}`} label="Send Us an Email" />
        </section>
      </div>
    </section></main><Footer /><MediaDialog dialogRef={media} />
  </div>;
}
