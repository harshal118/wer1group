import { expect, test } from '@playwright/test';
import { projects } from '../src/data/projects';
import { filterProjects, getProjectStats, getPublicProjects, type PublicProjectRecord } from '../src/utils/projectStats';

test('current public portfolio has stable IDs, approved order and 3/2/1 counts', () => {
  expect(getProjectStats(projects)).toEqual({ completed: 3, ongoing: 2, upcoming: 1 });
  expect(new Set(projects.map(project => project.id)).size).toBe(projects.length);
  expect(filterProjects(projects, 'Ongoing').map(project => project.id)).toEqual(['marunji', 'chinchwad']);
  expect(getPublicProjects([...projects].reverse())).toEqual(projects);
});

test('empty list has zero counts', () => {
  expect(getProjectStats([])).toEqual({ completed: 0, ongoing: 0, upcoming: 0 });
});

test('three completed records count independently of dates', () => {
  expect(getProjectStats([{ status: 'Completed' }, { status: 'Completed' }, { status: 'Completed' }]))
    .toEqual({ completed: 3, ongoing: 0, upcoming: 0 });
});

test('status changes move records between counts and filters', () => {
  const updated = projects.map(project => project.id === 'punawale' ? { ...project, status: 'Ongoing' as const } : project);
  expect(getProjectStats(updated)).toEqual({ completed: 3, ongoing: 3, upcoming: 0 });
  expect(filterProjects(updated, 'Upcoming')).toEqual([]);
  expect(filterProjects(updated, 'Ongoing').map(project => project.id)).toEqual(['marunji', 'punawale', 'chinchwad']);
});

test('adding and removing records updates the appropriate category', () => {
  const added: PublicProjectRecord[] = [...projects, { status: 'Upcoming' }];
  expect(getProjectStats(added)).toEqual({ completed: 3, ongoing: 2, upcoming: 2 });
  expect(getProjectStats(projects.filter(project => project.id !== 'aikyam')))
    .toEqual({ completed: 2, ongoing: 2, upcoming: 1 });
});

test('hidden and draft records are excluded from public counts and listings', () => {
  const records = projects.map((project, index) => ({ ...project,
    publicationStatus: index === 0 ? 'hidden' as const : index === 1 ? 'draft' as const : 'published' as const,
  }));
  expect(getProjectStats(records)).toEqual({ completed: 1, ongoing: 2, upcoming: 1 });
  expect(filterProjects(records, 'Completed').map(project => project.id)).toEqual(['aikyam']);
  expect(getPublicProjects(records)).toHaveLength(4);
  expect(records).toHaveLength(6);
});
