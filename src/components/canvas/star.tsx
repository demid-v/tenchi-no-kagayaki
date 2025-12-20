"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as React from "react";
import * as THREE from "three";

import { StarShader } from "~/templates/shader/star";
import { StarBlobsShader } from "~/templates/shader/star-blobs";
import { StarFlaresShader } from "~/templates/shader/star-flares";

export const Star = ({
  pixels = 100.0,
  ...props
}: {
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
      <mesh scale={[2, 2, 1]}>
        <planeGeometry args={[1, 1]} />
        <StarBlobsShader pixels={pixels} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <StarShader pixels={pixels} />
      </mesh>
      <mesh scale={[1.7, 1.7, 1]}>
        <planeGeometry args={[1, 1]} />
        <StarFlaresShader pixels={pixels} />
      </mesh>
    </group>
  );
};
