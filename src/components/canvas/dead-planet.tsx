"use client";

import { useFrame } from "@react-three/fiber";
import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";

import { useRotation } from "~/helpers/use-rotation";
import { useUpdate } from "~/helpers/use-update";
import { CraterShader } from "~/templates/shader/crater";
import { PlanetShader } from "~/templates/shader/planet";

export const DeadPlanet = ({
  pixels = 100.0,
  position,
  ref,
  ...props
}: {
  pixels?: number;
  ref?: React.RefObject<THREE.Group | null>;
} & React.ComponentProps<"group">) => {
  const groupRef = useRef<THREE.Group>(null);

  useImperativeHandle(ref, () => groupRef.current!);

  useUpdate(groupRef);
  useRotation(groupRef, position);

  return (
    <group ref={groupRef} position={position} {...props}>
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
