import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";

const useRotation = (
  object: React.RefObject<THREE.Group | null>,
  radius: number,
  period: number,
  relativeSpeed: number,
  eccentricity: number,
  orbitAngle: number,
) => {
  const c = Math.cos(orbitAngle);
  const s = Math.sin(orbitAngle);

  const x0 = Math.cos(period) * radius;
  const y0 = Math.sin(period) * (radius - eccentricity);

  const [position, _setPosition] = useState<[number, number, number]>([
    x0 * c - y0 * s,
    y0 * c + x0 * s,
    0,
  ]);

  useFrame(({ clock: { elapsedTime } }) => {
    if (!object.current) return;

    const speed = relativeSpeed / Math.pow(radius / 50, 2);

    const c = Math.cos(orbitAngle);
    const s = Math.sin(orbitAngle);

    const x0 = Math.cos(period + elapsedTime * speed) * radius;
    const y0 = Math.sin(period + elapsedTime * speed) * (radius - eccentricity);

    object.current.position.setX(x0 * c - y0 * s);
    object.current.position.setY(y0 * c + x0 * s);
  });

  return position;
};

export default useRotation;
