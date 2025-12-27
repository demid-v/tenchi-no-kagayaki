"use client";

import { useFrame } from "@react-three/fiber";
import Color from "color";
import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useRandomColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
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
    newCol = Color.hsv(
      newCol.hue() + 0.2 * (i / 4.0),
      newCol.saturationv(),
      newCol.value(),
    );

    return new Vector4().fromArray(newCol.hsv().array()).setW(1);
  });

  const lavaColors = new Array(3).fill(0).map((_, i) => {
    let newCol = seedColors[1]!.darken(i / 3.0);
    newCol = Color.hsv(
      newCol.hue() + 0.2 * (i / 3.0),
      newCol.saturationv(),
      newCol.value(),
    );

    return new Vector4().fromArray(newCol.hsv().array()).setW(1);
  });

  const craterColors = [landColors[1]!, landColors[2]!];

  return { landColors, craterColors, lavaColors };
};

const randomColors = randomizeColors();

const LavaPlanet = ({
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

  const landRef = useRef<THREE.ShaderMaterial>(null);
  const craterRef = useRef<THREE.ShaderMaterial>(null);
  const lavaRef = useRef<THREE.ShaderMaterial>(null);

  useImperativeHandle(ref, () => groupRef.current!);

  useRandomColors([
    { object: landRef, colors: randomColors.landColors },
    { object: craterRef, colors: randomColors.craterColors },
    { object: lavaRef, colors: randomColors.lavaColors },
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
        <PlanetShader
          pixels={pixels}
          colors={[
            new Vector4(0.560784, 0.301961, 0.341176, 1),
            new Vector4(0.321569, 0.2, 0.247059, 1),
            new Vector4(0.239216, 0.160784, 0.211765, 1),
          ]}
          ref={landRef}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <CraterShader
          pixels={pixels}
          colors={[
            new Vector4(0.321569, 0.2, 0.247059, 1),
            new Vector4(0.239216, 0.160784, 0.211765, 1),
          ]}
          ref={craterRef}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <LavaShader pixels={pixels} ref={lavaRef} />
      </mesh>
    </group>
  );
};

export default LavaPlanet;
