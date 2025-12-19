"use client";

import { useFrame } from "@react-three/fiber";
import Color from "color";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { Vector3, Vector4 } from "three";

import { getRandom } from "~/helpers/utils";
import { CloudsShader } from "~/templates/shader/clouds";
import { RiversShader } from "~/templates/shader/wet-planet";

const generateColors = (
  numberOfColors = 4,
  hue_diff = 0.9,
  saturation = 0.5,
) => {
  const a = new Vector3(0.5, 0.5, 0.5);
  const b = new Vector3(0.5, 0.5, 0.5).multiplyScalar(saturation);
  const c = new Vector3(
    getRandom(0.5, 1.5),
    getRandom(0.5, 1.5),
    getRandom(0.5, 1.5),
  ).multiplyScalar(hue_diff);
  const d = new Vector3(
    getRandom(0.0, 1.0),
    getRandom(0.0, 1.0),
    getRandom(0.0, 1.0),
  ).multiplyScalar(getRandom(1.0, 3.0));

  const cols = [];
  for (let i = 0; i < numberOfColors; i++) {
    cols.push(
      Color.rgb(
        a.x + b.x * Math.cos(6.28318 * (c.x * (i / numberOfColors) + d.x)),
        a.y + b.y * Math.cos(6.28318 * (c.y * (i / numberOfColors) + d.y)),
        a.z + b.z * Math.cos(6.28318 * (c.z * (i / numberOfColors) + d.z)),
      ),
    );
  }

  return cols;
};

const randomizeColors = () => {
  const seed_colors = generateColors(
    Math.floor(getRandom(0.5, 1.5)) + 3,
    getRandom(0.7, 1.0),
    getRandom(0.45, 0.55),
  );
  const river_colors = [];
  const cloud_colors = [];

  for (let i = 0; i < 4; i++) {
    const new_col = seed_colors[0]!.darken(i / 4.0);
    river_colors.push(
      new Vector4()
        .fromArray(
          Color.rgb(
            new_col.red() + 0.2 * (i / 4.0),
            new_col.green(),
            new_col.blue(),
          ).array(),
        )
        .setW(1),
    );
  }

  for (let i = 0; i < 2; i++) {
    const new_col = seed_colors[1]!.darken(i / 2.0);
    river_colors.push(
      new Vector4()
        .fromArray(
          Color.rgb(
            new_col.red() + 0.2 * (i / 2.0),
            new_col.green(),
            new_col.blue(),
          ).array(),
        )
        .setW(1),
    );
  }

  for (let i = 0; i < 4; i++) {
    const new_col = seed_colors[2]!.lighten((1.0 - i / 4.0) * 0.8);
    cloud_colors.push(
      new Vector4()
        .fromArray(
          Color.rgb(
            new_col.red() + 0.2 * (i / 4.0),
            new_col.green(),
            new_col.blue(),
          ).array(),
        )
        .setW(1),
    );
  }

  return { river_colors, cloud_colors };
};

const randomColors = randomizeColors();

export const WetPlanet = ({
  position = [0, 0, 0],
  pixels = 100.0,
}: {
  position?: [number, number, number];
  pixels?: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const riversRef = useRef<THREE.ShaderMaterial>(null);
  const cloudsRef = useRef<THREE.ShaderMaterial>(null);

  // useLayoutEffect(() => {
  //   if (!riversRef.current || !cloudsRef.current) return;

  //   riversRef.current.uniforms.colors!.value = randomColors.river_colors;
  //   cloudsRef.current.uniforms.colors!.value = randomColors.cloud_colors;
  // });

  useFrame(({ clock: { elapsedTime }, gl, scene, camera }) => {
    if (!groupRef.current) return;

    groupRef.current.children.forEach((planet) => {
      if (planet instanceof THREE.Mesh) {
        if (planet.material.uniforms.time === undefined) return;
        planet.material.uniforms.time.value = elapsedTime;
      }
    });

    gl.render(scene, camera);
  });

  return (
    <group ref={groupRef} scale={[300, 300, 1]}>
      <mesh position={position}>
        <planeGeometry args={[1, 1]} />
        <RiversShader ref={riversRef} pixels={pixels} />
      </mesh>
      <mesh position={position}>
        <planeGeometry args={[1, 1]} />
        <CloudsShader ref={cloudsRef} pixels={pixels} />
      </mesh>
    </group>
  );
};
