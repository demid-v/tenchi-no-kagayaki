"use client";

import Color from "color";
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
import LavaShader from "~/templates/shader/lava";
import { PlanetShader } from "~/templates/shader/planet";

const randomizeColors = () => {
  const seedColors = generateColors(
    3 + Math.floor(getRandom(0.5, 1.5)),
    getRandom(0.6, 1.0),
    getRandom(0.7, 0.8),
  );

  const landColors = new Array(3).fill(0).map((_, i) => {
    let newCol = seedColors[0]!.darken(i / 3.0);
    newCol = Color.xyz(newCol.x() + 0.2 * (i / 4.0), newCol.y(), newCol.z());

    return new Vector4().fromArray(newCol.xyz().array()).setW(1);
  });

  const lavaColors = new Array(3).fill(0).map((_, i) => {
    let newCol = seedColors[1]!.darken(i / 3.0);
    newCol = Color.xyz(newCol.x() + 0.2 * (i / 3.0), newCol.y(), newCol.z());

    return new Vector4().fromArray(newCol.xyz().array()).setW(1);
  });

  const craterColors = [landColors[1]!, landColors[2]!];

  return { landColors, craterColors, lavaColors };
};

const LavaPlanet = ({
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

  const landRef = useRef<THREE.ShaderMaterial>(null);
  const craterRef = useRef<THREE.ShaderMaterial>(null);
  const lavaRef = useRef<THREE.ShaderMaterial>(null);

  const [shuffle] = useAtom(shuffleAtom);

  const randomColors = useMemo(randomizeColors, [shuffle]);

  useImperativeHandle(ref, () => groupRef.current!);

  useRandomColors([
    { object: landRef, colors: randomColors.landColors },
    { object: craterRef, colors: randomColors.craterColors },
    { object: lavaRef, colors: randomColors.lavaColors },
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
        <PlanetShader pixels={pixels} ref={landRef} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <CraterShader pixels={pixels} ref={craterRef} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <LavaShader pixels={pixels} ref={lavaRef} />
      </mesh>
    </group>
  );
};

export default LavaPlanet;
