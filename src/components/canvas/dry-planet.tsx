"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useRandomColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import { generateColors, getRandom } from "~/helpers/utils";
import { DryPlanetShader } from "~/templates/shader/dry-planet";

const standardColors = [
  {
    colors: [
      new Vector4(1, 0.54, 0.2),
      new Vector4(0.9, 0.27, 0.22),
      new Vector4(0.68, 0.18, 0.27),
      new Vector4(0.32, 0.2, 0.25),
      new Vector4(0.24, 0.16, 0.1),
    ],
  },
  {
    colors: [
      new Vector4(0.25, 0.42, 0.85),
      new Vector4(0.26, 0.21, 0.61),
      new Vector4(0.26, 0.12, 0.38),
      new Vector4(0.23, 0.11, 0.2),
      new Vector4(0.15, 0.1, 0.08),
    ],
  },
  {
    colors: [
      new Vector4(0.2, 0.98, 0.82),
      new Vector4(0.28, 0.82, 0.82),
      new Vector4(0.41, 0.55, 0.63),
      new Vector4(0.41, 0.28, 0.36),
      new Vector4(0.23, 0.09, 0.12),
    ],
  },
  {
    colors: [
      new Vector4(0.99, 0.76, 0.51),
      new Vector4(0.76, 0.74, 0.28),
      new Vector4(0.5, 0.63, 0.14),
      new Vector4(0.27, 0.45, 0.08),
      new Vector4(0.1, 0.22, 0.05),
    ],
  },
  {
    colors: [
      new Vector4(1, 0.9, 0.95),
      new Vector4(0.8, 0.82, 0.83),
      new Vector4(0.57, 0.64, 0.56),
      new Vector4(0.35, 0.4, 0.27),
      new Vector4(0.15, 0.16, 0.08),
    ],
  },
];

const randomizeColors = () => {
  if (getRandom() > 0.5) {
    return standardColors[Math.floor(getRandom(0, standardColors.length))]!;
  }

  const seedColors = generateColors(
    5 + Math.floor(getRandom(0.5, 1.5)),
    getRandom(0.3, 0.65),
    1.0,
  );

  const colors = seedColors.slice(0, 5).map((color, index) => {
    const newCol = color.darken(index / 5.0).lighten((1.0 - index / 5.0) * 0.2);

    return new Vector4().fromArray(newCol.hsv().array()).setW(1);
  });

  return { colors };
};

const DryPlanet = ({
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
  const planetRef = useRef<THREE.ShaderMaterial>(null);

  const randomColors = randomizeColors();

  useImperativeHandle(ref, () => groupRef.current!);

  useRandomColors([{ object: planetRef, colors: randomColors.colors }]);

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
        <DryPlanetShader pixels={pixels} ref={planetRef} />
      </mesh>
    </group>
  );
};

export default DryPlanet;
