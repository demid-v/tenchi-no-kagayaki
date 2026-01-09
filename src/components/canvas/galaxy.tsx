"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useRandomColors from "~/helpers/use-random-colors";
import useUpdate from "~/helpers/use-update";
import useUpdatePixels from "~/helpers/use-update-pixels";
import { generateColors, getRandom } from "~/helpers/utils";
import GalaxyShader from "~/templates/shader/galaxy";

const randomizeColors = () => {
  const seedColors = generateColors(
    3 + Math.floor(getRandom(0.5, 1.5)),
    getRandom(0.3, 0.6),
    0.7,
  );

  const cols = seedColors.slice(0, 3).map((color, index) => {
    const newCol = color.darken(index / 3.0).lighten((1.0 - index / 3.0) * 0.2);
    return new Vector4().fromArray(newCol.xyz().array()).setW(1);
  });

  const newCols = [...cols, cols[1]!, cols[2]!];

  return newCols;
};

const Galaxy = ({
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
  radius?: number;
  period?: number;
  relativeSpeed?: number;
  eccentricity?: number;
  orbitAngle?: number;
  ref?: React.RefObject<THREE.Group | null>;
} & React.ComponentProps<"group">) => {
  const groupRef = useRef<THREE.Group>(null);

  const groundRef = useRef<THREE.ShaderMaterial>(null);
  const cratersRef = useRef<THREE.ShaderMaterial>(null);

  useImperativeHandle(ref, () => groupRef.current!);

  const ground = colors.slice(0, 3);
  const craters = colors.slice(3, 5);

  useRandomColors([
    { object: groundRef, colors: ground },
    { object: cratersRef, colors: craters },
  ]);

  useUpdate(groupRef);

  useUpdatePixels(groupRef);

  return (
    <group ref={groupRef} {...props}>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <GalaxyShader ref={groundRef} pixels={pixels} />
      </mesh>
    </group>
  );
};

export default Galaxy;
export { randomizeColors };
