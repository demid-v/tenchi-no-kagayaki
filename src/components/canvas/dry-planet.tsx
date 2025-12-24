"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";

import { useRotation } from "~/helpers/use-rotation";
import { useUpdate } from "~/helpers/use-update";
import { DryPlanetShader } from "~/templates/shader/dry-planet";

export const DryPlanet = ({
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
        <DryPlanetShader pixels={pixels} />
      </mesh>
    </group>
  );
};
