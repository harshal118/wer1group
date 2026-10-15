import type { ProjectCategory } from '../components/ProjectFilter';

const filters: Record<string, ProjectCategory> = {
  all: 'All Projects', completed: 'Completed', ongoing: 'Ongoing', upcoming: 'Upcoming',
};
export function readProjectFilter(): ProjectCategory {
  const value = new URLSearchParams(window.location.search).get('filter') ?? 'all';
  return Object.prototype.hasOwnProperty.call(filters, value) ? filters[value] : 'All Projects';
}
export function updateProjectFilter(category: ProjectCategory) {
  const value = Object.keys(filters).find(key => filters[key] === category) ?? 'all';
  const url = new URL(window.location.href);
  url.searchParams.set('filter', value);
  url.hash = '';
  if (url.href !== window.location.href) window.history.pushState(null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
export function scrollToProjectListing() {
  document.getElementById('projects')?.scrollIntoView({ behavior: 'instant', block: 'start' });
}
