"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import useUpdatePixels from "~/helpers/use-update-pixels";
import { darken, generateColors, getRandom } from "~/helpers/utils";
import { CraterShader } from "~/templates/shader/crater";
import LavaShader from "~/templates/shader/lava";
import { PlanetShader } from "~/templates/shader/planet";

const randomizeColors = () => {
  const seedColors = generateColors(
    3 + Math.floor(getRandom(0.5, 1.5)),
    getRandom(0.6, 1),
    getRandom(0.7, 0.8),
  );

  const landColors = new Array(3).fill(0).map((_, i) => {
    const color = darken(seedColors[0]!, -(i / 3)).offsetHSL(
      0.2 * (i / 4),
      0,
      0,
    );

    return new Vector4(...color, 1);
  });

  const lavaColors = new Array(3).fill(0).map((_, i) => {
    const color = darken(seedColors[1]!, -(i / 3)).offsetHSL(
      0.2 * (i / 3),
      0,
      0,
    );

    return new Vector4(...color, 1);
  });

  const craterColors = [landColors[1]!, landColors[2]!];

  return [...landColors, ...craterColors, ...lavaColors];
};

const LavaPlanet = ({
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

  const landRef = useRef<THREE.ShaderMaterial>(null);
  const craterRef = useRef<THREE.ShaderMaterial>(null);
  const lavaRef = useRef<THREE.ShaderMaterial>(null);

  useImperativeHandle(ref, () => groupRef.current!);

  const landColors = colors.slice(0, 3);
  const craterColors = colors.slice(3, 5);
  const lavaColors = colors.slice(5, 8);

  useColors([
    { object: landRef, colors: landColors },
    { object: craterRef, colors: craterColors },
    { object: lavaRef, colors: lavaColors },
  ]);

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
        <PlanetShader pixels={pixels} ref={landRef} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <CraterShader pixels={pixels} ref={craterRef} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <LavaShader pixels={pixels} ref={lavaRef} />
      </mesh>
    </group>
  );
};

export default LavaPlanet;
export { randomizeColors };
