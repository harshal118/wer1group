import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { Shape, ShapeGeometry, SRGBColorSpace, TextureLoader, PerspectiveCamera, Mesh, Vector3 } from 'three';

export const HERO_IMAGE = '/images/hero/Luxurious_WER1_Group_Gold_Logo.webp';

// Outline of the supplied lettering/platform, in original image pixels. This only
// controls card occlusion; the complete, unmodified image remains visible beneath.
const outline = [[143,529],[338,462],[296,342],[365,322],[410,351],[445,298],[514,276],[549,306],[584,259],[646,241],[672,266],[672,239],[839,190],[881,215],[872,183],[998,149],[1078,177],[1088,163],[1143,113],[1181,104],[1230,127],[1222,357],[1457,485],[1457,575],[511,885],[145,606]];

export function HeroImageOccluder() {
  const mesh = useRef<Mesh>(null);
  const texture = useLoader(TextureLoader, HERO_IMAGE);
  const { camera, size, gl } = useThree();
  texture.colorSpace = SRGBColorSpace;
  const geometry = useMemo(() => {
    const shape = new Shape();
    outline.forEach(([x, y], index) => {
      const u = x / 1672 - .5;
      const v = .5 - y / 941;
      if (index === 0) shape.moveTo(u, v); else shape.lineTo(u, v);
    });
    shape.closePath();
    const result = new ShapeGeometry(shape);
    const positions = result.getAttribute('position');
    const uv = result.getAttribute('uv');
    for (let i = 0; i < positions.count; i++) uv.setXY(i, positions.getX(i) + .5, positions.getY(i) + .5);
    return result;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera) || !mesh.current) return;
    let imageWidth = Math.min(size.width * .78, 1180, size.height * .8 * 1672 / 941);
    let offsetX = 0;
    let offsetY = 0;
    if (size.width < 1024) {
      const image = document.querySelector('.hero-image')?.getBoundingClientRect();
      const canvas = gl.domElement.getBoundingClientRect();
      if (image) {
        imageWidth = image.width;
        offsetX = image.left + image.width / 2 - canvas.left - size.width / 2;
        offsetY = size.height / 2 - (image.top + image.height / 2 - canvas.top);
      }
    }
    const worldPerPixel = 2 * camera.position.length() * Math.tan(camera.fov * Math.PI / 360) / size.height;
    mesh.current.position.copy(new Vector3(offsetX * worldPerPixel, offsetY * worldPerPixel, 0).applyQuaternion(camera.quaternion));
    mesh.current.quaternion.copy(camera.quaternion);
    mesh.current.scale.set(imageWidth * worldPerPixel, imageWidth * 941 / 1672 * worldPerPixel, 1);
  }, [camera, size, gl]);
  return <mesh ref={mesh} name="static-image-occluder" geometry={geometry}>
    <meshBasicMaterial map={texture} toneMapped={false}/>
  </mesh>;
}
