import { useState } from 'react';
import type { Project } from '../data/projects';

export function ProjectMedia({ project, priority = false, className = '', imageMode = 'responsive' }: {
  project: Project; priority?: boolean; className?: string; imageMode?: 'responsive' | 'landscape';
}) {
  const [failed, setFailed] = useState(false);
  if (project.isComingSoonPlaceholder || !project.images[0] || failed) {
    return <div className={`hero-placeholder ${className}`} role="img" aria-label={`${project.name} — ${project.isComingSoonPlaceholder ? 'Coming soon' : 'Project image unavailable'}`}>
      {project.isComingSoonPlaceholder ? <div className="coming-soon-copy"><span>Coming soon</span><strong>{project.name}</strong><small>Expected Completion {project.completionYear}</small></div> : <span>Image forthcoming</span>}
    </div>;
  }
  return <picture>
    {project.landscapeImage && <source media={imageMode === 'landscape' ? undefined : '(min-width: 769px)'} srcSet={project.landscapeImage.src} width={project.landscapeImage.width} height={project.landscapeImage.height} />}
    <img className={`hero-image ${className}`} src={project.images[0]} width={project.width} height={project.height}
    alt={project.alt} fetchPriority={priority ? 'high' : 'low'} loading={priority ? 'eager' : 'lazy'}
    decoding="async" style={{ objectPosition: project.position }} onError={() => setFailed(true)} />
  </picture>;
}
