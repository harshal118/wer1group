import { company } from '../data/company';
import { homepage } from '../data/homepage';
import { projects } from '../data/projects';
import { ProjectMedia } from '../components/ProjectMedia';
import { Arrow } from '../components/Arrow';

export function PhilosophySection({ full = false }: { full?: boolean }) {
  const project = projects.find(project => project.id === 'sinclair-place');
  if (!full) return <section id="philosophy" className="homepage-section philosophy-section" aria-labelledby="philosophy-title"><div className="container story-layout">
    {project && <figure className="story-image"><div className="story-image-frame"><ProjectMedia project={project} /></div><figcaption>{project.name}<span>{project.location} · {project.completionYear}</span></figcaption></figure>}
    <div className="story-copy"><p className="eyebrow">Our philosophy</p><h2 id="philosophy-title">{company.philosophy.heading}</h2><p>{homepage.philosophy}</p><a className="text-button" href="/about#philosophy">Our purpose and principles<Arrow /></a></div>
  </div></section>;
  return <section id="philosophy" className="homepage-section philosophy-section" aria-labelledby="philosophy-title"><div className="container editorial-layout">
    <div><p className="eyebrow">Our philosophy</p><h2 id="philosophy-title">{company.philosophy.heading}</h2></div>
    <div className="editorial-copy">{company.philosophy.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
  </div></section>;
}
