import { Suspense, useLayoutEffect, useState, type RefObject } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, type Project } from '../../data/projects';
import { ProjectCard3D } from './ProjectCard3D';

export function ProjectCards3D({ scrollContainer }: { scrollContainer: RefObject<HTMLDivElement | null> }) {
  const [nearby, setNearby] = useState<readonly Project[]>([projects[0]]);
  useLayoutEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;
    let previous = '';
    const sync = (self: ScrollTrigger) => {
      // Prepare only the current/approaching cards; release generated GPU textures on exit.
      const next = projects.filter((project, index) =>
        self.progress >= (index === 0 ? 0 : project.scrollRange[0] - .06)
        && self.progress <= project.scrollRange[1] + .01);
      const key = next.map(project => project.id).join(',');
      if (key !== previous) { previous = key; setNearby(next); }
    };
    const trigger = ScrollTrigger.create({
      id: 'project-card-window', trigger: container, start: 'top top', end: 'bottom bottom',
      onUpdate: sync, onRefresh: sync,
    });
    sync(trigger);
    return () => trigger.kill();
  }, [scrollContainer]);
  return <>{nearby.map(project => <Suspense key={project.id} fallback={null}>
    <ProjectCard3D project={project} scrollContainer={scrollContainer}/>
  </Suspense>)}</>;
}
