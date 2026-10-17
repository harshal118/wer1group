import { completionLabel, type Project } from '../data/projects';

export function ProjectFacts({ project }: { project: Project }) {
  return <dl className="project-facts">
    <div><dt>Project type</dt><dd>{project.projectType ?? 'Details Coming Soon'}</dd></div>
    <div><dt>{completionLabel(project)}</dt><dd>{project.completionYear}</dd></div>
    <div><dt>Location</dt><dd>{project.location}</dd></div>
    <div><dt>Land Area</dt><dd>{project.landArea ?? 'Details Coming Soon'}</dd></div>
    <div><dt>Total Units</dt><dd>{project.totalUnits ?? 'Details Coming Soon'}</dd></div>
    {project.residentialSpace && <div><dt>Residential Space</dt><dd>{project.residentialSpace}</dd></div>}
    {project.commercialSpace && <div><dt>Commercial Space</dt><dd>{project.commercialSpace}</dd></div>}
  </dl>;
}
