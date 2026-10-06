import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { MathUtils, PerspectiveCamera } from 'three';

export function FixedCamera() {
  const { camera, size, invalidate } = useThree();
  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    // Fixed reference-inspired diagonal view. No scroll or frame-loop attachment.
    const pitch = MathUtils.degToRad(30);
    const azimuth = MathUtils.degToRad(-28);
    const distance = Math.max(31, 31 * 1.3 / (size.width / size.height));
    camera.position.set(Math.sin(azimuth) * Math.cos(pitch), Math.sin(pitch), Math.cos(azimuth) * Math.cos(pitch)).multiplyScalar(distance);
    camera.near = .1;
    camera.far = 150;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);

  return null;
}
