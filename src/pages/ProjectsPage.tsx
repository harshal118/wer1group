import { useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MediaDialog } from '../components/MediaDialog';
import { ProjectsSection } from '../sections/ProjectsSection';

export function ProjectsPage() {
  const media = useRef<HTMLDialogElement>(null);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header currentPage="projects" onMedia={() => media.current?.showModal()} />
    <main id="main" className="projects-page"><ProjectsSection syncWithUrl /></main>
    <Footer /><MediaDialog dialogRef={media} />
  </>;
}
