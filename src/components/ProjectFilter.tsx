import type { ProjectStatus } from '../data/projects';

export type ProjectCategory = 'All Projects' | ProjectStatus;
const categories: readonly ProjectCategory[] = ['All Projects', 'Completed', 'Ongoing', 'Upcoming'];

export function ProjectFilter({ active, onChange }: { active: ProjectCategory; onChange: (category: ProjectCategory) => void }) {
  return <div className="project-filter" role="group" aria-label="Filter projects">
    {categories.map(category => <button key={category} type="button" aria-pressed={category === active}
      aria-controls="project-grid" onClick={() => onChange(category)}>{category}</button>)}
  </div>;
}
