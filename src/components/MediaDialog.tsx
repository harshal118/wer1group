import type { RefObject } from 'react';
import { company } from '../data/company';

export function MediaDialog({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement | null> }) {
  return <dialog ref={dialogRef} className="media-dialog" aria-labelledby="media-title" onClick={event => {
    if (event.target === event.currentTarget) dialogRef.current?.close();
  }}><div><p className="eyebrow">{company.brand}</p><h2 id="media-title">Media enquiries</h2>
    <p>For media information, please get in touch with our team.</p>
    <a href={`mailto:${company.contact.email}`}>{company.contact.email}</a>
    <form method="dialog"><button className="text-button">Close <span aria-hidden="true">×</span></button></form>
  </div></dialog>;
}
