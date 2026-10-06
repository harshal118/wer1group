import { Component, Suspense, type ReactNode, type RefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { FixedCamera } from './FixedCamera';
import { HeroImageOccluder } from './HeroImage';
import { ProjectCards3D } from './ProjectCards3D';

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div className="model-status">Unable to display the 3D presentation.</div> : this.props.children;
  }
}

export function LogoScene({ scrollContainer }: { scrollContainer: RefObject<HTMLDivElement | null> }) {
  const compact = useMediaQuery('(max-width: 1023px)');
  return <SceneBoundary><Canvas dpr={[1, compact ? 1.25 : 1.5]} frameloop="demand"
    camera={{ fov: 32, near: .1, far: 150 }} gl={{ antialias: true, alpha: true }}>
    <FixedCamera/>
    <Suspense fallback={null}><HeroImageOccluder/></Suspense>
    <ProjectCards3D scrollContainer={scrollContainer}/>
  </Canvas></SceneBoundary>;
}
