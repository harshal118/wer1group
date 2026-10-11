import { completionLabel, type Project } from '../data/projects';

export function ProjectFacts({ project }: { project: Project }) {
  return <dl className="project-facts">
    <div><dt>Project type</dt><dd>{project.projectType ?? 'Details Coming Soon'}</dd></div>
    <div><dt>{completionLabel(project)}</dt><dd>{project.completionYear}</dd></div>
    <div><dt>Location</dt><dd>{project.location}</dd></div>
    <div><dt>Land area</dt><dd>{project.landArea ?? 'Details Coming Soon'}</dd></div>
    <div><dt>Total units</dt><dd>{project.totalUnits ?? 'Details Coming Soon'}</dd></div>
  </dl>;
}
