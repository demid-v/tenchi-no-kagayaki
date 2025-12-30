"use client";

import { useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { Vector4 } from "three";

import useRandomColors from "~/helpers/use-random-colors";
import useRotation from "~/helpers/use-rotation";
import useUpdate from "~/helpers/use-update";
import { generateColors, getRandom } from "~/helpers/utils";
import GasPlanetShader from "~/templates/shader/gas-planet";

const randomizeColors = () => {
  // if (getRandom() < 0.6) {
  //   return { cloudsColors1: [], cloudsColors2: [], randomize: false };
  // }

  const seedColors = generateColors(
    8 + Math.floor(getRandom(0.5, 1.5)),
    getRandom(0.3, 0.8),
    1.0,
  );

  const cloudsColors1 = seedColors.slice(0, 4).map((color, i) => {
    const newCol = color
      .darken(i / 6.0)
      .darken(0.7)
      .lighten((1.0 - i / 4.0) * 0.2);

    return new Vector4().fromArray(newCol.hsv().array()).setW(1);
  });

  const cloudsColors2 = seedColors.slice(4, 8).map((color, i) => {
    const newCol = color.darken(i / 4.0).lighten((1.0 - i / 4.0) * 0.5);

    return new Vector4().fromArray(newCol.hsv().array()).setW(1);
  });

  return { cloudsColors1, cloudsColors2 };
};

const GasPlanet = ({
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
  const planetRef1 = useRef<THREE.ShaderMaterial>(null);
  const planetRef2 = useRef<THREE.ShaderMaterial>(null);

  const randomColors = randomizeColors();

  useImperativeHandle(ref, () => groupRef.current!);

  useRandomColors([
    { object: planetRef1, colors: randomColors.cloudsColors1 },
    { object: planetRef2, colors: randomColors.cloudsColors2 },
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
        <GasPlanetShader pixels={pixels} ref={planetRef1} />
      </mesh>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <GasPlanetShader
          pixels={pixels}
          cloudCover={0.538}
          rotationSpeed={0.1}
          lightBorder1={0.439}
          lightBorder2={0.746}
          colors={[
            new Vector4(0.941176, 0.709804, 0.254902, 1),
            new Vector4(0.811765, 0.458824, 0.168627, 1),
            new Vector4(0.670588, 0.317647, 0.188235, 1),
            new Vector4(0.490196, 0.219608, 0.2, 1),
          ]}
          ref={planetRef2}
        />
      </mesh>
    </group>
  );
};

export default GasPlanet;
