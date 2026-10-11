import { useEffect, useRef, useState } from 'react';
import '../styles/animated-brand-headline.css';

type Phase = 'waiting' | 'enter' | 'hold' | 'exit' | 'done';
const TRANSITION_MS = 500;
const READING_MS = 2000;

export function AnimatedBrandHeadline({ id, phrases }: { id: string; phrases: readonly string[] }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const finalIndex = phrases.length - 1;
  const [step, setStep] = useState<{ index: number; phase: Phase; paused: boolean }>(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? { index: finalIndex, phase: 'done', paused: true }
      : { index: 0, phase: 'waiting', paused: true });

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supported = 'IntersectionObserver' in window;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = false;
    let running = false;
    let index = 0;
    let phase: Phase = 'waiting';
    let remaining = TRANSITION_MS;
    let deadline = 0;
    const publish = () => setStep({ index, phase, paused: !running });
    const pause = () => {
      if (running) remaining = Math.max(0, deadline - performance.now());
      clearTimeout(timer);
      running = false;
    };
    const sync = () => {
      if (motion.matches || !supported) {
        pause();
        index = finalIndex;
        phase = 'done';
        publish();
        return;
      }
      if (!visible || document.hidden) {
        pause();
        publish();
        return;
      }
      if (running) return;
      if (phase === 'waiting' || phase === 'done') {
        index = 0;
        phase = 'enter';
        remaining = TRANSITION_MS;
      }
      running = true;
      deadline = performance.now() + remaining;
      publish();
      timer = setTimeout(() => {
        running = false;
        if (phase === 'enter') {
          phase = 'hold';
          remaining = READING_MS;
        } else if (phase === 'hold') {
          phase = 'exit';
          remaining = TRANSITION_MS;
        } else {
          index = (index + 1) % (finalIndex + 1);
          phase = 'enter';
          remaining = TRANSITION_MS;
        }
        sync();
      }, remaining);
    };
    const observer = supported ? new IntersectionObserver(entries => {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    }, { threshold: 0 }) : undefined;
    const target = heading.current?.closest('section');
    if (target) observer?.observe(target);
    sync();
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [finalIndex]);

  return <h1 ref={heading} id={id} className="animated-brand-headline" aria-label={phrases[finalIndex]}>
    <span className="brand-headline-size" aria-hidden="true">{phrases[finalIndex]}</span>
    <span key={step.index} className={`brand-headline-phrase brand-headline-${step.phase}`} style={{ animationPlayState: step.paused ? 'paused' : 'running' }} aria-hidden="true">{phrases[step.index]}</span>
  </h1>;
}
