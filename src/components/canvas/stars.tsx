"use client";

import { Plane } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

import useUpdate from "~/helpers/use-update";
import fragmentShader from "~/templates/shader/glsl/stars.frag";
import vertexShader from "~/templates/shader/glsl/stars.vert";

export const Stars = () => {
  const starsRef = useRef<THREE.Mesh>(null);

  const shaderOptions = {
    uniforms: {
      time: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  useUpdate(starsRef);

  return (
    <Suspense fallback={null}>
      <mesh ref={starsRef} position={[0, 0, 1000]}>
        <Plane args={[window.innerWidth, window.innerHeight, 1, 1]}>
          <shaderMaterial {...shaderOptions} ref={shaderRef} />
        </Plane>
      </mesh>
    </Suspense>
  );
};
