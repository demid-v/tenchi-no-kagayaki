"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import useUpdatePixels from "~/helpers/use-update-pixels";
import { generateColors, getRandom } from "~/helpers/utils";
import { CloudsShader } from "~/templates/shader/clouds";
import { RiversShader } from "~/templates/shader/wet-planet";

const randomizeColors = () => {
  const seedColors = generateColors(
    3 + (Math.floor(getRandom(0, 2)) % 2),
    getRandom(0.7, 1),
    getRandom(0.45, 0.55),
  );

  const landColors = new Array(4).fill(0).map((_, i) => {
    const newColor = seedColors[0]!.offsetHSL(0.2 * (i / 4), 0, -(i / 4));
    return new Vector4(...newColor.toArray(), 1);
  });

  const riverColors = new Array(2).fill(0).map((_, i) => {
    const newColor = seedColors[1]!.offsetHSL(0.2 * (i / 2), 0, -(i / 2));
    return new Vector4(...newColor.toArray(), 1);
  });

  const cloudColors = new Array(4).fill(0).map((_, i) => {
    const newColor = seedColors[2]!.offsetHSL(
      0.2 * (i / 4),
      0,
      (1 - i / 4) * 0.8,
    );

    return new Vector4(...newColor.toArray(), 1);
  });

  return [...landColors, ...riverColors, ...cloudColors];
};

const WetPlanet = ({
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

  const riversRef = useRef<THREE.ShaderMaterial>(null);
  const cloudsRef = useRef<THREE.ShaderMaterial>(null);

  useImperativeHandle(ref, () => groupRef.current!);

  const rivers = colors.slice(0, 6);
  const clouds = colors.slice(6, 10);

  useColors([
    { object: riversRef, colors: rivers },
    { object: cloudsRef, colors: clouds },
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
        <RiversShader ref={riversRef} pixels={pixels} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <CloudsShader ref={cloudsRef} pixels={pixels} />
      </mesh>
    </group>
  );
};

export default WetPlanet;
export { randomizeColors };
