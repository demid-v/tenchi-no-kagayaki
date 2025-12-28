"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useRandomColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import { generateColors, getRandom } from "~/helpers/utils";
import GasPlanetShader from "~/templates/shader/gas-planet";
import GasPlanetLayersShader from "~/templates/shader/gas-planet-layers";
import RingsShader from "~/templates/shader/rings";

const randomizeColors = () => {
  if (getRandom() < 0.6) return { colors: [], randomize: false };

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

  useRandomColors(randomColors.randomize, [
    { object: layersRef, colors: randomColors.colors },
    { object: ringsRef, colors: randomColors.colors },
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
        <GasPlanetLayersShader pixels={pixels} ref={layersRef} />
      </mesh>
      <mesh scale={[3, 3, 1]}>
        <planeGeometry args={[1, 1]} />
        <RingsShader ref={ringsRef} />
      </mesh>
    </group>
  );
};

export default GasPlanetWithRings;
