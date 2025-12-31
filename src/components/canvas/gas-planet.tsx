"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useRandomColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import { generateColors, getRandom } from "~/helpers/utils";
import GasPlanetShader from "~/templates/shader/gas-planet";

const standardColors = [
  {
    cloudsColors1: [
      new Vector4(0.23, 0.13, 0.15),
      new Vector4(0.23, 0.13, 0.15),
      new Vector4(0, 0, 0),
      new Vector4(0.13, 0.09, 0.11),
    ],
    cloudsColors2: [
      new Vector4(0.94, 0.71, 0.25),
      new Vector4(0.81, 0.46, 0.17),
      new Vector4(0.67, 0.32, 0.19),
      new Vector4(0.49, 0.22, 0.2),
    ],
  },
  {
    cloudsColors1: [
      new Vector4(0.14, 0.01, 0.14),
      new Vector4(0.15, 0.06, 0.19),
      new Vector4(0.15, 0.11, 0.19),
      new Vector4(0.13, 0.12, 0.15),
    ],
    cloudsColors2: [
      new Vector4(0.98, 0.99, 0.92),
      new Vector4(0.84, 0.83, 0.65),
      new Vector4(0.62, 0.55, 0.36),
      new Vector4(0.33, 0.24, 0.14),
    ],
  },
  {
    cloudsColors1: [
      new Vector4(0.08, 0.22, 0.3),
      new Vector4(0.11, 0.2, 0.25),
      new Vector4(0.13, 0.18, 0.19),
      new Vector4(0.12, 0.14, 0.13),
    ],
    cloudsColors2: [
      new Vector4(0.96, 0.99, 0.87),
      new Vector4(0.84, 0.84, 0.65),
      new Vector4(0.62, 0.62, 0.4),
      new Vector4(0.33, 0.33, 0.18),
    ],
  },
  {
    cloudsColors1: [
      new Vector4(0.04, 0.07, 0.24),
      new Vector4(0, 0, 0.22),
      new Vector4(0.01, 0.01, 0.19),
      new Vector4(0.03, 0.05, 0.15),
    ],
    cloudsColors2: [
      new Vector4(0.7, 0.83, 0.99),
      new Vector4(0.69, 0.82, 0.8),
      new Vector4(0.58, 0.62, 0.55),
      new Vector4(0.34, 0.3, 0.27),
    ],
  },
  {
    cloudsColors1: [
      new Vector4(0.02, 0.09, 0.22),
      new Vector4(0, 0.05, 0.14),
      new Vector4(0.03, 0.02, 0.07),
      new Vector4(0.07, 0, 0.03),
    ],
    cloudsColors2: [
      new Vector4(0.88, 0.5, 0.53),
      new Vector4(0.83, 0.38, 0.38),
      new Vector4(0.61, 0.27, 0.26),
      new Vector4(0.29, 0.16, 0.15),
    ],
  },
  {
    cloudsColors1: [
      new Vector4(0.3, 0.05, 0.18),
      new Vector4(0.24, 0.02, 0.18),
      new Vector4(0.18, 0.01, 0.17),
      new Vector4(0.12, 0, 0.14),
    ],
    cloudsColors2: [
      new Vector4(0.86, 0.5, 0.99),
      new Vector4(0.65, 0.38, 0.84),
      new Vector4(0.43, 0.27, 0.62),
      new Vector4(0.2, 0.15, 0.33),
    ],
  },
];

const randomizeColors = () => {
  if (getRandom() > 0.5) {
    return standardColors[Math.floor(getRandom(0, standardColors.length))]!;
  }

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

    return new Vector4().fromArray(newCol.hsv().array()).setW(1);
  });

  const cloudsColors2 = seedColors.slice(4, 8).map((color, i) => {
    const newCol = color.darken(i / 4.0).lighten((1.0 - i / 4.0) * 0.5);

    return new Vector4().fromArray(newCol.hsv().array()).setW(1);
  });

  return { cloudsColors1, cloudsColors2 };
};

const GasPlanet = ({
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
  const planetRef1 = useRef<THREE.ShaderMaterial>(null);
  const planetRef2 = useRef<THREE.ShaderMaterial>(null);

  const randomColors = randomizeColors();

  useImperativeHandle(ref, () => groupRef.current!);

  useRandomColors([
    { object: planetRef1, colors: randomColors.cloudsColors1 },
    { object: planetRef2, colors: randomColors.cloudsColors2 },
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
