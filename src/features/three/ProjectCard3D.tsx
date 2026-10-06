import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { CanvasTexture, DoubleSide, Group, MeshBasicMaterial, PerspectiveCamera, Quaternion, SRGBColorSpace, TextureLoader, Vector3 } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cardLayout } from './cardLayout';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { scrollToSection } from '../../lib/projectNavigation';
import { useCardHover } from './useCardHover';
import type { Project } from '../../data/projects';

gsap.registerPlugin(ScrollTrigger);

export function ProjectCard3D({ project, scrollContainer }: { project: Project; scrollContainer: RefObject<HTMLDivElement | null> }) {
  const [source] = useLoader(TextureLoader, project.image ? [project.image] : []);
  const { camera, size, invalidate, gl } = useThree();
  const panel = useRef<Group>(null);
  const material = useRef<MeshBasicMaterial>(null);
  const [texture, setTexture] = useState<CanvasTexture | null>(null);

  const compact = size.width < 1024;
  const touch = useMediaQuery('(hover: none)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const image = source?.image as HTMLImageElement | undefined;
  const imageHeight = 1024 * project.imageHeight / project.imageWidth;
  const panelHeight = Math.ceil(imageHeight + (compact ? 510 : 442));
  const hover = useCardHover(imageHeight, panelHeight);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = panelHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = '#080c10';
    context.fillRect(0, 0, 1024, panelHeight);
    // Preserve the entire extracted architectural render, with no page graphics or cropping.
    if (image) context.drawImage(image, 0, 0, 1024, imageHeight);
    else {
      context.fillStyle = '#cbb58e';
      context.font = '400 68px Arial, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('COMING SOON', 512, imageHeight / 2);
      context.textAlign = 'start';
      context.textBaseline = 'alphabetic';
    }
    context.fillStyle = '#cbb58e';
    context.fillRect(60, imageHeight + 42, 76, 3);
    context.fillStyle = '#ead2a0';
    context.font = compact ? '500 88px Arial, sans-serif' : '500 76px Arial, sans-serif';
    if (compact && context.measureText(project.name).width > 904) context.font = `500 ${88 * 904 / context.measureText(project.name).width}px Arial, sans-serif`;
    context.fillText(project.name, 60, imageHeight + 133);
    context.font = compact ? '64px Arial, sans-serif' : '50px Arial, sans-serif';
    context.fillStyle = '#d5cbb9';
    context.fillText(project.location, 60, imageHeight + (compact ? 218 : 203));
    context.fillText(project.type, 60, imageHeight + (compact ? 300 : 267));
    context.font = compact ? '62px Arial, sans-serif' : '48px Arial, sans-serif';
    context.fillStyle = '#cbb58e';
    context.fillText(project.status, 60, imageHeight + (compact ? 402 : 365));
    context.strokeStyle = '#b4a78d';
    context.lineWidth = 3;
    context.strokeRect(1.5, 1.5, 1021, panelHeight - 3);
    if (touch) {
      // A persistent cue makes the existing tap action discoverable without hover.
      context.fillStyle = 'rgba(3, 5, 8, .72)';
      context.fillRect(658, imageHeight - 106, 338, 78);
      context.fillStyle = '#ead2a0';
      context.font = '400 48px Georgia, serif';
      context.fillText('EXPLORE', 690, imageHeight - 52);
    }
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    result.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
    setTexture(result);
    return () => result.dispose();
  }, [image, imageHeight, panelHeight, project, gl, compact, touch]);

  useLayoutEffect(() => {
    const group = panel.current;
    const surface = material.current;
    const container = scrollContainer.current;
    if (!group || !surface || !container || !texture || !(camera instanceof PerspectiveCamera)) return;

    // Work in the fixed camera's coordinate frame, independent of the static logo centerpiece.
    const orientation = camera.quaternion.clone();
    const right = new Vector3(1, 0, 0).applyQuaternion(orientation);
    const up = new Vector3(0, 1, 0).applyQuaternion(orientation);
    const forward = new Vector3(0, 0, 1).applyQuaternion(orientation);
    const axis = new Vector3(0, 1, 0);
    const yaw = new Quaternion();
    const distance = camera.position.length();
    const displayDepth = 4;
    const side = project.side === 'left' ? -1 : 1;
    const layout = cardLayout({ width: size.width, height: size.height, distance, fov: camera.fov,
      side, wide: project.format === 'wide', aspect: panelHeight / 1024 });
    const state = { x: layout.enterX, y: layout.enterY, z: layout.enterZ, yaw: layout.enterYaw, scale: .82, opacity: 0 };
    const [start, end] = project.scrollRange;
    const span = end - start;
    const at = (fraction: number) => start + span * fraction;
    const apply = () => {
      group.position.copy(right).multiplyScalar(state.x).addScaledVector(up, state.y).addScaledVector(forward, state.z);
      group.quaternion.copy(orientation).multiply(yaw.setFromAxisAngle(axis, state.yaw));
      group.scale.setScalar(layout.width * state.scale);
      surface.opacity = state.opacity;
      group.visible = state.opacity > .001;
      invalidate();
    };
    const timeline = gsap.timeline({
      onUpdate: apply,
      scrollTrigger: {
        id: `${project.id}-card`, trigger: container, start: 'top top', end: 'bottom bottom', scrub: true,
      },
    });
    if (reducedMotion) {
      Object.assign(state, { x: layout.x, y: layout.y, z: displayDepth, yaw: 0, scale: 1 });
      timeline.to(state, { opacity: 1, duration: span * .18, ease: 'none' }, at(0))
        .to(state, { opacity: 0, duration: span * .13, ease: 'none' }, at(.87))
        .to({}, { duration: 1 - end }, end);
    } else timeline
      .to(state, { x: layout.approachX, y: layout.approachY, z: -3, yaw: layout.approachYaw, scale: .92, opacity: 1, duration: span * .18, ease: 'sine.inOut' }, at(0))
      .to(state, { x: layout.x, y: layout.y, z: displayDepth, yaw: 0, scale: 1, duration: span * .27, ease: 'sine.inOut' }, at(.18))
      // The middle 28% of each card's range is motionless and readable.
      .to(state, { z: -5, yaw: -side * (compact ? .18 : .32), scale: .95, duration: span * .11, ease: 'sine.inOut' }, at(.73))
      .to(state, { x: layout.exitX, y: layout.exitY, z: -9, yaw: layout.exitYaw, scale: .84, duration: span * .16, ease: 'sine.inOut' }, at(.84))
      .to(state, { opacity: 0, duration: span * .13, ease: 'sine.in' }, at(.87))
      // Keep a one-second global timeline, including the clean ending after the last card.
      .to({}, { duration: 1 - end }, end);
    apply();
    return () => { timeline.scrollTrigger?.kill(); timeline.kill(); };
  }, [texture, camera, size, scrollContainer, invalidate, project, panelHeight, compact, reducedMotion]);

  return <group ref={panel} name={`${project.id}-project-card`} visible={false}>
    <mesh onClick={event => { event.stopPropagation(); scrollToSection(`project-${project.id}`); }} onPointerOver={event => { event.stopPropagation(); if (!touch) hover.enter(); }} onPointerOut={hover.leave}>
      <planeGeometry args={[1, panelHeight / 1024]}/>
      <meshBasicMaterial onBeforeCompile={hover.onBeforeCompile} customProgramCacheKey={() => "project-card-hover"} ref={material} map={texture} transparent opacity={0} depthTest depthWrite={false} side={DoubleSide} toneMapped={false} fog={false}/>
    </mesh>
  </group>;
}
