import { useLayoutEffect, useRef, useState } from 'react';
import '../styles/clockwise-border.css';

// Shared CTA outline: measure the host so the stroke and corner radius stay constant.
export function ClockwiseBorder({ className = '' }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 300, height: 56 });
  useLayoutEffect(() => {
    const element = svg.current?.parentElement;
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
  return <svg ref={svg} className={`clockwise-border ${className}`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path d={outline} pathLength="1" fill="none" vectorEffect="non-scaling-stroke" />
  </svg>;
}
