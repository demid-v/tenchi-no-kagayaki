"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

import { Planet as PlanetMaterial } from "~/templates/Shader/planet";

export const Planet = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    const geometry = meshRef.current.geometry;
    geometry.computeTangents();
  }, []);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 128, 128]} />
      <PlanetMaterial />
    </mesh>
  );
};
