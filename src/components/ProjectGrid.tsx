import type { Project } from '../data/projects';
import { ProjectCard } from './ProjectCard';

export function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  return <div className="project-grid" id="project-grid">{projects.map(project => <ProjectCard key={project.id} project={project} />)}</div>;
}
