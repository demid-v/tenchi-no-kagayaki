"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useRandomColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import { generateColors, getRandom } from "~/helpers/utils";
import GasPlanetLayersShader from "~/templates/shader/gas-planet-layers";
import RingsShader from "~/templates/shader/rings";

const standardColors = [
  {
    colors: [
      new Vector4(0.93, 0.76, 0.6),
      new Vector4(0.85, 0.63, 0.4),
      new Vector4(0.56, 0.34, 0.23),
      new Vector4(0.4, 0.22, 0.19),
      new Vector4(0.27, 0.16, 0.24),
      new Vector4(0.13, 0.13, 0.2),
    ],
  },
  {
    colors: [
      new Vector4(0.67, 0.79, 1.09),
      new Vector4(0.81, 0.82, 1.01),
      new Vector4(0.83, 0.79, 0.88),
      new Vector4(0.72, 0.7, 0.72),
      new Vector4(0.53, 0.56, 0.52),
      new Vector4(0.28, 0.37, 0.31),
    ],
  },
  {
    colors: [
      new Vector4(0.93, 0.92, 1.1),
      new Vector4(0.71, 0.63, 0.84),
      new Vector4(0.5, 0.35, 0.54),
      new Vector4(0.3, 0.15, 0.27),
      new Vector4(0.15, 0.04, 0.09),
      new Vector4(0.04, 0, 0),
    ],
  },
  {
    colors: [
      new Vector4(0.18, 0.16, 0.25),
      new Vector4(0.3, 0.25, 0.12),
      new Vector4(0.48, 0.45, 0.18),
      new Vector4(0.59, 0.59, 0.31),
      new Vector4(0.55, 0.55, 0.4),
      new Vector4(0.37, 0.36, 0.35),
    ],
  },
  {
    colors: [
      new Vector4(0.99, 1.12, 1.11),
      new Vector4(0.67, 1.02, 0.9),
      new Vector4(0.35, 0.88, 0.65),
      new Vector4(0.13, 0.72, 0.4),
      new Vector4(0.02, 0.53, 0.2),
      new Vector4(0.01, 0.33, 0.05),
    ],
  },
  {
    colors: [
      new Vector4(0.92, 0.77, 1.14),
      new Vector4(0.93, 0.59, 0.98),
      new Vector4(0.87, 0.41, 0.76),
      new Vector4(0.73, 0.26, 0.52),
      new Vector4(0.55, 0.14, 0.29),
      new Vector4(0.33, 0.05, 0.11),
    ],
  },
];

const randomizeColors = () => {
  if (getRandom() > 0.5) {
    return standardColors[Math.floor(getRandom(0, standardColors.length))]!;
  }

  const seedColors = generateColors(
    6 + (getRandom() > 0.25 ? 1 : 0),
    getRandom(0.3, 0.55),
    1.4,
  );

  const colors = seedColors.slice(0, 6).map((color, i) => {
    const newCol = color.darken(i / 7.0).lighten((1.0 - i / 6.0) * 0.3);

    return new Vector4().fromArray(newCol.hsv().array()).setW(1);
  });

  return { colors };
};

const GasPlanetWithRings = ({
  pixels = 100.0,
  radius,
  period,
  relativeSpeed,
  eccentricity,
  orbitAngle,
  ref,
  ...props
}: {
  pixels?: number;
  radius: number;
  period: number;
  relativeSpeed: number;
  eccentricity: number;
  orbitAngle: number;
  ref?: React.RefObject<THREE.Group | null>;
} & React.ComponentProps<"group">) => {
  const groupRef = useRef<THREE.Group>(null);
  const layersRef = useRef<THREE.ShaderMaterial>(null);
  const ringsRef = useRef<THREE.ShaderMaterial>(null);

  const randomColors = randomizeColors();

  useImperativeHandle(ref, () => groupRef.current!);

  useRandomColors([
    { object: layersRef, colors: randomColors.colors },
    { object: ringsRef, colors: randomColors.colors },
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

  return (
    <group ref={groupRef} {...props} position={position}>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <GasPlanetLayersShader pixels={pixels} ref={layersRef} />
      </mesh>
      <mesh scale={[3, 3, 1]}>
        <planeGeometry args={[1, 1]} />
        <RingsShader pixels={pixels} ref={ringsRef} />
      </mesh>
    </group>
  );
};

export default GasPlanetWithRings;
