"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useRandomColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import { generateColors, getRandom } from "~/helpers/utils";
import { CloudsShader } from "~/templates/shader/clouds";
import { RiversShader } from "~/templates/shader/wet-planet";

const standardColors = [
  {
    rivers: [
      new Vector4(0.388235, 0.670588, 0.247059, 1),
      new Vector4(0.231373, 0.490196, 0.309804, 1),
      new Vector4(0.184314, 0.341176, 0.32549, 1),
      new Vector4(0.156863, 0.207843, 0.25098, 1),
      new Vector4(0.309804, 0.643137, 0.721569, 1),
      new Vector4(0.25098, 0.286275, 0.45098, 1),
    ],
    clouds: [
      new Vector4(0.882353, 0.94902, 1, 1),
      new Vector4(0.752941, 0.890196, 1, 1),
      new Vector4(0.368627, 0.439216, 0.647059, 1),
      new Vector4(0.25098, 0.286275, 0.45098, 1),
    ],
  },
  {
    rivers: [
      new Vector4(0.28, 0.7, 0.25),
      new Vector4(0.18, 0.52, 0.26),
      new Vector4(0.12, 0.35, 0.24),
      new Vector4(0.06, 0.17, 0.15),
      new Vector4(0.65, 0.6, 0.5),
      new Vector4(0.3, 0.32, 0.25),
    ],
    clouds: [
      new Vector4(0.95, 0.85, 0.95),
      new Vector4(0.9, 0.69, 0.85),
      new Vector4(0.85, 0.54, 0.68),
      new Vector4(0.8, 0.39, 0.45),
    ],
  },
  {
    rivers: [
      new Vector4(0.32, 0.26, 0.69),
      new Vector4(0.34, 0.2, 0.52),
      new Vector4(0.29, 0.13, 0.35),
      new Vector4(0.17, 0.07, 0.17),
      new Vector4(0.74, 0.72, 0.34),
      new Vector4(0.26, 0.37, 0.17),
    ],
    clouds: [
      new Vector4(0.86, 0.87, 0.92),
      new Vector4(0.75, 0.73, 0.85),
      new Vector4(0.68, 0.59, 0.77),
      new Vector4(0.65, 0.45, 0.7),
    ],
  },
  {
    rivers: [
      new Vector4(0.73, 0.77, 0.77),
      new Vector4(0.55, 0.57, 0.58),
      new Vector4(0.37, 0.38, 0.39),
      new Vector4(0.18, 0.19, 0.19),
      new Vector4(0.24, 0.25, 0.32),
      new Vector4(0.14, 0.12, 0.16),
    ],
    clouds: [
      new Vector4(0.93, 0.93, 0.9),
      new Vector4(0.83, 0.87, 0.81),
      new Vector4(0.73, 0.8, 0.71),
      new Vector4(0.65, 0.73, 0.64),
    ],
  },
  {
    rivers: [
      new Vector4(0.37, 0.54, 0.6),
      new Vector4(0.28, 0.35, 0.45),
      new Vector4(0.19, 0.2, 0.3),
      new Vector4(0.1, 0.09, 0.15),
      new Vector4(0.73, 0.57, 0.5),
      new Vector4(0.36, 0.36, 0.25),
    ],
    clouds: [
      new Vector4(0.86, 0.87, 0.88),
      new Vector4(0.73, 0.72, 0.76),
      new Vector4(0.61, 0.59, 0.64),
      new Vector4(0.5, 0.45, 0.52),
    ],
  },
  {
    rivers: [
      new Vector4(0.77, 0.77, 0.25),
      new Vector4(0.46, 0.58, 0.19),
      new Vector4(0.23, 0.39, 0.12),
      new Vector4(0.08, 0.19, 0.06),
      new Vector4(0.3, 0.5, 0.54),
      new Vector4(0.15, 0.18, 0.27),
    ],
    clouds: [
      new Vector4(0.9, 0.85, 0.94),
      new Vector4(0.86, 0.69, 0.89),
      new Vector4(0.83, 0.54, 0.77),
      new Vector4(0.77, 0.38, 0.58),
    ],
  },
  {
    rivers: [
      new Vector4(0.37, 0.35, 0.55),
      new Vector4(0.32, 0.26, 0.41),
      new Vector4(0.24, 0.18, 0.28),
      new Vector4(0.14, 0.09, 0.14),
      new Vector4(0.65, 0.74, 0.36),
      new Vector4(0.21, 0.37, 0.18),
    ],
    clouds: [
      new Vector4(0.87, 0.85, 0.94),
      new Vector4(0.79, 0.7, 0.88),
      new Vector4(0.76, 0.55, 0.82),
      new Vector4(0.76, 0.4, 0.73),
    ],
  },
  {
    rivers: [
      new Vector4(0.37, 0.66, 0.66),
      new Vector4(0.28, 0.43, 0.5),
      new Vector4(0.18, 0.24, 0.33),
      new Vector4(0.09, 0.1, 0.17),
      new Vector4(0.55, 0.31, 0.35),
      new Vector4(0.28, 0.2, 0.15),
    ],
    clouds: [
      new Vector4(0.91, 0.94, 0.85),
      new Vector4(0.76, 0.89, 0.71),
      new Vector4(0.56, 0.83, 0.57),
      new Vector4(0.42, 0.78, 0.53),
    ],
  },
];

const randomizeColors = () => {
  if (getRandom() > 0.3) {
    return standardColors[Math.floor(getRandom(0, standardColors.length))]!;
  }

  const seedColors = generateColors(
    3 + (Math.floor(getRandom(0, 2)) % 2),
    getRandom(0.7, 1),
    getRandom(0.45, 0.55),
  );

  const rivers = [];
  const clouds = [];

  for (let i = 0; i < 4; i++) {
    const newCol = seedColors[0]!.darken(i / 4.0);
    rivers.push(
      new Vector4(
        newCol.hue() + 0.2 * (i / 4),
        newCol.saturationv(),
        newCol.value(),
      ).setW(1),
    );
  }

  for (let i = 0; i < 2; i++) {
    const newCol = seedColors[1]!.darken(i / 2.0);
    rivers.push(
      new Vector4(
        newCol.hue() + 0.2 * (i / 2),
        newCol.saturationv(),
        newCol.value(),
      ).setW(1),
    );
  }

  for (let i = 0; i < 4; i++) {
    const newCol = seedColors[2]!.lighten((1.0 - i / 4.0) * 0.8);
    clouds.push(
      new Vector4(
        newCol.hue() + 0.2 * (i / 4),
        newCol.saturationv(),
        newCol.value(),
      ).setW(1),
    );
  }

  return { rivers, clouds };
};

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

  const randomColors = randomizeColors();

  useImperativeHandle(ref, () => groupRef.current!);

  useRandomColors([
    { object: riversRef, colors: randomColors.rivers },
    { object: cloudsRef, colors: randomColors.clouds },
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
