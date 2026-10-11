import { useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HeroSlideshow } from '../sections/HeroSlideshow';
import { AboutSection } from '../sections/AboutSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { AboutPreviewCards } from '../sections/AboutPreviewCards';
import { WhyChooseSection } from '../sections/WhyChooseSection';
import { MediaDialog } from '../components/MediaDialog';
import { useScrollReveal } from '../hooks/useScrollReveal';
export function HomePage() {
  const media = useRef<HTMLDialogElement>(null);
  const main = useRef<HTMLElement>(null);
  useScrollReveal(main);
  return <div id="home"><a className="skip-link" href="#main">Skip to content</a><Header onMedia={() => media.current?.showModal()} /><main id="main" ref={main}><HeroSlideshow /><AboutSection /><ProjectsSection /><AboutPreviewCards /><WhyChooseSection /></main><Footer includeClosing />
    <MediaDialog dialogRef={media} />
  </div>;
}
