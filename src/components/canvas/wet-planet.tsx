"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { CloudsShader } from "~/templates/shader/clouds";
import { Landmass } from "~/templates/shader/landmass";
import { WetPlanetShader } from "~/templates/shader/wet-planet";

export const WetPlanet = ({
  position = [0, 0, 0],
  pixels = 100.0,
}: {
  position?: [number, number, number];
  pixels?: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock: { elapsedTime }, gl, scene, camera }) => {
    if (!groupRef.current) return;

    // groupRef.current.children.forEach((planet) => {
    //   planet.lookAt(camera.position);
    // });

    groupRef.current.children.forEach((planet) => {
      if (planet instanceof THREE.Mesh) {
        if (planet.material.uniforms.time === undefined) return;
        planet.material.uniforms.time.value = elapsedTime;
      }
    });

    gl.render(scene, camera);
  });

  return (
    <group ref={groupRef} scale={[30, 30, 1]}>
      <mesh position={position}>
        <planeGeometry args={[1, 1]} />
        <WetPlanetShader pixels={pixels} />
      </mesh>
      <mesh position={position}>
        <planeGeometry args={[1, 1]} />
        <Landmass pixels={pixels} />
      </mesh>
      <mesh position={position}>
        <planeGeometry args={[1, 1]} />
        <CloudsShader pixels={pixels} />
      </mesh>
    </group>
  );
};
