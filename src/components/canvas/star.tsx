"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { StarShader } from "~/templates/shader/star";
import { StarBlobsShader } from "~/templates/shader/star-blobs";
import { StarFlaresShader } from "~/templates/shader/star-flares";

export const Star = ({
  position = [0, 0, 0],
  pixels = 100.0,
}: {
  position?: [number, number, number];
  pixels?: number;
}) => {
  const materialRef1 = useRef<THREE.ShaderMaterial>(null);
  const materialRef2 = useRef<THREE.ShaderMaterial>(null);
  const materialRef3 = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock: { elapsedTime }, gl, scene, camera }) => {
    if (
      !groupRef.current ||
      !materialRef1.current?.uniforms.time ||
      !materialRef2.current?.uniforms.time ||
      !materialRef3.current?.uniforms.time
    )
      return;

    groupRef.current.children.forEach((planet) => {
      planet.lookAt(camera.position);
    });

    materialRef1.current.uniforms.time.value = elapsedTime;
    materialRef2.current.uniforms.time.value = elapsedTime;
    materialRef3.current.uniforms.time.value = elapsedTime;

    gl.render(scene, camera);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh scale={[2.3, 2.3, 1]}>
        <planeGeometry args={[1, 1]} />
        <StarBlobsShader ref={materialRef1} pixels={pixels} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <StarShader ref={materialRef2} pixels={pixels} />
      </mesh>
      <mesh scale={[1.8, 1.8, 1]}>
        <planeGeometry args={[1, 1]} />
        <StarFlaresShader ref={materialRef3} pixels={pixels} />
      </mesh>
    </group>
  );
};
