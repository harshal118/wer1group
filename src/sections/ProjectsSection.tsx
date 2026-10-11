import { useState } from 'react';
import { projects } from '../data/projects';
import { ProjectGrid } from '../components/ProjectGrid';
import { ProjectFilter, type ProjectCategory } from '../components/ProjectFilter';

export function ProjectsSection() {
  const [category, setCategory] = useState<ProjectCategory>('All Projects');
  const visible = category === 'All Projects' ? projects : projects.filter(project => project.status === category);
  return <section id="projects" className="homepage-section projects-section" aria-labelledby="projects-title">
    <div className="container"><div className="section-heading"><div><p className="eyebrow">Our projects</p>
      <h2 id="projects-title">Spaces taking shape.</h2></div>
      <ProjectFilter active={category} onChange={setCategory} />
    </div>
    <p className="sr-only" role="status">{visible.length} {category === 'All Projects' ? 'projects' : `${category.toLowerCase()} projects`} displayed.</p>
    <ProjectGrid projects={visible} /></div>
  </section>;
}
