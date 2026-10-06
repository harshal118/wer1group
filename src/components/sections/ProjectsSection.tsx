import { projects } from '../../data/projects';

export function ProjectsSection() {
  return <section className="projects-section editorial-section" id="projects" tabIndex={-1} aria-labelledby="projects-title">
    <p className="section-eyebrow">OUR PROJECTS</p>
    <h2 id="projects-title">Places taking shape.</h2>
    <div className="project-details">
      {projects.map((project, index) => <article className="project-detail" id={`project-${project.id}`} key={project.id}
        tabIndex={-1} aria-labelledby={`title-${project.id}`}>
        <figure className="project-detail-image">
          {project.image ? <img src={project.image} width={project.imageWidth} height={project.imageHeight} alt={`${project.name} architectural render`} loading="lazy" decoding="async"/> : <div className="project-coming-soon" style={{ aspectRatio: `${project.imageWidth} / ${project.imageHeight}` }}>COMING SOON</div>}
        </figure>
        <div className="project-detail-copy">
          <p className="section-eyebrow">{String(index + 1).padStart(2, '0')} / {project.phase}</p>
          <h3 id={`title-${project.id}`}>{project.name}</h3>
          <p className="project-detail-location">{project.location}</p>
          <p>{project.type}</p>
          <p className="project-detail-status">{project.phase === 'Completed' ? `Completed · ${project.status}` : project.launch ? `Launch · ${project.launch}` : project.status}</p>
          {project.details && <p className="project-description">{project.details}</p>}
          {project.areas && <dl className="project-areas">{project.areas.map(area => <div key={area.label}>
            <dt>{area.label}</dt><dd>Approx. {area.value} sq. ft.</dd>
          </div>)}</dl>}
        </div>
      </article>)}
    </div>
  </section>;
}
