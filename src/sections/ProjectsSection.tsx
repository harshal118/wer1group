import { useEffect, useState } from 'react';
import { readProjectFilter, updateProjectFilter, scrollToProjectListing } from '../navigation/projectFilters';
import { projects, type Project } from '../data/projects';
import { filterProjects } from '../utils/projectStats';
import { ProjectGrid } from '../components/ProjectGrid';
import { ProjectFilter, type ProjectCategory } from '../components/ProjectFilter';

export function ProjectsSection({ syncWithUrl = false, projectData = projects }: { syncWithUrl?: boolean; projectData?: readonly Project[] }) {
  const [category, setCategory] = useState<ProjectCategory>(() => syncWithUrl ? readProjectFilter() : 'All Projects');
  useEffect(() => {
    if (!syncWithUrl) return;
    let cancelled = false;
    let frame = 0;
    const sync = () => {
      setCategory(readProjectFilter());
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scrollToProjectListing);
    };
    sync();
    void document.fonts.ready.then(() => { if (!cancelled) scrollToProjectListing(); });
    window.addEventListener('popstate', sync);
    return () => { cancelled = true; cancelAnimationFrame(frame); window.removeEventListener('popstate', sync); };
  }, [syncWithUrl]);
  const changeCategory = (next: ProjectCategory) => {
    if (syncWithUrl) updateProjectFilter(next);
    else setCategory(next);
  };
  const visible = filterProjects(projectData, category === 'All Projects' ? undefined : category);
  return <section id="projects" className="homepage-section projects-section" aria-labelledby="projects-title">
    <div className="container"><div className="section-heading"><div><p className="eyebrow">Our projects</p>
      <h2 id="projects-title">Spaces taking shape.</h2></div>
      <ProjectFilter active={category} onChange={changeCategory} />
    </div>
    <p className="sr-only" role="status">{visible.length} {category === 'All Projects' ? 'projects' : `${category.toLowerCase()} projects`} displayed.</p>
    <ProjectGrid projects={visible} /></div>
  </section>;
}
