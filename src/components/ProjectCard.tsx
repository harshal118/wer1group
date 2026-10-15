import type { Project } from '../data/projects';
import { ProjectFacts } from './ProjectFacts';
import { ProjectMedia } from './ProjectMedia';
import { Arrow } from './Arrow';
import { ClockwiseBorder } from './ClockwiseBorder';

export function ProjectCard({ project }: { project: Project }) {
  return <article className="project-card" data-project-id={project.id} aria-labelledby={`card-${project.id}`}>
    <ClockwiseBorder className="project-card-border" />
    <div className="project-card-visual"><ProjectMedia project={project} />
      <span className="project-status">{project.status}</span>
    </div>
    <div className="project-card-copy"><h3 id={`card-${project.id}`}>{project.name}</h3>
      <p className="project-description">{project.description}</p>
      <ProjectFacts project={project} />
      {project.detailPath && <a className="text-button" href={project.detailPath}>View details<Arrow /></a>}
    </div>
  </article>;
}
