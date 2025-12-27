import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const useRotation = (
  object: React.RefObject<THREE.Group | null>,
  radius: number,
  period: number,
  relativeSpeed: number,
  eccentricity: number,
  orbitAngle: number,
) => {
  useFrame(({ clock: { elapsedTime } }) => {
    if (!object.current) return;

    const speed = relativeSpeed / Math.pow(radius / 100, 2);

    const c = Math.cos(orbitAngle);
    const s = Math.sin(orbitAngle);

    const x0 = Math.cos(period + elapsedTime * speed) * radius;
    const y0 = Math.sin(period + elapsedTime * speed) * (radius - eccentricity);

    object.current.position.x = x0 * c - y0 * s;
    object.current.position.y = y0 * c + x0 * s;
  });
};

export default useRotation;
