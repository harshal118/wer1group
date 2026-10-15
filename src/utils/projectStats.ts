import type { ProjectStatus } from '../data/projects';

export interface PublicProjectRecord {
  status: ProjectStatus;
  publicationStatus?: 'published' | 'draft' | 'hidden';
}

// Existing records without a publication flag remain public.
export function isPublicProject(project: Pick<PublicProjectRecord, 'publicationStatus'>): boolean {
  return project.publicationStatus === undefined || project.publicationStatus === 'published';
}

export function getPublicProjects<T extends PublicProjectRecord & { displayOrder: number }>(projects: readonly T[]): T[] {
  return projects.filter(isPublicProject).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function filterProjects<T extends PublicProjectRecord & { displayOrder: number }>(projects: readonly T[], status?: ProjectStatus): T[] {
  return getPublicProjects(projects).filter(project => status === undefined || project.status === status);
}

export function getProjectStats(projects: readonly PublicProjectRecord[]) {
  const counts = { completed: 0, ongoing: 0, upcoming: 0 };
  for (const project of projects) {
    if (!isPublicProject(project)) continue;
    switch (project.status) {
      case 'Completed': counts.completed++; break;
      case 'Ongoing': counts.ongoing++; break;
      case 'Upcoming': counts.upcoming++; break;
    }
  }
  return counts;
}
