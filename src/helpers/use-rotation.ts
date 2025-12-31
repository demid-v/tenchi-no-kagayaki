import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useState } from "react";
import * as THREE from "three";

const useRotation = (
  object: React.RefObject<THREE.Group | null>,
  radius: number,
  period: number,
  relativeSpeed: number,
  eccentricity: number,
  orbitAngle: number,
) => {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

  useLayoutEffect(() => {
    const c = Math.cos(orbitAngle);
    const s = Math.sin(orbitAngle);

    const x0 = Math.cos(period) * radius;
    const y0 = Math.sin(period) * (radius - eccentricity);

    setPosition([x0 * c - y0 * s, y0 * c + x0 * s, 0]);
  }, []);

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

  return position;
};

export default useRotation;
