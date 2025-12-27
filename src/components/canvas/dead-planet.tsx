"use client";

import { useFrame } from "@react-three/fiber";
import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useRandomColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import { generateColors, getRandom } from "~/helpers/utils";
import { CraterShader } from "~/templates/shader/crater";
import { PlanetShader } from "~/templates/shader/planet";

const randomizeColors = () => {
  const seedColors = generateColors(
    3 + Math.floor(getRandom(0.5, 1.5)),
    getRandom(0.3, 0.6),
    0.7,
  );

  const cols = seedColors.slice(0, 3).map((color, index) => {
    const newCol = color.darken(index / 3.0).lighten((1.0 - index / 3.0) * 0.2);
    return new Vector4().fromArray(newCol.lch().array()).setW(1);
  });

  const newCols = [...cols, cols[1]!, cols[2]!];

  const ground = newCols.slice(0, 3);
  const crater = newCols.slice(3, 5);

  return { ground, crater };
};

const randomColors = randomizeColors();

const DeadPlanet = ({
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

  const groundRef = useRef<THREE.ShaderMaterial>(null);
  const craterRef = useRef<THREE.ShaderMaterial>(null);

  useImperativeHandle(ref, () => groupRef.current!);

  useRandomColors([
    { object: groundRef, colors: randomColors.ground },
    { object: craterRef, colors: randomColors.crater },
  ]);

  useUpdate(groupRef);
  useRotation(
    groupRef,
    radius,
    period,
    relativeSpeed,
    eccentricity,
    orbitAngle,
  );

  return (
    <group ref={groupRef} {...props}>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <PlanetShader pixels={pixels} ref={groundRef} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <CraterShader pixels={pixels} ref={craterRef} />
      </mesh>
    </group>
  );
};

export default DeadPlanet;
