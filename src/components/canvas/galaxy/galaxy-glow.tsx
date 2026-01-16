"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import GalaxyGlowShader from "~/templates/shader/galaxy-glow";

const GalaxyGlow = ({
  radius,
  pixels,
  colors,
  swirl,
  rotation,
  tilt,
  seed,
  ...props
}: {
  radius: number;
  pixels?: number;
  colors: Vector4[];
  swirl?: number;
  rotation?: number;
  tilt?: number;
  seed?: number;
} & React.ComponentProps<"group">) => {
  const groupRef = useRef<THREE.Group>(null);
  const groundRef = useRef<THREE.ShaderMaterial>(null);

  return (
    <group ref={groupRef} scale={[radius, radius, 0]} {...props}>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <GalaxyGlowShader
          ref={groundRef}
          colors={colors}
          swirl={swirl}
          rotation={rotation}
          tilt={tilt}
          seed={seed}
          pixels={pixels}
        />
      </mesh>
    </group>
  );
};

export default GalaxyGlow;
