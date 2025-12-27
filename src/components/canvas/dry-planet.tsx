"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useRandomColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import { generateColors, getRandom } from "~/helpers/utils";
import { DryPlanetShader } from "~/templates/shader/dry-planet";

const randomizeColors = () => {
  const seedColors = generateColors(
    5 + Math.floor(getRandom(0.5, 1.5)),
    getRandom(0.3, 0.65),
    1.0,
  );

  const cols = seedColors.slice(0, 5).map((color, index) => {
    const newCol = color.darken(index / 5.0).lighten((1.0 - index / 5.0) * 0.2);

    return new Vector4().fromArray(newCol.hsv().array()).setW(1);
  });

  return cols;
};

const randomColors = randomizeColors();

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

  useImperativeHandle(ref, () => groupRef.current!);

  useRandomColors([{ object: planetRef, colors: randomColors }]);
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
        <DryPlanetShader pixels={pixels} ref={planetRef} />
      </mesh>
    </group>
  );
};

export default DryPlanet;
