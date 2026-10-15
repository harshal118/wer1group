import { useLayoutEffect, useRef, useState } from 'react';
import { updateProjectFilter } from '../navigation/projectFilters';
import '../styles/projects-navigation.css';

const options = [
  { label: 'All Projects', filter: 'all' },
  { label: 'Completed', filter: 'completed' },
  { label: 'Upcoming', filter: 'upcoming' },
] as const;

export function ProjectsNavigation({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const focusFirstOnOpen = useRef(false);
  useLayoutEffect(() => {
    if (open && focusFirstOnOpen.current) {
      focusFirstOnOpen.current = false;
      container.current?.querySelector('a')?.focus();
    }
  }, [open]);
  const desktopPointer = () => window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 769px)').matches;
  return <div className="projects-navigation" ref={container}
    onPointerEnter={() => { if (desktopPointer()) setOpen(true); }}
    onPointerLeave={() => { if (!container.current?.contains(document.activeElement)) setOpen(false); }}
    onFocus={event => { if (desktopPointer() && !event.currentTarget.contains(event.relatedTarget)) setOpen(true); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => {
      if (event.key === 'Escape' && open) {
        event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus();
      }
      if (event.key === 'ArrowDown' && event.target === trigger.current) {
        event.preventDefault();
        if (open) container.current?.querySelector('a')?.focus();
        else { focusFirstOnOpen.current = true; setOpen(true); }
      }
    }}>
    <button ref={trigger} type="button" aria-expanded={open} aria-controls="projects-navigation-options"
      aria-current={active ? 'page' : undefined}
      onClick={event => { event.stopPropagation(); setOpen(desktopPointer() ? true : !open); }}>
      Projects <span className="chevron" aria-hidden="true" />
    </button>
    <ul id="projects-navigation-options" className="projects-navigation-options" hidden={!open} aria-label="Projects">
      {options.map(option => <li key={option.filter}><a href={`/projects?filter=${option.filter}`} onClick={event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (window.location.pathname.replace(/\/$/, '') === '/projects') {
          event.preventDefault(); updateProjectFilter(option.label);
        }
        setOpen(false);
      }}>{option.label}</a></li>)}
    </ul>
  </div>;
}
