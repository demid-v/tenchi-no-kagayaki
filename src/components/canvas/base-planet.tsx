"use client";

import { Color } from "three";

export const BasePlanet = () => {
  const color = new Color().setColorName("grey");

  return (
    <mesh>
      <sphereGeometry args={[1, 100, 100]} />
      <meshPhysicalMaterial color={color} />
    </mesh>
  );
};
