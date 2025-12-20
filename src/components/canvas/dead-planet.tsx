"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { CraterShader } from "~/templates/shader/crater";
import { PlanetShader } from "~/templates/shader/planet";

export const DeadPlanet = ({
  pixels = 100.0,
  ...props
}: {
  position?: [number, number, number];
  pixels?: number;
} & React.ComponentProps<"group">) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock: { elapsedTime }, gl, scene, camera }) => {
    if (!groupRef.current) return;

    groupRef.current.children.forEach((planet) => {
      if (planet instanceof THREE.Mesh) {
        if (planet.material.uniforms.time === undefined) return;
        planet.material.uniforms.time.value = elapsedTime;
      }
    });

    gl.render(scene, camera);
  });

  return (
    <group ref={groupRef} {...props}>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <PlanetShader pixels={pixels} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <CraterShader pixels={pixels} />
      </mesh>
    </group>
  );
};
