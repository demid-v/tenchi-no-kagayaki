"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { CraterShader } from "~/templates/shader/crater";
import { PlanetShader } from "~/templates/shader/planet";

export const DeadPlanet = ({
  position = [0, 0, 0],
  pixels = 100.0,
}: {
  position?: [number, number, number];
  pixels?: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock: { elapsedTime }, gl, scene, camera }) => {
    if (!groupRef.current) return;

    groupRef.current.children.forEach((planet) => {
      planet.lookAt(camera.position);
    });

    groupRef.current.children.forEach((planet) => {
      if (planet instanceof THREE.Mesh) {
        if (planet.material.uniforms.time === undefined) return;
        planet.material.uniforms.time.value = elapsedTime;
      }
    });

    gl.render(scene, camera);
  });

  return (
    <group ref={groupRef}>
      <mesh position={position}>
        <planeGeometry args={[1, 1]} />
        <PlanetShader pixels={pixels} />
      </mesh>
      <mesh position={position}>
        <planeGeometry args={[1, 1]} />
        <CraterShader pixels={pixels} />
      </mesh>
    </group>
  );
};
