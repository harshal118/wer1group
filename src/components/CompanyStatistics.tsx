import { useEffect, useRef, useState } from 'react';
import { company } from '../data/company';
import { projects, type Project } from '../data/projects';
import { getProjectStats } from '../utils/projectStats';

const START_YEAR = company.foundedYear;
const getYearsOfExperience = () =>
  Math.max(1, new Date().getFullYear() - START_YEAR + 1);

export function CompanyStatistics({ projectData = projects }: { projectData?: readonly Project[] }) {
  const counts = getProjectStats(projectData);
  const statistics = [
    { label: 'Year Founded', value: company.foundedYear },
    { label: 'Completed Projects', value: counts.completed },
    { label: 'Ongoing Projects', value: counts.ongoing },
    { label: 'Upcoming Project', value: counts.upcoming },
  ];
  const container = useRef<HTMLDListElement>(null);
  const [yearsOfExperience, setYearsOfExperience] = useState(getYearsOfExperience);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showFinalValues, setShowFinalValues] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const maximumTarget = Math.max(yearsOfExperience, ...statistics.slice(1).map(statistic => statistic.value));

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => {
      // Once skipped, keep final values visible even if the preference changes back.
      if (motion.matches) setShowFinalValues(true);
    };
    updateMotion();
    motion.addEventListener('change', updateMotion);
    return () => motion.removeEventListener('change', updateMotion);
  }, []);

  useEffect(() => {
    if (started || showFinalValues) return;
    if (!('IntersectionObserver' in window)) {
      setShowFinalValues(true);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setStarted(true);
        observer.disconnect();
      }
    });
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, [started, showFinalValues]);

  useEffect(() => {
    if (!started || showFinalValues || finished) return;
    if (step >= maximumTarget) {
      setFinished(true);
      return;
    }
    // One shared tick advances every counter; completed counters stay capped.
    const timer = setTimeout(() => setStep(value => value + 1), 600);
    return () => clearTimeout(timer);
  }, [started, showFinalValues, finished, step, maximumTarget]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      setYearsOfExperience(getYearsOfExperience());
      const now = new Date();
      const nextYear = new Date(now.getFullYear() + 1, 0, 1);
      // Recheck daily to avoid timer overflow, then refresh at local New Year's midnight.
      timer = setTimeout(refresh, Math.min(86_400_000, nextYear.getTime() - now.getTime()));
    };
    refresh();
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  const displayedStatistics = [
    statistics[0],
    { label: 'Years of Experience', value: yearsOfExperience },
    ...statistics.slice(1),
  ];

  return <dl ref={container} className="company-statistics" aria-label="Company statistics">
    {displayedStatistics.map((statistic, index) => <div key={statistic.label}>
      <dt>{statistic.label}</dt>
      <dd>{index === 0 || showFinalValues || finished ? statistic.value : Math.min(step, statistic.value)}</dd>
    </div>)}
  </dl>;
}
