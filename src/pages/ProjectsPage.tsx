import { useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MediaDialog } from '../components/MediaDialog';
import { ProjectsSection } from '../sections/ProjectsSection';
import { PageMetadata } from '../components/PageMetadata';

export function ProjectsPage() {
  const media = useRef<HTMLDialogElement>(null);
  return <>
    <PageMetadata title="Projects | WER1 Group" description="Explore WER1 Group's completed, ongoing and upcoming residential and commercial projects in Pune." path="/projects" />
    <a className="skip-link" href="#main">Skip to content</a>
    <Header currentPage="projects" onMedia={() => media.current?.showModal()} />
    <main id="main" className="projects-page"><ProjectsSection syncWithUrl /></main>
    <Footer /><MediaDialog dialogRef={media} />
  </>;
}
