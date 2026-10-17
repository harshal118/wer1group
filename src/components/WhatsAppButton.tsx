import { getWhatsAppUrl } from '../utils/whatsapp';
import '../styles/whatsapp-button.css';

export function WhatsAppButton() {
  return <a className="whatsapp-button" href={getWhatsAppUrl()}
    target="_blank" rel="noopener noreferrer" aria-label="Chat with WER1 Group on WhatsApp (opens in a new tab)">
    <svg viewBox="0 0 32 32" width="32" height="32" fill="currentColor" aria-hidden="true">
      <path d="M16 .8A15.1 15.1 0 0 0 3.1 23.7L1 31l7.5-2A15.2 15.2 0 1 0 16 .8Zm0 27.5a12.4 12.4 0 0 1-6.3-1.7l-.5-.3-4.5 1.2 1.2-4.4-.3-.5A12.5 12.5 0 1 1 16 28.3Z" />
      <path d="M12 8.5c-.3-.7-.6-.7-.9-.7h-.8c-.3 0-.7.1-1 .5s-1.4 1.4-1.4 3.4 1.5 3.9 1.7 4.2c.2.3 2.9 4.5 7 6.1 3.5 1.4 4.2 1.1 5 .9.8-.1 2.6-1 3-2 .4-1 .4-1.9.3-2.1-.1-.2-.4-.3-.8-.5l-3-1.4c-.4-.2-.7-.3-1 .2l-1.4 1.6c-.2.3-.5.3-.9.1a11.1 11.1 0 0 1-3.3-2 12.4 12.4 0 0 1-2.3-2.9c-.2-.4 0-.6.2-.8l.6-.7.4-.7c.1-.2.1-.5 0-.7L12 8.5Z" />
    </svg>
  </a>;
}
