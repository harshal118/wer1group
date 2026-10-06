import { WhatWeDoSection } from './components/sections/WhatWeDoSection';
import { TeamSection } from './components/sections/TeamSection';
import { WhyChooseSection } from './components/sections/WhyChooseSection';
import { ContactSection } from './components/sections/ContactSection';
import './styles/company.css';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { Header } from './components/layout/Header';
import './styles/sections.css';
import { useRef } from 'react';
import { HERO_IMAGE } from './features/three/HeroImage';
import { LogoScene } from './features/three/LogoScene';

export default function App() {
  const scrollContainer = useRef<HTMLDivElement>(null);
  return <>
    <Header/>
    <main>
    <div ref={scrollContainer} className="scroll-container" id="home" tabIndex={-1}>
    <div className="hero-viewport">
    <div className="hero-image-stage"><img className="hero-image" width={1672} height={941} src={HERO_IMAGE} alt="WER1 GROUP gold logo on a dark presentation platform"/></div>
    <div className="fixed-canvas"><LogoScene scrollContainer={scrollContainer}/></div>
    </div>
    </div>
    <div className="editorial-content">
      <AboutSection/>
      <WhatWeDoSection/>
      <TeamSection/>
      <WhyChooseSection/>
      <ProjectsSection/>
      <ContactSection/>
      <footer className="end-signature">WER1 INFRA · CONSTRUCTING HAPPINESS</footer>
    </div>
    </main>
  </>;
}
