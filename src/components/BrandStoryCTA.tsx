import { useLayoutEffect, useRef, useState } from 'react';

export function BrandStoryCTA({ href = '/about', label = 'Discover the WER1 Story' }: { href?: string; label?: string }) {
  const link = useRef<HTMLAnchorElement>(null);
  const [size, setSize] = useState({ width: 300, height: 56 });
  useLayoutEffect(() => {
    const element = link.current;
    if (!element) return;
    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      setSize(previous => previous.width === width && previous.height === height ? previous : { width, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const { width: w, height: h } = size;
  // Start at the upper-left and trace top → right → bottom → left.
  const outline = `M3 .75 H${w - 3} Q${w - .75} .75 ${w - .75} 3 V${h - 3} Q${w - .75} ${h - .75} ${w - 3} ${h - .75} H3 Q.75 ${h - .75} .75 ${h - 3} V3 Q.75 .75 3 .75 Z`;
  return <a ref={link} className="button brand-story-button" href={href}>
    <svg className="brand-story-border" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={outline} pathLength="1" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
    <span>{label}</span>
    <svg className="brand-story-arrow" aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 19 19 5M5 5h14v14" /></svg>
  </a>;
}
