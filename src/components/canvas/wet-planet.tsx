"use client";

import Color from "color";
import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useRandomColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import { generateColors, getRandom } from "~/helpers/utils";
import { CloudsShader } from "~/templates/shader/clouds";
import { RiversShader } from "~/templates/shader/wet-planet";

const randomizeColors = () => {
  const seedColors = generateColors(
    Math.floor(getRandom(0.5, 1.5)) + 3,
    getRandom(0.7, 1.0),
    getRandom(0.45, 0.55),
  );

  const rivers = [];
  const clouds = [];

  for (let i = 0; i < 4; i++) {
    const newCol = seedColors[0]!.darken(i / 4.0);
    rivers.push(
      new Vector4(
        newCol.hue() + 0.2 * (i / 4.0),
        newCol.saturationv(),
        newCol.value(),
      ).setW(1),
    );
  }

  for (let i = 0; i < 2; i++) {
    const newCol = seedColors[1]!.darken(i / 2.0);
    rivers.push(
      new Vector4(
        newCol.hue() + 0.2 * (i / 2.0),
        newCol.saturationv(),
        newCol.value(),
      ).setW(1),
    );
  }

  for (let i = 0; i < 4; i++) {
    const newCol = seedColors[2]!.lighten((1.0 - i / 4.0) * 0.8);
    clouds.push(
      new Vector4(
        newCol.hue() + 0.2 * (i / 4.0),
        newCol.saturationv(),
        newCol.value(),
      ).setW(1),
    );
  }

  return { riverColors: rivers, cloudColors: clouds };
};

const randomColors = randomizeColors();

const WetPlanet = ({
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

  const riversRef = useRef<THREE.ShaderMaterial>(null);
  const cloudsRef = useRef<THREE.ShaderMaterial>(null);

  useImperativeHandle(ref, () => groupRef.current!);

  useRandomColors([
    { object: riversRef, colors: randomColors.riverColors },
    { object: cloudsRef, colors: randomColors.cloudColors },
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
