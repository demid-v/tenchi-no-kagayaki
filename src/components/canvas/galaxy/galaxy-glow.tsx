"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import GalaxyGlowShader from "~/templates/shader/galaxy-glow";

const GalaxyGlow = ({
  pixels,
  colors,
  swirl,
  rotation,
  seed,
  ...props
}: {
  pixels?: number;
  colors: Vector4[];
  swirl?: number;
  rotation?: number;
  seed?: number;
} & React.ComponentProps<"group">) => {
  const groupRef = useRef<THREE.Group>(null);
  const groundRef = useRef<THREE.ShaderMaterial>(null);

  return (
    <group ref={groupRef} scale={[690, 690, 0]} {...props}>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <GalaxyGlowShader
          ref={groundRef}
          colors={colors}
          swirl={swirl}
          rotation={0}
          seed={seed}
          pixels={pixels}
        />
      </mesh>
    </group>
  );
};

export default GalaxyGlow;
