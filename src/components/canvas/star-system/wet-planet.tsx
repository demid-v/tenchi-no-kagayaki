"use client";

import Color from "color";
import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import useUpdatePixels from "~/helpers/use-update-pixels";
import { generateColors, getRandom } from "~/helpers/utils";
import { CloudsShader } from "~/templates/shader/clouds";
import { RiversShader } from "~/templates/shader/wet-planet";

const randomizeColors = () => {
  const seedColors = generateColors(
    3 + (Math.floor(getRandom(0, 2)) % 2),
    getRandom(0.7, 1),
    getRandom(0.45, 0.55),
  );

  const rivers = [];
  const clouds = [];

  for (let i = 0; i < 4; i++) {
    let newCol = seedColors[0]!.darken(i / 4.0);

    newCol = Color.hsv(
      newCol.hue() + 0.2 * (i / 4),
      newCol.saturationv(),
      newCol.value(),
    );

    rivers.push(new Vector4().fromArray(newCol.xyz().array()).setW(1));
  }

  for (let i = 0; i < 2; i++) {
    let newCol = seedColors[1]!.darken(i / 2.0);

    newCol = Color.hsv(
      newCol.hue() + 0.2 * (i / 2),
      newCol.saturationv(),
      newCol.value(),
    );

    rivers.push(new Vector4().fromArray(newCol.xyz().array()).setW(1));
  }

  for (let i = 0; i < 4; i++) {
    let newCol = seedColors[2]!.lighten((1.0 - i / 4.0) * 0.8);

    newCol = Color.hsv(
      newCol.hue() + 0.2 * (i / 4),
      newCol.saturationv(),
      newCol.value(),
    );

    clouds.push(new Vector4().fromArray(newCol.xyz().array()).setW(1));
  }

  return [...rivers, ...clouds];
};

const WetPlanet = ({
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

  const riversRef = useRef<THREE.ShaderMaterial>(null);
  const cloudsRef = useRef<THREE.ShaderMaterial>(null);

  useImperativeHandle(ref, () => groupRef.current!);

  const rivers = colors.slice(0, 6);
  const clouds = colors.slice(6, 10);

  useColors([
    { object: riversRef, colors: rivers },
    { object: cloudsRef, colors: clouds },
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
        <RiversShader ref={riversRef} pixels={pixels} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <CloudsShader ref={cloudsRef} pixels={pixels} />
      </mesh>
    </group>
  );
};

export default WetPlanet;
export { randomizeColors };
