import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { CanvasTexture, SRGBColorSpace, type MeshBasicMaterial } from 'three';
import gsap from 'gsap';

export function useCardHover(imageHeight: number, panelHeight: number) {
  const { invalidate } = useThree();
  const amount = useMemo(() => ({ value: 0 }), []);
  const overlay = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = panelHeight;
    const context = canvas.getContext('2d')!;
    const gold = '#ead2a0'; // Champagne highlight from the hero's warm gold family.
    context.fillStyle = 'rgba(3, 5, 8, .72)';
    context.fillRect(0, 0, 1024, imageHeight);
    context.strokeStyle = gold;
    context.lineWidth = 3;
    context.strokeRect(28, 28, 968, panelHeight - 56);
    context.fillStyle = gold;
    context.font = '400 86px Georgia, "Times New Roman", serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('EXPLORE', 512, imageHeight / 2);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [imageHeight, panelHeight]);

  useEffect(() => () => { gsap.killTweensOf(amount); overlay.dispose(); }, [amount, overlay]);
  const fade = (value: number) => {
    gsap.to(amount, { value, duration: .28, ease: 'sine.inOut', overwrite: true, onUpdate: invalidate });
  };
  const onBeforeCompile: MeshBasicMaterial['onBeforeCompile'] = shader => {
    shader.uniforms.cardHover = amount;
    shader.uniforms.cardHoverMap = { value: overlay };
    shader.fragmentShader = 'uniform float cardHover; uniform sampler2D cardHoverMap;\n' + shader.fragmentShader;
    // Blend RGB only: the existing scroll opacity and scene depth remain authoritative.
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
      #include <map_fragment>
      #ifdef USE_MAP
        vec4 hoverColor = texture2D(cardHoverMap, vMapUv);
        diffuseColor.rgb = mix(diffuseColor.rgb, hoverColor.rgb, hoverColor.a * cardHover);
      #endif
    `);
  };
  return { onBeforeCompile, enter: () => fade(1), leave: () => fade(0) };
}
