"use client";

import { Plane } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { Vector3 } from "three";

import fragmentShader from "~/templates/shader/glsl/stars.frag";
import vertexShader from "~/templates/shader/glsl/stars.vert";

export const Stars = () => {
  const shaderOptions = {
    uniforms: {
      time: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock: { elapsedTime }, gl, scene, camera }) => {
    if (!shaderRef.current) return;

    shaderRef.current.uniforms.time!.value = elapsedTime;

    gl.render(scene, camera);
  });

  return (
    <Suspense fallback={null}>
      <mesh>
        <Plane args={[window.innerWidth, window.innerHeight, 1, 1]}>
          <shaderMaterial {...shaderOptions} ref={shaderRef} />
        </Plane>
      </mesh>
    </Suspense>
  );
};
