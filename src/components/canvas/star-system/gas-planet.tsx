"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useRandomColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import useUpdatePixels from "~/helpers/use-update-pixels";
import { generateColors, getRandom } from "~/helpers/utils";
import GasPlanetShader from "~/templates/shader/gas-planet";

const randomizeColors = () => {
  const seedColors = generateColors(
    8 + Math.floor(getRandom(0.5, 1.5)),
    getRandom(0.3, 0.8),
    1.0,
  );

  const cloudsColors1 = seedColors.slice(0, 4).map((color, i) => {
    const newCol = color
      .darken(i / 6.0)
      .darken(0.7)
      .lighten((1.0 - i / 4.0) * 0.2);

    return new Vector4().fromArray(newCol.xyz().array()).setW(1);
  });

  const cloudsColors2 = seedColors.slice(4, 8).map((color, i) => {
    const newCol = color.darken(i / 4.0).lighten((1.0 - i / 4.0) * 0.5);

    return new Vector4().fromArray(newCol.xyz().array()).setW(1);
  });

  return [...cloudsColors1, ...cloudsColors2];
};

const GasPlanet = ({
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
  const planetRef1 = useRef<THREE.ShaderMaterial>(null);
  const planetRef2 = useRef<THREE.ShaderMaterial>(null);

  useImperativeHandle(ref, () => groupRef.current!);

  const colors1 = colors.slice(0, 4);
  const colors2 = colors.slice(4, 8);

  useRandomColors([
    { object: planetRef1, colors: colors1 },
    { object: planetRef2, colors: colors2 },
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
        <GasPlanetShader pixels={pixels} ref={planetRef1} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <GasPlanetShader
          pixels={pixels}
          cloudCover={0.538}
          rotationSpeed={0.1}
          lightBorder1={0.439}
          lightBorder2={0.746}
          ref={planetRef2}
        />
      </mesh>
    </group>
  );
};

export default GasPlanet;
export { randomizeColors };
