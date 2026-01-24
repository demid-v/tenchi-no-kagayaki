"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import useUpdatePixels from "~/helpers/use-update-pixels";
import { darken, generateColors, getRandom, lighten } from "~/helpers/utils";
import { DryPlanetShader } from "~/templates/shader/dry-planet";

const randomizeColors = () => {
  const seedColors = generateColors(
    5 + (getRandom(0, 1) < 0.5 ? 0 : 1),
    getRandom(0.3, 0.65),
    1,
  );

  const colors = seedColors.slice(0, 5).map((color, i) => {
    color = darken(color, i / 5);
    color = lighten(color, (1 - i / 5) * 0.2);

    return new Vector4(...color, 1);
  });

  return colors;
};

const DryPlanet = ({
  pixels = 100,
  colors,
  radius,
  period,
  relativeSpeed,
  eccentricity,
  orbitAngle,
  ref,
  ...props
}: {
  pixels?: number;
  colors: Vector4[];
  radius: number;
  period: number;
  relativeSpeed: number;
  eccentricity: number;
  orbitAngle: number;
  ref?: React.RefObject<THREE.Group | null>;
} & React.ComponentProps<"group">) => {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.ShaderMaterial>(null);

  useImperativeHandle(ref, () => groupRef.current!);

  useColors([{ object: planetRef, colors }]);

  useUpdate(groupRef);

  const position = useRotation(
    groupRef,
    radius,
    period,
    relativeSpeed,
    eccentricity,
    orbitAngle,
  );

  useUpdatePixels(groupRef);

  return (
    <group ref={groupRef} {...props} position={position}>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <DryPlanetShader pixels={pixels} ref={planetRef} />
      </mesh>
    </group>
  );
};

export default DryPlanet;
export { randomizeColors };
