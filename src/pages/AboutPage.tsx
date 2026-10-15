import { useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MediaDialog } from '../components/MediaDialog';
import { PageMetadata } from '../components/PageMetadata';
import { PhilosophySection } from '../sections/PhilosophySection';
import { ServicesSection } from '../sections/ServicesSection';
import { ValuesSection } from '../sections/ValuesSection';
import { useAboutMotion } from '../hooks/useAboutMotion';
import { AboutBanner } from '../components/about/AboutBanner';
import { AboutIntroduction } from '../components/about/AboutIntroduction';
import { MissionVision } from '../components/about/MissionVision';
import { OurEvolution } from '../components/about/OurEvolution';
import '../styles/about.css';

export function AboutPage() {
  const media = useRef<HTMLDialogElement>(null);
  const main = useRef<HTMLElement>(null);
  useAboutMotion(main);
  return <>
    <PageMetadata title="About WER1 Group | Constructing Happiness" description="Our philosophy, expertise, values and approach to thoughtful real estate development." path="/about" />
    <a className="skip-link" href="#main">Skip to content</a>
    <Header currentPage="about" onMedia={() => media.current?.showModal()} />
    <main id="main" ref={main} className="wer1-about-page">
      <AboutBanner />
      <AboutIntroduction />
      <MissionVision />
      <OurEvolution />
      <PhilosophySection full /><div id="expertise"><ServicesSection full /></div><ValuesSection />
    </main><Footer /><MediaDialog dialogRef={media} />
  </>;
}
