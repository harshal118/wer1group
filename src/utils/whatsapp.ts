import { company } from '../data/company';

export const whatsAppMessage = 'Hello WER1 Group, I’m interested in your real estate and infrastructure solutions. I would like to discuss my project requirements and explore how we can work together. Please connect with me.\n\nThank You';

export function getWhatsAppUrl() {
  const number = company.contact.phones[0].href.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(whatsAppMessage)}`;
}
