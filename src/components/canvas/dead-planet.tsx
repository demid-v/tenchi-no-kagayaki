"use client";

import { useAtom } from "jotai";
import { useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import { shuffleAtom } from "~/helpers/store";
import useRandomColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import useUpdatePixels from "~/helpers/use-update-pixels";
import { generateColors, getRandom } from "~/helpers/utils";
import { CraterShader } from "~/templates/shader/crater";
import { PlanetShader } from "~/templates/shader/planet";

const standardColors = [
  {
    ground: [
      new Vector4(0.61, 0.62, 0.72),
      new Vector4(0.28, 0.38, 0.49),
      new Vector4(0.21, 0.22, 0.33),
    ],
    craters: [new Vector4(0.28, 0.38, 0.49), new Vector4(0.21, 0.22, 0.33)],
  },
  {
    ground: [
      new Vector4(0.5, 0.49, 0.7),
      new Vector4(0.23, 0.23, 0.35),
      new Vector4(0.13, 0.13, 0.13),
    ],
    craters: [new Vector4(0.23, 0.23, 0.35), new Vector4(0.13, 0.13, 0.13)],
  },
  {
    ground: [
      new Vector4(0.44, 0.71, 0.79),
      new Vector4(0.23, 0.28, 0.41),
      new Vector4(0.12, 0.12, 0.14),
    ],
    craters: [new Vector4(0.23, 0.28, 0.41), new Vector4(0.12, 0.12, 0.14)],
  },
  {
    ground: [
      new Vector4(0.56, 0.72, 0.7),
      new Vector4(0.62, 0.61, 0.32),
      new Vector4(0.19, 0.33, 0.11),
    ],
    craters: [new Vector4(0.62, 0.61, 0.32), new Vector4(0.19, 0.33, 0.11)],
  },
  {
    ground: [
      new Vector4(0.62, 0.86, 0.72),
      new Vector4(0.59, 0.41, 0.35),
      new Vector4(0.33, 0.12, 0.12),
    ],
    craters: [new Vector4(0.59, 0.41, 0.35), new Vector4(0.33, 0.12, 0.12)],
  },
  {
    ground: [
      new Vector4(0.86, 0.86, 0.79),
      new Vector4(0.32, 0.37, 0.44),
      new Vector4(0.14, 0.12, 0.16),
    ],
    craters: [new Vector4(0.32, 0.37, 0.44), new Vector4(0.14, 0.12, 0.16)],
  },
];

const randomizeColors = () => {
  if (getRandom() > 0.5) {
    return standardColors[Math.floor(getRandom(0, standardColors.length))]!;
  }

  const seedColors = generateColors(
    3 + Math.floor(getRandom(0.5, 1.5)),
    getRandom(0.3, 0.6),
    0.7,
  );

  const cols = seedColors.slice(0, 3).map((color, index) => {
    const newCol = color.darken(index / 3.0).lighten((1.0 - index / 3.0) * 0.2);
    return new Vector4().fromArray(newCol.hsv().array()).setW(1);
  });

  const newCols = [...cols, cols[1]!, cols[2]!];

  const ground = newCols.slice(0, 3);
  const craters = newCols.slice(3, 5);

  return { ground, craters };
};

const DeadPlanet = ({
  pixels = 100,
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

  const groundRef = useRef<THREE.ShaderMaterial>(null);
  const cratersRef = useRef<THREE.ShaderMaterial>(null);

  const [shuffle] = useAtom(shuffleAtom);

  const randomColors = useMemo(randomizeColors, [shuffle]);

  useImperativeHandle(ref, () => groupRef.current!);

  useRandomColors([
    { object: groundRef, colors: randomColors.ground },
    { object: cratersRef, colors: randomColors.craters },
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
        <PlanetShader pixels={pixels} ref={groundRef} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <CraterShader pixels={pixels} ref={cratersRef} />
      </mesh>
    </group>
  );
};

export default DeadPlanet;
