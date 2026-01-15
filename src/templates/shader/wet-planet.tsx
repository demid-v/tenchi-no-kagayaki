"use client";

import * as React from "react";
import { useMemo } from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import vertexShader from "~/templates/shader/glsl/planet.vert";
import fragmentShader from "~/templates/shader/glsl/rivers.frag";

export const RiversShader = ({
  pixels = 100,
  lightPosition = new Vector2(0.41, 0.67),
  rotation = -0.2,
  rotationSpeed = 0.1,
  ditherSize = 3.951,
  riverCutoff = 0.368,
  colors,
  lightBorder1 = 0.287,
  lightBorder2 = 0.476,
  size = 4.6,
  octaves = 6,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0,
  ref,
}: {
  pixels?: number;
  lightPosition?: Vector2;
  rotation?: number;
  rotationSpeed?: number;
  ditherSize?: number;
  riverCutoff?: number;
  colors?: Vector4[];
  lightBorder1?: number;
  lightBorder2?: number;
  size?: number;
  octaves?: number;
  seed?: number;
  time?: number;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = colors
    ? colors
    : [
        new Vector4(0.388235, 0.670588, 0.247059, 1),
        new Vector4(0.231373, 0.490196, 0.309804, 1),
        new Vector4(0.184314, 0.341176, 0.32549, 1),
        new Vector4(0.156863, 0.207843, 0.25098, 1),
        new Vector4(0.309804, 0.643137, 0.721569, 1),
        new Vector4(0.25098, 0.286275, 0.45098, 1),
      ];

  const shaderOptions = useMemo(
    () => ({
      uniforms: {
        pixels: { value: pixels },
        light_origin: { value: lightPosition },
        rotation: { value: rotation },
        time_speed: { value: rotationSpeed },
        dither_size: { value: ditherSize },
        river_cutoff: { value: riverCutoff },
        colors: { value: colorPalette },
        light_border_1: { value: lightBorder1 },
        light_border_2: { value: lightBorder2 },
        size: { value: size },
        OCTAVES: { value: octaves },
        seed: { value: seed },
        time: { value: time },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    }),
    [],
  );

  return <shaderMaterial ref={ref} {...shaderOptions} />;
};
