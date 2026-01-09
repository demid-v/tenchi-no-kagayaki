"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import useUpdatePixels from "~/helpers/use-update-pixels";
import { generateColors, getRandom } from "~/helpers/utils";
import GasPlanetLayersShader from "~/templates/shader/gas-planet-layers";
import RingsShader from "~/templates/shader/rings";

const randomizeColors = () => {
  const seedColors = generateColors(
    6 + (getRandom() > 0.25 ? 1 : 0),
    getRandom(0.3, 0.55),
    1.4,
  );

  const colors = seedColors.slice(0, 6).map((color, i) => {
    const newCol = color.darken(i / 7.0).lighten((1.0 - i / 6.0) * 0.3);

    return new Vector4().fromArray(newCol.xyz().array()).setW(1);
  });

  return colors;
};

const GasPlanetWithRings = ({
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
  const layersRef = useRef<THREE.ShaderMaterial>(null);
  const ringsRef = useRef<THREE.ShaderMaterial>(null);

  useImperativeHandle(ref, () => groupRef.current!);

  useColors([
    { object: layersRef, colors },
    { object: ringsRef, colors },
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
export { randomizeColors };
